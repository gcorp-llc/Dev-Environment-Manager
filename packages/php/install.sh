#!/usr/bin/env bash

dem_title "PHP"

apt install -y \
php \
php-cli \
php-fpm \
php-common \
php-mysql \
php-pgsql \
php-sqlite3 \
php-curl \
php-gd \
php-intl \
php-mbstring \
php-xml \
php-zip \
php-bcmath \
php-soap \
php-imagick \
composer

dem_success "PHP installed."