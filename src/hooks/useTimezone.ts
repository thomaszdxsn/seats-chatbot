/**
 * useTimezone Hook
 * 
 * Custom hook to detect and provide user's browser timezone information
 */
export function useTimezone(): string {
  // Direct timezone detection - no need for useEffect or useRef
  // This is synchronous and available immediately
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return timezone;
}