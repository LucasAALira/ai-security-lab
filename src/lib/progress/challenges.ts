import { BOSS_QUESTIONS, BOSS_XP, CHALLENGE_XP, HINT_PHASES, OPTION_LIMIT } from './constants'
import type { BossState, ChallengeSpec, ChallengeState, ProgressContext, StudyState } from './types'

/* Correção dos desafios de código e dos chefes. A mesma função serve à interface (para o feedback)
   e ao motor (para decidir o que muda no progresso): as regras ficam num lugar só. */

export interface LinesGrade {
  /** A seleção tem forma válida (números inteiros, sem repetição, dentro do código). */
  valid: boolean
  /** Marcou todas as linhas da falha principal e nenhuma que não seja falha. */
  ok: boolean
  /** Linhas marcadas que não fazem parte de nenhuma falha. */
  wrong: number[]
  /** Quantas linhas da falha principal ficaram sem marcar. */
  missing: number
  /** Só vale quando `ok`: marcou também a falha opcional. */
  extra: boolean
}

const uniqueIndexes = (list: unknown, size: number): list is number[] =>
  Array.isArray(list) &&
  list.length <= size &&
  list.every((n) => Number.isInteger(n) && n >= 0 && n < size) &&
  new Set(list).size === list.length

export function gradeLines(spec: ChallengeSpec, picked: unknown): LinesGrade {
  if (!uniqueIndexes(picked, spec.lines)) return { valid: false, ok: false, wrong: [], missing: spec.vulnerable.length, extra: false }
  const chosen = new Set(picked)
  const allowed = new Set([...spec.vulnerable, ...spec.also, ...spec.extra])
  const wrong = picked.filter((n) => !allowed.has(n)).sort((a, b) => a - b)
  const missing = spec.vulnerable.filter((n) => !chosen.has(n)).length
  const ok = picked.length > 0 && wrong.length === 0 && missing === 0
  return { valid: true, ok, wrong, missing, extra: ok && spec.extra.length > 0 && spec.extra.every((n) => chosen.has(n)) }
}

export function gradeFix(spec: ChallengeSpec, option: unknown): { valid: boolean; ok: boolean } {
  const valid = Number.isInteger(option) && (option as number) >= 0 && (option as number) < spec.options
  return { valid, ok: valid && option === spec.fix }
}

export function gradeBoss(answers: readonly number[], index: unknown, option: unknown): { valid: boolean; ok: boolean } {
  const valid =
    Number.isInteger(index) &&
    (index as number) >= 0 &&
    (index as number) < Math.min(BOSS_QUESTIONS, answers.length) &&
    Number.isInteger(option) &&
    (option as number) >= 0 &&
    (option as number) < OPTION_LIMIT
  return { valid, ok: valid && answers[index as number] === option }
}

/* Consultas sobre o estado */

export const findChallenge = (ctx: ProgressContext, id: string) => ctx.challenges.find((c) => c.id === id)

export const isChallengeDone = (c: ChallengeState | undefined) => Boolean(c?.identified && c.fixed)
/** A tentativa atual já passou pelas duas fases. */
export const isRunDone = (c: ChallengeState) => c.run.identified && c.run.fixed
export const hintsUsed = (c: ChallengeState) => c.run.hints.filter(Boolean).length

/** Dicas que a fase mostra (posições), na ordem. */
export const phaseHints = (phase: 'identify' | 'fix'): readonly number[] => HINT_PHASES[phase]

export function challengesOf(ctx: ProgressContext, module: number): ChallengeSpec[] {
  return ctx.challenges.filter((c) => c.module === module)
}

export interface ChallengeStats {
  /** Desafios de identificação de falhas (tipo `vuln`) com a falha identificada. */
  vulnIdentified: number
  /** Desafios de autorização concluídos (falha identificada e correção escolhida). */
  authDone: number
  /** Desafios distintos em que a correção certa foi escolhida. */
  fixed: number
  /** Desafios concluídos ao menos uma vez. */
  done: number
  /** Desafios concluídos em alguma tentativa sem nenhuma dica. */
  helpless: number
  /** Desafios com a falha opcional encontrada. */
  extra: number
  hints: number
  /** Desafios concluídos por marca (`web`, `api`, `mobile`...). */
  byTag: Record<string, number>
}

export function challengeStats(s: StudyState, ctx: ProgressContext): ChallengeStats {
  const out: ChallengeStats = { vulnIdentified: 0, authDone: 0, fixed: 0, done: 0, helpless: 0, extra: 0, hints: 0, byTag: {} }
  for (const spec of ctx.challenges) {
    const c = s.challenges[spec.id]
    if (!c) continue
    if (spec.kind === 'vuln' && c.identified) out.vulnIdentified += 1
    if (spec.kind === 'auth' && isChallengeDone(c)) out.authDone += 1
    if (c.fixed) out.fixed += 1
    if (isChallengeDone(c)) {
      out.done += 1
      for (const tag of spec.tags) out.byTag[tag] = (out.byTag[tag] ?? 0) + 1
    }
    if (c.helpless) out.helpless += 1
    if (c.extra) out.extra += 1
    out.hints += c.hints
  }
  return out
}

export const bossCount = (ctx: ProgressContext) => ctx.bosses.filter((a) => a.length > 0).length
export const isBossWon = (b: BossState | undefined) => Boolean(b?.won)
export const bossesWon = (s: StudyState, ctx: ProgressContext) => ctx.bosses.filter((a, i) => a.length > 0 && isBossWon(s.bosses[i])).length

/** XP dos desafios de código e dos chefes. Sai das marcas "já fez" do estado, então repetir uma
 *  atividade não acumula XP: cada fase de cada desafio e cada chefe contam uma única vez. */
export function gameXp(s: StudyState, ctx: ProgressContext): number {
  let xp = 0
  for (const spec of ctx.challenges) {
    const c = s.challenges[spec.id]
    if (c) xp += (c.identified ? CHALLENGE_XP.identify : 0) + (c.fixed ? CHALLENGE_XP.fix : 0)
  }
  ctx.bosses.forEach((answers, i) => {
    if (answers.length > 0 && isBossWon(s.bosses[i])) xp += BOSS_XP
  })
  return xp
}
