#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Office"

dem_require_command libreoffice
dem_require_command evince

# Verify packages are installed
dpkg -s libreoffice >/dev/null
dpkg -s evince >/dev/null

dem_success "Office applications verified."
