import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocationContext } from '@/context/LocationContext';
import { useLocation } from '@/hooks/useLocation';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { LocationSearchScreenProps, GeocodingResult } from '@/types';

const LocationSearchScreen: React.FC<LocationSearchScreenProps> = ({ navigation }) => {
  const { setCurrentLocation } = useLocationContext();
  const { 
    currentLocation,
    isLoadingLocation,
    requestLocation,
    requestPermissions,
    permissionState,
  } = useLocation();
  
  const {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    setQuery,
    clearResults,
    clearError,
    convertToLocationData,
  } = useLocationSearch();

  // Handle location selection
  const handleLocationSelect = (result: GeocodingResult) => {
    const location = convertToLocationData(result);
    
    Alert.alert(
      'Select Location',
      `Use ${location.name}, ${location.country} as your location?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Location',
          onPress: () => {
            // Update location context (this will update the UI)
            setCurrentLocation(location);
            
            // Clear search and navigate back
            clearResults();
            navigation.goBack();
            
            Alert.alert(
              'Location Updated',
              `Weather location set to ${location.name}, ${location.country}`
            );
          },
        },
      ]
    );
  };

  // Handle current location request
  const handleCurrentLocation = async () => {
    if (!permissionState.granted) {
      Alert.alert(
        'Location Permission Required',
        'This app needs access to your location to provide accurate weather information.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Allow',
            onPress: async () => {
              await requestPermissions();
              if (permissionState.granted) {
                await handleGetCurrentLocation();
              }
            },
          },
        ]
      );
    } else {
      await handleGetCurrentLocation();
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      await requestLocation();
      
      if (currentLocation) {
        // Navigate back and show success
        navigation.goBack();
        Alert.alert(
          'Location Updated',
          'Using your current location for weather data.'
        );
      }
    } catch (error) {
      // Error handling is done in useLocation hook
      console.error('Error getting current location:', error);
    }
  };

  const renderLocationItem = ({ item }: { item: GeocodingResult }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationDetails}>
          {item.admin1 && `${item.admin1}, `}{item.country}
          {item.population && ` • ${item.population.toLocaleString()} people`}
        </Text>
        <Text style={styles.locationCoords}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {isSearching && (
            <ActivityIndicator
              size="small"
              color="#87CEEB"
              style={styles.searchLoader}
            />
          )}
        </View>
        
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Text style={styles.currentLocationText}>
            {isLoadingLocation ? '⏳ Getting Location...' : '📍 Use Current Location'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchError ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Search Error</Text>
            <Text style={styles.noResultsSubtext}>
              {searchError.message}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                clearError();
                setQuery(searchQuery); // Trigger search again
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : searchQuery.length > 0 && !isSearching && searchResults.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No locations found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for a different city or location
            </Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderLocationItem}
            keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
            style={styles.resultsList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              searchResults.length > 0 ? (
                <Text style={styles.resultsHeader}>
                  {searchResults.length} location{searchResults.length !== 1 ? 's' : ''} found
                </Text>
              ) : null
            }
          />
        )}
      </View>

      {/* Search Tips */}
      {searchQuery.length === 0 && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsHeader}>Search Tips:</Text>
          <Text style={styles.tipText}>• Enter a city name (e.g., "Paris")</Text>
          <Text style={styles.tipText}>• Include country for better results</Text>
          <Text style={styles.tipText}>• Try different spellings if no results</Text>
          <Text style={styles.tipText}>• Use your current location for instant results</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    backgroundColor: '#87CEEB',
    padding: 20,
    paddingTop: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  searchLoader: {
    marginLeft: 10,
  },
  currentLocationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  currentLocationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  resultsList: {
    flex: 1,
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: '#999',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  tipsContainer: {
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
  tipsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  retryButton: {
    backgroundColor: '#87CEEB',
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
});

export default LocationSearchScreen;