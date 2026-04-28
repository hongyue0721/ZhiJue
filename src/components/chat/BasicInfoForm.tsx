'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { BasicInfo } from '@/types/chat'

interface BasicInfoFormProps {
  onSubmit: (info: BasicInfo) => void
  isLoading?: boolean
}

export default function BasicInfoForm({ onSubmit, isLoading }: BasicInfoFormProps) {
  const [form, setForm] = useState<BasicInfo>({
    name: '',
    education: '',
    major: '',
    graduationYear: '',
    workExperience: '',
    targetCity: '',
    interests: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.education || !form.major || !form.graduationYear || !form.workExperience) {
      return
    }
    onSubmit(form)
  }

  const update = (key: keyof BasicInfo, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      className="flex-1 flex items-center justify-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="zj-card p-8 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">先来了解一下你</h2>
        <p className="text-zinc-400 text-sm mb-6">填写基础信息，让小觉更好地帮助你</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">姓名 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="zj-input"
              placeholder="你的名字"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">学历 *</label>
            <select
              value={form.education}
              onChange={(e) => update('education', e.target.value)}
              className="zj-input"
              required
            >
              <option value="">请选择</option>
              <option value="高中">高中</option>
              <option value="大专">大专</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">专业 *</label>
            <input
              type="text"
              value={form.major}
              onChange={(e) => update('major', e.target.value)}
              className="zj-input"
              placeholder="你的专业"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">毕业年份 *</label>
            <input
              type="text"
              value={form.graduationYear}
              onChange={(e) => update('graduationYear', e.target.value)}
              className="zj-input"
              placeholder="如 2026"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">工作经验 *</label>
            <select
              value={form.workExperience}
              onChange={(e) => update('workExperience', e.target.value)}
              className="zj-input"
              required
            >
              <option value="">请选择</option>
              <option value="无">无</option>
              <option value="1年以下">1年以下</option>
              <option value="1-3年">1-3年</option>
              <option value="3-5年">3-5年</option>
              <option value="5年以上">5年以上</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">目标城市</label>
            <input
              type="text"
              value={form.targetCity || ''}
              onChange={(e) => update('targetCity', e.target.value)}
              className="zj-input"
              placeholder="如 北京、上海（选填）"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">兴趣方向</label>
            <input
              type="text"
              value={form.interests || ''}
              onChange={(e) => update('interests', e.target.value)}
              className="zj-input"
              placeholder="如 前端开发、产品经理（选填）"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="zj-button-primary w-full mt-2"
          >
            {isLoading ? '提交中...' : '开始对话'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
