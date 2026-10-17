import {
  CORE_MODULE_COUNT,
  LEVELS,
  MODULE_COUNT,
  MODULE_XP,
  QUESTIONS_PER_MODULE,
  READS_PER_MODULE,
  TASKS_PER_MODULE,
  TIER_THRESHOLDS,
  TOTAL_TASKS,
  XP,
} from './constants'
import type {
  Improvement,
  LevelInfo,
  ModuleRemaining,
  ModuleState,
  ProgressContext,
  StudyState,
  Tier,
  TrackProgress,
} from './types'

export const countDone = (list: readonly boolean[]) => list.filter(Boolean).length

/* Tarefas e XP por módulo */

export function moduleSteps(m: ModuleState): number {
  return countDone(m.reads) + Number(m.research) + Number(m.practice) + countDone(m.solved)
}

export function moduleXp(m: ModuleState): number {
  return (
    countDone(m.reads) * XP.read + Number(m.research) * XP.research + Number(m.practice) * XP.practice + countDone(m.solved) * XP.question
  )
}

export const isModuleComplete = (m: ModuleState) => moduleSteps(m) === TASKS_PER_MODULE

export function moduleRemaining(m: ModuleState): ModuleRemaining {
  return {
    reads: READS_PER_MODULE - countDone(m.reads),
    research: !m.research,
    practice: !m.practice,
    questions: QUESTIONS_PER_MODULE - countDone(m.solved),
  }
}

export interface Totals {
  /** XP das tarefas, sem o bônus de medalhas. */
  xp: number
  complete: number
  steps: number
  total: number
}

/** Módulos da trilha principal. Os de acesso antecipado ficam de fora das contagens de "tudo concluído". */
export const coreModules = (s: StudyState): ModuleState[] => Object.keys(s.modules).filter((i) => Number(i) < CORE_MODULE_COUNT).map((i) => s.modules[Number(i)])

export function baseTotals(s: StudyState): Totals {
  const modules = Object.values(s.modules)
  const core = coreModules(s)
  const cases = countDone(s.cases)
  return {
    // O XP conta todos os módulos; as tarefas totais e concluídas, só os da trilha principal.
    xp: modules.reduce((n, m) => n + moduleXp(m), 0) + (s.lab ? XP.lab : 0) + cases * XP.fix,
    complete: core.filter(isModuleComplete).length,
    steps: core.reduce((n, m) => n + moduleSteps(m), 0) + (s.lab ? 1 : 0) + cases,
    total: TOTAL_TASKS,
  }
}

/* Medalha de módulo ou trilha: bronze a partir de 40%, prata a partir de 70%, ouro ao concluir. */

export function tierFor(done: number, max: number): Tier | null {
  const ratio = max ? done / max : 0
  if (ratio >= TIER_THRESHOLDS.ouro) return 'ouro'
  if (ratio >= TIER_THRESHOLDS.prata) return 'prata'
  if (ratio >= TIER_THRESHOLDS.bronze) return 'bronze'
  return null
}

export function nextTierFor(done: number, max: number): { tier: Tier; remaining: number } | null {
  const current = tierFor(done, max)
  if (current === 'ouro' || !max) return null
  const target: Tier = current === 'prata' ? 'ouro' : current === 'bronze' ? 'prata' : 'bronze'
  for (let n = done + 1; n <= max; n++) {
    if (tierFor(n, max) === target) return { tier: target, remaining: n - done }
  }
  return null
}

/* Níveis */

export function levelFor(xp: number): LevelInfo {
  let n = 0
  LEVELS.forEach((level, i) => {
    if (xp >= level.at) n = i
  })
  return { number: n + 1, name: LEVELS[n].name, start: LEVELS[n].at, next: LEVELS[n + 1]?.at ?? null }
}

/* Evolução por trilha e pontos de melhoria */

export function trackProgress(s: StudyState, ctx: ProgressContext): TrackProgress[] {
  return ctx.tracks.map((t) => {
    const ms = t.modules.map((i) => s.modules[i]).filter(Boolean)
    const steps = ms.reduce((n, m) => n + moduleSteps(m), 0)
    const maxSteps = ms.length * TASKS_PER_MODULE
    return {
      name: t.name,
      modules: t.modules,
      count: ms.length,
      complete: ms.filter(isModuleComplete).length,
      steps,
      maxSteps,
      xp: ms.reduce((n, m) => n + moduleXp(m), 0),
      maxXp: ms.length * MODULE_XP,
      tier: tierFor(steps, maxSteps),
      next: nextTierFor(steps, maxSteps),
    }
  })
}

/** Próximos passos mais valiosos, na ordem: refazer erros, terminar módulos, iniciar o próximo,
 *  laboratório e cenários. */
export function improvements(s: StudyState, ctx: ProgressContext, limit = 4): Improvement[] {
  const out: Improvement[] = []
  for (let i = 0; i < MODULE_COUNT; i++) {
    const m = s.modules[i]
    for (let j = 0; j < QUESTIONS_PER_MODULE; j++) {
      if (!m.solved[j] && m.misses[j] > 0) {
        out.push({ kind: 'retry', module: i, question: j, misses: m.misses[j], xp: XP.question, priority: 1 })
      }
    }
    if (!isModuleComplete(m) && moduleSteps(m) >= 3) {
      out.push({
        kind: 'finish',
        module: i,
        left: moduleRemaining(m),
        xp: MODULE_XP - moduleXp(m),
        priority: 2 + (TASKS_PER_MODULE - moduleSteps(m)) / 10,
      })
    }
  }
  for (let i = 0; i < MODULE_COUNT; i++) {
    const ready = (ctx.prereqs[i] ?? []).every((p) => s.modules[p] && isModuleComplete(s.modules[p])) || s.shop.unlocked.includes(i)
    if (moduleSteps(s.modules[i]) === 0 && ready) {
      out.push({ kind: 'start', module: i, xp: MODULE_XP, priority: 3 })
      break
    }
  }
  if (!s.lab) out.push({ kind: 'lab', xp: XP.lab, priority: 4 })
  const pending = s.cases.filter((c) => !c).length
  if (pending) out.push({ kind: 'cases', left: pending, xp: XP.fix, priority: 4 })
  return out.sort((a, b) => a.priority - b.priority).slice(0, limit)
}
