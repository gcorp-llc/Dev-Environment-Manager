#!/usr/bin/env bash
set -euo pipefail
dem_title "React Native & Expo Tools"

# 1. Prerequisite Check: React Native depends on node and npm
if ! dem_command_exists node || ! dem_command_exists npm; then
    dem_error "Prerequisite missing: Node.js and npm are required. Please install Node.js first."
    exit "${DEM_EXIT_PREREQ_MISSING:-2}"
fi

# 2. Idempotency Check: check ifexpo, eas, yarn, pnpm and android tools exist
if dem_command_exists expo && dem_command_exists eas && dem_command_exists yarn && dem_command_exists pnpm && dem_command_exists adb; then
    dem_info "React Native & Expo tooling is already installed."
    dem_success "React Native installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 3. Dry-Run Handling
if dem_is_dry_run; then
    dem_package_update
    dem_package_install default-jdk-headless adb fastboot
    dem_dry_run_log "npm install -g yarn pnpm expo-cli @expo/cli eas-cli"
    dem_success "React Native & Expo tools installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 4. Installation
dem_package_update
dem_package_install default-jdk-headless adb fastboot

if ! dem_command_exists yarn; then
    npm install -g yarn
fi
if ! dem_command_exists pnpm; then
    npm install -g pnpm
fi
if ! dem_command_exists expo; then
    npm install -g expo-cli @expo/cli
fi
if ! dem_command_exists eas; then
    npm install -g eas-cli
fi

dem_success "React Native & Expo preparation completed."
