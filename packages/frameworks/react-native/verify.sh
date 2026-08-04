#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify React Native & Expo Development Environment"

# Verify all mandatory commands are present
dem_require_command node
dem_require_command npm
dem_require_command pnpm
dem_require_command yarn
dem_require_command npx
dem_require_command expo
dem_require_command eas
dem_require_command adb
dem_require_command fastboot
dem_require_command java

# Check versions for robust validation
node --version
npm --version
pnpm --version
yarn --version
expo --version
eas --version
adb --version
fastboot --version
java -version

dem_success "React Native and Expo development environment successfully verified."
