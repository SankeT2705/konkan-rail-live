const { spawn, execSync } = require('child_process');
const path = require('path');

const root = __dirname;
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

function freePort(port) {
  if (isWindows) {
    try {
      const output = execSync('netstat -ano', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      for (const line of output.split('\n')) {
        if (line.includes(`:${port}`) && line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== process.pid.toString()) {
            console.log(`[dev] Freeing occupied port ${port} (PID ${pid})...`);
            try {
              execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
            } catch (_) {
              try {
                execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              } catch (_) {}
            }
          }
        }
      }
    } catch (_) {}
  }
}

// Ensure ports 3001 and 5173 are free before starting
freePort(3001);
freePort(5173);

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '  🚂 Starting Konkan Rail Live (Backend + Frontend)       ');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(root, 'backend'),
  stdio: 'inherit',
  shell: isWindows,
});

const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(root, 'frontend'),
  stdio: 'inherit',
  shell: isWindows,
});

function killPid(pid) {
  if (!pid) return;
  if (isWindows) {
    try {
      execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
    } catch (_) {}
  } else {
    try {
      process.kill(-pid);
    } catch (_) {
      try { process.kill(pid); } catch (_) {}
    }
  }
}

let cleanedUp = false;
function cleanup() {
  if (cleanedUp) return;
  cleanedUp = true;
  console.log('\nStopping servers...');
  killPid(backend?.pid);
  killPid(frontend?.pid);
  freePort(3001);
  freePort(5173);
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
