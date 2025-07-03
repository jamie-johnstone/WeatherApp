import * as Location from 'expo-location';
import {
  LocationData,
  LocationPermissionState,
  GeocodingResult,
  GeocodingResponse,
} from '@/types';

class LocationService {
  private static instance: LocationService;
  private watchSubscription: Location.LocationSubscription | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions from the user
   */
  async requestPermissions(): Promise<LocationPermissionState> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
        status: status as 'undetermined' | 'denied' | 'granted',
      };
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Check current location permission status
   */
  async checkPermissions(): Promise<LocationPermissionState> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
        status: status as 'undetermined' | 'denied' | 'granted',
      };
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Get current location with high accuracy
   */
  async getCurrentLocation(): Promise<LocationData> {
    try {
      // Check permissions first
      const permissionState = await this.checkPermissions();
      
      if (!permissionState.granted) {
        throw new LocationError('PERMISSION_DENIED', 'Location permission is required');
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 10, // 10 meters
      });

      // Reverse geocode to get readable address
      const address = await this.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: address?.name || 'Current Location',
        country: address?.country,
        region: address?.region,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      
      if (error instanceof LocationError) {
        throw error;
      }
      
      // Handle specific Location errors
      if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
          case 'E_LOCATION_SERVICES_DISABLED':
            throw new LocationError(
              'SERVICES_DISABLED',
              'Location services are disabled. Please enable them in your device settings.'
            );
          case 'E_LOCATION_TIMEOUT':
            throw new LocationError(
              'TIMEOUT',
              'Location request timed out. Please try again.'
            );
          case 'E_LOCATION_UNAVAILABLE':
            throw new LocationError(
              'UNAVAILABLE',
              'Location is temporarily unavailable. Please try again.'
            );
          default:
            throw new LocationError(
              'UNKNOWN',
              'Unable to get your location. Please try again.'
            );
        }
      }
      
      throw new LocationError(
        'UNKNOWN',
        'An unexpected error occurred while getting your location.'
      );
    }
  }

  /**
   * Watch location changes (for real-time updates)
   */
  async startWatchingLocation(
    callback: (location: LocationData) => void,
    errorCallback: (error: LocationError) => void
  ): Promise<void> {
    try {
      // Check permissions
      const permissionState = await this.checkPermissions();
      
      if (!permissionState.granted) {
        throw new LocationError('PERMISSION_DENIED', 'Location permission is required');
      }

      // Stop existing watch if any
      await this.stopWatchingLocation();

      // Start watching
      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // 30 seconds
          distanceInterval: 50, // 50 meters
        },
        async (location) => {
          try {
            const address = await this.reverseGeocode(
              location.coords.latitude,
              location.coords.longitude
            );

            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              name: address?.name || 'Current Location',
              country: address?.country,
              region: address?.region,
            };

            callback(locationData);
          } catch (error) {
            console.error('Error processing location update:', error);
            errorCallback(
              new LocationError('PROCESSING_ERROR', 'Error processing location update')
            );
          }
        }
      );
    } catch (error) {
      console.error('Error starting location watch:', error);
      errorCallback(
        error instanceof LocationError
          ? error
          : new LocationError('WATCH_ERROR', 'Unable to start location monitoring')
      );
    }
  }

  /**
   * Stop watching location changes
   */
  async stopWatchingLocation(): Promise<void> {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  /**
   * Reverse geocode coordinates to get readable address
   */
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{
    name: string;
    country?: string;
    region?: string;
  } | null> {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const place = result[0];
        return {
          name: place.city || place.district || place.subregion || 'Unknown Location',
          country: place.country || undefined,
          region: place.region || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Search for locations using geocoding
   */
  async searchLocations(query: string): Promise<GeocodingResult[]> {
    try {
      if (query.trim().length < 2) {
        return [];
      }

      // Use OpenMeteo geocoding API for consistency with weather API
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=10&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      return data.results || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new LocationError(
        'SEARCH_ERROR',
        'Unable to search for locations. Please check your internet connection and try again.'
      );
    }
  }

  /**
   * Get location details by coordinates
   */
  async getLocationDetails(latitude: number, longitude: number): Promise<LocationData> {
    try {
      const address = await this.reverseGeocode(latitude, longitude);
      
      return {
        latitude,
        longitude,
        name: address?.name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        country: address?.country,
        region: address?.region,
      };
    } catch (error) {
      console.error('Error getting location details:', error);
      
      // Return basic location data even if geocoding fails
      return {
        latitude,
        longitude,
        name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };
    }
  }

  /**
   * Validate coordinates
   */
  isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180 &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    );
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Custom LocationError class for better error handling
class LocationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'LocationError';
    this.code = code;
  }
}

export { LocationService, LocationError };
export default LocationService;