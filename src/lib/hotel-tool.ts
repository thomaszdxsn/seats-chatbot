/**
 * Hotel Search Tool Entry Point
 * 
 * This file provides the hotel search tool functionality.
 * Currently uses PointsYeah API as the provider (placeholder implementation).
 */

// Import the implementation from PointsYeah provider
import { hotelSearchTool as pointsYeahHotelSearchTool } from './pointsyeah/hotel-tool';

// Configuration to switch between providers (if more are added in the future)
const HOTEL_API_PROVIDER = process.env.HOTEL_API_PROVIDER || 'pointsyeah';

/**
 * Get the hotel search tool for the configured provider
 */
function getHotelSearchTool() {
  switch (HOTEL_API_PROVIDER) {
    case 'pointsyeah':
      return pointsYeahHotelSearchTool;
    
    default:
      throw new Error(`Unknown hotel API provider: ${HOTEL_API_PROVIDER}`);
  }
}

// Export the hotel search tool
export const hotelSearchTool = getHotelSearchTool();