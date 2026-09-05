#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const entrypoint = path.resolve(rootDir, 'src', 'mcp', 'index.ts');
const tsxCli = path.resolve(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');

// If local tsx exists in node_modules, use it directly with current node binary
if (fs.existsSync(tsxCli)) {
  const child = spawn(process.execPath, [tsxCli, entrypoint, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('Failed to start NoiceSS MCP server:', err);
    process.exit(1);
  });
} else {
  // Fallback to npx for global or non-local installations
  const isWindows = process.platform === 'win32';
  const npxCmd = isWindows ? 'npx.cmd' : 'npx';

  const child = spawn(npxCmd, ['tsx', entrypoint, ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: isWindows,
    env: process.env,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('Failed to start NoiceSS MCP server:', err);
    process.exit(1);
  });
}
