/** 职业画像 */
export interface CareerProfile {
  summary: string           // 一句话总结
  strengths: string[]       // 优势
  growthAreas: string[]     // 待提升领域
  personalityTraits: string[] // 性格特质
  careerDirection: string   // 推荐职业方向
}

/** 推荐岗位 */
export interface JobRecommendation {
  title: string             // 岗位名称
  company: string           // 公司类型（如：互联网大厂、创业公司等）
  matchScore: number        // 匹配度 0-100
  reason: string            // 推荐理由
  salaryRange: string       // 薪资范围
  requirements: string[]    // 核心要求
}
