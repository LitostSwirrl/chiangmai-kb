import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { SearchHit } from '../lib/search'
import { searchNotes } from '../lib/search'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    setQ('')
    setSel(0)
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  if (!open) return null

  const hits = searchNotes(q).slice(0, 12)

  const go = (h: SearchHit) => {
    onClose()
    navigate(`/note/${h.id}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/30 p-4 md:pt-28"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="全站搜尋"
        className="mx-auto max-w-xl border border-line bg-paper shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={e => {
            setQ(e.target.value)
            setSel(0)
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setSel(s => Math.min(s + 1, hits.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setSel(s => Math.max(s - 1, 0))
            } else if (e.key === 'Enter' && hits[sel]) {
              go(hits[sel])
            }
          }}
          placeholder="搜尋標題、泰文、標音、內文……"
          aria-label="搜尋關鍵字"
          className="w-full border-b border-line bg-transparent px-5 py-4 outline-none placeholder:text-ink-soft"
        />
        <ul className="max-h-96 overflow-y-auto" role="listbox" aria-label="搜尋結果">
          {q.trim() !== '' && hits.length === 0 && <li className="px-5 py-4 text-sm text-ink-soft">沒有符合的條目，換個關鍵字試試。</li>}
          {hits.map((h, i) => (
            <li key={`${h.id}-${h.field}`} role="option" aria-selected={i === sel}>
              <button
                type="button"
                onClick={() => go(h)}
                onMouseEnter={() => setSel(i)}
                className={`block w-full cursor-pointer border-l-2 px-5 py-3 text-left ${i === sel ? 'border-accent bg-line/30' : 'border-transparent'}`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-bold">{h.titleZh}</span>
                  <span className="text-xs text-ink-soft">{h.field}</span>
                </span>
                <span className="mt-0.5 block truncate text-sm text-ink-soft">{h.snippet}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
