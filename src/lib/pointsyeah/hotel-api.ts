/**
 * PointsYeah Hotel Search Implementation
 *
 * This file implements hotel search functionality using PointsYeah API.
 * API Provider: PointsYeah (https://api.pointsyeah.com/)
 * Endpoint: /v2/beta/hotel/explorer/search
 *
 * Returns raw PointsYeah API data without transformation
 */

// PointsYeah Hotel API exact type definitions
export type PointsYeahHotelProgram = "hilton" | "hyatt" | "ihg" | "marriott";

export type PointsYeahHotelBank = "Amex" | "Bilt" | "Capital One" | "Chase" | "Citi" | "WF";

export type PointsYeahHotelSort = "cpp" | "cash" | "-cash" | "distance" | "points" | "-points" | "-updated_at";

export type PointsYeahHotelAmenity =
  | "pet_friendly"
  | "free_parking"
  | "free_airports_shuttle"
  | "resort"
  | "amazing_bathtub"
  | "all_inclusive"
  | "infinite_pool"
  | "plunge_pool"
  | "kids_club"
  | "water_slide"
  | "golf"
  | "city_center"
  | "club_lounge";

import { resolveCityLocation, type PointsYeahHotelLocationObject } from './hotel-location-resolver';

export interface PointsYeahHotelLocation {
  city?: string;
  country?: string;
  region?: string;
  anywhere?: boolean;
}

export interface PointsYeahHotelPagination {
  page: number;
  page_size: number;
}

export interface PointsYeahHotelSearchParams {
  // Location parameters - can be either simple location or detailed location object
  location: PointsYeahHotelLocation | PointsYeahHotelLocationObject;

  // Date parameters
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD

  // Filter parameters
  weekend_only?: boolean;
  holiday_only?: boolean;
  max_points?: number;
  max_prices?: number; // Note: API uses max_prices, not max_price
  suit_only?: boolean;

  // Amenities and program filters
  amenities?: PointsYeahHotelAmenity[];
  programs?: PointsYeahHotelProgram[];
  free_night_certificate?: string[];

  // Other filters
  sort?: PointsYeahHotelSort;
  tag?: string[];
  banks?: PointsYeahHotelBank[];

  // Pagination
  pagination?: PointsYeahHotelPagination;
}

// Simplified interface for tool input
export interface HotelSearchInput {
  destination?: string;
  checkInDate: string;
  checkOutDate: string;
  programs?: PointsYeahHotelProgram[];
  banks?: PointsYeahHotelBank[];
  amenities?: PointsYeahHotelAmenity[];
  max_points?: number;
  max_price?: number;
  weekend_only?: boolean;
  holiday_only?: boolean;
  suit_only?: boolean;
  sort?: PointsYeahHotelSort;
  page?: number;
  page_size?: number;
}

// PointsYeah Hotel API Response interfaces - exact match to API
export interface PointsYeahHotelPropertyLocation {
  city: string;
  address: string;
  country: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

export interface PointsYeahHotelBrand {
  code: string;
  name: string;
}

export interface PointsYeahHotelProperty {
  ota: string[];
  code: string;
  name: string;
  tags: string[];
  brand: PointsYeahHotelBrand;
  image: string;
  program: string;
  calendar: boolean;
  category: string;
  location: PointsYeahHotelPropertyLocation;
  amenities: string[];
  property_id: number;
}

export interface PointsYeahHotelTransfer {
  bank: string;
  bonus_percentage: number;
  url: string;
  code: string;
}

export interface PointsYeahHotelResult {
  points: number;
  cash_price: number;
  room_type: string;
  property: PointsYeahHotelProperty;
  featured: boolean;
  transfer: PointsYeahHotelTransfer[];
  updated_at: number;
}

export interface PointsYeahHotelApiResponse {
  code: number;
  data: {
    total: number;
    results: PointsYeahHotelResult[];
  };
}

// Simplified response interface for consistency with flight search
export interface PointsYeahHotelResponse {
  total: number;
  results: PointsYeahHotelResult[];
}


/**
 * Transform simple input to PointsYeah Hotel API format
 */
function transformToPointsYeahHotelParams(input: HotelSearchInput): PointsYeahHotelSearchParams {
  let location: PointsYeahHotelLocation | PointsYeahHotelLocationObject;

  if (input.destination) {
    if (input.destination.toLowerCase() === 'anywhere') {
      location = { anywhere: true };
    } else {
      // Try to resolve city name to location object with coordinates
      const cityLocationObject = resolveCityLocation(input.destination);
      if (cityLocationObject) {
        location = cityLocationObject;
        console.log(`Resolved city "${input.destination}" to location object:`, cityLocationObject);
      } else {
        // Fallback: use simple city name
        location = { city: input.destination };
        console.log(`Could not resolve city "${input.destination}", using simple city name`);
      }
    }
  } else {
    location = {};
  }

  return {
    location,
    start_date: input.checkInDate,
    end_date: input.checkOutDate,
    weekend_only: input.weekend_only || false,
    holiday_only: input.holiday_only || false,
    max_points: input.max_points || 0,
    max_prices: input.max_price || 0, // Note: API expects max_prices
    suit_only: input.suit_only || false,
    amenities: input.amenities || [
    ],
    programs: input.programs || ["hilton", "hyatt", "ihg", "marriott"],
    free_night_certificate: [],
    sort: input.sort || "cpp",
    tag: [],
    banks: input.banks || ["Amex", "Bilt", "Capital One", "Chase", "Citi", "WF"],
    pagination: {
      page: input.page || 1,
      page_size: input.page_size || 17
    }
  };
}

/**
 * Search for hotels using PointsYeah API
 * Returns raw PointsYeah API response without transformation
 * Note: This API may require authentication - trying without first
 */
export async function searchPointsYeahHotels(input: HotelSearchInput): Promise<PointsYeahHotelResponse> {
  console.log('PointsYeah Hotel Search called with input:', input);

  // Transform simple input to PointsYeah format
  const pointsYeahParams = transformToPointsYeahHotelParams(input);
  console.log('Transformed PointsYeah Hotel API params:', JSON.stringify(pointsYeahParams, null, 2));

  try {
    const response = await fetch('https://api.pointsyeah.com/v2/beta/hotel/explorer/search', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain;charset=UTF-8',
        'origin': 'https://beta.pointsyeah.com',
        'referer': 'https://beta.pointsyeah.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        // Note: Omitting authorization header to test if it's required
      },
      body: JSON.stringify(pointsYeahParams)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PointsYeah Hotel API error: ${response.status} ${response.statusText}`, errorText);

      // If authentication is required (401), throw a specific error
      if (response.status === 401) {
        throw new Error('PointsYeah Hotel API requires authentication. Please configure POINTSYEAH_API_KEY in environment variables.');
      }

      throw new Error(`PointsYeah Hotel API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const apiResponse: PointsYeahHotelApiResponse = await response.json();
    console.log(`PointsYeah Hotel API returned ${apiResponse.data.total} total results, showing ${apiResponse.data.results?.length || 0} results`);

    // Transform API response to simplified format for consistency
    const hotelResponse: PointsYeahHotelResponse = {
      total: apiResponse.data.total,
      results: apiResponse.data.results
    };

    return hotelResponse;

  } catch (error) {
    console.error('PointsYeah Hotel API error:', error);
    throw error;
  }
}
