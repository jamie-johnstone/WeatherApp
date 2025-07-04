#!/bin/bash

# Weather App Build Script
# Usage: ./scripts/build.sh [platform] [profile]
# Example: ./scripts/build.sh ios production

set -e

# Default values
PLATFORM=${1:-"all"}
PROFILE=${2:-"preview"}

echo "🏗️  Building Weather App"
echo "Platform: $PLATFORM"
echo "Profile: $PROFILE"
echo "========================"

# Pre-build checks
echo "📋 Running pre-build checks..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Please install it:"
    echo "npm install -g @expo/eas-cli"
    exit 1
fi

# Check if logged in to Expo
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to Expo. Please run:"
    echo "eas login"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

# TypeScript check
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# Build based on platform
echo "🚀 Starting build..."

case $PLATFORM in
  ios)
    echo "Building for iOS..."
    eas build --profile $PROFILE --platform ios --non-interactive
    ;;
  android)
    echo "Building for Android..."
    eas build --profile $PROFILE --platform android --non-interactive
    ;;
  all)
    echo "Building for all platforms..."
    eas build --profile $PROFILE --platform all --non-interactive
    ;;
  web)
    echo "Building for web..."
    npm run build:web
    ;;
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: ios, android, all, web"
    exit 1
    ;;
esac

echo "✅ Build completed successfully!"
echo "Check your builds at: https://expo.dev"