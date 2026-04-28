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
              background: 'rgba(39, 39, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e4e4e7',
            },
          }}
        />
      </body>
    </html>
  )
}
