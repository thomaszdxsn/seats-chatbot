import { google } from '@ai-sdk/google'
import { streamText, type CoreMessage } from 'ai'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

const SYSTEM_PROMPT = `You are a travel assistant chatbot for a travel booking platform. Your role is to help users with:

1. Flight bookings and inquiries
2. Hotel reservations and recommendations
3. Travel planning and itinerary suggestions
4. Travel-related questions and advice
5. General travel information

IMPORTANT RESTRICTIONS:
- Only respond to travel-related queries
- If asked about non-travel topics, politely redirect the conversation back to travel
- Do not provide information about politics, personal relationships, medical advice, or other unrelated topics
- Keep responses helpful, friendly, and focused on travel assistance

If a user asks about something unrelated to travel, respond with: "I'm a travel assistant and can only help with travel-related questions. How can I assist you with your travel plans today?"`

interface UIMessage {
  role: 'user' | 'assistant' | 'system'
  content?: string
  parts?: Array<{ type: string; text: string }>
}

function convertUIMessagesToModelMessages(uiMessages: UIMessage[]): CoreMessage[] {
  return uiMessages.map(message => {
    if (message.content) {
      return {
        role: message.role,
        content: message.content
      } as CoreMessage
    }
    return {
      role: message.role,
      content: message.parts?.map((part) => part.text).join('') || ''
    } as CoreMessage
  })
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const modelName = process.env.GOOGLE_MODEL_NAME || 'gemini-2.5-flash'
    const isDevelopment = process.env.NODE_ENV !== 'production'

    if (!apiKey) {
      return new Response('GOOGLE_GENERATIVE_AI_API_KEY is not configured', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // Configure global proxy for development environment
    if (isDevelopment) {
      const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.ALL_PROXY
      if (proxyUrl) {
        const originalFetch = globalThis.fetch
        globalThis.fetch = (url: string | URL | Request, options?: RequestInit) => {
          let agent
          if (typeof url === 'string' && url.startsWith('https://')) {
            if (proxyUrl.startsWith('socks://') || proxyUrl.startsWith('socks4://') || proxyUrl.startsWith('socks5://')) {
              agent = new SocksProxyAgent(proxyUrl)
            } else {
              agent = new HttpsProxyAgent(proxyUrl)
            }
            return originalFetch(url, {
              ...options,
              // @ts-expect-error - Node.js specific agent property
              agent
            })
          }
          return originalFetch(url, options)
        }
      }
    }

    const model = google(modelName)

    // Convert UI messages to model messages format
    const modelMessages = convertUIMessagesToModelMessages(messages)

    // Create the stream with system prompt
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      temperature: 0.7,
    })

    console.log({ result })

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
