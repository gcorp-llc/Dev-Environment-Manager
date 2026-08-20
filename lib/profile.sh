dem_profile_exists() {

    [[ -f "$DEM_PROFILE_DIR/$1.profile" ]]

}

dem_profile_load() {

    dem_profile_exists "$1" || dem_fatal "Profile not found: $1"

    source "$DEM_PROFILE_DIR/$1.profile"

}

dem_profile_list() {

    find "$DEM_PROFILE_DIR" \
        -type f \
        -name "*.profile" \
        -exec basename {} .profile \;

}

dem_profile_apply() {

    local profile="$1"

    dem_validate_environment
    dem_validate_root

    dem_title "Applying Profile: $profile"

    dem_profile_load "$profile"

    dem_title "Updating Package Index"

    dem_package_update

    dem_title "Executing Profile Lifecycle (Install -> Configure -> Verify): $profile"

    for module in "${DEM_MODULES[@]}"; do
        dem_info "Installing Module: $module"
        source "$DEM_PACKAGE_DIR/$module/install.sh"

        dem_info "Configuring Module: $module"
        source "$DEM_PACKAGE_DIR/$module/configure.sh"

        dem_info "Verifying Module: $module"
        source "$DEM_PACKAGE_DIR/$module/verify.sh"
    done

    dem_success "Profile applied successfully: $profile."

}
