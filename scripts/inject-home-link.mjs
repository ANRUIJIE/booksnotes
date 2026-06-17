import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'books.json'), 'utf8'));

const HOME_BTN = `<a href="../index.html" class="home-link" title="返回书架">书架</a>`;
const HOME_STYLE = `
.home-link{position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.2);color:#fff;text-decoration:none;font-size:12px;padding:4px 10px;border-radius:12px;white-space:nowrap}
.app-header{position:relative}
.app-header>div{margin-left:52px}
@media(min-width:769px){.home-link{left:24px}}`;

for (const book of BOOKS) {
  const file = path.join(ROOT, book.path);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('class="home-link"')) {
    console.log('skip (already injected):', book.path);
    continue;
  }
  html = html.replace(
    /<header class="app-header">/,
    `<header class="app-header">\n  ${HOME_BTN}`
  );
  if (!html.includes('.home-link{')) {
    html = html.replace('</style>', `${HOME_STYLE}\n</style>`);
  }
  fs.writeFileSync(file, html, 'utf8');
  console.log('injected:', book.path);
}
