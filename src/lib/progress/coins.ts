import { XP_PER_COIN } from './catalog'
import { economyOf } from './economy'
import { summary } from './medals'
import type { ProgressContext, StudyState } from './types'

/** Moedas ganhas no total: uma a cada 5 XP, mais as de missões, baús e revisões, vezes o
 *  multiplicador de moedas da dificuldade (1 no Soulslike). */
export function coinsEarned(s: StudyState, ctx: ProgressContext): number {
  const cm = economyOf(s).coinMultiplier
  return (Math.floor(summary(s, ctx).xp / XP_PER_COIN) + s.coins.bonus) * cm
}

/** Saldo para gastar na loja. Gastar moedas nunca reduz XP, nível nem medalhas. */
export function coinBalance(s: StudyState, ctx: ProgressContext): number {
  return Math.max(0, coinsEarned(s, ctx) - s.coins.spent)
}
