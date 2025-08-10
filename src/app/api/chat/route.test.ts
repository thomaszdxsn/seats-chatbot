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

const mockGoogle = google as jest.Mock
const mockStreamText = streamText as jest.Mock

describe('/api/chat', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns error when GEMINI_API_KEY is not provided', async () => {
    delete process.env.GEMINI_API_KEY

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
    expect(await response.text()).toBe('GEMINI_API_KEY is not configured')
  })

  it('uses default model name when GEMINI_MODEL_NAME is not provided', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key'
    delete process.env.GEMINI_MODEL_NAME

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

  it('uses custom model name when GEMINI_MODEL_NAME is provided', async () => {
    process.env.GEMINI_API_KEY = 'test-api-key'
    process.env.GEMINI_MODEL_NAME = 'gemini-2.5-pro'

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
    process.env.GEMINI_API_KEY = 'test-api-key'
    process.env.GEMINI_MODEL_NAME = 'gemini-2.5-flash'

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
    process.env.GEMINI_API_KEY = 'test-api-key'

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
    process.env.GEMINI_API_KEY = 'test-api-key'

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
})