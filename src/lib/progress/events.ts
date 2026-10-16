import { LIMITS } from './constants'
import { dayKey } from './dates'
import type { LearningEventKind, StudyState } from './types'

/** Acrescenta um evento ao histórico (altera `s`). O histórico guarda só os mais recentes;
 *  as regras de XP e de conquistas leem contadores e marcas do estado, nunca este registro. */
export function logEvent(s: StudyState, now: Date, kind: LearningEventKind, ref: string): void {
  s.events.push({ at: now.getTime(), day: dayKey(now), kind, ref })
  if (s.events.length > LIMITS.events) s.events.splice(0, s.events.length - LIMITS.events)
}
