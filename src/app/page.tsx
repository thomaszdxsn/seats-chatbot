'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function Home() {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [originalMessages, setOriginalMessages] = useState<typeof messages>([]);
  
  const { messages, sendMessage, status, error, setMessages } = useChat({
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
    // If we're editing, replace the message and regenerate from that point
    if (editingMessageId) {
      const messageIndex = messages.findIndex(m => m.id === editingMessageId);
      if (messageIndex !== -1) {
        // Keep only messages up to (but not including) the edited message
        const newMessages = messages.slice(0, messageIndex);
        // Add the edited message
        const editedMessage = { ...messages[messageIndex] };
        editedMessage.parts = [{ type: 'text' as const, text }];
        newMessages.push(editedMessage);
        
        // Update messages and send the new message
        setMessages(newMessages);
        setEditingMessageId(null);
        setEditingContent('');
        setOriginalMessages([]);
        
        // Send the message to get AI response
        setTimeout(() => {
          sendMessage({ text });
        }, 100);
        return;
      }
    }
    
    sendMessage({ text });
  };

  const handleCopy = (content: string) => {
    console.log('Copied:', content);
  };

  const handleEdit = (messageId: string, content: string) => {
    // Edit should behave like resend - replace the message and delete subsequent ones
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      // Save original messages before editing
      setOriginalMessages(messages);
      
      // Keep only messages up to (but not including) the edited message
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      
      // Set editing state to populate input field
      setEditingMessageId(messageId);
      setEditingContent(content);
    }
  };

  const handleResend = (messageId: string, content: string) => {
    // For resend, we do the same as edit but immediately send
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      // Keep only messages up to (but not including) the resent message
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      
      // Send the message again
      setTimeout(() => {
        sendMessage({ text: content });
      }, 100);
    }
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg min-h-96 max-h-[70vh] mb-4 overflow-y-auto p-4">
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
            onCopy={handleCopy}
            onEdit={handleEdit}
            onResend={handleResend}
          />
        </div>

        {error && <ErrorDisplay error={error} />}

        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          editingContent={editingContent}
          isEditing={!!editingMessageId}
          onCancelEdit={() => {
            // Restore original messages when canceling edit
            if (originalMessages.length > 0) {
              setMessages(originalMessages);
              setOriginalMessages([]);
            }
            setEditingMessageId(null);
            setEditingContent('');
          }}
        />
      </div>
    </div>
  );
}
