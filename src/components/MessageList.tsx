'use client';

import { Message } from './Message';
import type { UIMessage } from 'ai';

type MessageData = UIMessage;

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onResend?: (messageId: string, content: string) => void;
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

export function MessageList({ messages, isLoading, onCopy, onEdit, onResend }: MessageListProps) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  // Check if the last assistant message has active tool calls
  const hasActiveToolCalls = () => {
    if (messages.length === 0) return false;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant') return false;
    
    // Check if any parts are tool calls that are not completed
    return lastMessage.parts?.some(part => {
      if (part.type === 'dynamic-tool') {
        return 'state' in part && part.state !== 'output-available';
      }
      if (part.type.startsWith('tool-')) {
        return 'state' in part && part.state !== 'output-available';
      }
      return false;
    }) || false;
  };

  // Only show global loading if we're loading but don't have active tool calls
  const showGlobalLoading = isLoading && !hasActiveToolCalls();

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          role={message.role}
          parts={message.parts}
          onCopy={onCopy}
          onEdit={onEdit}
          onResend={onResend}
        />
      ))}
      {showGlobalLoading && <LoadingIndicator />}
    </div>
  );
}