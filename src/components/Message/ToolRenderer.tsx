import { FlightResults } from './FlightResults';
import { ToolPartWithOutput } from './types';

interface ToolRendererProps {
  toolParts: { type: string; toolName?: string; state?: string; toolCallId?: string; output?: { flights?: unknown[]; summary?: string } }[];
}

export function ToolRenderer({ toolParts }: ToolRendererProps) {
  return (
    <>
      {toolParts.map((part, index) => {
        // Handle dynamic tool parts
        if (part.type === 'dynamic-tool' && 'toolName' in part && 
            part.toolName === 'flightSearch' && 'state' in part && 
            part.state === 'output-available') {
          const dynamicPart = part as ToolPartWithOutput;
          return (
            <FlightResults
              key={`tool-${dynamicPart.toolCallId || index}`}
              flights={dynamicPart.output?.flights || []}
              summary={dynamicPart.output?.summary}
            />
          );
        }
        // Handle static tool parts (tool-flightSearch)
        if (part.type === 'tool-flightSearch' && 'state' in part && 
            part.state === 'output-available') {
          const toolPart = part as ToolPartWithOutput;
          return (
            <FlightResults
              key={`tool-${toolPart.toolCallId || index}`}
              flights={toolPart.output?.flights || []}
              summary={toolPart.output?.summary}
            />
          );
        }
        return null;
      })}
    </>
  );
}