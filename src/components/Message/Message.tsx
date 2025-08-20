'use client';

import type { UIMessagePart, UIDataTypes, UITools } from 'ai';
import { MessageActions } from './MessageActions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LoadingIndicator } from './LoadingIndicator';
import { ToolRenderer } from './ToolRenderer';
import { ThinkingRenderer } from './ThinkingRenderer';
import {
  extractTextContent,
  extractToolPartsWithOutput,
  extractActiveToolParts,
  getToolLoadingMessage
} from './helpers';

interface MessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: UIMessagePart<UIDataTypes, UITools>[];
  onCopy?: (content: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onResend?: (messageId: string, content: string) => void;
}

export function Message({ id, role, parts = [], onCopy, onEdit, onResend }: MessageProps) {
  const isUser = role === 'user';
  
  // Extract content and tool parts using helper functions
  const messageContent = extractTextContent(parts);
  const toolParts = extractToolPartsWithOutput(parts);
  const activeToolParts = extractActiveToolParts(parts);
  const toolLoadingMessage = getToolLoadingMessage(activeToolParts);

  const renderMessageContent = () => {
    if (isUser) {
      return <span>{messageContent || 'No content'}</span>;
    }

    // Process thinking content separately
    const hasThinking = messageContent?.includes('<thinking>');
    let thinkingContent = '';
    let cleanContent = messageContent;
    
    if (hasThinking && messageContent) {
      // Extract thinking content
      const thinkingMatch = messageContent.match(/<thinking>[\s\S]*?<\/thinking>/);
      if (thinkingMatch) {
        thinkingContent = thinkingMatch[0];
        // Remove thinking tags from the main content
        cleanContent = messageContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();
      }
    }

    return (
      <div className="space-y-3">
        {/* Render thinking content first */}
        {thinkingContent && (
          <ThinkingRenderer content={thinkingContent} />
        )}
        
        {/* Render tool parts */}
        <ToolRenderer toolParts={toolParts} />
        
        {/* Render clean content (without thinking tags) */}
        {cleanContent && (
          <MarkdownRenderer content={cleanContent} />
        )}
        
        {/* Show tool loading message or "No content" only if there's no text and no tool results */}
        {!messageContent && toolParts.length === 0 && (
          <div className="flex items-center space-x-2">
            {toolLoadingMessage ? (
              <LoadingIndicator message={toolLoadingMessage} />
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No content</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`group max-w-xs lg:max-w-[50%] ${isUser ? '' : 'w-full max-w-none'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
        >
          {renderMessageContent()}
        </div>
        
        {/* Message Actions - shown on hover */}
        {messageContent && (
          <MessageActions
            isUser={isUser}
            messageContent={messageContent}
            messageId={id}
            onCopy={onCopy}
            onEdit={onEdit}
            onResend={onResend}
          />
        )}
      </div>
    </div>
  );
}