'use client'

import type { ResumeData } from '@/types/resume'

interface ResumePreviewProps {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="bg-white text-gray-900" style={{ width: '210mm', minHeight: '297mm', padding: '28px 32px', fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif' }}>
      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        {data.basicInfo.avatar && (
          <img
            src={data.basicInfo.avatar}
            alt={data.basicInfo.name}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
            {data.basicInfo.name}
          </h1>
          <p style={{ fontSize: '16px', color: '#4A90D9', fontWeight: 500, marginBottom: '8px' }}>
            {data.basicInfo.title || '求职意向未填写'}
          </p>
          <p style={{ fontSize: '13px', color: '#555' }}>
            {[data.basicInfo.phone, data.basicInfo.email, data.basicInfo.location].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', letterSpacing: '0.1em' }}>
            教育经历
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-start mb-3">
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{edu.school}</h3>
                <p style={{ fontSize: '13px', color: '#333' }}>{edu.degree} · {edu.major}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="mt-1 list-disc list-inside" style={{ fontSize: '13px', color: '#333' }}>
                    {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', letterSpacing: '0.1em' }}>
            工作经历
          </h2>
          {data.workExperience.map((work, idx) => (
            <div key={idx} className="mb-4 project-block">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-3">
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{work.company}</h3>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{work.position}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>
                  {work.startDate} - {work.endDate}
                </span>
              </div>
              {work.description && <p style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>{work.description}</p>}
              <ul className="list-disc list-inside" style={{ fontSize: '13px', color: '#333' }}>
                {work.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', letterSpacing: '0.1em' }}>
            项目经历
          </h2>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="mb-4 project-block">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-baseline gap-3">
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{proj.name}</h3>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{proj.role}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>
                  {proj.startDate} - {proj.endDate}
                </span>
              </div>
              {proj.description && <p style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>{proj.description}</p>}
              <ul className="list-disc list-inside" style={{ fontSize: '13px', color: '#333' }}>
                {proj.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
              {proj.techStack && proj.techStack.length > 0 && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  技术栈：{proj.techStack.join(' · ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', letterSpacing: '0.1em' }}>
            专业技能
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} style={{ display: 'inline-block', padding: '2px 10px', background: '#f0f4f8', borderRadius: '4px', fontSize: '12px', color: '#333' }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Self Evaluation */}
      {data.selfEvaluation && (
        <section className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '12px', letterSpacing: '0.1em' }}>
            自我评价
          </h2>
          <p style={{ fontSize: '13px', color: '#222', lineHeight: 1.6 }}>
            {data.selfEvaluation}
          </p>
        </section>
      )}
    </div>
  )
}
