import { Check, ShieldAlert, X } from 'lucide-react'
import { languageName } from '@/components/mission/CodeBlock'
import type { CodeLanguage } from '@/data/types'
import { cn } from '@/lib/utils'

export type LineMark = 'picked' | 'wrong' | 'flaw'

interface Props {
  code: string[]
  file: string
  /** Linguagem ou formato do arquivo (mostrado ao lado do nome). */
  language?: CodeLanguage
  /** Quando `true`, cada linha com texto é um botão que alterna a marcação. */
  selectable: boolean
  marks: Map<number, LineMark>
  onToggle: (line: number) => void
}

const markLabel: Record<LineMark, string> = { picked: 'marcada', wrong: 'não é a falha', flaw: 'falha' }

/** Listagem de código em que cada linha pode ser marcada como vulnerável. A marcação aparece como
 *  ícone e texto para leitores de tela (e não só como cor), e as linhas são alcançáveis pelo teclado. */
export function CodeLines({ code, file, language, selectable, marks, onToggle }: Props) {
  return (
    <figure className="m-0">
      <figcaption className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span>{file}</span>
        {language ? <span>{languageName(language)}</span> : null}
      </figcaption>
      <div className="overflow-x-auto rounded-b-lg border border-border bg-[#120a0b]" {...(selectable ? {} : { tabIndex: 0, role: 'region', 'aria-label': `${file}, rolável` })}>
        <ol aria-label={`Linhas do arquivo ${file}`} className="m-0 min-w-max list-none p-0 py-1.5 font-mono text-[12.5px] leading-6">
          {code.map((text, i) => {
            const mark = marks.get(i)
            const blank = text.trim() === ''
            const row = (
              <>
                <span aria-hidden="true" className="w-8 shrink-0 pr-3 text-right text-muted-foreground select-none">
                  {i + 1}
                </span>
                <span className="sr-only">
                  Linha {i + 1}
                  {blank ? ' (vazia)' : `: `}
                </span>
                <code className="flex-1 pr-3 whitespace-pre text-foreground/90">{text || ' '}</code>
                <span className="grid w-16 shrink-0 place-items-end pr-2.5">
                  {mark === 'picked' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans text-primary">
                      <Check className="size-3" aria-hidden="true" /> marcada
                    </span>
                  ) : mark === 'wrong' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans text-destructive">
                      <X className="size-3" aria-hidden="true" /> não é
                    </span>
                  ) : mark === 'flaw' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans text-primary">
                      <ShieldAlert className="size-3" aria-hidden="true" /> falha
                    </span>
                  ) : null}
                </span>
                {mark ? <span className="sr-only"> ({markLabel[mark]})</span> : null}
              </>
            )
            const tone = cn(
              'flex w-full items-center border-l-[3px] border-transparent',
              mark === 'picked' && 'border-primary bg-primary/12',
              mark === 'wrong' && 'border-destructive bg-destructive/12',
              mark === 'flaw' && 'border-primary bg-primary/18',
            )
            return (
              <li key={i}>
                {selectable && !blank ? (
                  <button
                    type="button"
                    aria-pressed={mark === 'picked' || mark === 'wrong'}
                    onClick={() => onToggle(i)}
                    className={cn(tone, 'cursor-pointer text-left hover:bg-tint-strong focus-visible:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset')}
                  >
                    {row}
                  </button>
                ) : (
                  <div className={tone}>{row}</div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </figure>
  )
}
