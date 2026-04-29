'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import type { ResumeData } from '@/types/resume'

interface ResumeExportButtonsProps {
  data: ResumeData
}

export default function ResumeExportButtons({ data }: ResumeExportButtonsProps) {
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const { toPng } = await import('html-to-image')
      const { default: jsPDF } = await import('jspdf')

      const wrapper = document.getElementById('resume-print-area')
      if (!wrapper) {
        toast.error('未找到简历内容')
        return
      }

      const origTransform = wrapper.style.transform
      const origTransformOrigin = wrapper.style.transformOrigin
      const origWidth = wrapper.style.width
      wrapper.style.transform = 'none'
      wrapper.style.transformOrigin = 'top left'
      wrapper.style.width = '210mm'

      const imgs = Array.from(wrapper.querySelectorAll('img'))
      const origSrcs: string[] = []
      await Promise.all(
        imgs.map(async (img) => {
          origSrcs.push(img.src)
          try {
            const resp = await fetch(img.src)
            const blob = await resp.blob()
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            img.src = dataUrl
          } catch {
            img.remove()
          }
        }),
      )

      const dataUrl = await toPng(wrapper, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      imgs.forEach((img, i) => {
        if (origSrcs[i]) img.src = origSrcs[i]!
      })

      wrapper.style.transform = origTransform
      wrapper.style.transformOrigin = origTransformOrigin
      wrapper.style.width = origWidth

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = 210
      const pdfH = 297
      const imgProps = pdf.getImageProperties(dataUrl)
      const imgW = pdfW
      const imgH = (imgProps.height * imgW) / imgProps.width

      let y = 0
      pdf.addImage(dataUrl, 'PNG', 0, y, imgW, imgH)
      let remaining = imgH - pdfH
      while (remaining > 0) {
        y -= pdfH
        pdf.addPage()
        pdf.addImage(dataUrl, 'PNG', 0, y, imgW, imgH)
        remaining -= pdfH
      }

      pdf.save(`${data.basicInfo.name}_简历.pdf`)
      toast.success('PDF 导出成功')
    } catch (err) {
      console.error('[ResumeExport] 导出失败:', err)
      toast.error('PDF 导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={() => void handleExportPDF()}
      disabled={exporting}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-notion bg-notion-accent text-notion-bg text-notion-xs font-medium hover:brightness-110 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-3.5 h-3.5" />
      {exporting ? '导出中...' : '导出 PDF'}
    </button>
  )
}
