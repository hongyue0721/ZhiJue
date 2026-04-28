'use client'

import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import type { ChatMessage } from '@/types/chat'
import { MessageSquare } from 'lucide-react'

interface MessageListProps {
  messages: ChatMessage[]
  isStreaming: boolean
}

export default function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 text-lg">开始和小觉对话吧</p>
          <p className="text-zinc-600 text-sm mt-1">我会帮你探索职业方向、生成简历、模拟面试</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && index === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
