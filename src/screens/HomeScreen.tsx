import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '@/context/AppContext';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { formatTemperature, formatRelativeTime } from '@/utils/weatherUtils';
import { HomeScreenProps } from '@/types';
import { 
  Card, 
  Button, 
  WeatherIcon, 
  LoadingSpinner, 
  ErrorMessage,
  WeatherDetailsGrid,
  HourlyForecast,
  DailyForecast,
  WeatherAlerts
} from '@/components';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive, useResponsiveSpacing } from '@/hooks/useResponsive';
import { useWeatherAlerts } from '@/hooks/useWeatherAlerts';
import { useErrorHandler } from '@/hooks/useErrorHandler';
// import { useNetwork } from '@/context/NetworkContext';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state: appState } = useAppContext();
  const theme = useTheme();
  const { isTablet } = useResponsive();
  const { containerPadding } = useResponsiveSpacing();
  const errorHandler = useErrorHandler({
    defaultErrorMessage: 'Something went wrong on the home screen',
  });
  // const { isOnline } = useNetwork();
  const {
    currentLocation,
    isLoadingLocation,
    locationError,
    permissionState,
    requestLocation,
    requestPermissions,
    clearLocationError,
  } = useLocation();

  const {
    weatherData,
    isLoadingWeather,
    weatherError,
    lastUpdated,
    isDataStale,
    fetchWeatherForLocation,
    clearWeatherError,
  } = useWeather();
  
  const {
    alerts,
    dismissAlert,
    // clearAllAlerts,
    checkWeatherConditions,
  } = useWeatherAlerts();

  // Handle refresh - get current location and weather data
  const onRefresh = async () => {
    // Check network connectivity first
    if (errorHandler.shouldBlockAction('online')) {
      return;
    }

    clearLocationError();
    clearWeatherError();

    await errorHandler.withErrorHandling(
      async () => {
        if (currentLocation) {
          // Refresh weather data for current location
          await fetchWeatherForLocation(currentLocation);
        } else if (permissionState.granted) {
          // Get location first, then weather will be fetched automatically
          await requestLocation();
        } else {
          errorHandler.handlePermissionError(
            'Location permission required to get weather data',
            () => requestPermissions()
          );
        }
      },
      {
        source: 'HomeScreen.onRefresh',
        fallback: undefined,
      }
    );
  };

  // Handle location search navigation
  const handleSearchLocation = () => {
    navigation.navigate('LocationSearch');
  };

  // Handle settings navigation
  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  // Handle manual location request
  const handleRequestLocation = async () => {
    if (!permissionState.granted) {
      await requestPermissions();
    } else {
      await requestLocation();
    }
  };

  // Track if we've tried to get location to prevent infinite loops
  const hasTriedLocation = useRef(false);
  const isFetchingWeather = useRef(false);

  // Only try to get location once when permissions are granted and we don't have a location
  useEffect(() => {
    if (
      permissionState.granted &&
      !currentLocation &&
      !isLoadingLocation &&
      !hasTriedLocation.current
    ) {
      hasTriedLocation.current = true;
      requestLocation();
    }
  }, [permissionState.granted, currentLocation, isLoadingLocation, requestLocation]);

  // Reset the flag when permission status changes to undetermined or denied
  useEffect(() => {
    if (permissionState.status !== 'granted') {
      hasTriedLocation.current = false;
    }
  }, [permissionState.status]);

  // Fetch weather data when location changes
  useEffect(() => {
    if (currentLocation &&
        !isFetchingWeather.current &&
        (!weatherData ||
         weatherData.location.latitude !== currentLocation.latitude ||
         weatherData.location.longitude !== currentLocation.longitude)) {
      console.log('Location changed, fetching weather data...');
      isFetchingWeather.current = true;
      fetchWeatherForLocation(currentLocation).finally(() => {
        isFetchingWeather.current = false;
      });
    }
  }, [currentLocation, weatherData]);

  // Check weather conditions for alerts when weather data changes
  useEffect(() => {
    if (weatherData) {
      checkWeatherConditions(weatherData);
    }
  }, [weatherData, checkWeatherConditions]);

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const scrollViewStyle = {
    flex: 1,
  };

  const headerStyle = {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    paddingTop: isTablet ? theme.spacing['2xl'] : theme.spacing['3xl'],
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  };

  const headerTitleStyle = {
    fontSize: isTablet ? theme.typography.fontSize['3xl'] : theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  };

  const sectionTitleStyle = {
    fontSize: isTablet ? theme.typography.fontSize.xl : theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  };

  return (
    <View style={containerStyle}>
      <StatusBar style="light" />

      <ScrollView
        style={scrollViewStyle}
        contentContainerStyle={{ paddingHorizontal: containerPadding }}
        refreshControl={
          <RefreshControl
            refreshing={appState.isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={headerStyle}>
          <Text style={headerTitleStyle}>Weather App</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSearchLocation}
            >
              <Text style={styles.headerButtonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSettings}
            >
              <Text style={styles.headerButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <WeatherAlerts
            alerts={alerts}
            onAlertPress={(alert) => {
              Alert.alert(
                alert.title,
                alert.message,
                [
                  { text: 'Dismiss', onPress: () => dismissAlert(alert.id) },
                  { text: 'OK', style: 'default' },
                ]
              );
            }}
            onAlertDismiss={dismissAlert}
            maxItems={3}
            compact={false}
          />
        )}

        {/* Current Location Status */}
        <Card style={styles.locationCard}>
          <Text style={sectionTitleStyle}>Current Location</Text>
          {isLoadingLocation ? (
            <LoadingSpinner message="Getting your location..." />
          ) : currentLocation ? (
            <View>
              <Text style={styles.locationText}>
                {currentLocation.name ||
                  `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
              </Text>
              {currentLocation.region && currentLocation.country && (
                <Text style={styles.locationDetails}>
                  {currentLocation.region}, {currentLocation.country}
                </Text>
              )}
              <Button
                title="📍 Update Location"
                onPress={handleRequestLocation}
                variant="ghost"
                size="small"
                style={styles.updateLocationButton}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.locationText}>
                {!permissionState.granted
                  ? 'Location permission required'
                  : locationError
                  ? 'Location unavailable'
                  : 'Location not set'
                }
              </Text>
              {locationError && (
                <ErrorMessage
                  title="Location Error"
                  message={locationError.message}
                  showRetry={false}
                  style={styles.locationError}
                />
              )}
              <View style={styles.locationActions}>
                <Button
                  title="📍 Use Current Location"
                  onPress={handleRequestLocation}
                  variant="secondary"
                  size="small"
                  style={styles.locationActionButton}
                />
                <Button
                  title="🔍 Search Location"
                  onPress={handleSearchLocation}
                  variant="primary"
                  size="small"
                  style={styles.locationActionButton}
                />
              </View>
            </View>
          )}
        </Card>

        {/* Weather Data Section */}
        <Card style={styles.weatherCardContainer}>
          <View style={styles.weatherHeader}>
            <Text style={sectionTitleStyle}>Current Weather</Text>
            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Updated {formatRelativeTime(lastUpdated)}
                {isDataStale && <Text style={styles.staleIndicator}> • Stale</Text>}
              </Text>
            )}
          </View>

          {isLoadingWeather ? (
            <LoadingSpinner message="Loading weather data..." />
          ) : weatherError ? (
            <ErrorMessage
              title="Weather Error"
              message={weatherError}
              onRetry={() => {
                clearWeatherError();
                if (currentLocation) {
                  fetchWeatherForLocation(currentLocation);
                }
              }}
            />
          ) : weatherData ? (
            <View style={styles.weatherContent}>
              <View style={styles.weatherMainInfo}>
                <WeatherIcon 
                  icon={weatherData.current.icon} 
                  size={60} 
                  style={styles.mainWeatherIcon}
                />
                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperature}>
                    {formatTemperature(weatherData.current.temperature, appState.settings.temperatureUnit)}
                  </Text>
                  <Text style={styles.feelsLike}>
                    Feels like {formatTemperature(weatherData.current.feelsLike, appState.settings.temperatureUnit)}
                  </Text>
                </View>
              </View>

              <Text style={styles.weatherDescription}>
                {weatherData.current.description}
              </Text>

              <WeatherDetailsGrid 
                details={[
                  { label: 'Humidity', value: `${weatherData.current.humidity}%`, icon: '💧' },
                  { label: 'Wind', value: `${weatherData.current.windSpeed} km/h`, icon: '💨' },
                  { label: 'Pressure', value: `${weatherData.current.pressure} hPa`, icon: '🌡️' },
                  { label: 'Cloud Cover', value: `${weatherData.current.cloudCover}%`, icon: '☁️' },
                ]}
              />
            </View>
          ) : (
            <View style={styles.noDataCard}>
              <Text style={styles.noDataText}>No weather data available</Text>
              <Text style={styles.noDataSubtext}>
                {currentLocation
                  ? 'Unable to get weather for this location'
                  : 'Please enable location or search for a location to get weather information'
                }
              </Text>
              {currentLocation && (
                <Button
                  title="Get Weather"
                  onPress={() => fetchWeatherForLocation(currentLocation)}
                  variant="primary"
                  size="small"
                  style={styles.fetchWeatherButton}
                />
              )}
            </View>
          )}
        </Card>

        {/* Hourly Forecast */}
        {weatherData?.hourly && weatherData.hourly.length > 0 && (
          <Card style={styles.forecastCard}>
            <HourlyForecast
              hourlyData={weatherData.hourly}
              temperatureUnit={appState.settings.temperatureUnit}
              showPrecipitation={true}
            />
          </Card>
        )}

        {/* Daily Forecast */}
        {weatherData?.daily && weatherData.daily.length > 0 && (
          <Card style={styles.forecastCard}>
            <DailyForecast
              dailyData={weatherData.daily}
              temperatureUnit={appState.settings.temperatureUnit}
              showPrecipitation={true}
              onDayPress={(day) => {
                // Future enhancement: Show detailed day view
                Alert.alert(
                  `Weather for ${day.date.toLocaleDateString()}`,
                  `${day.description}\nHigh: ${formatTemperature(day.maxTemp, appState.settings.temperatureUnit)}\nLow: ${formatTemperature(day.minTemp, appState.settings.temperatureUnit)}`
                );
              }}
            />
          </Card>
        )}

        {/* App Error Display */}
        {appState.error && (
          <Card style={styles.errorCard}>
            <ErrorMessage
              title="Application Error"
              message={appState.error}
              showRetry={false}
            />
          </Card>
        )}

        {/* Saved Locations */}
        {appState.savedLocations.length > 0 && (
          <Card style={styles.savedLocationsCard}>
            <Text style={sectionTitleStyle}>Saved Locations</Text>
            {appState.savedLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.savedLocationItem}
                onPress={() => {
                  // We'll implement location switching later
                  Alert.alert('Location', `Switch to ${location.name}?`);
                }}
              >
                <Text style={styles.savedLocationName}>{location.name}</Text>
                <Text style={styles.savedLocationDetails}>
                  {location.country} • {location.region}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#87CEEB',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  locationCard: {
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  locationDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  locationActionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  updateLocationButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  locationError: {
    marginVertical: 10,
  },
  weatherCardContainer: {
    marginTop: 0,
  },
  forecastCard: {
    marginTop: 0,
    padding: 0,
  },
  weatherText: {
    fontSize: 16,
    color: '#666',
  },
  weatherContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  mainWeatherIcon: {
    marginRight: 20,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
  },
  staleIndicator: {
    color: '#ff9800',
    fontWeight: '500',
  },
  weatherMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 16,
    color: '#666',
  },
  weatherDescription: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  fetchWeatherButton: {
    marginTop: 15,
  },
  noDataCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorCard: {
    marginTop: 0,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    lineHeight: 20,
  },
  savedLocationsCard: {
    marginTop: 0,
  },
  savedLocationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  savedLocationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  savedLocationDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
