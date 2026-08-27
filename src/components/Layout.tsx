import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { SearchDialog } from './SearchDialog'
import { VerticalLabel } from './VerticalLabel'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `vertical-label max-md:[writing-mode:horizontal-tb] max-md:tracking-[0.2em] text-sm ${isActive ? 'text-accent font-medium' : 'text-ink hover:text-accent'}`

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-search-button]')) setSearchOpen(true)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink md:pl-16">
      <header className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center justify-between border-r border-line bg-paper py-6 md:flex">
        <Link to="/" className="font-en text-sm font-extrabold tracking-widest" aria-label="回首頁">
          CM
        </Link>
        <nav className="flex flex-col items-center gap-10">
          <NavLink to="/" className={navClass} end>
            首頁
          </NavLink>
          <NavLink to="/graph" className={navClass}>
            圖譜
          </NavLink>
          <button
            type="button"
            data-search-button
            className="vertical-label cursor-pointer text-sm text-ink hover:text-accent"
            aria-label="搜尋（cmd+K）"
          >
            搜尋
          </button>
        </nav>
        <VerticalLabel text="清邁知識庫" className="text-xs text-ink-soft" />
      </header>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper px-5 py-3 md:hidden">
        <Link to="/" className="font-en text-sm font-extrabold tracking-widest" aria-label="回首頁">
          CM
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={navClass} end>
            首頁
          </NavLink>
          <NavLink to="/graph" className={navClass}>
            圖譜
          </NavLink>
          <button type="button" data-search-button className="cursor-pointer tracking-[0.2em] text-ink hover:text-accent" aria-label="搜尋">
            搜尋
          </button>
        </nav>
      </header>
      <Outlet />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
