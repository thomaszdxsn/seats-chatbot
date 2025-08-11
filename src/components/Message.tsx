'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { UIMessagePart, UIDataTypes, UITools } from 'ai';

// Type for tool parts with output state
type ToolPartWithOutput = {
  toolCallId: string;
  state: 'output-available';
  output?: {
    flights?: FlightData[];
    summary?: string;
  };
};

// Flight results component
interface FlightData {
  departure_airport?: { id: string; name: string };
  arrival_airport?: { id: string; name: string };
  flights?: Array<{
    departure_airport?: { id: string; name: string; time: string };
    arrival_airport?: { id: string; name: string; time: string };
    duration: number;
    airline: string;
    airline_logo: string;
    flight_number: string;
    legroom?: string;
  }>;
  price: number;
  type: string;
  book_link?: string;
}

function FlightResults({ flights, summary }: { flights: FlightData[]; summary?: string }) {
  if (!flights || flights.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200">No flights found</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
        ✈️ Flight Search Results
      </h3>
      
      {summary && (
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 bg-blue-100 dark:bg-blue-800/30 p-2 rounded">
          {summary}
        </p>
      )}
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {flights.slice(0, 5).map((flight, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {flight.departure_airport?.name} → {flight.arrival_airport?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {flight.departure_airport?.id} → {flight.arrival_airport?.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ¥{flight.price}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{flight.type}</p>
              </div>
            </div>
            
            {flight.flights && flight.flights.length > 0 && (
              <div className="space-y-2">
                {flight.flights.map((segment, segIndex: number) => (
                  <div key={segIndex} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={segment.airline_logo} 
                        alt={segment.airline}
                        className="w-6 h-6 rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {segment.airline} {segment.flight_number}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {Math.floor(segment.duration / 60)}h {segment.duration % 60}m
                          {segment.legroom && ` • ${segment.legroom}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                      <p>{segment.departure_airport?.time}</p>
                      <p>{segment.arrival_airport?.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {flight.book_link && (
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                <a
                  href={flight.book_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                >
                  Book Flight →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {flights.length > 5 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
          Showing 5 of {flights.length} results
        </p>
      )}
    </div>
  );
}

interface MessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: UIMessagePart<UIDataTypes, UITools>[];
}

export function Message({ role, parts }: MessageProps) {
  const isUser = role === 'user';
  
  // Extract text parts
  const textParts = parts?.filter(part => part.type === 'text') || [];
  const messageContent = textParts.map(part => 'text' in part ? part.text : '').join('');
  
  // Extract tool parts with output
  const toolParts = parts?.filter(part => {
    if (part.type === 'dynamic-tool') {
      return 'state' in part && part.state === 'output-available';
    }
    if (part.type.startsWith('tool-')) {
      return 'state' in part && part.state === 'output-available';
    }
    return false;
  }) || [];

  // Extract active tool parts (being called but not yet completed)
  const activeToolParts = parts?.filter(part => {
    if (part.type === 'dynamic-tool') {
      return 'state' in part && part.state !== 'output-available';
    }
    if (part.type.startsWith('tool-')) {
      return 'state' in part && part.state !== 'output-available';
    }
    return false;
  }) || [];

  // Determine what tools are being called
  const getToolLoadingMessage = () => {
    if (activeToolParts.length === 0) return null;
    
    for (const part of activeToolParts) {
      if (part.type === 'dynamic-tool' && 'toolName' in part) {
        if (part.toolName === 'flightSearch') {
          return 'Searching for flights...';
        }
      }
      if (part.type === 'tool-flightSearch') {
        return 'Searching for flights...';
      }
    }
    
    return 'Processing request...';
  };

  const toolLoadingMessage = getToolLoadingMessage();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-[50%] px-4 py-2 rounded-lg ${isUser
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
      >
        {isUser ? (
          <span>{messageContent || 'No content'}</span>
        ) : (
          <div className="space-y-3">
            {messageContent && (
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
            
            {/* Render flight search results */}
            {toolParts.map((part, index) => {
              // Handle dynamic tool parts
              if (part.type === 'dynamic-tool' && 'toolName' in part && 
                  part.toolName === 'flightSearch' && 'state' in part && 
                  part.state === 'output-available') {
                const dynamicPart = part as ToolPartWithOutput;
                return (
                  <FlightResults
                    key={`tool-${dynamicPart.toolCallId || index}`}
                    flights={dynamicPart.output?.flights || []}
                    summary={dynamicPart.output?.summary}
                  />
                );
              }
              // Handle static tool parts (tool-flightSearch)
              if (part.type === 'tool-flightSearch' && 'state' in part && 
                  part.state === 'output-available') {
                const toolPart = part as ToolPartWithOutput;
                return (
                  <FlightResults
                    key={`tool-${toolPart.toolCallId || index}`}
                    flights={toolPart.output?.flights || []}
                    summary={toolPart.output?.summary}
                  />
                );
              }
              return null;
            })}
            
            {/* Show tool loading message or "No content" only if there's no text and no tool results */}
            {!messageContent && toolParts.length === 0 && (
              <div className="flex items-center space-x-2">
                {toolLoadingMessage ? (
                  <>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">{toolLoadingMessage}</span>
                  </>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No content</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
