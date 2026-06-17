import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXTRACTED = path.join(ROOT, '_source', 'extracted');
const TEXT_DIR = path.join(EXTRACTED, 'Text');
const IMG_SRC = path.join(EXTRACTED, 'Images');
const IMG_DST = path.join(ROOT, 'images');
const OUTPUT = path.join(ROOT, 'index.html');

const BOOK_META = {
  title: '母爱的羁绊',
  subtitle: '卡瑞尔·麦克布莱德 著 · 阅读指南',
  themeColor: '#6b4c7a',
  accent: '#6b4c7a',
  accentLight: '#f0eaf3',
};

/** 全书结构：父标题 → 子标题（经 EPUB 对照核实） */
const BOOK_STRUCTURE = [
  {
    part: null, id: 'intro', file: 'chapter6.xhtml', title: '导论', short: '导论',
    epubTitle: '导论', match: true,
    subsections: [],
    keyPoints: ['母女关系影响一生，但母性自恋常被文化禁忌掩盖', '情感遗传代代相传，扭曲的爱可作为痛苦遗产传递', '本书三部分对应：发现问题→看清影响→终结遗传', '康复来自理解与爱，而非指责'],
    flow: ['感受缺失', '打破禁忌', '理解自恋', '灵魂之旅', '终结遗传'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '情感遗传就像基因遗传一样，不知不觉代代相传。', essence: '理解之旅，不是控诉之旅。', body: '作者以治疗师+女儿双重身份，讲述母性自恋如何造成爱的缺失，以及如何通过理解终结代际传递。', actions: ['识别：你有哪些"感觉不对但说不清"的记忆？', '接受：渴望母爱并不可得，不是你的错', '明确：康复目标是理解，不是报复'] },
  },
  {
    part: '第一部分　发现问题', id: 'part1', file: 'chapter7.xhtml', title: '第一部分　发现问题', short: '一部',
    epubTitle: '第一部分　发现问题', match: true, isPartIntro: true,
    subsections: [], keyPoints: ['象征：白马咬伤献苹果的女孩——自恋母亲的无视与伤害'], flow: ['进入第一部分'], summary: null,
  },
  {
    part: '第一部分　发现问题', id: 'ch01', file: 'Section0001.xhtml', title: '第1章　情绪的重负', short: '第1章',
    epubTitle: '第一部分　发现问题', match: false, matchNote: 'EPUB文件<title>误标为"第一部分"，正文H2为第1章，以正文为准',
    subsections: [
      { title: '为什么我如此缺乏自信', highlight: '内心批评者的根源：母亲自恋导致"永远不够好"的自我形象' },
      { title: '为何聚焦母女之间', highlight: '母亲将女儿视为自我的延伸，女儿必须取悦母亲而非成为自己' },
      { title: '什么是自恋', highlight: 'DSM九特质详解；自恋是连续谱，人人都有少量自恋特质' },
      { title: '如果母亲不跟女儿建立亲情关系', highlight: '缺乏共情哺育的爱，扭曲的爱代代相传' },
      { title: '迎接希望，告别否定', highlight: '康复可能：理解→对自己负责→获得新的爱' },
    ],
    keyPoints: ['内心批评者源于自恋母亲——永远不够好', '女儿被当作母亲的倒影，而非独立个体', '自恋9特质：夸大、幻想、特殊感、需崇拜、特权感、剥削、缺乏共情等', '缺失的是"共情哺育的爱"，不是女儿的问题'],
    flow: ['内心批评', '临床发现', '聚焦母女', '定义自恋', '迎接希望'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '康复来自理解和爱，而非指责。', essence: '找到内心批评者的来源——母性自恋。', body: '全书奠基章：解释为何聚焦母女关系、什么是自恋、9种特质如何在日常互动中呈现。', actions: ['对照9特质，勾选母亲符合的条目', '记录3条内心批评者常说的话', '区分：自爱与自恋'] },
  },
  {
    part: '第一部分　发现问题', id: 'ch02', file: 'chapter8.xhtml', title: '第2章　空白的记忆：妈妈和我', short: '第2章',
    epubTitle: '第2章　空白的记忆：妈妈和我', match: true,
    subsections: [
      { title: '10根毒刺', highlight: '自恋母亲伤害女儿的10种典型方式（忽视、竞争、控制等）' },
      { title: '我在镜中何处', highlight: '女儿在母亲这面"镜子"里找不到自己的倒影' },
    ],
    keyPoints: ['10根毒刺：自恋母亲对女儿的具体伤害模式', '空白记忆：不是健忘，是情感剥夺造成的记忆空洞', '镜中无我：母亲只看到自己的倒影'],
    flow: ['10根毒刺', '识别伤害', '镜中寻我', '命名痛苦'],
    summary: { master: '埃兰·戈隆布', quote: '前额长着一缕卷发，尽管她是个好孩子，却总是受到指责。', essence: '毒刺列表帮你命名长期说不出的伤害。', body: '将抽象伤害具体化为10种模式，帮助读者确认"我的感受有名字"。', actions: ['逐条对照10根毒刺', '写一段"我在镜中何处"的自述'] },
  },
  {
    part: '第一部分　发现问题', id: 'ch03', file: 'chapter9.xhtml', title: '第3章　母性自恋面面观', short: '第3章',
    epubTitle: '第3章　母性自恋面面观', match: true,
    subsections: [
      { title: '事必躬亲型母亲', highlight: '过度介入、控制一切，女儿无法发展自主' },
      { title: '心不在焉型母亲', highlight: '情感缺席，物理在但心理不在' },
      { title: '事必躬亲和心不在焉行为的混合', highlight: '两种模式可交替出现，更难识别' },
      { title: '母性自恋的6张面孔', highlight: '6种自恋亚型：极端、炫耀、忽视、嫉妒等' },
    ],
    keyPoints: ['两种极端：过度控制 vs 完全缺席', '6张面孔帮助识别母亲的具体类型', '混合型最难应对——时好时坏'],
    flow: ['事必躬亲', '心不在焉', '混合模式', '六张面孔', '类型识别'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '了解母亲所面对的困难，才能开始改善自己的生活。', essence: '自恋不是单一面孔，识别类型才能对症康复。', body: '从行为模式到人格亚型，建立自恋母亲的完整画像。', actions: ['判断母亲主要属于哪种类型', '回忆一种"混合"行为的具体场景'] },
  },
  {
    part: '第一部分　发现问题', id: 'ch04', file: 'chapter10.xhtml', title: '第4章　爸爸在哪里：自恋温床的其余部分', short: '第4章',
    epubTitle: '第4章　爸爸在哪里：自恋温床的其余部分', match: true,
    subsections: [
      { title: '爸爸在哪里', highlight: '缺席/软弱的父亲无法保护女儿，强化母亲自恋' },
      { title: '兄弟呢', highlight: '兄弟常获更多关注，女儿被忽视或竞争' },
      { title: '极端的姐妹', highlight: '姐妹间竞争可能是母亲挑拨的结果' },
      { title: '金玉其外，败絮其中', highlight: '外表完美的家庭掩盖内在情感荒漠' },
    ],
    keyPoints: ['父亲三种角色：缺席者、懦弱者、共谋者', '兄弟是"金童"，女儿是"替罪羊"或 invisible', '家庭外表越完美，内在越可能有毒'],
    flow: ['父亲缺席', '兄弟效应', '姐妹竞争', '完美假象'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '自恋温床不只母亲一人营造。', essence: '理解整个家庭系统，而非只怪母亲。', body: '扩展到家庭全景：父亲、兄弟、姐妹如何共同构成自恋温床。', actions: ['画出你的家庭角色图：谁被偏爱？谁被忽视？', '回忆父亲/兄弟在你与母亲冲突中的立场'] },
  },
  {
    part: '第一部分　发现问题', id: 'ch05', file: 'chapter11.xhtml', title: '第5章　形象就是一切：小脸笑一笑', short: '第5章',
    epubTitle: '第5章　形象就是一切：小脸笑一笑', match: true,
    subsections: [
      { title: '形象比感受更重要', highlight: '"小脸笑一笑"——压抑真实感受，维持表面完美' },
      { title: '展现"正确"的形象：母亲的倒影', highlight: '女儿必须扮演母亲期望的角色' },
      { title: '展现"正确"的形象：文化的倒影', highlight: '社会文化强化"好女儿"形象' },
      { title: '真正的倒影', highlight: '找到真实的自我，而非他人期望的倒影' },
    ],
    keyPoints: ['核心指令："小脸笑一笑"= 感受不重要，形象才重要', '女儿是母亲的道具/延伸，不是独立的人', '文化共谋："好女孩"不应恨母亲'],
    flow: ['形象>感受', '母亲倒影', '文化倒影', '寻找真我'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '微笑一点，妩媚一点，仿佛一切都很美好。', essence: '你学会的第一课：感受是错的，形象才是对的。', body: '揭示"表面完美"如何内化为女儿的生存策略，以及其长期代价。', actions: ['列出你学会隐藏的3种"不该有"的感受', '练习：今天允许一种感受存在，不修正表情'] },
  },
  {
    part: '第二部分　自恋母亲如何影响了生活的方方面面', id: 'part2', file: 'chapter12.xhtml', title: '第二部分　自恋母亲如何影响了生活的方方面面', short: '二部',
    epubTitle: '第二部分', match: true, isPartIntro: true,
    subsections: [], keyPoints: ['从识别问题进入看清影响——自恋如何渗透生活各层面'], flow: ['进入第二部分'], summary: null,
  },
  {
    part: '第二部分', id: 'ch06', file: 'Section0002.xhtml', title: '第6章　我这么努力！高成就动机型女儿', short: '第6章',
    epubTitle: '第二部分', match: false, matchNote: 'EPUB文件<title>误标为"第二部分"，正文H2为第6章',
    subsections: [
      { title: '那么，这是什么意思', highlight: '高成就型：用成功换取认可，内心仍空虚' },
      { title: '不会照顾自己', highlight: '照顾所有人，唯独不照顾自己' },
      { title: '内部认可和外部认可', highlight: '外部成就无法填补内部认可缺失' },
      { title: '我是不是骄傲自大了', highlight: '成功时反而内疚——冒名顶替综合征' },
      { title: '我是个名不副实的冒名顶替者吗', highlight: '成就越高，越觉得不配' },
      { title: '水晶鞋合脚吗', highlight: '外在成功 vs 内在真实的不匹配' },
    ],
    keyPoints: ['高成就型女儿：永远努力，永远不够', '冒名顶替综合征：成功但不配得', '不会照顾自己——能量全用于取悦他人'],
    flow: ['过度努力', '外部认可', '内在空洞', '冒名顶替', '水晶鞋'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '人们称赞我的成就，但我不允许自己接受应得的肯定。', essence: '成就可能是补偿，不是康复。', body: '高成就型女儿的典型模式：外在光鲜，内在匮乏。', actions: ['列出3项成就，练习对自己说"我配得"', '今天做一件纯粹为自己、不为证明的事'] },
  },
  {
    part: '第二部分', id: 'ch07', file: 'chapter13.xhtml', title: '第7章　这有什么用：自我破坏型女儿', short: '第7章',
    epubTitle: '第7章', match: true,
    subsections: [
      { title: '为什么会自我破坏', highlight: '成功=背叛母亲，失败=留在母亲世界' },
      { title: '让我麻痹自己的痛苦吧', highlight: '成瘾、自伤作为情感麻痹手段' },
      { title: '我们都在努力', highlight: '与自我破坏型姐妹的共鸣' },
      { title: '寻找替代家长', highlight: '在伴侣、朋友、导师处寻找缺失的母爱' },
    ],
    keyPoints: ['自我破坏：潜意识不允许自己比母亲成功', '麻痹痛苦：食物、酒精、药物、关系', '寻找替代家长：重复"取悦-失望"循环'],
    flow: ['破坏机制', '麻痹痛苦', '共同挣扎', '替代家长'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '自我破坏是留在熟悉痛苦中的方式。', essence: '失败有时是忠诚，不是懒惰。', body: '与高成就型相反的另一极：通过失败维持与母亲的联结。', actions: ['识别一个自我破坏模式及其触发点', '问：如果成功了，我害怕什么？'] },
  },
  {
    part: '第二部分', id: 'ch08', file: 'chapter14.xhtml', title: '第8章　不切实际的想法：妈妈没能给我的爱，要在其他地方得到', short: '第8章',
    epubTitle: '第8章', match: true,
    subsections: [
      { title: '当关系结束时', highlight: '关系破裂时的崩溃——全部自我价值系于一人' },
      { title: '我们为什么会这样择偶', highlight: '重复童年模式：寻找"父亲式"或"母亲式"伴侣' },
      { title: '被依赖型关系', highlight: '找需要被照顾的人，扮演"好母亲"' },
      { title: '依赖型关系', highlight: '找控制型伴侣，重复与母亲的关系' },
      { title: '独处的人', highlight: '回避亲密——太害怕重复伤害' },
      { title: '浪漫之后的压力', highlight: '蜜月期后原形毕露的模式' },
    ],
    keyPoints: ['择偶=重复童年：找控制型或被依赖型', '关系结束=自我崩塌', '独处是另一种防御'],
    flow: ['关系破裂', '择偶模式', '依赖/被依赖', '回避亲密', '浪漫压力'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '早期习得的爱的公式——一方取悦另一方而得不到回报。', essence: '你在伴侣身上找的不是爱，是缺失的母爱。', body: '恋爱关系如何复制母女关系的核心动力。', actions: ['描述你典型的择偶/关系模式', '对照：伴侣身上有母亲的哪些特质？'] },
  },
  {
    part: '第二部分', id: 'ch09', file: 'chapter15.xhtml', title: '第9章　救命！我变成我妈妈了：当女儿做了妈妈', short: '第9章',
    epubTitle: '第9章', match: true,
    subsections: [
      { title: '警告：物极必反', highlight: '过度补偿：要么复制母亲，要么走向另一极端' },
      { title: '流露出自己做得不够好的想法', highlight: '完美主义母亲：不允许自己犯错' },
      { title: '你怎样使用"同情心"', highlight: '对子女过度共情 vs 情感边界模糊' },
      { title: '我的孩子是优等生', highlight: '把孩子当作成就展示品' },
      { title: '那些叫做感受的麻烦事儿', highlight: '不知如何回应子女的真实感受' },
      { title: '我的女儿，我的朋友', highlight: '边界混淆：把女儿当朋友/延伸' },
    ],
    keyPoints: ['成为母亲=最大考验：复制或过度补偿', '两种陷阱：变成母亲 vs 过度保护', '子女感受触发自己的未愈合伤口'],
    flow: ['物极必反', '完美主义', '边界模糊', '感受困难', '终结代际'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '我就是我的孩子的原生家庭。', essence: '打破遗传的关键战场：你成为母亲的那一刻。', body: '当女儿自己成为母亲，自恋模式最容易无意识复活。', actions: ['列出"我发誓不做的"和"我可能正在做的"', '今天对子女（或内在小孩）说一次真实感受'] },
  },
  {
    part: '第三部分　终结遗传', id: 'part3', file: 'chapter16.xhtml', title: '第三部分　终结遗传', short: '三部',
    epubTitle: '第三部分', match: true, isPartIntro: true,
    subsections: [], keyPoints: ['从理解进入治愈——终结代际传递'], flow: ['进入第三部分'], summary: null,
  },
  {
    part: '第三部分', id: 'ch10', file: 'Section0004.xhtml', title: '第10章　第一步：感受比外表更重要', short: '第10章',
    epubTitle: '第三部分', match: false, matchNote: 'EPUB文件<title>误标为"第三部分"，正文H2为第10章',
    subsections: [
      { title: '康复的三个步骤', highlight: '①接受母亲缺陷 ②体验悲伤 ③重建自我' },
      { title: '进一步认识治疗', highlight: '心理治疗的作用与选择' },
      { title: '接受母亲的缺点', highlight: '她不是完美的，也不需要是' },
      { title: '如何判断我有没有完全接受母亲的缺陷', highlight: '自检标准' },
      { title: '教会自己悲伤', highlight: '允许为从未得到的母爱哀悼' },
      { title: '痛苦的几个阶段', highlight: '否认→愤怒→讨价还价→抑郁→接受' },
    ],
    keyPoints: ['康复第一步：感受>外表（反"小脸笑一笑"）', '悲伤是被压抑的核心情绪，必须释放', '接受≠原谅，接受=看清现实'],
    flow: ['感受优先', '接受缺陷', '学会悲伤', '痛苦阶段', '三步康复'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '如果不了解母亲以及她的自恋对我们的影响，就不可能恢复健康。', essence: '停止表演"一切都好"，开始感受真实。', body: '治愈路径开篇：悲伤是被禁止的情绪，释放它才能前进。', actions: ['写一封不寄出的信：对母亲说出未说出口的感受', '今天允许自己悲伤15分钟，不打断'] },
  },
  {
    part: '第三部分', id: 'ch11', file: 'chapter17.xhtml', title: '第11章　亲近与独立：从母亲身边独立出来', short: '第11章',
    epubTitle: '第11章', match: true,
    subsections: [
      { title: '为什么心理上从母亲那里独立出来对你的心理健康很重要', highlight: '未分化=情绪纠缠，无法自主' },
      { title: '独立到底意味着什么', highlight: '不是断绝关系，是情感自主' },
      { title: '怎样摆脱以母亲为中心的状态', highlight: '从"她的反应决定我的情绪"到"我负责我的情绪"' },
      { title: '独立的标准', highlight: '自检：你的决定多大程度受母亲影响？' },
    ],
    keyPoints: ['独立≠断绝联系，=情感自主', '未分化的女儿：母亲的情绪=她的情绪', '建立边界是核心技能'],
    flow: ['为何独立', '定义独立', '摆脱中心', '独立标准'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '你必须面对有关自身经验的真相——对母性温暖的渴望将不会得到满足。', essence: '从共生到分离，是心理成年的标志。', body: '实操章：如何在不断绝关系的前提下获得情感独立。', actions: ['做一个未经母亲"批准"的小决定', '练习：她的情绪是她的，你的情绪是你的'] },
  },
  {
    part: '第三部分', id: 'ch12', file: 'chapter18.xhtml', title: '第12章　做一个本真的女人：命中注定的女儿', short: '第12章',
    epubTitle: '第12章', match: true,
    subsections: [
      { title: '内在母亲', highlight: '内化母亲的声音 vs 培养内在智慧母亲' },
      { title: '精神崩溃', highlight: '旧我瓦解是新我诞生的必经之痛' },
      { title: '敏感的人', highlight: '敏感不是缺陷，是未被珍惜的天赋' },
      { title: '我到底是谁', highlight: '剥离角色后的身份探索' },
      { title: '本色女人拼贴画', highlight: '练习：拼贴出真实的自我形象' },
      { title: '我的价值观是什么', highlight: '从"母亲的价值"到"我的价值"' },
    ],
    keyPoints: ['重建"内在母亲"——用共情声音取代批评声音', '身份探索：剥离"好女儿"角色', '拼贴画等练习帮助可视化真我'],
    flow: ['内在母亲', '允许崩溃', '拥抱敏感', '身份探索', '拼贴真我'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '我让自己真实的一面展现出来。', essence: '你不是"命中注定"要重复母亲的路。', body: '从"她的倒影"到"本真的女人"——重建身份感。', actions: ['做"本色女人拼贴画"（杂志剪贴或数字版）', '写5条只属于你自己的价值观'] },
  },
  {
    part: '第三部分', id: 'ch13', file: 'chapter19.xhtml', title: '第13章　轮到我了：在治疗中与母亲相处', short: '第13章',
    epubTitle: '第13章', match: true,
    subsections: [
      { title: '那些没法治愈的方面', highlight: '接受：有些关系无法修复，只能管理' },
      { title: '带刺的母亲', highlight: '与仍具自恋特质的母亲相处的策略' },
      { title: '普通关系', highlight: '降低期望：从"理想母亲"到"普通关系"' },
      { title: '临时隔离', highlight: '必要时物理/情感距离' },
      { title: '在母亲面前建立底线', highlight: '明确边界并坚持' },
      { title: '带妈妈去做心理治疗', highlight: '何时/如何建议（通常无效）' },
    ],
    keyPoints: ['不是每种关系都能修复——接受限制', '底线+边界=与仍自恋的母亲相处的工具', '降低期望：普通关系已是胜利'],
    flow: ['接受限制', '应对带刺', '降低期望', '建立底线', '管理关系'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '我庆幸自己能鼓起勇气和她谈论这本书。', essence: '与母亲相处从"求爱"变为"管理"。', body: '实操指南：康复后如何与仍具自恋特质的母亲共处。', actions: ['写一条你对母亲的底线（具体、可执行）', '演练一次"不解释、不辩护"的回应'] },
  },
  {
    part: '第三部分', id: 'ch14', file: 'chapter20.xhtml', title: '第14章　填补空虚之镜：结束自恋母亲的影响', short: '第14章',
    epubTitle: '第14章', match: true,
    subsections: [
      { title: '育儿浅说', highlight: '如果你做了母亲：打破循环的具体方法' },
      { title: '同情', highlight: '对母亲也对自己——理解她的局限' },
      { title: '责任', highlight: '为自己的生活负责，停止归咎' },
      { title: '特权', highlight: '选择自由生活的特权' },
      { title: '价值', highlight: '内在价值不依赖外部成就' },
      { title: '不仅要看重自己的成就，更要看重自己的人格', highlight: '全书总结：人格>成就' },
    ],
    keyPoints: ['填补空虚之镜：在镜中看到自己的倒影', '终结遗传：你可以是最后一代', '价值来自存在，不来自成就'],
    flow: ['育儿打破', '同情', '责任', '特权', '内在价值'],
    summary: { master: '卡瑞尔·麦克布莱德', quote: '完成了遗传性扭曲母爱的修复工作之后，我能说我已到达目的地。', essence: '镜中终于有你的倒影——完整的、本真的你。', body: '全书收束：从理解到治愈到终结代际传递的完整路径。', actions: ['对内在小孩说：你值得被爱，不是因为成就', '写下：我终结遗传的具体承诺'] },
  },
];

