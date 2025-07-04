import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive, useResponsiveGrid, useResponsiveSpacing } from '@/hooks/useResponsive';

interface WeatherDetail {
  label: string;
  value: string;
  icon?: string;
}

interface WeatherDetailsGridProps {
  details: WeatherDetail[];
  columns?: number;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  details,
  columns,
}) => {
  const theme = useTheme();
  const { isTablet } = useResponsive();
  const { getColumns, getItemWidth } = useResponsiveGrid();
  const { itemSpacing } = useResponsiveSpacing();
  
  // Calculate responsive columns and item width
  const gridColumns = columns || getColumns(120); // Min width 120px for weather details
  const itemWidth = getItemWidth(gridColumns, itemSpacing);
  
  const gridStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
    width: '100%' as const,
  };
  
  const itemStyle = {
    backgroundColor: theme.colors.surfaceAlt,
    padding: isTablet ? theme.spacing.lg : theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center' as const,
    minHeight: isTablet ? 100 : 80,
    justifyContent: 'center' as const,
    width: itemWidth,
  };
  
  const iconStyle = {
    fontSize: isTablet ? 24 : 20,
    marginBottom: theme.spacing.xs,
  };
  
  const labelStyle = {
    fontSize: isTablet ? theme.typography.fontSize.sm : theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase' as const,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center' as const,
  };
  
  const valueStyle = {
    fontSize: isTablet ? theme.typography.fontSize.lg : theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center' as const,
  };

  return (
    <View style={gridStyle}>
      {details.map((detail, index) => (
        <View key={index} style={itemStyle}>
          {detail.icon && <Text style={iconStyle}>{detail.icon}</Text>}
          <Text style={labelStyle}>{detail.label}</Text>
          <Text style={valueStyle}>{detail.value}</Text>
        </View>
      ))}
    </View>
  );
};