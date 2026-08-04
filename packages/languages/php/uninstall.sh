#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall PHP"

dem_package_remove \
    php-cli \
    php-common \
    php-mbstring \
    php-xml \
    php-curl \
    php-zip \
    php-gd \
    php-mysql \
    php-sqlite3

dem_success "PHP and extensions uninstalled."
