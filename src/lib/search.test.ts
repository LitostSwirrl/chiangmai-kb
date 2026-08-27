import { describe, it, expect } from 'vitest'
import { searchNotes } from './search'

describe('searchNotes', () => {
  it('標題命中排最前', () => {
    expect(searchNotes('蘭納王國')[0].id).toBe('蘭納王國')
  })
  it('標音可搜', () => {
    expect(searchNotes('gàat').some(h => h.id === '市場文化')).toBe(true)
  })
  it('英文小寫可搜 khao soi', () => {
    expect(searchNotes('khao soi')[0].id).toBe('khao soi 與泰北麵食')
  })
  it('空字串回空陣列', () => {
    expect(searchNotes('  ')).toEqual([])
  })
})
