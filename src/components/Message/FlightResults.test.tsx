import { render, screen } from '@testing-library/react';
import { FlightResults } from './FlightResults';
import { FlightData } from './types';

describe('FlightResults', () => {
  const mockFlightData: FlightData[] = [
    {
      departure_airport: { id: 'PVG', name: 'Shanghai Pudong' },
      arrival_airport: { id: 'NRT', name: 'Tokyo Narita' },
      price: 1200,
      type: 'Round trip',
      flights: [
        {
          departure_airport: { id: 'PVG', name: 'Shanghai Pudong', time: '10:00' },
          arrival_airport: { id: 'NRT', name: 'Tokyo Narita', time: '14:00' },
          duration: 240,
          airline: 'ANA',
          airline_logo: 'https://example.com/ana-logo.png',
          flight_number: 'NH920',
          legroom: '32 inch'
        }
      ],
      book_link: 'https://example.com/book'
    },
    {
      departure_airport: { id: 'PVG', name: 'Shanghai Pudong' },
      arrival_airport: { id: 'NRT', name: 'Tokyo Narita' },
      price: 1500,
      type: 'One way',
      flights: [
        {
          departure_airport: { id: 'PVG', name: 'Shanghai Pudong', time: '15:00' },
          arrival_airport: { id: 'NRT', name: 'Tokyo Narita', time: '19:00' },
          duration: 240,
          airline: 'JAL',
          airline_logo: 'https://example.com/jal-logo.png',
          flight_number: 'JL123'
        }
      ]
    }
  ];

  it('should render flight search results header', () => {
    render(<FlightResults flights={mockFlightData} />);
    
    expect(screen.getByText('✈️ Flight Search Results')).toBeInTheDocument();
  });

  it('should render summary when provided', () => {
    const summary = 'Found 2 flights from Shanghai to Tokyo';
    render(<FlightResults flights={mockFlightData} summary={summary} />);
    
    expect(screen.getByText(summary)).toBeInTheDocument();
  });

  it('should render flight information correctly', () => {
    render(<FlightResults flights={mockFlightData} />);
    
    expect(screen.getAllByText('Shanghai Pudong → Tokyo Narita')).toHaveLength(2);
    expect(screen.getAllByText('PVG → NRT')).toHaveLength(2);
    expect(screen.getByText('¥1200')).toBeInTheDocument();
    expect(screen.getByText('Round trip')).toBeInTheDocument();
  });

  it('should render flight segments with airline information', () => {
    render(<FlightResults flights={mockFlightData} />);
    
    expect(screen.getByText('ANA NH920')).toBeInTheDocument();
    expect(screen.getByText('4h 0m • 32 inch')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('should render airline logo with error handling', () => {
    render(<FlightResults flights={mockFlightData} />);
    
    const airlineLogos = screen.getAllByAltText('ANA');
    expect(airlineLogos[0]).toBeInTheDocument();
    expect(airlineLogos[0]).toHaveAttribute('src', 'https://example.com/ana-logo.png');
  });

  it('should render book link when provided', () => {
    render(<FlightResults flights={mockFlightData} />);
    
    const bookLink = screen.getByText('Book Flight →');
    expect(bookLink).toBeInTheDocument();
    expect(bookLink.closest('a')).toHaveAttribute('href', 'https://example.com/book');
    expect(bookLink.closest('a')).toHaveAttribute('target', '_blank');
    expect(bookLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should not render book link when not provided', () => {
    const flightWithoutBookLink = [mockFlightData[1]]; // Second flight has no book_link
    render(<FlightResults flights={flightWithoutBookLink} />);
    
    expect(screen.queryByText('Book Flight →')).not.toBeInTheDocument();
  });

  it('should limit display to 5 flights and show count message', () => {
    const manyFlights = Array(7).fill(mockFlightData[0]);
    render(<FlightResults flights={manyFlights} />);
    
    expect(screen.getByText('Showing 5 of 7 results')).toBeInTheDocument();
  });

  it('should not show count message for 5 or fewer flights', () => {
    render(<FlightResults flights={mockFlightData} />);
    
    expect(screen.queryByText(/Showing \d+ of \d+ results/)).not.toBeInTheDocument();
  });

  it('should render "No flights found" message for empty flights array', () => {
    render(<FlightResults flights={[]} />);
    
    expect(screen.getByText('No flights found')).toBeInTheDocument();
    expect(screen.queryByText('✈️ Flight Search Results')).not.toBeInTheDocument();
  });

  it('should render "No flights found" message for undefined flights', () => {
    render(<FlightResults flights={undefined as unknown as FlightData[]} />);
    
    expect(screen.getByText('No flights found')).toBeInTheDocument();
  });

  it('should handle flight segment without legroom', () => {
    const flightWithoutLegroom: FlightData[] = [
      {
        ...mockFlightData[0],
        flights: [
          {
            departure_airport: { id: 'PVG', name: 'Shanghai Pudong', time: '10:00' },
            arrival_airport: { id: 'NRT', name: 'Tokyo Narita', time: '14:00' },
            duration: 240,
            airline: 'ANA',
            airline_logo: 'https://example.com/ana-logo.png',
            flight_number: 'NH920'
            // No legroom property
          }
        ]
      }
    ];

    render(<FlightResults flights={flightWithoutLegroom} />);
    
    expect(screen.getByText('4h 0m')).toBeInTheDocument();
    expect(screen.queryByText('4h 0m •')).not.toBeInTheDocument();
  });

  it('should handle flights without flight segments', () => {
    const flightWithoutSegments: FlightData[] = [
      {
        departure_airport: { id: 'PVG', name: 'Shanghai Pudong' },
        arrival_airport: { id: 'NRT', name: 'Tokyo Narita' },
        price: 1200,
        type: 'Round trip'
        // No flights array
      }
    ];

    render(<FlightResults flights={flightWithoutSegments} />);
    
    expect(screen.getByText('Shanghai Pudong → Tokyo Narita')).toBeInTheDocument();
    expect(screen.getByText('¥1200')).toBeInTheDocument();
    expect(screen.queryByText('ANA')).not.toBeInTheDocument();
  });
});