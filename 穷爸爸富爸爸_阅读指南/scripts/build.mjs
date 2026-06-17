import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_TXT = path.join(ROOT, '_source', '穷爸爸.txt');
const OUTPUT_DIR = ROOT;

const CHAPTER_MARKERS = [
  { id: 'preface', title: '序言', short: '序言', startPattern: /^第一卷 第一章/ },
  { id: 'intro', title: '引言：富爸爸，穷爸爸', short: '引言', startPattern: /^富爸爸，穷爸爸/ },
  { id: 'ch01', title: '第一课：富人不为钱工作', short: '第一课', startPattern: /^第一卷 第二章/ },
  { id: 'ch02', title: '第二课：为什么要教授财务知识', short: '第二课', startPattern: /^第一卷 第三章/ },
  { id: 'ch03', title: '第三课：关注自己的事业', short: '第三课', startPattern: /^第一卷 第四章/ },
  { id: 'ch04', title: '第四课：税收的历史和公司的力量', short: '第四课', startPattern: /^第一卷 第五章/ },
  { id: 'ch05', title: '第五课：富人的投资', short: '第五课', startPattern: /^第一卷 第六章/ },
  { id: 'ch06', title: '第六课：不要为金钱而工作', short: '第六课', startPattern: /^第一卷 第七章/ },
  { id: 'ch07', title: '克服阻碍', short: '阻碍', startPattern: /^第一卷 第八章/ },
  { id: 'ch08', title: '开始行动', short: '行动', startPattern: /^第一卷 第九章/ },
  { id: 'ch09', title: '还需要更多东西吗', short: '进阶', startPattern: /^第一卷 第一十章/ },
  { id: 'ch10', title: '后记', short: '后记', startPattern: /^第一卷 第一十一章/ },
];

