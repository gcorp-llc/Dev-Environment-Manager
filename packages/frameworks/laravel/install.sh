#!/usr/bin/env bash

set -euo pipefail

dem_title "Laravel Tools"

# Install Composer globally
if ! dem_command_exists composer; then
    dem_info "Downloading Composer..."
    curl -fsSL https://getcomposer.org/composer-stable.phar -o /usr/local/bin/composer
    chmod +x /usr/local/bin/composer
fi

# We can also install composer package from apt if wanted, but downloading phar is extremely robust.
dem_success "Composer / Laravel preparation completed."
