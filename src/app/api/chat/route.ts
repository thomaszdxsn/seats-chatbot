import { streamText } from 'ai';
import { getProxyConfiguration, createGoogleAIClient } from '@/lib/proxy-config';
import { convertUIMessagesToModelMessages, type UIMessage } from '@/lib/message-converter';
import { createErrorResponse, createErrorHttpResponse } from '@/lib/error-handler';
import { getCurrentSystemPrompt } from '@/lib/system-prompt';
// import { flightSearchTool } from '@/lib/flight-tool'; // Temporarily disabled
import { pointsYeahFlightSearchTool } from '@/lib/pointsyeah/flight-tool';
import { hotelSearchTool } from '@/lib/hotel-tool';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const modelName = process.env.GOOGLE_MODEL_NAME || 'gemini-2.5-flash';

    if (!apiKey) {
      return new Response('GOOGLE_GENERATIVE_AI_API_KEY is not configured', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Get proxy configuration
    const proxyConfig = getProxyConfiguration();

    // Create Google AI client with appropriate configuration
    const googleAI = createGoogleAIClient(apiKey, proxyConfig);
    const model = googleAI(modelName);

    // Convert UI messages to model messages format
    const modelMessages = convertUIMessagesToModelMessages(messages);

    // Create the stream with system prompt and tools
    const result = streamText({
      model,
      system: getCurrentSystemPrompt(),
      messages: modelMessages,
      temperature: 0.5,
      tools: {
        // flightSearch: flightSearchTool, // Temporarily disabled
        pointsYeahFlightSearch: pointsYeahFlightSearchTool,
        hotelSearch: hotelSearchTool,
      },
    });

    // Return streaming response
    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    const errorResponse = createErrorResponse(error);
    return createErrorHttpResponse(errorResponse);
  }
}
