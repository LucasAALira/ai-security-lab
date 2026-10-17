import { isEarlyAccess, moduleUnlockPrice } from './catalog'
import { challengesOf, isBossWon, isChallengeDone } from './challenges'
import { BOSS_QUESTIONS, BOSS_XP, CHALLENGE_XP, QUESTIONS_PER_MODULE, READS_PER_MODULE, XP } from './constants'
import { countDone, isModuleComplete, moduleSteps } from './core'
import type { ChallengeSpec, ProgressContext, StudyState } from './types'

/* Trilha de módulos: etapas, fogueiras (checkpoints de conclusão) e chefes. Tudo é derivado do
   progresso salvo, então não há um segundo estado para ficar fora de sincronia. */

export type StepId = 'aulas' | 'pesquisa' | 'pratica' | 'questoes' | 'desafios' | 'fogueira' | 'chefe'
export type StepStatus = 'locked' | 'available' | 'done'

export interface TrailStep {
  id: StepId
  status: StepStatus
  done: number
  total: number
  /** Etapas opcionais não impedem a fogueira nem o chefe. */
  optional: boolean
  /** XP que a etapa rende, uma única vez. */
  xp: number
}

export interface TrailModule {
  module: number
  unlocked: boolean
  /** Módulo de acesso antecipado: o conteúdo só abre depois da liberação. */
  earlyAccess: boolean
  /** Preço do desbloqueio imediato com moedas (`null` se o módulo não é vendido). */
  price: number | null
  /** Já foi desbloqueado com moedas. */
  purchased: boolean
  /** Módulos pré-requisito cuja fogueira ainda não está acesa. */
  missing: number[]
  complete: boolean
  steps: TrailStep[]
  fire: { lit: boolean; day: string }
  boss: { exists: boolean; available: boolean; won: boolean; flawless: boolean; solved: number; total: number; wins: number }
}

export function missingPrereqs(s: StudyState, ctx: ProgressContext, module: number): number[] {
  return (ctx.prereqs[module] ?? []).filter((p) => !(s.modules[p] && isModuleComplete(s.modules[p])))
}

/** Um módulo está liberado quando todos os pré-requisitos têm a fogueira acesa, quando foi
 *  desbloqueado com moedas, ou quando o aluno já tinha começado o módulo antes dessa regra existir. */
export function isModuleUnlocked(s: StudyState, ctx: ProgressContext, module: number): boolean {
  const m = s.modules[module]
  if (!m) return false
  return missingPrereqs(s, ctx, module).length === 0 || s.shop.unlocked.includes(module) || moduleSteps(m) > 0
}

const spotCache = new WeakMap<ProgressContext, ReadonlySet<string>>()

/** Desafios que alguma missão usa como atividade de “encontrar a falha”. A missão é quem decide a ordem, não a trilha. */
function missionSpots(ctx: ProgressContext): ReadonlySet<string> {
  let spots = spotCache.get(ctx)
  if (!spots) {
    spots = new Set(ctx.missions.flatMap((m) => m.activities.filter((a) => a.kind === 'spot').map((a) => a.challenge)))
    spotCache.set(ctx, spots)
  }
  return spots
}

/** Desafios das áreas novas (`module: null`) estão sempre abertos; os dos módulos clássicos seguem a trilha,
 *  a não ser que uma missão os use como atividade (aí abrem pela missão, sem exigir o módulo da trilha). */
export const isChallengeOpen = (s: StudyState, ctx: ProgressContext, spec: Pick<ChallengeSpec, 'id' | 'module'>): boolean =>
  spec.module === null || isModuleUnlocked(s, ctx, spec.module) || missionSpots(ctx).has(spec.id)

/** O conteúdo (textos, quiz, cartões, desafios) abre? Módulos comuns sempre abrem para leitura;
 *  os de acesso antecipado só depois de liberados. */
export function canOpenContent(s: StudyState, ctx: ProgressContext, module: number): boolean {
  return !isEarlyAccess(module) || isModuleUnlocked(s, ctx, module)
}

