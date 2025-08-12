/**
 * Helper functions for Message component
 */

/**
 * Copy text to clipboard with fallback for older browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Extract text content from message parts
 */
export const extractTextContent = (parts: { type: string; text?: string }[] | undefined): string => {
  const textParts = parts?.filter(part => part.type === 'text') || [];
  return textParts.map(part => 'text' in part ? part.text : '').join('');
};

/**
 * Extract tool parts with completed output
 */
export const extractToolPartsWithOutput = (parts: { type: string; state?: string }[] | undefined) => {
  return parts?.filter(part => {
    if (part.type === 'dynamic-tool') {
      return 'state' in part && part.state === 'output-available';
    }
    if (part.type.startsWith('tool-')) {
      return 'state' in part && part.state === 'output-available';
    }
    return false;
  }) || [];
};

/**
 * Extract active tool parts (being called but not yet completed)
 */
export const extractActiveToolParts = (parts: { type: string; state?: string }[] | undefined) => {
  return parts?.filter(part => {
    if (part.type === 'dynamic-tool') {
      return 'state' in part && part.state !== 'output-available';
    }
    if (part.type.startsWith('tool-')) {
      return 'state' in part && part.state !== 'output-available';
    }
    return false;
  }) || [];
};

/**
 * Get loading message for active tool parts
 */
export const getToolLoadingMessage = (activeToolParts: { type: string; toolName?: string }[]): string | null => {
  if (activeToolParts.length === 0) return null;
  
  for (const part of activeToolParts) {
    if (part.type === 'dynamic-tool' && 'toolName' in part) {
      if (part.toolName === 'pointsYeahFlightSearch') {
        return 'Searching for reward flights...';
      }
      if (part.toolName === 'pointsYeahHotelSearch') {
        return 'Searching for reward hotels...';
      }
      if (part.toolName === 'flightSearch') {
        return 'Searching for flights...';
      }
    }
    if (part.type === 'tool-pointsYeahFlightSearch') {
      return 'Searching for reward flights...';
    }
    if (part.type === 'tool-pointsYeahHotelSearch') {
      return 'Searching for reward hotels...';
    }
    if (part.type === 'tool-flightSearch') {
      return 'Searching for flights...';
    }
  }
  
  return 'Processing request...';
};