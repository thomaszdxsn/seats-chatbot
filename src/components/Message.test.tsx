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
    expect(messageElement).toHaveClass('bg-blue-500 text-white');
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

  it('shows flight search loading state when tool is being called', () => {
    const toolParts: UIMessagePart<UIDataTypes, UITools>[] = [
      { type: 'dynamic-tool', toolName: 'flightSearch', toolCallId: 'call-123', state: 'call' } as UIMessagePart<UIDataTypes, UITools>
    ];
    
    render(
      <Message 
        id="test-9" 
        role="assistant" 
        parts={toolParts} 
      />
    );

    expect(screen.getByText('Searching for flights...')).toBeInTheDocument();
    expect(screen.queryByText('No content')).not.toBeInTheDocument();
  });

  it('shows generic loading state for unknown tool calls', () => {
    const toolParts: UIMessagePart<UIDataTypes, UITools>[] = [
      { type: 'dynamic-tool', toolName: 'unknownTool', toolCallId: 'call-456', state: 'call' } as UIMessagePart<UIDataTypes, UITools>
    ];
    
    render(
      <Message 
        id="test-10" 
        role="assistant" 
        parts={toolParts} 
      />
    );

    expect(screen.getByText('Processing request...')).toBeInTheDocument();
    expect(screen.queryByText('No content')).not.toBeInTheDocument();
  });

  it('shows flight results when tool output is available', () => {
    const mockFlightData = [{
      departure_airport: { id: 'PVG', name: 'Shanghai Pudong' },
      arrival_airport: { id: 'NRT', name: 'Tokyo Narita' },
      price: 1200,
      type: 'Round trip',
      flights: [{
        departure_airport: { id: 'PVG', name: 'Shanghai Pudong', time: '10:00' },
        arrival_airport: { id: 'NRT', name: 'Tokyo Narita', time: '14:00' },
        duration: 240,
        airline: 'ANA',
        airline_logo: 'https://example.com/ana-logo.png',
        flight_number: 'NH920'
      }]
    }];

    const toolParts: UIMessagePart<UIDataTypes, UITools>[] = [
      { 
        type: 'dynamic-tool', 
        toolName: 'flightSearch', 
        toolCallId: 'call-789', 
        state: 'output-available',
        output: { flights: mockFlightData, summary: 'Found 1 flight' }
      } as UIMessagePart<UIDataTypes, UITools>
    ];
    
    render(
      <Message 
        id="test-11" 
        role="assistant" 
        parts={toolParts} 
      />
    );

    expect(screen.getByText('✈️ Flight Search Results')).toBeInTheDocument();
    expect(screen.getByText('Shanghai Pudong → Tokyo Narita')).toBeInTheDocument();
    expect(screen.getByText('¥1200')).toBeInTheDocument();
  });

  it('handles tool parts with static tool type', () => {
    const toolParts: UIMessagePart<UIDataTypes, UITools>[] = [
      { type: 'tool-flightSearch', toolCallId: 'call-static', state: 'call' } as UIMessagePart<UIDataTypes, UITools>
    ];
    
    render(
      <Message 
        id="test-12" 
        role="assistant" 
        parts={toolParts} 
      />
    );

    expect(screen.getByText('Searching for flights...')).toBeInTheDocument();
  });

  it('shows loading animation for active tool calls', () => {
    const toolParts: UIMessagePart<UIDataTypes, UITools>[] = [
      { type: 'dynamic-tool', toolName: 'flightSearch', toolCallId: 'call-anim', state: 'call' } as UIMessagePart<UIDataTypes, UITools>
    ];
    
    render(
      <Message 
        id="test-13" 
        role="assistant" 
        parts={toolParts} 
      />
    );

    // Check for animated loading dots
    const container = screen.getByText('Searching for flights...').parentElement;
    const dots = container?.querySelectorAll('.w-2.h-2.bg-blue-400.rounded-full.animate-bounce') || [];
    
    expect(dots).toHaveLength(3);
  });
});