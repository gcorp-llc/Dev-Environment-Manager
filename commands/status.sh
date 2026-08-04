#!/usr/bin/env bash

set -euo pipefail

dem_command_status() {

    dem_banner

    echo

    if dem_check_network; then
        dem_success "Network"
    else
        dem_error "Network"
    fi

    if dem_check_git; then
        dem_success "Git"
    else
        dem_warning "Git"
    fi

    if dem_check_docker; then
        dem_success "Docker"
    else
        dem_warning "Docker"
    fi

    if dem_check_node; then
        dem_success "Node.js"
    else
        dem_warning "Node.js"
    fi

    if dem_check_php; then
        dem_success "PHP"
    else
        dem_warning "PHP"
    fi

    if dem_check_composer; then
        dem_success "Composer"
    else
        dem_warning "Composer"
    fi

    if dem_check_cargo; then
        dem_success "Rust"
    else
        dem_warning "Rust"
    fi

    if dem_check_go; then
        dem_success "Go"
    else
        dem_warning "Go"
    fi

}
