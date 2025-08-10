import { render, screen } from '@testing-library/react';
import { MessageList } from './MessageList';

describe('MessageList Component', () => {
  const mockMessages = [
    {
      id: '1',
      role: 'user' as const,
      parts: [{ type: 'text', text: 'Hello, I need help with my trip' }]
    },
    {
      id: '2', 
      role: 'assistant' as const,
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
});