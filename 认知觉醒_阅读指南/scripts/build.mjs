import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.join(ROOT, '_source', 'extracted');
const OUTPUT_DIR = ROOT;
const TEXT_DIR = path.join(BASE, 'text');

const CONTENT_PARTS = [
  ['part0004.html', '自序 开启自我改变的原动力'],
  ['part0005.html', '第一章 大脑——一切问题的起源'],
  ['part0006.html', '第二章 潜意识——生命留给我们的彩蛋'],
  ['part0007.html', '第三章 元认知——人类的终极能力'],
  ['part0008.html', '第四章 专注力——情绪和智慧的交叉地带'],
  ['part0009.html', '第五章 学习力——学习不是一味地努力'],
  ['part0010.html', '第六章 行动力——没有行动世界只是个概念'],
  ['part0011.html', '第七章 情绪力——情绪是多角度看问题的智慧'],
  ['part0012.html', '第八章 早冥读写跑，人生五件套'],
  ['part0013.html', '结语 一流的生活不是富有，而是觉知'],
  ['part0014.html', '后记 共同改变，一起前行'],
];

const CHAPTER_ANALYSIS = [
  { id: 'part0004', title: '自序', short: '自序', keyPoints: ['认知觉醒是开启自我改变的原动力', '大多数人困在"知道却做不到"的怪圈', '成长需要主动觉醒，而非被动等待'], difficulties: [{ concept: '为什么知道很多道理却改变不了', deconstruct: '不是意志力问题，而是大脑默认天性（本能脑+情绪脑）压制理智脑' }, { concept: '觉醒的触发条件', deconstruct: '通常来自焦虑触底——当现状与期望差距大到无法忽视时，才会真正开始改变' }], flow: ['混沌生活', '焦虑触底', '开始觉醒', '主动改变', '认知升级'] },
  { id: 'part0005', title: '第一章 大脑', short: '第一章', keyPoints: ['三重大脑：本能脑、情绪脑、理智脑', '理智脑高级但力量弱小，决策多被本能和情绪主导', '成长就是克服天性的过程——让理智脑变强', '焦虑源于欲望>能力，五种焦虑形式', '耐心是复利曲线的关键，遵循规律而非对抗天性'], difficulties: [{ concept: '三重大脑模型', deconstruct: '本能脑(3.6亿年) → 情绪脑(2亿年) → 理智脑(250万年)。不是对抗关系，而是经理驱动两位老员工' }, { concept: '避难趋易 & 急于求成', deconstruct: '远古生存优势在现代社会变成阻碍。只做舒适区的事 + 希望立即看到结果 = 成长失败' }, { concept: '五种焦虑', deconstruct: '完成焦虑 → 定位焦虑 → 选择焦虑 → 环境焦虑 → 难度焦虑' }, { concept: '耐心与复利曲线', deconstruct: '平台期不是没进步，是积累量变。用"舒适区边缘"策略替代意志力硬扛' }], flow: ['认识三重大脑', '理解天性冲突', '识别焦虑根源', '接纳+耐心', '科学成长'] },
  { id: 'part0006', title: '第二章 潜意识', short: '第二章', keyPoints: ['模糊是人生困扰之源，消除模糊是成长核心', '提升思考能力的方法：明确核心问题和思路', '感性(凭感觉)是顶级成长工具', '熔断学习法：凭感觉选书，遇到难点就放下'], difficulties: [{ concept: '模糊 vs 清晰', deconstruct: '模糊 → 逃避/焦虑/拖延。清晰 → 专注/行动/能量。人生就是一场消除模糊的比赛' }, { concept: '顶级成长是"凭感觉"', deconstruct: '不是放弃理性，而是在学习时用感性捕捉最感兴趣/最触动的点，那是潜意识在指路' }, { concept: '熔断学习法', deconstruct: '选书凭感觉 → 读到有感觉的部分 → 遇到难点就停 → 换书或换领域' }], flow: ['识别模糊', '拆解问题', '感性选点', '聚焦深入', '消除模糊'] },
  { id: 'part0007', title: '第三章 元认知', short: '第三章', keyPoints: ['元认知 = 对认知的认知，人类终极能力', '成长慢是因为不会"飞"——缺少第三视角审视自己', '元认知能力 = 反思 + 复盘 + 冥想', '自控力 = 成为思维舵手，在"元时间"做主动选择'], difficulties: [{ concept: '元认知是什么', deconstruct: '就像头顶有摄像头看着自己。不是思考内容，而是思考"我为什么这么想/这么做"' }, { concept: '元时间', deconstruct: '选择的瞬间（如拿起手机前、发脾气前）。在这个节点暂停，启用元认知，就能改变后续行为链' }, { concept: '如何训练元认知', deconstruct: '① 复盘日记 ② 冥想 ③ 阅读高维思想' }], flow: ['默认自动驾驶', '觉醒元认知', '元时间介入', '主动选择', '成为思维舵手'] },
  { id: 'part0008', title: '第四章 专注力', short: '第四章', keyPoints: ['身心合一 = 情绪专注', '分心是天性，专注需要主动引导', '深度沉浸 = 学习专注的核心', '主动沉浸：找舒适区边缘 + 设明确目标'], difficulties: [{ concept: '身心合一', deconstruct: '走路就想走路的事。分心的本质是大脑在逃避不适' }, { concept: '深度沉浸四要素', deconstruct: '① 有明确目标 ② 专注 ③ 有即时反馈 ④ 在舒适区边缘' }, { concept: '心流通道', deconstruct: '任务太难→焦虑，太易→无聊。只在舒适区边缘才能进入心流' }], flow: ['觉察分心', '身心合一', '设定目标', '舒适区边缘', '深度沉浸'] },
  { id: 'part0009', title: '第五章 学习力', short: '第五章', keyPoints: ['舒适区边缘：适用于万物的学习方法论', '深度学习三步：知道 → 关联 → 行动', '关联：高手的暗箱', '建立个人认知体系：用自己的语言重新表达', '打卡陷阱、反馈机制、科学休息'], difficulties: [{ concept: '舒适区边缘', deconstruct: '拉伸区 = 舒适区 + 困难区。始终停留在拉伸区，成长最快' }, { concept: '深度学习', deconstruct: '不是读很多书，而是把知识关联到已有经验，并付诸行动' }, { concept: '关联三原则', deconstruct: '① 时刻寻找关联 ② 大量输入 ③ 保持开放' }, { concept: '打卡 vs 记录', deconstruct: '打卡关注做没做，记录关注学到了什么' }, { concept: '反馈是学习加速器', deconstruct: '有反馈 → 知道对错 → 调整策略' }], flow: ['找拉伸区', '深度学习', '关联旧知', '输出反馈', '科学休息'] },
  { id: 'part0010', title: '第六章 行动力', short: '第六章', keyPoints: ['清晰力 = 行动力，模糊导致拖延', '"傻瓜"精神：不计得失，先做起来', '破解"道理都懂就是不做"：把目标细化到具体步骤'], difficulties: [{ concept: '清晰力', deconstruct: '模糊的目标无法驱动行动。清晰的目标才能启动' }, { concept: '"傻瓜"精神', deconstruct: '聪明人算太多得失反而不行动。先做起来的人反而获得最大收益' }, { concept: '破解"知道不做"', deconstruct: '把抽象道理拆成具体行动步骤' }], flow: ['识别模糊', '细化目标', '不计得失', '立即行动', '迭代优化'] },
  { id: 'part0011', title: '第七章 情绪力', short: '第七章', keyPoints: ['心智带宽：穷忙导致判断力下降', '单一视角是坏情绪根源', '游戏心态：把困难的事当成另一个游戏'], difficulties: [{ concept: '心智带宽', deconstruct: '心智像电脑内存。压力/焦虑占满带宽 → 无法深度思考 → 短视决策' }, { concept: '单一视角', deconstruct: '坏情绪 = 只从一个角度看问题。练习换个角度看' }, { concept: '游戏心态', deconstruct: '把必须做变成选择做。幸福的人在玩另一个游戏' }], flow: ['觉察情绪', '拓宽视角', '保护带宽', '游戏心态', '情绪智慧'] },
  { id: 'part0012', title: '第八章 早冥读写跑', short: '第八章', keyPoints: ['早起：顺应睡眠周期', '冥想：提升元认知的隐藏赛道', '阅读：与高人对话', '写作：费曼技巧', '运动：大脑最佳补品'], difficulties: [{ concept: '科学早起', deconstruct: '顺应REM周期，记录自然醒规律，逐步前移' }, { concept: '冥想的价值', deconstruct: '训练觉察念头但不跟随的能力' }, { concept: '阅读方法', deconstruct: '感性选书 → 熔断阅读 → 关联生活 → 费曼输出' }, { concept: '费曼写作法', deconstruct: '能用自己的话讲清楚 = 真正理解' }], flow: ['早起(时间)', '冥想(元认知)', '阅读(输入)', '写作(输出)', '运动(身体)'] },
  { id: 'part0013', title: '结语', short: '结语', keyPoints: ['一流的生活不是富有，而是觉知', '觉知 = 对自己思考和行为保持觉察', '认知觉醒是一生的修行'], difficulties: [{ concept: '觉知 vs 富有', deconstruct: '外在财富不保证内在幸福。觉知才是高质量生活的核心' }], flow: ['外在追求', '内在觉知', '持续修炼', '一流生活'] },
  { id: 'part0014', title: '后记', short: '后记', keyPoints: ['改变需要共同体，一起前行', '作者从混沌到觉醒的真实路径'], difficulties: [], flow: ['个人觉醒', '共同改变', '持续前行'] },
];

