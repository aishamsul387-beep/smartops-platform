import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envLocalPath = path.join(root, '.env.local');
const envExamplePath = path.join(root, '.env.example');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .reduce((acc, line) => {
      const index = line.indexOf('=');

      if (index === -1) {
        return acc;
      }

      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();

      acc[key] = value;
      return acc;
    }, {});
}

const requiredVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_DEFAULT_PAGE_SIZE',
  'NEXT_PUBLIC_ENABLE_AI',
  'NEXT_PUBLIC_ENABLE_REPORT_EXPORT',
  'NEXT_PUBLIC_AUTH_STORAGE_KEY',
  'NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS'
];

const exampleVars = parseEnvFile(envExamplePath);
const localVars = parseEnvFile(envLocalPath);

const merged = {
  ...exampleVars,
  ...localVars,
  ...process.env
};

const missing = requiredVars.filter((key) => {
  const value = merged[key];
  return value === undefined || value === null || String(value).trim() === '';
});

console.log('========================================');
console.log(' SmartOps Environment Validation');
console.log('========================================');
console.log(`Root: ${root}`);
console.log('');

for (const key of requiredVars) {
  const exists = !missing.includes(key);
  console.log(`${exists ? 'OK   ' : 'MISS '} ${key}`);
}

console.log('');

if (missing.length > 0) {
  console.error('Environment validation failed.');
  console.error('Missing required variables:');
  for (const key of missing) {
    console.error(` - ${key}`);
  }
  process.exit(1);
}

console.log('Environment validation passed.');