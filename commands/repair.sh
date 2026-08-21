#!/usr/bin/env bash
set -euo pipefail
dem_command_repair() {

    dem_title "Repository & Workspace Repair"

    # 1. Ensure .gitattributes and .editorconfig exist
    if [[ ! -f ".gitattributes" ]]; then
        dem_info "Recreating missing .gitattributes..."
        cat <<'EOF' > .gitattributes
# Global default for text files to handle line endings automatically.
* text=auto

# Enforce LF line endings on checkouts for bash scripts, profiles, services, config, and documentation.
*.sh text eol=lf
*.profile text eol=lf
*.service text eol=lf
*.conf text eol=lf
*.env text eol=lf
*.md text eol=lf

*.ps1 text

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
EOF
        dem_success "Recreated .gitattributes."
    fi

    if [[ ! -f ".editorconfig" ]]; then
        dem_info "Recreating missing .editorconfig..."
        cat <<'EOF' > .editorconfig
# EditorConfig is awesome: https://EditorConfig.org

root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 4

[*.ps1]
end_of_line = lf
indent_style = space
indent_size = 4

[*.md]
trim_trailing_whitespace = false
EOF
        dem_success "Recreated .editorconfig."
    fi

    # 2. Git Configurations
    if [[ -d ".git" ]]; then
        dem_info "Configuring repository Git options..."
        git config core.autocrlf false || true
        git config core.filemode true || true
        dem_success "Git options core.autocrlf=false and core.filemode=true configured."
    fi

    # 3. Line Endings Conversion (CRLF -> LF)
    dem_info "Converting CRLF to LF line endings on repository text files..."
    local crlf_count=0
    while IFS= read -r -d '' f; do
        if grep -q $'\r' "$f" 2>/dev/null; then
            # Convert CRLF to LF safely using dos2unix or sed
            if dem_command_exists dos2unix; then
                dos2unix -q "$f"
            else
                # Use sed as a robust backup to remove CRLF line endings
                sed -i 's/\r$//' "$f"
            fi
            dem_info "Converted line endings to LF: $f"
            crlf_count=$((crlf_count + 1))
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" -o -name "*.service" -o -name "*.conf" -o -name "*.env" -o -name "*.md" \) -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $crlf_count -gt 0 ]]; then
        dem_success "Normalized $crlf_count file(s) with CRLF line endings to LF."
    else
        dem_success "Line Endings: Already clean."
    fi

    # 4. Shebang Headers Repair
    dem_info "Repairing shebang headers..."
    local shebang_count=0
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        if [[ "$rel_f" == "config.sh" || "$rel_f" == "lib/"* ]]; then
            # Library/config files: should not have a shebang
            if head -n 1 "$f" | grep -q "^#!" 2>/dev/null; then
                local temp_f
                temp_f=$(mktemp)
                tail -n +2 "$f" > "$temp_f"
                # Strip leading blank lines
                while [[ -s "$temp_f" && "$(head -n 1 "$temp_f" 2>/dev/null || echo "")" == "" ]]; do
                    tail -n +2 "$temp_f" > "${temp_f}.tmp" && mv "${temp_f}.tmp" "$temp_f"
                done
                cat "$temp_f" > "$f"
                rm -f "$temp_f"
                dem_info "Removed shebang from library/config script: $rel_f"
                shebang_count=$((shebang_count + 1))
            fi
        else
            # Executable/script files: should start with exactly:
            # #!/usr/bin/env bash
            # set -euo/set -Eeuo pipefail (without blank lines)
            local temp_f
            temp_f=$(mktemp)
            # Remove UTF-8 BOM if present
            sed -e '1s/^\xEF\xBB\xBF//' "$f" > "$temp_f"

            # Detect original set mode (-Eeuo pipefail or -euo pipefail)
            local set_mode="set -euo pipefail"
            if grep -q "^set -Eeuo pipefail" "$temp_f"; then
                set_mode="set -Eeuo pipefail"
            fi

            # Remove any existing shebang or set -euo/set -Eeuo pipefail lines
            local temp_filtered
            temp_filtered=$(mktemp)
            grep -v -E "(^#!|^set -[Ee]?euo pipefail)" "$temp_f" > "$temp_filtered" || true

            # Strip leading blank lines
            local temp_stripped
            temp_stripped=$(mktemp)
            cat "$temp_filtered" > "$temp_stripped"
            while [[ -s "$temp_stripped" && "$(head -n 1 "$temp_stripped" 2>/dev/null || echo "")" == "" ]]; do
                tail -n +2 "$temp_stripped" > "${temp_stripped}.tmp" 2>/dev/null && mv "${temp_stripped}.tmp" "$temp_stripped"
            done

            # Prepend exact header with no empty line in between
            local temp_final
            temp_final=$(mktemp)
            echo "#!/usr/bin/env bash" > "$temp_final"
            echo "$set_mode" >> "$temp_final"
            cat "$temp_stripped" >> "$temp_final"

            # See if anything changed
            if ! cmp -s "$f" "$temp_final"; then
                cat "$temp_final" > "$f"
                dem_info "Repaired shebang and set headers in: $rel_f"
                shebang_count=$((shebang_count + 1))
            fi

            rm -f "$temp_f" "$temp_filtered" "$temp_stripped" "$temp_final"
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" \) -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $shebang_count -gt 0 ]]; then
        dem_success "Repaired $shebang_count shebang header(s) / formatting."
    else
        dem_success "Shebang Headers: Already clean."
    fi

    # 5. Executable Permissions Repair
    dem_info "Repairing executable permissions..."
    local perm_count=0

    # Ensure config.sh and lib/*.sh library scripts are explicitly non-executable on disk and in git index
    for f in config.sh lib/*.sh; do
        if [[ -f "$f" ]]; then
            if [[ -x "$f" ]]; then
                chmod -x "$f"
                dem_info "Removed executable permission from library/config on disk: $f"
                perm_count=$((perm_count + 1))
            fi
            if [[ -d ".git" ]]; then
                git update-index --chmod=-x "$f" || true
            fi
        fi
    done

    # Ensure main entrypoint scripts and controller commands are explicitly executable
    for f in dem.sh bootstrap.sh commands/*.sh; do
        if [[ -f "$f" ]]; then
            if [[ ! -x "$f" ]]; then
                chmod +x "$f"
                dem_info "Added executable permission to entrypoint/command script on disk: $f"
                perm_count=$((perm_count + 1))
            fi
            if [[ -d ".git" ]]; then
                git update-index --chmod=+x "$f" || true
            fi
        fi
    done

    # Handle remaining script files matching standard patterns
    while IFS= read -r -d '' f; do
        local rel_f="${f#./}"
        if [[ "$rel_f" == "config.sh" || "$rel_f" == "lib/"* ]]; then
            # Done explicitly above
            continue
        elif [[ "$rel_f" == "dem.sh" || "$rel_f" == "bootstrap.sh" || "$rel_f" == "commands/"* ]]; then
            # Done explicitly above
            continue
        else
            # Executable scripts: should be executable (excluding .profile scripts as they are only sourced)
            if [[ "$rel_f" != "profiles/"* ]]; then
                if [[ ! -x "$f" ]]; then
                    chmod +x "$f"
                    if [[ -d ".git" ]]; then
                        git update-index --chmod=+x "$f" || true
                    fi
                    dem_info "Added executable permission to script: $rel_f"
                    perm_count=$((perm_count + 1))
                fi
            fi
        fi
    done < <(find . -type f -name "*.sh" -not -path '*/.*' -not -path '*/node_modules/*' -not -path '*/.next/*' -print0)

    if [[ $perm_count -gt 0 ]]; then
        dem_success "Repaired permissions on $perm_count script(s)."
    else
        dem_success "Executable Permissions: Already clean."
    fi

    # 6. System Level Repair (Only if root)
    if dem_is_root; then
        dem_title "System Level Repair"
        dem_info "Configuring package manager..."
        dpkg --configure -a || true
        apt --fix-broken install -y || true
        apt update || true
        dem_success "System package manager repair complete."
    else
        dem_info "Skipping root system-level repairs (running as non-root)."
    fi

    dem_success "Repair process completed successfully and safely."
}
