import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import ErrorReportingService from '@/services/ErrorReportingService';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  PERMISSION = 'PERMISSION',
  API = 'API',
  LOCATION = 'LOCATION',
  STORAGE = 'STORAGE',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: string;
  timestamp: Date;
  source?: string;
  retryable: boolean;
  resolved: boolean;
}

interface ErrorState {
  errors: AppError[];
  isShowingError: boolean;
  lastError: AppError | null;
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: Omit<AppError, 'id' | 'timestamp' | 'resolved'> }
  | { type: 'RESOLVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SHOWING_ERROR'; payload: boolean };

const initialState: ErrorState = {
  errors: [],
  isShowingError: false,
  lastError: null,
};

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'ADD_ERROR': {
      const newError: AppError = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        resolved: false,
      };

      return {
        ...state,
        errors: [...state.errors, newError],
        lastError: newError,
      };
    }

    case 'RESOLVE_ERROR':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload ? { ...error, resolved: true } : error
        ),
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
        lastError: null,
      };

    case 'SET_SHOWING_ERROR':
      return {
        ...state,
        isShowingError: action.payload,
      };

    default:
      return state;
  }
};

interface ErrorContextType {
  state: ErrorState;
  addError: (error: Omit<AppError, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveError: (errorId: string) => void;
  clearErrors: () => void;
  showErrorAlert: (error: Partial<AppError> & { message: string }) => void;
  handleNetworkError: (message: string, retryAction?: () => void) => void;
  handleLocationError: (message: string, retryAction?: () => void) => void;
  handleApiError: (message: string, details?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);
  const errorReporting = ErrorReportingService.getInstance();

  useEffect(() => {
    // Load breadcrumbs on app start
    errorReporting.loadBreadcrumbs();
  }, []);

  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp' | 'resolved'>) => {
    console.error(`[${error.type}] ${error.message}`, error.details);
    
    const newError: AppError = {
      ...error,
      id: Date.now().toString(),
      timestamp: new Date(),
      resolved: false,
    };
    
    dispatch({ type: 'ADD_ERROR', payload: error });
    
    // Report to error reporting service
    errorReporting.reportError(newError);
    
    // Add breadcrumb
    errorReporting.addBreadcrumb({
      category: 'state_change',
      message: `Error added: ${error.type}`,
      level: error.severity === ErrorSeverity.CRITICAL ? 'error' : 'warning',
      data: {
        type: error.type,
        message: error.message,
        source: error.source,
      },
    });
  }, [errorReporting]);

  const resolveError = useCallback((errorId: string) => {
    dispatch({ type: 'RESOLVE_ERROR', payload: errorId });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const showErrorAlert = useCallback((error: Partial<AppError> & { message: string }) => {
    const errorType = error.type || ErrorType.UNKNOWN;
    const severity = error.severity || ErrorSeverity.MEDIUM;
    
    // Add to error state
    addError({
      type: errorType,
      severity,
      message: error.message,
      details: error.details,
      source: error.source,
      retryable: error.retryable || false,
    });

    // Show alert for high severity errors
    if (severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL) {
      Alert.alert(
        'Error',
        error.message,
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    }
  }, [addError]);

  const handleNetworkError = useCallback((message: string, retryAction?: () => void) => {
    const buttons = [{ text: 'OK', style: 'default' as const }];
    
    if (retryAction) {
      buttons.unshift({
        text: 'Retry',
        style: 'default' as const,
      });
    }

    addError({
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message,
      retryable: !!retryAction,
    });

    Alert.alert(
      'Network Error',
      message,
      buttons,
      { cancelable: true }
    );
  }, [addError]);

  const handleLocationError = useCallback((message: string, retryAction?: () => void) => {
    const buttons = [{ text: 'OK', style: 'default' as const }];
    
    if (retryAction) {
      buttons.unshift({
        text: 'Try Again',
        style: 'default' as const,
      });
    }

    addError({
      type: ErrorType.LOCATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      retryable: !!retryAction,
    });

    Alert.alert(
      'Location Error',
      message,
      buttons,
      { cancelable: true }
    );
  }, [addError]);

  const handleApiError = useCallback((message: string, details?: string) => {
    addError({
      type: ErrorType.API,
      severity: ErrorSeverity.MEDIUM,
      message,
      details,
      retryable: true,
    });

    Alert.alert(
      'Service Error',
      message,
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  }, [addError]);

  const contextValue: ErrorContextType = {
    state,
    addError,
    resolveError,
    clearErrors,
    showErrorAlert,
    handleNetworkError,
    handleLocationError,
    handleApiError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Utility functions for common error scenarios
export const createNetworkError = (message: string = 'Network connection failed'): Omit<AppError, 'id' | 'timestamp' | 'resolved'> => ({
  type: ErrorType.NETWORK,
  severity: ErrorSeverity.MEDIUM,
  message,
  retryable: true,
});

export const createLocationError = (message: string = 'Location access failed'): Omit<AppError, 'id' | 'timestamp' | 'resolved'> => ({
  type: ErrorType.LOCATION,
  severity: ErrorSeverity.MEDIUM,
  message,
  retryable: true,
});

export const createApiError = (message: string = 'API request failed', details?: string): Omit<AppError, 'id' | 'timestamp' | 'resolved'> => ({
  type: ErrorType.API,
  severity: ErrorSeverity.MEDIUM,
  message,
  details,
  retryable: true,
});