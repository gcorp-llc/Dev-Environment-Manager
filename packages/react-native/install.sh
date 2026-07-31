#!/usr/bin/env bash

dem_title "React Native"

dem_package_install \
    default-jdk \
    adb \
    fastboot

npm install -g \
    react-native-cli \
    expo-cli \
    eas-cli

dem_success "React Native installed."