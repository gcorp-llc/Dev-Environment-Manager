dem_package_update() {

    if [[ "${DEM_DRY_RUN:-false}" == "true" ]]; then
        dem_dry_run_log "apt update"
        return 0
    fi

    apt update

}

dem_package_upgrade() {

    if [[ "${DEM_DRY_RUN:-false}" == "true" ]]; then
        dem_dry_run_log "apt upgrade -y"
        return 0
    fi

    apt upgrade -y

}

dem_package_install() {

    local package

    for package in "$@"; do

        if dpkg -s "$package" >/dev/null 2>&1; then

            dem_success "$package already installed"
        else
            if [[ "${DEM_DRY_RUN:-false}" == "true" ]]; then
                dem_dry_run_log "apt install -y $package"
            else
                dem_info "Installing $package"
                apt install -y "$package"
            fi
        fi

    done

}

dem_package_remove() {

    local package

    for package in "$@"; do

        if dpkg -s "$package" >/dev/null 2>&1; then
            if [[ "${DEM_DRY_RUN:-false}" == "true" ]]; then
                dem_dry_run_log "apt remove -y $package"
            else
                dem_info "Removing $package"
                apt remove -y "$package"
            fi
        fi

    done

}

dem_package_autoremove() {

    if [[ "${DEM_DRY_RUN:-false}" == "true" ]]; then
        dem_dry_run_log "apt autoremove -y"
        return 0
    fi

    apt autoremove -y

}

dem_package_clean() {

    if [[ "${DEM_DRY_RUN:-false}" == "true" ]]; then
        dem_dry_run_log "apt autoclean && apt clean"
        return 0
    fi

    apt autoclean
    apt clean

}
