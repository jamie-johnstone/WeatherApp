import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppSettings, LocationData, ProcessedWeatherData, SavedLocation } from '@/types';

// Initial settings
const initialSettings: AppSettings = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  precipitationUnit: 'mm',
  theme: 'auto',
  notifications: true,
  locationSharing: true,
};

// Initial state
const initialState: AppState = {
  isLoading: false,
  error: null,
  settings: initialSettings,
  currentLocation: null,
  weatherData: null,
  savedLocations: [],
};

// Action types
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_LOCATION'; payload: LocationData | null }
  | { type: 'SET_WEATHER_DATA'; payload: ProcessedWeatherData | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_SAVED_LOCATION'; payload: SavedLocation }
  | { type: 'REMOVE_SAVED_LOCATION'; payload: string }
  | { type: 'UPDATE_SAVED_LOCATION'; payload: SavedLocation }
  | { type: 'SET_SAVED_LOCATIONS'; payload: SavedLocation[] }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.payload };
    
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload, isLoading: false };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'ADD_SAVED_LOCATION':
      return {
        ...state,
        savedLocations: [...state.savedLocations, action.payload],
      };
    
    case 'REMOVE_SAVED_LOCATION':
      return {
        ...state,
        savedLocations: state.savedLocations.filter(
          (location) => location.id !== action.payload
        ),
      };
    
    case 'UPDATE_SAVED_LOCATION':
      return {
        ...state,
        savedLocations: state.savedLocations.map((location) =>
          location.id === action.payload.id ? action.payload : location
        ),
      };
    
    case 'SET_SAVED_LOCATIONS':
      return { ...state, savedLocations: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setCurrentLocation: (location: LocationData | null) => void;
  setWeatherData: (data: ProcessedWeatherData | null) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addSavedLocation: (location: SavedLocation) => void;
  removeSavedLocation: (id: string) => void;
  updateSavedLocation: (location: SavedLocation) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setCurrentLocation = (location: LocationData | null) => {
    dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
  };

  const setWeatherData = (data: ProcessedWeatherData | null) => {
    dispatch({ type: 'SET_WEATHER_DATA', payload: data });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const addSavedLocation = (location: SavedLocation) => {
    dispatch({ type: 'ADD_SAVED_LOCATION', payload: location });
  };

  const removeSavedLocation = (id: string) => {
    dispatch({ type: 'REMOVE_SAVED_LOCATION', payload: id });
  };

  const updateSavedLocation = (location: SavedLocation) => {
    dispatch({ type: 'UPDATE_SAVED_LOCATION', payload: location });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    clearError,
    setCurrentLocation,
    setWeatherData,
    updateSettings,
    addSavedLocation,
    removeSavedLocation,
    updateSavedLocation,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};