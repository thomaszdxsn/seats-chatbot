import type { CoreMessage } from 'ai';

export interface UIMessage {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  parts?: Array<{ 
    type: string; 
    text?: string;
    toolName?: string;
    toolCallId?: string;
    state?: string;
    output?: unknown;
  }>;
}

export function convertUIMessagesToModelMessages(uiMessages: UIMessage[]): CoreMessage[] {
  return uiMessages.map(message => {
    if (message.content) {
      return {
        role: message.role,
        content: message.content
      } as CoreMessage;
    }
    
    // Process parts and include tool results for AI context
    let content = '';
    
    // Add text parts
    const textParts = message.parts?.filter(part => part.type === 'text' && part.text) || [];
    content += textParts.map(part => part.text).join('');
    
    // Add tool results summary for AI context (only for assistant messages with completed tools)
    if (message.role === 'assistant') {
      const toolParts = message.parts?.filter(part => 
        (part.type === 'dynamic-tool' || part.type?.startsWith('tool-')) && 
        part.state === 'output-available' && 
        part.output
      ) || [];
      
      if (toolParts.length > 0) {
        content += '\n\n[Tool Results for AI Reference]:\n';
        toolParts.forEach(tool => {
          content += `Tool: ${tool.toolName || tool.type}\n`;
          content += `Results: ${JSON.stringify(tool.output, null, 2)}\n\n`;
        });
      }
    }
    
    return {
      role: message.role,
      content: content || ''
    } as CoreMessage;
  });
}