const CHAPTER_SUMMARIES = {
  preface: {
    master: '莎伦·莱希特',
    quote: '如果你和我有着同样的烦恼，那么这就是你所需要的。',
    essence: '学校教育准备了职业，却没准备真实世界的金钱游戏。老鼠赛跑是默认路径，财商教育必须从家庭开始。',
    summary: '一位会计师母亲发现：即使高学历、好工作，也无法保证财务安全。儿子的一句话「我不想上学，我想发财」让她意识到旧建议已失效。现金流游戏揭示了「老鼠赛跑」——大多数人终生为老板、政府和银行工作。本书使命：把富爸爸的财商智慧带给每一个家庭。',
    actions: ['问自己：我是否在老鼠赛跑中？', '观察周围：最富有的人是否只靠学历？', '开始和家人讨论金钱，而非回避'],
  },
  intro: {
    master: '罗伯特·清崎',
    quote: '选择不同，命运也是不同的。——罗伯特·弗罗斯特',
    essence: '两个爸爸，两种金钱观。你接收哪一种，就走向哪一种人生。',
    summary: '穷爸爸说「贪财乃万恶之源」，富爸爸说「贫困才是万恶之本」。穷爸爸说「我付不起」，富爸爸问「我怎样才能付得起」。同样的努力，不同的观念，造就截然不同的终点。9岁那年，作者选择了富爸爸，开始30年的财商学习。六门课，是这本书的骨架。',
    actions: ['列出两个爸爸式观念：哪些来自父母？', '把「我付不起」换成「怎样才能付得起」', '确认全书六课目录，建立阅读地图'],
  },
  ch01: {
    master: '富爸爸',
    quote: '富人不为钱工作，而让钱为自己工作。',
    essence: '恐惧和欲望是金钱的奴隶主。用头脑控制情感，而非被情感控制。',
    summary: '9岁造硬币失败，但富爸爸说：放弃才是真正失败。大多数人因恐惧接受低薪，因欲望过度消费，终生为钱奔命。核心转折：收到工资先支付自己（存/投资），再付账单——让压力驱动你去创造收入，而非妥协。',
    actions: ['本月工资到账：先转10%到储蓄/投资账户', '记录一次因恐惧而未行动的决定', '对老板说「我需要学更多」而非「我需要更高工资」'],
  },
  ch02: {
    master: '巴克敏斯特·菲莱',
    quote: '财富就是支持一个人生存多长时间的能力。',
    essence: '富人买资产，穷人买负债，中产阶级买他们以为是资产的负债。',
    summary: '全书最重要的一课：资产=把钱放进口袋，负债=把钱从口袋取走。自住房、汽车、信用卡——若只出不进，就是负债。中产阶级收入越高，税越多，买更大的房子，陷得更深。真正的财富不是净资产数字，而是：今天停止工作，你还能活多久？',
    actions: ['画个人资产负债表：列出所有资产和负债', '标注每项是「进钱」还是「出钱」', '计算：被动收入能否覆盖基本支出？'],
  },
  ch03: {
    master: '雷·克罗克',
    quote: '我的真正生意是房地产，不是汉堡包。',
    essence: '职业让你赚钱，事业让你自由。关注资产项，而非收入项。',
    summary: '麦当劳创始人揭示：表面卖汉堡，实际囤黄金地段的地产。大多数人混淆职业和事业——银行职员是职业，他拥有的收租房产才是事业。前一课说为谁工作（老板/政府/银行），这一课说：建立你自己的资产项，让资产为你工作。',
    actions: ['写下你的职业 vs 你的事业（资产项）', '思考：你的「生意」隐藏在哪一层？', '开始一项小资产：哪怕只是一笔定期定投'],
  },
  ch04: {
    master: '富爸爸',
    quote: '财商就是了解金钱的力量，而金钱的力量来自法律。',
    essence: '公司是最伟大的发明——合法保护个人、合法减少税负。',
    summary: '税收的历史：最初向富人和公司征收，但富人用公司法规合法避税。雇员：赚钱→交税→花钱；公司所有者：赚钱→花钱→交税。顺序不同，结果天差地别。1-2周可成立公司。不懂税法和公司结构，就注定多交一辈子税。',
    actions: ['了解个人 vs 公司的基本税务差异', '阅读一本税法入门或咨询专业人士', '思考：哪些支出可通过公司结构合法处理？'],
  },
  ch05: {
    master: '富爸爸',
    quote: '投资的第一个问题：多久能收回成本？',
    essence: '财务IQ = 会计+投资+市场+法律。创造机会的人比购买机会的人更富。',
    summary: '两种投资者：买现成产品 vs 创造投资机会。用5000美元买房产、翻新、卖出，2000落袋、贷款延期——有限资金创造无限回报。财务IQ四要素缺一不可。机会先给「成熟投资者」，再由他们转手给普通人——那时利润已被拿走大半。',
    actions: ['学看一张简单的损益表和资产负债表', '对一个投资算回收期：多久回本？', '关注一个你不懂的领域，开始入门学习'],
  },
  ch06: {
    master: '富爸爸',
    quote: '我不为钱工作，钱要为我工作。年轻时应为学习而工作。',
    essence: '最重要的技能是销售与沟通。专业越深越依赖雇主，通才+销售=独立。',
    summary: '富爸爸让作者扫厕所——不为钱，为克服傲慢和学习管理。穷爸爸鼓励成为专才（医生/律师），富爸爸鼓励成为通才+懂销售的人。只懂一种收入（工资）的人最脆弱。选择工作时问：我能学到什么技能？而非：我能赚多少钱？',
    actions: ['评估当前工作：学到了哪些可迁移技能？', '读一本销售或沟通类书', '列出三种收入类型：劳动/证券/被动，各占比多少'],
  },
  ch07: {
    master: '洛克菲勒',
    quote: '我总是试图将每一次灾难转化成机会。',
    essence: '五大阻碍：恐惧、愤世嫉俗、懒惰、坏习惯、傲慢。胜利意味着不害怕失败。',
    summary: '得州人精神：赢得骄傲，输也骄傲——「记住阿拉莫」。90%的人因怕损失而选「安全」投资组合，结果不赢。愤世嫉俗者像「小鸡」：天要塌了！忙碌是懒惰的伪装——用忙逃避思考。先支付自己是最好的习惯。傲慢=用「我知道」掩盖「我不知道」。',
    actions: ['写下最怕的财务失败是什么，然后想：失败了怎么办？', '识别身边「小鸡」式声音，练习过滤', '本月先支付自己，再付其他账单'],
  },
  ch08: {
    master: '罗伯特·清崎',
    quote: '金矿到处都是，但大部分人没有经过相应的培训来发现金矿。',
    essence: '十个步骤唤醒理财天赋。精神动力>技术技巧。',
    summary: '10条行动指南：①超现实理由 ②每天选择 ③选朋友 ④掌握模式 ⑤先给后取 ⑥资产买奢侈品 ⑦给经纪人优厚报酬 ⑧做印第安给予者 ⑨无私的力量 ⑩专注+导师。核心：先投资教育（头脑是你唯一的真资产），再投资具体项目。给专业的人优厚报酬，买时间和智慧。',
    actions: ['写一句「我要变富」的超现实理由', '报名一个财务/投资类课程或读一本新书', '找一位做过的人，请吃午饭请教'],
  },
  ch09: {
    master: '富爸爸',
    quote: '给予，然后获得——而非得到了再付出。',
    essence: '7000美元也能支付大学——关键是财商，不是省钱。',
    summary: '补充提示：寻找被忽视的机会、向内看、克服自我怀疑。穷爸爸总说「有多余的钱就捐」，但他从未有过多余。富爸爸信奉先给后获。财商是可以传承的最宝贵礼物——在饭桌上教，而非等学校教。',
    actions: ['找一个被大多数人忽视的「小机会」', '问自己：我真正想要的是什么？', '和家人分享一个今天学到的财商概念'],
  },
  ch10: {
    master: '莎伦·莱希特',
    quote: '经济头脑是在解决我们经济问题的过程中锻炼出来的。',
    essence: '玩安全 vs 玩高明——你有两个选择，未来不会等待。',
    summary: '后记回到起点：7000美元付大学费用的方法，证明财商可以以小博大。改变需要共同体。任何人都能变富——如果你选择那么做。一流的生活不是富有，而是拥有选择的自由。把这本书传给孩子，在饭桌上开始财商对话。',
    actions: ['制定一个可传给孩子/家人的财商计划', '选择：继续玩安全，还是开始玩高明？', '每月复盘一次个人现金流'],
  },
};

