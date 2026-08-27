import { allNotes } from './content'
import type { Note } from './types'

export interface SearchHit {
  id: string
  titleZh: string
  field: string
  snippet: string
}

interface FieldDef {
  name: string
  weight: number
  text: (n: Note) => string
}

const FIELDS: FieldDef[] = [
  { name: '標題', weight: 100, text: n => n.titleZh },
  { name: '泰文與標音', weight: 60, text: n => [n.thai ?? '', ...n.vocab.flatMap(v => [v.thai, v.paiboon])].join('　') },
  { name: '摘要', weight: 40, text: n => n.summary },
  { name: '內文', weight: 20, text: n => n.body.map(p => p.map(s => (s.t === 'text' ? s.v : s.label)).join('')).join('　') },
  { name: '語彙', weight: 10, text: n => n.vocab.flatMap(v => [v.zh, v.usage]).join('　') },
]

export function searchNotes(q: string): SearchHit[] {
  const query = q.trim().toLowerCase()
  if (!query) return []
  const hits: { hit: SearchHit; score: number }[] = []
  for (const n of allNotes()) {
    for (const f of FIELDS) {
      const text = f.text(n)
      const idx = text.toLowerCase().indexOf(query)
      if (idx === -1) continue
      const start = Math.max(0, idx - 30)
      const end = idx + query.length + 30
      const snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
      hits.push({ hit: { id: n.id, titleZh: n.titleZh, field: f.name, snippet }, score: f.weight })
      break
    }
  }
  return hits.sort((a, b) => b.score - a.score).map(h => h.hit)
}
