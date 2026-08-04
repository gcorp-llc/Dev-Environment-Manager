# Contributing to DEM

We are thrilled that you are interested in contributing to the Dev Environment Manager (DEM)! To maintain the highest code quality and system reliability, we ask that all contributors follow these guidelines.

---

## 🚀 Pull Request Workflow

1. **Fork the Repository**: Create a personal copy of the repository.
2. **Create a Topic Branch**: Use a descriptive branch name:
   ```bash
   git checkout -b feature/add-new-runtime
   ```
3. **Commit Cleanly**: Keep commits focused and atomic. Follow standard Git commit guidelines:
   - A short, descriptive summary line (max 50 characters).
   - Use the imperative mood ("Add package...", "Fix repository...").
   - Detailed context in the commit body if necessary.
4. **Run Local Validation**: Before submitting, make sure that `set -euo pipefail` is enforced on all added scripts and that your code passes local execution.
5. **Open a Pull Request**: Submit your pull request against our `main` branch.

---

## 🎨 Style and Linting Guide

* **Bash Compatibility**: Our target platform is Debian 13 (Trixie), using Bash 5+. Avoid using non-standard bashisms.
* **ShellCheck**: Your code must pass ShellCheck without severe warnings or errors. Ensure variables are properly quoted and safety guards are implemented.
* **Strict 12-Category Mapping**: If you are introducing a new package, it must fit into exactly one of our 12 standardized package modules under `packages/`.
* **Four-Script Lifecycle**: All sub-modules must strictly provide `install.sh`, `configure.sh`, `verify.sh`, and `uninstall.sh`. No placeholders, no empty lines, and no incomplete logic are allowed in pull requests.

---

## 🤝 Code Review Expectations

Our core maintainers review every contribution to ensure:
- Absolute idempotency across all configurations.
- Modern Debian 13 conventions (such as utilizing `/etc/apt/keyrings/` and specified `signed-by` sources).
- Consistent naming schemes.
- Safety when invoking root level permissions.

Thank you for your effort in helping make DEM the premier environment provisioning framework for Debian systems!
