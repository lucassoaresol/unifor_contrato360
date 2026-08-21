#!/usr/bin/env node

import { lstat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hookPath = '.githooks';

function git(args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8' });
}

function fail(message) {
  console.error(`hooks: ${message}`);
  process.exit(1);
}

const repository = git(['rev-parse', '--show-toplevel']);
if (repository.status !== 0 || path.resolve(repository.stdout.trim()) !== root) {
  fail('inicialize o repositório Git nesta raiz antes de instalar hooks');
}

try {
  const hook = await lstat(path.join(root, hookPath, 'pre-commit'));
  if (!hook.isFile() || hook.isSymbolicLink())
    fail('pre-commit precisa ser um arquivo local regular');
} catch {
  fail('hook versionado não encontrado');
}

const configured = git(['config', '--local', 'core.hooksPath', hookPath]);
if (configured.status !== 0) fail('não foi possível configurar core.hooksPath');
console.log('hooks: core.hooksPath=.githooks');
