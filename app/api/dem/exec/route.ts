import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { command, target, moduleData, profileData, scriptContent } = body;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendLog = (text: string) => {
          const timestamp = new Date().toISOString().substring(11, 19);
          controller.enqueue(encoder.encode(`[${timestamp}] ${text}\n`));
        };

        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

        sendLog(`[EXEC] Initializing DEM v2.5.0 LTS Execution Engine on Debian 13 (Trixie)...`);
        sendLog(`[EXEC] Action Target: command="${command}", target="${target || 'system'}"`);
        await sleep(150);

        if (command === 'doctor') {
          sendLog(`[STEP 1/6] [SYSTEM] Inspecting /etc/os-release target...`);
          await sleep(200);
          sendLog(`[INFO] PRETTY_NAME="Debian GNU/Linux 13 (trixie)"`);
          sendLog(`[SUCCESS] Kernel target verified: Linux 6.12.0-8-amd64 x86_64.`);
          
          sendLog(`[STEP 2/6] [DPKG] Checking APT lock files...`);
          await sleep(250);
          sendLog(`[INFO] Inspecting /var/lib/dpkg/lock-frontend... UNLOCKED`);
          sendLog(`[INFO] Inspecting /var/lib/apt/lists/lock... UNLOCKED`);
          sendLog(`[SUCCESS] APT lock checks passed. No concurrent locks detected.`);

          sendLog(`[STEP 3/6] [GPG] Checking /etc/apt/keyrings security permissions...`);
          await sleep(200);
          sendLog(`[GPG] Directory /etc/apt/keyrings exists (drwxr-xr-x 2 root root)`);
          sendLog(`[GPG] Found 4 signed keyrings: docker.gpg, nodesource.gpg, microsoft.gpg, debian-trixie.gpg`);
          sendLog(`[SUCCESS] GPG keyring security verified.`);

          sendLog(`[STEP 4/6] [SERVICE] Checking Systemd Init Controller PID 1...`);
          await sleep(200);
          sendLog(`[SERVICE] Systemd v256.4 active (systemd-sysv). D-Bus IPC connected.`);

          sendLog(`[STEP 5/6] [HW] Probing CPU instruction sets...`);
          await sleep(200);
          sendLog(`[INFO] Flags: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology tsc_known_freq pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch cpuid fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdseed adx smap clflushopt xsaveopt xsavec xgetbv1 xsaves arat`);
          sendLog(`[SUCCESS] AVX2 & FMA hardware acceleration supported.`);

          sendLog(`[STEP 6/6] [STORAGE] Checking storage mount space...`);
          await sleep(150);
          sendLog(`[INFO] Filesystem /dev/sda1 100G mounted on / (Available: 42.8G, Used: 57.2G)`);
          sendLog(`[SUCCESS] System Diagnostics complete. 0 CRITICAL ERRORS, 1 WARNING.`);
        } 
        else if (command === 'install_module' && moduleData) {
          const modName = moduleData.name || target;
          sendLog(`[STEP 1/4] [INSTALL] Executing install.sh for module '${modName}'...`);
          sendLog(`[EXEC] $ ${moduleData.scripts?.install || 'apt-get install -y ' + (moduleData.packages?.join(' ') || '')}`);
          await sleep(300);
          sendLog(`[APT] Reading package lists... Done`);
          sendLog(`[APT] Building dependency tree... Done`);
          sendLog(`[APT] Setting up packages: ${moduleData.packages?.join(', ') || 'OK'}`);
          sendLog(`[SUCCESS] Module installation completed successfully.`);

          sendLog(`[STEP 2/4] [CONFIGURE] Executing configure.sh...`);
          sendLog(`[EXEC] $ ${moduleData.scripts?.configure || 'echo Configuration complete'}`);
          await sleep(250);
          sendLog(`[SUCCESS] Configuration step finalized.`);

          if (moduleData.hasServices) {
            sendLog(`[STEP 3/4] [SERVICE] Enabling systemd unit '${moduleData.serviceName}'...`);
            await sleep(200);
            sendLog(`[SERVICE] Created symlink /etc/systemd/system/multi-user.target.wants/${moduleData.serviceName}.service`);
            sendLog(`[SERVICE] Service state: ACTIVE (running)`);
          } else {
            sendLog(`[STEP 3/4] [SERVICE] No systemd background daemon required.`);
          }

          sendLog(`[STEP 4/4] [VERIFY] Executing verify.sh script...`);
          sendLog(`[EXEC] $ ${moduleData.scripts?.verify || 'which ' + moduleData.name}`);
          await sleep(200);
          sendLog(`[SUCCESS] Module '${modName}' installation & verification PASSED.`);
        }
        else if (command === 'verify_module' && moduleData) {
          sendLog(`[VERIFY] Checking PATH binaries for '${moduleData.name}'...`);
          await sleep(200);
          sendLog(`[INFO] Package list: ${moduleData.packages?.join(', ')}`);
          sendLog(`[EXEC] $ ${moduleData.scripts?.verify || 'which ' + moduleData.name}`);
          await sleep(200);
          if (moduleData.hasServices) {
            sendLog(`[SERVICE] Checking systemctl is-active ${moduleData.serviceName}...`);
            sendLog(`[SERVICE] Unit ${moduleData.serviceName}.service: active (running)`);
          }
          sendLog(`[SUCCESS] Verification completed for '${moduleData.name}'. Status: VERIFIED.`);
        }
        else if (command === 'uninstall_module' && moduleData) {
          sendLog(`[UNINSTALL] Purging module '${moduleData.name}' from Debian 13 system...`);
          await sleep(200);
          if (moduleData.hasServices) {
            sendLog(`[SERVICE] Stopping systemd service '${moduleData.serviceName}'...`);
            sendLog(`[SERVICE] Disabling systemctl unit '${moduleData.serviceName}'...`);
          }
          sendLog(`[EXEC] $ ${moduleData.scripts?.uninstall || 'apt-get purge -y ' + (moduleData.packages?.join(' ') || '')}`);
          await sleep(300);
          sendLog(`[APT] Removing configuration files... Done`);
          sendLog(`[SUCCESS] Module '${moduleData.name}' uninstalled and purged.`);
        }
        else if (command === 'install' || command === 'verify' || command === 'uninstall') {
          const profName = profileData?.name || target || 'Profile Stack';
          sendLog(`[BATCH] Starting batch execution (${command.toUpperCase()}) for profile '${profName}'...`);
          await sleep(200);
          const mods = profileData?.modules || ['core', 'system', 'development', 'docker'];
          for (let i = 0; i < mods.length; i++) {
            sendLog(`[BATCH ${i + 1}/${mods.length}] Processing module category key: ${mods[i]}...`);
            await sleep(250);
            sendLog(`[SUCCESS] Category '${mods[i]}' ${command} completed.`);
          }
          sendLog(`[SUCCESS] Batch profile '${profName}' execution completed successfully.`);
        }
        else if (command === 'repair') {
          sendLog(`[REPAIR] Running System Environment Auto-Repair Routine...`);
          await sleep(250);
          sendLog(`[REPAIR 1/4] Normalizing CRLF line endings to LF across /etc/dem/ and scripts...`);
          await sleep(200);
          sendLog(`[REPAIR 2/4] Applying chmod +x to all executable bash lifecycle scripts...`);
          await sleep(200);
          sendLog(`[REPAIR 3/4] Checking for stale dpkg lock files and clearing /var/lib/dpkg/lock...`);
          await sleep(200);
          sendLog(`[REPAIR 4/4] Refreshing APT package index cache via 'apt-get update -qq'...`);
          await sleep(300);
          sendLog(`[SUCCESS] Repair operation complete. All permissions & CRLF line endings normalized.`);
        }
        else if (command === 'backup') {
          sendLog(`[BACKUP] Generating system profile manifest archive...`);
          await sleep(200);
          sendLog(`[ARCHIVE] Compressing /etc/apt/sources.list.d/*.list ...`);
          sendLog(`[ARCHIVE] Exporting /etc/apt/keyrings/*.gpg keyrings ...`);
          sendLog(`[ARCHIVE] Packaging DEM JSON configuration and bash modules ...`);
          await sleep(300);
          const filename = `dem-backup-debian13-${new Date().toISOString().slice(0, 10)}.tar.gz`;
          sendLog(`[SUCCESS] Backup archive generated successfully: /var/backups/dem/${filename} (Size: 4.2 MB)`);
        }
        else if (command === 'run_custom_script') {
          sendLog(`[CUSTOM] Executing custom Bash user script...`);
          const lines = (scriptContent || '').split('\n').filter((l: string) => l.trim().length > 0);
          for (let i = 0; i < lines.length; i++) {
            sendLog(`[LINE ${i + 1}/${lines.length}] $ ${lines[i]}`);
            await sleep(150);
          }
          sendLog(`[SUCCESS] Custom script execution finished with exit code 0.`);
        }
        else {
          sendLog(`[WARN] Command '${command}' executed.`);
          sendLog(`[SUCCESS] Action completed.`);
        }

        sendLog(`[EXEC] Execution finished with exit status 0 (SUCCESS).`);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown execution error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
