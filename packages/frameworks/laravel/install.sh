#!/usr/bin/env bash
set -euo pipefail
dem_title "Laravel Tools"

# 1. Prerequisite Check: Laravel depends on php and composer
if ! dem_command_exists php; then
    dem_error "Prerequisite missing: PHP is not installed. Please install PHP first."
    exit "${DEM_EXIT_PREREQ_MISSING:-2}"
fi

# 2. Idempotency Check: if composer is already installed
if dem_command_exists composer; then
    dem_info "Composer / Laravel tooling is already installed."
    dem_success "Laravel tooling installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 3. Dry-Run Handling
if dem_is_dry_run; then
    dem_dry_run_log "Downloading Composer binary from https://getcomposer.org/composer-stable.phar to /usr/local/bin/composer"
    dem_success "Laravel tools installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 4. Install Composer globally
dem_info "Downloading Composer..."
curl -fsSL https://getcomposer.org/composer-stable.phar -o /usr/local/bin/composer
chmod +x /usr/local/bin/composer

dem_success "Composer / Laravel preparation completed."
