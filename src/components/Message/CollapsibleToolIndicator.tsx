/**
 * CollapsibleToolIndicator Component
 * 
 * Shows tool execution status with collapsible details section
 * Similar to Seats.aero's "Searched for flights" expandable interface
 */
import React, { useState } from 'react';
import { LoadingIndicator } from './LoadingIndicator';

interface CollapsibleToolIndicatorProps {
  toolName: string;
  isLoading?: boolean;
  isCompleted?: boolean;
  children?: React.ReactNode; // The tool results to show when expanded
  defaultExpanded?: boolean;
}

export function CollapsibleToolIndicator({ 
  toolName, 
  isLoading = false, 
  isCompleted = false, 
  children,
  defaultExpanded = false 
}: CollapsibleToolIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getToolInfo = (tool: string) => {
    switch (tool) {
      case 'pointsYeahFlightSearch':
      case 'flightSearch':
        return {
          emoji: '✈️',
          loadingMessage: 'Searching for flights',
          completedMessage: 'Searched for flights',
          expandedLabel: 'View in Search'
        };
      
      case 'pointsYeahHotelSearch':
      case 'hotelSearch':
        return {
          emoji: '🏨',
          loadingMessage: 'Searching for hotels',
          completedMessage: 'Searched for hotels',
          expandedLabel: 'View in Search'
        };
      
      case 'datetimeCalculator':
        return {
          emoji: '🧮',
          loadingMessage: 'Calculating datetime',
          completedMessage: 'Calculated datetime',
          expandedLabel: 'View calculation'
        };
      
      default:
        return {
          emoji: '🔧',
          loadingMessage: 'Processing',
          completedMessage: 'Tool executed',
          expandedLabel: 'View details'
        };
    }
  };

  const toolInfo = getToolInfo(toolName);

  const toggleExpanded = () => {
    if (isCompleted && children) {
      setIsExpanded(!isExpanded);
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 border-blue-300 mb-3">
        <div className="p-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{toolInfo.emoji}</span>
            <div className="flex-1">
              <LoadingIndicator message={`${toolInfo.loadingMessage}...`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="border rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-700 border-green-300 mb-3">
        {/* Header - always visible */}
        <div 
          className={`p-3 ${children ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30' : ''}`}
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between">
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
            
            {children && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-green-700 dark:text-green-300">
                  {toolInfo.expandedLabel}
                </span>
                <svg 
                  className={`w-4 h-4 text-green-600 dark:text-green-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible content */}
        {children && isExpanded && (
          <div className="border-t border-green-200 dark:border-green-700 bg-white dark:bg-gray-900 rounded-b-lg">
            <div className="p-4">
              {children}
            </div>
          </div>
        )}
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