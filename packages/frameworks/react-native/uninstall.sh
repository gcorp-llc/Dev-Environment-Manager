#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall React Native"

dem_package_remove adb fastboot

dem_success "React Native tools uninstalled."
