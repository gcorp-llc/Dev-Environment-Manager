#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify Node.js"

dem_require_command node
dem_require_command npm

node --version
npm --version

dem_success "Node.js verified."
