/**
 * Unified Flight Search Tool Entry Point
 * 
 * This file provides a unified interface for flight search tool functionality.
 * It currently uses SerpAPI as the default provider, with PointsYeah API as a future option.
 */

// Import the implementation from the current provider
import { flightSearchTool as serpApiFlightSearchTool } from './serpapi/flight-tool';
// import { flightSearchTool as pointsYeahFlightSearchTool } from './pointsyeah/flight-tool';

// Configuration to switch between providers
const FLIGHT_API_PROVIDER = process.env.FLIGHT_API_PROVIDER || 'serpapi';

/**
 * Get the flight search tool for the configured provider
 */
function getFlightSearchTool() {
  switch (FLIGHT_API_PROVIDER) {
    case 'serpapi':
      return serpApiFlightSearchTool;
    
    case 'pointsyeah':
      // TODO: Uncomment when PointsYeah implementation is ready
      // return pointsYeahFlightSearchTool;
      throw new Error('PointsYeah provider is not yet implemented');
    
    default:
      throw new Error(`Unknown flight API provider: ${FLIGHT_API_PROVIDER}`);
  }
}

// Export the flight search tool
export const flightSearchTool = getFlightSearchTool();