/**
 * ToolCallIndicator Component
 * 
 * Persistent indicator showing which tool was called, remains visible even after tool completion
 */
import React from 'react';
import { LoadingIndicator } from './LoadingIndicator';

interface ToolCallIndicatorProps {
  toolName: string;
  isLoading?: boolean;
  isCompleted?: boolean;
}

export function ToolCallIndicator({ toolName, isLoading = false, isCompleted = false }: ToolCallIndicatorProps) {
  const getToolInfo = (tool: string) => {
    switch (tool) {
      case 'pointsYeahFlightSearch':
      case 'flightSearch':
        return {
          emoji: '✈️',
          loadingMessage: 'Searching for flights...',
          completedMessage: 'Flight search completed'
        };
      
      case 'pointsYeahHotelSearch':
      case 'hotelSearch':
        return {
          emoji: '🏨',
          loadingMessage: 'Searching for hotels...',
          completedMessage: 'Hotel search completed'
        };
      
      case 'datetimeCalculator':
        return {
          emoji: '🧮',
          loadingMessage: 'Calculating datetime...',
          completedMessage: 'Datetime calculation completed'
        };
      
      default:
        return {
          emoji: '🔧',
          loadingMessage: 'Processing...',
          completedMessage: 'Tool execution completed'
        };
    }
  };

  const toolInfo = getToolInfo(toolName);

  if (isLoading) {
    return (
      <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 border-blue-300 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{toolInfo.emoji}</span>
          <div className="flex-1">
            <LoadingIndicator message={toolInfo.loadingMessage} />
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-700 border-green-300 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{toolInfo.emoji}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {toolInfo.completedMessage}
            </span>
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Default state - should not normally be reached
  return (
    <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-3">
      <div className="flex items-center space-x-2">
        <span className="text-lg">{toolInfo.emoji}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Tool called
        </span>
      </div>
    </div>
  );
}