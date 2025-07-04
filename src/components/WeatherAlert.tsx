import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';

export type AlertSeverity = 'info' | 'warning' | 'severe' | 'extreme';
export type AlertType = 'temperature' | 'precipitation' | 'wind' | 'general';

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

interface WeatherAlertProps {
  alert: WeatherAlertData;
  onPress?: (alert: WeatherAlertData) => void;
  onDismiss?: (alertId: string) => void;
  compact?: boolean;
}

export const WeatherAlert: React.FC<WeatherAlertProps> = ({
  alert,
  onPress,
  onDismiss,
  compact = false,
}) => {
  const theme = useTheme();
  const { isTablet } = useResponsive();

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case 'info':
        return {
          backgroundColor: theme.colors.info + '15',
          borderColor: theme.colors.info,
          iconColor: theme.colors.info,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning + '15',
          borderColor: theme.colors.warning,
          iconColor: theme.colors.warning,
        };
      case 'severe':
        return {
          backgroundColor: theme.colors.error + '15',
          borderColor: theme.colors.error,
          iconColor: theme.colors.error,
        };
      case 'extreme':
        return {
          backgroundColor: '#8B0000' + '15',
          borderColor: '#8B0000',
          iconColor: '#8B0000',
        };
      default:
        return {
          backgroundColor: theme.colors.info + '15',
          borderColor: theme.colors.info,
          iconColor: theme.colors.info,
        };
    }
  };

  const severityStyles = getSeverityStyles(alert.severity);

  const containerStyle = {
    backgroundColor: severityStyles.backgroundColor,
    borderLeftWidth: 4,
    borderLeftColor: severityStyles.borderColor,
    borderRadius: theme.borderRadius.md,
    padding: compact ? theme.spacing.md : theme.spacing.lg,
    marginBottom: theme.spacing.md,
  };

  const headerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: compact ? theme.spacing.xs : theme.spacing.sm,
  };

  const iconStyle = {
    fontSize: isTablet ? 24 : 20,
    color: severityStyles.iconColor,
    marginRight: theme.spacing.sm,
  };

  const titleStyle = {
    flex: 1,
    fontSize: compact 
      ? (isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm)
      : (isTablet ? theme.typography.fontSize.lg : theme.typography.fontSize.base),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  };

  const messageStyle = {
    fontSize: compact 
      ? (isTablet ? theme.typography.fontSize.sm : theme.typography.fontSize.xs)
      : (isTablet ? theme.typography.fontSize.base : theme.typography.fontSize.sm),
    color: theme.colors.textSecondary,
    lineHeight: compact ? 1.4 : 1.5,
    marginBottom: compact ? 0 : theme.spacing.sm,
  };

  const timestampStyle = {
    fontSize: isTablet ? theme.typography.fontSize.xs : 10,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  };

  const actionsStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    marginTop: theme.spacing.sm,
  };

  const dismissButtonStyle = {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.gray200,
  };

  const dismissButtonTextStyle = {
    fontSize: isTablet ? theme.typography.fontSize.sm : theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => onPress?.(alert)}
      activeOpacity={0.8}
    >
      <View style={headerStyle}>
        <Text style={iconStyle}>{alert.icon}</Text>
        <Text style={titleStyle}>{alert.title}</Text>
      </View>
      
      <Text style={messageStyle} numberOfLines={compact ? 2 : undefined}>
        {alert.message}
      </Text>
      
      <Text style={timestampStyle}>
        {formatTimestamp(alert.timestamp)}
      </Text>
      
      {!compact && onDismiss && (
        <View style={actionsStyle}>
          <TouchableOpacity
            style={dismissButtonStyle}
            onPress={() => onDismiss(alert.id)}
          >
            <Text style={dismissButtonTextStyle}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};