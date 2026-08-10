#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Redpanda"

if dem_command_exists rpk; then
    dem_info "Setting Redpanda mode to dev and bootstrapping..."
    rpk redpanda mode dev || true
    rpk redpanda config bootstrap --self localhost --default || true
    rpk redpanda tune all || true
fi

dem_service_enable redpanda || true
dem_service_start redpanda || true

dem_success "Redpanda configured and started."
