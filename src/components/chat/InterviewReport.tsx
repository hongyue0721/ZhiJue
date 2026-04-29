'use client'

import type { InterviewReport as InterviewReportData } from '@/types/interview'

interface InterviewReportProps {
  report?: InterviewReportData | null
}

export default function InterviewReport({ report }: InterviewReportProps) {
  if (!report) {
    return (
      <div className="rounded-notion-md border border-notion-border bg-notion-surface p-4 text-notion-sm leading-7 text-notion-text-tertiary">
        暂无面试复盘。完成模拟面试后，这里会显示整体评分、六维雷达图和改进建议。
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-notion-md border border-notion-border bg-notion-surface p-4 text-notion-sm leading-7 text-notion-text-secondary">
      <div>
        <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary font-medium">整体评分</p>
        <p className="mt-1 text-notion-2xl font-bold text-notion-accent">{report.overallScore}</p>
      </div>

      <div>
        <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary font-medium">总体总结</p>
        <p className="mt-1 text-notion-text">{report.summary}</p>
      </div>

      {report.strengths.length > 0 ? (
        <div>
          <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary font-medium">优势</p>
          <ul className="mt-1 space-y-1">
            {report.strengths.map((item) => (
              <li key={item} className="text-notion-text-secondary flex items-start gap-1.5">
                <span className="text-notion-green mt-0.5">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {report.improvements.length > 0 ? (
        <div>
          <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary font-medium">待改进</p>
          <ul className="mt-1 space-y-1">
            {report.improvements.map((item) => (
              <li key={item} className="text-notion-text-secondary flex items-start gap-1.5">
                <span className="text-notion-red mt-0.5">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
