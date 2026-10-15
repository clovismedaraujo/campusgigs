import { spawnSync } from 'node:child_process';

// Filtra flags legadas do Jest (como --watchAll=false) e evita duplicar --passWithNoTests
const rawArgs = process.argv
  .slice(2)
  .filter((arg) => !arg.startsWith('--watchAll') && arg !== '--passWithNoTests');

const result = spawnSync('npx', ['vitest', 'run', '--passWithNoTests', ...rawArgs], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
