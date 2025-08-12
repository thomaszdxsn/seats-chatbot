/**
 * PointsYeah Flight Search Implementation
 *
 * This file implements flight search functionality using PointsYeah API.
 * API Provider: PointsYeah (https://api.pointsyeah.com/)
 * Endpoint: /v2/beta/explorer/search
 *
 * Returns raw PointsYeah API data without transformation
 */

// PointsYeah API exact type definitions
export type PointsYeahSortOption = "miles" | "-miles" | "tax" | "-updated_at";

export type PointsYeahTripType =
  | "Beach"
  | "City"
  | "Family"
  | "Fishing"
  | "Golf"
  | "Foodie"
  | "Honeymoon"
  | "Mountain"
  | "Off beaten path"
  | "Scuba Diving"
  | "Ski";

export type PointsYeahProgram =
  | "AM"  // Aeromexico
  | "AV"  // Avianca
  | "AC"  // Air Canada
  | "KL"  // KLM
  | "QF"  // Qantas
  | "B6"  // JetBlue
  | "DL"  // Delta
  | "VS"  // Virgin Atlantic
  | "EK"  // Emirates
  | "EY"  // Etihad
  | "IB"  // Iberia
  | "SQ"  // Singapore Airlines
  | "UA"  // United
  | "TK"  // Turkish
  | "AA"  // American
  | "TP"  // TAP Portugal
  | "AY"  // Finnair
  | "AR"  // Aerolineas Argentinas
  | "AS"; // Alaska

export type PointsYeahBank =
  | "Amex"
  | "Chase"
  | "Citi"
  | "Capital One"
  | "WF"; // Wells Fargo

export interface PointsYeahLocation {
  airports?: string[];
  continents?: string[];
  countries?: string[];
  regions?: string[];
  states?: string[];
  anywhere?: boolean;
}

export interface PointsYeahPagination {
  page: number;
  page_size: number;
}

export interface PointsYeahSearchParams {
  // Location parameters
  departure: PointsYeahLocation;
  arrival: PointsYeahLocation;

  // Date parameters
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD

  // Filter parameters
  banks?: PointsYeahBank[];
  programs?: PointsYeahProgram[];
  cabins?: string[]; // ["Economy", "Premium Economy", "Business", "First"]
  premium_cabin_percentage?: number; // 0-100

  // Points/Miles filters
  max_points?: number;
  min_points?: number;
  max_duration?: number;
  min_duration?: number;
  max_tax?: number;
  min_tax?: number;

  // Trip parameters
  trip?: PointsYeahTripType;
  sort?: PointsYeahSortOption;
  seats?: number; // Number of seats
  weekend_only?: boolean;
  collection?: boolean;

  // Pagination
  pagination?: PointsYeahPagination;
}

// Simplified interface for tool input with correct types
export interface FlightSearchInput {
  departureId: string;
  arrivalId: string;
  outboundDate: string;
  endDate?: string;  // Changed from returnDate to endDate to match API
  banks?: PointsYeahBank[];
  programs?: PointsYeahProgram[];
  cabins?: string[];
  premium_cabin_percentage?: number;

  // Points/Miles filters
  max_points?: number;
  min_points?: number;
  max_duration?: number;
  min_duration?: number;
  max_tax?: number;
  min_tax?: number;

  trip?: PointsYeahTripType;
  sort?: PointsYeahSortOption;
  seats?: number;
  weekend_only?: boolean;
  collection?: boolean;
  page?: number;
  page_size?: number;
}

// PointsYeah API Response interfaces - exact match to API
export interface PointsYeahAirport {
  code: string;
  city: string;
  country_name: string;
  longitude: number;
  latitude: number;
}

export interface PointsYeahTransfer {
  bank: string;
  bonus_percentage: number;
  url: string;
  code: string;
}

export interface PointsYeahFlightResult {
  program: string; // Airline code (e.g., "DL", "VS")
  departure_date: string;
  departure: PointsYeahAirport;
  arrival: PointsYeahAirport;
  miles: number;
  tax: number;
  cabin: string;
  detail_url: string;
  stops: number;
  seats: number;
  duration: number;
  premium_cabin_percentage: number;
  created_at: number;
  updated_at: number;
  transfer: PointsYeahTransfer[];
  img: string;
}

export interface PointsYeahResponse {
  total: number;
  results: PointsYeahFlightResult[];
}

/**
 * Transform simple input to PointsYeah API format
 */
function transformToPointsYeahParams(input: FlightSearchInput): PointsYeahSearchParams {
  return {
    departure: {
      airports: [input.departureId]
    },
    arrival: input.arrivalId.toLowerCase() === 'anywhere' ?
      { anywhere: true } :
      { airports: [input.arrivalId] },
    start_date: input.outboundDate,
    end_date: input.endDate || input.outboundDate,  // Use endDate instead of returnDate
    banks: input.banks || ["Amex",
      "Chase",
      "Citi",
      "Capital One",
      "WF"],
    programs: input.programs || [
      "AM",
      "AV",
      "AC",
      "KL",
      "QF",
      "B6",
      "DL",
      "VS",
      "EK",
      "EY",
      "IB",
      "SQ",
      "UA",
      "TK",
      "AA",
      "TP",
      "AY",
      "AR",
      "AS"
    ],
    cabins: input.cabins || ["Economy", "Premium Economy", "Business", "First"],
    premium_cabin_percentage: input.premium_cabin_percentage || 60,

    // Points/Miles filters
    max_points: input.max_points,
    min_points: input.min_points,
    max_duration: input.max_duration,
    min_duration: input.min_duration,
    max_tax: input.max_tax,
    min_tax: input.min_tax,

    trip: input.trip,
    sort: input.sort || "miles",
    pagination: {
      page: input.page || 1,
      page_size: input.page_size || 10
    },
    seats: input.seats || 1,
    weekend_only: input.weekend_only || false,
    collection: input.collection !== undefined ? input.collection : true
  };
}

/**
 * Search for flights using PointsYeah API
 * Returns raw PointsYeah API response without transformation
 * No API key required - public API access
 */
export async function searchPointsYeahFlights(input: FlightSearchInput): Promise<PointsYeahResponse> {
  console.log('PointsYeah Flight Search called with input:', input);

  // Transform simple input to PointsYeah format
  const pointsYeahParams = transformToPointsYeahParams(input);
  console.log('Transformed PointsYeah API params:', JSON.stringify(pointsYeahParams, null, 2));

  try {
    const response = await fetch('https://api.pointsyeah.com/v2/beta/explorer/search', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain;charset=UTF-8',
        'origin': 'https://beta.pointsyeah.com',
        'referer': 'https://beta.pointsyeah.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(pointsYeahParams)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PointsYeah API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: PointsYeahResponse = await response.json();
    console.log(`PointsYeah API returned ${data.total} total results, showing ${data.results?.length || 0} results`);

    // Return raw PointsYeah API response
    return data;

  } catch (error) {
    console.error('PointsYeah API error:', error);
    throw error;
  }
}
