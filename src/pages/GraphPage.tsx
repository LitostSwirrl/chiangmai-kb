import type { CSSProperties } from 'react'
import { useState } from 'react'
import { ForceGraph } from '../components/ForceGraph'
import { OutlineTitle } from '../components/OutlineTitle'
import { AXES, graph } from '../lib/content'

export function GraphPage() {
  const [focusAxis, setFocusAxis] = useState<string | null>(null)
  return (
    <main className="px-6 py-14 md:px-14 md:py-20">
      <OutlineTitle text="Graph" className="block text-5xl leading-none md:text-[7rem]" />
      <h1 className="mt-5 text-3xl font-bold md:text-4xl">全域關係圖</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
        {graph.nodes.length} 個條目、{graph.links.length} 條連結。點主軸名稱聚焦該軸，點節點進入條目。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {AXES.map(a => {
          const active = focusAxis === a.name
          return (
            <button
              key={a.dir}
              type="button"
              aria-pressed={active}
              onClick={() => setFocusAxis(active ? null : a.name)}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${active ? 'border-ink' : 'border-line hover:border-ink'}`}
              style={{ '--ax': a.color } as CSSProperties}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full [background:var(--ax)]" />
              {a.name}
            </button>
          )
        })}
      </div>
      <div className="mt-6 border border-line">
        <ForceGraph nodes={graph.nodes} links={graph.links} focusAxis={focusAxis} height={620} />
      </div>
    </main>
  )
}
