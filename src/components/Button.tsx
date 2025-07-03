import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const theme = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.white,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
          color: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          color: theme.colors.white,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: theme.components.button.height.small,
          paddingHorizontal: theme.components.button.paddingHorizontal.small,
          borderRadius: theme.components.button.borderRadius.small,
          fontSize: theme.typography.fontSize.sm,
        };
      case 'medium':
        return {
          height: theme.components.button.height.medium,
          paddingHorizontal: theme.components.button.paddingHorizontal.medium,
          borderRadius: theme.components.button.borderRadius.medium,
          fontSize: theme.typography.fontSize.base,
        };
      case 'large':
        return {
          height: theme.components.button.height.large,
          paddingHorizontal: theme.components.button.paddingHorizontal.large,
          borderRadius: theme.components.button.borderRadius.large,
          fontSize: theme.typography.fontSize.lg,
        };
      default:
        return {
          height: theme.components.button.height.medium,
          paddingHorizontal: theme.components.button.paddingHorizontal.medium,
          borderRadius: theme.components.button.borderRadius.medium,
          fontSize: theme.typography.fontSize.base,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    backgroundColor: variantStyles.backgroundColor,
    borderWidth: variantStyles.borderWidth || 0,
    borderColor: variantStyles.borderColor,
    height: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: sizeStyles.borderRadius,
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    ...style,
  };

  const textStyles: TextStyle = {
    color: variantStyles.color,
    fontSize: sizeStyles.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    ...textStyle,
  };

  const spinnerColor = variant === 'outline' || variant === 'ghost' 
    ? theme.colors.primary 
    : theme.colors.white;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={spinnerColor}
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      {icon && !loading && icon}
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

