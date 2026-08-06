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
            # Convert CRLF to LF safely
            local temp_f
            temp_f=$(mktemp)
            tr -d '\r' < "$f" > "$temp_f"
            cat "$temp_f" > "$f"
            rm -f "$temp_f"
            dem_info "Converted line endings to LF: $f"
            crlf_count=$((crlf_count + 1))
        fi
    done < <(find . -type f \( -name "*.sh" -o -name "*.profile" -o -name "*.service" -o -name "*.conf" -o -name "*.env" -o -name "*.md" \) -not -path '*/.*' -print0)

    if [[ $crlf_count -gt 0 ]]; then
        dem_success "Normalized $crlf_count file(s) with CRLF line endings to LF."
    else
        dem_success "Line Endings: Already clean."
    fi

    # 4. Shebang Headers Repair
    dem_info "Repairing shebang headers..."
    local shebang_count=0
    while IFS= read -r -d '' f; do
        if [[ "$f" == "./lib/"* ]]; then
            # Library scripts: should not have a shebang
            if head -n 1 "$f" | grep -q "^#!" 2>/dev/null; then
                # Remove first line
                local temp_f
                temp_f=$(mktemp)
                tail -n +2 "$f" > "$temp_f"
                # Strip leading blank lines
                while [[ "$(head -n 1 "$temp_f")" == "" ]]; do
                    tail -n +2 "$temp_f" > "${temp_f}.tmp" && mv "${temp_f}.tmp" "$temp_f"
                done
                cat "$temp_f" > "$f"
                rm -f "$temp_f"
                dem_info "Removed shebang from library script: $f"
                shebang_count=$((shebang_count + 1))
            fi
        else
            # Executable scripts: should have exactly #!/usr/bin/env bash
            local temp_f
            temp_f=$(mktemp)
            # Remove BOM if present, remove leading empty lines, ensure clean shebang
            sed -e '1s/^\xEF\xBB\xBF//' "$f" > "$temp_f"
            while [[ "$(head -n 1 "$temp_f")" == "" ]]; do
                tail -n +2 "$temp_f" > "${temp_f}.tmp" && mv "${temp_f}.tmp" "$temp_f"
            done

            local first_line
            first_line=$(head -n 1 "$temp_f" 2>/dev/null || echo "")
            if [[ "$first_line" != "#!/usr/bin/env bash" ]]; then
                if [[ "$first_line" == "#!"* ]]; then
                    # Replace the existing shebang with the correct one
                    sed -i "1s|^.*$|#!/usr/bin/env bash|" "$temp_f"
                else
                    # Prepend correct shebang
                    local shebang_prepended
                    shebang_prepended=$(mktemp)
                    echo -e "#!/usr/bin/env bash\n" > "$shebang_prepended"
                    cat "$temp_f" >> "$shebang_prepended"
                    mv "$shebang_prepended" "$temp_f"
                fi
                cat "$temp_f" > "$f"
                dem_info "Repaired shebang header in script: $f"
                shebang_count=$((shebang_count + 1))
            fi
            rm -f "$temp_f"
        fi
    done < <(find . -type f -name "*.sh" -not -path '*/.*' -print0)

    if [[ $shebang_count -gt 0 ]]; then
        dem_success "Repaired $shebang_count shebang header(s)."
    else
        dem_success "Shebang Headers: Already clean."
    fi

    # 5. Executable Permissions Repair
    dem_info "Repairing executable permissions..."
    local perm_count=0
    while IFS= read -r -d '' f; do
        if [[ "$f" == "./lib/"* ]]; then
            # Library: should not be executable
            if [[ -x "$f" ]]; then
                chmod -x "$f"
                if [[ -d ".git" ]]; then
                    git update-index --chmod=-x "$f" || true
                fi
                dem_info "Removed executable permission from library: $f"
                perm_count=$((perm_count + 1))
            fi
        else
            # Executable scripts: should be executable
            if [[ ! -x "$f" ]]; then
                chmod +x "$f"
                if [[ -d ".git" ]]; then
                    git update-index --chmod=+x "$f" || true
                fi
                dem_info "Added executable permission to script: $f"
                perm_count=$((perm_count + 1))
            fi
        fi
    done < <(find . -type f -name "*.sh" -not -path '*/.*' -print0)

    for rscript in dem.sh bootstrap.sh config.sh; do
        if [[ -f "$rscript" && ! -x "$rscript" ]]; then
            chmod +x "$rscript"
            if [[ -d ".git" ]]; then
                git update-index --chmod=+x "$rscript" || true
            fi
            dem_info "Added executable permission to script: $rscript"
            perm_count=$((perm_count + 1))
        fi
    done

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
