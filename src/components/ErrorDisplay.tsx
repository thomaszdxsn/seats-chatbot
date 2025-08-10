'use client';

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
      <div className="flex items-center justify-between">
        <div>
          <strong>Connection Error:</strong> {error.message}
        </div>
        <button
          onClick={handleRetry}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
        >
          Retry
        </button>
      </div>
      <p className="text-sm mt-2 opacity-75">
        Please check your network connection or proxy settings, then click the retry button.
      </p>
    </div>
  );
}