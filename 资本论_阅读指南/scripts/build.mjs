import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BOOK_META, VOLUMES, MINDMAP, flattenChapters } from '../data/structure.mjs';
import { TERMS, termsForChapter } from '../data/terms.mjs';
import { GUIDES, READING_GUIDE, guidesForChapter } from '../data/guides.mjs';
import { KG_NODES, KG_EDGES } from '../data/knowledge-graph.mjs';
import { getChapterContent } from '../data/chapters.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'index.html');
const CHAPTERS = flattenChapters();

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderBody(blocks) {
  return blocks.map(b => {
    if (b.type === 'p') return `<p>${esc(b.text)}</p>`;
    if (b.type === 'def') return `<div class="term-inline"><strong>${esc(b.term)}</strong><span>${esc(b.text)}</span></div>`;
    if (b.type === 'highlight') return `<blockquote class="golden-quote">${esc(b.text)}</blockquote>`;
    return '';
  }).join('\n');
}

function renderStructureTree() {
  return VOLUMES.map(vol => `
    <details class="tree-vol" open>
      <summary class="tree-vol-title">${esc(vol.title)} <span>${esc(vol.subtitle)}</span></summary>
      ${vol.parts.map(part => `
        <details class="tree-part" open>
          <summary class="tree-part-title">${esc(part.title)} ${esc(part.name)}</summary>
          <ul class="tree-chapters">
            ${part.chapters.map(ch => `
              <li><button type="button" class="tree-ch-btn" data-ch="${ch.id}" title="${esc(ch.num + ' ' + ch.title)}">
                <span class="tree-ch-num">${esc(ch.num)}</span>
                <span class="tree-ch-name">${esc(ch.title)}</span>
              </button></li>`).join('')}
          </ul>
        </details>`).join('')}
    </details>`).join('');
}

