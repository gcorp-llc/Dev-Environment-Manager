#!/usr/bin/env bash
set -euo pipefail
dem_title "Uninstall Core"

dem_warning "Core contains shared Debian system dependencies."
dem_warning "Shared base packages will not be removed to protect system stability."

dem_success "Core uninstall completed safely. Shared Debian dependencies were preserved."
