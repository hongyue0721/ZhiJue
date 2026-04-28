import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { sessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nowISO, createErrorResponse, AppError } from '@/lib/utils'

/** POST /api/sessions/:id/basic-info - 提交用户基础信息 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // 基础校验
    if (!body.name || !body.education || !body.major || !body.graduationYear || !body.workExperience) {
      return createErrorResponse(new AppError('VALIDATION_ERROR', '请填写所有必填字段'))
    }

    await db.update(sessions).set({
      basicInfo: JSON.stringify(body),
      basicInfoCompleted: true,
      updatedAt: nowISO(),
    }).where(eq(sessions.id, params.id))

    return Response.json({ data: { success: true } })
  } catch (err) {
    console.error('[BasicInfo] 提交基础信息失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '提交基础信息失败'))
  }
}
