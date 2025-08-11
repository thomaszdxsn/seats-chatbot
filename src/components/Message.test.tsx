import { render, screen } from '@testing-library/react';
import { Message } from './Message';
import type { UIMessagePart, UIDataTypes, UITools } from 'ai';

describe('Message Component', () => {
  const mockMessageParts: UIMessagePart<UIDataTypes, UITools>[] = [{ type: 'text', text: 'Hello, this is a test message' }];

  it('renders user message correctly', () => {
    render(
      <Message 
        id="test-1" 
        role="user" 
        parts={mockMessageParts} 
      />
    );

    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    
    // Check if user message has correct styling
    const messageElement = screen.getByText('Hello, this is a test message').parentElement;
    expect(messageElement).toHaveClass('bg-blue-500', 'text-white');
  });

  it('renders assistant message with markdown support', () => {
    const markdownParts: UIMessagePart<UIDataTypes, UITools>[] = [{ type: 'text', text: '# Hello World\n\nThis is **bold** text.' }];
    
    render(
      <Message 
        id="test-2" 
        role="assistant" 
        parts={markdownParts} 
      />
    );

    // The markdown mock should render the text content
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
    // Note: HTML normalizes whitespace, so \n\n becomes a single space
    expect(screen.getByTestId('markdown')).toHaveTextContent('# Hello World This is **bold** text.');
  });

  it('renders system message correctly', () => {
    render(
      <Message 
        id="test-3" 
        role="system" 
        parts={mockMessageParts} 
      />
    );

    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    
    // System messages should be styled like assistant messages
    const messageElement = screen.getByTestId('markdown');
    expect(messageElement).toBeInTheDocument();
  });

  it('handles message without parts', () => {
    render(
      <Message 
        id="test-4" 
        role="user" 
        parts={undefined} 
      />
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('handles empty parts array', () => {
    render(
      <Message 
        id="test-5" 
        role="user" 
        parts={[]} 
      />
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('concatenates multiple text parts', () => {
    const multiParts: UIMessagePart<UIDataTypes, UITools>[] = [
      { type: 'text', text: 'First part ' },
      { type: 'text', text: 'Second part' }
    ];
    
    render(
      <Message 
        id="test-6" 
        role="user" 
        parts={multiParts} 
      />
    );

    expect(screen.getByText('First part Second part')).toBeInTheDocument();
  });

  it('applies correct layout classes for user messages', () => {
    render(
      <Message 
        id="test-7" 
        role="user" 
        parts={mockMessageParts} 
      />
    );

    const containerDiv = screen.getByText('Hello, this is a test message').parentElement?.parentElement;
    expect(containerDiv).toHaveClass('justify-end');
  });

  it('applies correct layout classes for assistant messages', () => {
    render(
      <Message 
        id="test-8" 
        role="assistant" 
        parts={mockMessageParts} 
      />
    );

    const containerDiv = screen.getByTestId('markdown').parentElement?.parentElement?.parentElement?.parentElement;
    expect(containerDiv).toHaveClass('justify-start');
  });
});