import OpenAI from 'openai'

/** OpenAI 兼容客户端单例（用于 DeepSeek 等兼容 API） */
let client: OpenAI | null = null

/** 默认模型 */
export const DEFAULT_MODEL = process.env.AI_MODEL || 'deepseek-v4-flash'

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY 环境变量未设置')
    }
    client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    })
  }
  return client
}

/** 调用 OpenAI 兼容流式接口 */
export async function streamChat(params: {
  systemPrompt: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  maxTokens?: number
}) {
  const openai = getOpenAIClient()

  const stream = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 4096,
    stream: true,
    messages: [
      { role: 'system', content: params.systemPrompt },
      ...params.messages,
    ],
  })

  return stream
}

/** 调用 OpenAI 兼容非流式接口（用于结构化数据提取） */
export async function chatCompletion(params: {
  systemPrompt: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  maxTokens?: number
}): Promise<string> {
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 4096,
    messages: [
      { role: 'system', content: params.systemPrompt },
      ...params.messages,
    ],
  })

  return response.choices[0]?.message?.content ?? ''
}
