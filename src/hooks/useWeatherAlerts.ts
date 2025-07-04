import { useState, useCallback, useEffect } from 'react';
// import { Alert } from 'react-native';
import { ProcessedWeatherData } from '@/types';
// import { getWeatherAlertPriority } from '@/utils/weatherUtils';

export interface WeatherAlertData {
  id: string;
  type: 'temperature' | 'precipitation' | 'wind' | 'general';
  severity: 'info' | 'warning' | 'severe' | 'extreme';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  expiresAt?: Date;
}

interface UseWeatherAlertsReturn {
  alerts: WeatherAlertData[];
  addAlert: (alert: Omit<WeatherAlertData, 'id' | 'timestamp'>) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  checkWeatherConditions: (weatherData: ProcessedWeatherData) => void;
}

export const useWeatherAlerts = (): UseWeatherAlertsReturn => {
  const [alerts, setAlerts] = useState<WeatherAlertData[]>([]);

  // Generate unique ID for alerts
  const generateAlertId = (): string => {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add new alert
  const addAlert = useCallback((alertData: Omit<WeatherAlertData, 'id' | 'timestamp'>) => {
    const newAlert: WeatherAlertData = {
      ...alertData,
      id: generateAlertId(),
      timestamp: new Date(),
    };

    setAlerts(prevAlerts => {
      // Check if similar alert already exists (same type and severity)
      const existingAlert = prevAlerts.find(
        alert => alert.type === newAlert.type && alert.severity === newAlert.severity
      );

      if (existingAlert) {
        // Update existing alert instead of creating duplicate
        return prevAlerts.map(alert =>
          alert.id === existingAlert.id ? newAlert : alert
        );
      }

      // Add new alert at the beginning (most recent first)
      return [newAlert, ...prevAlerts];
    });
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Check weather conditions and generate alerts
  const checkWeatherConditions = useCallback((weatherData: ProcessedWeatherData) => {
    const { current } = weatherData;
    const newAlerts: Array<Omit<WeatherAlertData, 'id' | 'timestamp'>> = [];

    // Temperature alerts
    if (current.temperature <= -10) {
      newAlerts.push({
        type: 'temperature',
        severity: 'severe',
        title: 'Extreme Cold Warning',
        message: `Temperature is ${current.temperature}°C. Bundle up and limit outdoor exposure.`,
        icon: '🥶',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
      });
    } else if (current.temperature <= 0) {
      newAlerts.push({
        type: 'temperature',
        severity: 'warning',
        title: 'Freezing Temperature',
        message: `Temperature is at freezing point (${current.temperature}°C). Watch for ice.`,
        icon: '🧊',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      });
    } else if (current.temperature >= 35) {
      newAlerts.push({
        type: 'temperature',
        severity: 'severe',
        title: 'Extreme Heat Warning',
        message: `Temperature is ${current.temperature}°C. Stay hydrated and seek shade.`,
        icon: '🔥',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      });
    } else if (current.temperature >= 30) {
      newAlerts.push({
        type: 'temperature',
        severity: 'warning',
        title: 'High Temperature Alert',
        message: `Temperature is ${current.temperature}°C. Stay cool and drink plenty of water.`,
        icon: '☀️',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
      });
    }

    // Wind alerts
    if (current.windSpeed >= 80) {
      newAlerts.push({
        type: 'wind',
        severity: 'extreme',
        title: 'Extreme Wind Warning',
        message: `Wind speed is ${current.windSpeed} km/h. Avoid outdoor activities.`,
        icon: '🌪️',
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
      });
    } else if (current.windSpeed >= 60) {
      newAlerts.push({
        type: 'wind',
        severity: 'severe',
        title: 'High Wind Alert',
        message: `Strong winds at ${current.windSpeed} km/h. Secure loose objects.`,
        icon: '💨',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      });
    } else if (current.windSpeed >= 40) {
      newAlerts.push({
        type: 'wind',
        severity: 'warning',
        title: 'Windy Conditions',
        message: `Moderate winds at ${current.windSpeed} km/h. Be cautious outdoors.`,
        icon: '🍃',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      });
    }

    // Precipitation alerts (check hourly data for upcoming rain)
    if (weatherData.hourly && weatherData.hourly.length > 0) {
      const nextHour = weatherData.hourly[0];
      if (nextHour && nextHour.precipitationProbability >= 80) {
        newAlerts.push({
          type: 'precipitation',
          severity: 'info',
          title: 'Rain Expected',
          message: `${nextHour.precipitationProbability}% chance of rain in the next hour.`,
          icon: '🌧️',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        });
      }
    }

    // Weather code based alerts
    if (current.description.toLowerCase().includes('thunderstorm')) {
      newAlerts.push({
        type: 'general',
        severity: 'severe',
        title: 'Thunderstorm Alert',
        message: 'Thunderstorm conditions detected. Seek indoor shelter.',
        icon: '⛈️',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      });
    } else if (current.description.toLowerCase().includes('snow')) {
      newAlerts.push({
        type: 'precipitation',
        severity: 'warning',
        title: 'Snow Conditions',
        message: 'Snow is falling. Drive carefully and dress warmly.',
        icon: '❄️',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
      });
    }

    // Add all new alerts
    newAlerts.forEach(alertData => addAlert(alertData));
  }, [addAlert]);

  // Clean up expired alerts
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setAlerts(prevAlerts =>
        prevAlerts.filter(alert => !alert.expiresAt || alert.expiresAt > now)
      );
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    alerts,
    addAlert,
    dismissAlert,
    clearAllAlerts,
    checkWeatherConditions,
  };
};