#!/usr/bin/env bash
set -euo pipefail
dem_title "React Native & Expo Tools"

# Ensure we have default OpenJDK installed for Android build tooling
dem_package_install default-jdk-headless adb fastboot

# Enable installing global packages to standard user directories or globally (handled safely)
# We will use standard npm global install for yarn, pnpm, expo-cli, eas-cli
if dem_command_exists npm; then
    dem_info "Installing global Node/Expo CLI packages..."
    # Install yarn and pnpm if they aren't available
    if ! dem_command_exists yarn; then
        npm install -g yarn
    fi
    if ! dem_command_exists pnpm; then
        npm install -g pnpm
    fi
    # Install expo-cli and eas-cli globally
    if ! dem_command_exists expo; then
        npm install -g expo-cli @expo/cli
    fi
    if ! dem_command_exists eas; then
        npm install -g eas-cli
    fi
fi

dem_success "React Native & Expo preparation completed."
