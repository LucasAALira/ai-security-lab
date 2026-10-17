import type { ProgressEvent } from './actions'
import { gradeActivity, isDecision, isGood, type ActivitySpec } from './activities'
import { HINTS_PER_ACTIVITY, LIMITS, MISSION_STAGES, REVEAL_AFTER } from './constants'
import { dayKey } from './dates'
import { firstPending, isCleanRun, missionLock, missionPassed, findMission, resultOf } from './missions'
import { nothing, reject, type Outcome } from './outcome'
import { emptyMission, emptyRun } from './state'
import type { Answer, MissionSpec, MissionState, ProgressContext, StudyState } from './types'

/** Ações das campanhas, dos dossiês e das aulas dos submódulos. */
export type MissionAction =
  /** Abre a missão (ou retoma a que está em andamento). */
  | { type: 'missionStart'; mission: string }
  /** Salva a etapa (0 a 4) e a atividade atual para retomar depois. Não rende XP. */
  | { type: 'missionGo'; mission: string; stage: number; step?: number }
  /** Abre a dica `index` (0 a 2) de uma atividade. Só afeta a conquista de "sem dicas". */
  | { type: 'missionHint'; mission: string; activity: string; index: number }
  /** Envia a resposta de uma atividade. As decisões são confirmadas; as outras repetem até acertar. */
  | { type: 'missionAnswer'; mission: string; activity: string; answer: Answer }
  /** Mostra a solução de uma atividade corrigida por regras, depois de erros. Não rende crédito. */
  | { type: 'missionReveal'; mission: string; activity: string }
  /** Refaz uma atividade (e as seguintes) na tentativa atual. O crédito já obtido permanece. */
  | { type: 'missionRewind'; mission: string; activity: string }
  | { type: 'missionFinish'; mission: string }
  /** Começa outra tentativa. Conquistas, crédito e histórico permanecem. */
  | { type: 'missionRestart'; mission: string }
  | { type: 'dossierRead'; dossier: string }
  | { type: 'lessonRead'; sub: string }

export const MISSION_ACTIONS = [
  'missionStart',
  'missionGo',
  'missionHint',
  'missionAnswer',
  'missionReveal',
  'missionRewind',
  'missionFinish',
  'missionRestart',
  'dossierRead',
  'lessonRead',
] as const

const small = (n: number) => Math.min(LIMITS.small, n + 1)
const copyAnswer = (a: Answer): Answer => (a.t ? { v: [...a.v], t: [...a.t] } : { v: [...a.v] })
const isInt = (n: unknown, min: number, max: number): n is number => Number.isInteger(n) && (n as number) >= min && (n as number) <= max

function open(s: StudyState, ctx: ProgressContext, id: unknown): { mission: MissionSpec } | { error: Outcome } {
  if (typeof id !== 'string') return { error: reject('missing') }
  const mission = findMission(ctx, id)
  if (!mission) return { error: reject('missing') }
  if (missionLock(s, ctx, id).locked) return { error: reject('missionLocked') }
  return { mission }
}

/** O estado da missão, criado e iniciado se ainda não existia (altera `s`). */
function begin(s: StudyState, id: string, today: string): MissionState {
  const m = (s.missions[id] ??= emptyMission())
  if (!m.started) {
    m.started = today
    m.attempts = 1
  }
  return m
}

function activityOf(mission: MissionSpec, id: unknown): { spec: ActivitySpec; index: number } | null {
  const index = mission.activities.findIndex((a) => a.id === id)
  return index === -1 ? null : { spec: mission.activities[index], index }
}

