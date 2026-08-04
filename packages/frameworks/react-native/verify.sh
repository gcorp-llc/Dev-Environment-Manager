#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify React Native"

dem_require_command adb
dem_require_command fastboot
dem_require_command npm

# Check adb and fastboot versions
adb --version
fastboot --version

dem_success "React Native tools verified."