const READING_GUIDE = {
  phases: [
    { phase: '第一遍：速读建框架', duration: '1-2天', steps: ['先读目录和自序，了解全书结构：上篇(内观) + 下篇(外观)', '快速翻读每章开头和结尾，标记核心概念', '不要试图记住所有内容，目标是建立地图', '读完后对照「框架」Tab 画出你理解的书的结构'] },
    { phase: '第二遍：精读上篇', duration: '3-5天', steps: ['上篇是根基：大脑→潜意识→元认知，层层递进', '每读完一节，用「笔记」Tab 的逻辑流对照', '重点精读：三重大脑、五种焦虑、消除模糊、元认知', '每章写3句话总结 + 1个可立即实践的行动'] },
    { phase: '第三遍：精读下篇+实践', duration: '1-2周', steps: ['下篇是方法论：专注→学习→行动→情绪→五件套', '第五章学习力是全书核心，7节需逐节精读', '每学一个方法，立即在生活中试一次', '第八章选1-2项开始，不要贪多'] },
    { phase: '第四遍：回读+输出', duration: '持续', steps: ['用费曼技巧向朋友讲解核心模型', '写读书笔记，关联到工作生活', '遇到困惑时回读对应章节', '建立实践清单，每月复盘一次'] },
  ],
  tips: ['不要逐字读——用熔断学习法，读到没感觉就停', '重点关注核心概念（三重大脑、元认知、舒适区边缘）', '每章至少实践1个方法，胜过读10遍不行动', '配合「笔记」Tab 的逻辑流理解，比孤立记概念更有效', '适合反复读：第一遍框架，第二遍方法，第三遍实践'],
};

