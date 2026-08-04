#!/usr/bin/env bash

set -euo pipefail

dem_title "Core"

# 1. Base Debian preparation & certificates
# Ensure keyrings directory exists
mkdir -p /usr/share/keyrings

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

# 3. Repository Configuration (Add third party official signed APT repositories for Debian 13 Trixie)
# Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor --yes -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list

# VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor --yes -o /usr/share/keyrings/packages.microsoft.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list

# NodeSource (Node.js)
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /usr/share/keyrings/nodesource.gpg
echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list

# PostgreSQL
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor --yes -o /usr/share/keyrings/postgresql.gpg
echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt trixie-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | gpg --dearmor --yes -o /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list

# HashiCorp (Terraform)
curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor --yes -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com/ trixie main" > /etc/apt/sources.list.d/hashicorp.list

# Helm
curl -fsSL https://baltocdn.com/helm/signing.asc | gpg --dearmor --yes -o /usr/share/keyrings/helm.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" > /etc/apt/sources.list.d/helm-stable-debian.list

# Update package lists with new repositories
dem_package_update

dem_success "Core base preparation, compilation dependencies, and repositories configured."
