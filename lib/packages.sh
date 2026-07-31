#!/usr/bin/env bash

dem_package_update() {

    apt update

}

dem_package_upgrade() {

    apt upgrade -y

}

dem_package_install() {

    local package

    for package in "$@"; do

        if dpkg -s "$package" >/dev/null 2>&1; then

            dem_success "$package already installed"
        else
            dem_info "Installing $package"
            apt install -y "$package"
        fi

    done

}

dem_package_remove() {

    local package

    for package in "$@"; do

        if dpkg -s "$package" >/dev/null 2>&1; then
            dem_info "Removing $package"
            apt remove -y "$package"
        fi

    done

}

dem_package_autoremove() {

    apt autoremove -y

}

dem_package_clean() {

    apt autoclean
    apt clean

}