const READING_GUIDE = {
  phases: [
    { phase: '第一遍：确认与命名', duration: '3-5天', steps: ['读导论+第1-2章，确认"这说的是我"', '对照10根毒刺和9特质，勾选符合项', '看「结构」Tab核对章节层级', '不要急于行动，先允许情绪浮现'] },
    { phase: '第二遍：看清影响', duration: '1-2周', steps: ['精读第二部分：识别你是高成就型/自我破坏型/或混合', '对照第8章择偶模式', '若已做母亲，重点读第9章', '每章读「笔记」Tab的子标题重点'] },
    { phase: '第三遍：开始治愈', duration: '持续', steps: ['精读第三部分：悲伤→独立→本真→边界', '完成每章末尾的行动要点', '考虑寻找心理咨询师', '写不寄出的信、做拼贴画等练习'] },
    { phase: '第四遍：整合与传递', duration: '长期', steps: ['若做母亲：用第9、14章打破循环', '与可信的人分享你的发现', '定期回看章末总结', '记住：理解≠原谅，理解=自由'] },
  ],
  tips: ['这本书可能触发强烈情绪，请在安全环境中阅读', '重点子标题已在原文中用高亮框标出', '三部分结构：发现问题(1-5章)→影响(6-9章)→治愈(10-14章)', 'EPUB有3处<title>标签与章节不符，以正文H2为准', '康复不是线性的，允许反复'],
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cleanHtml(raw, subsectionTitles) {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return '';
  let html = bodyMatch[1];
  html = html.replace(/src="\.\.\/Images\//g, 'src="images/');
  html = html.replace(/<a[^>]*href="#[^"]*"[^>]*>/g, '<span class="fn-ref">');
  html = html.replace(/<\/a>/g, '</span>');
  html = html.replace(/<h1[^>]*class="p1"[^>]*>[\s\S]*?<\/h1>/gi, '');
  html = html.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => {
    const text = t.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim();
    return `<h2 class="chapter-h2">${esc(text)}</h2>`;
  });
  const highlightSet = new Set(subsectionTitles.map(s => s.title));
  html = html.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => {
    const text = t.replace(/<[^>]+>/g, '').trim();
    const sub = subsectionTitles.find(s => s.title === text);
    if (sub) {
      return `<div class="subsection-block"><h3 class="subsection-head">${esc(text)}</h3><div class="subsection-highlight"><strong>本节重点：</strong>${esc(sub.highlight)}</div>`;
    }
    return `<h3 class="subsection-head">${esc(text)}</h3>`;
  });
  html = html.replace(/<\/div>\s*(?=<div class="subsection-block">)/g, '</div>');
  html = html.replace(/(<div class="subsection-block">[\s\S]*?<div class="subsection-highlight">[\s\S]*?<\/div>)(?!\s*<\/div>)/g, '$1</div>');
  html = html.replace(/<img([^>]*)\/?>/gi, '<figure class="book-img"><img$1 loading="lazy"/></figure>');
  return html.trim();
}

