/**
 * Type definitions for Message components
 */
import type { PointsYeahResponse } from '@/lib/pointsyeah/flight-api';
import type { PointsYeahHotelResponse, HotelSearchInput } from '@/lib/pointsyeah/hotel-api';

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

export interface SearchParams {
  departureId: string;
  arrivalId: string;
  outboundDate: string;
  endDate?: string;  // Changed from returnDate to match API
  banks?: string[];
  programs?: string[];
  cabins?: string[];
  premium_cabin_percentage?: number;
  max_points?: number;
  min_points?: number;
  max_duration?: number;
  min_duration?: number;
  max_tax?: number;
  min_tax?: number;
  trip?: string;
  sort?: string;
  seats?: number;
  weekend_only?: boolean;
  collection?: boolean;
  page?: number;
  page_size?: number;
}

export interface DateTimeOutput {
  success: boolean;
  result?: string;
  error?: string;
  operation: string;
  timestamp: string;
}

export type ToolPartWithOutput = {
  toolCallId: string;
  state: 'output-available';
  output?: {
    flights?: FlightData[];
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
  };
};