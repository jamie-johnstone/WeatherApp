# Weather App

A modern, elegant weather application built with React Native, Expo, and TypeScript. Get real-time weather information using the OpenMeteo API with a clean, intuitive interface.

## Features

### Current (Phase 2)
- 🎯 **Clean Navigation**: Stack-based navigation with typed routes
- 🏗️ **State Management**: Context API with TypeScript for app and location state  
- 📱 **Multi-Screen Interface**: Home, Location Search, and Settings screens
- ⚙️ **Customizable Settings**: Temperature units, wind speed units, theme preferences
- 📍 **Location Support**: Current location detection and manual location search

### Planned Features
- 🌤️ **Real-time Weather**: Current conditions, hourly, and 7-day forecasts
- 🗺️ **Location Services**: GPS integration with permission handling
- 💾 **Offline Support**: Cached weather data for offline viewing
- 🔔 **Weather Alerts**: Notifications for severe weather conditions
- 🎨 **Dynamic Themes**: Weather-based background themes

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript with strict configuration
- **Navigation**: React Navigation v7
- **State Management**: Context API with useReducer
- **API**: OpenMeteo Weather API
- **Location**: Expo Location services
- **Storage**: AsyncStorage for preferences
- **Development**: ESLint, Prettier, Git

## Project Structure

```
src/
├── components/       # Reusable UI components (coming in Phase 5)
├── screens/         # Screen components
│   ├── HomeScreen.tsx
│   ├── LocationSearchScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/      # Navigation configuration
│   └── AppNavigator.tsx
├── context/         # State management
│   ├── AppContext.tsx
│   └── LocationContext.tsx
├── services/        # API services (coming in Phase 4)
├── utils/          # Utility functions (coming in Phase 4)
├── constants/      # App constants (coming in Phase 4)
├── types/          # TypeScript type definitions
│   ├── weather.ts
│   ├── location.ts
│   ├── navigation.ts
│   └── index.ts
└── hooks/          # Custom hooks (coming in Phase 4)
```

## Development Progress

### ✅ Phase 1: Project Setup and Architecture
- Expo TypeScript project initialization
- Folder structure and configuration
- Comprehensive type definitions
- Development tooling (ESLint, Prettier)

### ✅ Phase 2: Core Application Structure
- React Navigation with typed routes
- Context API state management
- Basic screen components (Home, LocationSearch, Settings)
- App-wide providers and navigation setup

### 🔄 Phase 3: Location Services (Next)
- Expo Location integration
- Permission handling
- Current location detection
- Location search with geocoding

### 📋 Upcoming Phases
- **Phase 4**: Weather API Integration
- **Phase 5**: User Interface Development  
- **Phase 6**: Advanced Features
- **Phase 7**: Testing
- **Phase 8**: Error Handling
- **Phase 9**: Build and Deployment

## Getting Started

### Prerequisites
- Node.js 18.17.0+
- Expo CLI installed globally
- Expo Go app on your mobile device

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd WeatherApp
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Scan the QR code with Expo Go app
   - Or use simulators: `npm run ios` / `npm run android`

### Development Commands

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator  
npm run web        # Run in web browser
```

## Configuration

### TypeScript
- Strict mode enabled with comprehensive type checking
- Path mapping configured for clean imports (`@/components/*`)
- ESLint with TypeScript rules

### Expo Configuration
- Location permissions for iOS and Android
- Custom splash screen with weather theme
- Cross-platform support (iOS, Android, Web)

## Current State

The app currently includes:
- **Navigation**: Working stack navigation between screens
- **State Management**: Global app state and location state contexts
- **Home Screen**: Weather display placeholder with location status
- **Location Search**: Manual location search interface (mock data)
- **Settings Screen**: Unit preferences and app configuration

## Contributing

This project follows a phase-based development approach. Each phase builds upon the previous one with thorough testing and review.

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Comprehensive type definitions
- Context-based state management
- Functional components with hooks

## License

MIT License - see LICENSE file for details.

## API Credits

Weather data provided by [OpenMeteo](https://open-meteo.com/) - Free weather API for non-commercial use.