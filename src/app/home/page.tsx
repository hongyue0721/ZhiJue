'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Compass, FileText, Mic, ArrowRight, Sparkles } from 'lucide-react'

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

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zj-blue to-zj-purple flex items-center justify-center">
            <span className="text-lg font-bold text-white">觉</span>
          </div>
          <span className="text-lg font-semibold text-zinc-100">职觉</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8">
            <Sparkles className="w-4 h-4 text-zj-sand" />
            <span>AI 驱动的求职全流程助手</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4 leading-tight">
            让 AI 成为你的
            <br />
            <span className="bg-gradient-to-r from-zj-blue to-zj-purple bg-clip-text text-transparent">
              求职旅伴
            </span>
          </h1>

          <p className="text-lg text-zinc-400 mb-12 leading-relaxed">
            从职业探索到简历生成，再到模拟面试
            <br />
            职觉陪你走好求职每一步
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`zj-card p-6 cursor-pointer group hover:-translate-y-1 transition-all duration-200 ${feature.borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-zinc-200" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          className="zj-button-primary flex items-center gap-2 text-lg px-8 py-4"
          onClick={() => router.push('/chat')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          开始探索
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-zinc-500">
        职觉 ZhiJue &copy; 2026 &mdash; AI 求职旅伴
      </footer>
    </div>
  )
}
