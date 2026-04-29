import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { sessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nowISO, createErrorResponse, AppError } from '@/lib/utils'

function parseBasicInfoRequest(raw: string, contentType: string | null): Record<string, string> {
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw)
    const result: Record<string, string> = {}
    params.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    // 回退到最小字段提取
    const result: Record<string, string> = {}
    const fields = ['name', 'phone', 'email', 'school', 'major', 'grade', 'jobTarget', 'workExperience', 'targetCity', 'interests']
    for (const field of fields) {
      const match = raw.match(new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`))
      if (match?.[1]) {
        result[field] = match[1]
      }
    }
    return result
  }
}

/** POST /api/sessions/:id/basic-info - 提交用户基础信息 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const raw = await request.text()
    const body = parseBasicInfoRequest(raw, request.headers.get('content-type'))

    if (!body.name || !body.phone || !body.school || !body.major || !body.grade || !body.jobTarget || !body.workExperience) {
      return createErrorResponse(new AppError('VALIDATION_ERROR', '请填写姓名、联系方式、学校、专业、年级、求职目标和工作经验'))
    }

    await db.update(sessions).set({
      basicInfo: JSON.stringify(body),
      basicInfoCompleted: true,
      stage: 'explore',
      updatedAt: nowISO(),
    }).where(eq(sessions.id, params.id))

    return Response.json({ data: { success: true } })
  } catch (err) {
    console.error('[BasicInfo] 提交基础信息失败:', err)
    return createErrorResponse(new AppError('DB_ERROR', '提交基础信息失败'))
  }
}
