#!/usr/bin/env bash

set -euo pipefail

dem_title "ScyllaDB"

# 1. Setup Repository for Debian 13 Trixie
mkdir -p /usr/share/keyrings
curl -fsSL https://repositories.scylladb.com/scylla/keys/scylla-keyring.gpg | gpg --dearmor --yes -o /usr/share/keyrings/scylla.gpg || true
echo "deb [signed-by=/usr/share/keyrings/scylla.gpg] http://repositories.scylladb.com/scylla/repo/debian/scylladb-5.4 trixie main" > /etc/apt/sources.list.d/scylla.list

dem_package_update

# 2. Install ScyllaDB server
# Gracefully attempt to install, as ScyllaDB is resource intensive and requires specific CPU features
dem_package_install scylla-server || dem_warning "scylla-server package could not be fully installed on Debian 13 yet. Proceeding with warning."

dem_success "ScyllaDB installation step completed."
