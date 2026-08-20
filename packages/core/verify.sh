#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify Core"

if dem_is_dry_run; then
    dem_dry_run_log "Verifying Core build tools, compression utilities, network tools, and Debian 13 platform requirements"
    dem_success "Core verification simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

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
if dem_command_exists 7z || dem_command_exists 7zr || dem_command_exists 7za; then
    dem_success "7z utility is available."
else
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Missing command: 7z"
fi
dem_require_command xz
dem_require_command rsync

if [[ ! -d /etc/apt/keyrings ]]; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "APT keyrings directory is missing: /etc/apt/keyrings"
fi

if [[ ! -r /etc/debian_version ]]; then
    dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Debian version information is unavailable."
fi

if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC1091
    source /etc/os-release

    if [[ "${ID:-}" != "debian" ]]; then
        dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Core requires Debian platform."
    fi

    if [[ "${VERSION_CODENAME:-}" != "trixie" && "${VERSION_ID:-}" != "13" ]]; then
        dem_fatal_code "${DEM_EXIT_PREREQ_MISSING:-2}" "Core requires Debian 13 (trixie). Detected: ${VERSION_CODENAME:-unknown}"
    fi
fi

dem_success "Core verification completed."
