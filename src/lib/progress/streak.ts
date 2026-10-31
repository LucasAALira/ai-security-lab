import { STUDY_CLOCK } from './constants'
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

/** Conta o dia de `now` como dia real de estudo (altera `s`). Diferente da sequência acima, aqui
 *  não há escudos: um dia sem estudo zera a contagem. É a base da conquista "Persistência". */
export function touchStudy(s: StudyState, now: Date): void {
  const today = dayKey(now)
  const k = s.study
  if (k.last && daysBetween(k.last, today) <= 0) return
  k.current = k.last && daysBetween(k.last, today) === 1 ? k.current + 1 : 1
  k.best = Math.max(k.best, k.current)
  k.total = Math.min(STUDY_CLOCK.total, k.total + 1)
  k.last = today
}

/** Soma minutos medidos ao tempo de estudo (altera `s`); devolve se algo mudou. O contador do dia
 *  reinicia quando `clockDay` muda e o teto diário limita o estrago de uma aba esquecida aberta.
 *  Não mexe na sequência nem nos dias de estudo: tempo de tela não é atividade concluída. */
export function tickStudyClock(s: StudyState, now: Date, minutes: number): boolean {
  const k = s.study
  const today = dayKey(now)
  const ask = Number.isFinite(minutes) ? Math.min(Math.max(Math.round(minutes), 0), STUDY_CLOCK.maxPerTick) : 0
  if (ask <= 0) return false
  if (k.clockDay !== today) {
    k.clockDay = today
    k.minutesToday = 0
  }
  const add = Math.min(ask, Math.max(STUDY_CLOCK.perDay - k.minutesToday, 0), Math.max(STUDY_CLOCK.total - k.minutes, 0))
  if (add <= 0) return false
  k.minutesToday += add
  k.minutes += add
  return true
}

/** Minutos medidos hoje (0 quando o registro é de outro dia). */
export function studyMinutesToday(s: StudyState, now: Date): number {
  return s.study.clockDay === dayKey(now) ? s.study.minutesToday : 0
}

/** Dias reais seguidos em andamento: vale se o último estudo foi hoje ou ontem. */
export function activeStudyDays(s: StudyState, now: Date): number {
  const { last, current } = s.study
  return last && daysBetween(last, dayKey(now)) <= 1 ? current : 0
}
