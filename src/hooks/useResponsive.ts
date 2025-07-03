import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ScreenData {
  window: ScaledSize;
  screen: ScaledSize;
}

interface ResponsiveData {
  width: number;
  height: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  scale: number;
  fontScale: number;
}

// Breakpoints
const BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
  xlarge: 1366,
} as const;

export const useResponsive = (): ResponsiveData => {
  const [screenData, setScreenData] = useState<ScreenData>(() => ({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  }));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setScreenData({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

  const { window } = screenData;
  const { width, height, scale, fontScale } = window;
  
  // Calculate responsive properties
  const isLandscape = width > height;
  const isPortrait = height > width;
  const isSmallScreen = width < BREAKPOINTS.medium;
  const isMediumScreen = width >= BREAKPOINTS.medium && width < BREAKPOINTS.large;
  const isLargeScreen = width >= BREAKPOINTS.large;
  const isTablet = width >= BREAKPOINTS.medium;

  return {
    width,
    height,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,
    isLandscape,
    isPortrait,
    scale,
    fontScale,
  };
};

// Helper functions for responsive values
export const useResponsiveValue = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  default: T;
}): T => {
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useResponsive();
  
  if (isLargeScreen && values.large !== undefined) {
    return values.large;
  }
  
  if (isMediumScreen && values.medium !== undefined) {
    return values.medium;
  }
  
  if (isSmallScreen && values.small !== undefined) {
    return values.small;
  }
  
  return values.default;
};

// Hook for responsive spacing
export const useResponsiveSpacing = () => {
  const { isTablet } = useResponsive();
  
  return {
    containerPadding: isTablet ? 32 : 16,
    cardMargin: isTablet ? 20 : 15,
    sectionSpacing: isTablet ? 24 : 16,
    itemSpacing: isTablet ? 16 : 12,
  };
};

// Hook for responsive typography
export const useResponsiveFontSize = () => {
  const { isTablet, fontScale } = useResponsive();
  
  const baseSizes = {
    xs: isTablet ? 14 : 12,
    sm: isTablet ? 16 : 14,
    base: isTablet ? 18 : 16,
    lg: isTablet ? 20 : 18,
    xl: isTablet ? 24 : 20,
    '2xl': isTablet ? 28 : 24,
    '3xl': isTablet ? 36 : 30,
    '4xl': isTablet ? 42 : 36,
    '5xl': isTablet ? 56 : 48,
  };
  
  // Apply font scale for accessibility
  return Object.fromEntries(
    Object.entries(baseSizes).map(([key, value]) => [
      key,
      Math.round(value * fontScale),
    ])
  );
};

// Hook for responsive grid
export const useResponsiveGrid = () => {
  const { width, isTablet } = useResponsive();
  
  const getColumns = (minItemWidth: number = 150): number => {
    const availableWidth = width - (isTablet ? 64 : 32); // Account for padding
    const columns = Math.floor(availableWidth / minItemWidth);
    return Math.max(1, Math.min(columns, isTablet ? 4 : 2));
  };
  
  const getItemWidth = (columns: number, spacing: number = 10): number => {
    const containerPadding = isTablet ? 64 : 32;
    const totalSpacing = (columns - 1) * spacing;
    return (width - containerPadding - totalSpacing) / columns;
  };
  
  return {
    getColumns,
    getItemWidth,
    defaultColumns: isTablet ? 3 : 2,
    maxColumns: isTablet ? 4 : 2,
  };
};