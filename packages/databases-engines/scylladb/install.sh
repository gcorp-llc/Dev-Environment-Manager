#!/usr/bin/env bash
set -euo pipefail

dem_title "Install ScyllaDB"

dem_require_root

readonly SCYLLA_KEYRING="/etc/apt/keyrings/scylladb.gpg"
readonly SCYLLA_SOURCE="/etc/apt/sources.list.d/scylla.list"
readonly SCYLLA_REPOSITORY_URL="https://downloads.scylladb.com/deb/debian/scylla-2026.2.list"
readonly SCYLLA_KEY_ID="c503c686b007f39e"

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

install -m 0644 "$tmp_source" "$SCYLLA_SOURCE"

dem_info "Updating APT metadata..."

dem_package_update

dem_info "Installing ScyllaDB..."

dem_package_install scylla

dem_success "ScyllaDB installation completed."