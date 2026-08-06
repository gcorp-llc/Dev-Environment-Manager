#!/usr/bin/env bash
set -euo pipefail
dem_title "Configure Development"

# Enable bash-completion for all users if needed
if [[ -f /etc/bash.bashrc ]] && ! grep -q "bash_completion" /etc/bash.bashrc; then
    cat << 'EOF' >> /etc/bash.bashrc

# Enable bash completion
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi
EOF
fi

dem_success "Development utilities configured."
