'use client';

import { useState, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  editingContent?: string;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export function ChatInput({ onSendMessage, isLoading, editingContent, isEditing, onCancelEdit }: ChatInputProps) {
  const [input, setInput] = useState('');
  
  // Update input when editing content changes
  useEffect(() => {
    if (isEditing && editingContent) {
      setInput(editingContent);
    } else if (!isEditing) {
      setInput('');
    }
  }, [isEditing, editingContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      {isEditing && (
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          ✏️ Editing message - submit to update and regenerate response
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Please wait for AI response..." : isEditing ? "Edit your message..." : "Enter your travel questions..."}
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed ${
            isEditing 
              ? 'border-blue-300 dark:border-blue-600 focus:ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending</span>
          </div>
        ) : (
          isEditing ? 'Update' : 'Send'
        )}
      </button>
      </form>
    </div>
  );
}