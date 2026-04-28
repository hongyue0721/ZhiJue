'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="zj-card p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">出了点问题</h2>
        <p className="text-zinc-400 mb-6">
          {error.message || '页面加载时发生了错误，请重试'}
        </p>
        <button
          onClick={reset}
          className="zj-button-primary"
        >
          重试
        </button>
      </div>
    </div>
  )
}