function renderSummary(s) {
  if (!s) return '';
  const actions = s.actions.map(a => `<li>${esc(a)}</li>`).join('');
  return `<aside class="chapter-summary">
    <div class="summary-header"><span class="summary-badge">本章总结</span><span class="summary-master">${esc(s.master)}</span></div>
    <blockquote class="golden-quote">${esc(s.quote)}</blockquote>
    <p class="summary-essence">${esc(s.essence)}</p>
    <div class="summary-body">${esc(s.body)}</div>
    <div class="summary-actions"><h5>行动要点</h5><ul>${actions}</ul></div>
  </aside>`;
}

function renderNoteCard(ch) {
  if (ch.isPartIntro || !ch.keyPoints) return '';
  const subs = ch.subsections.map(s => `
    <div class="sub-focus"><div class="sub-title">${esc(s.title)}</div><div class="sub-highlight">${esc(s.highlight)}</div></div>`).join('');
  const flow = ch.flow.map((step, i) => `
    <div class="timeline-step"><div class="timeline-dot"></div><div class="timeline-content">${esc(step)}</div>${i < ch.flow.length - 1 ? '<div class="timeline-line"></div>' : ''}</div>`).join('');
  const keys = ch.keyPoints.map(k => `<li>${esc(k)}</li>`).join('');
  return `<article id="note-${ch.id}" class="analysis-card">
    <div class="part-label">${esc(ch.part || '')}</div>
    <h3>${esc(ch.title)}</h3>
    ${subs ? `<div class="subsection-map"><h4>子标题重点</h4>${subs}</div>` : ''}
    <div class="key-points"><h4>章节重点</h4><ul>${keys}</ul></div>
    <div class="flow-chain"><h4>逻辑流</h4><div class="timeline">${flow}</div></div>
  </article>`;
}

