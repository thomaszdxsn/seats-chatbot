import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Validate required environment variables
    const apiKey = process.env.GEMINI_API_KEY
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash'

    if (!apiKey) {
      return new Response('GEMINI_API_KEY is not configured', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // Initialize Gemini model
    const model = google(modelName)

    // Create the stream with system prompt
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: messages,
      temperature: 0.7,
    })

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
