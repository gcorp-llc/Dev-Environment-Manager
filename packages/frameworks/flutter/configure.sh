#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Flutter SDK"

# Configure global system-wide PATH for Flutter
echo 'export PATH="$PATH:/opt/flutter/bin"' > /etc/profile.d/flutter.sh
chmod +x /etc/profile.d/flutter.sh

# Run basic pre-download/config
export PATH="$PATH:/opt/flutter/bin"
# Mark the flutter directory as safe in git to prevent security exceptions
git config --global --add safe.directory /opt/flutter || true
flutter precache || true

dem_success "Flutter SDK configured."
