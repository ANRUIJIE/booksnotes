import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_TXT = path.join(ROOT, '_source', '国富论.txt');
const OUTPUT = path.join(ROOT, 'index.html');

const BOOK_META = {
  title: '国富论',
  subtitle: '亚当·斯密 著 · 郭大力/王亚南 译 · 阅读指南',
  themeColor: '#1a5276',
  accent: '#1a5276',
  accentLight: '#e8f0f5',
};

const PART_THEMES = {
  intro: { name: '序论', theme: '全书五篇总设计：国民财富来自劳动、资本与政策', flow: ['劳动供给', '生产力', '资本', '政策', '国家收入'] },
  p1: { name: '第一篇', theme: '分工、价格与收入在工资·利润·地租间的分配', flow: ['分工', '交换', '货币', '价格', '工资利润地租'] },
  p2: { name: '第二篇', theme: '资本：流动/固定、积累与生产性劳动', flow: ['资财划分', '货币', '资本积累', '利息', '资本用途'] },
  p3: { name: '第三篇', theme: '不同国家财富发展：农业、城市与商业的历史', flow: ['自然发展', '农业阻抑', '都市勃兴', '商业改良农村'] },
  p4: { name: '第四篇', theme: '批判重商主义与重农主义：政治经济学体系', flow: ['重商原理', '贸易限制', '殖民地', '重农学说'] },
  p5: { name: '第五篇', theme: '君主/国家费用、税收、公债与帝国财政', flow: ['国防司法', '税收', '公债'] },
};

const READING_GUIDE = {
  phases: [
    { phase: '第一遍：抓框架', duration: '3-5天', steps: ['精读「序论及全书设计」，记住五篇各自回答什么问题', '浏览各篇章名，建立「分工→资本→历史→学说→财政」地图', '重点标记：分工、自然价格、资本积累、重商主义、公债', '读完后看「框架」Tab，对照五篇逻辑'] },
    { phase: '第二遍：精读核心篇', duration: '2-3周', steps: ['第一篇第1-3章：分工与交换——全书地基', '第一篇第5-7章：真实价格与自然价格——理解「看不见的手」的前提', '第二篇第2-3章：货币与资本积累', '第四篇第1-2章：重商主义批判——与现代贸易政策的对话'] },
    { phase: '第三遍：专题深读', duration: '2-4周', steps: ['按兴趣选读：地租（第一篇11章）/ 利息（第二篇4章）/ 殖民地（第四篇7章）', '每章用「笔记」Tab 的逻辑流复盘', '对照今日经济现象：分工、比较优势、资本流向、贸易保护', '第五篇公债论与当代财政债务对照阅读'] },
    { phase: '第四遍：输出与贯通', duration: '持续', steps: ['用费曼技巧向朋友讲解一章（如扣针分工）', '写一页纸：斯密如何定义「国民财富」', '与《穷爸爸富爸爸》对照：资本观、劳动观差异', '重读序论，检验是否能把五篇串成一条线'] },
  ],
  tips: [
    '不必按页数均等分配时间——第一篇与第四篇是思想密度最高的部分',
    '「真实价格」= 劳动量；「名义价格」= 货币表现——全书价格理论的钥匙',
    '第三篇偏历史叙述，可略读抓结论，把时间留给第二、四篇',
    '译本用「那末」「的」等时代用语，不影响理解核心论证',
    '手机阅读：用底部「目录」快速跳转，每章末有本章总结',
  ],
};

const PART_HEADER = /^第[一二三四五]篇[　\s]/;
const CHAPTER_HEADER = /^第[一二三四五六七八九十百]+章[　\s]/;
const PART_INTRO = /^序论$/;
const BOOK_INTRO = /^序论及全书设计/;

