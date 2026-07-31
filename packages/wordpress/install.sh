#!/usr/bin/env bash

dem_title "WordPress Development"

dem_package_install \
    mariadb-server \
    mariadb-client \
    apache2 \
    libapache2-mod-php

systemctl enable mariadb
systemctl start mariadb

systemctl enable apache2
systemctl start apache2

dem_success "WordPress environment installed."