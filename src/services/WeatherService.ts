import {
  WeatherResponse,
  WeatherRequestParams,
  ProcessedWeatherData,
  ProcessedCurrentWeather,
  ProcessedHourlyWeather,
  ProcessedDailyWeather,
  LocationData,
} from '@/types';

// Weather condition code mappings for OpenMeteo
const WEATHER_CODES: Record<number, { description: string; icon: string; dayIcon?: string; nightIcon?: string }> = {
  0: { description: 'Clear sky', icon: '☀️', dayIcon: '☀️', nightIcon: '🌙' },
  1: { description: 'Mainly clear', icon: '🌤️', dayIcon: '🌤️', nightIcon: '🌙' },
  2: { description: 'Partly cloudy', icon: '⛅', dayIcon: '⛅', nightIcon: '☁️' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '❄️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

class WeatherService {
  private static instance: WeatherService;
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';
  private requestCache = new Map<string, { data: WeatherResponse; timestamp: number }>();
  private readonly cacheTimeout = 10 * 60 * 1000; // 10 minutes

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Fetch weather data from OpenMeteo API
   */
  async fetchWeatherData(params: WeatherRequestParams): Promise<WeatherResponse> {
    try {
      // Create cache key
      const cacheKey = this.createCacheKey(params);
      
      // Check cache first
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Build query parameters
      const queryParams = this.buildQueryParams(params);
      const url = `${this.baseUrl}?${queryParams.toString()}`;

      console.log('Fetching weather data from:', url);

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 15000); // 15 seconds
      });

      const fetchPromise = fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: WeatherResponse = await response.json();

      // Validate response data
      this.validateWeatherResponse(data);

      // Cache the response
      this.requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Request timed out')) {
          throw new Error('Weather request timed out. Please check your internet connection.');
        }
        if (error.message.includes('Weather API error')) {
          throw error;
        }
      }
      
      throw new Error('Unable to fetch weather data. Please check your internet connection.');
    }
  }

  /**
   * Get comprehensive weather data for a location
   */
  async getWeatherForLocation(location: LocationData): Promise<ProcessedWeatherData> {
    try {
      const params: WeatherRequestParams = {
        latitude: location.latitude,
        longitude: location.longitude,
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
        timezone: 'auto',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
        precipitation_unit: 'mm',
      };

      const rawData = await this.fetchWeatherData(params);
      return this.processWeatherData(rawData, location);
    } catch (error) {
      console.error('Error getting weather for location:', error);
      throw error;
    }
  }

  /**
   * Process raw weather data into UI-friendly format
   */
  private processWeatherData(data: WeatherResponse, location: LocationData): ProcessedWeatherData {
    return {
      location,
      current: this.processCurrentWeather(data),
      hourly: this.processHourlyWeather(data),
      daily: this.processDailyWeather(data),
      lastUpdated: new Date(),
    };
  }

  /**
   * Process current weather data
   */
  private processCurrentWeather(data: WeatherResponse): ProcessedCurrentWeather {
    if (!data.current) {
      throw new Error('Current weather data not available');
    }

    const current = data.current;
    const weatherInfo = this.getWeatherInfo(current.weather_code, current.is_day === 1);

    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      pressure: Math.round(current.pressure_msl),
      cloudCover: current.cloud_cover,
      isDay: current.is_day === 1,
    };
  }

  /**
   * Process hourly weather data (next 24 hours)
   */
  private processHourlyWeather(data: WeatherResponse): ProcessedHourlyWeather[] {
    if (!data.hourly) {
      return [];
    }

    const hourly = data.hourly;
    const processedHours: ProcessedHourlyWeather[] = [];

    // Get next 24 hours
    const hoursToShow = Math.min(24, hourly.time.length);

    for (let i = 0; i < hoursToShow; i++) {
      const weatherInfo = this.getWeatherInfo(hourly.weather_code[i], true); // Assume day for hourly

      processedHours.push({
        time: new Date(hourly.time[i]),
        temperature: Math.round(hourly.temperature_2m[i]),
        precipitation: hourly.precipitation[i],
        precipitationProbability: hourly.precipitation_probability[i],
        windSpeed: Math.round(hourly.wind_speed_10m[i]),
        icon: weatherInfo.icon,
      });
    }

    return processedHours;
  }

  /**
   * Process daily weather data (next 7 days)
   */
  private processDailyWeather(data: WeatherResponse): ProcessedDailyWeather[] {
    if (!data.daily) {
      return [];
    }

    const daily = data.daily;
    const processedDays: ProcessedDailyWeather[] = [];

    // Get next 7 days
    const daysToShow = Math.min(7, daily.time.length);

    for (let i = 0; i < daysToShow; i++) {
      const weatherInfo = this.getWeatherInfo(daily.weather_code[i], true); // Assume day for daily

      processedDays.push({
        date: new Date(daily.time[i]),
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        precipitationSum: daily.precipitation_sum[i],
        precipitationProbability: daily.precipitation_probability_max[i],
        sunrise: new Date(daily.sunrise[i]),
        sunset: new Date(daily.sunset[i]),
      });
    }

    return processedDays;
  }

  /**
   * Get weather information from weather code
   */
  private getWeatherInfo(code: number, isDay: boolean): { description: string; icon: string } {
    const weatherData = WEATHER_CODES[code] || WEATHER_CODES[0]; // Default to clear sky
    
    let icon = weatherData.icon;
    
    // Use day/night specific icons if available
    if (weatherData.dayIcon && weatherData.nightIcon) {
      icon = isDay ? weatherData.dayIcon : weatherData.nightIcon;
    }

    return {
      description: weatherData.description,
      icon,
    };
  }

  /**
   * Build query parameters for API request
   */
  private buildQueryParams(params: WeatherRequestParams): URLSearchParams {
    const queryParams = new URLSearchParams();

    // Required parameters
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());

    // Optional parameters
    if (params.current?.length) {
      queryParams.append('current', params.current.join(','));
    }
    if (params.hourly?.length) {
      queryParams.append('hourly', params.hourly.join(','));
    }
    if (params.daily?.length) {
      queryParams.append('daily', params.daily.join(','));
    }
    if (params.timezone) {
      queryParams.append('timezone', params.timezone);
    }
    if (params.temperature_unit) {
      queryParams.append('temperature_unit', params.temperature_unit);
    }
    if (params.wind_speed_unit) {
      queryParams.append('wind_speed_unit', params.wind_speed_unit);
    }
    if (params.precipitation_unit) {
      queryParams.append('precipitation_unit', params.precipitation_unit);
    }

    return queryParams;
  }

  /**
   * Create cache key from parameters
   */
  private createCacheKey(params: WeatherRequestParams): string {
    const key = {
      lat: params.latitude.toFixed(4),
      lon: params.longitude.toFixed(4),
      current: params.current?.join(',') || '',
      hourly: params.hourly?.join(',') || '',
      daily: params.daily?.join(',') || '',
    };
    return JSON.stringify(key);
  }

  /**
   * Validate weather response data
   */
  private validateWeatherResponse(data: any): asserts data is WeatherResponse {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid weather response: not an object');
    }

    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      throw new Error('Invalid weather response: missing coordinates');
    }

    if (data.current && typeof data.current !== 'object') {
      throw new Error('Invalid weather response: invalid current data');
    }

    if (data.hourly && (!Array.isArray(data.hourly.time) || !Array.isArray(data.hourly.temperature_2m))) {
      throw new Error('Invalid weather response: invalid hourly data');
    }

    if (data.daily && (!Array.isArray(data.daily.time) || !Array.isArray(data.daily.temperature_2m_max))) {
      throw new Error('Invalid weather response: invalid daily data');
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.requestCache.size;
  }

  /**
   * Clean expired cache entries
   */
  cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.requestCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.requestCache.delete(key);
      }
    }
  }
}

export default WeatherService;
export { WeatherService };