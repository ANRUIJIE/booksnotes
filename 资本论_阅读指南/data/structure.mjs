/** 中央编译局译本 · 三卷结构（参照 bitzhuwei/Capital） */
export const BOOK_META = {
  title: '资本论',
  subtitle: '马克思 著 · 中共中央编译局 译 · 纪念版',
  edition: '人民出版社 2018 · 马克思诞辰200周年纪念版',
  themeColor: '#8B1538',
  accent: '#8B1538',
  accentLight: '#F5E6EB',
};

export const VOLUMES = [
  {
    id: 'v1',
    title: '第一卷',
    subtitle: '资本的生产过程',
    parts: [
      {
        id: 'v1p1', title: '第一篇', name: '商品和货币',
        chapters: [
          { id: 'v1c01', num: '第一章', title: '商品', sections: ['商品的两个因素', '劳动二重性', '价值形式', '拜物教性质'] },
          { id: 'v1c02', num: '第二章', title: '交换过程', sections: [] },
          { id: 'v1c03', num: '第三章', title: '货币或商品流通', sections: ['价值尺度', '流通手段', '贮藏手段', '支付手段', '世界货币'] },
        ],
      },
      {
        id: 'v1p2', title: '第二篇', name: '货币转化为资本',
        chapters: [
          { id: 'v1c04', num: '第四章', title: '货币转化为资本', sections: ['资本的总公式', '资本总公式的矛盾', '劳动力的买和卖'] },
        ],
      },
      {
        id: 'v1p3', title: '第三篇', name: '绝对剩余价值的生产',
        chapters: [
          { id: 'v1c05', num: '第五章', title: '劳动过程和价值增殖过程', sections: [] },
          { id: 'v1c06', num: '第六章', title: '不变资本和可变资本', sections: [] },
          { id: 'v1c07', num: '第七章', title: '剩余价值率', sections: [] },
          { id: 'v1c08', num: '第八章', title: '工作日', sections: [] },
          { id: 'v1c09', num: '第九章', title: '剩余价值率和剩余价值量', sections: [] },
        ],
      },
      {
        id: 'v1p4', title: '第四篇', name: '相对剩余价值的生产',
        chapters: [
          { id: 'v1c10', num: '第十章', title: '相对剩余价值的概念', sections: [] },
          { id: 'v1c11', num: '第十一章', title: '协作', sections: [] },
          { id: 'v1c12', num: '第十二章', title: '分工和工场手工业', sections: [] },
          { id: 'v1c13', num: '第十三章', title: '机器和大工业', sections: [] },
        ],
      },
      {
        id: 'v1p5', title: '第五篇', name: '绝对剩余价值和相对剩余价值的生产',
        chapters: [
          { id: 'v1c14', num: '第十四章', title: '绝对剩余价值和相对剩余价值', sections: [] },
          { id: 'v1c15', num: '第十五章', title: '劳动力价格和剩余价值的量的变化', sections: [] },
          { id: 'v1c16', num: '第十六章', title: '剩余价值率的各种公式', sections: [] },
        ],
      },
      {
        id: 'v1p6', title: '第六篇', name: '工资',
        chapters: [
          { id: 'v1c17', num: '第十七章', title: '劳动力的价值或价格转化为工资', sections: [] },
          { id: 'v1c18', num: '第十八章', title: '计时工资', sections: [] },
          { id: 'v1c19', num: '第十九章', title: '计件工资', sections: [] },
          { id: 'v1c20', num: '第二十章', title: '工资的国民差异', sections: [] },
        ],
      },
      {
        id: 'v1p7', title: '第七篇', name: '资本的积累过程',
        chapters: [
          { id: 'v1c21', num: '第二十一章', title: '简单再生产', sections: [] },
          { id: 'v1c22', num: '第二十二章', title: '剩余价值转化为资本', sections: [] },
          { id: 'v1c23', num: '第二十三章', title: '资本主义积累的一般规律', sections: [] },
          { id: 'v1c24', num: '第二十四章', title: '所谓原始积累', sections: [] },
          { id: 'v1c25', num: '第二十五章', title: '现代殖民理论', sections: [] },
        ],
      },
    ],
  },
  {
    id: 'v2',
    title: '第二卷',
    subtitle: '资本的流通过程',
    parts: [
      { id: 'v2p1', title: '第一篇', name: '资本形态变化及其循环', chapters: [
        { id: 'v2c01', num: '第一章', title: '货币资本的循环', sections: [] },
        { id: 'v2c02', num: '第二章', title: '生产资本的循环', sections: [] },
        { id: 'v2c03', num: '第三章', title: '商品资本的循环', sections: [] },
        { id: 'v2c04', num: '第四章', title: '循环过程的三个公式', sections: [] },
        { id: 'v2c05', num: '第五章', title: '流通时间', sections: [] },
        { id: 'v2c06', num: '第六章', title: '流通费用', sections: [] },
      ]},
      { id: 'v2p2', title: '第二篇', name: '资本周转', chapters: [
        { id: 'v2c07', num: '第七章', title: '周转时间和周转次数', sections: [] },
        { id: 'v2c08', num: '第八章', title: '固定资本和流动资本', sections: [] },
        { id: 'v2c09', num: '第九章', title: '预付资本的总周转', sections: [] },
        { id: 'v2c10', num: '第十章', title: '固定资本和流动资本的理论', sections: [] },
        { id: 'v2c11', num: '第十一章', title: '李嘉图', sections: [] },
        { id: 'v2c12', num: '第十二章', title: '劳动期间', sections: [] },
        { id: 'v2c13', num: '第十三章', title: '生产时间', sections: [] },
        { id: 'v2c14', num: '第十四章', title: '流通时间', sections: [] },
        { id: 'v2c15', num: '第十五章', title: '周转时间对预付资本量的影响', sections: [] },
        { id: 'v2c16', num: '第十六章', title: '可变资本的周转', sections: [] },
        { id: 'v2c17', num: '第十七章', title: '剩余价值的流通', sections: [] },
      ]},
      { id: 'v2p3', title: '第三篇', name: '社会总资本的再生产和流通', chapters: [
        { id: 'v2c18', num: '第十八章', title: '导言', sections: [] },
        { id: 'v2c19', num: '第十九章', title: '前人对这个问题的阐述', sections: [] },
        { id: 'v2c20', num: '第二十章', title: '简单再生产', sections: [] },
        { id: 'v2c21', num: '第二十一章', title: '积累和扩大再生产', sections: [] },
      ]},
    ],
  },
  {
    id: 'v3',
    title: '第三卷',
    subtitle: '资本主义生产的总过程',
    parts: [
      { id: 'v3p1', title: '第一篇', name: '剩余价值转化为利润和利润率', chapters: [
        { id: 'v3c01', num: '第一章', title: '成本价格和利润', sections: [] },
        { id: 'v3c02', num: '第二章', title: '利润率', sections: [] },
        { id: 'v3c03', num: '第三章', title: '利润率和剩余价值率的关系', sections: [] },
      ]},
      { id: 'v3p2', title: '第二篇', name: '利润转化为平均利润', chapters: [
        { id: 'v3c08', num: '第八章', title: '不同生产部门的资本构成', sections: [] },
        { id: 'v3c09', num: '第九章', title: '一般利润率的形成', sections: [] },
        { id: 'v3c10', num: '第十章', title: '一般利润率通过竞争而平均化', sections: [] },
      ]},
      { id: 'v3p3', title: '第三篇', name: '利润率趋向下降的规律', chapters: [
        { id: 'v3c13', num: '第十三章', title: '规律本身', sections: [] },
        { id: 'v3c14', num: '第十四章', title: '起反作用的各种原因', sections: [] },
        { id: 'v3c15', num: '第十五章', title: '规律的内部矛盾的展开', sections: [] },
      ]},
      { id: 'v3p5', title: '第五篇', name: '利润分为利息和企业主收入', chapters: [
        { id: 'v3c21', num: '第二十一章', title: '生息资本', sections: [] },
        { id: 'v3c25', num: '第二十五章', title: '信用和虚拟资本', sections: [] },
      ]},
      { id: 'v3p6', title: '第六篇', name: '超额利润转化为地租', chapters: [
        { id: 'v3c37', num: '第三十七章', title: '导论', sections: [] },
        { id: 'v3c45', num: '第四十五章', title: '绝对地租', sections: [] },
        { id: 'v3c52', num: '第五十二章', title: '阶级', sections: [] },
      ]},
    ],
  },
];

