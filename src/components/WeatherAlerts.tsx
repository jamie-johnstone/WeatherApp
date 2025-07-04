import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { WeatherAlert, AlertSeverity, AlertType } from './WeatherAlert';

interface WeatherAlertData {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  expiresAt?: Date;
}

interface WeatherAlertsProps {
  alerts: WeatherAlertData[];
  onAlertPress?: (alert: WeatherAlertData) => void;
  onAlertDismiss?: (alertId: string) => void;
  maxItems?: number;
  compact?: boolean;
  showTitle?: boolean;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({
  alerts,
  onAlertPress,
  onAlertDismiss,
  maxItems,
  compact = false,
  showTitle = true,
}) => {
  const theme = useTheme();
  const { isTablet } = useResponsive();

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const displayAlerts = maxItems ? alerts.slice(0, maxItems) : alerts;

  const containerStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: compact ? theme.spacing.md : theme.spacing.lg,
  };

  const titleStyle = {
    fontSize: isTablet ? theme.typography.fontSize.lg : theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  };

  const emptyStyle = {
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.xl,
  };

  const emptyTextStyle = {
    fontSize: isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center' as const,
  };

  const renderAlert = ({ item }: { item: WeatherAlertData }) => (
    <WeatherAlert
      alert={item}
      onPress={onAlertPress}
      onDismiss={onAlertDismiss}
      compact={compact}
    />
  );

  return (
    <View style={containerStyle}>
      {showTitle && (
        <Text style={titleStyle}>
          Weather Alerts {alerts.length > 0 && `(${alerts.length})`}
        </Text>
      )}
      
      <FlatList
        data={displayAlerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={emptyStyle}>
            <Text style={emptyTextStyle}>
              No active weather alerts
            </Text>
          </View>
        }
      />
    </View>
  );
};