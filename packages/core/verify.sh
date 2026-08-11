#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Core"

dem_require_command apt-get
dem_require_command git
dem_require_command curl
dem_require_command wget
dem_require_command gcc
dem_require_command g++
dem_require_command make
dem_require_command cmake
dem_require_command pkg-config
dem_require_command openssl
dem_require_command unzip
dem_require_command zip
dem_require_command tar
dem_require_command gzip
dem_require_command bzip2
dem_require_command 7z
dem_require_command xz
dem_require_command rsync

if [[ ! -d /etc/apt/keyrings ]]; then
    dem_error "APT keyrings directory is missing: /etc/apt/keyrings"
    exit 1
fi

if [[ ! -r /etc/debian_version ]]; then
    dem_error "Debian version information is unavailable."
    exit 1
fi

if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC1091
    source /etc/os-release

    if [[ "${ID:-}" != "debian" ]]; then
        dem_error "Core requires Debian."
        exit 1
    fi

    if [[ "${VERSION_CODENAME:-}" != "trixie" ]]; then
        dem_error "Core requires Debian 13 (trixie). Detected: ${VERSION_CODENAME:-unknown}"
        exit 1
    fi
fi

dem_success "Core verification completed."
