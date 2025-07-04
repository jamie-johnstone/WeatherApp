import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNetwork } from '@/context/NetworkContext';

interface OfflineIndicatorProps {
  style?: any;
  showWhenOnline?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  style,
  showWhenOnline = false,
  autoHide = true,
  autoHideDelay = 3000,
}) => {
  const { isOnline, networkState, retryConnection } = useNetwork();
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (showWhenOnline && visible) {
      // Show briefly when coming back online
      if (autoHide) {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setVisible(false));
        }, autoHideDelay);
      }
    } else if (!showWhenOnline) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [isOnline, showWhenOnline, visible, autoHide, autoHideDelay, fadeAnim]);

  const handleRetry = async () => {
    const success = await retryConnection();
    if (success && autoHide) {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 1000);
    }
  };

  const getStatusMessage = () => {
    if (isOnline) {
      return '✅ Connected';
    }
    
    if (networkState.connectionQuality === 'poor') {
      return '⚠️ Poor connection';
    }
    
    return '❌ No internet connection';
  };

  const getStatusColor = () => {
    if (isOnline) {
      return '#4CAF50'; // Green
    }
    
    if (networkState.connectionQuality === 'poor') {
      return '#FF9800'; // Orange
    }
    
    return '#F44336'; // Red
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getStatusColor(), opacity: fadeAnim },
        style,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.message}>{getStatusMessage()}</Text>
        {!isOnline && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            accessibilityLabel="Retry connection"
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 44, // Account for status bar
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OfflineIndicator;