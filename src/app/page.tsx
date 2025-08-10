'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function Home() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        try {
          const response = await fetch(input, {
            ...init,
            signal: AbortSignal.timeout(30000), // 30 second timeout
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return response;
        } catch (err: unknown) {
          if (err instanceof Error) {
            if (err.name === 'TimeoutError' || err.name === 'AbortError') {
              throw new Error('Request timed out. Please check your connection and try again.');
            } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
              throw new Error('Network error. Please check your internet connection.');
            }
          }

          throw err;
        }
      }
    }),
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSendMessage = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Travel Chatbot
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your intelligent travel assistant - One-stop service for hotel bookings and flight inquiries
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-96 mb-4 overflow-y-auto p-4">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        {error && <ErrorDisplay error={error} />}

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
