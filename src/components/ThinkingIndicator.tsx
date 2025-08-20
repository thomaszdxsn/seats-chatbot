'use client';

interface ThinkingIndicatorProps {
  message?: string;
}

export function ThinkingIndicator({ message = "Thinking" }: ThinkingIndicatorProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-lg mr-2">⚡</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {message}
            </span>
          </div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}