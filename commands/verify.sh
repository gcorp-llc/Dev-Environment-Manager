#!/usr/bin/env bash
set -euo pipefail

dem_command_verify() {

    local profile="${1:-desktop}"

    dem_validate_root

    dem_title "Verifying Profile: $profile"

    dem_profile_load "$profile"

    local total_count=0
    local ok_count=0
    local warn_count=0
    local fail_count=0

    for module in "${DEM_MODULES[@]}"; do
        total_count=$((total_count + 1))
        local verify_script="$DEM_PACKAGE_DIR/$module/verify.sh"

        if [[ ! -f "$verify_script" ]]; then
            dem_error "Module verification script not found: $module"
            fail_count=$((fail_count + 1))
            continue
        fi

        local module_status="OK"
        local output=""

        # Run verification in a subshell with set +e to capture output and exit status without crashing scanner
        set +e
        output=$(
            source "$verify_script" 2>&1
        )
        local exit_code=$?
        set -e

        if [[ $exit_code -eq 0 ]]; then
            if echo "$output" | grep -qi "\[WARN\]"; then
                module_status="WARN"
                warn_count=$((warn_count + 1))
                dem_warning "Module [$module]: WARN"
            else
                ok_count=$((ok_count + 1))
                dem_success "Module [$module]: OK"
            fi
        else
            module_status="FAIL"
            fail_count=$((fail_count + 1))
            dem_error "Module [$module]: FAIL"
        fi

        # Print details if dry-run or if output has non-empty error/info context
        if [[ -n "$output" ]]; then
            while IFS= read -r line; do
                echo "    $line"
            done <<< "$output"
        fi
        echo
    done

    dem_line
    printf "Verification Summary for profile '%s':\n" "$profile"
    printf " Total Modules: %d\n" "$total_count"
    printf "   %b[OK]  %d%b\n" "$DEM_SUCCESS" "$ok_count" "$DEM_RESET"
    printf "   %b[WARN] %d%b\n" "$DEM_WARNING" "$warn_count" "$DEM_RESET"
    printf "   %b[FAIL] %d%b\n" "$DEM_ERROR" "$fail_count" "$DEM_RESET"
    dem_line

    if [[ $fail_count -gt 0 ]]; then
        dem_error "Verification completed with $fail_count module failure(s)."
        return "${DEM_EXIT_ERROR:-1}"
    fi

    dem_success "Verification completed successfully for profile: $profile."
    return 0

}