function buildChapters() {
  return BOOK_STRUCTURE.filter(ch => !ch.isPartIntro).map(ch => {
    const fpath = path.join(TEXT_DIR, ch.file);
    const raw = fs.existsSync(fpath) ? fs.readFileSync(fpath, 'utf-8') : '';
    return { ...ch, html: cleanHtml(raw, ch.subsections) };
  });
}

function renderStructureAudit() {
  const rows = BOOK_STRUCTURE.map(ch => {
    const status = ch.isPartIntro ? '部分导言' : ch.match ? '✓ 对应' : '⚠ 元数据偏差';
    const cls = ch.match || ch.isPartIntro ? 'match-ok' : 'match-warn';
    const note = ch.matchNote ? `<div class="audit-note">${esc(ch.matchNote)}</div>` : '';
    const subs = ch.subsections.length
      ? `<ul class="audit-subs">${ch.subsections.map(s => `<li><strong>${esc(s.title)}</strong> → ${esc(s.highlight.slice(0, 40))}…</li>`).join('')}</ul>`
      : '<span class="audit-none">（无子标题）</span>';
    return `<div class="audit-row ${cls}">
      <div class="audit-main">
        <span class="audit-status">${status}</span>
        <div class="audit-titles">
          <div class="audit-parent">${ch.part ? esc(ch.part) : '—'}</div>
          <div class="audit-child">→ ${esc(ch.title)}</div>
          <div class="audit-file">文件: ${esc(ch.file)} | EPUB title: ${esc(ch.epubTitle)}</div>
          ${note}
        </div>
      </div>
      <div class="audit-subs-wrap">${subs}</div>
    </div>`;
  }).join('');

  return `<div class="audit-summary">
    <p>全书 <strong>${BOOK_STRUCTURE.filter(c => !c.isPartIntro).length}</strong> 个阅读章节 + <strong>3</strong> 个部分导言 = <strong>${BOOK_STRUCTURE.length}</strong> 个结构单元</p>
    <p>子标题（H3）共 <strong>${BOOK_STRUCTURE.reduce((n, c) => n + c.subsections.length, 0)}</strong> 个，均已与父章节对应标注重点</p>
    <p class="audit-warn-text">⚠ 3处 EPUB 文件 &lt;title&gt; 标签与章节不符（Section0001/0002/0004），正文 H2 标题正确，阅读指南以正文为准</p>
  </div>${rows}`;
}

