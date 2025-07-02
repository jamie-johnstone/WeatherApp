// OpenMeteo API response types
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current?: CurrentWeather;
  hourly?: HourlyWeather;
  daily?: DailyWeather;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  sunshine_duration: number[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

// Import LocationData from location types
import type { LocationData } from './location';

// Processed weather data types for UI
export interface ProcessedWeatherData {
  location: LocationData;
  current: ProcessedCurrentWeather;
  hourly: ProcessedHourlyWeather[];
  daily: ProcessedDailyWeather[];
  lastUpdated: Date;
}

export interface ProcessedCurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  isDay: boolean;
}

export interface ProcessedHourlyWeather {
  time: Date;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  icon: string;
}

export interface ProcessedDailyWeather {
  date: Date;
  maxTemp: number;
  minTemp: number;
  description: string;
  icon: string;
  precipitationSum: number;
  precipitationProbability: number;
  sunrise: Date;
  sunset: Date;
}

// Weather condition mappings
export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
  dayIcon?: string;
  nightIcon?: string;
}

// API request parameters
export interface WeatherRequestParams {
  latitude: number;
  longitude: number;
  current?: string[];
  hourly?: string[];
  daily?: string[];
  timezone?: string;
  temperature_unit?: 'celsius' | 'fahrenheit';
  wind_speed_unit?: 'kmh' | 'ms' | 'mph' | 'kn';
  precipitation_unit?: 'mm' | 'inch';
}