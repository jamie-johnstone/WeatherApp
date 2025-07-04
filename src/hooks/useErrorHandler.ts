import { useCallback } from 'react';
import { useError, ErrorType, ErrorSeverity } from '@/context/ErrorContext';
import { useNetwork } from '@/context/NetworkContext';

interface UseErrorHandlerOptions {
  defaultErrorMessage?: string;
  showAlerts?: boolean;
  logErrors?: boolean;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const {
    // defaultErrorMessage = 'An unexpected error occurred',
    showAlerts = true,
    logErrors = true,
  } = options;

  const { addError, showErrorAlert } = useError();
  const { isOnline } = useNetwork();

  const handleError = useCallback(
    (
      error: Error | string,
      context?: {
        type?: ErrorType;
        severity?: ErrorSeverity;
        source?: string;
        retryAction?: () => void;
        showAlert?: boolean;
      }
    ) => {
      const errorMessage = typeof error === 'string' ? error : error.message;
      const errorType = context?.type || ErrorType.UNKNOWN;
      const severity = context?.severity || ErrorSeverity.MEDIUM;

      // Log error if enabled
      if (logErrors) {
        console.error(`[${errorType}] ${errorMessage}`, {
          error: typeof error === 'object' ? error : new Error(errorMessage),
          context,
          isOnline,
        });
      }

      // Add to error state
      addError({
        type: errorType,
        severity,
        message: errorMessage,
        source: context?.source,
        retryable: !!context?.retryAction,
      });

      // Show alert if requested
      if (showAlerts && (context?.showAlert !== false)) {
        showErrorAlert({
          type: errorType,
          severity,
          message: errorMessage,
          retryable: !!context?.retryAction,
        });
      }
    },
    [addError, showErrorAlert, showAlerts, logErrors, isOnline]
  );

  const handleNetworkError = useCallback(
    (error: Error | string, retryAction?: () => void) => {
      handleError(error, {
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        retryAction,
        source: 'Network',
      });
    },
    [handleError]
  );

  const handleLocationError = useCallback(
    (error: Error | string, retryAction?: () => void) => {
      handleError(error, {
        type: ErrorType.LOCATION,
        severity: ErrorSeverity.MEDIUM,
        retryAction,
        source: 'Location Service',
      });
    },
    [handleError]
  );

  const handleApiError = useCallback(
    (error: Error | string, _details?: string) => {
      handleError(error, {
        type: ErrorType.API,
        severity: ErrorSeverity.MEDIUM,
        source: 'API',
      });
    },
    [handleError]
  );

  const handlePermissionError = useCallback(
    (error: Error | string, retryAction?: () => void) => {
      handleError(error, {
        type: ErrorType.PERMISSION,
        severity: ErrorSeverity.HIGH,
        retryAction,
        source: 'Permissions',
      });
    },
    [handleError]
  );

  const handleStorageError = useCallback(
    (error: Error | string) => {
      handleError(error, {
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.LOW,
        source: 'Storage',
      });
    },
    [handleError]
  );

  const handleValidationError = useCallback(
    (error: Error | string) => {
      handleError(error, {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.LOW,
        source: 'Validation',
        showAlert: false, // Usually handled by form UI
      });
    },
    [handleError]
  );

  // Wrapper for async operations with error handling
  const withErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      errorContext?: {
        type?: ErrorType;
        severity?: ErrorSeverity;
        source?: string;
        fallback?: T;
        retryAction?: () => void;
      }
    ): Promise<T | undefined> => {
      try {
        return await operation();
      } catch (error) {
        handleError(error as Error, errorContext);
        return errorContext?.fallback;
      }
    },
    [handleError]
  );

  // Check if we're in an error state that should prevent certain actions
  const shouldBlockAction = useCallback(
    (requiredConnectionType?: 'online' | 'any') => {
      if (requiredConnectionType === 'online' && !isOnline) {
        handleNetworkError('No internet connection available');
        return true;
      }
      return false;
    },
    [isOnline, handleNetworkError]
  );

  return {
    handleError,
    handleNetworkError,
    handleLocationError,
    handleApiError,
    handlePermissionError,
    handleStorageError,
    handleValidationError,
    withErrorHandling,
    shouldBlockAction,
    isOnline,
  };
};