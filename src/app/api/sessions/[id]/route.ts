import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { sessions, messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createErrorResponse, AppError } from '@/lib/utils'

/** GET /api/sessions/:id - 获取单个会话详情（含消息） */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await db.select().from(sessions).where(eq(sessions.id, params.id))
    if (session.length === 0) {
      return createErrorResponse(new AppError('NOT_FOUND', '会话不存在'))
    }

    const sessionMessages = await db.select().from(messages).where(
      eq(messages.sessionId, params.id)
    )

    return Response.json({
      data: {
        ...session[0],
        messages: sessionMessages,
      },
    })
  } catch (err) {
    console.error('[Sessions] 获取会话详情失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '获取会话详情失败'))
  }
}

/** DELETE /api/sessions/:id - 删除会话 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(messages).where(eq(messages.sessionId, params.id))
    await db.delete(sessions).where(eq(sessions.id, params.id))
    return Response.json({ data: { success: true } })
  } catch (err) {
    console.error('[Sessions] 删除会话失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '删除会话失败'))
  }
}
