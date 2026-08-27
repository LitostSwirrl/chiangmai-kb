import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { NoteBody } from '../components/NoteBody'
import { NoteLink } from '../components/NoteLink'
import { VerticalLabel } from '../components/VerticalLabel'
import { axisByName, getNote } from '../lib/content'

function SectionTitle({ text }: { text: string }) {
  return <h2 className="font-en text-sm font-bold tracking-[0.25em] text-ink-soft">{text}</h2>
}

export function NotePage() {
  const { id } = useParams()
  const note = id ? getNote(id) : undefined
  if (!note) {
    return (
      <main className="px-6 py-16 md:px-14">
        <p>找不到這個條目。回<Link to="/" className="underline">首頁</Link>或用搜尋找找看。</p>
      </main>
    )
  }
  const axis = axisByName(note.axis)
  return (
    <main style={{ '--ax': axis?.color ?? 'var(--color-ink)' } as CSSProperties}>
      <section className="flex gap-6 border-b border-line px-6 py-14 md:gap-10 md:px-14 md:py-20">
        {axis && (
          <Link to={`/axis/${axis.dir}`} className="shrink-0 self-start transition-colors hover:text-accent">
            <VerticalLabel text={note.axis} className="text-sm [color:var(--ax)] hover:text-inherit" />
          </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold md:text-5xl">{note.titleZh}</h1>
          {note.thai && <p className="mt-4 font-light text-4xl leading-snug text-ink-soft md:text-6xl">{note.thai}</p>}
          {note.summary && <p className="mt-6 max-w-xl leading-relaxed">{note.summary}</p>}
        </div>
      </section>
      <section className="px-6 py-10 md:px-14 md:py-14">
        <NoteBody body={note.body} />
      </section>
      {note.vocab.length > 0 && (
        <section className="border-t border-line px-6 py-10 md:px-14">
          <SectionTitle text="語彙" />
          <div className="mt-6 overflow-x-auto">
            <table className="w-full max-w-3xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th className="py-2 pr-4 font-medium">泰文</th>
                  <th className="py-2 pr-4 font-medium">標音</th>
                  <th className="py-2 pr-4 font-medium">中文</th>
                  <th className="py-2 font-medium">使用情境</th>
                </tr>
              </thead>
              <tbody>
                {note.vocab.map((v, i) => (
                  <tr key={i} className="border-b border-line align-top">
                    <td className="py-2.5 pr-4 whitespace-nowrap text-base">{v.thai}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap font-en">{v.paiboon}</td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">{v.zh}</td>
                    <td className="py-2.5 text-ink-soft">{v.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {note.related.length > 0 && (
        <section className="border-t border-line px-6 py-10 md:px-14">
          <SectionTitle text="相關條目" />
          <ul className="mt-5 flex max-w-2xl flex-wrap gap-x-6 gap-y-3">
            {note.related.map(r => (
              <li key={r}>
                <NoteLink target={r} label={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="border-t border-line px-6 py-10 md:px-14">
        <SectionTitle text="反向連結" />
        {note.backlinks.length === 0 ? (
          <p className="mt-5 text-sm text-ink-soft">尚無條目連到這裡。</p>
        ) : (
          <ul className="mt-5 max-w-2xl space-y-4">
            {note.backlinks.map(b => (
              <li key={b.from} className="border-l-2 border-line pl-4">
                <NoteLink target={b.from} label={b.from} />
                {b.context && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.context}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
      {note.sources.length > 0 && (
        <section className="border-t border-line px-6 py-10 md:px-14">
          <SectionTitle text="來源" />
          <ul className="mt-5 max-w-2xl space-y-2 text-sm">
            {note.sources.map(s => (
              <li key={s.url}>
                <a
                  href={s.url}
                  rel="noopener"
                  target="_blank"
                  className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
