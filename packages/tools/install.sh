#!/usr/bin/env bash

dem_title "Developer Tools"

dem_package_install \
    git \
    curl \
    wget \
    jq \
    yq \
    unzip \
    zip \
    p7zip-full \
    ripgrep \
    fd-find \
    fzf \
    tmux \
    screen \
    tree \
    htop \
    btop \
    ncdu \
    sqlite3

dem_success "Developer tools installed."