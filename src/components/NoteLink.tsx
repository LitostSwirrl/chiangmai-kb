import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { getNote } from '../lib/content'

interface NoteLinkProps {
  target: string
  label: string
}

export function NoteLink({ target, label }: NoteLinkProps) {
  const [open, setOpen] = useState(false)
  const timer = useRef<number | null>(null)
  const note = getNote(target)

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), 300)
  }
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  if (!note) return <span>{label}</span>

  return (
    <span className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        to={`/note/${target}`}
        onFocus={show}
        onBlur={hide}
        className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent focus-visible:text-accent"
      >
        {label}
      </Link>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-2 block w-72 max-w-[80vw] border border-line border-l-2 border-l-accent bg-paper p-4 shadow-lg"
        >
          <span className="block text-sm font-bold">{note.titleZh}</span>
          <span className="mt-1 block text-xs leading-relaxed text-ink-soft">{note.summary}</span>
        </span>
      )}
    </span>
  )
}
