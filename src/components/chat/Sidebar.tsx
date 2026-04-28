'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChat } from '@/contexts/ChatContext'
import ModeBadge from './ModeBadge'

export default function Sidebar() {
  const { state, loadSessions, createSession, loadSession, deleteSession, dispatch } = useChat()

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {state.sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed md:relative z-50 h-full w-72 bg-neutral-900 border-r border-white/10 flex flex-col',
          'md:translate-x-0 transition-transform duration-200',
          state.sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zj-blue to-zj-purple flex items-center justify-center">
              <span className="text-sm font-bold text-white">觉</span>
            </div>
            <span className="font-semibold text-zinc-100">职觉</span>
          </div>
          <button
            className="md:hidden p-1 text-zinc-400 hover:text-zinc-200"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <button
            onClick={() => createSession('explore')}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">新对话</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {state.sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer mb-1 transition-all duration-200',
                state.currentSession?.id === session.id
                  ? 'bg-white/10 border border-white/10'
                  : 'hover:bg-white/5'
              )}
              onClick={() => {
                loadSession(session.id)
                dispatch({ type: 'TOGGLE_SIDEBAR' })
              }}
            >
              <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <span className="flex-1 text-sm text-zinc-300 truncate">{session.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSession(session.id)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </motion.aside>
    </>
  )
}
