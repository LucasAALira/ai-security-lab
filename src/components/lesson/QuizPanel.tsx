import { QuestionCard } from '@/components/study/QuestionCard'
import { modules } from '@/data/modules'
import { eventsToText } from '@/lib/events-text'
import { XP } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

interface Props {
  module: number
  locked: boolean
  onResult: (lines: string[]) => void
}

/** Quiz do módulo: duas questões, resposta conferida na hora, explicação em cada alternativa. */
export function QuizPanel({ module, locked, onResult }: Props) {
  const { state, dispatch } = useProgress()
  const m = modules[module]
  return (
    <div>
      <h3 id="aba-titulo-quiz" tabIndex={-1} className="text-xl font-medium outline-none">
        Quiz
      </h3>
      <p className="mt-1.5 mb-4 text-[13px] text-muted-foreground">
        Uma resposta certa por questão. O primeiro acerto vale {XP.question} XP; errar mostra o motivo e você tenta de novo, sem penalidade.
      </p>
      <div className="grid gap-4">
        {m.questions.map((q, j) => (
          <QuestionCard
            key={j}
            number={j + 1}
            title={q.title}
            options={q.options}
            correct={q.correct}
            feedback={q.feedback}
            hint={q.hint}
            solved={state.modules[module].solved[j]}
            disabled={locked}
            disabledReason="Módulo bloqueado na trilha: acenda a fogueira dos pré-requisitos para responder."
            onAnswer={(_choice, ok) => {
              const result = dispatch(ok ? { type: 'answer', module, index: j } : { type: 'miss', module, index: j })
              const lines = eventsToText(result.events)
              onResult(lines)
              if (ok) return result.events.some((e) => e.kind === 'xp') ? `+${XP.question} XP pelo primeiro acerto.` : undefined
            }}
          />
        ))}
      </div>
    </div>
  )
}
