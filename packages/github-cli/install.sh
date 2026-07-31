#!/usr/bin/env bash

dem_title "GitHub CLI"

if dem_command_exists gh; then
    dem_success "GitHub CLI already installed."
    return
fi

mkdir -p -m 755 /etc/apt/keyrings

wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg \
| tee /etc/apt/keyrings/githubcli-archive-keyring.gpg >/dev/null

chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
> /etc/apt/sources.list.d/github-cli.list

apt update

apt install -y gh

dem_success "GitHub CLI installed."