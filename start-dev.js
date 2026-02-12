/**
 * start-dev.js — Runs both backend and frontend dev servers simultaneously.
 * This enables live preview (HMR) in StackBlitz so every code change reflects instantly.
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('===========================================');
console.log('  VSBECART - KANAL 2k26: Rhythm of Logic');
console.log('  Starting Dev Servers...');
console.log('===========================================');

// Start Backend (Express + jsonDb)
const backend = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
});

// Small delay so backend starts first, then start frontend dev server
setTimeout(() => {
    console.log('\n  Launching Frontend Dev Server (Vite)...\n');
    const frontend = spawn('npx', ['vite', '--host', '0.0.0.0'], {
        cwd: path.join(__dirname, 'frontend'),
        stdio: 'inherit',
        shell: true
    });

    frontend.on('error', (err) => {
        console.error('Frontend failed to start:', err.message);
    });

    frontend.on('close', (code) => {
        console.log('Frontend exited with code', code);
        backend.kill();
        process.exit(code);
    });
}, 1500);

backend.on('error', (err) => {
    console.error('Backend failed to start:', err.message);
});

backend.on('close', (code) => {
    console.log('Backend exited with code', code);
    process.exit(code);
});

// Handle cleanup
process.on('SIGINT', () => {
    backend.kill();
    process.exit();
});
