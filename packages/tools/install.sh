#!/usr/bin/env bash
set -euo pipefail
dem_title "Developer CLI Tools & Utilities"

# 1. Add Third Party Repositories for Tools
mkdir -p /etc/apt/keyrings

# Kubernetes CLI Repository
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | gpg --dearmor --yes -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg || true
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" > /etc/apt/sources.list.d/kubernetes.list

# GitHub CLI Repository (This is already a binary keyring, download directly)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list

# HashiCorp (Terraform) Repository
curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com/ trixie main" > /etc/apt/sources.list.d/hashicorp.list

# Helm Repository
curl -fsSL https://baltocdn.com/helm/signing.asc | gpg --dearmor --yes -o /etc/apt/keyrings/helm.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" > /etc/apt/sources.list.d/helm-stable-debian.list

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
