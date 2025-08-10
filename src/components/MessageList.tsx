'use client';

import { Message } from './Message';

interface MessagePart {
  type: string;
  text: string;
}

interface MessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: MessagePart[];
}

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
      Start chatting and let me help you plan the perfect trip!
    </div>
  );
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          role={message.role}
          parts={message.parts}
        />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}