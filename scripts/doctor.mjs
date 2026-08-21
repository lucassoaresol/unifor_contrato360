#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const requiredFiles = [
  'AGENTS.md',
  '.specs/STATE.md',
  '.specs/features/INDEX.md',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'vitest.config.ts',
  'wrangler.jsonc',
];

const failures = [];

function major(version) {
  return Number.parseInt(version.replace(/^v/, '').split('.')[0] ?? '', 10);
}

function commandVersion(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

const nodeVersion = process.version;
const npmFromUserAgent = process.env.npm_config_user_agent?.match(/(?:^|\s)npm\/([^\s]+)/)?.[1];
const npmVersion = npmFromUserAgent ?? commandVersion('npm', ['--version']);
if (major(nodeVersion) < 22) failures.push(`Node incompatível: ${nodeVersion}`);
if (!npmVersion || major(npmVersion) < 10)
  failures.push(`npm incompatível: ${npmVersion ?? 'ausente'}`);

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`arquivo ausente: ${file}`);
  }
}

try {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  if (!manifest.private) failures.push('package.json deve permanecer private');
} catch {
  failures.push('package.json inválido');
}

const gitRoot = commandVersion('git', ['rev-parse', '--show-toplevel']);
const gitStatus = gitRoot ? 'configurado' : 'não inicializado';
let dependencies = 'instaladas';
for (const packageFile of [
  'node_modules/hono/package.json',
  'node_modules/typescript/package.json',
  'node_modules/vite/package.json',
  'node_modules/wrangler/package.json',
]) {
  try {
    await access(packageFile);
  } catch {
    dependencies = 'incompletas';
  }
}
if (dependencies !== 'instaladas') failures.push('dependências incompletas; execute npm install');

console.log(`doctor: Node ${nodeVersion}; npm ${npmVersion ?? 'ausente'}`);
console.log(`doctor: Git ${gitStatus}; dependências ${dependencies}`);

if (failures.length > 0) {
  for (const failure of failures) console.error(`doctor: ${failure}`);
  process.exit(1);
}

console.log('doctor: PASS — ambiente pronto; aplicação ainda não iniciada');
