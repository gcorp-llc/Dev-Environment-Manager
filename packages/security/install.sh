#!/usr/bin/env bash

dem_title "Security"

dem_package_install \
    openssh-server \
    fail2ban \
    ufw \
    gnupg \
    openssl \
    ca-certificates

dem_service_enable ssh

dem_service_enable fail2ban

dem_service_start ssh

dem_service_start fail2ban