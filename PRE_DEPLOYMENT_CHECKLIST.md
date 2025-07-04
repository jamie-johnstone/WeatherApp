# 📋 Pre-Deployment Checklist

Use this checklist before deploying to ensure everything is ready for production.

## ✅ Code Quality

- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Code linting passes (`npx eslint .`)
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented
- [ ] Code review completed (if working in team)

## ✅ App Configuration

- [ ] App version updated in `app.json`
- [ ] Build numbers incremented:
  - [ ] iOS `buildNumber` in `app.json`
  - [ ] Android `versionCode` in `app.json`
- [ ] Bundle identifiers are correct:
  - [ ] iOS: `com.weatherapp.expo`
  - [ ] Android: `com.weatherapp.expo`
- [ ] App metadata is complete:
  - [ ] Name, description, keywords
  - [ ] Privacy policy URL (if required)
  - [ ] Support URL

## ✅ Assets and Resources

- [ ] App icons are present and correct sizes:
  - [ ] `./assets/icon.png` (1024x1024)
  - [ ] `./assets/adaptive-icon.png` (Android)
  - [ ] `./assets/favicon.png` (Web)
- [ ] Splash screen configured:
  - [ ] `./assets/splash-icon.png`
  - [ ] Background color matches theme (`#87CEEB`)
- [ ] All image assets optimized for mobile

## ✅ Permissions and Security

- [ ] Location permissions properly configured:
  - [ ] iOS: `NSLocationWhenInUseUsageDescription`
  - [ ] Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
- [ ] Internet permission for Android
- [ ] App Transport Security configured for iOS
- [ ] No hardcoded API keys or secrets
- [ ] Privacy-sensitive features properly handled

## ✅ Functionality Testing

- [ ] App launches successfully
- [ ] Location services work:
  - [ ] Permission requests
  - [ ] Current location detection
  - [ ] Location search functionality
- [ ] Weather data loads correctly:
  - [ ] Current weather
  - [ ] Hourly forecasts
  - [ ] Daily forecasts
- [ ] Navigation works between all screens:
  - [ ] Home → Search
  - [ ] Home → Settings
  - [ ] Back navigation
- [ ] Error handling works:
  - [ ] Network failures
  - [ ] Location permission denied
  - [ ] API errors
- [ ] Offline functionality:
  - [ ] Cached data display
  - [ ] Offline indicators
  - [ ] Connection retry

## ✅ Platform-Specific Testing

### iOS
- [ ] Tested on iOS simulator
- [ ] Tested on physical iOS device (if available)
- [ ] Portrait and landscape orientations
- [ ] Different screen sizes (iPhone, iPad)
- [ ] iOS-specific features work
- [ ] App Store guidelines compliance

### Android
- [ ] Tested on Android emulator
- [ ] Tested on physical Android device (if available)
- [ ] Different screen sizes and densities
- [ ] Android-specific features work
- [ ] Google Play policy compliance

### Web
- [ ] Responsive design on different screen sizes
- [ ] Cross-browser compatibility:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Mobile web functionality
- [ ] PWA features (if implemented)

## ✅ Performance

- [ ] App startup time is reasonable
- [ ] Smooth animations and transitions
- [ ] Memory usage is optimal
- [ ] No performance warnings in development
- [ ] Network requests are efficient
- [ ] Images load quickly

## ✅ Deployment Infrastructure

### EAS Build
- [ ] EAS CLI installed and logged in
- [ ] Build profiles configured (`eas.json`)
- [ ] Test build completed successfully
- [ ] Build logs reviewed for warnings

### GitHub Pages (Web)
- [ ] GitHub Actions workflow configured
- [ ] Repository has Pages enabled
- [ ] Build and deploy workflow tested
- [ ] Custom domain configured (if applicable)

### App Stores (Future)
- [ ] Apple Developer account active (for iOS)
- [ ] Google Play Developer account active (for Android)
- [ ] App Store Connect configured (for iOS)
- [ ] Google Play Console configured (for Android)
- [ ] Store metadata prepared:
  - [ ] App descriptions
  - [ ] Screenshots
  - [ ] Keywords
  - [ ] Categories

## ✅ Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] API documentation current
- [ ] User guide available (if needed)
- [ ] Changelog updated

## ✅ Legal and Compliance

- [ ] Privacy policy reviewed
- [ ] Terms of service current
- [ ] Data collection practices documented
- [ ] GDPR compliance (if applicable)
- [ ] Accessibility guidelines followed
- [ ] License information included

## ✅ Post-Deployment

- [ ] Deployment monitoring set up
- [ ] Error tracking configured
- [ ] Analytics implementation verified
- [ ] User feedback collection ready
- [ ] Update/rollback plan documented

## 🚀 Ready for Deployment

Once all items are checked:

1. **Web Deployment**: Push to master/main branch
2. **Mobile Development**: `npm run build:development`
3. **Mobile Preview**: `npm run build:preview`
4. **Mobile Production**: `npm run build:production`

---

**Last Updated**: December 2024
**Checklist Version**: 1.0.0