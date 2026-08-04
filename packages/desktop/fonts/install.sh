#!/usr/bin/env bash

set -euo pipefail

dem_title "Desktop Fonts"

dem_package_install \
    fonts-firacode \
    fonts-hack-ttf \
    fonts-noto-core

dem_success "Desktop fonts installed."
