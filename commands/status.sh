#!/usr/bin/env bash
set -euo pipefail

dem_command_status() {

    local profile="${1:-desktop}"

    dem_command_verify "$profile"

}