function readTxt() {
  let text = fs.readFileSync(SOURCE_TXT, 'utf8');
  if (text.startsWith('序论及全书设计') && !text.startsWith('序论及全书设计\n')) {
    text = text.replace(/^序论及全书设计/, '序论及全书设计\n');
  }
  return text;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isBodyLine(line) {
  return /^\u3000/.test(line);
}

function stripIndent(line) {
  return line.replace(/^[\u3000\s]+/, '').trim();
}

function isTitleContinuation(line) {
  const t = line.trim();
  if (!t || isBodyLine(line)) return false;
  if (PART_HEADER.test(t) || CHAPTER_HEADER.test(t) || PART_INTRO.test(t)) return false;
  if (/^第[一二三四五六七八九十百]+节/.test(t)) return false;
  if (/^[一二三四五六七八九十]+[、，]/.test(t)) return false;
  return t.length <= 42;
}

function mergeTitleLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function chapterSubtitle(title) {
  if (title === '序论及全书设计') return '全书设计';
  if (/· 序论$/.test(title)) return '本篇序论';
  const m = title.match(/^第[^　\s]+章[　\s]*(.*)$/);
  return m?.[1]?.trim() || '';
}

function detectMarkers(lines) {
  const markers = [];
  let currentPart = 'intro';
  let partTitle = '序论';

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    if (!t) continue;

    if (BOOK_INTRO.test(t)) {
      markers.push({ lineIndex: i, kind: 'intro', partKey: 'intro', title: '序论及全书设计', short: '序论' });
      currentPart = 'intro';
      partTitle = '序论';
      continue;
    }
    if (PART_HEADER.test(t)) {
      const partNum = t.charAt(1);
      const key = { 一: 'p1', 二: 'p2', 三: 'p3', 四: 'p4', 五: 'p5' }[partNum] || 'p1';
      currentPart = key;
      partTitle = mergeTitleLine(t);
      if (lines[i + 1] && isTitleContinuation(lines[i + 1])) {
        partTitle = mergeTitleLine(t + lines[i + 1].trim());
      }
      continue;
    }
    if (PART_INTRO.test(t)) {
      markers.push({ lineIndex: i, kind: 'chapter', partKey: currentPart, title: `${PART_THEMES[currentPart]?.name || ''} · 序论`, short: '序论', partTitle });
      continue;
    }
    if (CHAPTER_HEADER.test(t)) {
      let title = mergeTitleLine(t);
      let j = i + 1;
      while (j < lines.length && isTitleContinuation(lines[j])) {
        title = mergeTitleLine(title + lines[j].trim());
        j++;
      }
      const chMatch = title.match(/第([一二三四五六七八九十百]+)章/);
      const short = chMatch ? `第${chMatch[1]}章` : title.slice(0, 8);
      markers.push({ lineIndex: i, kind: 'chapter', partKey: currentPart, title, short, partTitle });
    }
  }
  return markers;
}

function firstParagraph(lines) {
  const paras = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || PART_HEADER.test(t) || CHAPTER_HEADER.test(t) || PART_INTRO.test(t) || BOOK_INTRO.test(t)) continue;
    if (isBodyLine(line)) paras.push(stripIndent(line));
    else if (!PART_HEADER.test(t) && !CHAPTER_HEADER.test(t) && !PART_INTRO.test(t) && t.length > 30) paras.push(t);
  }
  return paras.slice(0, 2).join('');
}

function splitChapters(text) {
  const lines = text.split(/\r?\n/);
  const markers = detectMarkers(lines);
  const chapters = [];

  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    const start = m.lineIndex;
    const end = i + 1 < markers.length ? markers[i + 1].lineIndex : lines.length;
    const slice = lines.slice(start, end);
    const bodyLines = slice.slice(1);
    chapters.push({
      id: `ch${String(i).padStart(2, '0')}`,
      title: m.title,
      short: m.short,
      subtitle: chapterSubtitle(m.title),
      partKey: m.partKey,
      partTitle: m.partTitle || PART_THEMES[m.partKey]?.name || '',
      html: linesToHtml(slice, m.title),
      excerpt: firstParagraph(bodyLines),
    });
  }
  return chapters;
}

