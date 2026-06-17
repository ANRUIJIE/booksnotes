/** 章节 ID → 原文 Markdown 文件映射（自动生成自 vol2/vol3 数据） */
import { VOL2_PARTS } from './vol2.mjs';
import { VOL3_PARTS } from './vol3.mjs';

export const SOURCE_MAP = {
  // 第一卷
  v1c01: '卷1/01.商品.md',
  v1c02: '卷1/02.交换过程.md',
  v1c03: '卷1/03.货币或商品流通.md',
  v1c04: '卷1/04.货币转化为资本.md',
  v1c05: '卷1/05.劳动过程和价值增殖过程.md',
  v1c06: '卷1/06.不变资本和可变资本.md',
  v1c07: '卷1/07.剩余价值率.md',
  v1c08: '卷1/08.工作日.md',
  v1c09: '卷1/09.剩余价值率和剩余价值量.md',
  v1c10: '卷1/10.相对剩余价值的概念.md',
  v1c11: '卷1/11.协作.md',
  v1c12: '卷1/12.分工和工场手工业.md',
  v1c13: '卷1/13.机器和大工业.md',
  v1c14: '卷1/14.绝对剩余价值和相对剩余价值.md',
  v1c15: '卷1/15.劳动力价格和剩余价值的量的变化.md',
  v1c16: '卷1/16.剩余价值率的各种公式.md',
  v1c17: '卷1/17.劳动力的价值或价格转化为工资.md',
  v1c18: '卷1/18.计时工资.md',
  v1c19: '卷1/19.计件工资.md',
  v1c20: '卷1/20.工资的国民差异.md',
  v1c21: '卷1/21.简单再生产.md',
  v1c22: '卷1/22.剩余价值转化为资本.md',
  v1c23: '卷1/23.资本主义积累的一般规律.md',
  v1c24: '卷1/24.所谓原始积累.md',
  v1c25: '卷1/25.现代殖民理论.md',
};

for (const part of VOL2_PARTS) {
  for (const ch of part.chapters) {
    SOURCE_MAP[ch.id] = `卷2/${ch.file}`;
  }
}
for (const part of VOL3_PARTS) {
  for (const ch of part.chapters) {
    SOURCE_MAP[ch.id] = `卷3/${ch.file}`;
  }
}

export const SOURCE_BASE = 'https://raw.githubusercontent.com/bitzhuwei/Capital/main/';
