import { FlightResults } from './FlightResults';
import PointsYeahResults from './PointsYeahResults';
import PointsYeahHotelResults from './PointsYeahHotelResults';
import { DateTimeResults } from './DateTimeResults';
import { CollapsibleToolIndicator } from './CollapsibleToolIndicator';
import { LoadingIndicator } from './LoadingIndicator'; // Keep for legacy tools
import { ToolPartWithOutput, type SearchParams } from './types';
import type { PointsYeahResponse } from '@/lib/pointsyeah/flight-api';
import type { PointsYeahHotelResponse, HotelSearchInput } from '@/lib/pointsyeah/hotel-api';

interface ToolRendererProps {
  toolParts: { 
    type: string; 
    toolName?: string; 
    state?: string; 
    toolCallId?: string; 
    output?: { 
      flights?: unknown[]; 
      summary?: string;
      pointsyeah_data?: PointsYeahResponse;
      search_params?: SearchParams;
      pointsyeah_hotel_data?: PointsYeahHotelResponse;
      hotel_search_params?: HotelSearchInput;
      // DateTime tool output
      success?: boolean;
      result?: string;
      error?: string;
      operation?: string;
      timestamp?: string;
    } 
  }[];
}

export function ToolRenderer({ toolParts }: ToolRendererProps) {
  return (
    <>
      {toolParts.map((part, index) => {
        // Handle PointsYeah flight search tool (dynamic) - Loading state
        if (part.type === 'dynamic-tool' && 'toolName' in part && 
            part.toolName === 'pointsYeahFlightSearch' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <CollapsibleToolIndicator 
                key={`tool-loading-${part.toolCallId || index}`}
                toolName="pointsYeahFlightSearch"
                isLoading={true}
              />
            );
          }
          
          // Show results when output is available - with collapsible indicator
          if (part.state === 'output-available') {
            const dynamicPart = part as ToolPartWithOutput;
            if (dynamicPart.output?.pointsyeah_data) {
              return (
                <CollapsibleToolIndicator 
                  key={`tool-${dynamicPart.toolCallId || index}`}
                  toolName="pointsYeahFlightSearch"
                  isCompleted={true}
                  defaultExpanded={false}
                >
                  <PointsYeahResults
                    data={dynamicPart.output.pointsyeah_data}
                    searchParams={dynamicPart.output.search_params}
                  />
                </CollapsibleToolIndicator>
              );
            }
          }
        }
        
        // Handle PointsYeah flight search tool (static)
        if (part.type === 'tool-pointsYeahFlightSearch' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <CollapsibleToolIndicator 
                key={`tool-loading-${part.toolCallId || index}`}
                toolName="pointsYeahFlightSearch"
                isLoading={true}
              />
            );
          }
          
          // Show results when output is available - with collapsible indicator
          if (part.state === 'output-available') {
            const toolPart = part as ToolPartWithOutput;
            if (toolPart.output?.pointsyeah_data) {
              return (
                <CollapsibleToolIndicator 
                  key={`tool-${toolPart.toolCallId || index}`}
                  toolName="pointsYeahFlightSearch"
                  isCompleted={true}
                  defaultExpanded={false}
                >
                  <PointsYeahResults
                    data={toolPart.output.pointsyeah_data}
                    searchParams={toolPart.output.search_params}
                  />
                </CollapsibleToolIndicator>
              );
            }
          }
        }
        
        // Handle legacy flight search tool (dynamic) - temporarily disabled
        if (part.type === 'dynamic-tool' && 'toolName' in part && 
            part.toolName === 'flightSearch' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <div key={`tool-loading-${part.toolCallId || index}`} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <LoadingIndicator message="Searching for flights..." />
              </div>
            );
          }
          
          // Show results when output is available
          if (part.state === 'output-available') {
            const dynamicPart = part as ToolPartWithOutput;
            return (
              <FlightResults
                key={`tool-${dynamicPart.toolCallId || index}`}
                flights={dynamicPart.output?.flights || []}
                summary={dynamicPart.output?.summary}
              />
            );
          }
        }
        
        // Handle legacy flight search tool (static) - temporarily disabled
        if (part.type === 'tool-flightSearch' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <div key={`tool-loading-${part.toolCallId || index}`} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <LoadingIndicator message="Searching for flights..." />
              </div>
            );
          }
          
          // Show results when output is available
          if (part.state === 'output-available') {
            const toolPart = part as ToolPartWithOutput;
            return (
              <FlightResults
                key={`tool-${toolPart.toolCallId || index}`}
                flights={toolPart.output?.flights || []}
                summary={toolPart.output?.summary}
              />
            );
          }
        }
        
        // Handle PointsYeah hotel search tool (dynamic) - Loading state
        if (part.type === 'dynamic-tool' && 'toolName' in part && 
            part.toolName === 'pointsYeahHotelSearch' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <CollapsibleToolIndicator 
                key={`tool-loading-${part.toolCallId || index}`}
                toolName="pointsYeahHotelSearch"
                isLoading={true}
              />
            );
          }
          
          // Show results when output is available - with collapsible indicator
          if (part.state === 'output-available') {
            const dynamicPart = part as ToolPartWithOutput;
            if (dynamicPart.output?.pointsyeah_hotel_data) {
              return (
                <CollapsibleToolIndicator 
                  key={`tool-${dynamicPart.toolCallId || index}`}
                  toolName="pointsYeahHotelSearch"
                  isCompleted={true}
                  defaultExpanded={false}
                >
                  <PointsYeahHotelResults
                    data={dynamicPart.output.pointsyeah_hotel_data}
                    searchParams={dynamicPart.output.hotel_search_params}
                  />
                </CollapsibleToolIndicator>
              );
            }
          }
        }
        
        // Handle PointsYeah hotel search tool (static)
        if (part.type === 'tool-pointsYeahHotelSearch' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <CollapsibleToolIndicator 
                key={`tool-loading-${part.toolCallId || index}`}
                toolName="pointsYeahHotelSearch"
                isLoading={true}
              />
            );
          }
          
          // Show results when output is available - with collapsible indicator
          if (part.state === 'output-available') {
            const toolPart = part as ToolPartWithOutput;
            if (toolPart.output?.pointsyeah_hotel_data) {
              return (
                <CollapsibleToolIndicator 
                  key={`tool-${toolPart.toolCallId || index}`}
                  toolName="pointsYeahHotelSearch"
                  isCompleted={true}
                  defaultExpanded={false}
                >
                  <PointsYeahHotelResults
                    data={toolPart.output.pointsyeah_hotel_data}
                    searchParams={toolPart.output.hotel_search_params}
                  />
                </CollapsibleToolIndicator>
              );
            }
          }
        }
        
        // Handle datetime calculator tool (dynamic)
        if (part.type === 'dynamic-tool' && 'toolName' in part && 
            part.toolName === 'datetimeCalculator' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <CollapsibleToolIndicator 
                key={`tool-loading-${part.toolCallId || index}`}
                toolName="datetimeCalculator"
                isLoading={true}
              />
            );
          }
          
          // Show results when output is available - with collapsible indicator
          if (part.state === 'output-available') {
            const dynamicPart = part as ToolPartWithOutput;
            if (dynamicPart.output && dynamicPart.output.operation) {
              return (
                <CollapsibleToolIndicator 
                  key={`tool-${dynamicPart.toolCallId || index}`}
                  toolName="datetimeCalculator"
                  isCompleted={true}
                  defaultExpanded={false}
                >
                  <DateTimeResults
                    data={{
                      success: dynamicPart.output.success || false,
                      result: dynamicPart.output.result,
                      error: dynamicPart.output.error,
                      operation: dynamicPart.output.operation,
                      timestamp: dynamicPart.output.timestamp || new Date().toISOString()
                    }}
                  />
                </CollapsibleToolIndicator>
              );
            }
          }
        }
        
        // Handle datetime calculator tool (static)
        if (part.type === 'tool-datetimeCalculator' && 'state' in part) {
          
          // Show loading state when tool is being executed
          if (part.state === 'call' || part.state === 'executing') {
            return (
              <CollapsibleToolIndicator 
                key={`tool-loading-${part.toolCallId || index}`}
                toolName="datetimeCalculator"
                isLoading={true}
              />
            );
          }
          
          // Show results when output is available - with collapsible indicator
          if (part.state === 'output-available') {
            const toolPart = part as ToolPartWithOutput;
            if (toolPart.output && toolPart.output.operation) {
              return (
                <CollapsibleToolIndicator 
                  key={`tool-${toolPart.toolCallId || index}`}
                  toolName="datetimeCalculator"
                  isCompleted={true}
                  defaultExpanded={false}
                >
                  <DateTimeResults
                    data={{
                      success: toolPart.output.success || false,
                      result: toolPart.output.result,
                      error: toolPart.output.error,
                      operation: toolPart.output.operation,
                      timestamp: toolPart.output.timestamp || new Date().toISOString()
                    }}
                  />
                </CollapsibleToolIndicator>
              );
            }
          }
        }
        
        return null;
      })}
    </>
  );
}