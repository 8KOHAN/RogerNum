import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const packagePath = join(root, 'package.json');
const lockPath = join(root, 'package-lock.json');
const configPath = join(root, 'wxt.config.ts');
const placeholderContentPath = join(root, 'src', 'entrypoints', 'content.ts');

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function ensureScript(scripts, name, command) {
  if (!scripts[name]) {
    scripts[name] = command;
  }
}

if (!(await exists(packagePath))) {
  console.error('ERROR: package.json was not found. Run this script from the RogerNum project root.');
  process.exit(1);
}

const packageJson = await readJson(packagePath);
packageJson.name = 'rogernum';
packageJson.version = '1.0.0';
packageJson.description = 'Open-source random number generator browser extension with 12 languages and 12 themes.';
packageJson.license = 'GPL-3.0-only';
packageJson.repository = {
  type: 'git',
  url: 'https://github.com/8KOHAN/RogerNum.git',
};
packageJson.homepage = 'https://github.com/8KOHAN/RogerNum#readme';
packageJson.bugs = { url: 'https://github.com/8KOHAN/RogerNum/issues' };
packageJson.keywords = [...new Set([
  ...(Array.isArray(packageJson.keywords) ? packageJson.keywords : []),
  'browser-extension',
  'random-number-generator',
  'wxt',
  'firefox',
  'chrome',
  'localization',
])];
packageJson.scripts ??= {};
ensureScript(packageJson.scripts, 'compile', 'tsc --noEmit');
ensureScript(packageJson.scripts, 'build', 'wxt build');
ensureScript(packageJson.scripts, 'build:firefox', 'wxt build -b firefox');
ensureScript(packageJson.scripts, 'build:chrome', 'wxt build -b chrome');
await writeJson(packagePath, packageJson);
console.log('Updated package.json metadata and ensured build scripts are present.');

if (await exists(lockPath)) {
  const lock = await readJson(lockPath);
  lock.name = packageJson.name;
  lock.version = packageJson.version;
  if (lock.packages && lock.packages['']) {
    lock.packages[''].name = packageJson.name;
    lock.packages[''].version = packageJson.version;
  }
  await writeJson(lockPath, lock);
  console.log('Synchronized package.json name/version in package-lock.json; dependency versions were not changed.');
} else {
  console.warn('WARNING: package-lock.json was not found; run npm install to create it if you use npm.');
}

if (await exists(configPath)) {
  let config = await readFile(configPath, 'utf8');
  const permissionsArray = /permissions\s*:\s*\[([^\]]*)\]/s;
  const match = config.match(permissionsArray);
  const alreadyMentionsStorage = /permissions\s*:[\s\S]{0,180}['"]storage['"]/.test(config);

  if (match) {
    if (!match[1].split(',').some((entry) => entry.trim().replace(/^['"]|['"]$/g, '') === 'storage')) {
      const trimmed = match[1].trim();
      const next = trimmed.length === 0 ? "'storage'" : ` 'storage',${trimmed.startsWith('\n') ? '' : ' '}${trimmed}`;
      config = config.replace(permissionsArray, `permissions: [${next}]`);
      await writeFile(configPath, config, 'utf8');
      console.log("Added the 'storage' permission to wxt.config.ts.");
    } else {
      console.log("The 'storage' permission is already present in wxt.config.ts.");
    }
  } else if (alreadyMentionsStorage) {
    console.log("wxt.config.ts appears to declare storage in a non-literal permissions configuration; review it manually.");
  } else if (/manifest\s*:\s*\{/.test(config)) {
    config = config.replace(/manifest\s*:\s*\{/, (opening) => `${opening}\n      permissions: ['storage'],`);
    await writeFile(configPath, config, 'utf8');
    console.log("Added the 'storage' permission to the manifest object in wxt.config.ts.");
  } else {
    console.warn("WARNING: Could not safely add 'storage' automatically. Check manifest permissions in wxt.config.ts.");
  }
} else {
  console.warn('WARNING: wxt.config.ts was not found; verify the WXT manifest permissions manually.');
}

if (await exists(placeholderContentPath)) {
  const content = await readFile(placeholderContentPath, 'utf8');
  const isPlaceholder = content.includes("console.log('Hello content.')")
    && content.includes("*://*.google.com/*")
    && content.includes('defineContentScript');

  if (isPlaceholder) {
    await unlink(placeholderContentPath);
    console.log('Removed the unused placeholder content script for Google pages.');
  } else {
    console.warn('WARNING: src/entrypoints/content.ts contains code beyond the known placeholder; it was preserved for manual review.');
  }
} else {
  console.log('No content script entrypoint exists; nothing to remove.');
}

function pngDimensions(buffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature)) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const iconSizes = [16, 48, 128];
const missingIcons = [];
const invalidIcons = [];
for (const size of iconSizes) {
  const iconPath = join(root, 'public', `icon-${size}.png`);
  if (!(await exists(iconPath))) {
    missingIcons.push(`public/icon-${size}.png`);
    continue;
  }
  const image = await readFile(iconPath);
  const dimensions = pngDimensions(image);
  if (!dimensions || dimensions.width !== size || dimensions.height !== size) {
    invalidIcons.push(`public/icon-${size}.png (expected ${size}x${size} PNG)`);
  }
}

if (missingIcons.length > 0) {
  console.warn(`WARNING: Missing icon files: ${missingIcons.join(', ')}. Add your existing artwork with these names and sizes.`);
}
if (invalidIcons.length > 0) {
  console.warn(`WARNING: Icon dimensions/format need attention: ${invalidIcons.join(', ')}.`);
}
if (missingIcons.length === 0 && invalidIcons.length === 0) {
  console.log('Required 16x16, 48x48, and 128x128 PNG icons are present.');
}

console.log('\nPreparation step finished. Next run:');
console.log('  npm run compile');
console.log('  npm run build:firefox');
console.log('  npm run build:chrome');
console.log('Review any warnings above before submitting the extension to a store.');
