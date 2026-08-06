#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Laravel"

dem_require_command composer

# Verify composer is working
composer --version

# Verify PATH configuration
if [[ -f /etc/profile.d/composer.sh ]]; then
    dem_success "Composer global bin PATH configuration exists."
else
    dem_fatal "Composer global bin PATH configuration is missing."
fi

dem_success "Laravel verification completed."
