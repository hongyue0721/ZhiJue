'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, FileText, Mic, ArrowRight, Clock, ChevronRight, Trash2, ArrowLeft, Sparkles } from 'lucide-react'
import type { ChatSession } from '@/types/chat'
import { toast } from 'sonner'

const features = [
  { icon: Compass, title: '职业探索', description: 'AI 深度对话，发现你的职业方向' },
  { icon: FileText, title: '简历生成', description: '智能优化，一键生成专业简历' },
  { icon: Mic, title: '模拟面试', description: 'AI 面试官实战演练 + 详细复盘' },
]

const STAGE_LABELS: Record<string, string> = {
  basic_info: '基础信息', explore: '职业探索', resume: '简历生成', interview: '模拟面试', review: '复盘总结',
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

  useEffect(() => { loadSessions() }, [])

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' })
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      toast.success('对话已删除')
    } catch { toast.error('删除失败') }
  }

  return (
    <div className="min-h-screen bg-notion-bg flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showHistory ? (
            <button className="p-1.5 text-notion-text-secondary hover:text-notion-text transition-colors rounded-notion hover:bg-notion-hover" onClick={() => setShowHistory(false)}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-notion bg-notion-accent flex items-center justify-center">
              <span className="text-base font-bold text-white">觉</span>
            </div>
          )}
          <span className="text-base font-semibold text-notion-text">{showHistory ? '历史记录' : '职觉'}</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.main key="history" className="flex-1 px-6 pb-12 overflow-y-auto" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.2 }}>
            <div className="max-w-2xl mx-auto pt-4">
              {sessions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-notion-text-tertiary mb-6 text-notion-sm">暂无历史记录</p>
                  <button className="zj-button-primary" onClick={() => { setShowHistory(false); router.push('/chat') }}>开始第一次探索</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div key={session.id} className="group flex items-center justify-between px-3 py-3 rounded-notion cursor-pointer hover:bg-notion-hover transition-colors duration-100" onClick={() => router.push(`/chat?session=${session.id}`)}>
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-notion flex items-center justify-center flex-shrink-0 text-notion-text-tertiary"><FileText className="w-4 h-4" /></div>
                        <div className="min-w-0">
                          <p className="text-notion-sm text-notion-text truncate">{session.title || '求职旅程'}</p>
                          <p className="text-notion-xs text-notion-text-tertiary mt-0.5">{new Date(session.updatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })} · {STAGE_LABELS[session.stage] || session.stage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={(e) => void handleDeleteSession(e, session.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-notion-text-tertiary hover:text-notion-red transition-all rounded-notion hover:bg-notion-surface" title="删除对话"><Trash2 className="w-3.5 h-3.5" /></button>
                        <ChevronRight className="w-4 h-4 text-notion-text-tertiary group-hover:text-notion-text-secondary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.main>
        ) : (
          <motion.main key="hero" className="flex-1 flex flex-col items-center justify-center px-6 pb-12" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} transition={{ duration: 0.2 }}>
            <div className="text-center max-w-xl mx-auto">
              <motion.div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-notion-border text-notion-xs text-notion-text-secondary mb-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Sparkles className="w-3.5 h-3.5 text-notion-accent" />
                <span>AI 驱动的求职全流程助手</span>
              </motion.div>
              <motion.h1 className="text-notion-3xl font-bold text-notion-text mb-3 leading-tight tracking-tight" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                让 AI 成为你的<br /><span className="text-notion-accent">求职旅伴</span>
              </motion.h1>
              <motion.p className="text-notion-base text-notion-text-secondary mb-10 leading-relaxed" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                从职业探索到简历生成，再到模拟面试<br />职觉陪你走好求职每一步
              </motion.p>
            </div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl w-full mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {features.map((feature, index) => (
                <motion.div key={feature.title} className="zj-card p-5 hover:bg-notion-hover transition-colors duration-150" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.05 }}>
                  <div className="w-9 h-9 rounded-notion bg-notion-hover flex items-center justify-center mb-3"><feature.icon className="w-4.5 h-4.5 text-notion-accent" /></div>
                  <h3 className="text-notion-sm font-semibold text-notion-text mb-1">{feature.title}</h3>
                  <p className="text-notion-xs text-notion-text-secondary leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <button className="zj-button-primary flex items-center gap-2 text-notion-base px-6 py-2.5" onClick={() => router.push('/chat')}>开始探索 <ArrowRight className="w-4 h-4" /></button>
              {sessions.length > 0 && (
                <button className="zj-button-secondary flex items-center gap-2 text-notion-base px-6 py-2.5" onClick={() => setShowHistory(true)}><Clock className="w-4 h-4" />历史回顾</button>
              )}
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="px-6 py-4 text-center text-notion-xs text-notion-text-tertiary">职觉 ZhiJue &copy; 2026</footer>
    </div>
  )
}
