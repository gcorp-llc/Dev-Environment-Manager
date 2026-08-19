#!/usr/bin/env bash
set -euo pipefail
dem_title "Install ScyllaDB"

dem_require_root

readonly SCYLLA_KEYRING="/etc/apt/keyrings/scylladb.gpg"
readonly SCYLLA_SOURCE="/etc/apt/sources.list.d/scylla.list"
readonly SCYLLA_REPOSITORY_URL="https://downloads.scylladb.com/deb/debian/scylla-2026.2.list"
readonly SCYLLA_KEY_ID="c503c686b007f39e"

# 1. Check if ScyllaDB is already installed
if dem_command_exists scylla && [[ -f "$SCYLLA_KEYRING" && -f "$SCYLLA_SOURCE" ]]; then
    dem_info "ScyllaDB is already installed and repository is configured."
    dem_success "ScyllaDB installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 2. Debian 13 Compatibility Check and Version Policy
if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    source /etc/os-release
fi

if [[ "${VERSION_CODENAME:-}" == "trixie" || "${VERSION_ID:-}" == "13" ]]; then
    DEM_ALLOW_UNSUPPORTED_SCYLLA="${DEM_ALLOW_UNSUPPORTED_SCYLLA:-false}"
    if [[ "$DEM_ALLOW_UNSUPPORTED_SCYLLA" != "true" ]]; then
        dem_error "ScyllaDB does not natively support Debian 13 (trixie) yet."
        dem_error "To override this limitation and fallback to Debian 12 (bookworm) compatibility mode, please set DEM_ALLOW_UNSUPPORTED_SCYLLA=true"
        exit "${DEM_EXIT_PREREQ_MISSING:-2}"
    else
        dem_warning "ScyllaDB is running via Debian 12 (bookworm) packages on Debian 13 as an explicitly opted-in compatibility fallback. Not officially supported by ScyllaDB upstream as of this release."
    fi
fi

# 3. Dry-Run Handling
if dem_is_dry_run; then
    dem_dry_run_log "Configuring ScyllaDB GPG keyring in $SCYLLA_KEYRING"
    dem_dry_run_log "Configuring ScyllaDB APT sources in $SCYLLA_SOURCE"
    dem_package_update
    dem_package_install scylla
    dem_success "ScyllaDB installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

mkdir -p /etc/apt/keyrings
chmod 0755 /etc/apt/keyrings

dem_info "Installing ScyllaDB repository signing key..."

if [[ ! -s "$SCYLLA_KEYRING" ]]; then
    tmp_key="$(mktemp)"
    trap 'rm -f "$tmp_key"' EXIT

    gpg \
        --homedir /tmp \
        --no-default-keyring \
        --keyring "$tmp_key" \
        --keyserver hkp://keyserver.ubuntu.com:80 \
        --recv-keys "$SCYLLA_KEY_ID"

    gpg \
        --homedir /tmp \
        --no-default-keyring \
        --keyring "$tmp_key" \
        --export --armor "$SCYLLA_KEY_ID" |
        gpg --dearmor --yes -o "$SCYLLA_KEYRING"

    chmod 0644 "$SCYLLA_KEYRING"
fi

dem_info "Installing ScyllaDB APT repository..."

tmp_source="$(mktemp)"
trap 'rm -f "$tmp_source"' EXIT

curl \
    --fail \
    --silent \
    --show-error \
    --location \
    --output "$tmp_source" \
    "$SCYLLA_REPOSITORY_URL"

# Write a header comment for tracking and auditing purposes
{
    echo "# ScyllaDB Repository Configuration"
    if [[ "${VERSION_CODENAME:-}" == "trixie" ]]; then
        echo "# FALLBACK: Debian 12 (bookworm) compatibility fallback enabled on Debian 13 (trixie)"
    fi
    cat "$tmp_source"
} > "$tmp_source.tmp"

install -m 0644 "$tmp_source.tmp" "$SCYLLA_SOURCE"

dem_info "Updating APT metadata..."
dem_package_update

dem_info "Installing ScyllaDB..."
dem_package_install scylla

dem_success "ScyllaDB installation completed."
