import React, { useState } from 'react';
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
import { useAppContext } from '@/context/AppContext';
import { useLocationContext } from '@/context/LocationContext';
import { LocationSearchScreenProps, LocationData } from '@/types';

// Mock search results for now
const mockSearchResults: LocationData[] = [
  {
    latitude: 40.7128,
    longitude: -74.0060,
    name: 'New York',
    country: 'United States',
    region: 'New York',
  },
  {
    latitude: 51.5074,
    longitude: -0.1278,
    name: 'London',
    country: 'United Kingdom',
    region: 'England',
  },
  {
    latitude: 48.8566,
    longitude: 2.3522,
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
  },
];

const LocationSearchScreen: React.FC<LocationSearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { setCurrentLocation } = useAppContext();
  const { setCurrentLocation: setLocationContextLocation } = useLocationContext();

  // Handle search
  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate API search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock results based on search query
      const filtered = mockSearchResults.filter(location =>
        location.name?.toLowerCase().includes(query.toLowerCase()) ||
        location.country?.toLowerCase().includes(query.toLowerCase()) ||
        location.region?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to search locations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationData) => {
    Alert.alert(
      'Select Location',
      `Use ${location.name}, ${location.country} as your location?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Location',
          onPress: () => {
            // Update both contexts
            setCurrentLocation(location);
            setLocationContextLocation(location);
            
            // Navigate back to home
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
    Alert.alert(
      'Use Current Location',
      'This will request access to your device location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow',
          onPress: async () => {
            setIsSearching(true);
            try {
              // Simulate location request
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Mock current location (NYC for demo)
              const currentLocation: LocationData = {
                latitude: 40.7589,
                longitude: -73.9851,
                name: 'Current Location',
                country: 'United States',
                region: 'New York',
              };
              
              setCurrentLocation(currentLocation);
              setLocationContextLocation(currentLocation);
              navigation.goBack();
              
              Alert.alert(
                'Location Updated',
                'Using your current location for weather data.'
              );
            } catch (error) {
              Alert.alert(
                'Location Error',
                'Unable to get your current location. Please search manually or check location permissions.'
              );
            } finally {
              setIsSearching(false);
            }
          },
        },
      ]
    );
  };

  const renderLocationItem = ({ item }: { item: LocationData }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationDetails}>
          {item.region && `${item.region}, `}{item.country}
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
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
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
          disabled={isSearching}
        >
          <Text style={styles.currentLocationText}>
            📍 Use Current Location
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.length > 0 && !isSearching && searchResults.length === 0 ? (
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
});

export default LocationSearchScreen;