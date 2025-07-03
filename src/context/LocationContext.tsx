import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LocationData, LocationPermissionState } from '@/types';
import { LocationError } from '@/services/LocationService';

// Location-specific state
interface LocationState {
  currentLocation: LocationData | null;
  permissionState: LocationPermissionState;
  isLoadingLocation: boolean;
  locationError: LocationError | null;
  lastKnownLocation: LocationData | null;
}

// Initial location state
const initialLocationState: LocationState = {
  currentLocation: null,
  permissionState: {
    granted: false,
    canAskAgain: true,
    status: 'undetermined',
  },
  isLoadingLocation: false,
  locationError: null,
  lastKnownLocation: null,
};

// Location action types
export type LocationAction =
  | { type: 'SET_CURRENT_LOCATION'; payload: LocationData | null }
  | { type: 'SET_PERMISSION_STATE'; payload: LocationPermissionState }
  | { type: 'SET_LOADING_LOCATION'; payload: boolean }
  | { type: 'SET_LOCATION_ERROR'; payload: LocationError | null }
  | { type: 'SET_LAST_KNOWN_LOCATION'; payload: LocationData | null }
  | { type: 'CLEAR_LOCATION_ERROR' }
  | { type: 'RESET_LOCATION_STATE' };

// Location reducer
const locationReducer = (state: LocationState, action: LocationAction): LocationState => {
  switch (action.type) {
    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        currentLocation: action.payload,
        isLoadingLocation: false,
        locationError: null,
        lastKnownLocation: action.payload || state.lastKnownLocation,
      };
    
    case 'SET_PERMISSION_STATE':
      return { ...state, permissionState: action.payload };
    
    case 'SET_LOADING_LOCATION':
      return { ...state, isLoadingLocation: action.payload };
    
    case 'SET_LOCATION_ERROR':
      return {
        ...state,
        locationError: action.payload,
        isLoadingLocation: false,
      };
    
    case 'SET_LAST_KNOWN_LOCATION':
      return { ...state, lastKnownLocation: action.payload };
    
    case 'CLEAR_LOCATION_ERROR':
      return { ...state, locationError: null };
    
    case 'RESET_LOCATION_STATE':
      return initialLocationState;
    
    default:
      return state;
  }
};

// Location context type
interface LocationContextType {
  state: LocationState;
  dispatch: React.Dispatch<LocationAction>;
  // Helper functions
  setCurrentLocation: (location: LocationData | null) => void;
  setPermissionState: (state: LocationPermissionState) => void;
  setLoadingLocation: (loading: boolean) => void;
  setLocationError: (error: LocationError | null) => void;
  clearLocationError: () => void;
  setLastKnownLocation: (location: LocationData | null) => void;
}

// Create location context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Location provider component
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialLocationState);

  // Helper functions
  const setCurrentLocation = (location: LocationData | null) => {
    dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
  };

  const setPermissionState = (permissionState: LocationPermissionState) => {
    dispatch({ type: 'SET_PERMISSION_STATE', payload: permissionState });
  };

  const setLoadingLocation = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING_LOCATION', payload: loading });
  };

  const setLocationError = (error: LocationError | null) => {
    dispatch({ type: 'SET_LOCATION_ERROR', payload: error });
  };

  const clearLocationError = () => {
    dispatch({ type: 'CLEAR_LOCATION_ERROR' });
  };

  const setLastKnownLocation = (location: LocationData | null) => {
    dispatch({ type: 'SET_LAST_KNOWN_LOCATION', payload: location });
  };

  const contextValue: LocationContextType = {
    state,
    dispatch,
    setCurrentLocation,
    setPermissionState,
    setLoadingLocation,
    setLocationError,
    clearLocationError,
    setLastKnownLocation,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};