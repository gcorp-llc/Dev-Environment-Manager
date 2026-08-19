dem_check_debian() {

    if [[ -f /etc/os-release ]]; then
        # shellcheck disable=SC1091
        source /etc/os-release
        [[ "${ID:-}" == "debian" && ( "${VERSION_ID:-}" == "13" || "${VERSION_CODENAME:-}" == "trixie" ) ]]
    else
        false
    fi

}

dem_check_network() {

    ping -c1 -W2 1.1.1.1 >/dev/null 2>&1

}

dem_check_apt() {

    dem_command_exists apt

}

dem_check_systemd() {

    dem_command_exists systemctl

}

dem_check_docker() {

    dem_command_exists docker

}

dem_check_git() {

    dem_command_exists git

}

dem_check_node() {

    dem_command_exists node

}

dem_check_php() {

    dem_command_exists php

}

dem_check_composer() {

    dem_command_exists composer

}

dem_check_cargo() {

    dem_command_exists cargo

}

dem_check_go() {

    dem_command_exists go

}