export function mutateMission(s: StudyState, action: MissionAction, ctx: ProgressContext, now: Date): Outcome {
  const today = dayKey(now)

  if (action.type === 'lessonRead') {
    if (typeof action.sub !== 'string' || !ctx.lessons.includes(action.sub)) return reject('missing')
    if (s.lessons[action.sub]) return nothing
    s.lessons[action.sub] = today
    s.daily.reads = small(s.daily.reads)
    return { changed: true, study: true, events: [{ kind: 'lesson', sub: action.sub }], log: [['lesson', action.sub]] }
  }

  if (action.type === 'dossierRead') {
    const dossier = typeof action.dossier === 'string' ? findMission(ctx, action.dossier) : undefined
    if (!dossier || dossier.kind !== 'dossier') return reject('missing')
    if (s.dossiers[dossier.id]) return nothing
    s.dossiers[dossier.id] = today
    return { changed: true, study: true, events: [{ kind: 'dossier', dossier: dossier.id }], log: [['dossier', dossier.id]] }
  }

  const found = open(s, ctx, action.mission)
  if ('error' in found) return found.error
  const { mission } = found
  const id = mission.id
  const total = mission.activities.length

  switch (action.type) {
    case 'missionStart': {
      if (s.missions[id]?.started) return nothing
      begin(s, id, today)
      return { changed: true, study: true, log: [['mission', `${id}:inicio`]] }
    }

    case 'missionGo': {
      if (!isInt(action.stage, 0, MISSION_STAGES - 1)) return reject('invalid')
      if (action.step !== undefined && !isInt(action.step, 0, Math.max(0, total - 1))) return reject('invalid')
      const m = begin(s, id, today)
      const pending = firstPending(s, mission, m)
      // As etapas de consequências e revisão só abrem depois de todas as decisões.
      if (action.stage >= 3 && pending < total) return reject('order')
      const step = action.step ?? Math.min(m.step, Math.max(0, total - 1))
      if (step > pending) return reject('order')
      if (m.stage === action.stage && m.step === step) return nothing
      m.stage = action.stage
      m.step = step
      return { changed: true }
    }

    case 'missionHint': {
      const target = activityOf(mission, action.activity)
      if (!target || target.spec.kind === 'spot') return reject('missing')
      if (!isInt(action.index, 0, HINTS_PER_ACTIVITY - 1)) return reject('invalid')
      const m = begin(s, id, today)
      if (target.index > firstPending(s, mission, m) || resultOf(s, target.spec, m) !== null) return nothing
      if ((m.run.hints[target.spec.id] ?? 0) >= action.index + 1) return nothing
      m.run.hints[target.spec.id] = action.index + 1
      return { changed: true, study: true, log: [['mission', `${id}:${target.spec.id}:dica`]] }
    }

    case 'missionAnswer': {
      const target = activityOf(mission, action.activity)
      if (!target || target.spec.kind === 'spot') return reject('missing')
      const { spec, index } = target
      const m = begin(s, id, today)
      if (index > firstPending(s, mission, m)) return reject('order')
      if (resultOf(s, spec, m) !== null) return nothing
      const grade = gradeActivity(spec, action.answer)
      if (!grade.valid) return reject('invalid')

      const events: ProgressEvent[] = []
      if (!isDecision(spec) && !grade.ok) {
        m.run.misses[spec.id] = Math.min(LIMITS.misses, (m.run.misses[spec.id] ?? 0) + 1)
        events.push({ kind: 'activity-miss', mission: id, activity: spec.id })
        return { changed: true, study: true, events, log: [['mission-miss', `${id}:${spec.id}`]] }
      }

      const quality = grade.quality!
      m.run.answers[spec.id] = copyAnswer(action.answer)
      m.run.results[spec.id] = quality
      if (spec.kind === 'decide' || spec.kind === 'adr') {
        m.history.push({ attempt: m.attempts, activity: spec.id, pick: action.answer.v[0], quality, day: today })
        if (m.history.length > LIMITS.history) m.history.splice(0, m.history.length - LIMITS.history)
      }
      const first = isGood(quality) && !m.credited.includes(spec.id)
      if (first) {
        m.credited.push(spec.id)
        s.daily.practices = small(s.daily.practices)
      }
      m.step = Math.min(index + 1, Math.max(0, total - 1))
      events.push({ kind: 'activity', mission: id, activity: spec.id, quality, first })
      return { changed: true, study: true, events, log: [['mission', `${id}:${spec.id}`]] }
    }

    case 'missionReveal': {
      const target = activityOf(mission, action.activity)
      if (!target || target.spec.kind === 'spot') return reject('missing')
      if (isDecision(target.spec)) return reject('invalid')
      const m = begin(s, id, today)
      if (resultOf(s, target.spec, m) !== null) return nothing
      if (target.index > firstPending(s, mission, m) || (m.run.misses[target.spec.id] ?? 0) < REVEAL_AFTER) return reject('order')
      m.run.results[target.spec.id] = 'revealed'
      m.step = Math.min(target.index + 1, Math.max(0, total - 1))
      return { changed: true, study: true, log: [['mission', `${id}:${target.spec.id}:solucao`]] }
    }

    case 'missionRewind': {
      const target = activityOf(mission, action.activity)
      if (!target || target.spec.kind === 'spot') return reject('missing')
      const m = s.missions[id]
      if (!m || m.run.results[target.spec.id] === undefined) return nothing
      for (const a of mission.activities.slice(target.index)) {
        delete m.run.results[a.id]
        delete m.run.answers[a.id]
      }
      m.stage = 2
      m.step = target.index
      return { changed: true, log: [['mission', `${id}:${target.spec.id}:refazer`]] }
    }

    case 'missionFinish': {
      const m = s.missions[id]
      if (!m?.started) return reject('order')
      if (firstPending(s, mission, m) < total) return reject('order')
      const first = !m.done
      const wasStage = m.stage
      const before = `${m.clean}${m.noHints}`
      if (first) m.done = today
      const results = mission.activities.map((a) => resultOf(s, a, m))
      const allGood = results.every((r) => r !== null && r !== 'revealed' && isGood(r))
      if (allGood && isCleanRun(mission, m)) m.clean = true
      if (allGood && Object.values(m.run.hints).every((n) => n === 0)) m.noHints = true
      m.stage = MISSION_STAGES - 1
      m.step = Math.max(0, total - 1)
      if (!first && wasStage === m.stage && before === `${m.clean}${m.noHints}`) return nothing
      return {
        changed: true,
        study: first,
        events: first ? [{ kind: 'mission', mission: id, passed: missionPassed(s, mission) }] : [],
        log: first ? [['mission-done', id]] : [],
      }
    }

    case 'missionRestart': {
      const m = s.missions[id]
      if (!m?.started) return reject('order')
      m.run = emptyRun()
      m.stage = 0
      m.step = 0
      m.attempts = Math.min(LIMITS.misses, m.attempts + 1)
      return { changed: true, log: [['mission', `${id}:nova`]] }
    }
  }
}
