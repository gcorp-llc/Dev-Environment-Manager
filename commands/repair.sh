#!/usr/bin/env bash

set -euo pipefail

dem_command_repair() {

    dem_validate_root

    dem_title "Repair"

    dpkg --configure -a

    apt --fix-broken install -y

    apt update

    dem_success "Repair completed."

}
