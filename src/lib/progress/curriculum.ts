import { isChallengeDone } from './challenges'
import { READS_PER_MODULE, QUESTIONS_PER_MODULE, TASKS_PER_MODULE } from './constants'
import { countDone, moduleSteps } from './core'
import { findMission, missionDone } from './missions'
import type { ProgressContext, StudyState, SubSpec } from './types'

/* Progresso na hierarquia Área -> Módulo -> Submódulo. É calculado só com o que é obrigatório:
   a aula (quando existe) e os desafios exigidos; flashcards, missões e dossiês ficam de fora para
   o progresso não inflar com conteúdo opcional. Submódulos planejados não contam. */

export interface SubProgress {
  id: string
  /** Itens obrigatórios concluídos e o total. */
  done: number
  total: number
  /** Leitura concluída (aula lida; nos clássicos, as três etapas). `null` quando não há aula. */
  read: boolean | null
  /** Prática realizada: ao menos uma tentativa nos desafios exigidos (nos clássicos, a atividade prática). */
  practiced: boolean
  /** Desafios aprovados (corrigidos por regras). `null` quando o submódulo não exige nenhum. */
  approved: boolean | null
  complete: boolean
}

export const findSub = (ctx: ProgressContext, id: string): SubSpec | undefined => ctx.curriculum.subs.find((x) => x.id === id)

export function subProgress(s: StudyState, sub: SubSpec): SubProgress | null {
  if (!sub.available) return null

  // Submódulo que usa o progresso de um módulo clássico (as 7 tarefas da fogueira).
  if (sub.legacy !== null) {
    const m = s.modules[sub.legacy]
    if (!m) return null
    const done = moduleSteps(m)
    return {
      id: sub.id,
      done,
      total: TASKS_PER_MODULE,
      read: countDone(m.reads) === READS_PER_MODULE,
      practiced: m.practice,
      approved: countDone(m.solved) === QUESTIONS_PER_MODULE,
      complete: done === TASKS_PER_MODULE,
    }
  }

  const challenges = sub.challenges.map((id) => s.challenges[id])
  const solved = challenges.filter(isChallengeDone).length
  const read = sub.lesson ? Boolean(s.lessons[sub.id]) : null
  const total = (sub.lesson ? 1 : 0) + sub.challenges.length
  const done = (read ? 1 : 0) + solved
  return {
    id: sub.id,
    done,
    total,
    read,
    practiced: challenges.some((c) => Boolean(c) && (c!.attempts > 0 || c!.run.identified)),
    approved: sub.challenges.length ? solved === sub.challenges.length : null,
    complete: total > 0 && done === total,
  }
}

export interface Rollup {
  done: number
  total: number
  /** Submódulos com conteúdo, concluídos, e o total (inclui os planejados). */
  subsComplete: number
  subsAvailable: number
  subsTotal: number
}

const roll = (s: StudyState, subs: SubSpec[]): Rollup => {
  const out: Rollup = { done: 0, total: 0, subsComplete: 0, subsAvailable: 0, subsTotal: subs.length }
  for (const sub of subs) {
    const p = subProgress(s, sub)
    if (!p) continue
    out.subsAvailable += 1
    out.done += p.done
    out.total += p.total
    if (p.complete) out.subsComplete += 1
  }
  return out
}

export const moduleRollup = (s: StudyState, ctx: ProgressContext, moduleId: string): Rollup =>
  roll(s, ctx.curriculum.subs.filter((x) => x.module === moduleId))

export const areaRollup = (s: StudyState, ctx: ProgressContext, areaId: string): Rollup =>
  roll(s, ctx.curriculum.subs.filter((x) => x.area === areaId))

/** Um módulo está concluído (fogueira do módulo) quando todos os submódulos com conteúdo estão concluídos. */
export const isModuleCurriculumDone = (s: StudyState, ctx: ProgressContext, moduleId: string): boolean => {
  const r = moduleRollup(s, ctx, moduleId)
  return r.subsAvailable > 0 && r.subsComplete === r.subsAvailable
}

export type Resume = { kind: 'mission'; id: string } | { kind: 'challenge'; id: string }

/** Onde o aluno parou: a missão começada e não concluída, ou o desafio com tentativa aberta,
 *  o que tiver sido tocado por último. `null` quando não há nada em andamento. */
export function resumePoint(s: StudyState, ctx: ProgressContext): Resume | null {
  for (let i = s.events.length - 1; i >= 0; i--) {
    const e = s.events[i]
    if (e.kind === 'mission' || e.kind === 'mission-miss') {
      const id = e.ref.split(':')[0]
      const mission = findMission(ctx, id)
      if (mission && !missionDone(s, id)) return { kind: 'mission', id }
    }
    if (e.kind === 'identify' || e.kind === 'hint' || e.kind === 'challenge-miss') {
      const id = e.ref.split(':')[0]
      const spec = ctx.challenges.find((c) => c.id === id)
      if (spec && !isChallengeDone(s.challenges[id])) return { kind: 'challenge', id }
    }
  }
  return null
}
