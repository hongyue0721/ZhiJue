'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, FileText, Mic, ArrowRight, Sparkles, Clock, ChevronRight, Trash2, ArrowLeft } from 'lucide-react'
import type { ChatSession } from '@/types/chat'
import { toast } from 'sonner'

const features = [
  {
    icon: Compass,
    title: '职业探索',
    description: 'AI 深度对话，发现你的职业方向',
    color: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: FileText,
    title: '简历生成',
    description: '智能优化，一键生成专业简历',
    color: 'from-emerald-500/20 to-emerald-600/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: Mic,
    title: '模拟面试',
    description: 'AI 面试官实战演练 + 详细复盘',
    color: 'from-amber-500/20 to-amber-600/10',
    borderColor: 'border-amber-500/20',
  },
]

const STAGE_LABELS: Record<string, string> = {
  basic_info: '基础信息',
  explore: '职业探索',
  resume: '简历生成',
  interview: '模拟面试',
  review: '复盘总结',
}

export default function HomePage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  const loadSessions = () => {
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((json) => setSessions(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' })
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      toast.success('对话已删除')
    } catch {
      toast.error('删除失败')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showHistory ? (
            <button
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={() => setShowHistory(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zj-blue to-zj-purple flex items-center justify-center">
              <span className="text-lg font-bold text-white">觉</span>
            </div>
          )}
          <span className="text-lg font-semibold text-zinc-100">
            {showHistory ? '历史记录' : '职觉'}
          </span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showHistory ? (
          /* History View */
          <motion.main
            key="history"
            className="flex-1 px-6 pb-12 overflow-y-auto"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.25 }}
          >
            <div className="max-w-3xl mx-auto pt-4">
              {sessions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-zinc-500 mb-4">暂无历史记录</p>
                  <button
                    className="zj-button-primary"
                    onClick={() => {
                      setShowHistory(false)
                      router.push('/chat')
                    }}
                  >
                    开始第一次探索
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="zj-card p-4 group hover:-translate-y-[1px] transition-all duration-200 flex items-center justify-between cursor-pointer"
                      onClick={() => router.push(`/chat?session=${session.id}`)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-zinc-200 font-medium truncate">
                            {session.title || '求职旅程'}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(session.updatedAt).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}{' '}
                            · {STAGE_LABELS[session.stage] || session.stage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => void handleDeleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-all rounded-lg hover:bg-white/5"
                          title="删除对话"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.main>
        ) : (
          /* Main Hero View */
          <motion.main
            key="hero"
            className="flex-1 flex flex-col items-center justify-center px-6 pb-12"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="w-4 h-4 text-zj-sand" />
                <span>AI 驱动的求职全流程助手</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                让 AI 成为你的
                <br />
                <span className="bg-gradient-to-r from-zj-blue to-zj-purple bg-clip-text text-transparent">
                  求职旅伴
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-zinc-400 mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                从职业探索到简历生成，再到模拟面试
                <br />
                职觉陪你走好求职每一步
              </motion.p>
            </div>

            {/* Feature Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`zj-card p-6 ${feature.borderColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-zinc-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <button
                className="zj-button-primary flex items-center gap-2 text-lg px-8 py-4"
                onClick={() => router.push('/chat')}
              >
                开始探索
                <ArrowRight className="w-5 h-5" />
              </button>
              {sessions.length > 0 && (
                <button
                  className="zj-button-secondary flex items-center gap-2 text-lg px-8 py-4"
                  onClick={() => setShowHistory(true)}
                >
                  <Clock className="w-5 h-5" />
                  历史回顾
                </button>
              )}
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-zinc-500">
        职觉 ZhiJue &copy; 2026 &mdash; AI 求职旅伴
      </footer>
    </div>
  )
}
