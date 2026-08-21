#!/usr/bin/env bash
set -euo pipefail
dem_command_validate() {
    dem_banner
    dem_title "Repository Static Validation"

    local errors=0
    local passes=0

    # 1. CRLF Detection
    dem_info "1. Checking for CRLF line endings..."
    local crlf_found=0
    local crlf_files=()
    while IFS= read -r -d '' f; do
        if grep -q $'\r' "$f" 2>/dev/null; then
            crlf_found=1
            crlf_files+=("$f")
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" -o -name "*.service" -o -name "*.conf" -o -name "*.env" -o -name "*.md" \) -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $crlf_found -eq 0 ]]; then
        dem_success "Line Endings: All text files use LF line endings."
        passes=$((passes + 1))
    else
        dem_error "Line Endings: CRLF line endings detected in: ${crlf_files[*]}"
        errors=$((errors + 1))
    fi

    # 2. Shebang and UTF-8 BOM Validation
    dem_info "2. Checking Shebang headers and UTF-8 BOM..."
    local shebang_errors=0
    local shebang_err_files=()
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        if [[ "$rel_f" == "config.sh" || "$rel_f" == "lib/"* ]]; then
            # Sourced scripts: Must NOT have a shebang
            if head -n 1 "$f" | grep -q "^#!" 2>/dev/null; then
                shebang_errors=1
                shebang_err_files+=("$rel_f (library/config file must not contain a shebang)")
            fi
        else
            # Executables: Must have correct shebang and set options
            local first_line
            local second_line
            first_line=$(sed -n '1p' "$f" 2>/dev/null || echo "")
            second_line=$(sed -n '2p' "$f" 2>/dev/null || echo "")

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
                shebang_err_files+=("$rel_f (invalid second line: '$second_line', expected 'set -euo pipefail' or 'set -Eeuo pipefail')")
            fi
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" \) -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $shebang_errors -eq 0 ]]; then
        dem_success "Shebang & BOM: All headers are fully compliant."
        passes=$((passes + 1))
    else
        dem_error "Shebang & BOM: Invalid formatting in:\n$(printf '  - %s\n' "${shebang_err_files[@]}")"
        errors=$((errors + 1))
    fi

    # 3. File Permissions Validation
    dem_info "3. Checking script file executable permissions..."
    local perm_errors=0
    local perm_err_files=()
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        if [[ "$rel_f" == "config.sh" || "$rel_f" == "lib/"* ]]; then
            # Library config must NOT be executable
            if [[ -x "$f" ]]; then
                perm_errors=1
                perm_err_files+=("$rel_f (library/config is executable, must be 0644)")
            fi
        else
            # Executable files must be executable (excluding profiles)
            if [[ "$rel_f" != "profiles/"* ]]; then
                if [[ ! -x "$f" ]]; then
                    perm_errors=1
                    perm_err_files+=("$rel_f (script is not executable, must be 0755)")
                fi
            fi
        fi
    done < <(find . -type f -name "*.sh" -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    for rscript in dem.sh bootstrap.sh; do
        if [[ -f "$rscript" && ! -x "$rscript" ]]; then
            perm_errors=1
            perm_err_files+=("$rscript (missing executable permission)")
        fi
    done

    if [[ $perm_errors -eq 0 ]]; then
        dem_success "Permissions: Script permissions are correct."
        passes=$((passes + 1))
    else
        dem_error "Permissions: Incorrect file permissions found: ${perm_err_files[*]}"
        errors=$((errors + 1))
    fi

    # 4. Bash Syntax Compilation
    dem_info "4. Running bash syntax compilation checks (bash -n)..."
    local syntax_errors=0
    local syntax_err_files=()
    while IFS= read -r -d '' f; do
        if ! bash -n "$f" >/dev/null 2>&1; then
            syntax_errors=1
            syntax_err_files+=("$f")
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" \) -not -path '*/.*' -print0)

    if [[ $syntax_errors -eq 0 ]]; then
        dem_success "Bash Syntax: All scripts compiled successfully."
        passes=$((passes + 1))
    else
        dem_error "Bash Syntax: Syntax errors found in: ${syntax_err_files[*]}"
        errors=$((errors + 1))
    fi

    # 5. ShellCheck Linting
    dem_info "5. Running ShellCheck..."
    if dem_command_exists shellcheck; then
        local sc_errors=0
        local sc_files=()
        while IFS= read -r -d '' f; do
            # We skip some warnings explicitly if needed, but strive for zero warnings
            if ! shellcheck -x "$f" >/dev/null 2>&1; then
                sc_errors=$((sc_errors + 1))
                sc_files+=("$f")
            fi
        done < <(find . -type f -name "*.sh" -not -path '*/.*' -print0)

        if [[ $sc_errors -eq 0 ]]; then
            dem_success "ShellCheck: No linting errors detected."
            passes=$((passes + 1))
        else
            dem_warning "ShellCheck: Warnings detected in the following files: ${sc_files[*]}"
            # We treat shellcheck as optional warning-level in some strict non-trixie dev sandboxes,
            # but we want zero actionable shellcheck findings in CI.
        fi
    else
        dem_warning "ShellCheck is not installed. Skipping dynamic linting."
    fi

    # 6. Package Category Structure and Lifecycle Completeness
    dem_info "6. Checking packages/ architectural categories and lifecycle contracts..."
    local struct_errors=0
    local struct_err_files=()
    local expected_categories=(
        "core" "system" "development" "docker" "languages" "databases"
        "databases-engines" "frameworks" "office" "tools" "desktop" "server"
    )

    # Verify all 12 categories exist under packages/
    for cat in "${expected_categories[@]}"; do
        if [[ ! -d "packages/$cat" ]]; then
            struct_errors=1
            struct_err_files+=("packages/$cat (missing 12-category module directory)")
        fi
    done

    # Verify every directory with scripts under packages/ has exactly the 4 contract files
    while IFS= read -r -d '' folder; do
        # If the directory contains any subdirectories or .sh files, verify lifecycle contracts
        local sh_count
        sh_count=$(find "$folder" -maxdepth 1 -name "*.sh" | wc -l)
        if [[ $sh_count -gt 0 ]]; then
            local missing_lifecycle=()
            for script in install.sh configure.sh verify.sh uninstall.sh; do
                if [[ ! -f "$folder/$script" ]]; then
                    missing_lifecycle+=("$script")
                fi
            done
            local unexpected_files=()
            while IFS= read -r s; do
                local sname
                sname=$(basename "$s")
                if [[ "$sname" != "install.sh" && "$sname" != "configure.sh" && "$sname" != "verify.sh" && "$sname" != "uninstall.sh" ]]; then
                    unexpected_files+=("$sname")
                fi
            done < <(find "$folder" -maxdepth 1 -name "*.sh")

            if [[ ${#missing_lifecycle[@]} -gt 0 || ${#unexpected_files[@]} -gt 0 ]]; then
                struct_errors=1
                local emsg="$folder: "
                if [[ ${#missing_lifecycle[@]} -gt 0 ]]; then
                    emsg="${emsg}missing lifecycle script(s): [${missing_lifecycle[*]}]; "
                fi
                if [[ ${#unexpected_files[@]} -gt 0 ]]; then
                    emsg="${emsg}unexpected script(s): [${unexpected_files[*]}]; "
                fi
                struct_err_files+=("$emsg")
            fi
        fi
    done < <(find packages/ -type d -not -path '*/.*' -print0)

    if [[ $struct_errors -eq 0 ]]; then
        dem_success "Package Structure: 12-category structure and 4-script contracts are completely valid."
        passes=$((passes + 1))
    else
        dem_error "Package Structure: Contract violations found:\n$(printf '  - %s\n' "${struct_err_files[@]}")"
        errors=$((errors + 1))
    fi

    # 7. Profile and Controller Consistency
    dem_info "7. Checking profiles and controllers consistency..."
    local consistency_errors=0
    local consistency_errs=()

    # Profiles consistency
    while IFS= read -r -d '' p; do
        local mod_list
        mod_list=$(bash -c "source '$p' && echo \"\${DEM_MODULES[@]}\"")
        for mod in $mod_list; do
            if [[ ! -d "packages/$mod" ]]; then
                consistency_errors=1
                consistency_errs+=("$p (references non-existent package/module: packages/$mod)")
            fi
        done
    done < <(find profiles/ -type f -name "*.profile" -print0)

    # Controller consistency
    local expected_ctrls=("install" "uninstall" "configure" "verify" "remove" "doctor" "status" "update" "upgrade" "repair" "cleanup" "backup" "restore" "version")
    for ctrl in "${expected_ctrls[@]}"; do
        if [[ ! -f "commands/${ctrl}.sh" ]]; then
            consistency_errors=1
            consistency_errs+=("commands/${ctrl}.sh (missing required controller)")
        fi
    done

    if [[ $consistency_errors -eq 0 ]]; then
        dem_success "Consistency: Profile and Controller mappings are fully consistent."
        passes=$((passes + 1))
    else
        dem_error "Consistency: Violations found:\n$(printf '  - %s\n' "${consistency_errs[@]}")"
        errors=$((errors + 1))
    fi

    # 8. Facts-Based Documentation Consistency Checker
    dem_info "8. Checking Documentation Integrity & Consistency..."
    local doc_errors=0
    local doc_errs=()

    # Audit Markdown files
    local md_files=()
    while IFS= read -r -d '' f; do
        md_files+=("$f")
    done < <(find . -maxdepth 2 -type f -name "*.md" -not -path '*/.*' -print0)

    for doc in "${md_files[@]}"; do
        # Check for Ubuntu platform support statements (only allowed contextually)
        if grep -Ei "ubuntu is supported|support ubuntu|target: ubuntu" "$doc" >/dev/null 2>&1; then
            doc_errors=1
            doc_errs+=("$doc (contains prohibited statement representing Ubuntu as supported)")
        fi

        # Check documented commands ./dem.sh <cmd>
        # Match pattern: ./dem.sh <command> (with optional arguments)
        local cmd_matches
        cmd_matches=$(grep -oE '\./dem\.sh [a-z\-]+' "$doc" | awk '{print $2}' | sort -u || true)
        for cmd in $cmd_matches; do
            # Ignore standard options or helpers like help, version if they aren't commands directly (or exclude if they are fine)
            if [[ "$cmd" == "help" || "$cmd" == "version" ]]; then
                continue
            fi
            if [[ ! -f "commands/${cmd}.sh" ]]; then
                doc_errors=1
                doc_errs+=("$doc (documents non-existent command: ./dem.sh $cmd)")
            fi
        done

        # Check documented profiles
        local profile_matches
        profile_matches=$(grep -oE 'profile: [a-z]+|profiles: [a-z, ]+|install [a-z]+' "$doc" | grep -oE 'minimal|server|desktop' | sort -u || true)
        for prof in $profile_matches; do
            if [[ ! -f "profiles/${prof}.profile" ]]; then
                doc_errors=1
                doc_errs+=("$doc (documents non-existent profile: $prof)")
            fi
        done

        # Check documented modules/packages
        local pkg_matches
        pkg_matches=$(grep -oE 'packages/[a-zA-Z0-9_/-]+' "$doc" | sort -u || true)
        for pkg in $pkg_matches; do
            # Strip trailing slash or dot
            pkg="${pkg%/.}"
            pkg="${pkg%/}"
            if [[ ! -e "$pkg" ]]; then
                doc_errors=1
                doc_errs+=("$doc (references non-existent file path: $pkg)")
            fi
        done

        # Ensure installation instructions use bootstrap.sh or dem.sh
        if grep -E "install\.sh" "$doc" | grep -Ev "packages/" | grep -q "bash" 2>/dev/null; then
            doc_errors=1
            doc_errs+=("$doc (potentially outdated/incorrect installation instructions referencing install.sh directly instead of bootstrap.sh or dem.sh)")
        fi
    done

    if [[ $doc_errors -eq 0 ]]; then
        dem_success "Documentation: Checked markdown files. No facts-based inconsistencies or obsolete commands detected."
        passes=$((passes + 1))
    else
        dem_error "Documentation: Inconsistencies or obsolete references detected:\n$(printf '  - %s\n' "${doc_errs[@]}")"
        errors=$((errors + 1))
    fi

    # 9. Symbolic Links & Broken References
    dem_info "9. Checking for broken symbolic links and unexpected files..."
    local link_errors=0
    local broken_links=()
    while IFS= read -r f; do
        broken_links+=("$f")
    done < <(find . -xtype l)

    if [[ ${#broken_links[@]} -eq 0 ]]; then
        dem_success "Symbolic Links: No broken symbolic links found."
        passes=$((passes + 1))
    else
        dem_error "Symbolic Links: Broken symlinks detected: ${broken_links[*]}"
        errors=$((errors + 1))
    fi

    # 10. Unexpected Executable Files
    local unexpected_exec=0
    local unexpected_exec_files=()
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        # Sourced library scripts, markdown files, config, profile files must never be executable
        if [[ -x "$f" ]]; then
            if [[ "$rel_f" == "lib/"* || "$rel_f" == "config.sh" || "$rel_f" == "profiles/"* || "$rel_f" == *.md ]]; then
                unexpected_exec=1
                unexpected_exec_files+=("$rel_f")
            fi
        fi
    done < <(find . -type f -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $unexpected_exec -eq 0 ]]; then
        dem_success "File Modes: No unexpected executable files found."
        passes=$((passes + 1))
    else
        dem_error "File Modes: Unexpected executable files found: ${unexpected_exec_files[*]}"
        errors=$((errors + 1))
    fi

    # Summary
    echo
    dem_line
    echo "Validation summary: $passes PASS, $errors ERROR."
    dem_line

    if [[ $errors -gt 0 ]]; then
        return 1
    fi

    return 0
}
