import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: '职觉 ZhiJue — AI 求职旅伴',
  description: '用 AI 帮你探索职业方向、生成专业简历、模拟面试练习',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#202020',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#EBEBEB',
              borderRadius: '6px',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            },
          }}
        />
      </body>
    </html>
  )
}
