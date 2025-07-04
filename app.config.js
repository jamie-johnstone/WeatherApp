export default ({ config }) => {
  // Base configuration from app.json
  const baseConfig = {
    ...config,
  };

  // Environment-specific configurations
  const buildProfile = process.env.EAS_BUILD_PROFILE || 'development';
  
  switch (buildProfile) {
    case 'development':
      return {
        ...baseConfig,
        name: 'Weather App (Dev)',
        ios: {
          ...baseConfig.ios,
          bundleIdentifier: 'com.weatherapp.expo.dev',
        },
        android: {
          ...baseConfig.android,
          package: 'com.weatherapp.expo.dev',
        },
        extra: {
          environment: 'development',
          apiUrl: 'https://api.open-meteo.com/v1',
          debug: true,
        },
      };

    case 'preview':
      return {
        ...baseConfig,
        name: 'Weather App (Preview)',
        ios: {
          ...baseConfig.ios,
          bundleIdentifier: 'com.weatherapp.expo.preview',
        },
        android: {
          ...baseConfig.android,
          package: 'com.weatherapp.expo.preview',
        },
        extra: {
          environment: 'preview',
          apiUrl: 'https://api.open-meteo.com/v1',
          debug: false,
        },
      };

    case 'production':
      return {
        ...baseConfig,
        name: 'Weather App',
        extra: {
          environment: 'production',
          apiUrl: 'https://api.open-meteo.com/v1',
          debug: false,
        },
      };

    default:
      return baseConfig;
  }
};