#!/usr/bin/env bash

set -euo pipefail

dem_title "Configure Laravel"

# Add Composer global bin directory to path globally
echo 'export PATH="$PATH:$HOME/.config/composer/vendor/bin:/root/.config/composer/vendor/bin"' > /etc/profile.d/composer.sh
chmod +x /etc/profile.d/composer.sh

dem_success "Laravel configured."
