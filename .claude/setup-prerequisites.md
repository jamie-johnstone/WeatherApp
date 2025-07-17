# Setup Prerequisites - React Native Weather App

## Development Environment Setup

### 1. Node.js and Package Manager
- [x] **Node.js** (v18.17.0 or higher recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- [x] **npm** (comes with Node.js) or **Yarn** (v1.22.0+)
  - Verify npm: `npm --version`
  - Or install Yarn: `npm install -g yarn`

### 2. Expo Development Environment (Selected)
- [x] **Expo CLI** (v6.0.0+)
  ```bash
  npm install -g @expo/cli
  ```
- [x] **Expo Go app** on your mobile device
  - iOS: App Store
  - Android: Google Play Store
- [x] **Expo account** (for publishing and OTA updates)
  - Sign up at [expo.dev](https://expo.dev/)
  - Login via CLI: `expo login`
- [x] **EAS CLI** (for building and submitting)
  ```bash
  npm install -g eas-cli
  ```

### 3. Platform-Specific Requirements (Expo Managed Workflow)

#### For Local Development (Optional with Expo Go)
- [ ] **iOS Simulator** (macOS only, optional for testing)
  - Install Xcode from Mac App Store
  - iOS Simulator included with Xcode
- [ ] **Android Emulator** (optional for testing)
  - Install Android Studio for emulator only
  - Configure Android Virtual Device (AVD)
  - Note: Full SDK setup not required with Expo

#### For Production Builds (EAS Build)
- [ ] **Apple Developer Account** (for iOS app store)
- [ ] **Google Play Console Account** (for Android app store)
- [ ] **EAS Build configured** (handles native compilation)

### 4. TypeScript Development Environment
- [x] **TypeScript** (v4.9.0+ recommended)
  ```bash
  npm install -g typescript
  ```
- [x] **Verify TypeScript installation**: `tsc --version`

### 5. Code Editor and Extensions
- [ ] **Visual Studio Code** (recommended)
- [ ] **Essential VS Code Extensions for Expo + TypeScript**:
  - Expo Tools (official Expo extension)
  - TypeScript Importer
  - React Native Tools
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag
  - TypeScript Hero
  - Path Intellisense

### 6. Version Control
- [x] **Git** (v2.30.0+)
  - Download from [git-scm.com](https://git-scm.com/)
  - Configure user name and email
- [x] **GitHub account** (for code repository)

### 7. Device/Testing Setup (Expo)
- [x] **Physical Device with Expo Go** (primary testing method)
  - Install Expo Go app
  - Same WiFi network as development machine
  - Scan QR code to run app
- [ ] **Emulator/Simulator** (optional)
  - iOS Simulator: `expo start --ios`
  - Android Emulator: `expo start --android`
  - Web browser: `expo start --web`

### 8. Expo Development Tools
- [ ] **Expo Dev Tools** (built into Expo CLI)
  - Accessible via browser when running `expo start`
  - Includes logs, performance metrics, and device management
- [ ] **React Developer Tools** (for web debugging)
  - Browser extension for debugging
- [ ] **Postman** or **Insomnia** (for API testing)
- [ ] **Expo Diagnostics** (for troubleshooting)
  - Run `expo doctor` to check setup

### 9. Location Services Considerations
- [ ] **Device Location Permission**
  - Physical device with GPS capability
  - Location services enabled
- [ ] **Simulator Location**
  - iOS Simulator: Features > Location > Custom Location
  - Android Emulator: Extended Controls > Location

### 10. Network and API Testing
- [x] **Stable Internet Connection**
- [x] **API Testing Tool** (Postman/Insomnia)
- [x] **Test OpenMeteo API Access**
  ```bash
  curl "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m"
  ```

## Security Considerations
- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement proper input validation
- Consider rate limiting for API calls

## Performance Considerations
- Test on various device types and OS versions
- Consider offline functionality
- Implement proper loading states
- Optimize image and asset sizes

## TypeScript-Specific Considerations
- Ensure strict TypeScript configuration for better type safety
- Use interface definitions for all API responses
- Implement proper type checking for props and state
- Configure path mapping for cleaner imports
- Set up proper IDE IntelliSense for TypeScript

## Expo-Specific Considerations
- Expo managed workflow handles most native configurations
- No need for Xcode/Android Studio for development (only for simulators)
- Over-the-air updates available with EAS Update
- Some native modules may require ejecting to bare workflow
- Location services work seamlessly with expo-location

## Verification Checklist
- [x] Expo CLI working (`expo --version`)
- [x] TypeScript compiler working (`tsc --version`)
- [ ] Can create and run a new Expo TypeScript project
- [ ] Expo Go app can scan QR codes and run apps
- [ ] Can access OpenMeteo API from development environment
- [ ] Location services functional on test device
- [ ] Development tools properly configured
- [ ] TypeScript IntelliSense working in VS Code
- [ ] EAS CLI configured for builds (`eas --version`)
