#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$ROOT/config.sh"

source "$ROOT/lib/colors.sh"
source "$ROOT/lib/logger.sh"
source "$ROOT/lib/ui.sh"
source "$ROOT/lib/utils.sh"
source "$ROOT/lib/checks.sh"
source "$ROOT/lib/packages.sh"
source "$ROOT/lib/docker.sh"
source "$ROOT/lib/network.sh"
source "$ROOT/lib/filesystem.sh"
source "$ROOT/lib/profile.sh"
source "$ROOT/lib/services.sh"
source "$ROOT/lib/validation.sh"