function generateHtml(chapters) {
  const readChapters = BOOK_STRUCTURE.filter(c => !c.isPartIntro);
  const navDesktop = readChapters.map(ch => `<a href="#${ch.id}" class="chapter-link">${esc(ch.short + ' ' + ch.title.replace(/^第\d+章\s*/, '').slice(0, 12))}</a>`).join('\n');
  const navMobile = readChapters.map(ch => `<button type="button" class="drawer-link" data-target="${ch.id}">${esc(ch.title)}</button>`).join('\n');

  const sections = BOOK_STRUCTURE.map(ch => {
    const data = chapters.find(c => c.id === ch.id);
    const html = data?.html || (ch.isPartIntro ? cleanHtml(fs.readFileSync(path.join(TEXT_DIR, ch.file), 'utf-8'), []) : '');
    const partBadge = ch.part ? `<div class="part-badge">${esc(ch.part)}</div>` : '';
    return `<section id="${ch.id}" class="chapter${ch.isPartIntro ? ' part-intro' : ''}">
      ${partBadge}
      <h2 class="chapter-title">${esc(ch.title)}</h2>
      <div class="chapter-body">${html}</div>
      ${renderSummary(ch.summary)}
    </section>`;
  }).join('\n');

  const notes = BOOK_STRUCTURE.filter(c => !c.isPartIntro).map(renderNoteCard).join('');
  const noteNav = readChapters.map(ch => `<button type="button" class="note-nav-btn" data-note="${ch.id}">${esc(ch.short)}</button>`).join('');

  const phases = READING_GUIDE.phases.map((p, i) => `
    <details class="phase-card"${i === 0 ? ' open' : ''}>
      <summary><span class="phase-num">${i + 1}</span><span class="phase-info"><strong>${esc(p.phase)}</strong><em>${esc(p.duration)}</em></span></summary>
      <ol>${p.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    </details>`).join('');
  const tips = READING_GUIDE.tips.map(t => `<li>${esc(t)}</li>`).join('');

  const m = BOOK_META;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="${m.themeColor}"/>
<title>${esc(m.title)} · 阅读指南</title>
<style>
:root{--bg:#f7f5f8;--surface:#fff;--text:#1c1c1e;--text-secondary:#636366;--accent:${m.accent};--accent-light:${m.accentLight};--border:#e5dfe8;--flow-bg:#f3eef5;--diff-bg:#fdf8f0;--highlight-bg:#fff9e6;--highlight-border:#d4a574;--nav-h:56px;--header-h:52px;--safe-b:env(safe-area-inset-bottom,0px);--safe-t:env(safe-area-inset-top,0px)}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);line-height:1.75;padding-bottom:calc(var(--nav-h) + var(--safe-b) + 8px)}
.app-header{position:sticky;top:0;z-index:200;background:var(--accent);color:#fff;padding:calc(10px + var(--safe-t)) 16px 10px;display:flex;align-items:center;justify-content:space-between;min-height:var(--header-h)}
.app-header h1{font-size:16px;font-weight:600}.app-header .subtitle{font-size:11px;opacity:.85;margin-top:2px}.chapter-count{font-size:11px;opacity:.75;margin-top:4px}
.header-btn{background:rgba(255,255,255,.15);border:none;color:#fff;padding:6px 12px;border-radius:16px;font-size:13px;cursor:pointer}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:300;display:flex;background:var(--surface);border-top:1px solid var(--border);padding-bottom:var(--safe-b);height:calc(var(--nav-h) + var(--safe-b))}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:none;background:none;cursor:pointer;color:var(--text-secondary);font-size:10px;padding:6px 0}
.nav-item svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8}.nav-item.active{color:var(--accent);font-weight:600}
.tab-panel{display:none;min-height:calc(100vh - var(--header-h) - var(--nav-h))}.tab-panel.active{display:block}
.read-layout{display:block}.chapter-nav-desktop{display:none}
.chapter-content{padding:16px;max-width:720px;margin:0 auto}
.chapter{margin-bottom:48px;padding-bottom:24px;border-bottom:1px solid var(--border)}
.part-badge{display:inline-block;background:var(--accent-light);color:var(--accent);font-size:12px;padding:4px 12px;border-radius:12px;margin-bottom:8px;font-weight:600}
.chapter-title{font-size:20px;color:var(--accent);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--accent-light)}
.chapter.part-intro .chapter-body p{font-style:italic;color:var(--text-secondary)}
.chapter-body p{margin-bottom:14px;text-indent:2em;font-size:17px;line-height:1.85}
.chapter-h2{font-size:18px;color:var(--accent);margin:20px 0 12px;text-indent:0}
.subsection-block{margin:24px 0 16px;border-left:3px solid var(--accent);padding-left:0}
.subsection-head{font-size:16px;font-weight:600;color:var(--accent);margin:0 0 8px 16px;text-indent:0}
.subsection-highlight{background:var(--highlight-bg);border:1px solid var(--highlight-border);border-radius:8px;padding:12px 16px;margin:0 16px 16px;font-size:14px;line-height:1.6;text-indent:0}
.subsection-highlight strong{color:#a0522d}
.chapter-summary{margin-top:32px;padding:20px;background:var(--surface);border:2px solid var(--accent);border-radius:12px}
.summary-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.summary-badge{background:var(--accent);color:#fff;font-size:12px;padding:4px 12px;border-radius:12px;font-weight:600}
.summary-master{font-size:13px;color:var(--text-secondary);font-style:italic}
.golden-quote{border-left:4px solid var(--accent);padding:12px 16px;margin:0 0 14px;background:var(--accent-light);font-size:15px;line-height:1.7;color:var(--accent);font-weight:500;text-indent:0}
.summary-essence{font-size:15px;font-weight:600;margin-bottom:12px;text-indent:0}
.summary-body{font-size:15px;color:var(--text-secondary);line-height:1.75;margin-bottom:16px;text-indent:0}
.summary-actions h5{font-size:13px;color:var(--accent);margin-bottom:8px}.summary-actions ul{padding-left:20px}.summary-actions li{font-size:14px;margin-bottom:6px}
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:400;opacity:0;visibility:hidden;transition:opacity .25s}.drawer-overlay.open{opacity:1;visibility:visible}
.chapter-drawer{position:fixed;left:0;right:0;bottom:0;z-index:401;background:var(--surface);border-radius:16px 16px 0 0;max-height:75vh;transform:translateY(100%);transition:transform .3s;display:flex;flex-direction:column;padding-bottom:var(--safe-b)}.chapter-drawer.open{transform:translateY(0)}
.drawer-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)}
.drawer-close{background:none;border:none;font-size:24px;cursor:pointer}.drawer-links{overflow-y:auto;padding:8px 0;flex:1}
.drawer-link{display:block;width:100%;text-align:left;padding:12px 20px;border:none;background:none;font-size:14px;border-left:3px solid transparent;cursor:pointer}
.drawer-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
.notes-wrap{padding:12px 0 16px}.note-nav-scroll{display:flex;gap:8px;padding:0 16px 12px;overflow-x:auto;scrollbar-width:none}
.note-nav-btn{flex-shrink:0;padding:6px 14px;border-radius:16px;border:1px solid var(--border);background:var(--surface);font-size:13px;cursor:pointer;white-space:nowrap}
.note-nav-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.notes-content{padding:0 16px}.analysis-card{background:var(--surface);border-radius:12px;padding:20px;margin-bottom:16px;border:1px solid var(--border)}
.part-label{font-size:11px;color:var(--accent);font-weight:600;margin-bottom:6px;letter-spacing:.04em}
.analysis-card h3{font-size:17px;color:var(--accent);margin-bottom:14px}
.analysis-card h4{font-size:12px;color:var(--text-secondary);margin:14px 0 8px;letter-spacing:.04em}
.subsection-map{margin-bottom:16px}
.sub-focus{background:var(--highlight-bg);border-left:3px solid var(--highlight-border);padding:10px 14px;margin-bottom:8px;border-radius:0 8px 8px 0}
.sub-title{font-weight:600;font-size:14px;color:#8b6914;margin-bottom:4px}
.sub-highlight{font-size:13px;color:var(--text-secondary);line-height:1.5}
.key-points ul{padding-left:18px}.key-points li{margin-bottom:6px;font-size:15px}
.timeline{padding:8px 0 8px 8px}.timeline-step{position:relative;padding-left:24px;padding-bottom:16px}
.timeline-dot{position:absolute;left:0;top:6px;width:10px;height:10px;background:var(--accent);border-radius:50%}
.timeline-line{position:absolute;left:4px;top:18px;width:2px;height:calc(100% - 6px);background:var(--accent-light)}
.timeline-content{background:var(--flow-bg);padding:8px 14px;border-radius:8px;font-size:14px}
.framework-wrap,.guide-wrap,.audit-wrap{padding:16px;max-width:720px;margin:0 auto}
.fw-part{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px}
.fw-part-title{font-weight:600;color:#fff;background:var(--accent);padding:8px 12px;border-radius:8px;margin-bottom:10px;font-size:14px;text-align:center}
.fw-ch{font-size:13px;padding:8px 0;border-bottom:1px solid var(--border);line-height:1.5}.fw-ch:last-child{border:none}
.audit-summary{background:var(--accent-light);border-radius:12px;padding:16px;margin-bottom:16px;font-size:14px;line-height:1.7}
.audit-warn-text{color:#a0522d;margin-top:8px;font-weight:500}
.audit-row{border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px;background:var(--surface)}
.audit-row.match-warn{border-color:#d4a574;background:#fffdf8}
.audit-status{font-size:12px;font-weight:600;padding:2px 8px;border-radius:8px;background:var(--accent-light);color:var(--accent);display:inline-block;margin-bottom:8px}
.match-warn .audit-status{background:#fff3e0;color:#a0522d}
.audit-parent{font-size:13px;color:var(--accent);font-weight:600}
.audit-child{font-size:15px;font-weight:600;margin:4px 0}
.audit-file{font-size:11px;color:var(--text-secondary)}
.audit-note{font-size:12px;color:#a0522d;margin-top:6px;padding:6px 10px;background:#fff8f0;border-radius:6px}
.audit-subs{font-size:12px;padding-left:16px;margin-top:8px;line-height:1.6;color:var(--text-secondary)}
.audit-none{font-size:12px;color:var(--text-secondary);font-style:italic}
.phase-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:12px;overflow:hidden}
.phase-card summary{display:flex;align-items:center;gap:12px;padding:16px;cursor:pointer;list-style:none}
.phase-num{width:28px;height:28px;background:var(--accent);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0}
.phase-info strong{font-size:15px}.phase-info em{font-size:12px;color:var(--text-secondary);font-style:normal}
.phase-card ol{padding:0 16px 16px 32px;font-size:14px}.tips-box{background:var(--accent-light);border-radius:12px;padding:20px;margin-top:20px}
.book-img{text-align:center;margin:12px 0}.book-img img{max-width:100%;height:auto;border-radius:4px}
@media(min-width:769px){
  body{padding-bottom:0}.header-btn{display:none}
  .bottom-nav{position:sticky;top:var(--header-h);bottom:auto;border-top:none;border-bottom:1px solid var(--border);padding-bottom:0;height:var(--nav-h)}
  .nav-item{flex-direction:row;gap:6px;font-size:13px}
  .read-layout{display:grid;grid-template-columns:200px 1fr}
  .chapter-nav-desktop{display:block;background:var(--surface);border-right:1px solid var(--border);padding:16px 0;position:sticky;top:calc(var(--header-h) + var(--nav-h));height:calc(100vh - var(--header-h) - var(--nav-h));overflow-y:auto}
  .chapter-link{display:block;padding:8px 14px;font-size:12px;color:var(--text-secondary);text-decoration:none;border-left:3px solid transparent}
  .chapter-link:hover,.chapter-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
  .note-nav-scroll{display:none}.notes-content{max-width:800px;margin:0 auto}
}
</style>
</head>
<body>
<header class="app-header">
  <div><h1>${esc(m.title)}</h1><div class="subtitle">${esc(m.subtitle)}</div><div class="chapter-count">15章 · 69个子标题重点 · 结构已对照</div></div>
  <button type="button" class="header-btn" id="openDrawer">目录</button>
</header>
<nav class="bottom-nav">
  <button type="button" class="nav-item active" data-tab="tab-read"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><span>原文</span></button>
  <button type="button" class="nav-item" data-tab="tab-notes"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>笔记</span></button>
  <button type="button" class="nav-item" data-tab="tab-structure"><svg viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M9 3h6a2 2 0 0 1 2 2v4"/><path d="M9 3v18"/><path d="M15 9h4a2 2 0 0 1 2 2v4"/><path d="M15 21h-6a2 2 0 0 1-2-2v-4"/></svg><span>结构</span></button>
  <button type="button" class="nav-item" data-tab="tab-guide"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><span>读法</span></button>
</nav>
<section id="tab-read" class="tab-panel active"><div class="read-layout"><nav class="chapter-nav-desktop">${navDesktop}</nav><main class="chapter-content">${sections}</main></div></section>
<section id="tab-notes" class="tab-panel"><div class="notes-wrap"><div class="note-nav-scroll">${noteNav}</div><div class="notes-content">${notes}</div></div></section>
<section id="tab-structure" class="tab-panel"><div class="audit-wrap"><h2 style="font-size:18px;color:var(--accent);margin-bottom:16px;text-align:center">章节结构对照</h2>${renderStructureAudit()}</div></section>
<section id="tab-guide" class="tab-panel"><div class="guide-wrap"><p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">本书内容敏感，请在安全、私密的环境中阅读。</p>${phases}<div class="tips-box"><h3>阅读要诀</h3><ul>${tips}</ul></div></div></section>
<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="chapter-drawer" id="chapterDrawer"><div class="drawer-header"><h2>目录</h2><button type="button" class="drawer-close" id="closeDrawer">&times;</button></div><div class="drawer-links">${navMobile}</div></div>
<script>
(function(){
  const tabs=document.querySelectorAll('.nav-item'),panels=document.querySelectorAll('.tab-panel');
  tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));panels.forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}));
  const o=document.getElementById('drawerOverlay'),d=document.getElementById('chapterDrawer');
  const open=()=>{o.classList.add('open');d.classList.add('open');document.body.style.overflow='hidden'};
  const close=()=>{o.classList.remove('open');d.classList.remove('open');document.body.style.overflow=''};
  document.getElementById('openDrawer').onclick=open;document.getElementById('closeDrawer').onclick=close;o.onclick=close;
  document.querySelectorAll('.drawer-link').forEach(l=>l.addEventListener('click',()=>{close();tabs.forEach(b=>b.classList.remove('active'));panels.forEach(p=>p.classList.remove('active'));document.querySelector('[data-tab="tab-read"]').classList.add('active');document.getElementById('tab-read').classList.add('active');setTimeout(()=>document.getElementById(l.dataset.target).scrollIntoView({behavior:'smooth'}),300)}));
  document.querySelectorAll('.chapter-link').forEach(l=>l.addEventListener('click',()=>{document.querySelectorAll('.chapter-link').forEach(x=>x.classList.remove('active'));l.classList.add('active')}));
  new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;document.querySelectorAll('.chapter-link,.drawer-link').forEach(l=>{l.classList.toggle('active',l.getAttribute('href')==='#'+id||l.dataset.target===id)})}})},{rootMargin:'-15% 0px -75% 0px'}).observe&&document.querySelectorAll('.chapter').forEach(s=>new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;document.querySelectorAll('.chapter-link,.drawer-link').forEach(l=>{l.classList.toggle('active',l.getAttribute('href')==='#'+id||l.dataset.target===id)})}})},{rootMargin:'-15% 0px -75% 0px'}).observe(s));
})();
</script>
</body></html>`;
}

if (fs.existsSync(IMG_SRC)) {
  if (fs.existsSync(IMG_DST)) fs.rmSync(IMG_DST, { recursive: true });
  fs.cpSync(IMG_SRC, IMG_DST, { recursive: true });
}

const chapters = buildChapters();
const html = generateHtml(chapters);
fs.writeFileSync(OUTPUT, html, 'utf-8');
console.log(`Generated ${OUTPUT}`);
console.log(`Chapters: ${BOOK_STRUCTURE.filter(c => !c.isPartIntro).length}, Subsections: ${BOOK_STRUCTURE.reduce((n,c)=>n+c.subsections.length,0)}`);
console.log(`Size: ${(fs.statSync(OUTPUT).size/1024).toFixed(1)} KB`);
