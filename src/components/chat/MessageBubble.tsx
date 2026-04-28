'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/chat'
import { User, Bot } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // 移除结构化数据块，只显示文本部分
  const displayContent = message.content.replace(/```json:structured[\s\S]*?```/g, '').trim()

  return (
    <motion.div
      className={cn('flex gap-3 px-4 py-3', isUser ? 'justify-end' : 'justify-start')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zj-blue to-zj-purple flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-zj-blue/20 border border-zj-blue/30 text-zinc-200'
            : 'bg-white/5 border border-white/10 text-zinc-200'
        )}
      >
        {isUser ? (
          <p className="text-base leading-relaxed whitespace-pre-wrap">{displayContent}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none [&>p]:leading-relaxed [&>p]:mb-3 [&>ul]:mb-3 [&>ol]:mb-3 [&>h3]:text-zinc-100 [&>h3]:font-semibold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayContent}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-zj-blue/60 animate-pulse ml-1" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-zj-sand/20 border border-zj-sand/30 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-zj-sand" />
        </div>
      )}
    </motion.div>
  )
}
