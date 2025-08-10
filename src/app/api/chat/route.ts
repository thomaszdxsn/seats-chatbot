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

IMPORTANT LANGUAGE RULE:
- ALWAYS respond in the same language as the user's message
- If user writes in Chinese (中文), respond in Chinese
- If user writes in English, respond in English
- If user writes in other languages, respond in that language
- Maintain natural, native-level fluency in the chosen language

IMPORTANT RESTRICTIONS:
- Only respond to travel-related queries
- If asked about non-travel topics, politely redirect the conversation back to travel
- Do not provide information about politics, personal relationships, medical advice, or other unrelated topics
- Keep responses helpful, friendly, and focused on travel assistance

Language-specific redirect messages:
- English: "I'm a travel assistant and can only help with travel-related questions. How can I assist you with your travel plans today?"
- Chinese: "我是旅行助手，只能帮助解答旅行相关的问题。请问今天我可以如何协助您的旅行计划呢？"
- Use appropriate redirect message based on user's language`

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
    
    // Only enable proxy in development environment (not in production/Vercel)
    const needsProxy = isDevelopment && (process.env.USE_CHINA_PROXY === 'true' || process.env.CHINA_PROXY_URL)
    const chinaProxyUrl = process.env.CHINA_PROXY_URL || 'https://api.genai.gd.edu.kg/google'
    
    // Traditional proxy configuration (for VPN/SOCKS/HTTP proxies) - development only
    const proxyUrl = isDevelopment ? (process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.ALL_PROXY) : null

    if (!apiKey) {
      return new Response('GOOGLE_GENERATIVE_AI_API_KEY is not configured', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    console.log('Proxy configuration:', {
      needsProxy,
      chinaProxyUrl: needsProxy ? chinaProxyUrl : 'not used',
      traditionalProxy: proxyUrl ? 'configured' : 'not configured'
    })

    // Create Google AI client with appropriate configuration
    let googleAI

    if (needsProxy) {
      // Option 1: Use China-specific proxy service (recommended for China mainland users)
      console.log('Using China proxy service:', chinaProxyUrl)
      googleAI = createGoogleGenerativeAI({
        apiKey,
        baseURL: chinaProxyUrl + '/v1beta'
      })
    } else if (proxyUrl) {
      // Option 2: Use traditional proxy (HTTP/HTTPS/SOCKS)
      console.log('Using traditional proxy:', proxyUrl)
      
      const customFetch = (url: string | URL | Request, init?: RequestInit) => {
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
      }

      googleAI = createGoogleGenerativeAI({
        apiKey,
        fetch: customFetch
      })
    } else {
      // Option 3: Direct connection (no proxy)
      console.log('Using direct connection (no proxy)')
      googleAI = createGoogleGenerativeAI({
        apiKey
      })
    }
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
    return result.toUIMessageStreamResponse()
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
