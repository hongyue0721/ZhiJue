'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import type { BasicInfo } from '@/types/chat'
import { toast } from 'sonner'

interface BasicInfoFormProps {
  onSubmit: (info: BasicInfo) => void
  isLoading?: boolean
}

export default function BasicInfoForm({ onSubmit, isLoading }: BasicInfoFormProps) {
  const [form, setForm] = useState<BasicInfo>({
    name: '',
    phone: '',
    email: '',
    school: '',
    major: '',
    grade: '',
    jobTarget: '',
    workExperience: '',
    targetCity: '',
    interests: '',
    avatar: '',
  })
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (res.ok && json.data?.url) {
        setForm((prev) => ({ ...prev, avatar: json.data.url }))
        toast.success('照片上传成功')
      } else {
        toast.error(json.error?.message || '上传失败')
        setAvatarPreview('')
      }
    } catch {
      toast.error('照片上传失败，请重试')
      setAvatarPreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.school || !form.major || !form.grade || !form.jobTarget || !form.workExperience) {
      return
    }
    onSubmit(form)
  }

  const update = (key: keyof BasicInfo, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="zj-card p-6 max-w-lg w-full">
        <h2 className="text-notion-lg font-semibold text-notion-text mb-1">先来了解一下你</h2>
        <p className="text-notion-text-secondary text-notion-xs mb-5">填写基础信息，让小觉更好地帮助你规划求职之路</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex justify-center mb-1">
            <div
              onClick={handleAvatarClick}
              className="w-20 h-20 rounded-notion-lg bg-notion-hover border border-notion-border flex items-center justify-center cursor-pointer hover:border-notion-text-tertiary transition-colors duration-150 overflow-hidden relative"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="头像" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-notion-text-tertiary">
                  <Camera className="w-5 h-5" />
                  <span className="text-notion-xs">上传照片</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">姓名 *</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="zj-input" placeholder="你的名字" required />
            </div>
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">联系方式 *</label>
              <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="zj-input" placeholder="手机号或微信" required />
            </div>
          </div>

          <div>
            <label className="block text-notion-xs text-notion-text-secondary mb-1">邮箱</label>
            <input type="email" value={form.email || ''} onChange={(e) => update('email', e.target.value)} className="zj-input" placeholder="选填" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">学校 *</label>
              <input type="text" value={form.school} onChange={(e) => update('school', e.target.value)} className="zj-input" placeholder="你的学校" required />
            </div>
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">专业 *</label>
              <input type="text" value={form.major} onChange={(e) => update('major', e.target.value)} className="zj-input" placeholder="你的专业" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">年级 *</label>
              <select value={form.grade} onChange={(e) => update('grade', e.target.value)} className="zj-input" required>
                <option value="">请选择</option>
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三">大三</option>
                <option value="大四">大四</option>
                <option value="研一">研一</option>
                <option value="研二">研二</option>
                <option value="研三">研三</option>
                <option value="已毕业">已毕业</option>
              </select>
            </div>
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">工作经验 *</label>
              <select value={form.workExperience} onChange={(e) => update('workExperience', e.target.value)} className="zj-input" required>
                <option value="">请选择</option>
                <option value="无">无</option>
                <option value="1年以下">1年以下</option>
                <option value="1-3年">1-3年</option>
                <option value="3-5年">3-5年</option>
                <option value="5年以上">5年以上</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-notion-xs text-notion-text-secondary mb-1">求职目标 *</label>
            <input type="text" value={form.jobTarget} onChange={(e) => update('jobTarget', e.target.value)} className="zj-input" placeholder="如：前端开发工程师、产品经理" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">目标城市</label>
              <input type="text" value={form.targetCity || ''} onChange={(e) => update('targetCity', e.target.value)} className="zj-input" placeholder="选填" />
            </div>
            <div>
              <label className="block text-notion-xs text-notion-text-secondary mb-1">兴趣方向</label>
              <input type="text" value={form.interests || ''} onChange={(e) => update('interests', e.target.value)} className="zj-input" placeholder="选填" />
            </div>
          </div>

          <button type="submit" disabled={isLoading || uploading} className="zj-button-primary w-full mt-1">
            {isLoading ? '提交中...' : '开始求职之旅'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
