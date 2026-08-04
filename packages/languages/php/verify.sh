#!/usr/bin/env bash

set -euo pipefail

dem_title "Verify PHP"

dem_require_command php

php --version

# Verify some standard extensions are loaded
php -m | grep -qi "mbstring"
php -m | grep -qi "curl"
php -m | grep -qi "xml"

dem_success "PHP verified."
