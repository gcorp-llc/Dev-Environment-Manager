#!/usr/bin/env bash
set -euo pipefail
dem_title "Development"

dem_package_install \
    jq \
    bash-completion \
    tree \
    file \
    less \
    nano \
    vim

dem_success "Development utilities installed."
