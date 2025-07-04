import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorType, ErrorSeverity, AppError } from '@/context/ErrorContext';

interface ErrorReport {
  id: string;
  timestamp: string;
  error: AppError;
  deviceInfo: {
    platform: 'ios' | 'android' | 'web';
    version: string;
    model?: string;
  };
  appInfo: {
    version: string;
    buildNumber: string;
  };
  userAgent: string;
  breadcrumbs: Breadcrumb[];
}

interface Breadcrumb {
  timestamp: string;
  category: 'navigation' | 'user_action' | 'network' | 'state_change';
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 50;
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  /**
   * Add a breadcrumb for error context
   */
  addBreadcrumb(breadcrumb: Omit<Breadcrumb, 'timestamp'>) {
    const timestampedBreadcrumb: Breadcrumb = {
      ...breadcrumb,
      timestamp: new Date().toISOString(),
    };

    this.breadcrumbs.push(timestampedBreadcrumb);

    // Keep only the most recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }

    // Store in AsyncStorage for persistence
    this.saveBreadcrumbs();
  }

  /**
   * Report an error with full context
   */
  async reportError(error: AppError): Promise<void> {
    try {
      const errorReport: ErrorReport = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        error,
        deviceInfo: await this.getDeviceInfo(),
        appInfo: await this.getAppInfo(),
        userAgent: this.getUserAgent(),
        breadcrumbs: [...this.breadcrumbs],
      };

      // Add to queue for processing
      this.errorQueue.push(errorReport);

      // Store locally for offline scenarios
      await this.storeErrorLocally(errorReport);

      // Attempt to send if online
      await this.processErrorQueue();

      console.log('Error reported:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  /**
   * Get device information
   */
  private async getDeviceInfo() {
    // In a real implementation, you'd use expo-device or react-native-device-info
    return {
      platform: 'web' as const, // Default for now
      version: '1.0.0',
      model: 'Unknown',
    };
  }

  /**
   * Get app information
   */
  private async getAppInfo() {
    return {
      version: '1.0.0',
      buildNumber: '1',
    };
  }

  /**
   * Get user agent string
   */
  private getUserAgent(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return 'React Native App';
  }

  /**
   * Store error locally for offline scenarios
   */
  private async storeErrorLocally(errorReport: ErrorReport): Promise<void> {
    try {
      const existingErrors = await this.getStoredErrors();
      const updatedErrors = [...existingErrors, errorReport];

      // Keep only the most recent 100 errors
      const recentErrors = updatedErrors.slice(-100);

      await AsyncStorage.setItem(
        'error_reports',
        JSON.stringify(recentErrors)
      );
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  /**
   * Get stored errors from local storage
   */
  private async getStoredErrors(): Promise<ErrorReport[]> {
    try {
      const stored = await AsyncStorage.getItem('error_reports');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored errors:', error);
      return [];
    }
  }

  /**
   * Process the error queue (send to remote service)
   */
  private async processErrorQueue(): Promise<void> {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;

    try {
      // In production, send to your error reporting service
      // For now, just log the errors
      while (this.errorQueue.length > 0) {
        const errorReport = this.errorQueue.shift();
        if (errorReport) {
          await this.sendErrorReport(errorReport);
        }
      }
    } catch (error) {
      console.error('Failed to process error queue:', error);
    } finally {
      this.isReporting = false;
    }
  }

  /**
   * Send error report to remote service
   */
  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      // In production, this would send to your analytics/crash reporting service
      // Examples: Sentry, Bugsnag, Firebase Crashlytics, etc.
      
      console.log('Sending error report:', {
        id: errorReport.id,
        error: errorReport.error.message,
        type: errorReport.error.type,
        severity: errorReport.error.severity,
        timestamp: errorReport.timestamp,
      });

      // Simulate API call
      // await fetch('https://your-error-reporting-endpoint.com/errors', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(errorReport),
      // });

    } catch (error) {
      console.error('Failed to send error report:', error);
      // Put back in queue for retry
      this.errorQueue.unshift(errorReport);
    }
  }

  /**
   * Save breadcrumbs to local storage
   */
  private async saveBreadcrumbs(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        'error_breadcrumbs',
        JSON.stringify(this.breadcrumbs)
      );
    } catch (error) {
      console.error('Failed to save breadcrumbs:', error);
    }
  }

  /**
   * Load breadcrumbs from local storage
   */
  async loadBreadcrumbs(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('error_breadcrumbs');
      if (stored) {
        this.breadcrumbs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load breadcrumbs:', error);
    }
  }

  /**
   * Clear all stored error data
   */
  async clearStoredData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['error_reports', 'error_breadcrumbs']);
      this.breadcrumbs = [];
      this.errorQueue = [];
    } catch (error) {
      console.error('Failed to clear stored error data:', error);
    }
  }

  /**
   * Get error statistics
   */
  async getErrorStats(): Promise<{
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    recentErrors: ErrorReport[];
  }> {
    try {
      const storedErrors = await this.getStoredErrors();
      
      const errorsByType = {} as Record<ErrorType, number>;
      const errorsBySeverity = {} as Record<ErrorSeverity, number>;

      storedErrors.forEach(report => {
        const { type, severity } = report.error;
        errorsByType[type] = (errorsByType[type] || 0) + 1;
        errorsBySeverity[severity] = (errorsBySeverity[severity] || 0) + 1;
      });

      return {
        totalErrors: storedErrors.length,
        errorsByType,
        errorsBySeverity,
        recentErrors: storedErrors.slice(-10), // Last 10 errors
      };
    } catch (error) {
      console.error('Failed to get error stats:', error);
      return {
        totalErrors: 0,
        errorsByType: {} as Record<ErrorType, number>,
        errorsBySeverity: {} as Record<ErrorSeverity, number>,
        recentErrors: [],
      };
    }
  }
}

export default ErrorReportingService;