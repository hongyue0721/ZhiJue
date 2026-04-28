/** 从 AI 回复中提取结构化数据 */

/** 提取 ```json:structured 块 */
export function extractStructuredData(content: string): {
  text: string
  structured: Array<{ type: string; data: unknown }>
} {
  const structured: Array<{ type: string; data: unknown }> = []

  // 匹配 ```json:structured ... ``` 块
  const regex = /```json:structured\s*\n([\s\S]*?)```/g
  let match: RegExpExecArray | null
  let text = content

  while ((match = regex.exec(content)) !== null) {
    try {
      const matchGroup = match[1]
      if (!matchGroup) continue
      const parsed = JSON.parse(matchGroup.trim())
      if (parsed.type && parsed.data) {
        structured.push({ type: parsed.type, data: parsed.data })
      }
    } catch (e) {
      console.error('[extractStructured] JSON 解析失败:', e)
    }
    // 从文本中移除 JSON 块
    text = text.replace(match[0], '').trim()
  }

  return { text, structured }
}
