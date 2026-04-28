import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并 Tailwind 类名 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 应用错误类 */
export class AppError extends Error {
  code: string
  cause?: unknown

  constructor(code: string, message: string, cause?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.cause = cause
  }
}

/** 错误码到 HTTP 状态码映射 */
export function errorCodeToStatus(code: string): number {
  const map: Record<string, number> = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    VALIDATION_ERROR: 422,
    INTERNAL: 500,
    AI_UPSTREAM_ERROR: 502,
    DB_ERROR: 500,
  }
  return map[code] ?? 500
}

/** API 路由错误处理包装器 */
export function createErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: errorCodeToStatus(error.code) }
    )
  }
  console.error('[UnhandledError]', error)
  return Response.json(
    { error: { code: 'INTERNAL', message: '服务器内部错误，请稍后重试' } },
    { status: 500 }
  )
}

/** 生成 UUID v4 */
export function generateId(): string {
  return crypto.randomUUID()
}

/** 获取当前 UTC ISO 时间字符串 */
export function nowISO(): string {
  return new Date().toISOString()
}
