#!/usr/bin/env bash

dem_title "Flutter"

if dem_command_exists flutter; then
    dem_success "Flutter already installed."
    return
fi

mkdir -p /opt

git clone https://github.com/flutter/flutter.git /opt/flutter

ln -sf /opt/flutter/bin/flutter /usr/local/bin/flutter

flutter config --no-analytics

flutter doctor

dem_success "Flutter installed."