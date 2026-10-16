import { Check, Eye, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  front: string
  back: string
  /** O aluno já marcou que sabe esta resposta. */
  known: boolean
  /** Marca como sabido (`true`) ou para revisar de novo (`false`). */
  onMark: (known: boolean) => void
  className?: string
}

/** Cartão de revisão: pergunta na frente; o botão "Mostrar resposta" revela o verso. A resposta
 *  aparece no próprio texto da página (não só em animação), então leitores de tela a recebem. */
export function Flashcard({ front, back, known, onMark, className }: Props) {
  const [revealed, setRevealed] = useState(false)
  const answer = useRef<HTMLParagraphElement>(null)

  // Ao revelar, o foco vai para a resposta; sem isso, quem usa teclado ficaria no botão que sumiu.
  useEffect(() => {
    if (revealed) answer.current?.focus()
  }, [revealed])

  return (
    <div className={cn('rounded-xl border bg-card p-5', known ? 'border-tint-line' : 'border-border', className)}>
      <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Pergunta</p>
      <p className="mt-1.5 text-base leading-relaxed font-medium">{front}</p>

      {revealed ? (
        <div className="mt-4 rounded-lg border border-tint-line bg-tint-strong p-3.5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Resposta</p>
          <p ref={answer} tabIndex={-1} className="mt-1.5 text-[14px] leading-relaxed outline-none">
            {back}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {revealed ? (
          <>
            <Button size="sm" variant={known ? 'default' : 'outline'} aria-pressed={known} onClick={() => onMark(true)}>
              <Check aria-hidden="true" /> {known ? 'Você já sabe' : 'Já sei'}
            </Button>
            <Button size="sm" variant="outline" aria-pressed={!known} onClick={() => onMark(false)}>
              <RotateCcw aria-hidden="true" /> Revisar de novo
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => setRevealed(true)}>
            <Eye aria-hidden="true" /> Mostrar resposta
          </Button>
        )}
        {known && !revealed ? (
          <span className="inline-flex items-center gap-1 text-xs text-primary">
            <Check className="size-3.5" aria-hidden="true" /> Marcado como sabido
          </span>
        ) : null}
      </div>
    </div>
  )
}
