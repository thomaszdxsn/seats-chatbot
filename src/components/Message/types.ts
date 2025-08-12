/**
 * Type definitions for Message components
 */

export interface FlightData {
  departure_airport?: { id: string; name: string };
  arrival_airport?: { id: string; name: string };
  flights?: Array<{
    departure_airport?: { id: string; name: string; time: string };
    arrival_airport?: { id: string; name: string; time: string };
    duration: number;
    airline: string;
    airline_logo: string;
    flight_number: string;
    legroom?: string;
  }>;
  price: number;
  type: string;
  book_link?: string;
}

export type ToolPartWithOutput = {
  toolCallId: string;
  state: 'output-available';
  output?: {
    flights?: FlightData[];
    summary?: string;
  };
};