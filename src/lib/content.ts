import graphJson from '../generated/graph.json'
import notesJson from '../generated/notes.json'
import type { GraphData, Note } from './types'

const notes = notesJson as unknown as Record<string, Note>

export const graph = graphJson as unknown as GraphData

export function getNote(id: string): Note | undefined {
  return notes[id]
}

export function allNotes(): Note[] {
  return Object.values(notes)
}

export interface Axis {
  dir: string
  name: string
  en: string
  color: string
  desc: string
}

export const AXES: Axis[] = [
  { dir: '10-歷史', name: '歷史', en: 'HISTORY', color: 'var(--color-ax-history)', desc: '從蘭納建國到觀光城市，七百多年的政權更迭與城市變貌' },
  { dir: '20-人群', name: '人群', en: 'PEOPLES', color: 'var(--color-ax-peoples)', desc: '北泰人、山地民族、華人移民與移工，各有來路' },
  { dir: '30-信仰與習俗', name: '信仰與習俗', en: 'BELIEFS', color: 'var(--color-ax-beliefs)', desc: '上座部佛教與精靈信仰並存，生命與城市的節奏都跟著儀式走' },
  { dir: '40-節慶與曆法', name: '節慶與曆法', en: 'FESTIVALS', color: 'var(--color-ax-festivals)', desc: '節慶跟著陰曆與蘭納曆走，信仰、社群與觀光在此交會' },
  { dir: '50-語言與社交', name: '語言與社交', en: 'LANGUAGE', color: 'var(--color-ax-language)', desc: '北泰話與社交規範：怎麼稱呼、怎麼笑、怎麼不失禮' },
  { dir: '60-日常生活與空間', name: '日常生活與空間', en: 'EVERYDAY', color: 'var(--color-ax-everyday)', desc: '市場、寺廟、雙條車與季節構成的日常節奏' },
]

export function axisByName(name: string): Axis | undefined {
  return AXES.find(a => a.name === name)
}

export function axisByDir(dir: string): Axis | undefined {
  return AXES.find(a => a.dir === dir)
}