function cleanHtmlContent(raw) {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return raw;
  let content = bodyMatch[1];
  content = content.replace(/src="\.\.\/images\//g, 'src="images/');
  content = content.replace(/<a[^>]*class="pcalibre[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1');
  content = content.replace(/<a href="part0002\.html[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1');
  content = content.replace(/<div class="pic"><img alt="" src="([^"]+)"[^/]*\/?><\/div>/g, '<figure class="book-img"><img src="$1" alt="" loading="lazy"/></figure>');
  return content.trim();
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

function buildChapters() {
  const chapters = [];
  for (const [fname, defaultTitle] of CONTENT_PARTS) {
    const fpath = path.join(TEXT_DIR, fname);
    if (!fs.existsSync(fpath)) continue;
    const raw = fs.readFileSync(fpath, 'utf-8');
    const cleaned = cleanHtmlContent(raw);
    const h1 = cleaned.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const title = h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : defaultTitle;
    chapters.push({ id: fname.replace('.html', ''), title, html: cleaned });
  }
  return chapters;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateHtml(chapters, analysis) {
  const chapterNavDesktop = chapters.map(ch => `<a href="#${ch.id}" class="chapter-link">${esc(ch.title)}</a>`).join('\n');
  const chapterNavMobile = chapters.map(ch => `<button type="button" class="drawer-link" data-target="${ch.id}">${esc(ch.title)}</button>`).join('\n');
  const chapterSections = chapters.map(ch => `
        <section id="${ch.id}" class="chapter">
          <h2 class="chapter-title">${esc(ch.title)}</h2>
          <div class="chapter-body">${ch.html}</div>
        </section>`).join('');

  const noteNav = analysis.map(item => `<button type="button" class="note-nav-btn" data-note="${item.id}">${esc(item.short)}</button>`).join('');

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

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
<meta name="theme-color" content="#2d6a4f"/>
<title>认知觉醒 · 阅读指南</title>
<style>
:root{
  --bg:#f5f3ef;--surface:#fff;--text:#1c1c1e;--text-secondary:#636366;
  --accent:#2d6a4f;--accent-light:#e8f5ee;--border:#e5e2dc;
  --flow-bg:#f0f4f8;--diff-bg:#fff8f0;--nav-h:56px;--header-h:52px;
  --safe-b:env(safe-area-inset-bottom,0px);--safe-t:env(safe-area-inset-top,0px)
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;
  background:var(--bg);color:var(--text);line-height:1.75;
  padding-bottom:calc(var(--nav-h) + var(--safe-b) + 8px)
}

/* Header */
.app-header{
  position:sticky;top:0;z-index:200;
  background:var(--accent);color:#fff;
  padding:calc(10px + var(--safe-t)) 16px 10px;
  display:flex;align-items:center;justify-content:space-between;min-height:var(--header-h)
}
.app-header h1{font-size:16px;font-weight:600;line-height:1.3;flex:1}
.app-header .subtitle{font-size:11px;opacity:.8;margin-top:2px}
.header-btn{
  background:rgba(255,255,255,.15);border:none;color:#fff;
  padding:6px 12px;border-radius:16px;font-size:13px;cursor:pointer;white-space:nowrap
}

/* Bottom Nav */
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  display:flex;background:var(--surface);
  border-top:1px solid var(--border);
  padding-bottom:var(--safe-b);height:calc(var(--nav-h) + var(--safe-b))
}
.nav-item{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:2px;border:none;background:none;cursor:pointer;
  color:var(--text-secondary);font-size:10px;padding:6px 0;transition:color .2s
}
.nav-item svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nav-item.active{color:var(--accent);font-weight:600}

/* Tab panels */
.tab-panel{display:none;min-height:calc(100vh - var(--header-h) - var(--nav-h))}
.tab-panel.active{display:block}

/* Tab1: Reading */
.read-layout{display:block}
.chapter-nav-desktop{display:none}
.chapter-content{padding:16px;max-width:720px;margin:0 auto}
.chapter{margin-bottom:48px;padding-bottom:24px;border-bottom:1px solid var(--border)}
.chapter-title{font-size:20px;color:var(--accent);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--accent-light)}
.chapter-body p{margin-bottom:14px;text-indent:2em;font-size:17px;line-height:1.85}
.chapter-body h2,.chapter-body h3{margin:28px 0 12px;color:var(--text)}
.chapter-body h3{font-size:17px}
.chapter-body .p3{font-weight:600;text-indent:0;font-size:17px;margin-top:20px;color:var(--text)}
.chapter-body .yanse{color:var(--accent);font-weight:600}
.chapter-body .ziti4{text-indent:0;padding-left:1.5em;font-size:16px}
.chapter-body .middle-img{text-align:center;font-size:12px;color:var(--text-secondary);margin:8px 0 20px;text-indent:0}
.book-img{text-align:center;margin:12px 0}.book-img img{max-width:100%;height:auto;border-radius:4px}

/* Chapter drawer */
.drawer-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:400;
  opacity:0;visibility:hidden;transition:opacity .25s
}
.drawer-overlay.open{opacity:1;visibility:visible}
.chapter-drawer{
  position:fixed;left:0;right:0;bottom:0;z-index:401;
  background:var(--surface);border-radius:16px 16px 0 0;
  max-height:70vh;transform:translateY(100%);transition:transform .3s ease;
  display:flex;flex-direction:column;padding-bottom:var(--safe-b)
}
.chapter-drawer.open{transform:translateY(0)}
.drawer-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0
}
.drawer-header h2{font-size:16px;color:var(--accent)}
.drawer-close{background:none;border:none;font-size:24px;color:var(--text-secondary);cursor:pointer;padding:0 4px;line-height:1}
.drawer-links{overflow-y:auto;padding:8px 0;flex:1;-webkit-overflow-scrolling:touch}
.drawer-link{
  display:block;width:100%;text-align:left;padding:12px 20px;
  border:none;background:none;font-size:15px;color:var(--text);
  border-left:3px solid transparent;cursor:pointer
}
.drawer-link:active,.drawer-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}

