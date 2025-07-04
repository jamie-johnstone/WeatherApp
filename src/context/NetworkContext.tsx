import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
  isWifi: boolean;
  isCellular: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
}

interface NetworkContextType {
  networkState: NetworkState;
  isOnline: boolean;
  showOfflineAlert: () => void;
  retryConnection: () => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
    isWifi: false,
    isCellular: false,
    connectionQuality: 'unknown',
  });

  const [hasShownOfflineAlert, setHasShownOfflineAlert] = useState(false);

  useEffect(() => {
    // Check network connectivity periodically
    const checkConnectivity = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m', {
          method: 'HEAD',
        });
        
        const isConnected = response.ok;
        
        setNetworkState(prev => ({
          ...prev,
          isConnected,
          isInternetReachable: isConnected,
          type: 'unknown',
          isWifi: false,
          isCellular: false,
          connectionQuality: isConnected ? 'good' : 'poor',
        }));

        // Show offline alert when going offline
        if (!isConnected && !hasShownOfflineAlert) {
          showOfflineAlert();
          setHasShownOfflineAlert(true);
        }

        // Reset alert flag when coming back online
        if (isConnected) {
          setHasShownOfflineAlert(false);
        }
      } catch (error) {
        setNetworkState(prev => ({
          ...prev,
          isConnected: false,
          isInternetReachable: false,
          connectionQuality: 'poor',
        }));

        if (!hasShownOfflineAlert) {
          showOfflineAlert();
          setHasShownOfflineAlert(true);
        }
      }
    };

    // Initial check
    checkConnectivity();

    // Check every 30 seconds
    const interval = setInterval(checkConnectivity, 30000);

    return () => clearInterval(interval);
  }, [hasShownOfflineAlert]);

  // const getConnectionQuality = (state: any): 'excellent' | 'good' | 'poor' | 'unknown' => {
  //   if (!state.isConnected || !state.isInternetReachable) {
  //     return 'poor';
  //   }

  //   // For cellular connections, use effective connection type if available
  //   if (state.type === 'cellular' && state.details?.cellularGeneration) {
  //     const generation = state.details.cellularGeneration;
  //     if (generation === '4g' || generation === '5g') {
  //       return 'excellent';
  //     } else if (generation === '3g') {
  //       return 'good';
  //     } else {
  //       return 'poor';
  //     }
  //   }

  //   // For WiFi, assume good quality (could be enhanced with speed tests)
  //   if (state.type === 'wifi') {
  //     return 'excellent';
  //   }

  //   return 'unknown';
  // };

  const isOnline = networkState.isConnected === true && networkState.isInternetReachable === true;

  const showOfflineAlert = () => {
    Alert.alert(
      'No Internet Connection',
      'Please check your internet connection and try again. Some features may not work properly while offline.',
      [
        { text: 'OK', style: 'default' },
        { 
          text: 'Retry', 
          onPress: () => retryConnection(),
          style: 'default'
        },
      ],
      { cancelable: true }
    );
  };

  const retryConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m', {
        method: 'HEAD',
      });
      
      const isConnected = response.ok;
      
      if (isConnected) {
        Alert.alert(
          'Connection Restored',
          'Your internet connection has been restored.',
          [{ text: 'OK', style: 'default' }]
        );
        setHasShownOfflineAlert(false);
      } else {
        Alert.alert(
          'Still Offline',
          'Unable to connect to the internet. Please check your network settings.',
          [{ text: 'OK', style: 'default' }]
        );
      }
      
      return isConnected;
    } catch (error) {
      console.error('Error checking network status:', error);
      Alert.alert(
        'Still Offline',
        'Unable to connect to the internet. Please check your network settings.',
        [{ text: 'OK', style: 'default' }]
      );
      return false;
    }
  };

  const contextValue: NetworkContextType = {
    networkState,
    isOnline,
    showOfflineAlert,
    retryConnection,
  };

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

// Hook for components that need to handle offline scenarios
export const useOfflineHandler = () => {
  const { isOnline, showOfflineAlert } = useNetwork();

  const executeWithNetworkCheck = async <T,>(
    operation: () => Promise<T>,
    fallback?: () => T | Promise<T>
  ): Promise<T | null> => {
    if (!isOnline) {
      showOfflineAlert();
      if (fallback) {
        return await fallback();
      }
      return null;
    }

    try {
      return await operation();
    } catch (error) {
      // If operation fails and we're offline, show offline alert
      if (!isOnline) {
        showOfflineAlert();
      }
      throw error;
    }
  };

  return {
    isOnline,
    executeWithNetworkCheck,
    showOfflineAlert,
  };
};