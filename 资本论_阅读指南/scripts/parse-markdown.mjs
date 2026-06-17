/** Markdown 原文解析为 HTML 块 */
export function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const parts = [];
  let i = 0;
  let inTable = false;

  // 跳过文首目录表
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t.startsWith('|') || t.startsWith('![')) { i++; continue; }
    if (t.startsWith('#') || (t && !t.startsWith('['))) break;
    i++;
  }

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    i++;

    if (!t) continue;
    if (t.startsWith('|') || t === '---') {
      inTable = t.startsWith('|');
      continue;
    }
    if (inTable && !t.startsWith('|')) inTable = false;
    if (t.startsWith('![')) continue;

    // 章节/节标题
    if (/^#{1,3}\s/.test(t)) {
      const title = t.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '');
      parts.push({ type: 'h', text: title });
      continue;
    }
    if (/^第[一二三四五六七八九十百]+章/.test(t)) {
      parts.push({ type: 'h', text: t });
      continue;
    }

    // 定义块
    const defMatch = t.match(/^【定义】(.+?)[：:](.*)$/);
    if (defMatch) {
      parts.push({ type: 'def', term: defMatch[1].trim(), text: defMatch[2].trim() });
      continue;
    }

    // 脚注/译者注行（短行）
    if (/^①|^〔\d+〕|^——译者注|^——编者注/.test(t) && t.length < 120) {
      parts.push({ type: 'note', text: t });
      continue;
    }

    // 引用块（缩进或空行后的引用）
    if (t.startsWith('>') || (t.startsWith('「') && t.endsWith('」') && t.length < 200)) {
      parts.push({ type: 'quote', text: t.replace(/^>\s*/, '') });
      continue;
    }

    // 合并连续段落
    let para = t;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next || next.startsWith('#') || next.startsWith('【定义】') || next.startsWith('|') || /^第.+章/.test(next)) break;
      if (next.length < 80 && /^①|^〔/.test(next)) break;
      para += next;
      i++;
    }
    if (para.length > 2) parts.push({ type: 'p', text: para });
  }
  return parts;
}

export function blocksToHtml(blocks, esc) {
  return blocks.map(b => {
    if (b.type === 'p') {
      const text = esc(b.text).replace(/`([^`]+)`/g, '<em class="kw">$1</em>');
      return `<p>${text}</p>`;
    }
    if (b.type === 'h') return `<h3 class="section-head">${esc(b.text)}</h3>`;
    if (b.type === 'def') return `<div class="term-inline"><strong>${esc(b.term)}</strong><span>${esc(b.text)}</span></div>`;
    if (b.type === 'quote') return `<blockquote class="golden-quote">${esc(b.text)}</blockquote>`;
    if (b.type === 'note') return `<p class="footnote">${esc(b.text)}</p>`;
    return '';
  }).join('\n');
}

export function firstParagraph(blocks) {
  const p = blocks.find(b => b.type === 'p');
  return p ? p.text.slice(0, 120) : '';
}
