// Export all types from a single entry point
export * from './weather';
export * from './location';
export * from './navigation';

// Import types for use in interfaces
import type { LocationData, SavedLocation } from './location';
import type { ProcessedWeatherData } from './weather';

// Common utility types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
}

// App state types
export interface AppSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'ms' | 'mph' | 'kn';
  precipitationUnit: 'mm' | 'inch';
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  locationSharing: boolean;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  settings: AppSettings;
  currentLocation: LocationData | null;
  weatherData: ProcessedWeatherData | null;
  savedLocations: SavedLocation[];
}