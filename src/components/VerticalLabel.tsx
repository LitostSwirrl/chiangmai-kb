interface VerticalLabelProps {
  text: string
  className?: string
}

export function VerticalLabel({ text, className = '' }: VerticalLabelProps) {
  return <span className={`vertical-label max-md:[writing-mode:horizontal-tb] max-md:tracking-[0.2em] ${className}`}>{text}</span>
}
