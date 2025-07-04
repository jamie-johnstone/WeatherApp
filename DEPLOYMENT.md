# 🚀 Weather App Deployment Guide

## Overview

This guide covers how to build and deploy the Weather App to various platforms using Expo and EAS Build.

## 📋 Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** installed
- **Expo CLI** installed globally: `npm install -g @expo/cli`
- **EAS CLI** installed globally: `npm install -g @expo/eas-cli`
- **Expo account** (free tier available)
- **Git repository** set up with GitHub

## 🌐 Web Deployment (GitHub Pages)

### Automatic Deployment
Web deployment is automated via GitHub Actions. Every push to `master`/`main` will:
1. Run tests
2. Build the web version
3. Deploy to GitHub Pages

**Live URL**: https://jamiejohnstone.github.io/WeatherApp

### Manual Deployment
```bash
# Build web version
npm run build:web

# Deploy to GitHub Pages (if gh-pages is configured)
npm run deploy:web
```

## 📱 Mobile App Builds (EAS)

### Setup EAS (One-time)
```bash
# Login to your Expo account
eas login

# Initialize EAS in your project (if not already done)
eas build:configure
```

### Build Profiles

#### 1. Development Build
For testing on physical devices with development features:
```bash
# iOS (simulator)
eas build --profile development --platform ios

# Android (APK)
eas build --profile development --platform android

# Both platforms
npm run build:development
```

#### 2. Preview Build
For internal testing and stakeholder review:
```bash
# iOS
eas build --profile preview --platform ios

# Android  
eas build --profile preview --platform android

# Both platforms
npm run build:preview
```

#### 3. Production Build
For app store submission:
```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android

# Both platforms
npm run build:production
```

## 🏪 App Store Deployment

### iOS App Store (Requires Apple Developer Account - $99/year)

1. **Prerequisites**:
   - Apple Developer Account
   - App Store Connect access
   - Update `eas.json` with your Apple ID and team info

2. **Build and Submit**:
   ```bash
   # Build production version
   eas build --profile production --platform ios
   
   # Submit to App Store
   eas submit --platform ios
   ```

3. **Manual Process**:
   - Download IPA from EAS build dashboard
   - Upload via App Store Connect or Transporter
   - Fill out app metadata and screenshots
   - Submit for review

### Android Play Store (Requires Google Play Developer Account - $25 one-time)

1. **Prerequisites**:
   - Google Play Developer Account
   - Service account key for automated submission
   - Update `eas.json` with service account path

2. **Build and Submit**:
   ```bash
   # Build production version
   eas build --profile production --platform android
   
   # Submit to Play Store (internal testing track)
   eas submit --platform android
   ```

## 🔧 Environment Variables

For production builds, you may need to set environment variables:

```bash
# Set environment variables in EAS
eas secret:create --scope project --name API_KEY --value "your-api-key"

# Or use .env files (not recommended for secrets)
```

## 📊 Build Monitoring

Monitor your builds at:
- **EAS Dashboard**: https://expo.dev/accounts/[username]/projects/weather-app/builds
- **GitHub Actions**: Repository → Actions tab

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check EAS build logs
   - Verify all dependencies are properly installed
   - Ensure TypeScript compiles without errors

2. **GitHub Pages Not Updating**:
   - Check GitHub Actions workflow logs
   - Verify repository settings allow GitHub Pages
   - Ensure `gh-pages` branch exists

3. **iOS Code Signing Issues**:
   - Verify Apple Developer account is active
   - Check bundle identifier uniqueness
   - Ensure certificates are valid

4. **Android Build Issues**:
   - Verify package name uniqueness
   - Check Google Play Console settings
   - Ensure all required permissions are declared

## 💰 Cost Breakdown

### Free Tier Limits
- **EAS Build**: Limited builds per month (free tier)
- **GitHub Pages**: Free for public repositories
- **GitHub Actions**: Free minutes for public repos

### Paid Requirements
- **Apple Developer**: $99/year for iOS App Store
- **Google Play Developer**: $25 one-time for Android Play Store
- **EAS Build**: Paid plans for more builds

## 🔄 Updating the App

### Version Updates
1. Update version in `app.json`
2. Update `buildNumber` (iOS) and `versionCode` (Android)
3. Build new version
4. Submit to stores

### Automatic Updates (Expo Updates)
For non-store updates of JavaScript code:
```bash
# Install Expo Updates
npx expo install expo-updates

# Publish update
eas update --branch production --message "Bug fixes"
```

## 📚 Additional Resources

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://support.google.com/googleplay/android-developer/answer/9899234)

## 🆘 Support

For deployment issues:
1. Check this documentation
2. Review EAS build logs
3. Check GitHub Actions logs
4. Consult Expo documentation
5. Ask in Expo Discord/Forums

---

**Last Updated**: December 2024
**App Version**: 1.0.0