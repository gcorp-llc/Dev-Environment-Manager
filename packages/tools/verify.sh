#!/usr/bin/env bash
set -euo pipefail
dem_title "Verify CLI Tools & Utilities"

dem_require_command gh
dem_require_command kubectl
dem_require_command helm
dem_require_command terraform
dem_require_command htop
dem_require_command btop
dem_require_command fastfetch
dem_require_command ncdu
dem_require_command ripgrep
dem_require_command fzf

# Check for fd-find / fd and batcat / bat
if dem_command_exists fd || dem_command_exists fdfind; then
    dem_success "fd/fdfind utility is available."
else
    dem_fatal "fd/fdfind utility is missing."
fi

if dem_command_exists bat || dem_command_exists batcat; then
    dem_success "bat/batcat utility is available."
else
    dem_fatal "bat/batcat utility is missing."
fi

# Verify versions
gh --version
kubectl version --client
helm version
terraform -version

dem_success "CLI Tools & Utilities verified."
