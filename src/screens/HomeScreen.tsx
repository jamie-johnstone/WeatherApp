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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state: appState, setError } = useAppContext();
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

  // Handle refresh - get current location and weather data
  const onRefresh = async () => {
    clearLocationError();
    clearWeatherError();

    try {
      if (currentLocation) {
        // Refresh weather data for current location
        await fetchWeatherForLocation(currentLocation);
      } else if (permissionState.granted) {
        // Get location first, then weather will be fetched automatically
        await requestLocation();
      } else {
        setError('Location permission required to get weather data');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to refresh');
    }
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={appState.isLoading}
            onRefresh={onRefresh}
            tintColor="#87CEEB"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weather App</Text>
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

        {/* Current Location Status */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          {isLoadingLocation ? (
            <Text style={styles.locationText}>Getting your location...</Text>
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
              <TouchableOpacity
                style={styles.refreshLocationButton}
                onPress={handleRequestLocation}
              >
                <Text style={styles.refreshLocationText}>📍 Update Location</Text>
              </TouchableOpacity>
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
                <Text style={styles.errorText}>
                  {locationError.message}
                </Text>
              )}
              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={handleRequestLocation}
                >
                  <Text style={styles.locationButtonText}>
                    📍 Use Current Location
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearchLocation}
                >
                  <Text style={styles.searchButtonText}>🔍 Search Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Weather Data Section */}
        <View style={styles.weatherSection}>
          <View style={styles.weatherHeader}>
            <Text style={styles.sectionTitle}>Current Weather</Text>
            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Updated {formatRelativeTime(lastUpdated)}
                {isDataStale && <Text style={styles.staleIndicator}> • Stale</Text>}
              </Text>
            )}
          </View>

          {isLoadingWeather ? (
            <Text style={styles.weatherText}>Loading weather data...</Text>
          ) : weatherError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{weatherError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  clearWeatherError();
                  if (currentLocation) {
                    fetchWeatherForLocation(currentLocation);
                  }
                }}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : weatherData ? (
            <View style={styles.weatherCard}>
              <View style={styles.weatherMainInfo}>
                <Text style={styles.weatherIcon}>{weatherData.current.icon}</Text>
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

              <View style={styles.weatherDetailsGrid}>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>Humidity</Text>
                  <Text style={styles.weatherDetailValue}>{weatherData.current.humidity}%</Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>Wind</Text>
                  <Text style={styles.weatherDetailValue}>{weatherData.current.windSpeed} km/h</Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>Pressure</Text>
                  <Text style={styles.weatherDetailValue}>{weatherData.current.pressure} hPa</Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>Cloud Cover</Text>
                  <Text style={styles.weatherDetailValue}>{weatherData.current.cloudCover}%</Text>
                </View>
              </View>
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
                <TouchableOpacity
                  style={styles.fetchWeatherButton}
                  onPress={() => fetchWeatherForLocation(currentLocation)}
                >
                  <Text style={styles.fetchWeatherButtonText}>Get Weather</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* App Error Display */}
        {appState.error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>{appState.error}</Text>
          </View>
        )}

        {/* Saved Locations */}
        {appState.savedLocations.length > 0 && (
          <View style={styles.savedLocationsSection}>
            <Text style={styles.sectionTitle}>Saved Locations</Text>
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
          </View>
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
  locationSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshLocationButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  refreshLocationText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  weatherSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherText: {
    fontSize: 16,
    color: '#666',
  },
  weatherCard: {
    alignItems: 'center',
    paddingVertical: 20,
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
  weatherIcon: {
    fontSize: 60,
    marginRight: 20,
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
  weatherDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  weatherDetailItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  weatherDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  weatherDetailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  weatherDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  errorCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  fetchWeatherButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  fetchWeatherButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
  errorSection: {
    backgroundColor: '#ffebee',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    lineHeight: 20,
  },
  savedLocationsSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
