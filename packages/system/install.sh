#!/usr/bin/env bash
set -euo pipefail
dem_title "System"

# Install locales and tzdata
dem_package_install locales tzdata sudo

dem_success "System base packages installed."
