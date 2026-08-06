#!/usr/bin/env bash
set -euo pipefail
dem_title "PHP"

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