function renderMindmap() {
  return MINDMAP.children.map(branch => `
    <div class="mind-branch">
      <div class="mind-root">${esc(branch.label)}</div>
      <div class="mind-children">
        ${branch.children.map(c => `
          <div class="mind-leaf">
            <span class="mind-label">${esc(c.label)}</span>
            <span class="mind-desc">${esc(c.desc)}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function renderChapterSections() {
  return CHAPTERS.map(ch => {
    const content = getChapterContent(ch.id);
    const chTerms = termsForChapter(ch.id);
    const chGuides = guidesForChapter(ch.id);
    return `
      <section id="${ch.id}" class="chapter-panel" data-ch="${ch.id}">
        <div class="ch-breadcrumb">${esc(ch.volTitle)} · ${esc(ch.partTitle)} ${esc(ch.partName)}</div>
        <h2 class="chapter-title">${esc(ch.fullTitle)}</h2>
        <p class="chapter-summary">${esc(content.summary)}</p>
        <div class="chapter-body">${renderBody(content.body)}</div>
        ${chTerms.length ? `<div class="ch-inline-terms"><h4>本章术语</h4>${chTerms.map(t => `<span class="term-chip" data-term="${t.id}">${esc(t.term)}</span>`).join('')}</div>` : ''}
        ${chGuides.length ? `<div class="ch-inline-guides"><h4>相关导读</h4>${chGuides.map(g => `<div class="guide-mini"><strong>${esc(g.author)}</strong>：${esc(g.title)}</div>`).join('')}</div>` : ''}
      </section>`;
  }).join('');
}

function renderTermsPanel() {
  return TERMS.map(t => `
    <article id="term-${t.id}" class="term-card" data-chapters="${t.chapters.join(',')}">
      <header class="term-head">
        <h3>${esc(t.term)}</h3>
        ${t.en ? `<span class="term-en">${esc(t.en)}</span>` : ''}
      </header>
      <p class="term-def">${esc(t.def)}</p>
      ${t.history ? `<p class="term-history"><em>典据</em> ${esc(t.history)}</p>` : ''}
      <footer class="term-refs">${t.refs.map(r => `<span>${esc(r)}</span>`).join('')}</footer>
    </article>`).join('');
}

function renderGuidesPanel() {
  const guideCards = GUIDES.map(g => `
    <article class="guide-card">
      <header><span class="guide-era">${esc(g.era)}</span><h3>${esc(g.title)}</h3><p class="guide-author">${esc(g.author)}</p></header>
      <p class="guide-excerpt">${esc(g.excerpt)}</p>
      <div class="guide-tags">${g.topics.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    </article>`).join('');

  const phases = READING_GUIDE.phases.map(p => `
    <details class="phase-card">
      <summary><span class="phase-num">${esc(p.phase)}</span><em>${esc(p.duration)}</em></summary>
      <ol>${p.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    </details>`).join('');

  return guideCards + `<div class="reading-phases"><h3>四遍读法</h3>${phases}</div>
    <div class="tips-box"><h3>阅读提示</h3><ul>${READING_GUIDE.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
}

function renderKnowledgeGraph() {
  const nodesJson = JSON.stringify(KG_NODES);
  const edgesJson = JSON.stringify(KG_EDGES);
  return `
    <div class="kg-legend">
      <span data-type="concept">概念</span><span data-type="person">人物</span><span data-type="event">事件</span><span data-type="volume">分卷</span>
    </div>
    <div class="kg-canvas-wrap"><canvas id="kgCanvas"></canvas></div>
    <div id="kgTooltip" class="kg-tooltip"></div>
    <div class="kg-node-list">
      ${KG_NODES.map(n => `<button type="button" class="kg-node-btn" data-kg="${n.id}">${esc(n.label)}</button>`).join('')}
    </div>
    <script type="application/json" id="kgData">${nodesJson}</script>
    <script type="application/json" id="kgEdges">${edgesJson}</script>`;
}

function generateHtml() {
  const meta = BOOK_META;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="theme-color" content="${meta.themeColor}"/>
<title>${esc(meta.title)} · 阅读指南</title>
<style>
:root{
  --bg:#f7f5f3;--surface:#fff;--text:#1a1a1a;--text-muted:#6b6b6b;
  --accent:${meta.accent};--accent-light:${meta.accentLight};--border:#e5e0dc;
  --col-left:240px;--col-right:300px;--header-h:52px;--nav-h:56px;
  --safe-b:env(safe-area-inset-bottom,0px);--safe-t:env(safe-area-inset-top,0px);
  --max-read:1440px
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans SC",serif;background:var(--bg);color:var(--text);line-height:1.75}
.app-header{position:sticky;top:0;z-index:300;background:var(--accent);color:#fff;padding:calc(10px + var(--safe-t)) 16px 10px;display:flex;align-items:center;gap:12px;min-height:var(--header-h)}
.app-header h1{font-size:17px;font-weight:700;flex:1;line-height:1.3}
.app-header .subtitle{font-size:11px;opacity:.88;margin-top:2px}
.header-btn{background:rgba(255,255,255,.18);border:none;color:#fff;padding:6px 12px;border-radius:14px;font-size:12px;cursor:pointer;white-space:nowrap}
.app-shell{max-width:var(--max-read);margin:0 auto}

/* 三栏布局：宽屏 ≥1600px */
.three-col{display:none}
@media(min-width:1600px){
  body{padding-bottom:0}
  .mobile-only,.bottom-nav{display:none!important}
  .three-col{display:grid;grid-template-columns:var(--col-left) 1fr var(--col-right);gap:0;min-height:calc(100vh - var(--header-h));max-width:none}
  .col-left,.col-right{background:var(--surface);border-color:var(--border);overflow-y:auto;max-height:calc(100vh - var(--header-h));position:sticky;top:var(--header-h)}
  .col-left{border-right:1px solid var(--border);padding:12px 0}
  .col-right{border-left:1px solid var(--border);padding:12px}
  .col-center{padding:24px 32px;overflow-y:auto;max-height:calc(100vh - var(--header-h))}
  .col-panel-title{font-size:11px;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;padding:8px 14px 6px;font-weight:600}
}

/* 单栏：1440 及以下 / 平板手机 */
.single-col{display:block;padding-bottom:calc(var(--nav-h) + var(--safe-b) + 12px)}
@media(min-width:1600px){.single-col{display:none}}
.tab-panel{display:none;padding:12px 16px}
.tab-panel.active{display:block}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:400;display:flex;background:var(--surface);border-top:1px solid var(--border);padding-bottom:var(--safe-b);height:calc(var(--nav-h) + var(--safe-b))}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border:none;background:none;cursor:pointer;color:var(--text-muted);font-size:9px;padding:4px 0}
.nav-item svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8}
.nav-item.active{color:var(--accent);font-weight:600}

/* 结构树 */
.tree-vol{margin:0 8px 8px}
.tree-vol-title,.tree-part-title{cursor:pointer;font-size:13px;font-weight:600;padding:8px 10px;list-style:none;color:var(--accent)}
.tree-vol-title span,.tree-part-title{font-weight:400;color:var(--text-muted);font-size:12px}
.tree-part{margin-left:4px}
.tree-chapters{list-style:none;padding:0 4px 8px}
.tree-ch-btn{display:flex;flex-direction:column;align-items:flex-start;width:100%;text-align:left;padding:6px 10px;border:none;background:none;cursor:pointer;border-radius:6px;font-size:12px;color:var(--text);gap:1px}
.tree-ch-btn:hover,.tree-ch-btn.active{background:var(--accent-light);color:var(--accent)}
.tree-ch-num{font-weight:600;font-size:11px}
.tree-ch-name{font-size:11px;color:var(--text-muted);line-height:1.35}
.tree-ch-btn.active .tree-ch-name{color:var(--accent)}

/* 思维导图 */
.mind-branch{margin:8px 12px 16px}
.mind-root{font-size:13px;font-weight:700;color:var(--accent);margin-bottom:8px;padding-left:8px;border-left:3px solid var(--accent)}
.mind-children{display:flex;flex-direction:column;gap:6px}
.mind-leaf{background:var(--accent-light);border-radius:8px;padding:8px 10px}
.mind-label{font-size:12px;font-weight:600;display:block}
.mind-desc{font-size:11px;color:var(--text-muted)}

/* 原文 */
.chapter-panel{display:none;margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid var(--border)}
.chapter-panel.active{display:block}
.ch-breadcrumb{font-size:11px;color:var(--text-muted);margin-bottom:6px}
.chapter-title{font-size:20px;color:var(--accent);margin-bottom:10px;line-height:1.4}
.chapter-summary{font-size:14px;color:var(--text-muted);margin-bottom:16px;padding:12px;background:var(--accent-light);border-radius:8px;line-height:1.6}
.chapter-body p{margin-bottom:12px;text-indent:2em;font-size:15px;line-height:1.85}
.term-inline{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin:12px 0}
.term-inline strong{display:block;color:var(--accent);margin-bottom:4px;font-size:14px}
.golden-quote{border-left:4px solid var(--accent);padding:12px 16px;margin:16px 0;background:var(--accent-light);font-size:14px;color:var(--accent);font-weight:500;text-indent:0;line-height:1.7}
.ch-inline-terms,.ch-inline-guides{margin-top:20px;padding-top:16px;border-top:1px dashed var(--border)}
.ch-inline-terms h4,.ch-inline-guides h4{font-size:12px;color:var(--text-muted);margin-bottom:8px}
.term-chip{display:inline-block;font-size:11px;padding:3px 10px;margin:2px 4px 2px 0;background:var(--accent-light);color:var(--accent);border-radius:12px;cursor:pointer}
.guide-mini{font-size:13px;margin-bottom:6px;color:var(--text-muted)}

/* 术语 */
.term-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px}
.term-head{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
.term-head h3{font-size:15px;color:var(--accent)}
.term-en{font-size:11px;color:var(--text-muted)}
.term-def{font-size:13px;line-height:1.6;margin-bottom:6px}
.term-history{font-size:12px;color:var(--text-muted);line-height:1.5}
.term-history em{color:var(--accent);font-style:normal;margin-right:4px}
.term-refs span{font-size:10px;background:var(--bg);padding:2px 8px;border-radius:8px;margin-right:4px;color:var(--text-muted)}

/* 导读 */
.guide-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px}
.guide-era{font-size:10px;color:var(--accent);background:var(--accent-light);padding:2px 8px;border-radius:8px}
.guide-card h3{font-size:15px;margin:8px 0 4px;color:var(--text)}
.guide-author{font-size:12px;color:var(--text-muted)}
.guide-excerpt{font-size:13px;line-height:1.65;color:var(--text-muted);margin:8px 0}
.guide-tags span{font-size:10px;padding:2px 8px;border:1px solid var(--border);border-radius:8px;margin-right:4px;color:var(--text-muted)}
.phase-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;padding:12px 16px}
.phase-card summary{cursor:pointer;font-weight:600;font-size:14px}
.phase-card ol{padding-left:20px;margin-top:8px;font-size:13px}
.tips-box{background:var(--accent-light);border-radius:12px;padding:16px;margin-top:16px}
.tips-box h3{color:var(--accent);font-size:14px;margin-bottom:8px}
.tips-box li{font-size:13px;margin-bottom:4px}

/* 知识图谱 */
.kg-legend{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;font-size:11px}
.kg-legend span{padding:3px 10px;border-radius:10px;background:var(--surface);border:1px solid var(--border)}
.kg-legend [data-type="concept"]{border-color:var(--accent);color:var(--accent)}
.kg-canvas-wrap{width:100%;height:280px;background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:12px}
@media(min-width:1600px){.kg-canvas-wrap{height:320px}}
#kgCanvas{width:100%;height:100%;touch-action:none}
.kg-tooltip{position:fixed;display:none;background:var(--text);color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;z-index:500;pointer-events:none}
.kg-node-list{display:flex;flex-wrap:wrap;gap:6px}
.kg-node-btn{font-size:11px;padding:4px 10px;border:1px solid var(--border);background:var(--surface);border-radius:14px;cursor:pointer;color:var(--text)}
.kg-node-btn:hover,.kg-node-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}

/* 桌面右栏 */
.sb-tab{font-size:11px;padding:6px 12px;border:1px solid var(--border);background:var(--bg);border-radius:8px;cursor:pointer;margin-right:4px;margin-bottom:8px;color:var(--text-muted)}
.sb-tab.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.sb-panel{display:none}
.sb-panel.active{display:block}

/* 抽屉（手机目录） */
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:450;opacity:0;visibility:hidden;transition:.25s}
.drawer-overlay.open{opacity:1;visibility:visible}
.chapter-drawer{position:fixed;left:0;right:0;bottom:0;z-index:451;background:var(--surface);border-radius:16px 16px 0 0;max-height:80vh;transform:translateY(100%);transition:.3s;display:flex;flex-direction:column;padding-bottom:var(--safe-b)}
.chapter-drawer.open{transform:translateY(0)}
.drawer-header{display:flex;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)}
.drawer-header h2{font-size:15px;color:var(--accent)}
.drawer-close{background:none;border:none;font-size:22px;color:var(--text-muted);cursor:pointer}
.drawer-body{overflow-y:auto;padding:8px 0;flex:1}

/* 平板：单栏但隐藏底部部分 tab 文字 */
@media(min-width:768px) and (max-width:1599px){
  .single-col .tab-panel{padding:20px 24px;max-width:900px;margin:0 auto}
  .nav-item{font-size:11px;flex-direction:row;gap:4px}
  .bottom-nav{position:sticky;top:var(--header-h);height:var(--nav-h);padding-bottom:0}
  body{padding-bottom:0}
}
</style>
</head>
<body>
<header class="app-header">
  <div><h1>${esc(meta.title)}</h1><div class="subtitle">${esc(meta.subtitle)} · ${esc(meta.edition)}</div></div>
  <button type="button" class="header-btn mobile-only" id="openDrawer">目录</button>
</header>

<!-- 宽屏三栏 -->
<div class="three-col app-shell">
  <aside class="col-left">
    <div class="col-panel-title">结构总览</div>
    <div class="mindmap-wrap">${renderMindmap()}</div>
    <div class="col-panel-title">章节目录</div>
    <nav class="structure-tree">${renderStructureTree()}</nav>
  </aside>
  <main class="col-center" id="desktopMain">
    ${renderChapterSections()}
  </main>
  <aside class="col-right" id="desktopSidebar">
    <div class="sidebar-tabs">
      <button type="button" class="sb-tab active" data-sb="terms">术语</button>
      <button type="button" class="sb-tab" data-sb="guides">导读</button>
      <button type="button" class="sb-tab" data-sb="kg">图谱</button>
    </div>
    <div class="sb-panel active" id="sb-terms">${renderTermsPanel()}</div>
    <div class="sb-panel" id="sb-guides">${renderGuidesPanel()}</div>
    <div class="sb-panel" id="sb-kg">${renderKnowledgeGraph()}</div>
  </aside>
</div>

<!-- 单栏（≤1599px，含手机） -->
<div class="single-col">
  <section id="tab-read" class="tab-panel active">${renderChapterSections()}</section>
  <section id="tab-structure" class="tab-panel">
    <h2 class="section-title" style="font-size:18px;color:var(--accent);margin-bottom:16px">思维导图与结构总览</h2>
    ${renderMindmap()}
    <h3 style="font-size:15px;margin:20px 0 12px;color:var(--accent)">章节目录</h3>
    <nav class="structure-tree">${renderStructureTree()}</nav>
  </section>
  <section id="tab-terms" class="tab-panel">${renderTermsPanel()}</section>
  <section id="tab-kg" class="tab-panel">
    <h2 class="section-title" style="font-size:18px;color:var(--accent);margin-bottom:12px">知识图谱</h2>
    ${renderKnowledgeGraph()}
  </section>
  <section id="tab-guides" class="tab-panel">${renderGuidesPanel()}</section>
</div>

<nav class="bottom-nav" role="tablist">
  <button type="button" class="nav-item active" data-tab="tab-read"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><span>原文</span></button>
  <button type="button" class="nav-item" data-tab="tab-structure"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><span>结构</span></button>
  <button type="button" class="nav-item" data-tab="tab-terms"><svg viewBox="0 0 24 24"><path d="M4 19.5h16"/><path d="M4 4h16v12H4z"/></svg><span>术语</span></button>
  <button type="button" class="nav-item" data-tab="tab-kg"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><line x1="7" y1="7" x2="10" y2="10"/><line x1="17" y1="7" x2="14" y2="10"/></svg><span>图谱</span></button>
  <button type="button" class="nav-item" data-tab="tab-guides"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span>导读</span></button>
</nav>

<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="chapter-drawer" id="chapterDrawer">
  <div class="drawer-header"><h2>章节目录</h2><button type="button" class="drawer-close" id="closeDrawer">×</button></div>
  <div class="drawer-body structure-tree">${renderStructureTree()}</div>
</div>

<script>
(function(){
  const firstCh = ${JSON.stringify(CHAPTERS[0]?.id || 'v1c01')};

  function showChapter(id) {
    document.querySelectorAll('.chapter-panel').forEach(p => p.classList.toggle('active', p.id === id));
    document.querySelectorAll('.tree-ch-btn').forEach(b => b.classList.toggle('active', b.dataset.ch === id));
    const panel = document.getElementById(id);
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    filterSidebar(id);
  }

  function filterSidebar(chId) {
    document.querySelectorAll('.term-card').forEach(card => {
      const chs = (card.dataset.chapters || '').split(',');
      card.style.display = !chId || chs.includes(chId) ? '' : 'none';
    });
  }

  document.querySelectorAll('.tree-ch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showChapter(btn.dataset.ch);
      closeDrawer();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const readTab = document.querySelector('[data-tab="tab-read"]');
      const readPanel = document.getElementById('tab-read');
      if (readTab) readTab.classList.add('active');
      if (readPanel) readPanel.classList.add('active');
    });
  });

  document.querySelectorAll('.term-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const el = document.getElementById('term-' + chip.dataset.term);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('chapterDrawer');
  function openDrawer() { overlay.classList.add('open'); drawer.classList.add('open'); }
  function closeDrawer() { overlay.classList.remove('open'); drawer.classList.remove('open'); }
  document.getElementById('openDrawer')?.addEventListener('click', openDrawer);
  document.getElementById('closeDrawer')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.single-col .tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(btn.dataset.tab)?.classList.add('active');
      if (btn.dataset.tab === 'tab-kg') initKG();
    });
  });

  document.querySelectorAll('.sb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sb-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('sb-' + tab.dataset.sb)?.classList.add('active');
      if (tab.dataset.sb === 'kg') initKG();
    });
  });

  let kgInited = false;
  function initKG() {
    if (kgInited) return;
    kgInited = true;
    const canvas = document.getElementById('kgCanvas');
    if (!canvas) return;
    const nodes = JSON.parse(document.getElementById('kgData').textContent);
    const edges = JSON.parse(document.getElementById('kgEdges').textContent);
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('kgTooltip');
    const colors = { concept: '#8B1538', person: '#1565C0', event: '#E65100', volume: '#2E7D32' };
    const W = canvas.parentElement.clientWidth, H = canvas.parentElement.clientHeight;
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36;
    const pos = {};
    nodes.forEach((n, i) => {
      const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      pos[n.id] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), n };
    });
    function draw(highlight) {
      ctx.clearRect(0, 0, W, H);
      edges.forEach(e => {
        const a = pos[e.from], b = pos[e.to];
        if (!a || !b) return;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1; ctx.stroke();
      });
      nodes.forEach(n => {
        const p = pos[n.id]; if (!p) return;
        const r = (n.size || 2) * 5 + (highlight === n.id ? 4 : 0);
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors[n.type] || '#888'; ctx.fill();
        if (highlight === n.id) { ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke(); }
        ctx.fillStyle = '#333'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.label, p.x, p.y + r + 12);
      });
    }
    draw(null);
    canvas.addEventListener('click', ev => {
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
      let hit = null;
      nodes.forEach(n => {
        const p = pos[n.id]; const r = (n.size || 2) * 5 + 8;
        if (Math.hypot(p.x - x, p.y - y) < r) hit = n.id;
      });
      draw(hit);
      document.querySelectorAll('.kg-node-btn').forEach(b => b.classList.toggle('active', b.dataset.kg === hit));
    });
    document.querySelectorAll('.kg-node-btn').forEach(btn => {
      btn.addEventListener('click', () => { draw(btn.dataset.kg); document.querySelectorAll('.kg-node-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); });
    });
  }

  showChapter(firstCh);
  if (window.innerWidth >= 1600) initKG();
  window.addEventListener('resize', () => { if (window.innerWidth < 1600 && document.getElementById('tab-kg')?.classList.contains('active')) initKG(); });
})();
</script>
</body></html>`;
}

const html = generateHtml();
fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`Generated ${OUTPUT}`);
console.log(`Chapters: ${CHAPTERS.length}, Terms: ${TERMS.length}, Guides: ${GUIDES.length}`);
