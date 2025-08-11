import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'
import '@testing-library/jest-dom'

// Mock the AI SDK React module
jest.mock('@ai-sdk/react', () => ({
  useChat: jest.fn(),
}))

import { useChat } from '@ai-sdk/react'

const mockUseChat = useChat as jest.Mock

describe('Home Page', () => {
  const defaultMockReturn = {
    messages: [],
    sendMessage: jest.fn(),
    status: 'ready',
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseChat.mockReturnValue(defaultMockReturn)
  })

  it('renders the main heading', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: /travel chatbot/i })).toBeInTheDocument()
  })

  it('displays the subtitle correctly', () => {
    render(<Home />)

    expect(screen.getByText(/your intelligent travel assistant/i)).toBeInTheDocument()
  })

  it('shows welcome message when no messages exist', () => {
    render(<Home />)

    expect(screen.getByText(/start chatting and let me help you plan the perfect trip!/i)).toBeInTheDocument()
  })

  it('renders input field with correct placeholder', () => {
    render(<Home />)

    expect(screen.getByPlaceholderText(/enter your travel questions/i)).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('disables send button when input is empty', () => {
    render(<Home />)

    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeDisabled()
  })

  it('enables send button when input has text', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const input = screen.getByPlaceholderText(/enter your travel questions/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    // Initially disabled
    expect(sendButton).toBeDisabled()

    // Type text
    await user.type(input, 'Hello')

    // Now enabled
    expect(sendButton).toBeEnabled()
  })

  it('displays messages from useChat hook', () => {
    const mockMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello, I need help planning a trip' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'I can help you plan your travel!' }] }
    ]

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      messages: mockMessages,
    })

    render(<Home />)

    expect(screen.getByText('Hello, I need help planning a trip')).toBeInTheDocument()
    expect(screen.getByText('I can help you plan your travel!')).toBeInTheDocument()
  })

  it('shows loading animation when submitted', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'submitted',
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }
      ],
    })

    const { container } = render(<Home />)

    // Check for loading dots
    const loadingDots = container.querySelectorAll('.animate-bounce')
    expect(loadingDots).toHaveLength(3)

    // Check for loading text
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument()
  })

  it('shows loading animation when streaming', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'streaming',
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }
      ],
    })

    const { container } = render(<Home />)

    // Check for loading dots
    const loadingDots = container.querySelectorAll('.animate-bounce')
    expect(loadingDots).toHaveLength(3)

    // Check for loading text
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument()
  })

  it('disables form controls when submitted', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'submitted',
    })

    render(<Home />)

    const input = screen.getByPlaceholderText(/please wait for ai response/i)
    const sendButton = screen.getByRole('button', { name: /sending/i })

    expect(input).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  it('disables form controls when streaming', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'streaming',
    })

    render(<Home />)

    const input = screen.getByPlaceholderText(/please wait for ai response/i)
    const sendButton = screen.getByRole('button', { name: /sending/i })

    expect(input).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  it('shows loading state in send button when submitted', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'submitted',
    })

    render(<Home />)

    const sendButton = screen.getByRole('button', { name: /sending/i })
    expect(sendButton).toBeInTheDocument()
    expect(sendButton).toBeDisabled()

    // Check for spinner in button
    const spinner = sendButton.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('shows loading state in send button when streaming', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'streaming',
    })

    render(<Home />)

    const sendButton = screen.getByRole('button', { name: /sending/i })
    expect(sendButton).toBeInTheDocument()
    expect(sendButton).toBeDisabled()

    // Check for spinner in button
    const spinner = sendButton.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('prevents form submission when submitted', async () => {
    const user = userEvent.setup()
    const mockSendMessage = jest.fn()

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      sendMessage: mockSendMessage,
      status: 'submitted',
    })

    render(<Home />)

    const input = screen.getByPlaceholderText(/please wait for ai response/i)

    // Try to type - should not work as input is disabled
    await user.type(input, 'Test message')

    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('prevents form submission when streaming', async () => {
    const user = userEvent.setup()
    const mockSendMessage = jest.fn()

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      sendMessage: mockSendMessage,
      status: 'streaming',
    })

    render(<Home />)

    const input = screen.getByPlaceholderText(/please wait for ai response/i)

    // Try to type - should not work as input is disabled
    await user.type(input, 'Test message')

    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('shows error message when error exists', () => {
    const mockError = new Error('API connection failed')

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      error: mockError,
    })

    render(<Home />)

    expect(screen.getByText(/connection error/i)).toBeInTheDocument()
    expect(screen.getByText(/api connection failed/i)).toBeInTheDocument()
    expect(screen.getByText(/please check your network connection or proxy settings/i)).toBeInTheDocument()

    // Check retry button exists
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()
  })

  it('shows retry button that can be clicked', async () => {
    const user = userEvent.setup()
    const mockError = new Error('Connection timeout')

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      error: mockError,
    })

    render(<Home />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()

    // Test that retry button is clickable
    await user.click(retryButton)
    // Note: The actual page reload is tested elsewhere
  })

  it('shows retry button when error exists', () => {
    const mockError = new Error('Connection timeout')

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      error: mockError,
    })

    render(<Home />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()
    expect(retryButton).toBeEnabled()
  })

  it('calls sendMessage when form is submitted', async () => {
    const user = userEvent.setup()
    const mockSendMessage = jest.fn()

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      sendMessage: mockSendMessage,
    })

    render(<Home />)

    const input = screen.getByPlaceholderText(/enter your travel questions/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    await user.type(input, 'Test message')
    await user.click(sendButton)

    expect(mockSendMessage).toHaveBeenCalledWith({ text: 'Test message' })
  })

  it('updates input value when typing', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const input = screen.getByPlaceholderText(/enter your travel questions/i) as HTMLInputElement
    await user.type(input, 'Hello')

    expect(input.value).toBe('Hello')
  })

  it('configures useChat hook with transport', () => {
    render(<Home />)

    expect(mockUseChat).toHaveBeenCalledWith(expect.objectContaining({
      transport: expect.any(Object),
    }))
  })

  it('does not show error section when no error', () => {
    render(<Home />)

    expect(screen.queryByText(/connection error/i)).not.toBeInTheDocument()
  })

  it('configures useChat with onError callback', () => {
    render(<Home />)

    expect(mockUseChat).toHaveBeenCalledWith(expect.objectContaining({
      transport: expect.any(Object),
      onError: expect.any(Function),
    }))
  })

  it('displays multiple messages correctly', () => {
    const mockMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'First message' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'First response' }] },
      { id: '3', role: 'user', parts: [{ type: 'text', text: 'Second message' }] },
      { id: '4', role: 'assistant', parts: [{ type: 'text', text: 'Second response' }] }
    ]

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      messages: mockMessages,
    })

    render(<Home />)

    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('First response')).toBeInTheDocument()
    expect(screen.getByText('Second message')).toBeInTheDocument()
    expect(screen.getByText('Second response')).toBeInTheDocument()
  })

  it('restores original messages when canceling edit', async () => {
    const user = userEvent.setup();
    const mockSendMessage = jest.fn();
    const mockSetMessages = jest.fn();

    const originalMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'First message' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'First response' }] },
      { id: '3', role: 'user', parts: [{ type: 'text', text: 'Second message' }] },
      { id: '4', role: 'assistant', parts: [{ type: 'text', text: 'Second response' }] }
    ];

    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      messages: originalMessages,
      sendMessage: mockSendMessage,
      setMessages: mockSetMessages
    });

    render(<Home />);

    // Find the second user message and click edit
    const editButtons = screen.getAllByTitle('Edit message');
    await user.click(editButtons[1]); // Second user message (index 1)

    // Should show editing UI
    expect(screen.getByText(/Editing message/)).toBeInTheDocument();

    // Should have truncated messages
    expect(mockSetMessages).toHaveBeenCalledWith([
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'First message' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'First response' }] }
    ]);

    // Cancel editing
    await user.click(screen.getByText('Cancel'));

    // Should restore original messages
    expect(mockSetMessages).toHaveBeenCalledWith(originalMessages);

    // Should clear editing state
    expect(screen.queryByText(/Editing message/)).not.toBeInTheDocument();
  })
})
