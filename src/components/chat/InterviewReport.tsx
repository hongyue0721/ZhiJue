'use client'

import type { InterviewReport as InterviewReportData } from '@/types/interview'

interface InterviewReportProps {
  report?: InterviewReportData | null
}

export default function InterviewReport({ report }: InterviewReportProps) {
  if (!report) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-500">
        暂无面试复盘。完成模拟面试后，这里会显示整体评分、六维雷达图和改进建议。
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">整体评分</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-100">{report.overallScore}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">总体总结</p>
        <p className="mt-2 text-zinc-200">{report.summary}</p>
      </div>

      {report.strengths.length > 0 ? (
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">优势</p>
          <ul className="mt-2 space-y-1 text-zinc-300">
            {report.strengths.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {report.improvements.length > 0 ? (
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">待改进</p>
          <ul className="mt-2 space-y-1 text-zinc-300">
            {report.improvements.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
