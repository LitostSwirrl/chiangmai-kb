import type { Segment } from '../lib/types'
import { NoteLink } from './NoteLink'

interface NoteBodyProps {
  body: Segment[][]
}

export function NoteBody({ body }: NoteBodyProps) {
  return (
    <div className="max-w-2xl space-y-5 leading-loose">
      {body.map((para, i) => (
        <p key={i}>
          {para.map((s, j) => (s.t === 'text' ? s.v : <NoteLink key={j} target={s.target} label={s.label} />))}
        </p>
      ))}
    </div>
  )
}
