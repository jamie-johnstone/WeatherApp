import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';

// Import screens (we'll create these next)
import HomeScreen from '@/screens/HomeScreen';
import LocationSearchScreen from '@/screens/LocationSearchScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#87CEEB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Weather',
            headerRight: () => (
              // We'll add a search button here later
              null
            ),
          }}
        />
        <Stack.Screen
          name="LocationSearch"
          component={LocationSearchScreen}
          options={{
            title: 'Search Location',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;