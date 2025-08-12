/**
 * Hotel Location Resolver for PointsYeah API
 * 
 * This file handles the mapping of city names to PointsYeah location objects
 * with coordinates and geographic information required by the API.
 */

export interface PointsYeahHotelLocationObject {
  value: string;
  longitude: number;
  latitude: number;
  dest_type: string;
  country_code: string;
  city: string;
  label: string;
  distance: number;
}

/**
 * City mapping database for common destinations
 * Maps city names to PointsYeah location objects with coordinates
 */
const CITY_LOCATION_MAP: Record<string, PointsYeahHotelLocationObject> = {
  'shanghai': {
    value: "Shanghai, Shanghai Area, China",
    longitude: 121.4763,
    latitude: 31.229422,
    dest_type: "city",
    country_code: "CN",
    city: "Shanghai",
    label: "Shanghai",
    distance: 30000
  },
  'beijing': {
    value: "Beijing, Beijing Area, China",
    longitude: 116.4074,
    latitude: 39.9042,
    dest_type: "city",
    country_code: "CN",
    city: "Beijing",
    label: "Beijing",
    distance: 30000
  },
  'tokyo': {
    value: "Tokyo, Tokyo Prefecture, Japan",
    longitude: 139.6503,
    latitude: 35.6762,
    dest_type: "city",
    country_code: "JP",
    city: "Tokyo",
    label: "Tokyo",
    distance: 30000
  },
  'new york': {
    value: "New York, New York, United States",
    longitude: -74.0059,
    latitude: 40.7128,
    dest_type: "city",
    country_code: "US",
    city: "New York",
    label: "New York",
    distance: 30000
  },
  'london': {
    value: "London, England, United Kingdom",
    longitude: -0.1276,
    latitude: 51.5074,
    dest_type: "city",
    country_code: "GB",
    city: "London",
    label: "London",
    distance: 30000
  },
  'paris': {
    value: "Paris, Île-de-France, France",
    longitude: 2.3522,
    latitude: 48.8566,
    dest_type: "city",
    country_code: "FR",
    city: "Paris",
    label: "Paris",
    distance: 30000
  },
  'hong kong': {
    value: "Hong Kong, Hong Kong SAR",
    longitude: 114.1694,
    latitude: 22.3193,
    dest_type: "city",
    country_code: "HK",
    city: "Hong Kong",
    label: "Hong Kong",
    distance: 30000
  },
  'singapore': {
    value: "Singapore, Singapore",
    longitude: 103.8198,
    latitude: 1.3521,
    dest_type: "city",
    country_code: "SG",
    city: "Singapore",
    label: "Singapore",
    distance: 30000
  },
  'dubai': {
    value: "Dubai, Dubai, United Arab Emirates",
    longitude: 55.2708,
    latitude: 25.2048,
    dest_type: "city",
    country_code: "AE",
    city: "Dubai",
    label: "Dubai",
    distance: 30000
  },
  'los angeles': {
    value: "Los Angeles, California, United States",
    longitude: -118.2437,
    latitude: 34.0522,
    dest_type: "city",
    country_code: "US",
    city: "Los Angeles",
    label: "Los Angeles",
    distance: 30000
  },
  'shenzhen': {
    value: "Shenzhen, Guangdong, China",
    longitude: 114.0579,
    latitude: 22.5431,
    dest_type: "city",
    country_code: "CN",
    city: "Shenzhen",
    label: "Shenzhen",
    distance: 30000
  },
  'guangzhou': {
    value: "Guangzhou, Guangdong, China",
    longitude: 113.2644,
    latitude: 23.1291,
    dest_type: "city",
    country_code: "CN",
    city: "Guangzhou",
    label: "Guangzhou",
    distance: 30000
  },
  'chengdu': {
    value: "Chengdu, Sichuan, China",
    longitude: 104.0668,
    latitude: 30.5728,
    dest_type: "city",
    country_code: "CN",
    city: "Chengdu",
    label: "Chengdu",
    distance: 30000
  },
  'hangzhou': {
    value: "Hangzhou, Zhejiang, China",
    longitude: 120.1551,
    latitude: 30.2741,
    dest_type: "city",
    country_code: "CN",
    city: "Hangzhou",
    label: "Hangzhou",
    distance: 30000
  },
  'xi\'an': {
    value: "Xi'an, Shaanxi, China",
    longitude: 108.9402,
    latitude: 34.2619,
    dest_type: "city",
    country_code: "CN",
    city: "Xi'an",
    label: "Xi'an",
    distance: 30000
  },
  'xian': {
    value: "Xi'an, Shaanxi, China",
    longitude: 108.9402,
    latitude: 34.2619,
    dest_type: "city",
    country_code: "CN",
    city: "Xi'an",
    label: "Xi'an",
    distance: 30000
  }
};

/**
 * Resolve city name to PointsYeah location object
 * @param cityName - The name of the city to resolve
 * @returns PointsYeahHotelLocationObject if found, null otherwise
 */
export function resolveCityLocation(cityName: string): PointsYeahHotelLocationObject | null {
  const normalizedCity = cityName.toLowerCase().trim();
  return CITY_LOCATION_MAP[normalizedCity] || null;
}

/**
 * Get all available cities in the location map
 * @returns Array of city names that can be resolved
 */
export function getAvailableCities(): string[] {
  return Object.keys(CITY_LOCATION_MAP);
}

/**
 * Add or update a city location mapping
 * @param cityName - The name of the city
 * @param locationObject - The PointsYeah location object
 */
export function addCityLocation(cityName: string, locationObject: PointsYeahHotelLocationObject): void {
  const normalizedCity = cityName.toLowerCase().trim();
  CITY_LOCATION_MAP[normalizedCity] = locationObject;
}