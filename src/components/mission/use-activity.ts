import { useCallback } from 'react'
import { gradeActivity, missionState, resultOf, type ActivityResult, type ActivitySpec, type Answer, type ApplyResult, type Grade } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

export interface ActivityView {
  spec: ActivitySpec
  /** Resultado na tentativa atual (`null` enquanto não respondida). */
  result: ActivityResult | null
  /** Já rendeu crédito em alguma tentativa. */
  credited: boolean
  answer: Answer | null
  misses: number
  hints: number
  /** Nota da resposta já registrada. */
  grade: Grade | null
  submit: (answer: Answer) => ApplyResult
  hint: (index: number) => ApplyResult
  reveal: () => ApplyResult
  rewind: () => ApplyResult
}

/** Estado e ações de uma atividade da missão, lidos do progresso salvo. */
export function useActivity(missionId: string, spec: ActivitySpec): ActivityView {
  const { state, dispatch } = useProgress()
  const m = missionState(state, missionId)
  const result = resultOf(state, spec, m)
  const answer = m.run.answers[spec.id] ?? null
  const submit = useCallback((a: Answer) => dispatch({ type: 'missionAnswer', mission: missionId, activity: spec.id, answer: a }), [dispatch, missionId, spec.id])
  const hint = useCallback((index: number) => dispatch({ type: 'missionHint', mission: missionId, activity: spec.id, index }), [dispatch, missionId, spec.id])
  const reveal = useCallback(() => dispatch({ type: 'missionReveal', mission: missionId, activity: spec.id }), [dispatch, missionId, spec.id])
  const rewind = useCallback(() => dispatch({ type: 'missionRewind', mission: missionId, activity: spec.id }), [dispatch, missionId, spec.id])
  return {
    spec,
    result,
    credited: spec.kind === 'spot' ? result !== null : m.credited.includes(spec.id),
    answer,
    misses: m.run.misses[spec.id] ?? 0,
    hints: m.run.hints[spec.id] ?? 0,
    grade: answer ? gradeActivity(spec, answer) : null,
    submit,
    hint,
    reveal,
    rewind,
  }
}
