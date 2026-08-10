#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat <<'EOF'
Usage: ./dem.sh platform <command>

Commands:
  doctor      Verify tools required by Platform development
  rust        Run cargo fmt, check, clippy and test when available
  keyspaces   Validate Platform migration keyspace ownership
  all         Run all Platform validations that are available
EOF
}

dem_command_platform() {
    local action="${1:-all}"

    case "$action" in
        doctor)
            dem_check_git || true
            dem_check_cargo || true
            dem_check_node || true
            dem_check_docker || true
            dem_check_gh || true
            ;;
        rust)
            dem_check_cargo || dem_die "Rust/Cargo is required for platform rust validation"
            cargo fmt --all -- --check
            cargo check --workspace --all-targets
            cargo clippy --workspace --all-targets -- -D warnings
            cargo test --workspace --all-targets
            ;;
        keyspaces)
            local platform_dir="${DEM_PLATFORM_DIR:-}"
            if [[ -z "$platform_dir" ]]; then
                dem_die "Set DEM_PLATFORM_DIR to the Platform repository path"
            fi
            [[ -x "$platform_dir/scripts/validate-keyspace-ownership.sh" ]] || dem_die "Platform keyspace validator is missing or not executable"
            "$platform_dir/scripts/validate-keyspace-ownership.sh"
            ;;
        all)
            dem_command_platform doctor
            if dem_check_cargo; then
                dem_command_platform rust
            else
                dem_warning "Rust/Cargo unavailable; skipped Rust validation"
            fi
            if [[ -n "${DEM_PLATFORM_DIR:-}" ]] && [[ -x "${DEM_PLATFORM_DIR}/scripts/validate-keyspace-ownership.sh" ]]; then
                dem_command_platform keyspaces
            else
                dem_warning "DEM_PLATFORM_DIR not configured; skipped keyspace validation"
            fi
            ;;
        help|-h|--help)
            usage
            ;;
        *)
            usage >&2
            return 1
            ;;
    esac
}
