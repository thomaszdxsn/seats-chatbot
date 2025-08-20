'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { useTimezone } from '@/hooks/useTimezone';

export default function Home() {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [originalMessages, setOriginalMessages] = useState<typeof messages>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get user's timezone using custom hook
  const userTimezone = useTimezone();
  
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        try {
          // Add user timezone to request headers
          const headers = new Headers(init?.headers);
          headers.set('X-User-Timezone', userTimezone);
          
          const response = await fetch(input, {
            ...init,
            headers,
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
  
  // Track whether we've already sent a summary request for the latest tool result
  const [processedToolCalls, setProcessedToolCalls] = useState<Set<string>>(new Set());
  
  // Removed auto summary message tracking - using content-based filtering instead
  
  // Removed thinking phases - now using real AI thinking content from <thinking> tags

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll when messages change (new message received)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when status changes to streaming (user sent message)
  useEffect(() => {
    if (status === 'streaming') {
      scrollToBottom();
    }
  }, [status]);

  // Check for completed tool calls and auto-trigger summary
  useEffect(() => {
    // Don't process if we're currently loading or if there are no messages
    if (isLoading || messages.length === 0) return;
    
    // Find the last assistant message
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (!lastAssistantMessage) return;
    
    // Check if this message contains completed tool calls
    const hasCompletedTools = lastAssistantMessage.parts?.some(part => 
      part.type === 'dynamic-tool' && 'state' in part && part.state === 'output-available' ||
      part.type?.startsWith('tool-') && 'state' in part && part.state === 'output-available'
    );
    
    // If we found completed tool calls, check if we haven't processed them yet
    if (hasCompletedTools) {
      const messageId = lastAssistantMessage.id;
      
      // Only send summary request if we haven't processed this message's tools yet
      if (!processedToolCalls.has(messageId)) {
        // Mark this message as processed
        setProcessedToolCalls(prev => new Set([...prev, messageId]));
        
        // Send summary request after a short delay to ensure tool rendering is complete
        setTimeout(() => {
          const summaryText = "Please provide a comprehensive summary and analysis of the search results above. Include key findings, recommendations, and a detailed results table.";
          
          // Send the message
          sendMessage({ text: summaryText });
        }, 500);
      }
    }
  }, [messages, isLoading, processedToolCalls, sendMessage]);
  
  // Removed summary monitoring - thinking content now comes from AI's <thinking> tags

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
        
        // Clear editing state first
        setEditingMessageId(null);
        setEditingContent('');
        setOriginalMessages([]);
        
        // Update messages and send the new message
        setMessages(newMessages);
        
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

        <div ref={scrollContainerRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg min-h-96 max-h-[70vh] mb-4 overflow-y-auto p-4">
          <MessageList 
            messages={messages.filter(msg => {
              // Hide auto-sent summary requests
              if (msg.role === 'user') {
                const firstPart = msg.parts?.[0];
                return !(firstPart?.type === 'text' && 
                        firstPart.text?.includes('Please provide a comprehensive summary and analysis'));
              }
              return true;
            })} 
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
