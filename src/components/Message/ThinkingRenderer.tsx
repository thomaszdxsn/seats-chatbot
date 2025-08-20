/**
 * ThinkingRenderer Component
 * 
 * Renders AI thinking processes extracted from <thinking> tags
 * Similar to Seats.aero's thinking display with collapsible content
 */
import React, { useState } from 'react';

interface ThinkingRendererProps {
  content: string;
}

export function ThinkingRenderer({ content }: ThinkingRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract thinking content from <thinking> tags
  const extractThinking = (text: string) => {
    const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/);
    if (!thinkingMatch) return null;
    
    const thinkingContent = thinkingMatch[1].trim();
    // Extract title (first line) and details (rest)
    const lines = thinkingContent.split('\n').filter(line => line.trim());
    const title = lines[0]?.trim() || 'Thinking';
    const details = lines.slice(1).join('\n').trim();
    
    return { title, details };
  };
  
  const thinking = extractThinking(content);
  if (!thinking) return null;
  
  return (
    <div className="mb-4">
      <div 
        className="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚡</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thinking
                </span>
              </div>
            </div>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {thinking.title}
            </span>
          </div>
        </div>
        
        {isExpanded && thinking.details && (
          <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {thinking.details}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}