export interface VocabRow { thai: string; paiboon: string; zh: string; usage: string }
export interface Backlink { from: string; context: string }
export type Segment = { t: 'text'; v: string } | { t: 'link'; target: string; label: string }
export interface Note {
  id: string; axis: string; axisDir: string
  title: string; titleZh: string; thai: string | null; summary: string
  body: Segment[][]
  vocab: VocabRow[]; related: string[]
  sources: { label: string; url: string }[]
  outlinks: string[]; backlinks: Backlink[]; isHub: boolean
}
export interface GraphNode { id: string; title: string; axis: string; isHub: boolean }
export interface GraphData { nodes: GraphNode[]; links: { source: string; target: string }[] }
