import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { OutlineTitle } from '../components/OutlineTitle'
import { AXES, allNotes, getNote } from '../lib/content'

export function HomePage() {
  const intro = getNote('00-首頁')
  const counts = new Map<string, number>()
  for (const n of allNotes()) {
    if (!n.isHub && n.axis !== 'home') counts.set(n.axis, (counts.get(n.axis) ?? 0) + 1)
  }
  return (
    <main>
      <section className="border-b border-line px-6 py-16 md:px-14 md:py-24">
        <OutlineTitle text="Chiang Mai" className="block text-6xl leading-none md:text-[9rem]" />
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">清邁知識庫</h1>
        {intro && intro.body[0] && (
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            {intro.body[0].map(s => (s.t === 'text' ? s.v : s.label))}
          </p>
        )}
      </section>
      <section className="grid md:grid-cols-2">
        {AXES.map(a => (
          <Link
            key={a.dir}
            to={`/axis/${a.dir}`}
            className="group border-b border-line px-6 py-10 transition-colors odd:md:border-r md:px-14 md:py-14"
            style={{ '--ax': a.color } as CSSProperties}
          >
            <OutlineTitle text={a.en} className="block text-4xl leading-tight group-hover:[color:var(--ax)] group-focus-visible:[color:var(--ax)] md:text-6xl" />
            <div className="mt-4 flex items-baseline gap-3">
              <h2 className="text-xl font-bold">{a.name}</h2>
              <span className="font-en text-sm text-ink-soft">{counts.get(a.name) ?? 0} 條</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.desc}</p>
          </Link>
        ))}
      </section>
      <section className="flex flex-col gap-4 border-b border-line px-6 py-10 md:flex-row md:gap-8 md:px-14">
        <Link to="/graph" className="rounded-full border border-ink px-6 py-2 text-center text-sm transition-colors hover:border-accent hover:text-accent">
          全域關係圖
        </Link>
        <button
          type="button"
          data-search-button
          className="cursor-pointer rounded-full border border-ink px-6 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          搜尋全站（cmd+K）
        </button>
      </section>
      <footer className="overflow-hidden py-8" aria-hidden="true">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[0, 1].map(k => (
            <span key={k} className="flex gap-10">
              {AXES.map(a => (
                <OutlineTitle key={a.dir} text={a.en} className="text-5xl" />
              ))}
            </span>
          ))}
        </div>
      </footer>
    </main>
  )
}
