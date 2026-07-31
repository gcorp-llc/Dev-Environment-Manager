#!/usr/bin/env bash

dem_title "Core"

dem_package_update

dem_package_install \
    apt-transport-https \
    ca-certificates \
    software-properties-common \
    gnupg \
    gnupg2 \
    dirmngr \
    lsb-release \
    debian-archive-keyring \
    curl \
    wget \
    git \
    unzip \
    zip \
    xz-utils \
    tar \
    gzip \
    bzip2 \
    p7zip-full \
    rsync \
    tree \
    file \
    less \
    nano \
    vim \
    build-essential \
    pkg-config \
    cmake \
    make \
    gcc \
    g++ \
    libc6-dev \
    linux-headers-amd64 \
    openssl \
    jq \
    yq \
    bash-completion \
    sudo \
    locales \
    tzdata \
    htop \
    btop \
    fastfetch \
    ncdu \
    ripgrep \
    fd-find \
    fzf \
    bat \
    eza

source "$DEM_PACKAGE_DIR/core/configure.sh"

source "$DEM_PACKAGE_DIR/core/verify.sh"

dem_success "Core installation completed."