#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

function git(args) {
  return spawnSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
}

function fail(message) {
  console.error(`pre-commit: ${message}`);
  process.exit(1);
}

const listed = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']);
if (listed.status !== 0) fail('não foi possível inspecionar o conteúdo staged');

const files = listed.stdout.split('\0').filter(Boolean);
const environmentFile = /(^|\/)\.env(?:\.|$)|(^|\/)\.dev\.vars(?:\.|$)/;
const allowedTemplate = /\.(?:example|sample|template)$/;
const credential =
  /^\s*(?:export\s+)?[A-Z0-9_.-]*(?:SECRET|PASSWORD|PASSWD|TOKEN|API_KEY|PRIVATE_KEY)[A-Z0-9_.-]*\s*=\s*(.+)$/gim;
const privateKey = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const placeholder =
  /^(?:|<[^>]+>|(?:change-?me|example|placeholder|your[-_].*|x+|test|development))$/i;

for (const file of files) {
  if (environmentFile.test(file) && !allowedTemplate.test(file)) {
    fail(`${JSON.stringify(file)} é um arquivo de ambiente não versionável`);
  }

  const blob = git(['show', `:${file}`]);
  if (blob.status !== 0) fail(`não foi possível ler ${JSON.stringify(file)} do índice`);
  if (privateKey.test(blob.stdout)) fail(`${JSON.stringify(file)} contém uma chave privada`);

  credential.lastIndex = 0;
  for (const match of blob.stdout.matchAll(credential)) {
    const value = (match[1] ?? '')
      .trim()
      .replace(/^['"]|['"]$/g, '')
      .trim();
    if (!placeholder.test(value)) fail(`${JSON.stringify(file)} parece conter uma credencial`);
  }
}

console.log('pre-commit: conteúdo sensível verificado');
const gate = spawnSync('npm', ['run', 'check'], { stdio: 'inherit' });
if (gate.status !== 0) fail('gate local falhou');
console.log('pre-commit: PASS');
