#!/usr/bin/env bash

dem_title "Visual Studio Code"

if dem_command_exists code; then
    dem_success "VS Code already installed."
    return
fi

mkdir -p /etc/apt/keyrings

curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
| gpg --dearmor \
-o /etc/apt/keyrings/packages.microsoft.gpg

chmod 644 /etc/apt/keyrings/packages.microsoft.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
> /etc/apt/sources.list.d/vscode.list

apt update

apt install -y code

dem_success "Visual Studio Code installed."