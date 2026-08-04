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

# Remove sources files and keys
rm -f /etc/apt/sources.list.d/kubernetes.list
rm -f /etc/apt/keyrings/kubernetes-apt-keyring.gpg

rm -f /etc/apt/sources.list.d/github-cli.list
rm -f /etc/apt/keyrings/githubcli-archive-keyring.gpg

rm -f /etc/apt/sources.list.d/hashicorp.list
rm -f /etc/apt/keyrings/hashicorp-archive-keyring.gpg

rm -f /etc/apt/sources.list.d/helm-stable-debian.list
rm -f /etc/apt/keyrings/helm.gpg

dem_success "CLI Tools & Utilities uninstalled."
