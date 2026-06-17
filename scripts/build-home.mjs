import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'books.json'), 'utf8'));
const OUTPUT = path.join(ROOT, 'index.html');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const cards = BOOKS.map((b, i) => {
  const tags = b.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('');
  return `
    <a class="book-card" href="${esc(b.path)}" style="--accent:${esc(b.color)};animation-delay:${i * 0.06}s">
      <div class="book-accent"></div>
      <div class="book-body">
        <h2 class="book-title">${esc(b.title)}</h2>
        <p class="book-author">${esc(b.author)}</p>
        <p class="book-desc">${esc(b.desc)}</p>
        <div class="book-meta">
          <span class="chapters">${esc(b.chapters)}</span>
          <div class="tags">${tags}</div>
        </div>
      </div>
      <span class="book-arrow" aria-hidden="true">→</span>
    </a>`;
}).join('');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="theme-color" content="#1a1a2e"/>
<title>书架 · 阅读指南</title>
<style>
:root{
  --bg:#0f0f14;--surface:#1a1a24;--text:#f0f0f5;--text-muted:#9898a8;
  --border:rgba(255,255,255,.08);--safe-t:env(safe-area-inset-top,0px);--safe-b:env(safe-area-inset-bottom,0px)
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;background:var(--bg);color:var(--text);min-height:100vh;line-height:1.6}
.hero{padding:calc(28px + var(--safe-t)) 20px 24px;text-align:center;background:linear-gradient(180deg,#1a1a2e 0%,var(--bg) 100%)}
.hero h1{font-size:28px;font-weight:700;letter-spacing:.06em;margin-bottom:6px}
.hero p{color:var(--text-muted);font-size:14px;max-width:320px;margin:0 auto}
.stats{display:flex;justify-content:center;gap:24px;margin-top:20px}
.stat-num{font-size:22px;font-weight:700;color:#fff}
.stat-label{font-size:11px;color:var(--text-muted);margin-top:2px}
.shelf{padding:8px 16px calc(24px + var(--safe-b));max-width:640px;margin:0 auto}
.shelf-label{font-size:12px;color:var(--text-muted);letter-spacing:.12em;text-transform:uppercase;margin:16px 4px 12px}
.book-card{
  display:flex;align-items:stretch;gap:0;background:var(--surface);border:1px solid var(--border);
  border-radius:16px;margin-bottom:14px;text-decoration:none;color:inherit;overflow:hidden;
  position:relative;transition:transform .2s,box-shadow .2s;
  animation:fadeUp .45s ease both;
}
.book-card:active{transform:scale(.98)}
@media(hover:hover){.book-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.35)}}
.book-accent{width:5px;flex-shrink:0;background:var(--accent)}
.book-body{flex:1;padding:16px 12px 16px 16px;min-width:0}
.book-title{font-size:18px;font-weight:600;margin-bottom:2px;color:#fff}
.book-author{font-size:13px;color:var(--accent);margin-bottom:8px;font-weight:500}
.book-desc{font-size:13px;color:var(--text-muted);line-height:1.55;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.book-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.chapters{font-size:11px;background:rgba(255,255,255,.06);padding:3px 10px;border-radius:10px;color:var(--text-muted)}
.tags{display:flex;flex-wrap:wrap;gap:4px}
.tag{font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(255,255,255,.05);color:var(--text-muted);border:1px solid var(--border)}
.book-arrow{align-self:center;padding-right:16px;font-size:20px;color:var(--accent);opacity:.7}
footer{text-align:center;padding:20px;font-size:11px;color:var(--text-muted)}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
</head>
<body>
<header class="hero">
  <h1>书架</h1>
  <p>个人阅读指南 · 手机端优化 · 原文 / 笔记 / 框架 / 读法</p>
  <div class="stats">
    <div><div class="stat-num">${BOOKS.length}</div><div class="stat-label">本书</div></div>
    <div><div class="stat-num">4</div><div class="stat-label">Tab 模式</div></div>
  </div>
</header>
<main class="shelf">
  <div class="shelf-label">全部藏书</div>
  ${cards}
</main>
<footer>双击打开 · 支持手机浏览器 · GitHub Pages 托管</footer>
</body></html>`;

fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`Generated ${OUTPUT} (${BOOKS.length} books)`);
