import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '@/context/AppContext';
import { SettingsScreenProps, AppSettings } from '@/types';

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { state, updateSettings } = useAppContext();
  const { settings } = state;

  // Handle setting updates
  const handleSettingUpdate = (key: keyof AppSettings, value: any) => {
    updateSettings({ [key]: value });
  };

  // Handle temperature unit selection
  const selectTemperatureUnit = () => {
    Alert.alert(
      'Temperature Unit',
      'Choose your preferred temperature unit',
      [
        {
          text: 'Celsius (°C)',
          onPress: () => handleSettingUpdate('temperatureUnit', 'celsius'),
        },
        {
          text: 'Fahrenheit (°F)',
          onPress: () => handleSettingUpdate('temperatureUnit', 'fahrenheit'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Handle wind speed unit selection
  const selectWindSpeedUnit = () => {
    Alert.alert(
      'Wind Speed Unit',
      'Choose your preferred wind speed unit',
      [
        {
          text: 'km/h',
          onPress: () => handleSettingUpdate('windSpeedUnit', 'kmh'),
        },
        {
          text: 'm/s',
          onPress: () => handleSettingUpdate('windSpeedUnit', 'ms'),
        },
        {
          text: 'mph',
          onPress: () => handleSettingUpdate('windSpeedUnit', 'mph'),
        },
        {
          text: 'knots',
          onPress: () => handleSettingUpdate('windSpeedUnit', 'kn'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Handle precipitation unit selection
  const selectPrecipitationUnit = () => {
    Alert.alert(
      'Precipitation Unit',
      'Choose your preferred precipitation unit',
      [
        {
          text: 'Millimeters (mm)',
          onPress: () => handleSettingUpdate('precipitationUnit', 'mm'),
        },
        {
          text: 'Inches (in)',
          onPress: () => handleSettingUpdate('precipitationUnit', 'inch'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Handle theme selection
  const selectTheme = () => {
    Alert.alert(
      'App Theme',
      'Choose your preferred app theme',
      [
        {
          text: 'Light',
          onPress: () => handleSettingUpdate('theme', 'light'),
        },
        {
          text: 'Dark',
          onPress: () => handleSettingUpdate('theme', 'dark'),
        },
        {
          text: 'Auto (System)',
          onPress: () => handleSettingUpdate('theme', 'auto'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView}>
        {/* Units Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={selectTemperatureUnit}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Temperature</Text>
              <Text style={styles.settingValue}>
                {settings.temperatureUnit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
              </Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={selectWindSpeedUnit}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Wind Speed</Text>
              <Text style={styles.settingValue}>
                {settings.windSpeedUnit === 'kmh' && 'km/h'}
                {settings.windSpeedUnit === 'ms' && 'm/s'}
                {settings.windSpeedUnit === 'mph' && 'mph'}
                {settings.windSpeedUnit === 'kn' && 'knots'}
              </Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={selectPrecipitationUnit}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Precipitation</Text>
              <Text style={styles.settingValue}>
                {settings.precipitationUnit === 'mm' ? 'Millimeters (mm)' : 'Inches (in)'}
              </Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={selectTheme}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingValue}>
                {settings.theme === 'light' && 'Light'}
                {settings.theme === 'dark' && 'Dark'}
                {settings.theme === 'auto' && 'Auto (System)'}
              </Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Weather Alerts</Text>
              <Text style={styles.settingDescription}>
                Get notified about severe weather conditions
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => handleSettingUpdate('notifications', value)}
              trackColor={{ false: '#d3d3d3', true: '#87CEEB' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Location Sharing</Text>
              <Text style={styles.settingDescription}>
                Allow app to access your location for weather data
              </Text>
            </View>
            <Switch
              value={settings.locationSharing}
              onValueChange={(value) => handleSettingUpdate('locationSharing', value)}
              trackColor={{ false: '#d3d3d3', true: '#87CEEB' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weather Data</Text>
            <Text style={styles.infoValue}>OpenMeteo API</Text>
          </View>
          
          <TouchableOpacity
            style={styles.infoItem}
            onPress={() => {
              Alert.alert(
                'About Weather App',
                'A simple and elegant weather application built with React Native and Expo.\n\nWeather data provided by OpenMeteo API.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={styles.infoLabel}>About</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Current Settings Debug Info */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Info (Development Only)</Text>
            <Text style={styles.debugText}>
              {JSON.stringify(settings, null, 2)}
            </Text>
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
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
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
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    color: '#87CEEB',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
  },
  debugSection: {
    backgroundColor: '#f9f9f9',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});

export default SettingsScreen;