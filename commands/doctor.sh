#!/usr/bin/env bash

set -euo pipefail

dem_command_doctor() {

    dem_banner

    dem_title "System Diagnostics"

    dem_check_debian \
        && dem_success "Debian" \
        || dem_error "Debian"

    dem_check_network \
        && dem_success "Internet" \
        || dem_error "Internet"

    dem_check_apt \
        && dem_success "APT" \
        || dem_error "APT"

    dem_check_systemd \
        && dem_success "Systemd" \
        || dem_error "Systemd"

    dem_check_git \
        && dem_success "Git" \
        || dem_warning "Git"

    dem_check_docker \
        && dem_success "Docker" \
        || dem_warning "Docker"

    dem_check_node \
        && dem_success "Node.js" \
        || dem_warning "Node.js"

    dem_check_php \
        && dem_success "PHP" \
        || dem_warning "PHP"

    dem_check_composer \
        && dem_success "Composer" \
        || dem_warning "Composer"

    dem_check_cargo \
        && dem_success "Rust" \
        || dem_warning "Rust"

    dem_check_go \
        && dem_success "Go" \
        || dem_warning "Go"

}
