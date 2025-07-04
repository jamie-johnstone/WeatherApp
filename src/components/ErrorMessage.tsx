import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
  style?: any;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  retryText = 'Try Again',
  showRetry = true,
  style,
}) => {
  return (
    <View 
      style={[styles.container, style]} 
      accessible={true} 
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {showRetry && onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="outline"
          size="small"
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 10,
  },
});