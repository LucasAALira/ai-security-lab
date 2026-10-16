import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from 'lucide-react'
import { useId, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { letters } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Props {
  /** Número exibido antes do enunciado. */
  number: number
  /** Texto do enunciado (pergunta ou cenário). */
  title: string
  options: string[]
  correct: number
  /** `feedback[i]` explica a alternativa `i`, a certa e as erradas. */
  feedback: string[]
  hint?: string
  /** Já foi acertada (vem do progresso salvo): mostra a resposta certa travada, com a explicação. */
  solved: boolean
  /** Impede responder (por exemplo, módulo ainda bloqueado na trilha). */
  disabled?: boolean
  disabledReason?: string
  /** Envia a resposta. Quem chama registra no progresso e devolve um complemento (por exemplo, o XP). */
  onAnswer: (choice: number, ok: boolean) => string | void
  /** Nome do botão de envio. */
  submitLabel?: string
}

type Result = { ok: boolean; choice: number; extra: string }

/** Questão de múltipla escolha com retorno imediato: acertou, ou errou e por quê. Errar nunca trava:
 *  dá para trocar a resposta e conferir de novo. A explicação de cada alternativa fica no gabarito. */
export function QuestionCard({ number, title, options, correct, feedback, hint, solved, disabled = false, disabledReason, onAnswer, submitLabel = 'Conferir' }: Props) {
  const uid = useId()
  const [chosen, setChosen] = useState<string>(solved ? String(correct) : '')
  const [result, setResult] = useState<Result | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [tries, setTries] = useState(0)

  const locked = solved || result?.ok === true
  const answered = locked || result !== null

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (chosen === '' || locked || disabled) return
    const choice = Number(chosen)
    const ok = choice === correct
    const extra = onAnswer(choice, ok) ?? ''
    setTries((n) => n + 1)
    setResult({ ok, choice, extra })
  }

  const shownFeedback = result ?? (solved ? { ok: true, choice: correct, extra: '' } : null)

  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-tint p-4 sm:p-5">
      <fieldset disabled={locked || disabled} className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-3 w-full text-[15px] leading-relaxed font-semibold">
          <span className="mr-1.5 font-mono text-primary">{number}.</span>
          {title}
        </legend>
        <RadioGroup value={chosen} onValueChange={setChosen} disabled={locked || disabled} className="gap-0">
          {options.map((option, k) => {
            const isRight = answered && k === correct && locked
            const isWrongPick = result !== null && !result.ok && result.choice === k
            return (
              <Label
                key={option}
                htmlFor={`${uid}-${k}`}
                className={cn(
                  'my-1.5 flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3 text-[13px] leading-relaxed font-normal has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  chosen === String(k) && 'border-primary bg-tint-strong',
                  isRight && 'border-primary',
                  isWrongPick && 'border-destructive',
                  (locked || disabled) && 'cursor-default',
                )}
              >
                <RadioGroupItem id={`${uid}-${k}`} value={String(k)} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-muted-foreground">{letters[k]}.</span> {option}
                </span>
                {isRight ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" /> Correta
                  </span>
                ) : null}
                {isWrongPick ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-destructive">
                    <XCircle className="size-3.5" aria-hidden="true" /> Sua resposta
                  </span>
                ) : null}
              </Label>
            )
          })}
        </RadioGroup>
      </fieldset>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={locked || disabled || chosen === ''}>
          {locked ? (
            <>
              <CheckCircle2 aria-hidden="true" /> Acerto registrado
            </>
          ) : result ? (
            <>
              <RotateCcw aria-hidden="true" /> Conferir de novo
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {hint && !locked ? (
          <Button type="button" variant="outline" size="sm" aria-expanded={showHint} onClick={() => setShowHint((v) => !v)}>
            <Lightbulb aria-hidden="true" /> Dica
          </Button>
        ) : null}
        {disabled && disabledReason ? <span className="text-xs text-muted-foreground">{disabledReason}</span> : null}
      </div>
      {showHint && hint && !locked ? <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}

      <div role="status" aria-live="polite" className="mt-3 empty:hidden">
        {shownFeedback ? (
          <p className={cn('flex items-start gap-2 text-[13px] leading-relaxed', shownFeedback.ok ? 'text-foreground' : 'text-foreground')}>
            {shownFeedback.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />}
            <span>
              <strong>{shownFeedback.ok ? 'Correto. ' : 'Ainda não. '}</strong>
              {feedback[shownFeedback.choice]}
              {!shownFeedback.ok ? ' Revise o conceito e tente outra alternativa: errar não tira XP nem conquistas.' : ''}
              {shownFeedback.extra ? <span className="mt-1 block text-xs text-primary">{shownFeedback.extra}</span> : null}
            </span>
          </p>
        ) : null}
      </div>

      {answered && (locked || tries > 1) ? (
        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="gabarito" className="border-b-0">
            <AccordionTrigger className="py-2 text-xs text-primary hover:no-underline">Ver o gabarito comentado</AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-1.5">
                {options.map((option, k) => (
                  <li key={option} className="text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground/90">
                      {letters[k]}. {k === correct ? 'Resposta correta' : 'Alternativa incorreta'}:
                    </strong>{' '}
                    {feedback[k]}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </form>
  )
}
