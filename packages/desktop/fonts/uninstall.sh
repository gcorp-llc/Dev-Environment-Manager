#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Desktop Fonts"

dem_package_remove \
    fonts-firacode \
    fonts-hack-ttf \
    fonts-noto-core

fc-cache -fv || true

dem_success "Desktop fonts uninstalled."
