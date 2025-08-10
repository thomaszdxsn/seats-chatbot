import type { CoreMessage } from 'ai';

export interface UIMessage {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  parts?: Array<{ type: string; text: string }>;
}

export function convertUIMessagesToModelMessages(uiMessages: UIMessage[]): CoreMessage[] {
  return uiMessages.map(message => {
    if (message.content) {
      return {
        role: message.role,
        content: message.content
      } as CoreMessage;
    }
    return {
      role: message.role,
      content: message.parts?.map((part) => part.text).join('') || ''
    } as CoreMessage;
  });
}