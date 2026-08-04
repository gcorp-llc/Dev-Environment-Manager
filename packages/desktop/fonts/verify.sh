#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Desktop Fonts"

# Check if font paths exist or verify using fc-list
dem_require_command fc-list

if fc-list : family | grep -qi "Fira Code" || fc-list : family | grep -qi "FiraCode"; then
    dem_success "Fira Code font is available."
else
    dem_warning "Fira Code font could not be listed."
fi

dem_success "Desktop fonts verified."
