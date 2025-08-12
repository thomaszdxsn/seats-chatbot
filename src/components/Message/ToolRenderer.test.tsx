import { render, screen } from '@testing-library/react';
import { ToolRenderer } from './ToolRenderer';

describe('ToolRenderer', () => {
  it('should render flight results for dynamic tool parts with output', () => {
    const mockFlightData = [
      {
        departure_airport: { id: 'PVG', name: 'Shanghai Pudong' },
        arrival_airport: { id: 'NRT', name: 'Tokyo Narita' },
        price: 1200,
        type: 'Round trip'
      }
    ];

    const toolParts = [
      {
        type: 'dynamic-tool',
        toolName: 'flightSearch',
        state: 'output-available',
        toolCallId: 'call-123',
        output: {
          flights: mockFlightData,
          summary: 'Found 1 flight'
        }
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    expect(screen.getByText('✈️ Flight Search Results')).toBeInTheDocument();
    expect(screen.getByText('Shanghai Pudong → Tokyo Narita')).toBeInTheDocument();
    expect(screen.getByText('Found 1 flight')).toBeInTheDocument();
  });

  it('should render flight results for static tool parts with output', () => {
    const mockFlightData = [
      {
        departure_airport: { id: 'LAX', name: 'Los Angeles' },
        arrival_airport: { id: 'JFK', name: 'New York JFK' },
        price: 500,
        type: 'One way'
      }
    ];

    const toolParts = [
      {
        type: 'tool-flightSearch',
        state: 'output-available',
        toolCallId: 'call-456',
        output: {
          flights: mockFlightData
        }
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    expect(screen.getByText('✈️ Flight Search Results')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles → New York JFK')).toBeInTheDocument();
  });

  it('should not render anything for tool parts without output-available state', () => {
    const toolParts = [
      {
        type: 'dynamic-tool',
        toolName: 'flightSearch',
        state: 'input-streaming',
        toolCallId: 'call-789'
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    expect(screen.queryByText('✈️ Flight Search Results')).not.toBeInTheDocument();
  });

  it('should not render anything for non-flight tool parts', () => {
    const toolParts = [
      {
        type: 'dynamic-tool',
        toolName: 'otherTool',
        state: 'output-available',
        toolCallId: 'call-other'
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    expect(screen.queryByText('✈️ Flight Search Results')).not.toBeInTheDocument();
  });

  it('should handle empty tool parts array', () => {
    render(<ToolRenderer toolParts={[]} />);

    expect(screen.queryByText('✈️ Flight Search Results')).not.toBeInTheDocument();
  });

  it('should handle tool parts with empty flight data', () => {
    const toolParts = [
      {
        type: 'dynamic-tool',
        toolName: 'flightSearch',
        state: 'output-available',
        toolCallId: 'call-empty',
        output: {
          flights: [],
          summary: 'No flights found'
        }
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    expect(screen.getByText('No flights found')).toBeInTheDocument();
  });

  it('should handle tool parts without output property', () => {
    const toolParts = [
      {
        type: 'dynamic-tool',
        toolName: 'flightSearch',
        state: 'output-available',
        toolCallId: 'call-no-output'
        // No output property
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    expect(screen.getByText('No flights found')).toBeInTheDocument();
  });

  it('should render multiple tool results', () => {
    const mockFlightData1 = [
      {
        departure_airport: { id: 'PVG', name: 'Shanghai Pudong' },
        arrival_airport: { id: 'NRT', name: 'Tokyo Narita' },
        price: 1200,
        type: 'Round trip'
      }
    ];

    const mockFlightData2 = [
      {
        departure_airport: { id: 'LAX', name: 'Los Angeles' },
        arrival_airport: { id: 'JFK', name: 'New York JFK' },
        price: 500,
        type: 'One way'
      }
    ];

    const toolParts = [
      {
        type: 'dynamic-tool',
        toolName: 'flightSearch',
        state: 'output-available',
        toolCallId: 'call-1',
        output: { flights: mockFlightData1 }
      },
      {
        type: 'tool-flightSearch',
        state: 'output-available',
        toolCallId: 'call-2',
        output: { flights: mockFlightData2 }
      }
    ];

    render(<ToolRenderer toolParts={toolParts} />);

    // Should render both flight results
    const flightResultsHeaders = screen.getAllByText('✈️ Flight Search Results');
    expect(flightResultsHeaders).toHaveLength(2);
    
    expect(screen.getByText('Shanghai Pudong → Tokyo Narita')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles → New York JFK')).toBeInTheDocument();
  });
});