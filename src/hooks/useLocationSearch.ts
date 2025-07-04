import { useState, useCallback, useRef, useEffect } from 'react';
import { LocationService, LocationError } from '@/services/LocationService';
import { GeocodingResult, LocationData } from '@/types';

interface UseLocationSearchReturn {
  searchResults: GeocodingResult[];
  isSearching: boolean;
  searchError: LocationError | null;
  searchQuery: string;
  // Methods
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
  setQuery: (query: string) => void;
  convertToLocationData: (result: GeocodingResult) => LocationData;
}

export const useLocationSearch = (): UseLocationSearchReturn => {
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<LocationError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const locationService = useRef(LocationService.getInstance());
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Search for locations with debouncing
  const search = useCallback(async (query: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmedQuery = query.trim();
    
    // Clear results for empty queries
    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError(null);

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        const results = await locationService.current.searchLocations(trimmedQuery, abortControllerRef.current.signal);
        
        // Only update if request wasn't aborted
        if (!abortControllerRef.current.signal.aborted) {
          setSearchResults(results);
        }
      } catch (error) {
        // Don't handle AbortError - it's expected when cancelling requests
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        
        // Only handle error if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Search error:', error);
          
          if (error instanceof LocationError) {
            setSearchError(error);
          } else {
            setSearchError(
              new LocationError(
                'SEARCH_ERROR',
                'Unable to search for locations. Please check your internet connection.'
              )
            );
          }
          setSearchResults([]);
        }
      } finally {
        // Only update loading state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300); // 300ms debounce
  }, []);

  // Clear search results
  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  // Clear search error
  const clearError = useCallback(() => {
    setSearchError(null);
  }, []);

  // Set search query
  const setQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Convert GeocodingResult to LocationData
  const convertToLocationData = useCallback((result: GeocodingResult): LocationData => {
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
      region: result.admin1, // State/Province
      timezone: result.timezone,
    };
  }, []);

  // Auto-search when query changes
  useEffect(() => {
    search(searchQuery);
  }, [searchQuery]); // Remove search from dependencies since it's stable

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    search,
    clearResults,
    clearError,
    setQuery,
    convertToLocationData,
  };
};