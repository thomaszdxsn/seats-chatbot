import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageActions } from './MessageActions';

// Mock the helpers module
jest.mock('./helpers', () => ({
  copyToClipboard: jest.fn(),
}));

import { copyToClipboard } from './helpers';

describe('MessageActions', () => {
  const defaultProps = {
    isUser: true,
    messageContent: 'Test message content',
    messageId: 'test-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render copy button', () => {
    render(<MessageActions {...defaultProps} />);
    
    expect(screen.getByTitle('Copy message')).toBeInTheDocument();
  });

  it('should call onCopy and copyToClipboard when copy button is clicked', async () => {
    const mockOnCopy = jest.fn();
    const mockCopyToClipboard = copyToClipboard as jest.MockedFunction<typeof copyToClipboard>;
    mockCopyToClipboard.mockResolvedValue(true);

    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} onCopy={mockOnCopy} />);
    
    await user.click(screen.getByTitle('Copy message'));

    expect(mockOnCopy).toHaveBeenCalledWith('Test message content');
    expect(mockCopyToClipboard).toHaveBeenCalledWith('Test message content');
  });

  it('should show success state temporarily after successful copy', async () => {
    const mockCopyToClipboard = copyToClipboard as jest.MockedFunction<typeof copyToClipboard>;
    mockCopyToClipboard.mockResolvedValue(true);

    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} />);
    
    await user.click(screen.getByTitle('Copy message'));

    expect(screen.getByTitle('Copied!')).toBeInTheDocument();
    
    // Wait for the success state to clear
    await waitFor(() => {
      expect(screen.getByTitle('Copy message')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should not show success state if copy fails', async () => {
    const mockCopyToClipboard = copyToClipboard as jest.MockedFunction<typeof copyToClipboard>;
    mockCopyToClipboard.mockResolvedValue(false);

    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} />);
    
    await user.click(screen.getByTitle('Copy message'));

    expect(screen.getByTitle('Copy message')).toBeInTheDocument();
    expect(screen.queryByTitle('Copied!')).not.toBeInTheDocument();
  });

  it('should render edit button for user messages when onEdit is provided', () => {
    const mockOnEdit = jest.fn();

    render(<MessageActions {...defaultProps} isUser={true} onEdit={mockOnEdit} />);
    
    expect(screen.getByTitle('Edit message')).toBeInTheDocument();
  });

  it('should not render edit button for assistant messages', () => {
    const mockOnEdit = jest.fn();

    render(<MessageActions {...defaultProps} isUser={false} onEdit={mockOnEdit} />);
    
    expect(screen.queryByTitle('Edit message')).not.toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const mockOnEdit = jest.fn();
    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} onEdit={mockOnEdit} />);
    
    await user.click(screen.getByTitle('Edit message'));

    expect(mockOnEdit).toHaveBeenCalledWith('test-id', 'Test message content');
  });

  it('should render resend button for user messages when onResend is provided', () => {
    const mockOnResend = jest.fn();

    render(<MessageActions {...defaultProps} isUser={true} onResend={mockOnResend} />);
    
    expect(screen.getByTitle('Resend message')).toBeInTheDocument();
  });

  it('should not render resend button for assistant messages', () => {
    const mockOnResend = jest.fn();

    render(<MessageActions {...defaultProps} isUser={false} onResend={mockOnResend} />);
    
    expect(screen.queryByTitle('Resend message')).not.toBeInTheDocument();
  });

  it('should call onResend when resend button is clicked', async () => {
    const mockOnResend = jest.fn();
    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} onResend={mockOnResend} />);
    
    await user.click(screen.getByTitle('Resend message'));

    expect(mockOnResend).toHaveBeenCalledWith('test-id', 'Test message content');
  });

  it('should not call onEdit when edit button is clicked and messageContent is empty', async () => {
    const mockOnEdit = jest.fn();
    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} messageContent="" onEdit={mockOnEdit} />);
    
    await user.click(screen.getByTitle('Edit message'));

    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('should not call onResend when resend button is clicked and messageContent is empty', async () => {
    const mockOnResend = jest.fn();
    const user = userEvent.setup();

    render(<MessageActions {...defaultProps} messageContent="" onResend={mockOnResend} />);
    
    await user.click(screen.getByTitle('Resend message'));

    expect(mockOnResend).not.toHaveBeenCalled();
  });
});