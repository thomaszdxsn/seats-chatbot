import { tool } from 'ai';
import { z } from 'zod';
import { searchFlights, type FlightResult } from './flight-api';

export const flightSearchTool = tool({
  description: 'Search for flights between two airports on specific dates',
  inputSchema: z.object({
    departureId: z.string().describe('Departure airport code (e.g., LAX, JFK, CDG)'),
    arrivalId: z.string().describe('Arrival airport code (e.g., LAX, JFK, CDG)'),
    outboundDate: z.string().describe('Departure date in YYYY-MM-DD format'),
    returnDate: z.string().optional().describe('Return date in YYYY-MM-DD format (for round-trip)'),
    type: z.number().int().min(1).max(3).optional().default(1).describe('Trip type: 1=Round Trip, 2=One Way, 3=Multi City'),
    currency: z.string().optional().default('USD').describe('Currency code (e.g., USD, EUR, CNY)'),
    language: z.string().optional().default('en').describe('Language code (e.g., en, zh, fr)'),
    country: z.string().optional().default('us').describe('Country code (e.g., us, cn, fr)')
  }),
  execute: async (params): Promise<{
    success: boolean;
    flights?: FlightResult[];
    error?: string;
    summary?: string;
  }> => {
    const currentDate = new Date().toISOString().split('T')[0];
    console.log("Executing flight search tool with params:", params);
    console.log("Current date:", currentDate);

    // Fix language and country codes for SerpAPI compatibility
    const languageMapping: Record<string, string> = {
      'zh': 'zh-CN',
      'zh-cn': 'zh-CN',
      'zh-tw': 'zh-TW',
      'en': 'en',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'ja': 'ja',
      'ko': 'ko'
    };

    const countryMapping: Record<string, string> = {
      'zh': 'cn',
      'zh-cn': 'cn',
      'zh-tw': 'tw',
      'en': 'us',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'ja': 'jp',
      'ko': 'kr'
    };

    // Auto-detect trip type based on provided parameters
    let tripType = params.type || 1; // Default to Round Trip
    if (!params.type) {
      if (params.returnDate) {
        tripType = 1; // Round Trip - has return date
      } else {
        tripType = 2; // One Way - no return date
      }
    }

    const fixedParams = {
      ...params,
      type: tripType,
      language: languageMapping[params.language?.toLowerCase() || 'en'] || params.language || 'en',
      country: countryMapping[params.language?.toLowerCase() || 'en'] || params.country || 'us',
    };
    console.log("Fixed params for SerpAPI:", fixedParams);

    try {
      const flights = await searchFlights(fixedParams);

      if (flights.length === 0) {
        return {
          success: true,
          flights: [],
          summary: `No flights found for ${fixedParams.departureId} to ${fixedParams.arrivalId} on ${fixedParams.outboundDate}${fixedParams.returnDate ? ` (returning ${fixedParams.returnDate})` : ''}`
        };
      }

      const cheapestFlight = flights.reduce((min, flight) =>
        flight.price < min.price ? flight : min
      );

      const summary = `Found ${flights.length} flight options from ${fixedParams.departureId} to ${fixedParams.arrivalId}. ` +
        `Cheapest option: ${cheapestFlight.price} ${fixedParams.currency || 'USD'} ` +
        `(${cheapestFlight.flights.length > 0 ? cheapestFlight.flights[0].airline : 'Unknown airline'})`;

      console.log({ summary })

      return {
        success: true,
        flights,
        summary
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        summary: `Failed to search flights: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});
