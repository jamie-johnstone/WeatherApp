import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme, colors, Theme } from '@/styles/theme';

// Dark theme colors (if we want to support dark mode in the future)
const darkColors = {
  ...colors,
  // Override colors for dark mode
  background: '#121212',
  surface: '#1e1e1e',
  surfaceAlt: '#2a2a2a',
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',
  textMuted: '#808080',
  border: '#404040',
  borderLight: '#303030',
  borderDark: '#505050',
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  
  const currentTheme = useMemo(() => {
    // For now, always use light theme
    // In the future, we can check colorScheme and return dark theme
    return {
      ...theme,
      colors: colors, // or darkColors when colorScheme === 'dark'
    };
  }, [colorScheme]);
  
  return currentTheme;
};

export const useColors = () => {
  const theme = useTheme();
  return theme.colors;
};

export const useTypography = () => {
  const theme = useTheme();
  return theme.typography;
};

export const useSpacing = () => {
  const theme = useTheme();
  return theme.spacing;
};