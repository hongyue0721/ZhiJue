'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputBoxProps {
  onSend: (content: string) => void | Promise<void>
  disabled?: boolean
  placeholder?: string
}

export default function InputBox({ onSend, disabled, placeholder }: InputBoxProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    await onSend(trimmed)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div className="px-4 pb-3 pt-2">
      <div className="max-w-3xl mx-auto flex items-end gap-2 bg-notion-surface border border-notion-border rounded-notion-md px-3 py-2.5 shadow-notion">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || '输入你的消息...'}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-notion-text placeholder-notion-text-tertiary resize-none focus:outline-none text-notion-sm leading-relaxed max-h-[200px]"
        />
        <button
          onClick={() => void handleSend()}
          disabled={disabled || !input.trim()}
          className={cn(
            'p-1.5 rounded-notion transition-all duration-150',
            input.trim() && !disabled
              ? 'text-notion-accent hover:bg-notion-hover'
              : 'text-notion-text-tertiary cursor-not-allowed'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-notion-xs text-notion-text-tertiary mt-1.5">
        AI 生成内容仅供参考，请结合实际情况判断
      </p>
    </div>
  )
}
