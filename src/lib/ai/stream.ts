/** SSE 流式响应工具 */

/** 创建 SSE 流式响应 */
export function createSSEStream() {
  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c
    },
  })

  const send = (event: string, data: string) => {
    if (controller) {
      controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`))
    }
  }

  const sendMessage = (content: string) => {
    send('message', JSON.stringify({ content }))
  }

  const sendStructured = (type: string, data: unknown) => {
    send('structured', JSON.stringify({ type, data }))
  }

  const sendError = (message: string) => {
    send('error', JSON.stringify({ message }))
  }

  const sendDone = () => {
    send('done', JSON.stringify({ finished: true }))
    if (controller) {
      controller.close()
    }
  }

  const close = () => {
    if (controller) {
      try {
        controller.close()
      } catch {
        // already closed
      }
    }
  }

  return { stream, send, sendMessage, sendStructured, sendError, sendDone, close }
}

/** 创建 SSE Response */
export function createSSEResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // 防止 Nginx 缓冲
    },
  })
}
