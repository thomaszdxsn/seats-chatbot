import { createGoogleGenerativeAI } from '@ai-sdk/google'
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

    // Configure proxy for development environment
    const proxyUrl = isDevelopment ? (process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.ALL_PROXY) : null



    // Create custom fetch with proxy support
    const customFetch = proxyUrl ? (url: string | URL | Request, init?: RequestInit) => {
      let agent
      if (proxyUrl.startsWith('socks://') || proxyUrl.startsWith('socks4://') || proxyUrl.startsWith('socks5://')) {
        agent = new SocksProxyAgent(proxyUrl)
      } else {
        agent = new HttpsProxyAgent(proxyUrl)
      }

      return fetch(url, {
        ...init,
        // @ts-expect-error - Node.js specific agent property
        agent
      })
    } : undefined


    const googleAI = createGoogleGenerativeAI({
      apiKey,
      ...(customFetch && { fetch: customFetch })
    })
    const model = googleAI(modelName)

    // Convert UI messages to model messages format
    const modelMessages = convertUIMessagesToModelMessages(messages)

    // Create the stream with system prompt
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      temperature: 0.7,
    })

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error: unknown) {
    console.error('Chat API error:', error)

    // Determine error type and return appropriate response
    let errorMessage = 'Internal server error'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.name === 'ConnectTimeoutError' || 'code' in error && error.code === 'UND_ERR_CONNECT_TIMEOUT') {
        errorMessage = 'Connection timeout - Please check your network connection or proxy settings'
        statusCode = 408
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error - Unable to connect to AI service'
        statusCode = 503
      } else if (error.message) {
        errorMessage = error.message
      }
    }

    return new Response(JSON.stringify({
      error: errorMessage,
      type: error instanceof Error ? error.name : 'UnknownError',
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
    })
  }
}
