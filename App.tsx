import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { LocationProvider } from './src/context/LocationContext';
import { ErrorProvider } from './src/context/ErrorContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { OfflineIndicator } from './src/components/OfflineIndicator';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // In production, this would send to crash analytics
        console.error('App crashed:', error, errorInfo);
      }}
    >
      <SafeAreaProvider>
        <ErrorProvider>
          <NetworkProvider>
            <AppProvider>
              <LocationProvider>
                <AppNavigator />
                <OfflineIndicator />
              </LocationProvider>
            </AppProvider>
          </NetworkProvider>
        </ErrorProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
