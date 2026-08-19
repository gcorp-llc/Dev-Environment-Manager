#!/usr/bin/env bash
set -euo pipefail
dem_title "PHP"

# 1. Idempotency Check: if php is already installed
if dem_command_exists php; then
    dem_info "PHP is already installed."
    dem_success "PHP installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 2. Dry-Run Handling
if dem_is_dry_run; then
    dem_package_update
    dem_package_install php-cli php-common php-mbstring php-xml php-curl php-zip php-gd php-mysql php-sqlite3
    dem_success "PHP installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 3. Installation via APT
dem_package_update
dem_package_install \
    php-cli \
    php-common \
    php-mbstring \
    php-xml \
    php-curl \
    php-zip \
    php-gd \
    php-mysql \
    php-sqlite3

dem_success "PHP and extensions installed."
