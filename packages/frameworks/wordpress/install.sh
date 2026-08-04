#!/usr/bin/env bash

set -euo pipefail

dem_title "WordPress Tools"

# Install WP-CLI (WordPress CLI)
if ! dem_command_exists wp; then
    dem_info "Downloading WP-CLI..."
    curl -fsSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp
    chmod +x /usr/local/bin/wp
fi

dem_success "WordPress development tools installed."
