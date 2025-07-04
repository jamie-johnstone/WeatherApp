# Tests Directory Structure

This directory contains all test files for the React Native Weather App, organized to mirror the application's directory structure.

## Directory Structure

```
tests/
├── components/          # Component unit tests
│   ├── Accessibility.test.tsx
│   ├── Button.test.tsx
│   ├── Card.test.tsx
│   ├── ErrorMessage.test.tsx
│   ├── LoadingSpinner.test.tsx
│   ├── Snapshots.test.tsx
│   ├── WeatherDetailsGrid.test.tsx
│   └── WeatherIcon.test.tsx
├── context/             # Context provider tests
│   ├── AppContext.test.tsx
│   └── LocationContext.test.tsx
├── hooks/               # Custom hook tests
│   ├── useLocation.test.ts
│   ├── useLocationSearch.test.ts
│   ├── useResponsive.test.ts
│   ├── useTheme.test.ts
│   ├── useWeather.test.ts
│   └── useWeatherAlerts.test.ts
├── integration/         # Integration and E2E tests
│   ├── CrossPlatformCompatibility.test.tsx
│   ├── EndToEndScenarios.test.tsx
│   └── OfflineIntegration.test.tsx
├── navigation/          # Navigation tests
│   └── NavigationIntegration.test.tsx
├── screens/             # Screen component tests
│   ├── HomeScreen.test.tsx
│   ├── LocationSearchScreen.test.tsx
│   └── SettingsScreen.test.tsx
├── services/            # Service layer tests
│   ├── LocationServiceIntegration.test.ts
│   ├── WeatherService.test.ts
│   └── WeatherServiceIntegration.test.ts
├── utils/               # Utility function tests
│   └── weatherUtils.test.ts
├── setupTests.ts        # Test setup and mocks
└── README.md           # This file
```

## Test Categories

### 1. Unit Tests
- **Components** (`components/`): Individual component rendering and interaction tests
- **Hooks** (`hooks/`): Custom hook behavior and state management tests
- **Utils** (`utils/`): Pure function and utility tests
- **Services** (`services/`): Service layer method tests

### 2. Integration Tests
- **Navigation** (`navigation/`): Screen navigation flow tests
- **Context** (`context/`): Context provider integration tests
- **Cross-Platform** (`integration/CrossPlatformCompatibility.test.tsx`): Platform-specific behavior tests
- **Offline** (`integration/OfflineIntegration.test.tsx`): Offline functionality and data persistence tests

### 3. End-to-End Tests
- **User Scenarios** (`integration/EndToEndScenarios.test.tsx`): Complete user workflow tests
- **Screen Tests** (`screens/`): Full screen component tests with context

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Categories
```bash
# Component tests only
npm test -- tests/components

# Integration tests only
npm test -- tests/integration

# Service tests only
npm test -- tests/services

# Hook tests only
npm test -- tests/hooks
```

### Individual Test Files
```bash
# Specific component test
npm test -- tests/components/Button.test.tsx

# Specific integration test
npm test -- tests/integration/EndToEndScenarios.test.tsx
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Patterns

### Component Tests
- Render testing with various props
- User interaction simulation
- Accessibility validation
- Snapshot testing for UI consistency

### Hook Tests
- State management validation
- Side effect testing
- Error handling
- Performance considerations

### Integration Tests
- Service integration validation
- Cross-platform compatibility
- Real-world scenario simulation
- Error boundary testing

### End-to-End Tests
- Complete user workflows
- Multi-screen navigation
- Data persistence
- Offline/online transitions

## Mocking Strategy

### External Dependencies
- `expo-location` - Location services
- `@react-native-async-storage/async-storage` - Data persistence
- `@react-navigation/native` - Navigation
- `react-native-safe-area-context` - Safe area handling

### Internal Services
- `WeatherService` - Weather API integration
- `LocationService` - Location management
- Theme and responsive hooks

## Test Configuration

Tests are configured via `jest.config.js` with the following key settings:

- **Test Environment**: `jsdom` for React Native compatibility
- **Setup Files**: `tests/setupTests.ts` for mocks and configuration
- **Test Match Pattern**: `tests/**/*.(test|spec).(ts|tsx|js)`
- **Module Name Mapping**: `@/` → `src/` for path resolution
- **Coverage Collection**: Excludes test files and type definitions

## Best Practices

1. **Mirror Directory Structure**: Test files should mirror the `src/` directory structure
2. **Descriptive Test Names**: Use clear, descriptive test names that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion phases
4. **Mock External Dependencies**: Mock all external services and APIs
5. **Test Edge Cases**: Include error scenarios and edge cases
6. **Accessibility Testing**: Ensure components work with screen readers and assistive technologies
7. **Cross-Platform Testing**: Validate behavior across iOS, Android, and Web platforms
8. **Performance Testing**: Include tests for performance-critical operations

## Contributing

When adding new components, hooks, or services to the application:

1. Create corresponding test files in the appropriate `tests/` subdirectory
2. Follow the established naming convention: `[ComponentName].test.tsx`
3. Include comprehensive test coverage for all public methods and user interactions
4. Update this README if introducing new test patterns or categories