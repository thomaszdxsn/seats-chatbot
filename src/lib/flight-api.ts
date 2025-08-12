/**
 * Unified Flight Search API Entry Point
 * 
 * This file provides a unified interface for flight search functionality.
 * It currently uses SerpAPI as the default provider, with PointsYeah API as a future option.
 */

// Export types from the current provider
export type { FlightSearchParams, FlightResult } from './serpapi/flight-api';

// Import the implementation from the current provider
import { searchFlights as serpApiSearchFlights } from './serpapi/flight-api';
// import { searchFlights as pointsYeahSearchFlights } from './pointsyeah/flight-api';

// Configuration to switch between providers
const FLIGHT_API_PROVIDER = process.env.FLIGHT_API_PROVIDER || 'serpapi';

/**
 * Unified flight search function that delegates to the configured provider
 */
export async function searchFlights(params: import('./serpapi/flight-api').FlightSearchParams): Promise<import('./serpapi/flight-api').FlightResult[]> {
  switch (FLIGHT_API_PROVIDER) {
    case 'serpapi':
      return serpApiSearchFlights(params);
    
    case 'pointsyeah':
      // TODO: Uncomment when PointsYeah implementation is ready
      // return pointsYeahSearchFlights(params);
      throw new Error('PointsYeah provider is not yet implemented');
    
    default:
      throw new Error(`Unknown flight API provider: ${FLIGHT_API_PROVIDER}`);
  }
}