/**
 * PointsYeah Flight Search Tool
 * 
 * This file implements comprehensive flight search tool using PointsYeah API.
 * API Provider: PointsYeah (https://api.pointsyeah.com/)
 * Features: Reward flights search with miles, transfer partners, cabin classes
 * 
 * Returns raw PointsYeah API data for AI processing
 */
import { tool } from 'ai';
import { z } from 'zod';
import { 
  searchPointsYeahFlights, 
  type PointsYeahResponse, 
  type FlightSearchInput,
  type PointsYeahBank,
  type PointsYeahProgram,
  type PointsYeahTripType,
  type PointsYeahSortOption
} from './flight-api';
import { getBestIataMatch, resolveToIata, formatMatches } from '../iata-resolver';

// Comprehensive PointsYeah flight search tool with all available parameters
export const pointsYeahFlightSearchTool = tool({
  description: 'Search for reward flights using PointsYeah API - specializes in finding award flights using points/miles from various loyalty programs and credit card transfer partners. This tool returns raw flight data including miles required, taxes, transfer partner options, and airline programs.',
  inputSchema: z.object({
    // Basic flight search parameters
    departureId: z.string().describe('Departure airport - can be IATA code (e.g., LAX, PVG, NRT) or city name (e.g., Los Angeles, Shanghai, Tokyo)'),
    arrivalId: z.string().describe('Arrival airport - can be IATA code (e.g., LAX, PVG, NRT), city name (e.g., Los Angeles, Shanghai, Tokyo), or "anywhere" for flexible destinations'),
    outboundDate: z.string().describe('Departure date in YYYY-MM-DD format'),
    endDate: z.string().optional().describe('End date in YYYY-MM-DD format (for date range searches, leave empty for single date)'),  // Changed from returnDate
    
    // Transfer partners and banks (exact types)
    banks: z.array(z.enum(["Amex", "Chase", "Citi", "Capital One", "WF"])).optional().describe('Credit card transfer partners: Amex (American Express), Chase, Citi, Capital One, WF (Wells Fargo). Default: ["Amex", "Chase", "Citi"]'),
    
    // Airline loyalty programs (exact types)
    programs: z.array(z.enum(["AM", "AV", "AC", "KL", "QF", "B6", "DL", "VS", "EK", "EY", "IB", "SQ", "UA", "TK", "AA", "TP", "AY", "AR", "AS"])).optional().describe('Airline programs: AM (Aeromexico), AV (Avianca), AC (Air Canada), KL (KLM), QF (Qantas), B6 (JetBlue), DL (Delta), VS (Virgin Atlantic), EK (Emirates), EY (Etihad), IB (Iberia), SQ (Singapore), UA (United), TK (Turkish), AA (American), TP (TAP), AY (Finnair), AR (Aerolineas), AS (Alaska)'),
    
    // Cabin class preferences
    cabins: z.array(z.string()).optional().describe('Cabin classes to search. Options: ["Economy", "Premium Economy", "Business", "First"]. Default includes all cabin classes'),
    premium_cabin_percentage: z.number().int().min(0).max(100).optional().describe('Minimum percentage of premium cabin (Business/First) segments required (0-100). Default: 60'),
    
    // Points/Miles filtering
    max_points: z.number().int().min(0).optional().describe('Maximum miles/points required for the flight'),
    min_points: z.number().int().min(0).optional().describe('Minimum miles/points required for the flight'),
    max_duration: z.number().int().min(0).optional().describe('Maximum flight duration in minutes'),
    min_duration: z.number().int().min(0).optional().describe('Minimum flight duration in minutes'),
    max_tax: z.number().min(0).optional().describe('Maximum taxes/fees in dollars'),
    min_tax: z.number().min(0).optional().describe('Minimum taxes/fees in dollars'),
    
    // Trip type
    trip: z.enum(["Beach", "City", "Family", "Fishing", "Golf", "Foodie", "Honeymoon", "Mountain", "Off beaten path", "Scuba Diving", "Ski"]).optional().describe('Trip type/category for destination recommendations'),
    
    // Search preferences
    sort: z.enum(["miles", "-miles", "tax", "-updated_at"]).optional().describe('Sort results: "miles" (ascending), "-miles" (descending), "tax" (ascending), "-updated_at" (newest first). Default: "miles"'),
    seats: z.number().int().min(1).max(9).optional().describe('Number of seats needed (1-9). Default: 1'),
    weekend_only: z.boolean().optional().describe('Only show flights departing on weekends (Friday-Sunday). Default: false'),
    collection: z.boolean().optional().describe('Include collected flight data. Default: true'),
    
    // Pagination
    page: z.number().int().min(1).optional().describe('Page number for results (starting from 1). Default: 1'),
    page_size: z.number().int().min(1).max(50).optional().describe('Number of results per page (1-50). Default: 10')
  }),
  execute: async (params): Promise<{
    success: boolean;
    pointsyeah_data?: PointsYeahResponse;
    error?: string;
    summary?: string;
    search_params?: FlightSearchInput;
  }> => {
    const currentDate = new Date().toISOString().split('T')[0];
    console.log("Executing PointsYeah flight search tool with params:", params);
    console.log("Current date:", currentDate);

    // Handle "anywhere" destination
    let departureIata: string | null = null;
    let arrivalIata: string | null = null;
    
    // Resolve departure airport
    departureIata = getBestIataMatch(params.departureId);
    
    // Handle flexible destination
    if (params.arrivalId.toLowerCase() === 'anywhere') {
      arrivalIata = 'anywhere';
    } else {
      arrivalIata = getBestIataMatch(params.arrivalId);
    }

    console.log(`Resolved departure: "${params.departureId}" -> ${departureIata}`);
    console.log(`Resolved arrival: "${params.arrivalId}" -> ${arrivalIata}`);

    // Check if we could resolve departure airport (arrival can be "anywhere")
    if (!departureIata || (!arrivalIata && params.arrivalId.toLowerCase() !== 'anywhere')) {
      let errorMessage = 'Could not resolve airports:';
      
      if (!departureIata) {
        const departureMatches = resolveToIata(params.departureId);
        errorMessage += `\n\nDeparture "${params.departureId}" - No good matches found.`;
        if (departureMatches.length > 0) {
          errorMessage += ` Did you mean one of these?\n${formatMatches(departureMatches)}`;
        }
      }
      
      if (!arrivalIata && params.arrivalId.toLowerCase() !== 'anywhere') {
        const arrivalMatches = resolveToIata(params.arrivalId);
        errorMessage += `\n\nArrival "${params.arrivalId}" - No good matches found.`;
        if (arrivalMatches.length > 0) {
          errorMessage += ` Did you mean one of these?\n${formatMatches(arrivalMatches)}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        summary: `Failed to resolve airport codes for departure: "${params.departureId}"${params.arrivalId.toLowerCase() !== 'anywhere' ? ` and arrival: "${params.arrivalId}"` : ''}`
      };
    }

    // Build search parameters for PointsYeah API
    const searchParams: FlightSearchInput = {
      departureId: departureIata!,
      arrivalId: arrivalIata === 'anywhere' ? 'anywhere' : arrivalIata!,
      outboundDate: params.outboundDate,
      endDate: params.endDate,  // Changed from returnDate
      banks: params.banks as PointsYeahBank[] | undefined,
      programs: params.programs as PointsYeahProgram[] | undefined,
      cabins: params.cabins,
      premium_cabin_percentage: params.premium_cabin_percentage,
      max_points: params.max_points,
      min_points: params.min_points,
      max_duration: params.max_duration,
      min_duration: params.min_duration,
      max_tax: params.max_tax,
      min_tax: params.min_tax,
      trip: params.trip as PointsYeahTripType | undefined,
      sort: params.sort as PointsYeahSortOption | undefined,
      seats: params.seats,
      weekend_only: params.weekend_only,
      collection: params.collection,
      page: params.page,
      page_size: params.page_size
    };
    
    console.log("Search params for PointsYeah API:", searchParams);

    try {
      const pointsyeahData = await searchPointsYeahFlights(searchParams);

      if (!pointsyeahData.results || pointsyeahData.results.length === 0) {
        const destinationText = params.arrivalId.toLowerCase() === 'anywhere' ? 
          'anywhere' : `${params.arrivalId} (${arrivalIata})`;
        
        return {
          success: true,
          pointsyeah_data: pointsyeahData,
          summary: `No reward flights found from ${params.departureId} (${departureIata}) to ${destinationText} on ${searchParams.outboundDate}${searchParams.endDate ? ` (through ${searchParams.endDate})` : ''}. Try adjusting your search criteria like cabin class, programs, or dates.`,
          search_params: searchParams
        };
      }

      // Generate summary based on raw data
      const results = pointsyeahData.results;
      const bestMilesResult = results.reduce((min, result) => 
        result.miles < min.miles ? result : min
      );

      const bestTaxResult = results.reduce((min, result) => 
        result.tax < min.tax ? result : min
      );

      const destinationText = params.arrivalId.toLowerCase() === 'anywhere' ? 
        'various destinations' : `${params.arrivalId} (${arrivalIata})`;
      
      const summary = `Found ${pointsyeahData.total} total reward flights (showing ${results.length}) from ${params.departureId} (${departureIata}) to ${destinationText}. ` +
        `Best miles: ${bestMilesResult.miles.toLocaleString()} miles + $${bestMilesResult.tax} taxes (${bestMilesResult.program} ${bestMilesResult.cabin}). ` +
        `Lowest taxes: $${bestTaxResult.tax} + ${bestTaxResult.miles.toLocaleString()} miles.`;

      console.log({ summary });

      return {
        success: true,
        pointsyeah_data: pointsyeahData,
        summary,
        search_params: searchParams
      };
    } catch (error) {
      console.error('PointsYeah flight search error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        summary: `Failed to search reward flights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        search_params: searchParams
      };
    }
  }
});