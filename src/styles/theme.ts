// Color palette
export const colors = {
  // Primary colors
  primary: '#87CEEB',
  primaryDark: '#5F9EA0',
  primaryLight: '#B0E0E6',
  
  // Secondary colors  
  secondary: '#4CAF50',
  secondaryDark: '#388E3C',
  secondaryLight: '#81C784',
  
  // Accent colors
  accent: '#FF9800',
  accentDark: '#F57C00',
  accentLight: '#FFB74D',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#f44336',
  info: '#2196F3',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray scale
  gray50: '#f8f9fa',
  gray100: '#f5f5f5',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#888888',
  textLight: '#999999',
  
  // Background colors
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#f8f9fa',
  
  // Border colors
  border: '#e9ecef',
  borderLight: '#f0f0f0',
  borderDark: '#ced4da',
  
  // Weather-specific colors
  weatherClearDay: '#87CEEB',
  weatherClearNight: '#191970',
  weatherCloudy: '#708090',
  weatherRain: '#4682B4',
  weatherSnow: '#F0F8FF',
  weatherThunderstorm: '#2F4F4F',
  weatherFog: '#D3D3D3',
  
  // Temperature colors
  tempVeryCold: '#0066CC',
  tempCold: '#0099CC',
  tempCool: '#00CCCC',
  tempMild: '#00CC66',
  tempWarm: '#FFCC00',
  tempHot: '#FF6600',
  tempVeryHot: '#CC0000',
} as const;

// Typography scale
export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Shadow styles
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
} as const;

// Component-specific themes
export const components = {
  button: {
    height: {
      small: 32,
      medium: 44,
      large: 56,
    },
    paddingHorizontal: {
      small: spacing.base,
      medium: spacing.lg,
      large: spacing.xl,
    },
    borderRadius: {
      small: borderRadius.md,
      medium: borderRadius.xl,
      large: borderRadius['2xl'],
    },
  },
  card: {
    padding: spacing.lg,
    margin: spacing.base,
    borderRadius: borderRadius.md,
    shadow: shadows.base,
  },
  input: {
    height: 44,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.base,
    borderWidth: 1,
  },
} as const;

// Main theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;