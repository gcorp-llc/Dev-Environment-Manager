#!/usr/bin/env bash

dem_title "Android Development"

dem_package_install \
    adb \
    fastboot \
    default-jdk \
    gradle

dem_success "Android development tools installed."