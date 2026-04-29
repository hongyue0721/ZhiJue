import { NextRequest } from 'next/server'
import { createErrorResponse, AppError, generateId } from '@/lib/utils'
import path from 'path'
import fs from 'fs'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return createErrorResponse(new AppError('VALIDATION_ERROR', '请上传图片文件'))
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return createErrorResponse(new AppError('VALIDATION_ERROR', '仅支持 JPG、PNG、WebP 格式'))
    }

    if (file.size > MAX_SIZE) {
      return createErrorResponse(new AppError('VALIDATION_ERROR', '图片大小不能超过 2MB'))
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}_${generateId().slice(0, 8)}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatar')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    return Response.json({ data: { url: `/uploads/avatar/${fileName}` } })
  } catch (err) {
    console.error('[Upload] 上传失败:', err)
    return createErrorResponse(new AppError('INTERNAL', '图片上传失败'))
  }
}
