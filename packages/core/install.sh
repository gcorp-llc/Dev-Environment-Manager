#!/usr/bin/env bash

set -euo pipefail

dem_title "Core"

# 1. Base Debian preparation & certificates
# Ensure modern keyrings directory exists
mkdir -p /etc/apt/keyrings

# Install core/base utilities
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
    rsync

# 2. Compilation dependencies
dem_package_install \
    build-essential \
    pkg-config \
    cmake \
    make \
    gcc \
    g++ \
    libc6-dev \
    linux-headers-amd64 \
    openssl

dem_success "Core base preparation and compilation dependencies configured."
