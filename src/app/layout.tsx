import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '职觉 ZhiJue',
  description: 'AI 求职全流程助手',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
