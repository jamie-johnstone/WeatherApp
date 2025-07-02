// Location-related types
export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
  region?: string;
  timezone?: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LocationPermissionState {
  granted: boolean;
  canAskAgain: boolean;
  status: 'undetermined' | 'denied' | 'granted';
}

export interface LocationError {
  code: string;
  message: string;
}

// Geocoding types
export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // State/Province
  admin2?: string; // County/District
  admin3?: string; // City/Town
  admin4?: string; // Village/Neighborhood
  population?: number;
  timezone?: string;
}

export interface GeocodingResponse {
  results: GeocodingResult[];
  generationtime_ms: number;
}

// Saved locations
export interface SavedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  isFavorite: boolean;
  createdAt: Date;
  lastUsed: Date;
}