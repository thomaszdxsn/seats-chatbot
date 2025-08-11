import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

describe('ChatInput Component', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('renders input field and send button', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    expect(screen.getByPlaceholderText('Enter your travel questions...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter your travel questions...');
    const sendButton = screen.getByRole('button', { name: 'Send' });
    
    await user.type(input, 'Hello, I want to book a hotel');
    await user.click(sendButton);
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello, I want to book a hotel');
  });

  it('calls onSendMessage when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter your travel questions...');
    
    await user.type(input, 'I need help with flights');
    await user.keyboard('{Enter}');
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('I need help with flights');
  });

  it('clears input after sending message', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter your travel questions...');
    
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    expect(input).toHaveValue('');
  });

  it('does not send empty or whitespace-only messages', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter your travel questions...');
    const sendButton = screen.getByRole('button', { name: 'Send' });
    
    // Try sending empty message
    await user.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
    
    // Try sending whitespace-only message
    await user.type(input, '   ');
    await user.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('trims whitespace from messages', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter your travel questions...');
    
    await user.type(input, '  Hello world  ');
    await user.keyboard('{Enter}');
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello world');
  });

  it('disables input and button when loading', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Please wait for AI response...');
    const sendButton = screen.getByRole('button');
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('shows loading state in button when loading', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    expect(screen.getByText('Sending')).toBeInTheDocument();
    expect(screen.queryByText('Send')).not.toBeInTheDocument();
  });

  it('shows spinner in button when loading', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('does not submit when loading', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Please wait for AI response...');
    
    // Try typing and submitting while loading
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('prevents submission of empty message even when not loading', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const sendButton = screen.getByRole('button', { name: 'Send' });
    
    expect(sendButton).toBeDisabled();
    
    await user.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('enables send button when input has content', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter your travel questions...');
    const sendButton = screen.getByRole('button', { name: 'Send' });
    
    expect(sendButton).toBeDisabled();
    
    await user.type(input, 'Hello');
    
    expect(sendButton).not.toBeDisabled();
  });

  it('shows editing state when isEditing is true', () => {
    render(
      <ChatInput 
        onSendMessage={mockOnSendMessage} 
        isLoading={false}
        isEditing={true}
        editingContent="Edit this message"
      />
    );

    expect(screen.getByText('✏️ Editing message - submit to update and regenerate response')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit this message')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('shows cancel button when editing', () => {
    const mockOnCancelEdit = jest.fn();
    
    render(
      <ChatInput 
        onSendMessage={mockOnSendMessage} 
        isLoading={false}
        isEditing={true}
        editingContent="Edit this message"
        onCancelEdit={mockOnCancelEdit}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancelEdit when cancel button is clicked', async () => {
    const mockOnCancelEdit = jest.fn();
    const user = userEvent.setup();
    
    render(
      <ChatInput 
        onSendMessage={mockOnSendMessage} 
        isLoading={false}
        isEditing={true}
        editingContent="Edit this message"
        onCancelEdit={mockOnCancelEdit}
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(mockOnCancelEdit).toHaveBeenCalled();
  });

  it('updates input when editingContent changes', () => {
    const { rerender } = render(
      <ChatInput 
        onSendMessage={mockOnSendMessage} 
        isLoading={false}
        isEditing={true}
        editingContent="Original message"
      />
    );

    expect(screen.getByDisplayValue('Original message')).toBeInTheDocument();

    rerender(
      <ChatInput 
        onSendMessage={mockOnSendMessage} 
        isLoading={false}
        isEditing={true}
        editingContent="Updated message"
      />
    );

    expect(screen.getByDisplayValue('Updated message')).toBeInTheDocument();
  });
});