/* Tab2: Notes */
.notes-wrap{padding:12px 0 16px}
.note-nav-scroll{
  display:flex;gap:8px;padding:0 16px 12px;overflow-x:auto;
  -webkit-overflow-scrolling:touch;scrollbar-width:none
}
.note-nav-scroll::-webkit-scrollbar{display:none}
.note-nav-btn{
  flex-shrink:0;padding:6px 14px;border-radius:16px;
  border:1px solid var(--border);background:var(--surface);
  font-size:13px;color:var(--text-secondary);cursor:pointer;white-space:nowrap
}
.note-nav-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.notes-content{padding:0 16px}
.analysis-card{
  background:var(--surface);border-radius:12px;padding:20px;margin-bottom:16px;
  border:1px solid var(--border);display:none
}
.analysis-card.active{display:block}
.analysis-card h3{font-size:17px;color:var(--accent);margin-bottom:14px}
.analysis-card h4{font-size:12px;color:var(--text-secondary);margin:14px 0 8px;letter-spacing:.04em}
.key-points ul{padding-left:18px}.key-points li{margin-bottom:6px;font-size:15px;line-height:1.6}
.timeline{padding:8px 0 8px 8px}
.timeline-step{position:relative;padding-left:24px;padding-bottom:16px}
.timeline-dot{
  position:absolute;left:0;top:6px;width:10px;height:10px;
  background:var(--accent);border-radius:50%
}
.timeline-line{
  position:absolute;left:4px;top:18px;width:2px;height:calc(100% - 6px);
  background:var(--accent-light)
}
.timeline-content{
  background:var(--flow-bg);padding:8px 14px;border-radius:8px;
  font-size:14px;line-height:1.5
}
.diff-item{
  background:var(--diff-bg);border-left:3px solid #e07a2f;
  padding:12px 14px;margin-bottom:10px;border-radius:0 8px 8px 0
}
.diff-concept{font-weight:600;margin-bottom:4px;color:#c45a00;font-size:14px}
.diff-deconstruct{font-size:14px;color:var(--text-secondary);line-height:1.6}

/* Tab3: Framework */
.framework-wrap{padding:16px;max-width:720px;margin:0 auto}
.framework-title{text-align:center;font-size:18px;margin-bottom:20px;color:var(--accent);font-weight:600}
.fw-section{margin-bottom:20px}
.fw-section-title{
  text-align:center;font-size:14px;font-weight:600;color:#fff;
  background:var(--accent);padding:10px;border-radius:8px;margin-bottom:12px
}
.fw-chapter{
  background:var(--surface);border:1px solid var(--border);border-radius:10px;
  padding:14px;margin-bottom:10px
}
.fw-chapter-title{font-weight:600;font-size:15px;margin-bottom:6px;color:var(--accent)}
.fw-sections{font-size:13px;color:var(--text-secondary);line-height:1.7}
.fw-arrow-down{text-align:center;font-size:14px;color:var(--accent);margin:12px 0;font-weight:500}
.fw-core{
  text-align:center;background:var(--accent-light);border:2px solid var(--accent);
  border-radius:10px;padding:14px;margin:16px 0;font-weight:600;font-size:14px;line-height:1.5
}
.fw-practice{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
.fw-practice-item:nth-child(4),.fw-practice-item:nth-child(5){grid-column:span 1}
.fw-practice{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.fw-practice-item{
  background:var(--surface);border:1px solid var(--border);border-radius:10px;
  padding:12px 8px;font-size:13px;text-align:center;line-height:1.4
}
.fw-practice-item small{display:block;color:var(--text-secondary);font-size:11px;margin-top:2px}

/* Tab4: Guide */
.guide-wrap{padding:16px;max-width:720px;margin:0 auto}
.guide-intro{font-size:14px;color:var(--text-secondary);margin-bottom:16px;line-height:1.6}
.phase-card{
  background:var(--surface);border:1px solid var(--border);border-radius:12px;
  margin-bottom:12px;overflow:hidden
}
.phase-card summary{
  display:flex;align-items:center;gap:12px;padding:16px;cursor:pointer;list-style:none
}
.phase-card summary::-webkit-details-marker{display:none}
.phase-num{
  width:28px;height:28px;background:var(--accent);color:#fff;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:600;flex-shrink:0
}
.phase-info{display:flex;flex-direction:column;gap:2px}
.phase-info strong{font-size:15px;color:var(--text)}
.phase-info em{font-size:12px;color:var(--text-secondary);font-style:normal}
.phase-card ol{padding:0 16px 16px 32px;font-size:14px;line-height:1.7}
.phase-card li{margin-bottom:6px}
.tips-box{background:var(--accent-light);border-radius:12px;padding:20px;margin-top:20px}
.tips-box h3{color:var(--accent);font-size:15px;margin-bottom:10px}
.tips-box ul{padding-left:18px}.tips-box li{margin-bottom:6px;font-size:14px;line-height:1.6}

/* Desktop enhancements */
@media(min-width:769px){
  body{padding-bottom:0}
  .app-header{padding:16px 32px}
  .app-header h1{font-size:20px}
  .header-btn{display:none}
  .bottom-nav{
    position:sticky;top:var(--header-h);bottom:auto;
    border-top:none;border-bottom:1px solid var(--border);
    padding-bottom:0;height:var(--nav-h)
  }
  .nav-item{flex-direction:row;gap:6px;font-size:14px;padding:0}
  .read-layout{display:grid;grid-template-columns:220px 1fr}
  .chapter-nav-desktop{
    display:block;background:var(--surface);border-right:1px solid var(--border);
    padding:16px 0;position:sticky;top:calc(var(--header-h) + var(--nav-h));
    height:calc(100vh - var(--header-h) - var(--nav-h));overflow-y:auto
  }
  .chapter-link{
    display:block;padding:8px 16px;font-size:13px;color:var(--text-secondary);
    text-decoration:none;border-left:3px solid transparent
  }
  .chapter-link:hover,.chapter-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
  .chapter-content{padding:32px 48px}
  .notes-content{max-width:800px;margin:0 auto}
  .analysis-card{display:block!important;margin-bottom:24px}
  .note-nav-scroll{display:none}
  .fw-practice{grid-template-columns:repeat(5,1fr)}
}
</style>
</head>
<body>

<header class="app-header">
  <div>
    <h1>认知觉醒</h1>
    <div class="subtitle">周岭 著 · 阅读指南</div>
  </div>
  <button type="button" class="header-btn" id="openDrawer">目录</button>
</header>

<nav class="bottom-nav" role="tablist">
  <button type="button" class="nav-item active" data-tab="tab-read" role="tab" aria-selected="true">
    <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    <span>原文</span>
  </button>
  <button type="button" class="nav-item" data-tab="tab-notes" role="tab">
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    <span>笔记</span>
  </button>
  <button type="button" class="nav-item" data-tab="tab-map" role="tab">
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    <span>框架</span>
  </button>
  <button type="button" class="nav-item" data-tab="tab-guide" role="tab">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    <span>读法</span>
  </button>
</nav>

<!-- Tab: 原文 -->
<section id="tab-read" class="tab-panel active" role="tabpanel">
  <div class="read-layout">
    <nav class="chapter-nav-desktop">${chapterNavDesktop}</nav>
    <main class="chapter-content">${chapterSections}</main>
  </div>
</section>

<!-- Tab: 笔记 -->
<section id="tab-notes" class="tab-panel" role="tabpanel">
  <div class="notes-wrap">
    <div class="note-nav-scroll">${noteNav}</div>
    <div class="notes-content">${flowHtml}</div>
  </div>
</section>

<!-- Tab: 框架 -->
<section id="tab-map" class="tab-panel" role="tabpanel">
  <div class="framework-wrap">
    <div class="framework-title">全书框架</div>
    <div class="fw-section">
      <div class="fw-section-title">上篇 · 内观自己，摆脱焦虑</div>
      <div class="fw-chapter"><div class="fw-chapter-title">第一章 大脑</div><div class="fw-sections">三重大脑 · 焦虑根源 · 耐心法则</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">第二章 潜意识</div><div class="fw-sections">消除模糊 · 凭感觉学习 · 熔断学习法</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">第三章 元认知</div><div class="fw-sections">认知的认知 · 元时间 · 思维舵手</div></div>
    </div>
    <div class="fw-arrow-down">↓ 认知基础建立 ↓</div>
    <div class="fw-core">清晰 → 专注 → 学习 → 行动 → 情绪管理</div>
    <div class="fw-section">
      <div class="fw-section-title">下篇 · 外观世界，借力前行</div>
      <div class="fw-chapter"><div class="fw-chapter-title">第四章 专注力</div><div class="fw-sections">身心合一 · 深度沉浸 · 心流通道</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">第五章 学习力</div><div class="fw-sections">舒适区边缘 · 深度学习 · 关联 · 反馈</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">第六章 行动力</div><div class="fw-sections">清晰力 · 傻瓜精神 · 细化行动</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">第七章 情绪力</div><div class="fw-sections">心智带宽 · 多元视角 · 游戏心态</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">第八章 五件套</div><div class="fw-sections">早起 · 冥想 · 阅读 · 写作 · 运动</div></div>
    </div>
    <div class="fw-arrow-down">↓ 日常实践 ↓</div>
    <div class="fw-practice">
      <div class="fw-practice-item">早起<small>赢得时间</small></div>
      <div class="fw-practice-item">冥想<small>元认知</small></div>
      <div class="fw-practice-item">阅读<small>低成本成长</small></div>
      <div class="fw-practice-item">写作<small>费曼输出</small></div>
      <div class="fw-practice-item">运动<small>大脑补品</small></div>
    </div>
    <div class="fw-core">一流的生活不是富有，而是觉知</div>
  </div>
</section>

<!-- Tab: 读法 -->
<section id="tab-guide" class="tab-panel" role="tabpanel">
  <div class="guide-wrap">
    <p class="guide-intro">四遍阅读法，帮你从「知道」到「做到」。</p>
    ${phasesHtml}
    <div class="tips-box"><h3>阅读要诀</h3><ul>${tipsHtml}</ul></div>
  </div>
</section>

<!-- Mobile chapter drawer -->
<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="chapter-drawer" id="chapterDrawer">
  <div class="drawer-header">
    <h2>章节目录</h2>
    <button type="button" class="drawer-close" id="closeDrawer">&times;</button>
  </div>
  <div class="drawer-links">${chapterNavMobile}</div>
</div>

<script>
(function(){
  const tabs=document.querySelectorAll('.nav-item');
  const panels=document.querySelectorAll('.tab-panel');
  tabs.forEach(btn=>{
    btn.addEventListener('click',()=>{
      tabs.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});
      panels.forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');btn.setAttribute('aria-selected','true');
      document.getElementById(btn.dataset.tab).classList.add('active');
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  const overlay=document.getElementById('drawerOverlay');
  const drawer=document.getElementById('chapterDrawer');
  function openDrawer(){overlay.classList.add('open');drawer.classList.add('open');document.body.style.overflow='hidden'}
  function closeDrawer(){overlay.classList.remove('open');drawer.classList.remove('open');document.body.style.overflow=''}
  document.getElementById('openDrawer').addEventListener('click',openDrawer);
  document.getElementById('closeDrawer').addEventListener('click',closeDrawer);
  overlay.addEventListener('click',closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link=>{
    link.addEventListener('click',()=>{
      const id=link.dataset.target;
      document.querySelectorAll('.drawer-link').forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
      closeDrawer();
      tabs.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});
      panels.forEach(p=>p.classList.remove('active'));
      document.querySelector('[data-tab="tab-read"]').classList.add('active');
      document.querySelector('[data-tab="tab-read"]').setAttribute('aria-selected','true');
      document.getElementById('tab-read').classList.add('active');
      setTimeout(()=>{document.getElementById(id).scrollIntoView({behavior:'smooth'})},300);
    });
  });

  document.querySelectorAll('.chapter-link').forEach(link=>{
    link.addEventListener('click',()=>{
      document.querySelectorAll('.chapter-link').forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id=entry.target.id;
        document.querySelectorAll('.chapter-link,.drawer-link').forEach(l=>{
          const target=l.getAttribute('href')==='#'+id||l.dataset.target===id;
          l.classList.toggle('active',target);
        });
      }
    });
  },{rootMargin:'-15% 0px -75% 0px'});
  document.querySelectorAll('.chapter').forEach(s=>observer.observe(s));

  document.querySelectorAll('.note-nav-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.note-nav-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.analysis-card').forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('note-'+btn.dataset.note).classList.add('active');
    });
  });
  document.querySelector('.note-nav-btn')?.classList.add('active');
})();
</script>
</body></html>`;
}

// --- Main ---
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const chapters = buildChapters();
console.log(`Extracted ${chapters.length} chapters`);

const imgSrc = path.join(BASE, 'images');
const imgDst = path.join(OUTPUT_DIR, 'images');
if (fs.existsSync(imgSrc)) {
  if (fs.existsSync(imgDst)) fs.rmSync(imgDst, { recursive: true });
  copyDirSync(imgSrc, imgDst);
  console.log('Copied images');
}

const html = generateHtml(chapters, CHAPTER_ANALYSIS);
const outputFile = path.join(OUTPUT_DIR, 'index.html');
fs.writeFileSync(outputFile, html, 'utf-8');
console.log(`Generated: ${outputFile}`);
console.log(`File size: ${(fs.statSync(outputFile).size / 1024).toFixed(1)} KB`);
