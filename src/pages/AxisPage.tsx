import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { NoteBody } from '../components/NoteBody'
import { OutlineTitle } from '../components/OutlineTitle'
import { VerticalLabel } from '../components/VerticalLabel'
import { axisByDir, getNote } from '../lib/content'

export function AxisPage() {
  const { dir } = useParams()
  const axis = dir ? axisByDir(dir) : undefined
  const hub = axis ? getNote(axis.name) : undefined
  if (!axis || !hub) {
    return (
      <main className="px-6 py-16 md:px-14">
        <p>找不到這個主軸。回<Link to="/" className="underline">首頁</Link>看全部主軸。</p>
      </main>
    )
  }
  return (
    <main style={{ '--ax': axis.color } as CSSProperties}>
      <section className="border-b border-line px-6 py-14 md:px-14 md:py-20">
        <OutlineTitle text={axis.en} className="block text-5xl leading-none [color:var(--ax)] md:text-[7rem]" />
        <h1 className="mt-5 text-3xl font-bold md:text-4xl">{axis.name}</h1>
      </section>
      <section className="flex gap-6 px-6 py-10 md:gap-10 md:px-14 md:py-14">
        <VerticalLabel text="脈絡" className="hidden text-sm text-ink-soft md:block" />
        <NoteBody body={hub.body} />
      </section>
      <section className="border-t border-line px-6 py-10 md:px-14 md:py-14">
        <h2 className="font-en text-sm font-bold tracking-[0.25em] text-ink-soft">條目</h2>
        <ul className="mt-6 max-w-3xl">
          {hub.related.map(id => {
            const note = getNote(id)
            if (!note) return null
            return (
              <li key={id} className="border-b border-line">
                <Link to={`/note/${id}`} className="group flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-6">
                  <span className="shrink-0 text-lg font-bold transition-colors group-hover:text-accent">{note.titleZh}</span>
                  <span className="text-sm leading-relaxed text-ink-soft">{note.summary}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
