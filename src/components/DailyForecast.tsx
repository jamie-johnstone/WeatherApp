import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { WeatherIcon } from './WeatherIcon';
import { ProcessedDailyWeather } from '@/types';
import { formatTemperature } from '@/utils/weatherUtils';

interface DailyForecastProps {
  dailyData: ProcessedDailyWeather[];
  temperatureUnit: 'celsius' | 'fahrenheit';
  onDayPress?: (day: ProcessedDailyWeather) => void;
  showPrecipitation?: boolean;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  dailyData,
  temperatureUnit,
  onDayPress,
  showPrecipitation = true,
}) => {
  const theme = useTheme();
  const { isTablet } = useResponsive();

  const formatDay = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
  };

  const renderDailyItem = ({ item, index }: { item: ProcessedDailyWeather; index: number }) => {
    const isToday = index === 0;
    
    const itemStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.base,
      backgroundColor: isToday ? theme.colors.primary + '10' : 'transparent',
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      minHeight: isTablet ? 70 : 60,
    };

    const dayStyle = {
      flex: 1,
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
      color: theme.colors.textPrimary,
      fontWeight: isToday ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
    };

    const descriptionStyle = {
      flex: 2,
      fontSize: isTablet ? theme.typography.fontSize.sm : theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.md,
    };

    const precipitationStyle = {
      fontSize: isTablet ? theme.typography.fontSize.xs : 10,
      color: theme.colors.info,
      marginLeft: theme.spacing.sm,
      minWidth: isTablet ? 40 : 30,
      textAlign: 'center' as const,
    };

    const temperatureContainerStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minWidth: isTablet ? 100 : 80,
      justifyContent: 'flex-end' as const,
    };

    const maxTempStyle = {
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
      color: theme.colors.textPrimary,
      fontWeight: theme.typography.fontWeight.semibold,
      marginRight: theme.spacing.sm,
    };

    const minTempStyle = {
      fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.fontWeight.normal,
    };

    return (
      <TouchableOpacity
        style={itemStyle}
        onPress={() => onDayPress?.(item)}
        activeOpacity={0.7}
      >
        <Text style={dayStyle}>
          {formatDay(item.date)}
        </Text>
        
        <WeatherIcon 
          icon={item.icon} 
          size={isTablet ? 32 : 24}
        />
        
        <Text style={descriptionStyle} numberOfLines={1}>
          {item.description}
        </Text>
        
        {showPrecipitation && item.precipitationProbability > 0 && (
          <Text style={precipitationStyle}>
            {item.precipitationProbability}%
          </Text>
        )}
        
        <View style={temperatureContainerStyle}>
          <Text style={maxTempStyle}>
            {formatTemperature(item.maxTemp, temperatureUnit)}
          </Text>
          <Text style={minTempStyle}>
            {formatTemperature(item.minTemp, temperatureUnit)}
          </Text>
        </View>
      </TouchableOpacity>
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

  const headerStyle = {
    flexDirection: 'row' as const,
    paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  };

  const headerTextStyle = {
    fontSize: isTablet ? theme.typography.fontSize.xs : 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: 'uppercase' as const,
  };

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>7-Day Forecast</Text>
      
      <View style={headerStyle}>
        <Text style={[headerTextStyle, { flex: 1 }]}>Day</Text>
        <Text style={[headerTextStyle, { flex: 2, marginLeft: theme.spacing.md + 32 + theme.spacing.md }]}>
          Conditions
        </Text>
        {showPrecipitation && (
          <Text style={[headerTextStyle, { minWidth: isTablet ? 40 : 30, textAlign: 'center' }]}>
            Rain
          </Text>
        )}
        <Text style={[headerTextStyle, { minWidth: isTablet ? 100 : 80, textAlign: 'right' }]}>
          High/Low
        </Text>
      </View>
      
      <FlatList
        data={dailyData}
        renderItem={renderDailyItem}
        keyExtractor={(_, index) => `day-${index}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};