const CHAPTER_ANALYSIS = [
  {
    id: 'preface', title: '序言', short: '序言',
    keyPoints: ['学校教育不教理财，导致大多数人陷入"老鼠赛跑"', '现金流游戏揭示内部路与外部路', '旧规则"好好学习找好工作"在新经济时代已失效', '本书使命：把财商教育带给家庭'],
    difficulties: [
      { concept: '老鼠赛跑', deconstruct: '上学→找工作→结婚买房→更多债务→更努力工作→循环。跳出唯一方法：提升财商（会计+投资）' },
      { concept: '两套游戏规则', deconstruct: '雇员为老板/政府/银行工作；股东/投资者在公司裁员时反而更富' },
    ],
    flow: ['旧教育失效', '老鼠赛跑陷阱', '两套规则', '财商觉醒', '六课启程'],
  },
  {
    id: 'intro', title: '引言：富爸爸，穷爸爸', short: '引言',
    keyPoints: ['两个爸爸提供对立观念，对比选择决定命运', '"我付不起" vs "我怎样才能付得起"', '观念来自家庭，而非学校', '富爸爸教6门财商课，核心是让钱为你工作'],
    difficulties: [
      { concept: '两个爸爸的对比', deconstruct: '穷爸爸：稳定工作+储蓄。富爸爸：承担风险+构建资产。选哪个=选哪种人生' },
      { concept: '"我付不起" vs "我怎样才能付得起"', deconstruct: '陈述句关闭大脑，疑问句启动思考。语言模式塑造财务命运' },
    ],
    flow: ['两种金钱观', '观念来自家庭', '选择富爸爸', '六课预告', '30年学习'],
  },
  {
    id: 'ch01', title: '第一课：富人不为钱工作', short: '第一课',
    keyPoints: ['富人不为钱工作，而让钱为自己工作', '恐惧和欲望驱动大多数人成为金钱的奴隶', '情感控制思维时，人成为奴隶；用头脑控制情感时，人成为主人', '放弃=真正失败；尝试本身就是学习', '先支付自己，再让压力驱动找钱'],
    difficulties: [
      { concept: '为什么穷爸爸说"为钱工作"', deconstruct: '穷爸爸思维：工作→赚钱→付账单。富爸爸思维：构建资产→现金流→钱为你工作' },
      { concept: '恐惧与贪婪的循环', deconstruct: '没工资→恐惧→接受低薪→欲望→消费→更恐惧。打破循环需要财商而非更高工资' },
      { concept: '先支付自己', deconstruct: '收到工资先存/投资，再付账单。压力会逼你想办法增加收入，而不是轻易妥协' },
    ],
    flow: ['为钱工作陷阱', '识别情感驱动', '拒绝因恐惧妥协', '先支付自己', '让钱为你工作'],
  },
  {
    id: 'ch02', title: '第二课：为什么要教授财务知识', short: '第二课',
    keyPoints: ['规则1：分清资产和负债——资产把钱放进口袋，负债把钱从口袋取走', '富人买入资产，穷人只有支出，中产阶级买入以为是资产的负债', '财富=资产产生的现金流能支撑你生存多久', '房子可能是最大的负债（如果它是最大"投资"）', '专注现金流，而非单纯净资产数字'],
    difficulties: [
      { concept: '资产 vs 负债（富爸爸定义）', deconstruct: '不看会计定义，看现金流方向。自住房=负债（持续支出）；出租房/股票/版权=资产（持续收入）' },
      { concept: '中产阶级陷阱', deconstruct: '收入增加→税增加→支出增加→买更大房子→更多贷款。看起来富有，实际高杠杆' },
      { concept: '财富的真正定义', deconstruct: '菲莱：财富=停止工作后还能活多久。不是净资产，是被动收入 vs 支出的关系' },
    ],
    flow: ['分清资产负债', '看懂现金流', '买入真资产', '减少伪资产', '财富=自由时间'],
  },
  {
    id: 'ch03', title: '第三课：关注自己的事业', short: '第三课',
    keyPoints: ['职业≠事业：职业是打工，事业是积累资产', '麦当劳的真正生意是房地产，不是汉堡', '关注自己的事业=围绕资产项构建，而非围绕收入项', '你的事业是资产组合，而非你的职位'],
    difficulties: [
      { concept: '职业 vs 事业', deconstruct: '银行职员是职业，他拥有的能产生收入的房产/股票才是事业。大多数人只有职业没有事业' },
      { concept: '麦当劳的秘密', deconstruct: '雷·克罗克卖的是分店特许权+黄金地段地产。商业模式的核心往往是隐藏的那一层' },
      { concept: '为谁工作', deconstruct: '雇员为老板、政府(税)、银行(贷)工作。建立事业=让资产为你工作' },
    ],
    flow: ['区分职业事业', '找到真正生意', '构建资产项', '收入来自资产', '事业>职位'],
  },
  {
    id: 'ch04', title: '第四课：税收的历史和公司的力量', short: '第四课',
    keyPoints: ['税收最初向富人和公司征收，但富人用公司法规避税', '财商知识=力量；不懂税则只能被税', '公司是最伟大的发明——保护个人、合法减税', '收入→公司→支出→税，顺序决定税负'],
    difficulties: [
      { concept: '为什么富人不交税', deconstruct: '不是违法，是懂规则。公司结构让支出在税前扣除，个人则是先税后支出' },
      { concept: '公司=法律保护伞', deconstruct: '1-2周内可成立公司。用公司购买资产、支付合法支出，再对剩余利润缴税' },
      { concept: '财商=法律力量', deconstruct: '同样收入，雇员交45%税，公司所有者可能只交20%。知识就是金钱' },
    ],
    flow: ['理解税收本质', '学习公司结构', '合法利用规则', '先支出后税', '财商=力量'],
  },
  {
    id: 'ch05', title: '第五课：富人的投资', short: '第五课',
    keyPoints: ['投资的第一个问题是：多久能收回成本？', '两种投资者：一买现成投资品，一创造投资机会', '财务IQ = 会计+投资+市场+法律', '用有限资金创造无限回报=真正投资者', '机会先给成熟投资者，再由他们转给普通人'],
    difficulties: [
      { concept: '两种投资者', deconstruct: '第一种买共同基金/股票（消费者）；第二种组织交易、创造投资（生产者）。后者回报更高' },
      { concept: '财务IQ四要素', deconstruct: '会计(读懂数字)+投资(钱生钱)+市场(供需)+法律(公司/税收结构)。缺一项都受限' },
      { concept: '"太冒险"的真相', deconstruct: '中产阶级说冒险，是因为缺乏财务知识看不懂。对有财商的人，同样交易风险可控' },
    ],
    flow: ['计算回收期', '提升财务IQ', '创造投资机会', '组合四要素', '钱生钱'],
  },
  {
    id: 'ch06', title: '第六课：不要为金钱而工作', short: '第六课',
    keyPoints: ['工作是为了学习技能，而非赚钱', '穷爸爸：专业越精→越依赖雇主；富爸爸：通才+销售能力→独立', '最重要的技能：销售+沟通', '年轻时应选择能学到最多技能的岗位', '财商+专业技能=不可替代'],
    difficulties: [
      { concept: '为技能工作 vs 为钱工作', deconstruct: '富爸爸让9岁的作者扫厕所——不是为了钱，是为了克服傲慢、学管理。技能比工资重要' },
      { concept: 'T型能力', deconstruct: '一方面深（专业），一方面广（销售/沟通/管理）。只精一门=高级打工者' },
      { concept: '管理三种收入', deconstruct: '学会管理：劳动收入、证券收入、被动收入。只懂一种=财务脆弱' },
    ],
    flow: ['选能学技能的工', '克服傲慢', '练销售沟通', '组合多种收入', '不为钱而为成长'],
  },
  {
    id: 'ch07', title: '克服阻碍', short: '阻碍',
    keyPoints: ['五大阻碍：恐惧、愤世嫉俗、懒惰、坏习惯、傲慢', '失败是过程的一部分，赢家也失败但不同在于态度', '忙碌=懒惰的另一种形式（用忙逃避思考）', '先支付自己=最好的习惯', '傲慢=无知+自大，用"我知道"掩盖"我不知道"'],
    difficulties: [
      { concept: '对失败的恐惧', deconstruct: '穷人因怕失败而不行动。富人欢迎失败，因为每次失败是付费学习' },
      { concept: '"我忙"=懒惰', deconstruct: '用忙碌逃避关键问题（我真正想要什么？）。停下来思考比盲目前行更重要' },
      { concept: '先支付自己', deconstruct: '每月先存10%再付账单。不是自私，是培养自我价值和财商习惯' },
    ],
    flow: ['识别五大阻碍', '拥抱失败', '拒绝假忙碌', '先支付自己', '保持开放学习'],
  },
  {
    id: 'ch08', title: '开始行动', short: '行动',
    keyPoints: ['10条行动指南：找超前的理由、每天选择、选朋友、掌握模式、先给后取…', '寻找新公式，而非拒绝新模式', '向做过的人请教（请吃午饭）', '参加培训班，用资产买奢侈品', '给经纪人优厚报酬，买专业建议'],
    difficulties: [
      { concept: '先给后取', deconstruct: '富爸爸：先提供价值/知识/服务，回报自然来。穷人等别人先给' },
      { concept: '资产买奢侈品', deconstruct: '不用储蓄买奢侈品，用资产产生的现金流买。先建资产，再享受' },
      { concept: '印第安给予者', deconstruct: '投资核心：多久收回成本？收回后资产=白得，风险=零' },
    ],
    flow: ['找强大理由', '选环境与人', '学新模式', '先给后取', '资产享生活'],
  },
  {
    id: 'ch09', title: '还需要更多东西吗', short: '进阶',
    keyPoints: ['额外提示：寻找被忽视的机会、向内看、克服自我怀疑', '用7000美元也能支付大学费用——关键是财商', '持续学习，保持行动', '财商是可以传承给下一代的最宝贵礼物'],
    difficulties: [
      { concept: '7000美元上大学', deconstruct: '不是省钱，是用财商创造现金流。同样的钱，财商不同结果天差地别' },
      { concept: '向内在看', deconstruct: '机会不在外面，在能否看到别人看不到的模式。内心越清晰，机会越多' },
    ],
    flow: ['超越书本', '向内觉察', '传承财商', '持续行动', '代际自由'],
  },
  {
    id: 'ch10', title: '后记', short: '后记',
    keyPoints: ['财商教育应从家庭开始，在饭桌上传递', '任何人都能改变——如果你选择那么做', '经济头脑在解决问题中锻炼出来', '超越变化：玩安全 vs 玩高明'],
    difficulties: [],
    flow: ['家庭传递', '人人可改变', '解决问题', '选择玩高明'],
  },
];