function linesToHtml(lines, chapterTitle) {
  const parts = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    i++;
    if (!t) continue;

    if (BOOK_INTRO.test(t)) {
      const rest = t.replace(/^序论及全书设计\s*/, '');
      parts.push(`<h3 class="section-head">序论及全书设计</h3>`);
      if (rest) parts.push(`<p>${esc(rest)}</p>`);
      continue;
    }
    if (PART_HEADER.test(t) || CHAPTER_HEADER.test(t) || PART_INTRO.test(t)) {
      let title = mergeTitleLine(t);
      while (i < lines.length && isTitleContinuation(lines[i])) {
        title = mergeTitleLine(title + lines[i].trim());
        i++;
      }
      if (title !== chapterTitle) {
        parts.push(`<h4 class="sub-head">${esc(title)}</h4>`);
      } else {
        parts.push(`<h3 class="section-head">${esc(title)}</h3>`);
      }
      continue;
    }
    if (/^第[一二三四五六七八九十百]+节/.test(t)) {
      parts.push(`<h4 class="sub-head section-head">${esc(t)}</h4>`);
      continue;
    }
    if (isBodyLine(raw)) {
      parts.push(`<p>${esc(stripIndent(raw))}</p>`);
      continue;
    }
    if (t.length > 20) {
      parts.push(`<p>${esc(t)}</p>`);
    }
  }
  return parts.join('\n');
}

function buildSummary(ch) {
  const theme = PART_THEMES[ch.partKey] || PART_THEMES.intro;
  const quote = ch.excerpt.slice(0, 80) + (ch.excerpt.length > 80 ? '……' : '');
  return {
    master: '亚当·斯密',
    quote: quote || ch.title,
    essence: `${theme.name}核心议题：${ch.title.replace(/^第.+章[　\s]*/, '')}`,
    summary: ch.excerpt.slice(0, 280) + (ch.excerpt.length > 280 ? '……' : '') || `本章属于${theme.name}，讨论${theme.theme}。`,
    actions: [
      `用一句话概括：本章要回答什么问题？`,
      `对照${theme.name}逻辑流：${theme.flow.join(' → ')}`,
      `找出一个可对照今日的例子或反例`,
    ],
  };
}

function buildAnalysis(ch) {
  const theme = PART_THEMES[ch.partKey] || PART_THEMES.intro;
  const topic = ch.title.replace(/^序论及全书设计.*$/, '全书五篇总设计').replace(/^.+篇 · 序论$/, `${theme.name}导论`);
  return {
    id: ch.id,
    title: ch.title,
    short: ch.short,
    subtitle: ch.subtitle,
    keyPoints: [
      `所属${theme.name}：${theme.theme}`,
      `本章主题：${topic}`,
      ch.excerpt ? `开篇论点：${ch.excerpt.slice(0, 60)}……` : '建议结合原文首段精读',
    ],
    difficulties: ch.partKey === 'p4' ? [
      { concept: '重商主义', deconstruct: '斯密批判的核心：把金银当财富、用限制贸易累积货币，反而损害本国生产' },
    ] : ch.partKey === 'p1' && /分工/.test(ch.title) ? [
      { concept: '分工增进生产力', deconstruct: '三重机制：熟练↑、转产时间↓、机械发明↑。扣针工厂是全书最著名例证' },
    ] : [],
    flow: theme.flow.length >= 3 ? theme.flow : ['问题', '论证', '结论'],
  };
}

function renderChapterSummary(chapterId, summaries) {
  const s = summaries[chapterId];
  if (!s) return '';
  const actions = s.actions.map(a => `<li>${esc(a)}</li>`).join('');
  return `
          <aside class="chapter-summary">
            <div class="summary-header">
              <span class="summary-badge">本章总结</span>
              <span class="summary-master">${esc(s.master)}</span>
            </div>
            <blockquote class="golden-quote">${esc(s.quote)}</blockquote>
            <p class="summary-essence">${esc(s.essence)}</p>
            <div class="summary-body">${esc(s.summary)}</div>
            <div class="summary-actions">
              <h5>阅读要点</h5>
              <ul>${actions}</ul>
            </div>
          </aside>`;
}

