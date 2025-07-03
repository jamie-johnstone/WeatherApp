import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: number;
  margin?: number;
  borderRadius?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = true,
  padding,
  margin,
  borderRadius,
}) => {
  const theme = useTheme();
  
  const cardStyle = {
    backgroundColor: theme.colors.surface,
    padding: padding ?? theme.components.card.padding,
    margin: margin ?? theme.components.card.margin,
    borderRadius: borderRadius ?? theme.components.card.borderRadius,
    ...(elevated ? theme.shadows.base : {}),
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};