const READING_GUIDE = {
  phases: [
    { phase: '第一遍：抓框架', duration: '1-2天', steps: ['先读序言+两个爸爸对比，理解全书出发点', '速读6课标题，建立"财商六课"地图', '重点记住：资产/负债、老鼠赛跑、职业vs事业', '读完后看「框架」Tab，画出现金流方向图'] },
    { phase: '第二遍：精读6课', duration: '1周', steps: ['第一课最重要：情感驱动+先支付自己，逐段精读', '第二课：用自己的资产负债表对照资产/负债定义', '第三~六课每天一课，每课写1个可执行行动', '配合「笔记」Tab 的逻辑流，理解概念链条'] },
    { phase: '第三遍：行动篇', duration: '1-2周', steps: ['精读「克服阻碍」：对照5大阻碍自检', '精读「开始行动」：选3条立即执行（如先支付自己）', '建立个人资产负债表和现金流记录', '找一位财务导师或读一本会计入门书'] },
    { phase: '第四遍：实践+输出', duration: '持续', steps: ['每月更新资产负债表，追踪现金流变化', '用费曼技巧向朋友讲解资产vs负债', '玩现金流游戏或模拟投资练习', '把本书传给家人，在饭桌上讨论金钱观'] },
  ],
  tips: [
    '这本书的"资产/负债"定义与会计不同，按作者定义理解',
    '不要停留在"道理对"——立刻画你的资产负债表',
    '先支付自己是全书最易执行的第一步',
    '两个爸爸对比法是全书核心思维工具，反复使用',
    '适合和《认知觉醒》配合：一个改认知，一个改财商',
  ],
};

