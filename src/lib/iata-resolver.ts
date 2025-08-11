import airportsData from '../data/airports.json';

interface Airport {
  iata: string;
  icao?: string;
  name: string;
  city?: string;
  country?: string;
}

export interface IataMatch {
  iata: string;
  name: string;
  city?: string;
  country?: string;
  confidence: number; // 0-100
}

// Type assertion for the imported JSON data
const airports = airportsData as Record<string, Airport>;

/**
 * Resolve city/airport names to IATA codes using fuzzy matching
 * @param input - User input (e.g., "Shanghai", "Los Angeles", "Tokyo")
 * @returns Array of possible matches sorted by confidence
 */
export function resolveToIata(input: string): IataMatch[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  const searchTerm = input.toLowerCase().trim();
  
  // If input is already a 3-letter IATA code, return it if valid
  if (searchTerm.match(/^[a-z]{3}$/)) {
    const iataCode = searchTerm.toUpperCase();
    const airport = airports[iataCode];
    if (airport) {
      return [{
        iata: iataCode,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        confidence: 100
      }];
    }
  }

  const matches: IataMatch[] = [];

  // Search through all airports
  Object.values(airports).forEach(airport => {
    const confidence = calculateMatch(searchTerm, airport);
    if (confidence > 30) { // Only include reasonably confident matches
      matches.push({
        iata: airport.iata,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        confidence
      });
    }
  });

  // Sort by confidence (highest first) and return top 5
  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

/**
 * Calculate matching confidence between search term and airport data
 * @param searchTerm - Lowercase search term
 * @param airport - Airport data
 * @returns Confidence score (0-100)
 */
function calculateMatch(searchTerm: string, airport: Airport): number {
  const airportName = airport.name.toLowerCase();
  const city = airport.city?.toLowerCase() || '';
  const country = airport.country?.toLowerCase() || '';

  let maxConfidence = 0;

  // Exact matches get highest score
  if (city === searchTerm) {
    maxConfidence = Math.max(maxConfidence, 95);
  }

  if (airportName.includes(searchTerm)) {
    // Full word match in airport name
    const words = airportName.split(/\s+/);
    const searchWords = searchTerm.split(/\s+/);
    
    // Check for exact word matches
    for (const searchWord of searchWords) {
      if (words.some(word => word === searchWord)) {
        maxConfidence = Math.max(maxConfidence, 85);
      }
    }

    // Partial matches
    if (airportName.startsWith(searchTerm)) {
      maxConfidence = Math.max(maxConfidence, 80);
    } else if (airportName.includes(searchTerm)) {
      maxConfidence = Math.max(maxConfidence, 70);
    }
  }

  // City matches
  if (city.includes(searchTerm)) {
    if (city.startsWith(searchTerm)) {
      maxConfidence = Math.max(maxConfidence, 75);
    } else {
      maxConfidence = Math.max(maxConfidence, 60);
    }
  }

  // Country matches (lower priority)
  if (country.includes(searchTerm)) {
    maxConfidence = Math.max(maxConfidence, 40);
  }

  // Common name variations
  const variations = getCommonVariations(searchTerm);
  for (const variation of variations) {
    if (airportName.includes(variation) || city.includes(variation)) {
      maxConfidence = Math.max(maxConfidence, 65);
    }
  }

  return maxConfidence;
}

/**
 * Get common variations of city/airport names
 */
function getCommonVariations(searchTerm: string): string[] {
  const variations: string[] = [];

  // Common city name variations
  const cityVariations: Record<string, string[]> = {
    // Chinese cities
    'shanghai': ['pudong', 'hongqiao'],
    'beijing': ['capital', 'peking'],
    'guangzhou': ['canton'],
    'shenzhen': ['bao\'an'],
    
    // Japanese cities  
    'tokyo': ['narita', 'haneda'],
    'osaka': ['kansai', 'itami'],
    'nagoya': ['chubu'],
    
    // US cities
    'new york': ['jfk', 'laguardia', 'newark'],
    'los angeles': ['lax'],
    'san francisco': ['sfo'],
    'chicago': ['o\'hare', 'midway'],
    'washington': ['dulles', 'reagan'],
    
    // European cities
    'london': ['heathrow', 'gatwick', 'stansted', 'luton'],
    'paris': ['charles de gaulle', 'cdg', 'orly'],
    'rome': ['fiumicino', 'ciampino'],
    'milan': ['malpensa', 'linate'],
    'berlin': ['tegel', 'schoenefeld', 'brandenburg']
  };

  if (cityVariations[searchTerm]) {
    variations.push(...cityVariations[searchTerm]);
  }

  return variations;
}

/**
 * Get the best IATA code match for a search term
 * @param input - User input
 * @returns Best matching IATA code or null
 */
export function getBestIataMatch(input: string): string | null {
  const matches = resolveToIata(input);
  return matches.length > 0 ? matches[0].iata : null;
}

/**
 * Format a list of IATA matches for display
 * @param matches - Array of IATA matches
 * @returns Formatted string
 */
export function formatMatches(matches: IataMatch[]): string {
  if (matches.length === 0) {
    return 'No airports found';
  }

  return matches.map(match => 
    `${match.iata} - ${match.name}${match.city ? ` (${match.city})` : ''}${match.country ? `, ${match.country}` : ''} [${match.confidence}%]`
  ).join('\n');
}