#!/usr/bin/env bash

dem_title "DevOps Tools"

if ! dem_command_exists kubectl; then

    curl -fsSLo /usr/local/bin/kubectl \
        "https://dl.k8s.io/release/$(curl -fsSL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

    chmod +x /usr/local/bin/kubectl

fi

if ! dem_command_exists helm; then

    curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

fi

if ! dem_command_exists terraform; then

    wget -qO- https://apt.releases.hashicorp.com/gpg \
        | gpg --dearmor \
        -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
        > /etc/apt/sources.list.d/hashicorp.list

    apt update

    apt install -y terraform

fi

dem_success "DevOps tools installed."