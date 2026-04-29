import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { sessions, messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { streamChat } from '@/lib/ai/openai'
import { createSSEStream, createSSEResponse } from '@/lib/ai/stream'
import { getSystemPrompt } from '@/lib/prompts'
import { extractStructuredData } from '@/lib/parsers/extractStructured'
import { generateId, nowISO, createErrorResponse, AppError } from '@/lib/utils'
import type { BasicInfo } from '@/types/chat'
import type { CareerProfile } from '@/types/profile'
import type { ResumeData } from '@/types/resume'
import type { InterviewReport } from '@/types/interview'

function parseChatRequest(raw: string, contentType: string | null): { sessionId: string; content: string; mode?: string } {
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw)
    const sessionId = params.get('sessionId') ?? ''
    const content = params.get('content') ?? ''
    const mode = params.get('mode') ?? undefined

    if (!sessionId || !content) {
      throw new AppError('BAD_REQUEST', '缺少 sessionId 或 content')
    }

    return { sessionId, content, mode }
  }

  try {
    return JSON.parse(raw) as { sessionId: string; content: string; mode?: string }
  } catch {
    // 某些线上环境经由代理后 request.json() / request.text() 可能携带异常转义，回退到最小字段提取
    const sessionId = raw.match(/"sessionId"\s*:\s*"([^"]+)"/)?.[1]
    const mode = raw.match(/"mode"\s*:\s*"([^"]+)"/)?.[1]
    const contentStart = raw.indexOf('"content"')
    if (!sessionId || contentStart === -1) {
      throw new AppError('BAD_REQUEST', '请求体格式无效')
    }

    const valueStart = raw.indexOf('"', raw.indexOf(':', contentStart))
    if (valueStart === -1) {
      throw new AppError('BAD_REQUEST', '缺少 content')
    }

    let value = ''
    let escaped = false
    for (let i = valueStart + 1; i < raw.length; i += 1) {
      const char = raw[i]
      if (char === undefined) break

      if (escaped) {
        if (char === 'n') value += '\n'
        else if (char === 'r') value += '\r'
        else if (char === 't') value += '\t'
        else value += char
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === '"') {
        return { sessionId, content: value, mode }
      }

      value += char
    }

    throw new AppError('BAD_REQUEST', '缺少 content')
  }
}

/** POST /api/chat - 流式对话 */
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text()
    const { sessionId, content, mode } = parseChatRequest(raw, request.headers.get('content-type'))

    if (!sessionId || !content) {
      return createErrorResponse(new AppError('BAD_REQUEST', '缺少 sessionId 或 content'))
    }

    // 获取会话信息
    const sessionRows = await db.select().from(sessions).where(eq(sessions.id, sessionId))
    if (sessionRows.length === 0) {
      return createErrorResponse(new AppError('NOT_FOUND', '会话不存在'))
    }
    const session = sessionRows[0]!
    const chatMode = mode || session.stage || session.mode

    // 解析基础信息
    let basicInfo: BasicInfo | undefined
    let careerProfile: CareerProfile | undefined
    let resumeData: ResumeData | undefined
    if (session.basicInfo) {
      try {
        basicInfo = JSON.parse(session.basicInfo)
      } catch {
        // ignore parse error
      }
    }
    if (session.careerProfile) {
      try {
        careerProfile = JSON.parse(session.careerProfile)
      } catch {
        // ignore parse error
      }
    }
    if (session.resumeData) {
      try {
        resumeData = JSON.parse(session.resumeData)
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
    const systemPrompt = getSystemPrompt(chatMode, { basicInfo, profile: careerProfile, resume: resumeData })

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
        const sessionUpdate: {
          updatedAt: string
          stage?: string
          careerProfile?: string
          recommendations?: string
          resumeData?: string
          interviewReport?: string
        } = {
          updatedAt: nowISO(),
        }

        for (const item of structured) {
          if (item.type === 'career_profile') {
            const data = item.data as { profile: CareerProfile; recommendations: unknown[] }
            sessionUpdate.careerProfile = JSON.stringify(data.profile)
            sessionUpdate.recommendations = JSON.stringify(data.recommendations)
            sessionUpdate.stage = 'resume'
          }

          if (item.type === 'resume') {
            sessionUpdate.resumeData = JSON.stringify(item.data as ResumeData)
            sessionUpdate.stage = 'resume'
          }

          if (item.type === 'interview_report') {
            sessionUpdate.interviewReport = JSON.stringify(item.data as InterviewReport)
            sessionUpdate.stage = 'review'
          }
        }

        await db.update(sessions).set(sessionUpdate).where(eq(sessions.id, sessionId))

        // 发送结构化数据
        for (const item of structured) {
          sendStructured(item.type, item.data)
        }

        sendDone()
      } catch (err) {
        console.error('[Chat] AI 流式响应失败:', err)
        sendError('AI 服务暂时不可用，请稍后重试')
        sendDone()
      }
    })()

    return createSSEResponse(sseStream)
  } catch (err) {
    console.error('[Chat] 对话请求失败:', err)
    return Response.json(
      {
        error: {
          code: 'INTERNAL',
          message: '对话请求处理失败',
          details: {
            reason: err instanceof Error ? err.message : String(err),
          },
        },
      },
      { status: 500 }
    )
  }
}
