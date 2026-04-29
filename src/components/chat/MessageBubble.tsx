'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/chat'
import { User, Sparkles } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const displayContent = message.content.replace(/```json:structured[\s\S]*?```/g, '').trim()

  return (
    <motion.div
      className={cn('flex gap-2.5 px-4 py-2.5', isUser ? 'justify-end' : 'justify-start')}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-notion bg-notion-accent flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-notion-bg" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-notion-md px-3.5 py-2.5 text-notion-sm',
          isUser
            ? 'bg-notion-surface text-notion-text'
            : 'text-notion-text'
        )}
      >
        {isUser ? (
          <p className="leading-relaxed whitespace-pre-wrap">{displayContent}</p>
        ) : (
          <div className="prose prose-notion max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayContent}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-3.5 bg-notion-accent/50 animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-notion bg-notion-hover border border-notion-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-notion-text-secondary" />
        </div>
      )}
    </motion.div>
  )
}
