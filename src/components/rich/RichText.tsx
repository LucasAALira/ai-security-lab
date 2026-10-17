import { useId, useState, type ElementType } from 'react'
import { glossaryById } from '@/data/glossary'
import { cn } from '@/lib/utils'
import { parseRich } from './rich-parse'

interface Props {
  text: string
  /** Elemento do bloco (parágrafo por padrão). */
  as?: ElementType
  className?: string
}

/** Texto com negrito, código e termos do glossário. Os termos viram botões que abrem a definição
 *  logo abaixo do parágrafo (funciona com teclado e toque, sem depender de hover). */
export function RichText({ text, as: Tag = 'p', className }: Props) {
  const uid = useId()
  const [open, setOpen] = useState<string[]>([])
  const tokens = parseRich(text)
  const toggle = (id: string) => setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <>
      <Tag className={className}>
        {tokens.map((t, i) => {
          if (t.kind === 'bold') return <strong key={i}>{t.text}</strong>
          if (t.kind === 'code') return <code key={i} className="rounded border border-border bg-tint px-1 py-px font-mono text-[0.88em] break-words">{t.text}</code>
          if (t.kind === 'term') {
            const entry = glossaryById(t.id)
            if (!entry) return <span key={i}>{t.label}</span>
            const expanded = open.includes(t.id)
            return (
              <button
                key={i}
                type="button"
                aria-expanded={expanded}
                aria-controls={`${uid}-${t.id}`}
                onClick={() => toggle(t.id)}
                className="cursor-help rounded-sm border-b border-dotted border-primary text-inherit hover:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t.label}
              </button>
            )
          }
          return <span key={i}>{t.text}</span>
        })}
      </Tag>
      {open.map((id) => {
        const entry = glossaryById(id)
        return entry ? (
          <p key={id} id={`${uid}-${id}`} role="note" className={cn('mt-1.5 mb-2 rounded-md border border-tint-line bg-tint-strong px-3 py-2 text-xs leading-relaxed')}>
            <strong>{entry.term}.</strong> {entry.definition}
          </p>
        ) : null
      })}
    </>
  )
}

/** Vários parágrafos em sequência. */
export function RichParagraphs({ texts, className }: { texts: string[]; className?: string }) {
  return (
    <div className="grid gap-2.5">
      {texts.map((t, i) => (
        <RichText key={i} text={t} className={className} />
      ))}
    </div>
  )
}
