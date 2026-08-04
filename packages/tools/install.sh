#!/usr/bin/env bash

set -euo pipefail

dem_title "Developer CLI Tools & Utilities"

# 1. Add Kubernetes Repository
mkdir -p /usr/share/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | gpg --dearmor --yes -o /usr/share/keyrings/kubernetes-apt-keyring.gpg || true
echo "deb [signed-by=/usr/share/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" > /etc/apt/sources.list.d/kubernetes.list

dem_package_update

# 2. Install Developer CLI Tools
dem_package_install \
    gh \
    kubectl \
    helm \
    terraform

# 3. Install Terminal Utilities
dem_package_install \
    htop \
    btop \
    fastfetch \
    ncdu \
    ripgrep \
    fd-find \
    fzf \
    bat \
    eza

dem_success "Developer CLI Tools & Utilities installed."
