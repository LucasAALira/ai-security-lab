import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { modules } from '@/data/modules'
import { eventsToText } from '@/lib/events-text'
import { letters } from '@/lib/format'
import { XP } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

interface Props {
  moduleIndex: number
  questionIndex: number
  /** Avisa o diálogo com as frases do que mudou (XP, medalhas...). */
  onResult: (lines: string[]) => void
}

type Feedback = { kind: 'info' | 'correct' | 'retry'; text: string }

export function QuestionForm({ moduleIndex, questionIndex: j, onResult }: Props) {
  const { state, dispatch } = useProgress()
  const q = modules[moduleIndex].questions[j]
  const solved = state.modules[moduleIndex].solved[j]
  const [chosen, setChosen] = useState(solved ? String(q.correct) : '')
  const [feedback, setFeedback] = useState<Feedback | null>(solved ? { kind: 'info', text: `Resposta ${letters[q.correct]}: ${q.feedback[q.correct]}` } : null)
  const [attempted, setAttempted] = useState(false)
  const [retry, setRetry] = useState(false)
  const name = `question-${moduleIndex}-${j}`

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (chosen === '') return setFeedback({ kind: 'info', text: 'Selecione uma alternativa antes de conferir.' })
    const n = Number(chosen)
    setAttempted(true)
    if (n === q.correct) {
      const result = dispatch({ type: 'answer', module: moduleIndex, index: j })
      setFeedback({ kind: 'correct', text: `${q.feedback[n]} +${XP.question} XP pelo primeiro acerto.` })
      onResult(eventsToText(result.events))
    } else {
      const result = dispatch({ type: 'miss', module: moduleIndex, index: j })
      setRetry(true)
      setFeedback({ kind: 'retry', text: `${q.feedback[n]} Revise o conteúdo e tente novamente.` })
      onResult(eventsToText(result.events))
    }
  }

  return (
    <form onSubmit={submit} className="my-[18px] rounded-lg border border-border bg-tint p-5 max-sm:p-3">
      <fieldset disabled={solved} className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2.5 w-full text-sm leading-relaxed font-bold">
          {j + 1}. {q.title}
        </legend>
        <RadioGroup name={name} value={chosen} onValueChange={setChosen} disabled={solved} className="gap-0">
          {q.options.map((option, k) => (
            <Label
              key={option}
              htmlFor={`${name}-${k}`}
              className={cn('my-[7px] flex cursor-pointer items-start gap-[9px] rounded-md border border-border bg-card px-3.5 py-3 text-[13px] font-normal max-sm:text-xs', chosen === String(k) && 'border-primary bg-tint-strong', solved && 'cursor-default')}
            >
              <RadioGroupItem id={`${name}-${k}`} value={String(k)} className="mt-0.5" />
              <span>
                {letters[k]}. {option}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
      <details className="my-3.5 text-xs">
        <summary className="cursor-pointer text-primary">Ver dica</summary>
        <p className="mt-1.5 text-xs text-muted-foreground">{q.hint}</p>
      </details>
      <Button type="submit" disabled={solved}>
        {solved ? `✓ Acerto registrado · ${XP.question} XP` : retry ? 'Conferir nova resposta' : 'Conferir resposta'}
      </Button>
      <div role="status" aria-live="polite" className={cn('mt-3 text-[13px] leading-[1.7]', feedback?.kind === 'correct' && 'text-primary', feedback?.kind === 'retry' && 'text-warning')}>
        {feedback?.text}
      </div>
      {attempted || solved ? (
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer text-primary">Ver gabarito comentado</summary>
          {q.options.map((option, k) => (
            <p key={option} className="mt-1.5 text-xs text-muted-foreground">
              <strong className="text-foreground/90">
                {letters[k]}. {k === q.correct ? 'Resposta correta' : 'Alternativa incorreta'}:
              </strong>{' '}
              {q.feedback[k]}
            </p>
          ))}
        </details>
      ) : null}
    </form>
  )
}
