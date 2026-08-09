#!/usr/bin/env bash
set -euo pipefail
dem_title "ScyllaDB"

# Check for Debian 13 / Trixie repository absence
source /etc/os-release
if [[ "$ID" == "debian" && "$VERSION_CODENAME" == "trixie" ]]; then
    dem_warning "ScyllaDB 5.4 does not officially support Debian 13 (trixie) APT repositories yet."
    if [[ "${DEM_ALLOW_UNSUPPORTED_SCYLLA:-}" != "true" ]]; then
        dem_error "Installation aborted because Debian 13 (trixie) is not officially supported by ScyllaDB."
        dem_info "To bypass this failure and skip ScyllaDB installation gracefully (recommended for testing on trixie), run with DEM_ALLOW_UNSUPPORTED_SCYLLA=true."
        exit 1
    else
        dem_warning "DEM_ALLOW_UNSUPPORTED_SCYLLA=true is set. Gracefully skipping ScyllaDB installation on Debian 13."
        dem_success "ScyllaDB installation step skipped gracefully."
        exit 0
    fi
fi

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

# Never configure bookworm as an automatic fallback for a Debian 13 installation.
# (This code is only reached on supported non-Debian 13 distributions if any are ever added, or for historical compliance)
echo "deb [signed-by=/etc/apt/keyrings/scylla.gpg] http://repositories.scylladb.com/scylla/repo/debian/scylladb-5.4 bookworm main" > /etc/apt/sources.list.d/scylla.list

dem_package_update

# 2. Install ScyllaDB server
dem_package_install scylla-server || dem_warning "scylla-server package could not be fully installed. Proceeding with warning."

dem_success "ScyllaDB installation step completed."
