import { AppSettings } from '@/types';

/**
 * Convert temperature between Celsius and Fahrenheit
 */
export const convertTemperature = (
  temp: number,
  from: 'celsius' | 'fahrenheit',
  to: 'celsius' | 'fahrenheit'
): number => {
  if (from === to) return temp;
  
  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9) / 5 + 32;
  } else if (from === 'fahrenheit' && to === 'celsius') {
    return ((temp - 32) * 5) / 9;
  }
  
  return temp;
};

/**
 * Convert wind speed between different units
 */
export const convertWindSpeed = (
  speed: number,
  from: 'kmh' | 'ms' | 'mph' | 'kn',
  to: 'kmh' | 'ms' | 'mph' | 'kn'
): number => {
  if (from === to) return speed;
  
  // Convert to m/s first as base unit
  let speedInMs = speed;
  
  switch (from) {
    case 'kmh':
      speedInMs = speed / 3.6;
      break;
    case 'mph':
      speedInMs = speed * 0.44704;
      break;
    case 'kn':
      speedInMs = speed * 0.514444;
      break;
    // 'ms' is already base unit
  }
  
  // Convert from m/s to target unit
  switch (to) {
    case 'kmh':
      return speedInMs * 3.6;
    case 'mph':
      return speedInMs / 0.44704;
    case 'kn':
      return speedInMs / 0.514444;
    case 'ms':
      return speedInMs;
    default:
      return speedInMs;
  }
};

/**
 * Convert precipitation between mm and inches
 */
export const convertPrecipitation = (
  precipitation: number,
  from: 'mm' | 'inch',
  to: 'mm' | 'inch'
): number => {
  if (from === to) return precipitation;
  
  if (from === 'mm' && to === 'inch') {
    return precipitation / 25.4;
  } else if (from === 'inch' && to === 'mm') {
    return precipitation * 25.4;
  }
  
  return precipitation;
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Get wind direction arrow
 */
export const getWindDirectionArrow = (degrees: number): string => {
  const arrows = [
    '↓', '↙', '↙', '↙',
    '←', '↖', '↖', '↖',
    '↑', '↗', '↗', '↗',
    '→', '↘', '↘', '↘'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return arrows[index];
};

/**
 * Format temperature with unit
 */
export const formatTemperature = (
  temp: number,
  unit: 'celsius' | 'fahrenheit'
): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

/**
 * Format wind speed with unit
 */
export const formatWindSpeed = (
  speed: number,
  unit: 'kmh' | 'ms' | 'mph' | 'kn'
): string => {
  const unitLabels = {
    kmh: 'km/h',
    ms: 'm/s',
    mph: 'mph',
    kn: 'kn',
  };
  
  return `${Math.round(speed)} ${unitLabels[unit]}`;
};

/**
 * Format precipitation with unit
 */
export const formatPrecipitation = (
  precipitation: number,
  unit: 'mm' | 'inch'
): string => {
  const unitLabel = unit === 'mm' ? 'mm' : 'in';
  const value = unit === 'mm' ? Math.round(precipitation * 10) / 10 : Math.round(precipitation * 100) / 100;
  return `${value} ${unitLabel}`;
};

/**
 * Format time for display
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
};

/**
 * Get UV index description
 */
export const getUVIndexDescription = (uvIndex: number): { level: string; color: string } => {
  if (uvIndex <= 2) {
    return { level: 'Low', color: '#4CAF50' };
  } else if (uvIndex <= 5) {
    return { level: 'Moderate', color: '#FF9800' };
  } else if (uvIndex <= 7) {
    return { level: 'High', color: '#FF5722' };
  } else if (uvIndex <= 10) {
    return { level: 'Very High', color: '#E91E63' };
  } else {
    return { level: 'Extreme', color: '#9C27B0' };
  }
};

/**
 * Get air quality description from PM2.5 value
 */
export const getAirQualityDescription = (pm25: number): { level: string; color: string } => {
  if (pm25 <= 12) {
    return { level: 'Good', color: '#4CAF50' };
  } else if (pm25 <= 35) {
    return { level: 'Moderate', color: '#FF9800' };
  } else if (pm25 <= 55) {
    return { level: 'Unhealthy for Sensitive', color: '#FF5722' };
  } else if (pm25 <= 150) {
    return { level: 'Unhealthy', color: '#E91E63' };
  } else if (pm25 <= 250) {
    return { level: 'Very Unhealthy', color: '#9C27B0' };
  } else {
    return { level: 'Hazardous', color: '#8D6E63' };
  }
};

/**
 * Get humidity comfort level
 */
export const getHumidityComfort = (humidity: number): { level: string; color: string } => {
  if (humidity < 30) {
    return { level: 'Too Dry', color: '#FF5722' };
  } else if (humidity <= 50) {
    return { level: 'Comfortable', color: '#4CAF50' };
  } else if (humidity <= 70) {
    return { level: 'Slightly Humid', color: '#FF9800' };
  } else {
    return { level: 'Too Humid', color: '#E91E63' };
  }
};

/**
 * Apply user settings to weather values
 */
export const applyWeatherSettings = (
  value: number,
  type: 'temperature' | 'windSpeed' | 'precipitation',
  settings: AppSettings
): { value: number; unit: string } => {
  switch (type) {
    case 'temperature':
      // Weather API returns Celsius, convert if needed
      const temp = settings.temperatureUnit === 'fahrenheit' 
        ? convertTemperature(value, 'celsius', 'fahrenheit')
        : value;
      return {
        value: temp,
        unit: settings.temperatureUnit === 'celsius' ? '°C' : '°F'
      };
      
    case 'windSpeed':
      // Weather API returns km/h, convert if needed
      const speed = convertWindSpeed(value, 'kmh', settings.windSpeedUnit);
      const speedUnits = {
        kmh: 'km/h',
        ms: 'm/s',
        mph: 'mph',
        kn: 'kn',
      };
      return {
        value: speed,
        unit: speedUnits[settings.windSpeedUnit]
      };
      
    case 'precipitation':
      // Weather API returns mm, convert if needed
      const precip = settings.precipitationUnit === 'inch'
        ? convertPrecipitation(value, 'mm', 'inch')
        : value;
      return {
        value: precip,
        unit: settings.precipitationUnit === 'mm' ? 'mm' : 'in'
      };
      
    default:
      return { value, unit: '' };
  }
};

/**
 * Check if weather data is stale
 */
export const isWeatherDataStale = (lastUpdated: Date, maxAgeMinutes: number = 30): boolean => {
  const now = new Date();
  const diffMs = now.getTime() - lastUpdated.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes > maxAgeMinutes;
};

/**
 * Get weather alert priority based on conditions
 */
export const getWeatherAlertPriority = (
  temperature: number,
  windSpeed: number,
  precipitation: number,
  weatherCode: number
): 'low' | 'medium' | 'high' | 'critical' => {
  // Critical weather conditions
  if (weatherCode >= 95 || windSpeed > 100 || temperature < -20 || temperature > 40) {
    return 'critical';
  }
  
  // High priority conditions
  if (weatherCode >= 80 || windSpeed > 60 || temperature < -10 || temperature > 35) {
    return 'high';
  }
  
  // Medium priority conditions
  if (weatherCode >= 61 || windSpeed > 40 || precipitation > 10) {
    return 'medium';
  }
  
  return 'low';
};