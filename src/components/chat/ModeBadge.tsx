'use client'

import { Compass, FileText, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModeBadgeProps {
  mode: string
  active?: boolean
  onClick?: () => void
}

const modeConfig: Record<string, { icon: typeof Compass; label: string; color: string }> = {
  explore: { icon: Compass, label: '职业探索', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  resume: { icon: FileText, label: '简历生成', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  interview: { icon: Mic, label: '模拟面试', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
}

/** @deprecated 不再使用，保留以防万一 */
export default function ModeBadge({ mode, active, onClick }: ModeBadgeProps) {
  const config = modeConfig[mode]
  if (!config) return null
  const Icon = config.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200',
        active ? config.color : 'text-zinc-500 border-white/10 bg-white/5 hover:bg-white/10'
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </button>
  )
}
