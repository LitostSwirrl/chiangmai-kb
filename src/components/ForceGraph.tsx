import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'
import { forceCenter, forceLink, forceManyBody, forceSimulation } from 'd3-force'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { axisByName } from '../lib/content'
import type { GraphNode } from '../lib/types'

interface SimNode extends GraphNode, SimulationNodeDatum {}

interface ForceGraphProps {
  nodes: GraphNode[]
  links: { source: string; target: string }[]
  activeId?: string
  focusAxis?: string | null
  height?: number
}

function nodeColor(n: GraphNode, activeId?: string): string {
  if (n.id === activeId) return 'var(--color-accent)'
  return axisByName(n.axis)?.color ?? 'var(--color-ink-soft)'
}

export function ForceGraph({ nodes, links, activeId, focusAxis = null, height = 560 }: ForceGraphProps) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)

  const layout = useMemo(() => {
    const simNodes: SimNode[] = nodes.map(n => ({ ...n }))
    const simLinks: SimulationLinkDatum<SimNode>[] = links.map(l => ({ ...l }))
    forceSimulation(simNodes)
      .force('link', forceLink<SimNode, SimulationLinkDatum<SimNode>>(simLinks).id(d => d.id).distance(46))
      .force('charge', forceManyBody().strength(-80))
      .force('center', forceCenter())
      .stop()
      .tick(300)
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const n of simNodes) {
      minX = Math.min(minX, n.x ?? 0)
      minY = Math.min(minY, n.y ?? 0)
      maxX = Math.max(maxX, n.x ?? 0)
      maxY = Math.max(maxY, n.y ?? 0)
    }
    const pad = 60
    return {
      simNodes,
      simLinks,
      viewBox: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`,
    }
  }, [nodes, links])

  const dimmed = (axis: string) => focusAxis !== null && axis !== focusAxis

  return (
    <svg viewBox={layout.viewBox} className="w-full" style={{ height }} role="img" aria-label="條目關係圖">
      {layout.simLinks.map((l, i) => {
        const s = l.source as SimNode
        const t = l.target as SimNode
        const faded = dimmed(s.axis) || dimmed(t.axis)
        return (
          <line
            key={i}
            x1={s.x}
            y1={s.y}
            x2={t.x}
            y2={t.y}
            stroke="var(--color-line)"
            strokeWidth={1}
            opacity={faded ? 0.15 : 1}
          />
        )
      })}
      {layout.simNodes.map(n => (
        <g
          key={n.id}
          role="link"
          aria-label={n.title}
          tabIndex={0}
          className="cursor-pointer focus:outline-none"
          opacity={dimmed(n.axis) ? 0.15 : 1}
          onClick={() => navigate(`/note/${n.id}`)}
          onKeyDown={e => {
            if (e.key === 'Enter') navigate(`/note/${n.id}`)
          }}
          onMouseEnter={() => setHovered(n.id)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(n.id)}
          onBlur={() => setHovered(null)}
        >
          <circle
            cx={n.x}
            cy={n.y}
            r={n.isHub ? 11 : 5.5}
            fill={nodeColor(n, activeId)}
            stroke={hovered === n.id ? 'var(--color-ink)' : 'var(--color-paper)'}
            strokeWidth={1.5}
          />
          {(n.isHub || n.id === activeId || hovered === n.id) && (
            <text
              x={n.x}
              y={(n.y ?? 0) - (n.isHub ? 16 : 11)}
              textAnchor="middle"
              fontSize={12}
              fill="var(--color-ink)"
              className="pointer-events-none select-none"
              paintOrder="stroke"
              stroke="var(--color-paper)"
              strokeWidth={3}
            >
              {n.title}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