/** 思维导图：全书逻辑主线 */
export const MINDMAP = {
  root: '资本论',
  children: [
    {
      label: '第一卷 · 生产',
      children: [
        { label: '商品→货币', desc: '价值理论奠基' },
        { label: '货币→资本', desc: '劳动力商品' },
        { label: '剩余价值', desc: '绝对与相对' },
        { label: '工资形式', desc: '劳动力价格掩盖' },
        { label: '资本积累', desc: '原始积累' },
      ],
    },
    {
      label: '第二卷 · 流通',
      children: [
        { label: '资本循环', desc: '货币·生产·商品' },
        { label: '资本周转', desc: '固定与流动' },
        { label: '社会再生产', desc: '两大部类' },
      ],
    },
    {
      label: '第三卷 · 总过程',
      children: [
        { label: '利润与平均利润', desc: '价值转型' },
        { label: '利润率下降', desc: '内在矛盾' },
        { label: '利息·地租', desc: '分配形式' },
        { label: '阶级', desc: '资本主义生产关系' },
      ],
    },
  ],
};

export function flattenChapters() {
  const list = [];
  for (const vol of VOLUMES) {
    for (const part of vol.parts) {
      for (const ch of part.chapters) {
        list.push({
          ...ch,
          volId: vol.id,
          volTitle: vol.title,
          volSubtitle: vol.subtitle,
          partId: part.id,
          partTitle: part.title,
          partName: part.name,
          fullTitle: `${ch.num} ${ch.title}`,
          label: `${vol.title} ${ch.num} ${ch.title}`,
        });
      }
    }
  }
  return list;
}
