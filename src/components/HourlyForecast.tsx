import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { WeatherIcon } from './WeatherIcon';
import { ProcessedHourlyWeather } from '@/types';
import { formatTemperature } from '@/utils/weatherUtils';

interface HourlyForecastProps {
  hourlyData: ProcessedHourlyWeather[];
  temperatureUnit: 'celsius' | 'fahrenheit';
  showPrecipitation?: boolean;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyData,
  temperatureUnit,
  showPrecipitation = true,
}) => {
  const theme = useTheme();
  const { isTablet } = useResponsive();

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  const formatPrecipitation = (precipitation: number): string => {
    if (precipitation < 0.1) return '0%';
    return `${Math.round(precipitation * 10) / 10}mm`;
  };

  const renderHourlyItem = ({ item, index }: { item: ProcessedHourlyWeather; index: number }) => {
    const isNow = index === 0;
    
    const itemStyle = {
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      minWidth: isTablet ? 100 : 80,
      backgroundColor: isNow ? theme.colors.primary + '20' : 'transparent',
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
    };

    const timeStyle = {
      fontSize: isTablet ? theme.typography.fontSize.sm : theme.typography.fontSize.xs,
      color: isNow ? theme.colors.primary : theme.colors.textSecondary,
      fontWeight: isNow ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
      marginBottom: theme.spacing.xs,
    };

    const temperatureStyle = {
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
      color: theme.colors.textPrimary,
      fontWeight: theme.typography.fontWeight.semibold,
      marginTop: theme.spacing.xs,
    };

    const precipitationStyle = {
      fontSize: isTablet ? theme.typography.fontSize.xs : 10,
      color: theme.colors.info,
      marginTop: theme.spacing.xs / 2,
    };

    return (
      <View style={itemStyle}>
        <Text style={timeStyle}>
          {isNow ? 'Now' : formatTime(item.time)}
        </Text>
        
        <WeatherIcon 
          icon={item.icon} 
          size={isTablet ? 32 : 24}
        />
        
        <Text style={temperatureStyle}>
          {formatTemperature(item.temperature, temperatureUnit)}
        </Text>
        
        {showPrecipitation && item.precipitationProbability > 0 && (
          <Text style={precipitationStyle}>
            {item.precipitationProbability}%
          </Text>
        )}
        
        {showPrecipitation && item.precipitation > 0 && (
          <Text style={precipitationStyle}>
            {formatPrecipitation(item.precipitation)}
          </Text>
        )}
      </View>
    );
  };

  const containerStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  };

  const titleStyle = {
    fontSize: isTablet ? theme.typography.fontSize.lg : theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  };

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Hourly Forecast</Text>
      
      <FlatList
        data={hourlyData.slice(0, 24)} // Show next 24 hours
        renderItem={renderHourlyItem}
        keyExtractor={(_, index) => `hour-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.xs,
        }}
        ItemSeparatorComponent={() => <View style={{ width: theme.spacing.xs }} />}
      />
    </View>
  );
};