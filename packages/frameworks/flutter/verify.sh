#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Flutter"

FLUTTER_ROOT="${FLUTTER_ROOT:-/opt/flutter}"

if dem_command_exists flutter; then
    flutter --version
elif [[ -x "$FLUTTER_ROOT/bin/flutter" ]]; then
    "$FLUTTER_ROOT/bin/flutter" --version
else
    dem_error "Flutter binary not found in PATH or at $FLUTTER_ROOT/bin/flutter."
    exit "${DEM_EXIT_ERROR:-1}"
fi

dem_success "Flutter verified."
