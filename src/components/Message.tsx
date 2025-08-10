'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessagePart {
  type: string;
  text: string;
}

interface MessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: MessagePart[];
}

export function Message({ role, parts }: MessageProps) {
  const messageContent = parts?.map(part => part.text).join('') || 'No content';
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-[50%] px-4 py-2 rounded-lg ${isUser
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
      >
        {isUser ? (
          <span>{messageContent}</span>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Customize markdown components to match the design
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !match ? (
                    <code
                      className="bg-gray-300 dark:bg-gray-600 px-1 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-300 dark:bg-gray-600 p-2 rounded-md overflow-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-400 pl-4 italic mb-2 last:mb-0">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-2">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                    {children}
                  </td>
                ),
              }}
            >
              {messageContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