const BOOK_META = {
  title: '穷爸爸富爸爸',
  subtitle: '罗伯特·T·清崎 著 · 阅读指南',
  themeColor: '#8b4513',
  accent: '#8b4513',
  accentLight: '#f5ebe0',
};

const JUNK_PATTERNS = [
  /^本书由TXT/i, /^声明：/i, /^1\.推荐/i, /^2\.手机/i, /^3\.找小说/i, /^4\.下载/i,
  /^欢迎来本/i, /书盟|書萌|txtbook|UUｔ|UUTxT|uutxt|诠纹|铨文|全文/i,
  /^穷爸爸富爸爸\s*$/, /^第一卷 第/,
];

function readTxt() {
  const buf = fs.readFileSync(SOURCE_TXT);
  return new TextDecoder('gbk').decode(buf);
}

function isJunkLine(line) {
  const t = line.trim();
  if (!t) return true;
  return JUNK_PATTERNS.some(p => p.test(t));
}

function linesToHtml(lines) {
  const parts = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || isJunkLine(line)) continue;
    if (/^\?第/.test(t) || /^第[一二三四五六七八九十\d]+课/.test(t)) {
      parts.push(`<h3 class="section-head">${esc(t.replace(/^\?/, ''))}</h3>`);
    } else if (/^原因之[一二三四五]：/.test(t)) {
      parts.push(`<h4 class="sub-head obstacle-head">${esc(t)}</h4>`);
    } else if (/^\d+\.\s*我/.test(t) || /^\d+\.\s*每天/.test(t) || /^\d+\.\s*给/.test(t)) {
      parts.push(`<h4 class="sub-head step-head">${esc(t)}</h4>`);
    } else if (/^——/.test(t) || (t.length < 30 && !t.startsWith('  ') && !/[。！？；]$/.test(t) && /^[\u4e00-\u9fa5A-Za-z]/.test(t))) {
      parts.push(`<h4 class="sub-head">${esc(t)}</h4>`);
    } else {
      parts.push(`<p>${esc(t)}</p>`);
    }
  }
  return parts.join('\n');
}

