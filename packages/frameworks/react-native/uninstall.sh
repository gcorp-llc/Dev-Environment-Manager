#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall React Native"

# Remove global npm packages if npm is present
if dem_command_exists npm; then
    npm uninstall -g eas-cli || true
    npm uninstall -g expo-cli @expo/cli || true
    npm uninstall -g pnpm || true
    npm uninstall -g yarn || true
fi

# Remove system packages (only those owned by this module)
dem_package_remove adb fastboot default-jdk-headless

dem_success "React Native tools uninstalled."
