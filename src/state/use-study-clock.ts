import { useEffect, useRef } from 'react'
import { STUDY_CLOCK, type Action, type ApplyResult } from '@/lib/progress'

/** Um minuto entre tiques: o relógio soma de minuto em minuto, nunca mais que isso. */
export const TICK_MS = 60_000

/** Sem interação por este tempo, a aba conta como abandonada e o relógio pausa. */
export const IDLE_MS = 5 * 60_000

export interface ClockMoment {
  /** A aba está visível (`document.visibilityState === 'visible'`). */
  visible: boolean
  /** Instante da última interação (ms, como `Date.now()`). */
  lastActive: number
  now: number
}

/** Decide se o minuto que acabou de passar conta como estudo. Só conta com a aba visível e
 *  interação recente: assim uma aba esquecida aberta não vira hora de estudo. */
export function countsAsStudy({ visible, lastActive, now }: ClockMoment, idleMs = IDLE_MS): boolean {
  if (!visible) return false
  const since = now - lastActive
  return since >= 0 && since < idleMs
}

/** Mede o tempo com o site em uso e soma ao progresso, um minuto por vez.
 *  Não marca dia de estudo nem sequência: tempo de tela não é atividade concluída. */
export function useStudyClock(dispatch: (action: Action) => ApplyResult): void {
  const run = useRef(dispatch)
  run.current = dispatch

  useEffect(() => {
    if (typeof document === 'undefined') return
    let lastActive = Date.now()
    const touch = () => {
      lastActive = Date.now()
    }
    const events: (keyof DocumentEventMap)[] = ['pointerdown', 'keydown', 'scroll', 'visibilitychange']
    for (const name of events) document.addEventListener(name, touch, { passive: true })

    const timer = setInterval(() => {
      const moment: ClockMoment = { visible: document.visibilityState === 'visible', lastActive, now: Date.now() }
      if (countsAsStudy(moment)) run.current({ type: 'studyTick', minutes: STUDY_CLOCK.tick })
    }, TICK_MS)

    return () => {
      clearInterval(timer)
      for (const name of events) document.removeEventListener(name, touch)
    }
  }, [])
}
