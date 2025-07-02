import React, { useEffect } from 'react';
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
import { useLocationContext } from '@/context/LocationContext';
import { HomeScreenProps } from '@/types';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state: appState, setLoading, setError } = useAppContext();
  const { state: locationState, setLoadingLocation } = useLocationContext();

  // Handle refresh
  const onRefresh = async () => {
    setLoading(true);
    try {
      // We'll implement weather data fetching later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setLoading(false);
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

  // Request location permission on mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      setLoadingLocation(true);
      try {
        // We'll implement location services later
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate permission request
        setLoadingLocation(false);
      } catch (error) {
        setLoadingLocation(false);
        Alert.alert(
          'Location Permission',
          'Unable to get location permission. You can search for locations manually.',
          [{ text: 'OK' }]
        );
      }
    };

    requestLocationPermission();
  }, []);

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
          {locationState.isLoadingLocation ? (
            <Text style={styles.locationText}>Getting your location...</Text>
          ) : locationState.currentLocation ? (
            <Text style={styles.locationText}>
              {locationState.currentLocation.name ||
                `${locationState.currentLocation.latitude.toFixed(4)}, ${locationState.currentLocation.longitude.toFixed(4)}`}
            </Text>
          ) : (
            <View>
              <Text style={styles.locationText}>Location not available</Text>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchLocation}
              >
                <Text style={styles.searchButtonText}>Search for a location</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Weather Data Section */}
        <View style={styles.weatherSection}>
          <Text style={styles.sectionTitle}>Current Weather</Text>
          {appState.isLoading ? (
            <Text style={styles.weatherText}>Loading weather data...</Text>
          ) : appState.weatherData ? (
            <View style={styles.weatherCard}>
              <Text style={styles.temperature}>
                {appState.weatherData.current.temperature}°
                {appState.settings.temperatureUnit === 'celsius' ? 'C' : 'F'}
              </Text>
              <Text style={styles.weatherDescription}>
                {appState.weatherData.current.description}
              </Text>
              <Text style={styles.weatherDetails}>
                Feels like {appState.weatherData.current.feelsLike}°
              </Text>
              <Text style={styles.weatherDetails}>
                Humidity: {appState.weatherData.current.humidity}%
              </Text>
            </View>
          ) : (
            <View style={styles.noDataCard}>
              <Text style={styles.noDataText}>No weather data available</Text>
              <Text style={styles.noDataSubtext}>
                Please enable location or search for a location to get weather information
              </Text>
            </View>
          )}
        </View>

        {/* Error Display */}
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
  searchButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
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
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  weatherDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
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