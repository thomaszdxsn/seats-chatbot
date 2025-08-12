/**
 * SerpAPI Flight Search Implementation
 * 
 * This file implements flight search functionality using SerpAPI's Google Flights engine.
 * API Provider: SerpAPI (https://serpapi.com/)
 * Engine: Google Flights
 * SDK: google-search-results-nodejs
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GoogleSearch } = require('google-search-results-nodejs');

export interface FlightSearchParams {
  departureId: string;
  arrivalId: string;
  outboundDate: string;
  returnDate?: string;
  type?: number; // 1=Round Trip, 2=One Way, 3=Multi City
  currency?: string;
  language?: string;
  country?: string;
}

export interface FlightResult {
  departure_airport: {
    id: string;
    name: string;
  };
  arrival_airport: {
    id: string;
    name: string;
  };
  flights: Array<{
    departure_airport: {
      id: string;
      name: string;
      time: string;
    };
    arrival_airport: {
      id: string;
      name: string;
      time: string;
    };
    duration: number;
    airline: string;
    airline_logo: string;
    flight_number: string;
    legroom?: string;
    extensions?: string[];
  }>;
  price: number;
  type: string;
  book_link?: string;
}

interface SerpApiFlightSegment {
  departure_airport: {
    name: string;
    id: string;
    time: string;
  };
  arrival_airport: {
    name: string;
    id: string;
    time: string;
  };
  duration: number;
  airplane?: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom?: string;
  extensions?: string[];
  overnight?: boolean;
  often_delayed_by_over_30_min?: boolean;
}

interface SerpApiLayover {
  duration: number;
  name: string;
  id: string;
  overnight?: boolean;
}

interface SerpApiCarbonEmissions {
  this_flight: number;
  typical_for_this_route: number;
  difference_percent: number;
}

interface SerpApiFlightOption {
  flights: SerpApiFlightSegment[];
  layovers?: SerpApiLayover[];
  total_duration: number;
  carbon_emissions: SerpApiCarbonEmissions;
  price?: number;
  type: string;
  airline_logo: string;
  booking_token: string;
}

interface SerpApiResult {
  error?: string;
  best_flights?: SerpApiFlightOption[];
  other_flights?: SerpApiFlightOption[];
  price_insights?: {
    lowest_price: number;
    price_level: string;
    typical_price_range: number[];
    price_history: number[][];
  };
  airports?: Array<{
    departure: Array<{
      airport: {
        id: string;
        name: string;
      };
      city: string;
      country: string;
      country_code: string;
      image?: string;
      thumbnail?: string;
    }>;
    arrival: Array<{
      airport: {
        id: string;
        name: string;
      };
      city: string;
      country: string;
      country_code: string;
      image?: string;
      thumbnail?: string;
    }>;
  }>;
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    throw new Error('SERPAPI_API_KEY environment variable is not set');
  }

  const search = new GoogleSearch(apiKey);

  const searchParams = {
    engine: 'google_flights',
    departure_id: params.departureId,
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    ...(params.returnDate && { return_date: params.returnDate }),
    ...(params.type && { type: params.type.toString() }),
    currency: params.currency || 'USD',
    hl: params.language || 'en',
    gl: params.country || 'us'
  };

  console.log({ searchParams })

  return new Promise((resolve, reject) => {
    search.json(searchParams, (result: SerpApiResult) => {
      if (result.error) {
        reject(new Error(`SerpAPI error: ${result.error}`));
        return;
      }

      const allFlights = [
        ...(result.best_flights || []),
        ...(result.other_flights || [])
      ];


      if (allFlights.length === 0) {
        resolve([]);
        return;
      }

      const flights: FlightResult[] = allFlights.map((flightOption) => {
        // Add defensive checks for undefined properties
        if (!flightOption || !flightOption.flights || flightOption.flights.length === 0) {
          console.error('FlightOption is invalid:', flightOption);
          return null;
        }

        // Get the first and last flight segments to determine overall route
        const firstFlight = flightOption.flights[0];
        const lastFlight = flightOption.flights[flightOption.flights.length - 1];

        return {
          departure_airport: {
            id: firstFlight.departure_airport?.id || 'unknown',
            name: firstFlight.departure_airport?.name || 'Unknown Airport',
          },
          arrival_airport: {
            id: lastFlight.arrival_airport?.id || 'unknown',
            name: lastFlight.arrival_airport?.name || 'Unknown Airport',
          },
          flights: flightOption.flights.map(segment => ({
            departure_airport: {
              id: segment.departure_airport?.id || 'unknown',
              name: segment.departure_airport?.name || 'Unknown Airport',
              time: segment.departure_airport?.time || 'unknown',
            },
            arrival_airport: {
              id: segment.arrival_airport?.id || 'unknown',
              name: segment.arrival_airport?.name || 'Unknown Airport',
              time: segment.arrival_airport?.time || 'unknown',
            },
            duration: segment.duration || 0,
            airline: segment.airline || 'Unknown Airline',
            airline_logo: segment.airline_logo || flightOption.airline_logo || '',
            flight_number: segment.flight_number || 'unknown',
            legroom: segment.legroom,
            extensions: segment.extensions || [],
          })),
          price: flightOption.price || 0,
          type: flightOption.type || 'unknown',
          book_link: `https://www.google.com/travel/flights/booking?token=${flightOption.booking_token}`
        };
      }).filter(Boolean) as FlightResult[];

      resolve(flights);
    });
  });
}
