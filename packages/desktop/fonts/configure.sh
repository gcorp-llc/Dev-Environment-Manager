#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Desktop Fonts"

# Run fc-cache to update font caches
fc-cache -fv || true

dem_success "Desktop fonts configured."
