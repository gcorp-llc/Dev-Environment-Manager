#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall CLI Tools & Utilities"

# Remove symlinks
rm -f /usr/local/bin/fd
rm -f /usr/local/bin/bat

dem_package_remove \
    gh \
    kubectl \
    helm \
    terraform \
    htop \
    btop \
    fastfetch \
    ncdu \
    ripgrep \
    fd-find \
    fzf \
    bat \
    eza

# Remove sources file
rm -f /etc/apt/sources.list.d/kubernetes.list

dem_success "CLI Tools & Utilities uninstalled."
