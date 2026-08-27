import { describe, it, expect } from 'vitest'
import { parseNote, buildAll } from './build-content.mjs'

const SAMPLE = `---
tags: [歷史]
---
# 蘭納王國（ล้านนา）

一行摘要：孟萊王建立的北方王國。

## 內文
第一段提到[[孟萊王與清邁建城]]與[[北泰人|北泰]]。

第二段沒有連結。

## 相關語彙與可用句
| 泰文 | 標音 | 中文 | 使用情境 |
|------|------|------|----------|
| ล้านนา | láan-naa | 蘭納 | 地名（週 11） |

## 相關條目
[[孟萊王與清邁建城]]、[[緬甸統治時期]]

## 來源
- [Lan Na - Wikipedia](https://en.wikipedia.org/wiki/Lan_Na)
`

describe('parseNote', () => {
  const n = parseNote('10-歷史/蘭納王國.md', SAMPLE)
  it('拆出標題與泰文', () => {
    expect(n.id).toBe('蘭納王國')
    expect(n.titleZh).toBe('蘭納王國')
    expect(n.thai).toBe('ล้านนา')
    expect(n.axis).toBe('歷史')
  })
  it('摘要與段落 segments', () => {
    expect(n.summary).toBe('孟萊王建立的北方王國。')
    expect(n.body[0]).toEqual([
      { t: 'text', v: '第一段提到' },
      { t: 'link', target: '孟萊王與清邁建城', label: '孟萊王與清邁建城' },
      { t: 'text', v: '與' },
      { t: 'link', target: '北泰人', label: '北泰' },
      { t: 'text', v: '。' },
    ])
  })
  it('語彙表與來源', () => {
    expect(n.vocab).toEqual([{ thai: 'ล้านนา', paiboon: 'láan-naa', zh: '蘭納', usage: '地名（週 11）' }])
    expect(n.sources[0]).toEqual({ label: 'Lan Na - Wikipedia', url: 'https://en.wikipedia.org/wiki/Lan_Na' })
  })
  it('出鏈含相關條目', () => {
    expect(n.outlinks).toContain('緬甸統治時期')
  })
})

describe('parseNote 裸段落摘要', () => {
  const n = parseNote('10-歷史/蘭納王國.md', SAMPLE.replace('一行摘要：孟萊王建立的北方王國。', '孟萊王建立的北方王國。'))
  it('無前綴時取 H1 後首段', () => {
    expect(n.summary).toBe('孟萊王建立的北方王國。')
  })
})

const HUB = `---
tags: [歷史, hub]
---
# 歷史

前言第一段提到[[蘭納王國]]。

前言第二段。

## 條目
- [[蘭納王國]] — 北方王國五百年興衰
`

describe('parseNote hub', () => {
  const h = parseNote('10-歷史/歷史.md', HUB)
  it('無內文節時 body 取前言段落', () => {
    expect(h.isHub).toBe(true)
    expect(h.body.length).toBe(2)
    expect(h.body[0]).toEqual([
      { t: 'text', v: '前言第一段提到' },
      { t: 'link', target: '蘭納王國', label: '蘭納王國' },
      { t: 'text', v: '。' },
    ])
  })
  it('條目節作為 related', () => {
    expect(h.related).toEqual(['蘭納王國'])
  })
})

describe('buildAll', () => {
  it('反向連結帶引用句、斷鏈丟錯', () => {
    const other = parseNote('10-歷史/孟萊王與清邁建城.md', SAMPLE.replaceAll('蘭納王國（ล้านนา）', '孟萊王與清邁建城').replaceAll('[[孟萊王與清邁建城]]', '[[蘭納王國]]'))
    const { notes } = buildAll([parseNote('10-歷史/蘭納王國.md', SAMPLE), other, parseNote('20-人群/北泰人.md', SAMPLE.replace('蘭納王國（ล้านนา）', '北泰人')), parseNote('10-歷史/緬甸統治時期.md', SAMPLE.replace('蘭納王國（ล้านนา）', '緬甸統治時期'))])
    expect(notes['蘭納王國'].backlinks.some(b => b.from === '孟萊王與清邁建城')).toBe(true)
    expect(() => buildAll([parseNote('10-歷史/蘭納王國.md', SAMPLE)])).toThrow(/斷鏈/)
  })
})