function renderChapterSummary(chapterId) {
  const s = CHAPTER_SUMMARIES[chapterId];
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
              <h5>行动要点</h5>
              <ul>${actions}</ul>
            </div>
          </aside>`;
}

function splitChapters(text) {
  const lines = text.split(/\r?\n/);
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    for (const m of CHAPTER_MARKERS) {
      if (m.startPattern.test(t)) {
        starts.push({ ...m, lineIndex: i });
        break;
      }
    }
  }
  const chapters = [];
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].lineIndex;
    const end = i + 1 < starts.length ? starts[i + 1].lineIndex : lines.length;
    chapters.push({
      id: starts[i].id,
      title: starts[i].title,
      short: starts[i].short,
      html: linesToHtml(lines.slice(start, end)),
    });
  }
  return chapters;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateHtml(chapters, analysis, meta) {
  const chapterNavDesktop = chapters.map(ch => `<a href="#${ch.id}" class="chapter-link">${esc(ch.title)}</a>`).join('\n');
  const chapterNavMobile = chapters.map(ch => `<button type="button" class="drawer-link" data-target="${ch.id}">${esc(ch.title)}</button>`).join('\n');
  const chapterSections = chapters.map(ch => `
        <section id="${ch.id}" class="chapter">
          <h2 class="chapter-title">${esc(ch.title)}</h2>
          <div class="chapter-body">${ch.html}</div>
          ${renderChapterSummary(ch.id)}
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
<meta name="theme-color" content="${meta.themeColor}"/>
<title>${esc(meta.title)} · 阅读指南</title>
<style>
:root{
  --bg:#f7f4f0;--surface:#fff;--text:#1c1c1e;--text-secondary:#636366;
  --accent:${meta.accent};--accent-light:${meta.accentLight};--border:#e8e0d8;
  --flow-bg:#f5f0ea;--diff-bg:#fff8f0;--nav-h:56px;--header-h:52px;
  --safe-b:env(safe-area-inset-bottom,0px);--safe-t:env(safe-area-inset-top,0px)
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif;background:var(--bg);color:var(--text);line-height:1.75;padding-bottom:calc(var(--nav-h) + var(--safe-b) + 8px)}
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
.chapter-title{font-size:20px;color:var(--accent);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--accent-light)}
.chapter-body p{margin-bottom:14px;text-indent:2em;font-size:17px;line-height:1.85}
.chapter-body .section-head{font-size:17px;color:var(--accent);margin:24px 0 12px;text-indent:0;font-weight:600}
.chapter-body .sub-head{font-size:15px;font-weight:600;margin:20px 0 10px;text-indent:0;color:var(--text)}
.chapter-body .obstacle-head{color:#a0522d;font-size:16px;margin-top:28px;padding-left:12px;border-left:3px solid #c45a00}
.chapter-body .step-head{color:var(--accent);font-size:15px;margin-top:24px}
.chapter-summary{margin-top:32px;padding:20px;background:var(--surface);border:2px solid var(--accent);border-radius:12px}
.summary-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.summary-badge{background:var(--accent);color:#fff;font-size:12px;padding:4px 12px;border-radius:12px;font-weight:600}
.summary-master{font-size:13px;color:var(--text-secondary);font-style:italic}
.golden-quote{border-left:4px solid var(--accent);padding:12px 16px;margin:0 0 14px;background:var(--accent-light);font-size:16px;line-height:1.7;color:var(--accent);font-weight:500;text-indent:0}
.summary-essence{font-size:15px;font-weight:600;color:var(--text);margin-bottom:12px;line-height:1.6;text-indent:0}
.summary-body{font-size:15px;color:var(--text-secondary);line-height:1.75;margin-bottom:16px;text-indent:0}
.summary-actions h5{font-size:13px;color:var(--accent);margin-bottom:8px;letter-spacing:.04em}
.summary-actions ul{padding-left:20px;margin:0}
.summary-actions li{font-size:14px;margin-bottom:6px;line-height:1.6;color:var(--text)}
.chapter-count{font-size:11px;opacity:.75;margin-top:4px}
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:400;opacity:0;visibility:hidden;transition:opacity .25s}
.drawer-overlay.open{opacity:1;visibility:visible}
.chapter-drawer{position:fixed;left:0;right:0;bottom:0;z-index:401;background:var(--surface);border-radius:16px 16px 0 0;max-height:70vh;transform:translateY(100%);transition:transform .3s ease;display:flex;flex-direction:column;padding-bottom:var(--safe-b)}
.chapter-drawer.open{transform:translateY(0)}
.drawer-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);flex-shrink:0}
.drawer-header h2{font-size:16px;color:var(--accent)}
.drawer-close{background:none;border:none;font-size:24px;color:var(--text-secondary);cursor:pointer;padding:0 4px;line-height:1}
.drawer-links{overflow-y:auto;padding:8px 0;flex:1;-webkit-overflow-scrolling:touch}
.drawer-link{display:block;width:100%;text-align:left;padding:12px 20px;border:none;background:none;font-size:15px;color:var(--text);border-left:3px solid transparent;cursor:pointer}
.drawer-link:active,.drawer-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
.notes-wrap{padding:12px 0 16px}
.note-nav-scroll{display:flex;gap:8px;padding:0 16px 12px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.note-nav-scroll::-webkit-scrollbar{display:none}
.note-nav-btn{flex-shrink:0;padding:6px 14px;border-radius:16px;border:1px solid var(--border);background:var(--surface);font-size:13px;color:var(--text-secondary);cursor:pointer;white-space:nowrap}
.note-nav-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.notes-content{padding:0 16px}
.analysis-card{background:var(--surface);border-radius:12px;padding:20px;margin-bottom:16px;border:1px solid var(--border);display:none}
.analysis-card.active{display:block}
.analysis-card h3{font-size:17px;color:var(--accent);margin-bottom:14px}
.analysis-card h4{font-size:12px;color:var(--text-secondary);margin:14px 0 8px;letter-spacing:.04em}
.key-points ul{padding-left:18px}.key-points li{margin-bottom:6px;font-size:15px;line-height:1.6}
.timeline{padding:8px 0 8px 8px}
.timeline-step{position:relative;padding-left:24px;padding-bottom:16px}
.timeline-dot{position:absolute;left:0;top:6px;width:10px;height:10px;background:var(--accent);border-radius:50%}
.timeline-line{position:absolute;left:4px;top:18px;width:2px;height:calc(100% - 6px);background:var(--accent-light)}
.timeline-content{background:var(--flow-bg);padding:8px 14px;border-radius:8px;font-size:14px;line-height:1.5}
.diff-item{background:var(--diff-bg);border-left:3px solid #c45a00;padding:12px 14px;margin-bottom:10px;border-radius:0 8px 8px 0}
.diff-concept{font-weight:600;margin-bottom:4px;color:#a0522d;font-size:14px}
.diff-deconstruct{font-size:14px;color:var(--text-secondary);line-height:1.6}
.framework-wrap{padding:16px;max-width:720px;margin:0 auto}
.framework-title{text-align:center;font-size:18px;margin-bottom:20px;color:var(--accent);font-weight:600}
.fw-section{margin-bottom:20px}
.fw-section-title{text-align:center;font-size:14px;font-weight:600;color:#fff;background:var(--accent);padding:10px;border-radius:8px;margin-bottom:12px}
.fw-chapter{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px}
.fw-chapter-title{font-weight:600;font-size:15px;margin-bottom:6px;color:var(--accent)}
.fw-sections{font-size:13px;color:var(--text-secondary);line-height:1.7}
.fw-arrow-down{text-align:center;font-size:14px;color:var(--accent);margin:12px 0;font-weight:500}
.fw-core{text-align:center;background:var(--accent-light);border:2px solid var(--accent);border-radius:10px;padding:14px;margin:16px 0;font-weight:600;font-size:14px;line-height:1.5}
.fw-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:12px 0}
.fw-tag{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px;font-size:12px;text-align:center;line-height:1.4}
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
  .read-layout{display:grid;grid-template-columns:200px 1fr}
  .chapter-nav-desktop{display:block;background:var(--surface);border-right:1px solid var(--border);padding:16px 0;position:sticky;top:calc(var(--header-h) + var(--nav-h));height:calc(100vh - var(--header-h) - var(--nav-h));overflow-y:auto}
  .chapter-link{display:block;padding:8px 14px;font-size:12px;color:var(--text-secondary);text-decoration:none;border-left:3px solid transparent}
  .chapter-link:hover,.chapter-link.active{background:var(--accent-light);color:var(--accent);border-left-color:var(--accent)}
  .chapter-content{padding:32px 48px}
  .notes-content{max-width:800px;margin:0 auto}
  .analysis-card{display:block!important;margin-bottom:24px}
  .note-nav-scroll{display:none}
  .fw-grid{grid-template-columns:repeat(3,1fr)}
}
</style>
</head>
<body>
<header class="app-header">
  <div><h1>${esc(meta.title)}</h1><div class="subtitle">${esc(meta.subtitle)}</div><div class="chapter-count">全书 ${chapters.length} 章 · 含章末大师总结</div></div>
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
    <div class="framework-title">全书框架 · 共 ${chapters.length} 章</div>
    <div class="fw-section">
      <div class="fw-section-title">开篇 · 2章</div>
      <div class="fw-chapter"><div class="fw-chapter-title">序言</div><div class="fw-sections">老鼠赛跑 · 财商觉醒 · 本书使命</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">引言：两个爸爸</div><div class="fw-sections">两种观念 · 弗罗斯特之选 · 六课预告</div></div>
    </div>
    <div class="fw-arrow-down">↓ 财商六课 ↓</div>
    <div class="fw-grid">
      <div class="fw-tag"><strong>第一课</strong><br/>富人不为钱工作</div>
      <div class="fw-tag"><strong>第二课</strong><br/>资产 vs 负债</div>
      <div class="fw-tag"><strong>第三课</strong><br/>关注自己的事业</div>
      <div class="fw-tag"><strong>第四课</strong><br/>公司与税收</div>
      <div class="fw-tag"><strong>第五课</strong><br/>富人的投资</div>
      <div class="fw-tag"><strong>第六课</strong><br/>为技能而非金钱工作</div>
    </div>
    <div class="fw-core">核心公式：买入资产 → 现金流 &gt; 支出 → 财富自由</div>
    <div class="fw-section">
      <div class="fw-section-title">实践篇</div>
      <div class="fw-chapter"><div class="fw-chapter-title">克服阻碍</div><div class="fw-sections">恐惧 · 愤世嫉俗 · 懒惰 · 坏习惯 · 傲慢</div></div>
      <div class="fw-chapter"><div class="fw-chapter-title">开始行动</div><div class="fw-sections">10条指南 · 先支付自己 · 先给后取 · 资产买奢侈品</div></div>
    </div>
    <div class="fw-core">终极目标：让钱为你工作，而非你为钱工作</div>
  </div>
</section>
<section id="tab-guide" class="tab-panel" role="tabpanel">
  <div class="guide-wrap">
    <p class="guide-intro">财商不是读一遍就会的，需要四遍阅读+持续实践。</p>
    ${phasesHtml}
    <div class="tips-box"><h3>阅读要诀</h3><ul>${tipsHtml}</ul></div>
  </div>
</section>
<div class="drawer-overlay" id="drawerOverlay"></div>
<div class="chapter-drawer" id="chapterDrawer">
  <div class="drawer-header"><h2>章节目录</h2><button type="button" class="drawer-close" id="closeDrawer">&times;</button></div>
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
fs.mkdirSync(path.join(ROOT, '_source'), { recursive: true });
if (!fs.existsSync(SOURCE_TXT)) {
  console.error('Source not found:', SOURCE_TXT);
  process.exit(1);
}

const text = readTxt();
const chapters = splitChapters(text);
console.log(`Extracted ${chapters.length} chapters`);
chapters.forEach(ch => console.log(`  - ${ch.title} (${ch.html.length} chars)`));

const html = generateHtml(chapters, CHAPTER_ANALYSIS, BOOK_META);
const outputFile = path.join(OUTPUT_DIR, 'index.html');
fs.writeFileSync(outputFile, html, 'utf-8');
console.log(`Generated: ${outputFile}`);
console.log(`File size: ${(fs.statSync(outputFile).size / 1024).toFixed(1)} KB`);
