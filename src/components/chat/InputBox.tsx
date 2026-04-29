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
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || '输入你的消息...'}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none text-base leading-relaxed max-h-[200px]"
        />
        <button
          onClick={() => void handleSend()}
          disabled={disabled || !input.trim()}
          className={cn(
            'p-2 rounded-xl transition-all duration-200',
            input.trim() && !disabled
              ? 'bg-zj-blue text-white hover:bg-zj-blue/90'
              : 'bg-white/5 text-zinc-500 cursor-not-allowed'
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center text-xs text-zinc-600 mt-2">
        AI 生成内容仅供参考，请结合实际情况判断
      </p>
    </div>
  )
}
