# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native weather application built with Expo and TypeScript. The app provides weather information using the OpenMeteo API with a clean, modern interface.

## Development Commands

**Primary Commands:**
- `npm start` - Start Expo development server (primary development command)
- `npm run android` - Launch on Android device/emulator
- `npm run ios` - Launch on iOS simulator (macOS only)
- `npm run web` - Launch in web browser

**Code Quality:**
- `npx eslint .` - Run ESLint linting
- `npx prettier --write .` - Format code with Prettier
- `npx tsc --noEmit` - TypeScript type checking

## Architecture Overview

**State Management:**
- Context API with useReducer for global state
- `AppContext` - General app state, settings, weather data
- `LocationContext` - Location-specific state and permissions

**Navigation:**
- React Navigation v7 with Stack Navigator
- Fully typed navigation with TypeScript interfaces
- Screens: Home, LocationSearch, Settings

**Project Structure:**
```
src/
├── components/       # Reusable UI components (future)
├── screens/         # Screen components (Home, LocationSearch, Settings)
├── navigation/      # Navigation configuration
├── context/         # Context providers for state management
├── services/        # API services (future - OpenMeteo integration)
├── utils/          # Utility functions (future)
├── constants/      # App constants (future)
├── types/          # TypeScript definitions (comprehensive)
└── hooks/          # Custom hooks (future)
```

**Key Type Definitions:**
- `types/weather.ts` - OpenMeteo API responses and processed weather data
- `types/location.ts` - Location services, coordinates, permissions
- `types/navigation.ts` - Typed navigation props and routes
- `types/index.ts` - App state, settings, utility types

**Development Approach:**
- Phase-based development with review after each phase
- TypeScript strict mode with comprehensive type safety
- Context-based state management (no Redux)
- Expo managed workflow (no native code required)

## Current Implementation Status

**✅ Completed:**
- Phase 1: Project setup, TypeScript configuration, type definitions
- Phase 2: Navigation, Context API state management, basic screens

- Expo Location integration
- Permission handling
- Current location detection

- Phase 3: Weather API integration
- Phase 4: Weather API integration
- Phase 5: UI components and styling
- Phase 6: Advanced features
- Phase 7: Testing
**🔄 Current Phase 8: Error handling**
**📋 Future Phases:**
- Phase 9: deployment

## Important Notes

**API Integration:**
- Uses OpenMeteo API (free, no API key required)
- Weather data types are fully defined in `types/weather.ts`
- API service layer will be in `src/services/WeatherService.ts`

**Location Services:**
- Uses `expo-location` for cross-platform location access
- Permissions configured in `app.json` for iOS/Android
- Location state managed in `LocationContext`

**Styling Approach:**
- StyleSheet-based styling (no external UI library)
- Sky blue theme (#87CEEB) for weather app aesthetic
- Responsive design considerations for multiple screen sizes

**Testing Strategy:**
- TypeScript compilation as first line of defense
- Manual testing on Expo Go during development
- Future: Jest unit tests and integration testing
