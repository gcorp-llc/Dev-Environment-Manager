#!/usr/bin/env bash

dem_title "Laravel"

dem_package_install \
    php \
    php-cli \
    php-fpm \
    php-curl \
    php-mbstring \
    php-xml \
    php-zip \
    php-bcmath \
    php-pgsql \
    composer

if ! composer global show laravel/installer >/dev/null 2>&1; then
    composer global require laravel/installer
fi

dem_success "Laravel installed."