function buildFrameworkHtml(chapters) {
  const groups = [];
  let current = null;
  for (const ch of chapters) {
    if (!current || current.key !== ch.partKey) {
      current = { key: ch.partKey, theme: PART_THEMES[ch.partKey], chapters: [] };
      groups.push(current);
    }
    current.chapters.push(ch);
  }
  return groups.map(g => {
    const chItems = g.chapters.map(c => `
      <div class="fw-chapter"><div class="fw-chapter-title">${esc(c.short)}${c.subtitle ? ` · ${esc(c.subtitle)}` : ''}</div></div>`).join('');
    return `
    <div class="fw-section">
      <div class="fw-section-title">${esc(g.theme?.name || '序论')} · ${esc(g.theme?.theme || '')}</div>
      ${chItems}
    </div>`;
  }).join('<div class="fw-arrow-down">↓</div>');
}

function navLinkLabel(ch) {
  return ch.subtitle ? `${ch.short} · ${ch.subtitle}` : ch.title;
}

function generateHtml(chapters, analysis, summaries, meta) {
  const chapterNavDesktop = chapters.map(ch => {
    const label = navLinkLabel(ch);
    const inner = ch.subtitle
      ? `<span class="nav-ch-num">${esc(ch.short)}</span><span class="nav-ch-name">${esc(ch.subtitle)}</span>`
      : `<span class="nav-ch-num">${esc(ch.short)}</span>`;
    return `<a href="#${ch.id}" class="chapter-link" title="${esc(ch.title)}">${inner}</a>`;
  }).join('\n');
  const chapterNavMobile = chapters.map(ch => {
    const inner = ch.subtitle
      ? `<span class="drawer-ch-num">${esc(ch.short)}</span><span class="drawer-ch-name">${esc(ch.subtitle)}</span>`
      : `<span class="drawer-ch-num">${esc(ch.short)}</span>`;
    return `<button type="button" class="drawer-link" data-target="${ch.id}">${inner}</button>`;
  }).join('\n');
  const chapterSections = chapters.map(ch => `
        <section id="${ch.id}" class="chapter">
          <div class="part-label">${esc(ch.partTitle || PART_THEMES[ch.partKey]?.name || '')}</div>
          <h2 class="chapter-title">${esc(ch.title)}</h2>
          <div class="chapter-body">${ch.html}</div>
          ${renderChapterSummary(ch.id, summaries)}
        </section>`).join('');

  const noteNav = analysis.map(item => {
    const label = item.subtitle ? `${item.short} · ${item.subtitle}` : item.short;
    return `<button type="button" class="note-nav-btn" data-note="${item.id}" title="${esc(item.title)}">${esc(label)}</button>`;
  }).join('');

  const flowHtml = analysis.map((item, idx) => {
    const flowSteps = item.flow.map((step, i) => `
            <div class="timeline-step">
              <div class="timeline-dot"></div>
              <div class="timeline-content">${esc(step)}</div>
              ${i < item.flow.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>`).join('');
    const diffHtml = item.difficulties.map(d => `
            <div class="diff-item">
              <div class="diff-concept">${esc(d.concept)}</div>
              <div class="diff-deconstruct">${esc(d.deconstruct)}</div>
            </div>`).join('');
    const keyHtml = item.keyPoints.map(kp => `<li>${esc(kp)}</li>`).join('');
    return `
        <article id="note-${item.id}" class="analysis-card${idx === 0 ? ' active' : ''}">
          <h3>${esc(item.title)}</h3>
          <div class="key-points"><h4>重点</h4><ul>${keyHtml}</ul></div>
          <div class="flow-chain"><h4>逻辑流</h4><div class="timeline">${flowSteps}</div></div>
          ${item.difficulties.length ? `<div class="difficulties"><h4>难点解构</h4>${diffHtml}</div>` : ''}
        </article>`;
  }).join('');

  const phasesHtml = READING_GUIDE.phases.map((p, i) => {
    const steps = p.steps.map(s => `<li>${esc(s)}</li>`).join('');
    return `
        <details class="phase-card"${i === 0 ? ' open' : ''}>
          <summary><span class="phase-num">${i + 1}</span><span class="phase-info"><strong>${esc(p.phase)}</strong><em>${esc(p.duration)}</em></span></summary>
          <ol>${steps}</ol>
        </details>`;
  }).join('');
  const tipsHtml = READING_GUIDE.tips.map(t => `<li>${esc(t)}</li>`).join('');
  const frameworkBody = buildFrameworkHtml(chapters);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
<meta name="theme-color" content="${meta.themeColor}"/>
<title>${esc(meta.title)} · 阅读指南</title>
<style>
:root{
  --bg:#f4f6f8;--surface:#fff;--text:#1c1c1e;--text-secondary:#636366;
  --accent:${meta.accent};--accent-light:${meta.accentLight};--border:#dde3e8;
  --flow-bg:#eef2f5;--diff-bg:#f0f4f8;--nav-h:56px;--header-h:52px;
  --safe-b:env(safe-area-inset-bottom,0px);--safe-t:env(safe-area-inset-top,0px)
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans SC",serif;background:var(--bg);color:var(--text);line-height:1.75;padding-bottom:calc(var(--nav-h) + var(--safe-b) + 8px)}
.app-header{position:sticky;top:0;z-index:200;background:var(--accent);color:#fff;padding:calc(10px + var(--safe-t)) 16px 10px;display:flex;align-items:center;justify-content:space-between;min-height:var(--header-h)}
.app-header h1{font-size:16px;font-weight:600;line-height:1.3;flex:1}
.app-header .subtitle{font-size:11px;opacity:.85;margin-top:2px}
.header-btn{background:rgba(255,255,255,.15);border:none;color:#fff;padding:6px 12px;border-radius:16px;font-size:13px;cursor:pointer;white-space:nowrap}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:300;display:flex;background:var(--surface);border-top:1px solid var(--border);padding-bottom:var(--safe-b);height:calc(var(--nav-h) + var(--safe-b))}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:none;background:none;cursor:pointer;color:var(--text-secondary);font-size:10px;padding:6px 0;transition:color .2s}
.nav-item svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nav-item.active{color:var(--accent);font-weight:600}
.tab-panel{display:none;min-height:calc(100vh - var(--header-h) - var(--nav-h))}
.tab-panel.active{display:block}
.read-layout{display:block}
.chapter-nav-desktop{display:none}
.chapter-content{padding:16px;max-width:720px;margin:0 auto}
.chapter{margin-bottom:48px;padding-bottom:24px;border-bottom:1px solid var(--border)}
.part-label{font-size:12px;color:var(--text-secondary);letter-spacing:.06em;margin-bottom:4px}
.chapter-title{font-size:19px;color:var(--accent);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--accent-light);line-height:1.4}
.chapter-body p{margin-bottom:14px;text-indent:2em;font-size:16px;line-height:1.85}
.chapter-body .section-head{font-size:17px;color:var(--accent);margin:8px 0 12px;text-indent:0;font-weight:600}
.chapter-body .sub-head{font-size:15px;font-weight:600;margin:16px 0 8px;text-indent:0;color:var(--text-secondary)}
.chapter-summary{margin-top:32px;padding:20px;background:var(--surface);border:2px solid var(--accent);border-radius:12px}
.summary-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.summary-badge{background:var(--accent);color:#fff;font-size:12px;padding:4px 12px;border-radius:12px;font-weight:600}
.summary-master{font-size:13px;color:var(--text-secondary);font-style:italic}
.golden-quote{border-left:4px solid var(--accent);padding:12px 16px;margin:0 0 14px;background:var(--accent-light);font-size:15px;line-height:1.7;color:var(--accent);font-weight:500;text-indent:0}
.summary-essence{font-size:15px;font-weight:600;color:var(--text);margin-bottom:12px;line-height:1.6;text-indent:0}
.summary-body{font-size:14px;color:var(--text-secondary);line-height:1.75;margin-bottom:16px;text-indent:0}
.summary-actions h5{font-size:13px;color:var(--accent);margin-bottom:8px;letter-spacing:.04em}
.summary-actions ul{padding-left:20px;margin:0}
.summary-actions li{font-size:14px;margin-bottom:6px;line-height:1.6;color:var(--text)}
.chapter-count{font-size:11px;opacity:.75;margin-top:4px}
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:400;opacity:0;visibility:hidden;transition:opacity .25s}
.drawer-overlay.open{opacity:1;visibility:visible}
.chapter-drawer{position:fixed;left:0;right:0;bottom:0;z-index:401;background:var(--surface);border-radius:16px 16px 0 0;max-height:75vh;transform:translateY(100%);transition:transform .3s ease;display:flex;flex-direction:column;padding-bottom:var(--safe-b)}
.chapter-drawer.open{transform:translateY(0)}
.drawer-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0}
.drawer-header h2{font-size:16px;color:var(--accent)}
.drawer-close{background:none;border:none;font-size:24px;color:var(--text-secondary);cursor:pointer;padding:0 4px;line-height:1}
.drawer-links{overflow-y:auto;padding:8px 0;flex:1;-webkit-overflow-scrolling:touch}
.drawer-link{display:block;width:100%;text-align:left;padding:10px 20px;border:none;background:none;font-size:14px;color:var(--text);border-left:3px solid transparent;cursor:pointer;line-height:1.4}
.drawer-ch-num{display:block;font-weight:600;font-size:13px}
.drawer-ch-name{display:block;font-size:12px;color:var(--text-secondary);margin-top:2px;line-height:1.35}
.drawer-link:active,.drawer-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
.drawer-link.active .drawer-ch-name{color:var(--accent);opacity:.85}
.notes-wrap{padding:12px 0 16px}
.note-nav-scroll{display:flex;gap:8px;padding:0 16px 12px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.note-nav-scroll::-webkit-scrollbar{display:none}
.note-nav-btn{flex-shrink:0;padding:6px 14px;border-radius:16px;border:1px solid var(--border);background:var(--surface);font-size:13px;color:var(--text-secondary);cursor:pointer;white-space:nowrap}
.note-nav-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.notes-content{padding:0 16px}
.analysis-card{background:var(--surface);border-radius:12px;padding:20px;margin-bottom:16px;border:1px solid var(--border);display:none}
.analysis-card.active{display:block}
.analysis-card h3{font-size:16px;color:var(--accent);margin-bottom:14px;line-height:1.4}
.analysis-card h4{font-size:12px;color:var(--text-secondary);margin:14px 0 8px;letter-spacing:.04em}
.key-points ul{padding-left:18px}.key-points li{margin-bottom:6px;font-size:14px;line-height:1.6}
.timeline{padding:8px 0 8px 8px}
.timeline-step{position:relative;padding-left:24px;padding-bottom:16px}
.timeline-dot{position:absolute;left:0;top:6px;width:10px;height:10px;background:var(--accent);border-radius:50%}
.timeline-line{position:absolute;left:4px;top:18px;width:2px;height:calc(100% - 6px);background:var(--accent-light)}
.timeline-content{background:var(--flow-bg);padding:8px 14px;border-radius:8px;font-size:14px;line-height:1.5}
.diff-item{background:var(--diff-bg);border-left:3px solid var(--accent);padding:12px 14px;margin-bottom:10px;border-radius:0 8px 8px 0}
.diff-concept{font-weight:600;margin-bottom:4px;color:var(--accent);font-size:14px}
.diff-deconstruct{font-size:14px;color:var(--text-secondary);line-height:1.6}
.framework-wrap{padding:16px;max-width:720px;margin:0 auto}
.framework-title{text-align:center;font-size:18px;margin-bottom:20px;color:var(--accent);font-weight:600}
.fw-section{margin-bottom:16px}
.fw-section-title{font-size:13px;font-weight:600;color:#fff;background:var(--accent);padding:10px 12px;border-radius:8px;margin-bottom:10px;line-height:1.5}
.fw-chapter{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:6px}
.fw-chapter-title{font-size:13px;color:var(--text);line-height:1.4}
.fw-arrow-down{text-align:center;font-size:14px;color:var(--accent);margin:8px 0;font-weight:500}
.fw-core{text-align:center;background:var(--accent-light);border:2px solid var(--accent);border-radius:10px;padding:14px;margin:16px 0;font-weight:600;font-size:14px;line-height:1.5}
.guide-wrap{padding:16px;max-width:720px;margin:0 auto}
.guide-intro{font-size:14px;color:var(--text-secondary);margin-bottom:16px;line-height:1.6}
.phase-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:12px;overflow:hidden}
.phase-card summary{display:flex;align-items:center;gap:12px;padding:16px;cursor:pointer;list-style:none}
.phase-card summary::-webkit-details-marker{display:none}
.phase-num{width:28px;height:28px;background:var(--accent);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0}
.phase-info{display:flex;flex-direction:column;gap:2px}
.phase-info strong{font-size:15px;color:var(--text)}
.phase-info em{font-size:12px;color:var(--text-secondary);font-style:normal}
.phase-card ol{padding:0 16px 16px 32px;font-size:14px;line-height:1.7}
.phase-card li{margin-bottom:6px}
.tips-box{background:var(--accent-light);border-radius:12px;padding:20px;margin-top:20px}
.tips-box h3{color:var(--accent);font-size:15px;margin-bottom:10px}
.tips-box ul{padding-left:18px}.tips-box li{margin-bottom:6px;font-size:14px;line-height:1.6}
@media(min-width:769px){
  body{padding-bottom:0}
  .app-header{padding:16px 32px}.app-header h1{font-size:20px}.header-btn{display:none}
  .bottom-nav{position:sticky;top:var(--header-h);bottom:auto;border-top:none;border-bottom:1px solid var(--border);padding-bottom:0;height:var(--nav-h)}
  .nav-item{flex-direction:row;gap:6px;font-size:14px;padding:0}
  .read-layout{display:grid;grid-template-columns:168px 1fr}
  .chapter-nav-desktop{display:block;background:var(--surface);border-right:1px solid var(--border);padding:12px 0;position:sticky;top:calc(var(--header-h) + var(--nav-h));height:calc(100vh - var(--header-h) - var(--nav-h));overflow-y:auto}
  .chapter-link{display:flex;flex-direction:column;gap:2px;padding:8px 10px;font-size:11px;color:var(--text-secondary);text-decoration:none;border-left:3px solid transparent;line-height:1.3}
  .nav-ch-num{font-weight:600;font-size:11px;white-space:nowrap}
  .nav-ch-name{font-size:10px;opacity:.85;line-height:1.35}
  .chapter-link:hover,.chapter-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
  .chapter-link:hover .nav-ch-name,.chapter-link.active .nav-ch-name{opacity:1}
  .chapter-content{padding:32px 48px}
  .notes-content{max-width:800px;margin:0 auto}
  .analysis-card{display:block!important;margin-bottom:24px}
  .note-nav-scroll{display:none}
}
</style>
</head>
<body>
<header class="app-header">
  <div><h1>${esc(meta.title)}</h1><div class="subtitle">${esc(meta.subtitle)}</div><div class="chapter-count">全书 ${chapters.length} 章 · 五篇结构 · 含章末总结</div></div>
  <button type="button" class="header-btn" id="openDrawer">目录</button>
</header>
<nav class="bottom-nav" role="tablist">
  <button type="button" class="nav-item active" data-tab="tab-read" role="tab" aria-selected="true">
    <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><span>原文</span>
  </button>
  <button type="button" class="nav-item" data-tab="tab-notes" role="tab">
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg><span>笔记</span>
  </button>
  <button type="button" class="nav-item" data-tab="tab-map" role="tab">
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg><span>框架</span>
  </button>
  <button type="button" class="nav-item" data-tab="tab-guide" role="tab">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><span>读法</span>
  </button>
</nav>
<section id="tab-read" class="tab-panel active" role="tabpanel">
  <div class="read-layout">
    <nav class="chapter-nav-desktop">${chapterNavDesktop}</nav>
    <main class="chapter-content">${chapterSections}</main>
  </div>
</section>
<section id="tab-notes" class="tab-panel" role="tabpanel">
  <div class="notes-wrap">
    <div class="note-nav-scroll">${noteNav}</div>
    <div class="notes-content">${flowHtml}</div>
  </div>
</section>
<section id="tab-map" class="tab-panel" role="tabpanel">
  <div class="framework-wrap">
    <div class="framework-title">全书框架 · 五篇 ${chapters.length} 章</div>
    ${frameworkBody}
    <div class="fw-core">核心命题：国民财富 = 劳动生产力 × 资本配置 × 制度政策</div>
  </div>
</section>
<section id="tab-guide" class="tab-panel" role="tabpanel">
  <div class="guide-wrap">
    <p class="guide-intro">《国富论》篇幅宏大，宜分篇分章渐进阅读，不宜一次通读。</p>
    ${phasesHtml}
    <div class="tips-box"><h3>阅读要诀</h3><ul>${tipsHtml}</ul></div>
  </div>
</section>
<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="chapter-drawer" id="chapterDrawer">
  <div class="drawer-header"><h2>章节目录 · ${chapters.length} 章</h2><button type="button" class="drawer-close" id="closeDrawer">&times;</button></div>
  <div class="drawer-links">${chapterNavMobile}</div>
</div>
<script>
(function(){
  const tabs=document.querySelectorAll('.nav-item');
  const panels=document.querySelectorAll('.tab-panel');
  tabs.forEach(btn=>{btn.addEventListener('click',()=>{tabs.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});panels.forEach(p=>p.classList.remove('active'));btn.classList.add('active');btn.setAttribute('aria-selected','true');document.getElementById(btn.dataset.tab).classList.add('active');window.scrollTo({top:0,behavior:'smooth'})})});
  const overlay=document.getElementById('drawerOverlay'),drawer=document.getElementById('chapterDrawer');
  function openDrawer(){overlay.classList.add('open');drawer.classList.add('open');document.body.style.overflow='hidden'}
  function closeDrawer(){overlay.classList.remove('open');drawer.classList.remove('open');document.body.style.overflow=''}
  document.getElementById('openDrawer').addEventListener('click',openDrawer);
  document.getElementById('closeDrawer').addEventListener('click',closeDrawer);
  overlay.addEventListener('click',closeDrawer);
  document.querySelectorAll('.drawer-link').forEach(link=>{link.addEventListener('click',()=>{document.querySelectorAll('.drawer-link').forEach(l=>l.classList.remove('active'));link.classList.add('active');closeDrawer();tabs.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});panels.forEach(p=>p.classList.remove('active'));document.querySelector('[data-tab="tab-read"]').classList.add('active');document.querySelector('[data-tab="tab-read"]').setAttribute('aria-selected','true');document.getElementById('tab-read').classList.add('active');setTimeout(()=>document.getElementById(link.dataset.target).scrollIntoView({behavior:'smooth'}),300)})});
  document.querySelectorAll('.chapter-link').forEach(link=>{link.addEventListener('click',()=>{document.querySelectorAll('.chapter-link').forEach(l=>l.classList.remove('active'));link.classList.add('active')})});
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const id=entry.target.id;document.querySelectorAll('.chapter-link,.drawer-link').forEach(l=>{l.classList.toggle('active',l.getAttribute('href')==='#'+id||l.dataset.target===id)})}})},{rootMargin:'-15% 0px -75% 0px'});
  document.querySelectorAll('.chapter').forEach(s=>observer.observe(s));
  document.querySelectorAll('.note-nav-btn').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.note-nav-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.analysis-card').forEach(c=>c.classList.remove('active'));btn.classList.add('active');document.getElementById('note-'+btn.dataset.note).classList.add('active')})});
  document.querySelector('.note-nav-btn')?.classList.add('active');
})();
</script>
</body></html>`;
}

// --- Main ---
if (!fs.existsSync(SOURCE_TXT)) {
  console.error('Source not found:', SOURCE_TXT);
  process.exit(1);
}

const text = readTxt();
const chapters = splitChapters(text);
const summaries = Object.fromEntries(chapters.map(ch => [ch.id, buildSummary(ch)]));
const analysis = chapters.map(buildAnalysis);

console.log(`Extracted ${chapters.length} chapters`);
chapters.forEach(ch => console.log(`  [${ch.partKey}] ${ch.short} ${ch.title.slice(0, 40)}`));

const html = generateHtml(chapters, analysis, summaries, BOOK_META);
fs.writeFileSync(OUTPUT, html, 'utf-8');
console.log(`Generated: ${OUTPUT}`);
console.log(`File size: ${(fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2)} MB`);
