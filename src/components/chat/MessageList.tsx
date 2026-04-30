'use client'

import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import type { ChatMessage } from '@/types/chat'
import { Sparkles } from 'lucide-react'

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
          <div className="w-10 h-10 rounded-notion bg-notion-accent/15 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-notion-accent" />
          </div>
          <p className="text-notion-text text-notion-sm mb-1">开始和小觉对话吧</p>
          <p className="text-notion-text-tertiary text-notion-xs">我会帮你探索职业方向、生成简历、模拟面试</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-3">
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
