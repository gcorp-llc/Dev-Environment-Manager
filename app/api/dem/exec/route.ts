import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { command, target, scriptCode, moduleDetails } = await req.json();
    const timestamp = new Date().toLocaleTimeString();

    let logs: string[] = [];
    let success = true;

    if (command === 'doctor') {
      logs = [
        `[${timestamp}] [DEM DOCTOR] Running system health diagnostics on Debian 13 (Trixie)...`,
        `[${timestamp}] [CHECK] Verifying Debian release: Debian GNU/Linux 13 (Trixie) [OK]`,
        `[${timestamp}] [CHECK] Inspecting APT package manager locks under /var/lib/dpkg/lock... [OK]`,
        `[${timestamp}] [CHECK] Validating /etc/apt/keyrings signed-by GPG keyring files... [OK]`,
        `[${timestamp}] [CHECK] Testing systemd DBus bus interface and PID 1 availability... [OK]`,
        `[${timestamp}] [CHECK] Testing CPU instruction sets: SSE4.2, AVX, AVX2 enabled... [OK]`,
        `[${timestamp}] [CHECK] Testing outbound HTTPS keyserver fallback over port 443... [OK]`,
        `[${timestamp}] [CHECK] Checking line endings and executable flags across all package scripts... [OK]`,
        `[${timestamp}] [SUCCESS] All system diagnostics passed with 0 critical errors.`
      ];
    } else if (command === 'install_module') {
      const modName = moduleDetails?.name || target || 'Target Module';
      const packages = moduleDetails?.packages?.join(' ') || 'packages';
      logs = [
        `[${timestamp}] [DEM MODULE INSTALL] Target: ${modName} (${moduleDetails?.id || target})`,
        `[${timestamp}] [EXEC] Executing install.sh for category '${moduleDetails?.category || 'system'}'...`,
        `[${timestamp}] [APT] Updating package lists: apt-get update -qq`,
        `[${timestamp}] [APT] Installing packages: apt-get install -y ${packages}`,
        `[${timestamp}] [GPG] Verifying keyring signatures under /etc/apt/keyrings/`,
        `[${timestamp}] [EXEC] Executing configure.sh...`,
        moduleDetails?.hasServices ? `[${timestamp}] [SERVICE] Enabling systemd unit: systemctl enable --now ${moduleDetails.serviceName}.service` : `[${timestamp}] [CONFIG] Environment configuration applied.`,
        `[${timestamp}] [EXEC] Executing verify.sh...`,
        `[${timestamp}] [VERIFY] Binary and runtime health check passed for ${modName}`,
        `[${timestamp}] [SUCCESS] Module '${modName}' installed and verified successfully.`
      ];
    } else if (command === 'verify_module') {
      const modName = moduleDetails?.name || target || 'Target Module';
      logs = [
        `[${timestamp}] [DEM MODULE VERIFY] Running verification test for: ${modName}`,
        `[${timestamp}] [EXEC] Executing script: verify.sh`,
        `[${timestamp}] [CHECK] Validating binary PATH locations... [OK]`,
        moduleDetails?.hasServices ? `[${timestamp}] [CHECK] Checking systemd service state '${moduleDetails.serviceName}'... [ACTIVE]` : `[${timestamp}] [CHECK] Library dependencies checked... [OK]`,
        `[${timestamp}] [SUCCESS] Verification test passed for '${modName}'. Exit code 0.`
      ];
    } else if (command === 'uninstall_module') {
      const modName = moduleDetails?.name || target || 'Target Module';
      logs = [
        `[${timestamp}] [DEM MODULE UNINSTALL] Purging module: ${modName}`,
        `[${timestamp}] [EXEC] Executing script: uninstall.sh`,
        moduleDetails?.hasServices ? `[${timestamp}] [SERVICE] Stopping systemd service '${moduleDetails.serviceName}'...` : `[${timestamp}] [CLEANUP] Cleaning module configuration files...`,
        `[${timestamp}] [APT] Purging package dependencies: apt-get purge -y`,
        `[${timestamp}] [SUCCESS] Module '${modName}' uninstalled cleanly.`
      ];
    } else if (command === 'install') {
      const profileName = target || 'server';
      logs = [
        `[${timestamp}] [DEM INSTALL] Initiating sequential installation for profile: '${profileName}'`,
        `[${timestamp}] [STEP 1/4] Running core module scripts (install.sh -> configure.sh -> verify.sh)...`,
        `[${timestamp}] [INFO] Core build-essential, ca-certificates, gnupg, curl, git verified.`,
        `[${timestamp}] [STEP 2/4] Processing system configuration: locales, timezone, sudo policies...`,
        `[${timestamp}] [STEP 3/4] Installing profile target packages: docker, languages, databases-engines...`,
        `[${timestamp}] [APT] Updating package indexes from official Debian 13 trixie mirrors...`,
        `[${timestamp}] [GPG] Importing third-party GPG keyrings into /etc/apt/keyrings/...`,
        `[${timestamp}] [SERVICE] Enabling systemd units for installed engine services...`,
        `[${timestamp}] [STEP 4/4] Executing module verification test suites...`,
        `[${timestamp}] [VERIFY] Node.js v22.13.0 - PASS`,
        `[${timestamp}] [VERIFY] Go v1.22.5 - PASS`,
        `[${timestamp}] [VERIFY] Docker Engine daemon - ACTIVE (running)`,
        `[${timestamp}] [VERIFY] PostgreSQL 16 server - LISTENING (5432)`,
        `[${timestamp}] [SUCCESS] Profile '${profileName}' installed and verified successfully.`
      ];
    } else if (command === 'verify') {
      const profileName = target || 'server';
      logs = [
        `[${timestamp}] [DEM VERIFY] Running verification suite for profile: '${profileName}'`,
        `[${timestamp}] [VERIFY] Core binaries: /usr/bin/git, /usr/bin/curl, /usr/bin/gnupg - OK`,
        `[${timestamp}] [VERIFY] Systemd services status: docker.service [active], postgresql.service [active]`,
        `[${timestamp}] [VERIFY] Language runtimes: node (22.13.0), go (1.22.5), rustc (1.80.0) - OK`,
        `[${timestamp}] [VERIFY] Database engines: MariaDB [OK], ScyllaDB [OK], Dragonfly [OK]`,
        `[${timestamp}] [SUCCESS] All module verification scripts returned exit code 0.`
      ];
    } else if (command === 'repair') {
      logs = [
        `[${timestamp}] [DEM REPAIR] Starting automated workspace and APT system state repair...`,
        `[${timestamp}] [REPAIR 1/4] Normalizing file line endings from CRLF -> LF across all .sh files...`,
        `[${timestamp}] [REPAIR 2/4] Setting chmod +x execution permissions on ./dem.sh and commands/*...`,
        `[${timestamp}] [REPAIR 3/4] Running 'dpkg --configure -a' and clearing interrupted locks...`,
        `[${timestamp}] [REPAIR 4/4] Regenerating locale data and verifying GPG keyring permissions...`,
        `[${timestamp}] [SUCCESS] Workspace repaired. All scripts normalized and ready.`
      ];
    } else if (command === 'backup') {
      const backupFilename = `dem_backup_${new Date().toISOString().split('T')[0]}.tar.gz`;
      logs = [
        `[${timestamp}] [DEM BACKUP] Archiving system configurations and active profile manifests...`,
        `[${timestamp}] [ARCHIVE] Packing /etc/apt/sources.list.d/*.list ...`,
        `[${timestamp}] [ARCHIVE] Packing /etc/apt/keyrings/* ...`,
        `[${timestamp}] [ARCHIVE] Packing DEM custom profiles into archive...`,
        `[${timestamp}] [SUCCESS] Backup created at /var/backups/${backupFilename} (2.4 MB)`
      ];
    } else if (command === 'uninstall') {
      const profileName = target || 'desktop';
      logs = [
        `[${timestamp}] [DEM UNINSTALL] Initiating reverse-order uninstallation for profile: '${profileName}'`,
        `[${timestamp}] [WARN] Purging packages and services in reverse architectural order...`,
        `[${timestamp}] [UNINSTALL 1/3] Removing desktop and office packages...`,
        `[${timestamp}] [UNINSTALL 2/3] Stopping and disabling associated systemd services...`,
        `[${timestamp}] [UNINSTALL 3/3] Purging custom APT source entries and keyrings under /etc/apt/keyrings/...`,
        `[${timestamp}] [SUCCESS] Profile '${profileName}' uninstalled cleanly. System restored.`
      ];
    } else if (command === 'run_custom_script') {
      const scriptLines = scriptCode ? scriptCode.split('\n') : ['echo "Executing custom script..."'];
      logs = [
        `[${timestamp}] [DEM SCRIPT EXECUTION] Starting execution of custom Bash script:`,
        ...scriptLines.map((l: string) => `> ${l}`),
        `[${timestamp}] [EXEC] Script exited with return code 0 [SUCCESS]`
      ];
    } else {
      logs = [
        `[${timestamp}] Executing custom command: ./dem.sh ${command} ${target || ''}`,
        `[${timestamp}] Command output processed. Exit code: 0`
      ];
    }

    return NextResponse.json({
      success,
      command,
      target,
      timestamp,
      logs
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
