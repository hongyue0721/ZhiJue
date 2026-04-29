import { db } from '@/lib/db/client'
import { sessions } from '@/lib/db/schema'
import { generateId, nowISO, createErrorResponse, AppError } from '@/lib/utils'
import { desc, eq } from 'drizzle-orm'

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
export async function POST() {
  try {
    const mode = 'explore'
    const now = nowISO()
    const id = generateId()

    await db.insert(sessions).values({
      id,
      title: '求职旅程',
      mode,
      stage: 'basic_info',
      basicInfoCompleted: false,
      createdAt: now,
      updatedAt: now,
    })

    const session = await db.select().from(sessions).where(eq(sessions.id, id))

    return Response.json({ data: session[0] }, { status: 201 })
  } catch (err) {
    console.error('[Sessions] 创建会话失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '创建会话失败'))
  }
}
