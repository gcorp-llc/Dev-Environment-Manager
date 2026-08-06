#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure CLI Tools"

# Ensure fd-find has a softlink for 'fd' (Debian installs it as 'fdfind')
if ! dem_command_exists fd && dem_command_exists fdfind; then
    ln -sf "$(which fdfind)" /usr/local/bin/fd
fi

# Ensure bat has a softlink for 'bat' (Debian installs it as 'batcat')
if ! dem_command_exists bat && dem_command_exists batcat; then
    ln -sf "$(which batcat)" /usr/local/bin/bat
fi

dem_success "CLI Tools and Terminal Utilities configured."
