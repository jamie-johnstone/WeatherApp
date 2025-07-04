import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface WeatherIconProps {
  icon: string;
  size?: number;
  style?: any;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  icon, 
  size = 60, 
  style 
}) => {
  return (
    <Text 
      style={[styles.icon, { fontSize: size }, style]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Weather icon: ${icon}`}
    >
      {icon}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});