export function trail(s: StudyState, ctx: ProgressContext): TrailModule[] {
  return Object.keys(s.modules).map((key) => {
    const i = Number(key)
    const m = s.modules[i]
    const unlocked = isModuleUnlocked(s, ctx, i)
    const complete = isModuleComplete(m)
    const challenges = challengesOf(ctx, i)
    const challengesDone = challenges.filter((c) => isChallengeDone(s.challenges[c.id])).length
    const boss = s.bosses[i]
    const answers = ctx.bosses[i] ?? []
    const bossExists = answers.length > 0
    const won = isBossWon(boss)
    const state = (done: boolean): StepStatus => (done ? 'done' : unlocked ? 'available' : 'locked')

    const reads = countDone(m.reads)
    const answered = countDone(m.solved)
    const steps: TrailStep[] = [
      { id: 'aulas', status: state(reads === READS_PER_MODULE), done: reads, total: READS_PER_MODULE, optional: false, xp: reads === READS_PER_MODULE ? 0 : XP.read * (READS_PER_MODULE - reads) },
      { id: 'pesquisa', status: state(m.research), done: Number(m.research), total: 1, optional: false, xp: m.research ? 0 : XP.research },
      { id: 'pratica', status: state(m.practice), done: Number(m.practice), total: 1, optional: false, xp: m.practice ? 0 : XP.practice },
      { id: 'questoes', status: state(answered === QUESTIONS_PER_MODULE), done: answered, total: QUESTIONS_PER_MODULE, optional: false, xp: XP.question * (QUESTIONS_PER_MODULE - answered) },
      { id: 'fogueira', status: complete ? 'done' : 'locked', done: Number(complete), total: 1, optional: false, xp: 0 },
    ]
    if (bossExists) {
      steps.push({
        id: 'chefe',
        status: won ? 'done' : complete ? 'available' : 'locked',
        done: Number(won),
        total: 1,
        optional: false,
        xp: won ? 0 : BOSS_XP,
      })
    }
    if (challenges.length) {
      steps.push({
        id: 'desafios',
        status: challengesDone === challenges.length ? 'done' : unlocked ? 'available' : 'locked',
        done: challengesDone,
        total: challenges.length,
        optional: true,
        xp: challenges.reduce((n, c) => n + (s.challenges[c.id]?.identified ? 0 : CHALLENGE_XP.identify) + (s.challenges[c.id]?.fixed ? 0 : CHALLENGE_XP.fix), 0),
      })
    }

    return {
      module: i,
      unlocked,
      earlyAccess: isEarlyAccess(i),
      price: moduleUnlockPrice(i),
      purchased: s.shop.unlocked.includes(i),
      missing: missingPrereqs(s, ctx, i),
      complete,
      steps,
      fire: { lit: complete, day: s.fires[i] ?? '' },
      boss: {
        exists: bossExists,
        available: bossExists && complete,
        won,
        flawless: Boolean(boss?.flawless),
        solved: boss ? countDone(boss.done) : 0,
        total: Math.min(BOSS_QUESTIONS, answers.length),
        wins: boss?.wins ?? 0,
      },
    }
  })
}

export type Objective =
  | { kind: 'step'; module: number; step: 'aulas' | 'pesquisa' | 'pratica' | 'questoes'; left: number; xp: number; started: boolean }
  | { kind: 'boss'; module: number; xp: number }
  | { kind: 'lab'; xp: number }
  | { kind: 'cases'; left: number; xp: number }
  | { kind: 'challenge'; id: string; module: number | null; xp: number }
  | { kind: 'done' }

/** O próximo objetivo real: terminar o módulo em andamento, enfrentar um chefe liberado pela
 *  fogueira, começar o próximo módulo liberado, e então laboratório, cenários e desafios de código. */
export function nextObjective(s: StudyState, ctx: ProgressContext): Objective {
  const t = trail(s, ctx)
  const stepOf = (mod: (typeof t)[number], started: boolean): Objective | null => {
    for (const step of mod.steps) {
      if (step.optional || step.id === 'fogueira' || step.id === 'chefe') continue
      if (step.status === 'available') {
        return { kind: 'step', module: mod.module, step: step.id as 'aulas' | 'pesquisa' | 'pratica' | 'questoes', left: step.total - step.done, xp: step.xp, started }
      }
    }
    return null
  }

  // 1. Módulo em andamento (o mais adiantado).
  const open = t
    .filter((m) => m.unlocked && !m.complete && moduleSteps(s.modules[m.module]) > 0)
    .sort((a, b) => moduleSteps(s.modules[b.module]) - moduleSteps(s.modules[a.module]) || a.module - b.module)
  for (const m of open) {
    const step = stepOf(m, true)
    if (step) return step
  }

  // 2. Chefe liberado pela fogueira.
  const boss = t.find((m) => m.boss.available && !m.boss.won)
  if (boss) return { kind: 'boss', module: boss.module, xp: BOSS_XP }

  // 3. Próximo módulo liberado ainda não começado.
  const next = t.find((m) => m.unlocked && !m.complete && moduleSteps(s.modules[m.module]) === 0)
  if (next) {
    const step = stepOf(next, false)
    if (step) return step
  }

  // 4. O que sobra fora dos módulos.
  if (!s.lab) return { kind: 'lab', xp: XP.lab }
  const pending = s.cases.filter((c) => !c).length
  if (pending) return { kind: 'cases', left: pending, xp: XP.fix }
  const challenge = ctx.challenges.find((c) => !isChallengeDone(s.challenges[c.id]) && isChallengeOpen(s, ctx, c))
  if (challenge) {
    const c = s.challenges[challenge.id]
    return { kind: 'challenge', id: challenge.id, module: challenge.module, xp: (c?.identified ? 0 : CHALLENGE_XP.identify) + (c?.fixed ? 0 : CHALLENGE_XP.fix) }
  }
  return { kind: 'done' }
}
