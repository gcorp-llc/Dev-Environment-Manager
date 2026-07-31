#!/usr/bin/env bash

dem_title "Meilisearch"

if dem_command_exists meilisearch; then
    dem_success "Meilisearch already installed."
    return
fi

curl -fsSL https://install.meilisearch.com | sh

mv ./meilisearch /usr/local/bin/

chmod +x /usr/local/bin/meilisearch

dem_success "Meilisearch installed."