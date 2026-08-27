import { readFileSync, writeFileSync, mkdirSync, globSync } from 'node:fs'

const WIKILINK = /\[\[([^\]|#]+)(?:\|([^\]]*))?\]\]/g

export function parseNote(relPath, text) {
  const parts = relPath.split('/')
  const file = parts.pop()
  const id = file.replace(/\.md$/, '')
  const axisDir = parts[0] ?? ''
  const axis = axisDir.includes('-') ? axisDir.split('-')[1] : 'home'
  const h1 = text.match(/^# (.+)$/m)[1]
  const m = h1.match(/^(.+?)（([^（）]+)）$/)
  const titleZh = m ? m[1] : h1
  const thai = m && /[฀-๿]/.test(m[2]) ? m[2] : null
  const summary = (text.match(/^一行摘要：(.+)$/m) ?? [null, ''])[1]
  const section = name => {
    const re = new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`)
    const s = text.match(re)
    return s ? s[1].trim() : ''
  }
  const segs = para => {
    const out = []
    let last = 0
    for (const mm of para.matchAll(WIKILINK)) {
      if (mm.index > last) out.push({ t: 'text', v: para.slice(last, mm.index) })
      out.push({ t: 'link', target: mm[1].trim(), label: (mm[2] ?? mm[1]).trim() })
      last = mm.index + mm[0].length
    }
    if (last < para.length) out.push({ t: 'text', v: para.slice(last) })
    return out
  }
  const body = section('內文').split(/\n\n+/).filter(Boolean).map(segs)
  const vocab = section('相關語彙與可用句').split('\n').filter(l => l.startsWith('|')).slice(2)
    .map(l => l.split('|').map(c => c.trim()).filter(Boolean))
    .map(([thai_, paiboon, zh, usage]) => ({ thai: thai_, paiboon, zh, usage }))
  const related = [...section('相關條目').matchAll(WIKILINK)].map(mm => mm[1].trim())
  const sources = [...section('來源').matchAll(/- \[([^\]]+)\]\(([^)]+)\)/g)].map(mm => ({ label: mm[1], url: mm[2] }))
  const outlinks = [...new Set([...text.matchAll(WIKILINK)].map(mm => mm[1].trim()))]
  const isHub = /hub/.test(text.match(/^tags: \[(.+)\]$/m)?.[1] ?? '')
  return { id, axis, axisDir, title: h1, titleZh, thai, summary, body, vocab, related, sources, outlinks, backlinks: [], isHub }
}

export function buildAll(list) {
  const notes = Object.fromEntries(list.map(n => [n.id, n]))
  for (const n of list) for (const target of n.outlinks) {
    if (!notes[target]) throw new Error(`斷鏈：${n.id} → [[${target}]]`)
    if (target === n.id) continue
    const para = n.body.find(p => p.some(s => s.t === 'link' && s.target === target))
    const context = para ? para.map(s => s.t === 'text' ? s.v : s.label).join('').split('。').find(sen => sen.includes(para.filter(s => s.t === 'link' && s.target === target)[0].label)) ?? '' : ''
    notes[target].backlinks.push({ from: n.id, context: context ? context + '。' : '' })
  }
  const nodes = list.map(n => ({ id: n.id, title: n.titleZh, axis: n.axis, isHub: n.isHub }))
  const seen = new Set()
  const links = []
  for (const n of list) for (const t of n.outlinks) {
    const key = [n.id, t].sort().join('→')
    if (t !== n.id && !seen.has(key)) { seen.add(key); links.push({ source: n.id, target: t }) }
  }
  return { notes, graph: { nodes, links } }
}

if (process.argv[1].endsWith('build-content.mjs')) {
  const files = globSync('content/**/*.md')
  const list = files.map(f => parseNote(f.replace(/^content\//, ''), readFileSync(f, 'utf8')))
  const { notes, graph } = buildAll(list)
  mkdirSync('src/generated', { recursive: true })
  writeFileSync('src/generated/notes.json', JSON.stringify(notes))
  writeFileSync('src/generated/graph.json', JSON.stringify(graph))
  console.log(`built ${list.length} notes, ${graph.links.length} links`)
}
