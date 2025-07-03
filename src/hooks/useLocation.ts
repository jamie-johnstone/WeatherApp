import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useLocationContext } from '@/context/LocationContext';
import { LocationService, LocationError } from '@/services/LocationService';
import { LocationData } from '@/types';

interface UseLocationReturn {
  currentLocation: LocationData | null;
  isLoadingLocation: boolean;
  locationError: LocationError | null;
  permissionState: {
    granted: boolean;
    canAskAgain: boolean;
    status: 'undetermined' | 'denied' | 'granted';
  };
  // Methods
  requestLocation: () => Promise<void>;
  requestPermissions: () => Promise<void>;
  clearLocationError: () => void;
  startWatching: () => Promise<void>;
  stopWatching: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const {
    state: {
      currentLocation,
      isLoadingLocation,
      locationError,
      permissionState,
    },
    setCurrentLocation,
    setLoadingLocation,
    setLocationError,
    setPermissionState,
    clearLocationError,
  } = useLocationContext();

  const locationService = useRef(LocationService.getInstance());
  const isWatching = useRef(false);

  // Request location permissions
  const requestPermissions = useCallback(async () => {
    try {
      setLoadingLocation(true);
      clearLocationError();

      const permissions = await locationService.current.requestPermissions();
      setPermissionState(permissions);

      if (!permissions.granted) {
        if (!permissions.canAskAgain) {
          Alert.alert(
            'Location Permission Required',
            'Location access has been permanently denied. Please enable it in your device settings to get weather for your current location.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  // In a real app, you'd open device settings
                  // For now, just show an alert
                  Alert.alert(
                    'Open Settings',
                    'Please go to Settings > Privacy & Security > Location Services to enable location access for this app.'
                  );
                },
              },
            ]
          );
        } else {
          Alert.alert(
            'Location Permission Required',
            'This app needs location access to provide weather information for your current location.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Allow', onPress: requestPermissions },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setLocationError(
        new LocationError('PERMISSION_ERROR', 'Failed to request location permissions')
      );
    } finally {
      setLoadingLocation(false);
    }
  }, [setLoadingLocation, clearLocationError, setPermissionState, setLocationError]);

  // Get current location (without auto-requesting permissions to avoid circular dependencies)
  const requestLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);
      clearLocationError();

      // Check permissions first
      const permissions = await locationService.current.checkPermissions();
      setPermissionState(permissions);

      if (!permissions.granted) {
        setLocationError(new LocationError('PERMISSION_DENIED', 'Location permission is required'));
        Alert.alert(
          'Location Permission Required',
          'Please allow location access to get weather for your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await locationService.current.getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      
      if (error instanceof LocationError) {
        setLocationError(error);
        
        // Show user-friendly alerts for specific errors
        switch (error.code) {
          case 'SERVICES_DISABLED':
            Alert.alert(
              'Location Services Disabled',
              'Please enable location services in your device settings to use this feature.',
              [{ text: 'OK' }]
            );
            break;
          case 'TIMEOUT':
            Alert.alert(
              'Location Timeout',
              'Unable to get your location. Please try again or search for a location manually.',
              [{ text: 'OK' }]
            );
            break;
          default:
            Alert.alert(
              'Location Error',
              error.message || 'Unable to get your location. Please try again.',
              [{ text: 'OK' }]
            );
        }
      } else {
        const locationError = new LocationError(
          'UNKNOWN',
          'An unexpected error occurred while getting your location.'
        );
        setLocationError(locationError);
        
        Alert.alert(
          'Location Error',
          'Unable to get your location. Please try again or search for a location manually.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoadingLocation(false);
    }
  }, [
    setLoadingLocation,
    clearLocationError,
    setPermissionState,
    setCurrentLocation,
    setLocationError,
  ]);

  // Start watching location changes
  const startWatching = useCallback(async () => {
    if (isWatching.current) return;

    try {
      isWatching.current = true;
      await locationService.current.startWatchingLocation(
        (location) => {
          setCurrentLocation(location);
        },
        (error) => {
          console.error('Location watch error:', error);
          setLocationError(error);
          isWatching.current = false;
        }
      );
    } catch (error) {
      console.error('Error starting location watch:', error);
      isWatching.current = false;
      setLocationError(
        new LocationError('WATCH_ERROR', 'Unable to monitor location changes')
      );
    }
  }, [setCurrentLocation, setLocationError]);

  // Stop watching location changes
  const stopWatching = useCallback(async () => {
    if (!isWatching.current) return;

    try {
      await locationService.current.stopWatchingLocation();
      isWatching.current = false;
    } catch (error) {
      console.error('Error stopping location watch:', error);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    const checkInitialPermissions = async () => {
      try {
        const permissions = await locationService.current.checkPermissions();
        setPermissionState(permissions);
      } catch (error) {
        console.error('Error checking initial permissions:', error);
      }
    };

    checkInitialPermissions();
  }, [setPermissionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isWatching.current) {
        stopWatching();
      }
    };
  }, [stopWatching]);

  return {
    currentLocation,
    isLoadingLocation,
    locationError,
    permissionState,
    requestLocation,
    requestPermissions,
    clearLocationError,
    startWatching,
    stopWatching,
  };
};