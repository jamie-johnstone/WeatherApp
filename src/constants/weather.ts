// Weather refresh intervals
export const WEATHER_REFRESH_INTERVALS = {
  FOREGROUND: 10 * 60 * 1000, // 10 minutes
  BACKGROUND: 30 * 60 * 1000, // 30 minutes
  STALE_THRESHOLD: 60 * 60 * 1000, // 1 hour
} as const;

// API Configuration
export const WEATHER_API_CONFIG = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',
  TIMEOUT: 15000, // 15 seconds
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Default weather parameters
export const DEFAULT_WEATHER_PARAMS = {
  current: [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'wind_speed_10m',
    'wind_direction_10m',
  ],
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
  ],
  daily: [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_direction_10m_dominant',
  ],
} as const;

// Weather code groups for categorization
export const WEATHER_CODE_GROUPS = {
  CLEAR: [0, 1],
  CLOUDY: [2, 3],
  FOG: [45, 48],
  DRIZZLE: [51, 53, 55, 56, 57],
  RAIN: [61, 63, 65, 66, 67, 80, 81, 82],
  SNOW: [71, 73, 75, 77, 85, 86],
  THUNDERSTORM: [95, 96, 99],
} as const;

// Temperature thresholds for color coding
export const TEMPERATURE_THRESHOLDS = {
  VERY_COLD: -10,
  COLD: 0,
  COOL: 10,
  MILD: 20,
  WARM: 25,
  HOT: 30,
  VERY_HOT: 35,
} as const;

// Wind speed thresholds (Beaufort scale in km/h)
export const WIND_SPEED_THRESHOLDS = {
  CALM: 1,
  LIGHT_AIR: 5,
  LIGHT_BREEZE: 11,
  GENTLE_BREEZE: 19,
  MODERATE_BREEZE: 28,
  FRESH_BREEZE: 38,
  STRONG_BREEZE: 49,
  NEAR_GALE: 61,
  GALE: 74,
  STRONG_GALE: 88,
  STORM: 102,
  VIOLENT_STORM: 117,
  HURRICANE: 118,
} as const;

// Precipitation intensity thresholds (mm/h)
export const PRECIPITATION_THRESHOLDS = {
  VERY_LIGHT: 0.1,
  LIGHT: 2.5,
  MODERATE: 7.6,
  HEAVY: 50,
  VIOLENT: 100,
} as const;

// Color schemes for different weather conditions
export const WEATHER_COLORS = {
  CLEAR_DAY: '#87CEEB',
  CLEAR_NIGHT: '#191970',
  CLOUDY: '#708090',
  RAIN: '#4682B4',
  SNOW: '#F0F8FF',
  THUNDERSTORM: '#2F4F4F',
  FOG: '#D3D3D3',
  
  // Temperature colors
  VERY_COLD: '#0066CC',
  COLD: '#0099CC',
  COOL: '#00CCCC',
  MILD: '#00CC66',
  WARM: '#FFCC00',
  HOT: '#FF6600',
  VERY_HOT: '#CC0000',
} as const;

// Unit conversion factors
export const UNIT_CONVERSIONS = {
  TEMPERATURE: {
    C_TO_F_FACTOR: 9 / 5,
    C_TO_F_OFFSET: 32,
  },
  WIND_SPEED: {
    KMH_TO_MS: 1 / 3.6,
    KMH_TO_MPH: 0.621371,
    KMH_TO_KN: 0.539957,
  },
  PRECIPITATION: {
    MM_TO_INCH: 1 / 25.4,
  },
  PRESSURE: {
    HPA_TO_INHG: 0.02953,
    HPA_TO_MMHG: 0.750062,
  },
} as const;

// Display format options
export const DISPLAY_FORMATS = {
  TIME: {
    HOUR_12: 'h:mm a',
    HOUR_24: 'HH:mm',
  },
  DATE: {
    SHORT: 'MMM d',
    MEDIUM: 'MMM d, yyyy',
    LONG: 'MMMM d, yyyy',
    WEEKDAY: 'EEEE',
    WEEKDAY_SHORT: 'EEE',
  },
} as const;

// Error messages
export const WEATHER_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to weather service. Please check your internet connection.',
  TIMEOUT_ERROR: 'Weather request timed out. Please try again.',
  LOCATION_ERROR: 'Unable to get weather for this location. Please try a different location.',
  INVALID_RESPONSE: 'Received invalid weather data. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Weather service is temporarily unavailable. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success messages
export const WEATHER_SUCCESS_MESSAGES = {
  DATA_REFRESHED: 'Weather data updated successfully',
  LOCATION_UPDATED: 'Weather location updated',
  SETTINGS_SAVED: 'Weather settings saved',
} as const;

// Loading messages
export const WEATHER_LOADING_MESSAGES = {
  FETCHING_WEATHER: 'Getting weather data...',
  UPDATING_LOCATION: 'Updating weather for your location...',
  REFRESHING: 'Refreshing weather data...',
} as const;