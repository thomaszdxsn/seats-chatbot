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

  it('shows loading state when status is streaming', () => {
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
  })

  it('disables form controls when streaming', () => {
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      status: 'streaming',
    })

    render(<Home />)
    
    const input = screen.getByPlaceholderText(/enter your travel questions/i)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    expect(input).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  it('shows error message when error exists', () => {
    const mockError = new Error('API connection failed')
    
    mockUseChat.mockReturnValue({
      ...defaultMockReturn,
      error: mockError,
    })

    render(<Home />)
    
    expect(screen.getByText(/error:/i)).toBeInTheDocument()
    expect(screen.getByText(/api connection failed/i)).toBeInTheDocument()
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
    
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument()
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
})