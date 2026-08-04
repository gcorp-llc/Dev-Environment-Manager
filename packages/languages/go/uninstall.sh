#!/usr/bin/env bash

set -euo pipefail

dem_title "Uninstall Go"

dem_package_remove golang-go

dem_success "Go uninstalled."
