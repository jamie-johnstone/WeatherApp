import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: 'granted',
    canAskAgain: true,
  }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 52.52,
      longitude: 13.405,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  }),
  getForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: 'granted',
    canAskAgain: true,
  }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([{
    name: 'Berlin',
    city: 'Berlin',
    country: 'Germany',
    region: 'Berlin',
  }]),
  geocodeAsync: jest.fn().mockResolvedValue([{
    latitude: 52.52,
    longitude: 13.405,
    accuracy: 10,
  }]),
  watchPositionAsync: jest.fn().mockResolvedValue({
    remove: jest.fn(),
  }),
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
  LocationAccuracy: {
    Low: 1,
    Balanced: 2,
    High: 3,
    Highest: 4,
  },
  Accuracy: {
    Low: 1,
    Balanced: 2,
    High: 3,
    Highest: 4,
  },
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: ({ children }: { children?: React.ReactNode }) => children || null,
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
}));

// Mock ErrorContext
jest.mock('@/context/ErrorContext', () => ({
  ErrorProvider: ({ children }: { children: React.ReactNode }) => children,
  useError: () => ({
    state: { errors: [], isShowingError: false, lastError: null },
    addError: jest.fn(),
    resolveError: jest.fn(),
    clearErrors: jest.fn(),
    showErrorAlert: jest.fn(),
    handleNetworkError: jest.fn(),
    handleLocationError: jest.fn(),
    handleApiError: jest.fn(),
  }),
  ErrorType: {
    NETWORK: 'NETWORK',
    PERMISSION: 'PERMISSION',
    API: 'API',
    LOCATION: 'LOCATION',
    STORAGE: 'STORAGE',
    VALIDATION: 'VALIDATION',
    UNKNOWN: 'UNKNOWN',
  },
  ErrorSeverity: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  },
}));

// Mock NetworkContext
jest.mock('@/context/NetworkContext', () => ({
  NetworkProvider: ({ children }: { children: React.ReactNode }) => children,
  useNetwork: () => ({
    networkState: {
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      isWifi: true,
      isCellular: false,
      connectionQuality: 'excellent',
    },
    isOnline: true,
    showOfflineAlert: jest.fn(),
    retryConnection: jest.fn(() => Promise.resolve(true)),
  }),
  useOfflineHandler: () => ({
    isOnline: true,
    executeWithNetworkCheck: jest.fn(),
    showOfflineAlert: jest.fn(),
  }),
}));

// Mock useErrorHandler hook
jest.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: jest.fn(),
    handleNetworkError: jest.fn(),
    handleLocationError: jest.fn(),
    handleApiError: jest.fn(),
    handlePermissionError: jest.fn(),
    handleStorageError: jest.fn(),
    handleValidationError: jest.fn(),
    withErrorHandling: jest.fn((operation) => operation()),
    shouldBlockAction: jest.fn(() => false),
    isOnline: true,
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  State: {},
  PanGestureHandler: 'PanGestureHandler',
  BaseButton: 'BaseButton',
  Directions: {},
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
  CardStyleInterpolators: {
    forHorizontalIOS: {},
  },
}));

// Mock useResponsive hooks
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isTablet: false,
    screenWidth: 375,
    screenHeight: 812,
  }),
  useResponsiveGrid: () => ({
    getColumns: (_minWidth: number) => 2, // Default to 2 columns
    getItemWidth: (_columns: number, _spacing: number) => '48%', // Approximate width for 2 columns
  }),
  useResponsiveSpacing: () => ({
    itemSpacing: 8,
  }),
}));

// Mock useTheme hook
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#87CEEB',
      secondary: '#4682B4',
      white: '#FFFFFF',
      error: '#f44336',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      surfaceAlt: '#F8F9FA',
      textPrimary: '#000000',
      textSecondary: '#666666',
      textMuted: '#999999',
      border: '#E0E0E0',
    },
    typography: {
      fontSize: {
        xs: 10,
        sm: 12,
        base: 14,
        lg: 16,
      },
      fontWeight: {
        medium: '600',
        semibold: '700',
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      base: 12,
      md: 16,
      lg: 24,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
    components: {
      button: {
        height: {
          small: 32,
          medium: 40,
          large: 48,
        },
        paddingHorizontal: {
          small: 12,
          medium: 16,
          large: 20,
        },
        borderRadius: {
          small: 4,
          medium: 6,
          large: 8,
        },
      },
      card: {
        padding: 16,
        margin: 8,
        borderRadius: 12,
      },
    },
    shadows: {
      base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    },
  }),
  useColors: () => ({
    primary: '#87CEEB',
    secondary: '#4682B4',
    white: '#FFFFFF',
    error: '#f44336',
  }),
}));

// Silence the warning about act() in tests
global.console = {
  ...console,
  warn: jest.fn(),
};