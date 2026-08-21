#!/usr/bin/env bash
set -euo pipefail
dem_command_doctor() {

    dem_banner

    local errors=0
    local warnings=0
    local passes=0

    # Section 1: System Diagnostics
    dem_title "System Diagnostics"

    if dem_check_debian; then
        dem_success "Debian Platform (trixie)"
        passes=$((passes + 1))
    else
        dem_error "Not running on Debian Platform"
        errors=$((errors + 1))
    fi

    if dem_check_network; then
        dem_success "Internet connectivity"
        passes=$((passes + 1))
    else
        dem_warning "No internet connectivity detected"
        warnings=$((warnings + 1))
    fi

    if dem_check_apt; then
        dem_success "APT package manager"
        passes=$((passes + 1))
    else
        dem_error "APT package manager is missing"
        errors=$((errors + 1))
    fi

    if dem_check_systemd; then
        dem_success "Systemd service manager"
        passes=$((passes + 1))
    else
        dem_error "Systemd is missing or not running"
        errors=$((errors + 1))
    fi

    # Optional commands checking (git is required by core, and has been classified strictly under required commands)
    # The absence of these optional development components does not prevent DEM's core operations.
    local optional_cmds=("docker" "node" "php" "composer" "cargo" "go")
    for cmd in "${optional_cmds[@]}"; do
        if dem_command_exists "$cmd"; then
            dem_success "Optional Package: $cmd client is installed"
            passes=$((passes + 1))
        else
            dem_warning "Optional Package: $cmd client is not installed (optional component)"
            warnings=$((warnings + 1))
        fi
    done

    # Section 2: Repository & Environment Integrity
    dem_title "Repository & Environment Integrity Check"

    # 1. Line endings check
    local crlf_found=0
    local crlf_files=()
    while IFS= read -r -d '' f; do
        if grep -q $'\r' "$f" 2>/dev/null; then
            crlf_found=1
            crlf_files+=("$f")
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" -o -name "*.service" -o -name "*.conf" -o -name "*.env" -o -name "*.md" \) -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $crlf_found -eq 0 ]]; then
        dem_success "Line Endings: All scripts and text files use LF line endings."
        passes=$((passes + 1))
    else
        dem_error "Line Endings: CRLF line endings detected in: ${crlf_files[*]}"
        errors=$((errors + 1))
    fi

    # 2. Shebang headers check
    local shebang_errors=0
    local shebang_err_files=()
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        if [[ "$rel_f" == "config.sh" || "$rel_f" == "lib/"* ]]; then
            # Library/config files must NOT have a shebang
            if head -n 1 "$f" | grep -q "^#!" 2>/dev/null; then
                shebang_errors=1
                shebang_err_files+=("$rel_f (library/config file must not contain a shebang)")
            fi
        else
            # Executable/script files must begin exactly with:
            # #!/usr/bin/env bash
            # set -euo pipefail (or set -Eeuo pipefail)
            local first_line
            local second_line
            first_line=$(sed -n '1p' "$f" 2>/dev/null || echo "")
            second_line=$(sed -n '2p' "$f" 2>/dev/null || echo "")

            # Check for UTF-8 BOM
            if head -c 3 "$f" | grep -q $'\xEF\xBB\xBF' 2>/dev/null; then
                shebang_errors=1
                shebang_err_files+=("$rel_f (contains UTF-8 BOM)")
                continue
            fi

            if [[ "$first_line" != "#!/usr/bin/env bash" ]]; then
                shebang_errors=1
                shebang_err_files+=("$rel_f (invalid shebang: '$first_line')")
            elif [[ "$second_line" != "set -euo pipefail" && "$second_line" != "set -Eeuo pipefail" ]]; then
                shebang_errors=1
                shebang_err_files+=("$rel_f (invalid second line: '$second_line', expected 'set -euo pipefail' or 'set -Eeuo pipefail' without blank lines)")
            fi
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" \) -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $shebang_errors -eq 0 ]]; then
        dem_success "Shebang Headers: Verified correct shebang headers."
        passes=$((passes + 1))
    else
        dem_error "Shebang Headers: Invalid shebangs/headers found in:\n$(printf '  - %s\n' "${shebang_err_files[@]}")"
        errors=$((errors + 1))
    fi

    # 3. Executable permissions check
    local perm_errors=0
    local perm_err_files=()
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        if [[ "$rel_f" == "config.sh" || "$rel_f" == "lib/"* ]]; then
            # Library files/config must NOT be executable
            if [[ -x "$f" ]]; then
                perm_errors=1
                perm_err_files+=("$rel_f (library/config file is executable)")
            fi
        else
            # Executable files must be executable (excluding .profile scripts as they are only sourced)
            if [[ "$rel_f" != "profiles/"* ]]; then
                if [[ ! -x "$f" ]]; then
                    perm_errors=1
                    perm_err_files+=("$rel_f (missing executable permission)")
                fi
            fi
        fi
    done < <(find . -type f -name "*.sh" -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    # Check root scripts
    for rscript in dem.sh bootstrap.sh; do
        if [[ -f "$rscript" && ! -x "$rscript" ]]; then
            perm_errors=1
            perm_err_files+=("$rscript (missing executable permission)")
        fi
    done

    if [[ $perm_errors -eq 0 ]]; then
        dem_success "Executable Permissions: All scripts have correct permissions."
        passes=$((passes + 1))
    else
        dem_error "Executable Permissions: Incorrect file permissions found: ${perm_err_files[*]}"
        errors=$((errors + 1))
    fi

    # 4. Bash Syntax Check
    local syntax_errors=0
    local syntax_err_files=()
    while IFS= read -r -d '' f; do
        if ! bash -n "$f" >/dev/null 2>&1; then
            syntax_errors=1
            syntax_err_files+=("$f")
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" \) -not -path '*/.*' -print0)

    if [[ $syntax_errors -eq 0 ]]; then
        dem_success "Bash Syntax: All scripts compiled successfully with bash -n."
        passes=$((passes + 1))
    else
        dem_error "Bash Syntax: Syntax errors found in: ${syntax_err_files[*]}"
        errors=$((errors + 1))
    fi

    # 5. Required Commands Check
    local critical_cmds=("bash" "git" "apt" "dpkg" "systemctl" "sed" "grep" "find" "chmod" "xargs" "lsof")
    local missing_cmds=()
    for cmd in "${critical_cmds[@]}"; do
        if ! dem_command_exists "$cmd"; then
            missing_cmds+=("$cmd")
        fi
    done

    if [[ ${#missing_cmds[@]} -eq 0 ]]; then
        dem_success "Required Commands: All critical environment commands are available."
        passes=$((passes + 1))
    else
        dem_error "Required Commands: Missing critical command(s): ${missing_cmds[*]}"
        errors=$((errors + 1))
    fi

    # 6. Missing Repository Files Check
    local expected_files=("dem.sh" "bootstrap.sh" "config.sh" "DEVELOPMENT.md" "README.md" "ARCHITECTURE.md" "LICENSE" "VERSION" ".gitattributes" ".editorconfig")
    local missing_files=()
    for ef in "${expected_files[@]}"; do
        if [[ ! -f "$ef" ]]; then
            missing_files+=("$ef")
        fi
    done

    if [[ ${#missing_files[@]} -eq 0 ]]; then
        dem_success "Missing Files: All core framework files are present."
        passes=$((passes + 1))
    else
        dem_error "Missing Files: Core framework file(s) are missing: ${missing_files[*]}"
        errors=$((errors + 1))
    fi

    # 7. Broken Symbolic Links Check
    local broken_links=()
    while IFS= read -r f; do
        broken_links+=("$f")
    done < <(find . -xtype l)

    if [[ ${#broken_links[@]} -eq 0 ]]; then
        dem_success "Symbolic Links: No broken symbolic links found."
        passes=$((passes + 1))
    else
        dem_error "Symbolic Links: Broken symlink(s) detected: ${broken_links[*]}"
        errors=$((errors + 1))
    fi

    # 8. Duplicate APT Sources / Repository Definitions Check
    local apt_files=()
    if [[ -f "/etc/apt/sources.list" ]]; then
        apt_files+=("/etc/apt/sources.list")
    fi
    while IFS= read -r -d '' f; do
        apt_files+=("$f")
    done < <(find /etc/apt/sources.list.d/ -type f -name "*.list" 2>/dev/null -print0 || true)

    local dup_apt=0
    local dup_apt_list=()
    if [[ ${#apt_files[@]} -gt 0 ]]; then
        # Read and check for duplicates of active lines
        local active_lines=()
        for af in "${apt_files[@]}"; do
            if [[ -r "$af" ]]; then
                while IFS= read -r line; do
                    # Strip whitespace
                    line=$(echo "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
                    # Ignore empty/commented lines
                    if [[ -n "$line" && "$line" != "#"* ]]; then
                        active_lines+=("$line")
                    fi
                done < "$af"
            fi
        done

        # Find duplicates in active_lines
        if [[ ${#active_lines[@]} -gt 0 ]]; then
            local sorted_uniques
            sorted_uniques=$(printf "%s\n" "${active_lines[@]}" | sort | uniq -d)
            if [[ -n "$sorted_uniques" ]]; then
                dup_apt=1
                while IFS= read -r dup_line; do
                    dup_apt_list+=("$dup_line")
                done <<< "$sorted_uniques"
            fi
        fi
    fi

    if [[ $dup_apt -eq 0 ]]; then
        dem_success "Duplicate APT Sources: No duplicate repositories configured."
        passes=$((passes + 1))
    else
        dem_warning "Duplicate APT Sources: Duplicate repository definition(s) found:\n${dup_apt_list[*]}"
        warnings=$((warnings + 1))
    fi

    # 8.1. ScyllaDB Debian 13 Fallback Check
    if [[ -f /etc/os-release ]]; then
        # shellcheck disable=SC1091
        source /etc/os-release
    fi
    if [[ "${VERSION_CODENAME:-}" == "trixie" && -f /etc/apt/sources.list.d/scylla.list ]]; then
        dem_warning "ScyllaDB is running via Debian 12 (bookworm) packages on Debian 13 as an explicitly opted-in compatibility fallback. Not officially supported by ScyllaDB upstream as of this release."
        warnings=$((warnings + 1))
    fi

    # 9. Package Module Completeness Check (install, configure, verify, uninstall)
    local module_completeness_errors=0
    local module_errs=()
    while IFS= read -r -d '' folder; do
        # Check if the folder contains any .sh file (directly, i.e., at depth 1)
        local sh_count=0
        sh_count=$(find "$folder" -maxdepth 1 -name "*.sh" | wc -l)
        if [[ $sh_count -gt 0 ]]; then
            # Verify the exact four lifecycle scripts exist
            local missing_lifecycle=()
            for script in install.sh configure.sh verify.sh uninstall.sh; do
                if [[ ! -f "$folder/$script" ]]; then
                    missing_lifecycle+=("$script")
                fi
            done
            # Check for any non-contract .sh files
            local extra_scripts=()
            while IFS= read -r s; do
                local sname
                sname=$(basename "$s")
                if [[ "$sname" != "install.sh" && "$sname" != "configure.sh" && "$sname" != "verify.sh" && "$sname" != "uninstall.sh" ]]; then
                    extra_scripts+=("$sname")
                fi
            done < <(find "$folder" -maxdepth 1 -name "*.sh")

            if [[ ${#missing_lifecycle[@]} -gt 0 || ${#extra_scripts[@]} -gt 0 ]]; then
                module_completeness_errors=1
                local err_msg="$folder: "
                if [[ ${#missing_lifecycle[@]} -gt 0 ]]; then
                    err_msg="${err_msg}missing lifecycle script(s): [${missing_lifecycle[*]}]; "
                fi
                if [[ ${#extra_scripts[@]} -gt 0 ]]; then
                    err_msg="${err_msg}unexpected script(s): [${extra_scripts[*]}]; "
                fi
                module_errs+=("$err_msg")
            fi
        fi
    done < <(find packages/ -type d -not -path '*/.*' -print0)

    if [[ $module_completeness_errors -eq 0 ]]; then
        dem_success "Package Module Completeness: All module lifecycles are fully consistent."
        passes=$((passes + 1))
    else
        dem_error "Package Module Completeness: Module contract inconsistencies found:\n$(printf '  - %s\n' "${module_errs[@]}")"
        errors=$((errors + 1))
    fi

    # 10. Profile Consistency Check
    local profile_errors=0
    local profile_err_list=()
    while IFS= read -r -d '' p; do
        # Source the profile safely in a subshell to get DEM_MODULES
        local mod_list
        mod_list=$(bash -c "source '$p' && echo \"\${DEM_MODULES[@]}\"")
        for mod in $mod_list; do
            if [[ ! -d "packages/$mod" ]]; then
                profile_errors=1
                profile_err_list+=("$p (references missing module packages/$mod)")
            fi
        done
    done < <(find profiles/ -type f -name "*.profile" -print0)

    if [[ $profile_errors -eq 0 ]]; then
        dem_success "Profile Consistency: All defined profiles reference valid packages."
        passes=$((passes + 1))
    else
        dem_error "Profile Consistency: Profile modules missing:\n$(printf '  - %s\n' "${profile_err_list[@]}")"
        errors=$((errors + 1))
    fi

    # 11. Controller Consistency Check
    local ctrl_errors=0
    local ctrl_err_list=()
    local expected_ctrls=("install" "uninstall" "configure" "verify" "remove" "doctor" "status" "update" "upgrade" "repair" "cleanup" "backup" "restore" "version")
    for ctrl in "${expected_ctrls[@]}"; do
        if [[ ! -f "commands/${ctrl}.sh" ]]; then
            ctrl_errors=1
            ctrl_err_list+=("$ctrl")
        fi
    done

    if [[ $ctrl_errors -eq 0 ]]; then
        dem_success "Controller Consistency: All system controllers are present."
        passes=$((passes + 1))
    else
        dem_error "Controller Consistency: Missing controller scripts: [${ctrl_err_list[*]}]"
        errors=$((errors + 1))
    fi

    # Print summary
    echo
    dem_line
    echo "Diagnostic summary: $passes PASS, $warnings WARNING, $errors ERROR."
    dem_line

    if [[ $errors -gt 0 ]]; then
        return 1
    fi

    return 0
}
