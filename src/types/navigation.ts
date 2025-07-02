import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { LocationData } from './location';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  LocationSearch: undefined;
  Settings: undefined;
  LocationDetails: {
    location: LocationData;
  };
};

// Navigation prop types for each screen
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type LocationSearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LocationSearch'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;
export type LocationDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LocationDetails'>;

// Route prop types for each screen
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type LocationSearchScreenRouteProp = RouteProp<RootStackParamList, 'LocationSearch'>;
export type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;
export type LocationDetailsScreenRouteProp = RouteProp<RootStackParamList, 'LocationDetails'>;

// Combined screen props
export type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

export type LocationSearchScreenProps = {
  navigation: LocationSearchScreenNavigationProp;
  route: LocationSearchScreenRouteProp;
};

export type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;
};

export type LocationDetailsScreenProps = {
  navigation: LocationDetailsScreenNavigationProp;
  route: LocationDetailsScreenRouteProp;
};