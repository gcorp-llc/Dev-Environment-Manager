#!/usr/bin/env bash

set -euo pipefail

dem_title "Flutter SDK"

# Install Flutter dependencies
dem_package_install libglu1-mesa

FLUTTER_DIR="/opt/flutter"
if [[ ! -d "$FLUTTER_DIR" ]]; then
    dem_info "Downloading and installing Flutter SDK..."
    TMP_TAR="/tmp/flutter.tar.xz"
    curl -fsSL -o "$TMP_TAR" "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.22.0-stable.tar.xz" || wget -qO "$TMP_TAR" "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.22.0-stable.tar.xz"
    mkdir -p "$FLUTTER_DIR"
    # Extract to /opt (tar contains "flutter" directory)
    tar -xf "$TMP_TAR" -C /opt
    rm -f "$TMP_TAR"
fi

dem_success "Flutter SDK installed."
