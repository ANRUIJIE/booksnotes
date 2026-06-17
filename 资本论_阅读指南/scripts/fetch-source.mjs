import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SOURCE_MAP, SOURCE_BASE } from '../data/source-map.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT, '_source');

async function fetchFile(relPath) {
  const url = SOURCE_BASE + encodeURI(relPath).replace(/%2F/g, '/');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${relPath}: ${res.status}`);
  return res.text();
}

async function main() {
  fs.mkdirSync(SOURCE_DIR, { recursive: true });
  const files = [...new Set(Object.values(SOURCE_MAP))];
  console.log(`Fetching ${files.length} chapter files...`);
  for (const rel of files) {
    const dest = path.join(SOURCE_DIR, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) {
      console.log(`  skip: ${rel}`);
      continue;
    }
    process.stdout.write(`  ${rel}...`);
    const text = await fetchFile(rel);
    fs.writeFileSync(dest, text, 'utf8');
    console.log(` OK (${(text.length / 1024).toFixed(0)} KB)`);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
