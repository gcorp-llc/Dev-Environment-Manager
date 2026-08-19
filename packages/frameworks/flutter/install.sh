#!/usr/bin/env bash
set -euo pipefail
dem_title "Flutter"

FLUTTER_ROOT="${FLUTTER_ROOT:-/opt/flutter}"

# 1. Prerequisite Check: Flutter requires git, curl, unzip, tar, xz-utils
missing_prereqs=()
for cmd in git curl unzip tar xz; do
    if ! dem_command_exists "$cmd"; then
        missing_prereqs+=("$cmd")
    fi
done

if [[ ${#missing_prereqs[@]} -gt 0 ]]; then
    dem_error "Prerequisite missing for Flutter: ${missing_prereqs[*]} is/are required."
    exit "${DEM_EXIT_PREREQ_MISSING:-2}"
fi

# 2. Idempotency Check
if dem_command_exists flutter || [[ -x "$FLUTTER_ROOT/bin/flutter" ]]; then
    dem_info "Flutter SDK is already installed at $FLUTTER_ROOT."
    dem_success "Flutter installation check passed (no reinstall needed)."
    exit "${DEM_EXIT_SKIP_ALREADY_INSTALLED:-3}"
fi

# 3. Dry-Run Handling
if dem_is_dry_run; then
    dem_dry_run_log "Cloning Flutter SDK repository into $FLUTTER_ROOT"
    dem_dry_run_log "Setting ownership and permissions on $FLUTTER_ROOT"
    dem_success "Flutter installation simulated."
    exit "${DEM_EXIT_SUCCESS:-0}"
fi

# 4. Installation
dem_info "Installing Flutter SDK to $FLUTTER_ROOT..."
git clone https://github.com/flutter/flutter.git -b stable "$FLUTTER_ROOT" --depth 1

# Ensure permissions
chmod -R 755 "$FLUTTER_ROOT"

dem_success "Flutter SDK installed successfully."
