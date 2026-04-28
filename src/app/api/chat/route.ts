import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { sessions, messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { streamChat } from '@/lib/ai/openai'
import { createSSEStream, createSSEResponse } from '@/lib/ai/stream'
import { getSystemPrompt } from '@/lib/prompts'
import { extractStructuredData } from '@/lib/parsers/extractStructured'
import { generateId, nowISO, createErrorResponse, AppError } from '@/lib/utils'
import type { ChatMode, BasicInfo } from '@/types/chat'

/** POST /api/chat - 流式对话 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, content, mode } = body as {
      sessionId: string
      content: string
      mode?: ChatMode
    }

    if (!sessionId || !content) {
      return createErrorResponse(new AppError('BAD_REQUEST', '缺少 sessionId 或 content'))
    }

    // 获取会话信息
    const sessionRows = await db.select().from(sessions).where(eq(sessions.id, sessionId))
    if (sessionRows.length === 0) {
      return createErrorResponse(new AppError('NOT_FOUND', '会话不存在'))
    }
    const session = sessionRows[0]!
    const chatMode = (mode || session.mode) as ChatMode

    // 解析基础信息
    let basicInfo: BasicInfo | undefined
    if (session.basicInfo) {
      try {
        basicInfo = JSON.parse(session.basicInfo)
      } catch {
        // ignore parse error
      }
    }

    // 保存用户消息
    const userMsgId = generateId()
    await db.insert(messages).values({
      id: userMsgId,
      sessionId,
      role: 'user',
      content,
      mode: chatMode,
      createdAt: nowISO(),
    })

    // 获取历史消息
    const history = await db.select().from(messages).where(eq(messages.sessionId, sessionId))
    const chatHistory = history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    // 获取系统提示词
    const systemPrompt = getSystemPrompt(chatMode, { basicInfo })

    // 创建 SSE 流
    const { stream: sseStream, sendMessage, sendStructured, sendError, sendDone } = createSSEStream()

    // 异步处理 AI 流式响应
    ;(async () => {
      try {
        const aiStream = await streamChat({
          systemPrompt,
          messages: chatHistory,
        })

        let fullContent = ''

        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content
          if (delta) {
            fullContent += delta
            sendMessage(delta)
          }
        }

        // 提取结构化数据
        const { structured } = extractStructuredData(fullContent)

        // 保存 AI 回复
        const assistantMsgId = generateId()
        await db.insert(messages).values({
          id: assistantMsgId,
          sessionId,
          role: 'assistant',
          content: fullContent,
          mode: chatMode,
          structuredData: structured.length > 0 ? JSON.stringify(structured) : null,
          createdAt: nowISO(),
        })

        // 更新会话时间
        await db.update(sessions).set({ updatedAt: nowISO() }).where(eq(sessions.id, sessionId))

        // 发送结构化数据
        for (const item of structured) {
          sendStructured(item.type, item.data)
        }

        sendDone()
      } catch (err) {
        console.error('[Chat] AI 流式响应失败:', err)
        sendError('AI 服务暂时不可用，请稍后重试')
      }
    })()

    return createSSEResponse(sseStream)
  } catch (err) {
    console.error('[Chat] 对话请求失败:', err)
    return createErrorResponse(new AppError('INTERNAL', '对话请求处理失败'))
  }
}
