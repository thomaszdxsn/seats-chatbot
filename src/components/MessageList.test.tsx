import { render, screen } from '@testing-library/react';
import { MessageList } from './MessageList';
import type { UIMessage, UIMessagePart } from 'ai';

// Test type to avoid using 'any' in tests
type TestToolPart = UIMessagePart<Record<string, unknown>, Record<string, unknown>>;

describe('MessageList Component', () => {
  const mockMessages: UIMessage[] = [
    {
      id: '1',
      role: 'user',
      parts: [{ type: 'text', text: 'Hello, I need help with my trip' }]
    },
    {
      id: '2', 
      role: 'assistant',
      parts: [{ type: 'text', text: 'I can help you plan your travel!' }]
    }
  ];

  it('renders empty state when no messages', () => {
    render(<MessageList messages={[]} isLoading={false} />);
    
    expect(screen.getByText('Start chatting and let me help you plan the perfect trip!')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    render(<MessageList messages={mockMessages} isLoading={false} />);
    
    expect(screen.getByText('Hello, I need help with my trip')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toHaveTextContent('I can help you plan your travel!');
  });

  it('shows loading indicator when isLoading is true', () => {
    render(<MessageList messages={mockMessages} isLoading={true} />);
    
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    expect(screen.getByText('Hello, I need help with my trip')).toBeInTheDocument();
  });

  it('does not show loading indicator when isLoading is false', () => {
    render(<MessageList messages={mockMessages} isLoading={false} />);
    
    expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
  });

  it('renders loading dots with correct animation delays', () => {
    // Need to provide some messages, otherwise it shows empty state instead of loading
    render(<MessageList messages={mockMessages} isLoading={true} />);
    
    // Look for the loading dots by their specific classes
    const container = screen.getByText('AI is thinking...').parentElement;
    const dots = container?.querySelectorAll('.w-2.h-2.bg-gray-400.rounded-full.animate-bounce') || [];
    
    expect(dots).toHaveLength(3);
  });

  it('handles single message correctly', () => {
    const singleMessage = [mockMessages[0]];
    render(<MessageList messages={singleMessage} isLoading={false} />);
    
    expect(screen.getByText('Hello, I need help with my trip')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
  });

  it('maintains message order', () => {
    render(<MessageList messages={mockMessages} isLoading={false} />);
    
    const messages = screen.getAllByText(/Hello, I need help with my trip|I can help you plan your travel!/);
    expect(messages).toHaveLength(2);
    
    // First message should be the user message
    expect(messages[0]).toHaveTextContent('Hello, I need help with my trip');
  });

  it('applies correct spacing between messages', () => {
    render(<MessageList messages={mockMessages} isLoading={false} />);
    
    const messagesContainer = screen.getByText('Hello, I need help with my trip').closest('.space-y-4');
    expect(messagesContainer).toBeInTheDocument();
  });

  it('does not show global loading when assistant message has active tool calls', () => {
    const messagesWithToolCall: UIMessage[] = [
      ...mockMessages,
      {
        id: '3',
        role: 'assistant',
        parts: [
          { type: 'dynamic-tool', toolName: 'flightSearch', toolCallId: 'call-123', state: 'call' } as TestToolPart
        ]
      }
    ];
    
    render(<MessageList messages={messagesWithToolCall} isLoading={true} />);
    
    // Should not show global loading indicator
    expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
    // Should show tool-specific loading within the message
    expect(screen.getByText('Searching for flights...')).toBeInTheDocument();
  });

  it('shows global loading when isLoading is true and no active tool calls', () => {
    render(<MessageList messages={mockMessages} isLoading={true} />);
    
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
  });

  it('handles assistant message with completed tool calls', () => {
    const messagesWithCompletedTool: UIMessage[] = [
      ...mockMessages,
      {
        id: '3',
        role: 'assistant',
        parts: [
          { 
            type: 'dynamic-tool', 
            toolName: 'flightSearch', 
            toolCallId: 'call-456', 
            state: 'output-available',
            output: { flights: [], summary: 'No flights found' }
          } as TestToolPart
        ]
      }
    ];
    
    render(<MessageList messages={messagesWithCompletedTool} isLoading={true} />);
    
    // Should show global loading since tool is completed
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
  });

  it('handles static tool types in active tool call detection', () => {
    const messagesWithStaticTool: UIMessage[] = [
      ...mockMessages,
      {
        id: '3',
        role: 'assistant',
        parts: [
          { type: 'tool-flightSearch', toolCallId: 'call-static', state: 'call' } as TestToolPart
        ]
      }
    ];
    
    render(<MessageList messages={messagesWithStaticTool} isLoading={true} />);
    
    // Should not show global loading
    expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
    // Should show tool-specific loading
    expect(screen.getByText('Searching for flights...')).toBeInTheDocument();
  });

  it('handles user message as last message when isLoading', () => {
    const messagesEndingWithUser: UIMessage[] = [
      ...mockMessages,
      {
        id: '3',
        role: 'user',
        parts: [{ type: 'text', text: 'Find me flights to Paris' }]
      }
    ];
    
    render(<MessageList messages={messagesEndingWithUser} isLoading={true} />);
    
    // Should show global loading since last message is user message
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
  });

  it('handles empty messages array when checking for active tools', () => {
    render(<MessageList messages={[]} isLoading={true} />);
    
    // Should show empty state, not loading indicator
    expect(screen.getByText('Start chatting and let me help you plan the perfect trip!')).toBeInTheDocument();
    expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
  });
});