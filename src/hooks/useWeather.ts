import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { WeatherService } from '@/services/WeatherService';
import { LocationData, ProcessedWeatherData } from '@/types';
import { isWeatherDataStale } from '@/utils/weatherUtils';
import { WEATHER_REFRESH_INTERVALS, WEATHER_ERROR_MESSAGES } from '@/constants/weather';

interface UseWeatherReturn {
  weatherData: ProcessedWeatherData | null;
  isLoadingWeather: boolean;
  weatherError: string | null;
  lastUpdated: Date | null;
  isDataStale: boolean;
  // Methods
  fetchWeatherForLocation: (location: LocationData) => Promise<void>;
  refreshWeather: () => Promise<void>;
  clearWeatherError: () => void;
  clearWeatherData: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const { state, setWeatherData, setLoading } = useAppContext();
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const weatherService = useRef(WeatherService.getInstance());
  const currentRequestRef = useRef<AbortController | null>(null);
  const lastLocationRef = useRef<LocationData | null>(null);

  // Check if weather data is stale
  const isDataStale = lastUpdated 
    ? isWeatherDataStale(lastUpdated, WEATHER_REFRESH_INTERVALS.STALE_THRESHOLD / (1000 * 60))
    : true;

  // Fetch weather for a specific location
  const fetchWeatherForLocation = useCallback(async (location: LocationData) => {
    try {
      // Cancel any existing request
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }

      // Create new abort controller
      currentRequestRef.current = new AbortController();

      setIsLoadingWeather(true);
      setWeatherError(null);
      setLoading(true);

      // Store the location for potential retries
      lastLocationRef.current = location;

      console.log('Fetching weather for location:', location.name, location.latitude, location.longitude);

      const weatherData = await weatherService.current.getWeatherForLocation(location);

      // Only update if request wasn't aborted
      if (!currentRequestRef.current.signal.aborted) {
        setWeatherData(weatherData);
        setLastUpdated(new Date());
        console.log('Weather data fetched successfully:', weatherData.current);
      }
    } catch (error) {
      // Only handle error if request wasn't aborted
      if (!currentRequestRef.current?.signal.aborted) {
        console.error('Error fetching weather:', error);
        
        let errorMessage: string = WEATHER_ERROR_MESSAGES.UNKNOWN_ERROR;
        
        if (error instanceof Error) {
          if (error.message.includes('timeout') || error.message.includes('timed out')) {
            errorMessage = WEATHER_ERROR_MESSAGES.TIMEOUT_ERROR;
          } else if (error.message.includes('network') || error.message.includes('internet')) {
            errorMessage = WEATHER_ERROR_MESSAGES.NETWORK_ERROR;
          } else if (error.message.includes('Weather API error')) {
            if (error.message.includes('429')) {
              errorMessage = WEATHER_ERROR_MESSAGES.RATE_LIMIT;
            } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
              errorMessage = WEATHER_ERROR_MESSAGES.SERVER_ERROR;
            } else {
              errorMessage = WEATHER_ERROR_MESSAGES.LOCATION_ERROR;
            }
          } else if (error.message.includes('Invalid weather response')) {
            errorMessage = WEATHER_ERROR_MESSAGES.INVALID_RESPONSE;
          } else {
            errorMessage = error.message;
          }
        }
        
        setWeatherError(errorMessage);
        
        // Show user-friendly alert for critical errors
        Alert.alert(
          'Weather Error',
          errorMessage,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Retry',
              onPress: () => {
                if (lastLocationRef.current) {
                  fetchWeatherForLocation(lastLocationRef.current);
                }
              },
            },
          ]
        );
      }
    } finally {
      // Only update loading state if request wasn't aborted
      if (!currentRequestRef.current?.signal.aborted) {
        setIsLoadingWeather(false);
        setLoading(false);
      }
    }
  }, [setWeatherData, setLoading]);

  // Refresh weather data for the last location
  const refreshWeather = useCallback(async () => {
    if (lastLocationRef.current) {
      await fetchWeatherForLocation(lastLocationRef.current);
    } else {
      setWeatherError('No location available for refresh');
    }
  }, [fetchWeatherForLocation]);

  // Clear weather error
  const clearWeatherError = useCallback(() => {
    setWeatherError(null);
  }, []);

  // Clear weather data
  const clearWeatherData = useCallback(() => {
    setWeatherData(null);
    setLastUpdated(null);
    lastLocationRef.current = null;
  }, [setWeatherData]);

  // Auto-refresh weather data periodically
  useEffect(() => {
    if (!state.weatherData || !lastUpdated) return;

    const refreshInterval = setInterval(() => {
      if (isWeatherDataStale(lastUpdated, WEATHER_REFRESH_INTERVALS.FOREGROUND / (1000 * 60))) {
        console.log('Auto-refreshing stale weather data');
        refreshWeather();
      }
    }, WEATHER_REFRESH_INTERVALS.FOREGROUND);

    return () => clearInterval(refreshInterval);
  }, [state.weatherData, lastUpdated, refreshWeather]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  return {
    weatherData: state.weatherData,
    isLoadingWeather,
    weatherError,
    lastUpdated,
    isDataStale,
    fetchWeatherForLocation,
    refreshWeather,
    clearWeatherError,
    clearWeatherData,
  };
};