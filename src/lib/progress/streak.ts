import { addDays, dayKey, daysBetween } from './dates'
import type { StudyState } from './types'

export interface TouchResult {
  /** Um novo dia de estudo foi contado. */
  extended: boolean
  /** Escudos consumidos para cobrir dias sem estudo. */
  shieldsUsed: number
}

/** Conta o dia de `now` como dia de estudo (altera `s`). Cada dia sem estudo entre o último dia e
 *  hoje consome um escudo; sem escudos suficientes a sequência recomeça em 1 e o recorde fica. */
export function touchStreak(s: StudyState, now: Date): TouchResult {
  const today = dayKey(now)
  const k = s.streak
  if (k.last && daysBetween(k.last, today) <= 0) return { extended: false, shieldsUsed: 0 }

  let shieldsUsed = 0
  const missed = k.last ? daysBetween(k.last, today) - 1 : 0
  if (!k.last) {
    k.current = 1
  } else if (missed === 0) {
    k.current += 1
  } else if (missed <= s.shop.shields) {
    s.shop.shields -= missed
    shieldsUsed = missed
    k.shieldUsed = addDays(today, -1)
    k.current += 1
  } else {
    k.current = 1
  }
  k.best = Math.max(k.best, k.current)
  k.last = today
  return { extended: true, shieldsUsed }
}

/** Sequência em andamento: vale se o último estudo foi hoje ou ontem, ou se os escudos
 *  disponíveis cobrem os dias sem estudo. */
export function activeStreak(s: StudyState, now: Date): number {
  const { last, current } = s.streak
  if (!last) return 0
  return daysBetween(last, dayKey(now)) <= 1 + s.shop.shields ? current : 0
}

export type StreakStatus = 'none' | 'done-today' | 'open' | 'shielded' | 'lost'

/** Situação da sequência hoje, para o aviso na interface. */
export function streakStatus(s: StudyState, now: Date): StreakStatus {
  const { last, current } = s.streak
  if (!last || current === 0) return 'none'
  const gap = daysBetween(last, dayKey(now))
  if (gap <= 0) return 'done-today'
  if (gap === 1) return 'open'
  return gap <= 1 + s.shop.shields ? 'shielded' : 'lost'
}
