import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { sessions } from '@/lib/db/schema'
import { generateId, nowISO, createErrorResponse, AppError } from '@/lib/utils'
import { desc } from 'drizzle-orm'

/** GET /api/sessions - 获取所有会话列表 */
export async function GET() {
  try {
    const allSessions = await db.select().from(sessions).orderBy(desc(sessions.updatedAt))
    return Response.json({ data: allSessions })
  } catch (err) {
    console.error('[Sessions] 获取会话列表失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '获取会话列表失败'))
  }
}

/** POST /api/sessions - 创建新会话 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mode = body.mode || 'explore'
    const now = nowISO()
    const id = generateId()

    const modeTitle: Record<string, string> = {
      explore: '职业探索',
      resume: '简历生成',
      interview: '模拟面试',
    }

    await db.insert(sessions).values({
      id,
      title: modeTitle[mode] || '新对话',
      mode,
      basicInfoCompleted: false,
      createdAt: now,
      updatedAt: now,
    })

    const session = await db.select().from(sessions).where(
      (await import('drizzle-orm')).eq(sessions.id, id)
    )

    return Response.json({ data: session[0] }, { status: 201 })
  } catch (err) {
    console.error('[Sessions] 创建会话失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '创建会话失败'))
  }
}
