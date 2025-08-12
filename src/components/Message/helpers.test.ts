import {
  copyToClipboard,
  extractTextContent,
  extractToolPartsWithOutput,
  extractActiveToolParts,
  getToolLoadingMessage
} from './helpers';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock document.execCommand
Object.assign(document, {
  execCommand: jest.fn(),
});

describe('helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should use modern clipboard API when available', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      (navigator.clipboard.writeText as jest.Mock) = mockWriteText;

      const result = await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should fall back to execCommand when clipboard API fails', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard failed'));
      const mockExecCommand = jest.fn().mockReturnValue(true);
      (navigator.clipboard.writeText as jest.Mock) = mockWriteText;
      (document.execCommand as jest.Mock) = mockExecCommand;

      // Mock DOM methods
      const mockTextArea = {
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      };
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockTextArea as unknown as HTMLTextAreaElement);
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

      const result = await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(mockTextArea.value).toBe('test text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('should return false when both methods fail', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard failed'));
      const mockExecCommand = jest.fn().mockReturnValue(false);
      (navigator.clipboard.writeText as jest.Mock) = mockWriteText;
      (document.execCommand as jest.Mock) = mockExecCommand;

      // Mock DOM methods
      const mockTextArea = {
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      };
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockTextArea as unknown as HTMLTextAreaElement);
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
    });
  });

  describe('extractTextContent', () => {
    it('should extract text from text parts', () => {
      const parts = [
        { type: 'text', text: 'Hello ' },
        { type: 'text', text: 'World' },
        { type: 'other', data: 'ignored' }
      ];

      const result = extractTextContent(parts);
      expect(result).toBe('Hello World');
    });

    it('should return empty string for undefined parts', () => {
      const result = extractTextContent(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty array', () => {
      const result = extractTextContent([]);
      expect(result).toBe('');
    });

    it('should handle parts without text property', () => {
      const parts = [
        { type: 'text', text: 'Valid' },
        { type: 'text', notText: 'Invalid' }
      ];

      const result = extractTextContent(parts);
      expect(result).toBe('Valid');
    });
  });

  describe('extractToolPartsWithOutput', () => {
    it('should extract dynamic tool parts with output-available state', () => {
      const parts = [
        { type: 'dynamic-tool', state: 'output-available', toolName: 'flightSearch' },
        { type: 'dynamic-tool', state: 'input-streaming', toolName: 'flightSearch' },
        { type: 'text', text: 'ignored' }
      ];

      const result = extractToolPartsWithOutput(parts);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('output-available');
    });

    it('should extract tool-prefixed parts with output-available state', () => {
      const parts = [
        { type: 'tool-flightSearch', state: 'output-available' },
        { type: 'tool-flightSearch', state: 'input-streaming' },
        { type: 'text', text: 'ignored' }
      ];

      const result = extractToolPartsWithOutput(parts);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('output-available');
    });

    it('should return empty array for undefined parts', () => {
      const result = extractToolPartsWithOutput(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('extractActiveToolParts', () => {
    it('should extract dynamic tool parts that are not output-available', () => {
      const parts = [
        { type: 'dynamic-tool', state: 'input-streaming', toolName: 'flightSearch' },
        { type: 'dynamic-tool', state: 'output-available', toolName: 'flightSearch' },
        { type: 'text', text: 'ignored' }
      ];

      const result = extractActiveToolParts(parts);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('input-streaming');
    });

    it('should extract tool-prefixed parts that are not output-available', () => {
      const parts = [
        { type: 'tool-flightSearch', state: 'input-streaming' },
        { type: 'tool-flightSearch', state: 'output-available' },
        { type: 'text', text: 'ignored' }
      ];

      const result = extractActiveToolParts(parts);
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('input-streaming');
    });

    it('should return empty array for undefined parts', () => {
      const result = extractActiveToolParts(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('getToolLoadingMessage', () => {
    it('should return null for empty active tool parts', () => {
      const result = getToolLoadingMessage([]);
      expect(result).toBeNull();
    });

    it('should return flight search message for flightSearch tool', () => {
      const parts = [
        { type: 'dynamic-tool', toolName: 'flightSearch', state: 'input-streaming' }
      ];

      const result = getToolLoadingMessage(parts);
      expect(result).toBe('Searching for flights...');
    });

    it('should return flight search message for tool-flightSearch type', () => {
      const parts = [
        { type: 'tool-flightSearch', state: 'input-streaming' }
      ];

      const result = getToolLoadingMessage(parts);
      expect(result).toBe('Searching for flights...');
    });

    it('should return generic message for unknown tools', () => {
      const parts = [
        { type: 'dynamic-tool', toolName: 'unknownTool', state: 'input-streaming' }
      ];

      const result = getToolLoadingMessage(parts);
      expect(result).toBe('Processing request...');
    });
  });
});