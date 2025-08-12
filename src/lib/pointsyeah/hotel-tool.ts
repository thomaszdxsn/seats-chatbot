/**
 * PointsYeah Hotel Search Tool
 * 
 * This file implements hotel search tool using PointsYeah API.
 * API Provider: PointsYeah (https://api.pointsyeah.com/)
 * Endpoint: /v2/beta/hotel/explorer/search
 */
import { tool } from 'ai';
import { z } from 'zod';
import { 
  searchPointsYeahHotels, 
  type HotelSearchInput, 
  type PointsYeahHotelResponse,
  type PointsYeahHotelProgram,
  type PointsYeahHotelBank,
  type PointsYeahHotelAmenity,
  type PointsYeahHotelSort
} from './hotel-api';

export const pointsYeahHotelSearchTool = tool({
  description: 'Search for reward hotels using points/miles through PointsYeah API. This tool finds hotels that can be booked with loyalty program points rather than cash, perfect for travelers looking to maximize their points value.',
  inputSchema: z.object({
    destination: z.string().optional().describe('Destination city or location (e.g., "Tokyo", "New York", "Paris"). Leave empty to search anywhere.'),
    checkInDate: z.string().describe('Check-in date in YYYY-MM-DD format'),
    checkOutDate: z.string().describe('Check-out date in YYYY-MM-DD format'),
    programs: z.array(z.enum(["hilton", "hyatt", "ihg", "marriott"])).optional().describe('Hotel loyalty programs to search (hilton, hyatt, ihg, marriott)'),
    banks: z.array(z.enum(["Amex", "Bilt", "Capital One", "Chase", "Citi", "WF"])).optional().describe('Credit card transfer partners'),
    amenities: z.array(z.enum([
      "pet_friendly", "free_parking", "free_airports_shuttle", "resort", "amazing_bathtub",
      "all_inclusive", "infinite_pool", "plunge_pool", "kids_club", "water_slide", 
      "golf", "city_center", "club_lounge"
    ])).optional().describe('Desired hotel amenities'),
    max_points: z.number().int().min(0).optional().describe('Maximum points per night'),
    max_price: z.number().int().min(0).optional().describe('Maximum cash price per night'),
    weekend_only: z.boolean().optional().describe('Search weekend dates only'),
    holiday_only: z.boolean().optional().describe('Search holiday periods only'),
    suit_only: z.boolean().optional().describe('Search suite rooms only'),
    sort: z.enum(["cpp", "cash", "-cash", "distance", "points", "-points", "-updated_at"]).optional().describe('Sort results by: cpp (cents per point), cash, distance, points, or updated_at'),
    page: z.number().int().min(1).optional().default(1).describe('Page number for pagination'),
    page_size: z.number().int().min(1).max(50).optional().default(17).describe('Number of results per page')
  }),
  execute: async (params): Promise<{
    success: boolean;
    pointsyeah_hotel_data?: PointsYeahHotelResponse;
    search_params?: HotelSearchInput;
    error?: string;
    summary?: string;
  }> => {
    const currentDate = new Date().toISOString().split('T')[0];
    console.log("Executing PointsYeah hotel search tool with params:", params);
    console.log("Current date:", currentDate);

    // Validate dates
    if (params.checkInDate < currentDate) {
      return {
        success: false,
        error: `Check-in date (${params.checkInDate}) cannot be in the past. Current date: ${currentDate}`,
        summary: `Invalid check-in date: ${params.checkInDate}`
      };
    }

    if (params.checkOutDate <= params.checkInDate) {
      return {
        success: false,
        error: `Check-out date (${params.checkOutDate}) must be after check-in date (${params.checkInDate})`,
        summary: `Invalid date range: ${params.checkInDate} to ${params.checkOutDate}`
      };
    }

    // Transform params to API format
    const searchInput: HotelSearchInput = {
      destination: params.destination,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      programs: params.programs as PointsYeahHotelProgram[],
      banks: params.banks as PointsYeahHotelBank[],
      amenities: params.amenities as PointsYeahHotelAmenity[],
      max_points: params.max_points,
      max_price: params.max_price,
      weekend_only: params.weekend_only,
      holiday_only: params.holiday_only,
      suit_only: params.suit_only,
      sort: params.sort as PointsYeahHotelSort,
      page: params.page,
      page_size: params.page_size
    };

    console.log("Transformed search input for PointsYeah Hotel API:", searchInput);

    try {
      const hotelData = await searchPointsYeahHotels(searchInput);

      const destinationText = params.destination || 'anywhere';
      const summary = `Found ${hotelData.total} reward hotel options in ${destinationText} for ${params.checkInDate} to ${params.checkOutDate}. ` +
        `Showing ${hotelData.results?.length || 0} results sorted by ${params.sort || 'cpp'}.`;

      return {
        success: true,
        pointsyeah_hotel_data: hotelData,
        search_params: searchInput,
        summary
      };

    } catch (error) {
      console.error('PointsYeah hotel search failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        summary: `Failed to search hotels: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});