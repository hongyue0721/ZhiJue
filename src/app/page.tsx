'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashPage() {
  const router = useRouter()
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => router.push('/home'), 500)
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-zj-blue to-zj-purple flex items-center justify-center">
              <span className="text-3xl font-bold text-white">觉</span>
            </div>
          </motion.div>

          {/* 品牌名 */}
          <motion.h1
            className="text-3xl font-semibold text-zinc-100 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            职觉 ZhiJue
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-zinc-400 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            AI 求职旅伴
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            className="mt-12 w-8 h-8 border-2 border-zj-blue/30 border-t-zj-blue rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
