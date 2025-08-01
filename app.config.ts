import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: "jamie-johnstone",
  name: "Weather App",
  slug: "weather-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  platforms: ["ios", "android", "web"],
  scheme: "weatherapp",
  description: "A modern weather application providing accurate forecasts and location-based weather information.",
  githubUrl: "https://github.com/jamiejohnstone/WeatherApp",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#87CEEB"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.weatherapp.expo",
    buildNumber: "1",
    config: {
      usesNonExemptEncryption: false
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app needs access to your location to provide accurate weather information for your area.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "This app needs access to your location to provide accurate weather information for your area.",
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
        NSExceptionDomains: {
          "api.open-meteo.com": {
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionMinimumTLSVersion: "1.2"
          },
          "geocoding-api.open-meteo.com": {
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionMinimumTLSVersion: "1.2"
          }
        }
      }
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#87CEEB"
    },
    package: "com.weatherapp.expo",
    versionCode: 1,
    edgeToEdgeEnabled: true,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "INTERNET"
    ],
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: "weatherapp"
          }
        ],
        category: ["BROWSABLE", "DEFAULT"]
      }
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    environment: "development",
    apiUrl: "https://api.open-meteo.com/v1",
    debug: true,
    eas: {
      projectId: "ffe2ca94-6a89-456b-988a-fa09a3ee6a9e"
    }
  }
});
