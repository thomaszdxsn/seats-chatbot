'use client';

interface PersistentThinkingIndicatorProps {
  message: string;
  isCompleted?: boolean;
}

export function PersistentThinkingIndicator({ 
  message, 
  isCompleted = false 
}: PersistentThinkingIndicatorProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className={`rounded-lg px-4 py-3 border ${
        isCompleted 
          ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-lg mr-2">⚡</span>
            <span className={`text-sm font-medium ${
              isCompleted 
                ? 'text-gray-700 dark:text-gray-300' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {message}
            </span>
          </div>
          {!isCompleted && (
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
          {isCompleted && (
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}