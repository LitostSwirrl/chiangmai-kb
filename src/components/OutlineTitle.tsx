interface OutlineTitleProps {
  text: string
  className?: string
}

export function OutlineTitle({ text, className = '' }: OutlineTitleProps) {
  return <span className={`outline-text uppercase ${className}`}>{text}</span>
}
