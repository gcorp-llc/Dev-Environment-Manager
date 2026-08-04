#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Flutter SDK"

# Ensure flutter command is in PATH or check the absolute path
if [[ -f /opt/flutter/bin/flutter ]]; then
    dem_success "Flutter executable exists."
else
    dem_fatal "Flutter executable is missing at /opt/flutter/bin/flutter"
fi

# Run flutter to verify SDK health
export PATH="$PATH:/opt/flutter/bin"
flutter --version

dem_success "Flutter SDK verification completed."
