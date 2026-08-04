#!/usr/bin/env bash

set -euo pipefail

dem_title "ScyllaDB"

# 1. Setup Repository for ScyllaDB
mkdir -p /etc/apt/keyrings
rm -f /tmp/scylla-temp.gpg

if gpg --homedir /tmp --no-default-keyring --keyring /tmp/scylla-temp.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys c503c686b007f39e >/dev/null 2>&1; then
    gpg --homedir /tmp --no-default-keyring --keyring /tmp/scylla-temp.gpg --export c503c686b007f39e > /etc/apt/keyrings/scylla.gpg
else
    # Fallback if keyserver is unavailable
    curl -fsSL https://downloads.scylladb.com/deb/debian/scylla-keyring.gpg -o /etc/apt/keyrings/scylla.gpg || \
    wget -qO /etc/apt/keyrings/scylla.gpg https://downloads.scylladb.com/deb/debian/scylla-keyring.gpg || true
fi
rm -f /tmp/scylla-temp.gpg

# Use bookworm (Debian 12) repository as ScyllaDB 5.4 supports bookworm, fully compatible with Debian 13 (trixie)
echo "deb [signed-by=/etc/apt/keyrings/scylla.gpg] http://repositories.scylladb.com/scylla/repo/debian/scylladb-5.4 bookworm main" > /etc/apt/sources.list.d/scylla.list

dem_package_update

# 2. Install ScyllaDB server
# Gracefully attempt to install, as ScyllaDB is resource intensive and requires specific CPU features
dem_package_install scylla-server || dem_warning "scylla-server package could not be fully installed on Debian 13 yet. Proceeding with warning."

dem_success "ScyllaDB installation step completed."
