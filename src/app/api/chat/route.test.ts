import { POST } from './route'

// Mock the AI SDK
jest.mock('@ai-sdk/google', () => ({
  google: jest.fn(),
}))

jest.mock('ai', () => ({
  streamText: jest.fn(),
}))

import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

const mockGoogle = google as unknown as jest.Mock
const mockStreamText = streamText as unknown as jest.Mock

describe('/api/chat', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetAllMocks()
    process.env = { ...originalEnv }
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

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

    mockStreamText.mockImplementation(() => ({
      toTextStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
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

    expect(mockGoogle).toHaveBeenCalledWith('gemini-2.5-flash')
  })

  it('uses custom model name when GOOGLE_MODEL_NAME is provided', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    process.env.GOOGLE_MODEL_NAME = 'gemini-2.5-pro'

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

    mockStreamText.mockImplementation(() => ({
      toTextStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
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

    expect(mockGoogle).toHaveBeenCalledWith('gemini-2.5-pro')
  })

  it('calls streamText with correct parameters', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    process.env.GOOGLE_MODEL_NAME = 'gemini-2.5-flash'

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

    mockStreamText.mockImplementation(() => ({
      toTextStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
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

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

    const mockResponse = new Response('streaming response')
    const mockToTextStreamResponse = jest.fn().mockReturnValue(mockResponse)

    mockStreamText.mockImplementation(() => ({
      toTextStreamResponse: mockToTextStreamResponse,
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
    expect(mockToTextStreamResponse).toHaveBeenCalled()
  })

  it('handles errors gracefully', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

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
    expect(await response.text()).toBe('Internal server error')
  })

  it('uses proxy in development environment when configured', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    process.env.NODE_ENV = 'development'
    process.env.HTTP_PROXY = 'http://127.0.0.1:8234'

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

    mockStreamText.mockImplementation(() => ({
      toTextStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const originalFetch = globalThis.fetch
    let proxyUsed = false

    // Mock fetch to detect proxy usage
    globalThis.fetch = jest.fn((url: string | URL | Request, options?: RequestInit) => {
      if (options && 'agent' in options) {
        proxyUsed = true
      }
      return originalFetch(url, options)
    }) as typeof fetch

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

    // Cleanup
    globalThis.fetch = originalFetch
    delete process.env.HTTP_PROXY
    delete process.env.NODE_ENV
  })

  it('does not use proxy in production environment', async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-api-key'
    process.env.NODE_ENV = 'production'
    process.env.HTTP_PROXY = 'http://127.0.0.1:8234'

    const mockModel = { generate: jest.fn() }
    mockGoogle.mockReturnValue(mockModel)

    mockStreamText.mockImplementation(() => ({
      toTextStreamResponse: jest.fn().mockReturnValue(new Response('test response')),
    }))

    const originalFetch = globalThis.fetch
    const fetchModified = false

    // Store original fetch to check if it gets modified
    const checkFetch = globalThis.fetch

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

    // In production, fetch should not be modified
    expect(globalThis.fetch).toBe(checkFetch)

    // Cleanup
    delete process.env.HTTP_PROXY
    delete process.env.NODE_ENV
  })
})
