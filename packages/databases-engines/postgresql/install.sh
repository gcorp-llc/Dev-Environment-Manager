#!/usr/bin/env bash

set -euo pipefail

dem_title "PostgreSQL"

# We already configured pgdg repo in core, so this will fetch postgresql
dem_package_install postgresql postgresql-contrib

dem_success "PostgreSQL installed."
