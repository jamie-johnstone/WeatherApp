// Navigation types
export type RootStackParamList = {
  Home: undefined;
  LocationSearch: undefined;
  Settings: undefined;
  LocationDetails: {
    location: {
      latitude: number;
      longitude: number;
      name?: string;
    };
  };
};

export type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  push: (screen: keyof RootStackParamList, params?: any) => void;
  replace: (screen: keyof RootStackParamList, params?: any) => void;
};