import { POST } from './route'

// Mock the AI SDK
jest.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: jest.fn(),
}))

jest.mock('ai', () => ({
  streamText: jest.fn(),
}))

jest.mock('https-proxy-agent', () => ({
  HttpsProxyAgent: jest.fn(),
}))

jest.mock('socks-proxy-agent', () => ({
  SocksProxyAgent: jest.fn(),
}))

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'

const mockCreateGoogleGenerativeAI = createGoogleGenerativeAI as unknown as jest.Mock
const mockGoogleAI = jest.fn()
const mockModel = { generate: jest.fn() }
const mockStreamText = streamText as unknown as jest.Mock

describe('/api/chat', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetAllMocks()
    process.env = { ...originalEnv }

    // Setup mock return values
    mockGoogleAI.mockReturnValue(mockModel)
    mockCreateGoogleGenerativeAI.mockReturnValue(mockGoogleAI)
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns error when GOOGLE_API_KEY is not provided', async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('GOOGLE_GENERATIVE_AI_API_KEY is not configured')
  })

  it('uses default model name when GOOGLE_MODEL_NAME is not provided', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    delete process.env.GOOGLE_MODEL_NAME

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    await POST(request)

    expect(mockCreateGoogleGenerativeAI).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'test-api-key'
    }))
    expect(mockGoogleAI).toHaveBeenCalledWith('gemini-2.5-flash')
  })

  it('uses custom model name when GOOGLE_MODEL_NAME is provided', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    process.env.GOOGLE_MODEL_NAME = 'gemini-2.5-pro'

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    await POST(request)

    expect(mockCreateGoogleGenerativeAI).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'test-api-key'
    }))
    expect(mockGoogleAI).toHaveBeenCalledWith('gemini-2.5-pro')
  })

  it('calls streamText with correct parameters', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    process.env.GOOGLE_MODEL_NAME = 'gemini-2.5-flash'

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const testMessages = [
      { role: 'user', content: 'I want to book a flight to Paris' },
    ]

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: testMessages,
      }),
    })

    await POST(request)

    expect(mockStreamText).toHaveBeenCalledWith({
      model: mockModel,
      system: expect.stringContaining('travel assistant chatbot'),
      messages: testMessages,
      temperature: 0.7,
    })
  })

  it('returns streaming response when successful', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'

    const mockResponse = new Response('streaming response')
    const mockToUIMessageStreamResponse = jest.fn().mockReturnValue(mockResponse)

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: mockToUIMessageStreamResponse,
    }))

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await POST(request)

    expect(response).toBe(mockResponse)
    expect(mockToUIMessageStreamResponse).toHaveBeenCalled()
  })

  it('handles errors gracefully', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'

    mockStreamText.mockImplementation(() => {
      throw new Error('AI service unavailable')
    })

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(response.headers.get('Content-Type')).toBe('application/json')

    const errorData = await response.json()
    expect(errorData.error).toBe('AI service unavailable')
    expect(errorData.type).toBe('Error')
    expect(errorData.timestamp).toBeDefined()
  })

  it('handles timeout errors specifically', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'

    const timeoutError = new Error('Connection timeout')
    timeoutError.name = 'ConnectTimeoutError'

    mockStreamText.mockImplementation(() => {
      throw timeoutError
    })

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(408)

    const errorData = await response.json()
    expect(errorData.error).toBe('Connection timeout - Please check your network connection or proxy settings')
    expect(errorData.type).toBe('ConnectTimeoutError')
  })

  it('handles network errors specifically', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'

    const networkError = new Error('fetch failed')
    networkError.name = 'TypeError'

    mockStreamText.mockImplementation(() => {
      throw networkError
    })

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(503)

    const errorData = await response.json()
    expect(errorData.error).toBe('Network error - Unable to connect to AI service')
    expect(errorData.type).toBe('TypeError')
  })

  it('uses traditional proxy in development environment when China proxy is not configured', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true })
    process.env.HTTP_PROXY = 'http://127.0.0.1:8234'
    // Ensure China proxy is not configured
    delete process.env.USE_CHINA_PROXY
    delete process.env.CHINA_PROXY_URL

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    await POST(request)

    expect(mockCreateGoogleGenerativeAI).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'test-api-key',
      fetch: expect.any(Function)
    }))
    expect(mockGoogleAI).toHaveBeenCalledWith('gemini-2.5-flash')

    // Cleanup
    delete process.env.HTTP_PROXY
    Object.defineProperty(process.env, 'NODE_ENV', { value: undefined, writable: true })
  })

  it('uses China proxy in development environment when configured', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true })
    process.env.USE_CHINA_PROXY = 'true'

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    await POST(request)

    expect(mockCreateGoogleGenerativeAI).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'test-api-key',
      baseURL: 'https://api.genai.gd.edu.kg/google/v1beta'
    }))
    expect(mockGoogleAI).toHaveBeenCalledWith('gemini-2.5-flash')

    // Cleanup
    delete process.env.USE_CHINA_PROXY
    Object.defineProperty(process.env, 'NODE_ENV', { value: undefined, writable: true })
  })

  it('does not use proxy in production environment', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true })
    process.env.HTTP_PROXY = 'http://127.0.0.1:8234'

    mockStreamText.mockImplementation(() => ({
      toUIMessageStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    })

    await POST(request)

    expect(mockCreateGoogleGenerativeAI).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'test-api-key'
    }))
    expect(mockCreateGoogleGenerativeAI).not.toHaveBeenCalledWith(expect.objectContaining({
      fetch: expect.any(Function)
    }))
    expect(mockGoogleAI).toHaveBeenCalledWith('gemini-2.5-flash')

    // Cleanup
    delete process.env.HTTP_PROXY
    Object.defineProperty(process.env, 'NODE_ENV', { value: undefined, writable: true })
  })
})
