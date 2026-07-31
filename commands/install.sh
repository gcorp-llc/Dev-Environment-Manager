#!/usr/bin/env bash

dem_command_install() {

    local profile="${1:-desktop}"

    dem_validate_environment
    dem_validate_root

    dem_title "Updating Package Index"

    dem_package_update

    dem_title "Installing Profile: $profile"

    case "$profile" in

        desktop)

            source "$DEM_PACKAGE_DIR/core/install.sh"
            source "$DEM_PACKAGE_DIR/development/install.sh"
            source "$DEM_PACKAGE_DIR/docker/install.sh"
            source "$DEM_PACKAGE_DIR/database/install.sh"
            source "$DEM_PACKAGE_DIR/office/install.sh"
            source "$DEM_PACKAGE_DIR/fonts/install.sh"
            source "$DEM_PACKAGE_DIR/utilities/install.sh"
            ;;

        server)

            source "$DEM_PACKAGE_DIR/core/install.sh"
            source "$DEM_PACKAGE_DIR/development/install.sh"
            source "$DEM_PACKAGE_DIR/docker/install.sh"
            source "$DEM_PACKAGE_DIR/database/install.sh"
            source "$DEM_PACKAGE_DIR/security/install.sh"
            source "$DEM_PACKAGE_DIR/monitoring/install.sh"
            source "$DEM_PACKAGE_DIR/utilities/install.sh"
            ;;

        minimal)

            source "$DEM_PACKAGE_DIR/core/install.sh"
            source "$DEM_PACKAGE_DIR/utilities/install.sh"
            ;;

        *)

            dem_fatal "Unknown profile: $profile"
            ;;

    esac

    dem_success "Installation completed."

}