#!/usr/bin/env bash
set -euo pipefail
dem_title "Core"

mkdir -p /etc/apt/keyrings

dem_package_update

dem_package_install \
    apt-transport-https \
    ca-certificates \
    gnupg \
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
