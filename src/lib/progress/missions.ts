import { isDecision, type ActivitySpec } from './activities'
import { isChallengeDone } from './challenges'
import { ARCHITECT_XP, DOSSIER_XP, LESSON_XP, MISSION_XP, REVIEW_XP } from './constants'
import type { ActivityResult, CampaignSpec, MissionSpec, MissionState, ProgressContext, StudyState } from './types'

/* Regras das campanhas, dos exercícios de dossiê e das amostras de análise de código. Tudo é derivado do estado salvo; o XP nunca é
   guardado, então repetir uma atividade não pode somá-lo de novo. */

export const findMission = (ctx: ProgressContext, id: string): MissionSpec | undefined => ctx.missions.find((m) => m.id === id)
export const findCampaign = (ctx: ProgressContext, id: string | null): CampaignSpec | undefined => ctx.campaigns.find((c) => c.id === id)
export const missionsOfKind = (ctx: ProgressContext, kind: MissionSpec['kind']): MissionSpec[] => ctx.missions.filter((m) => m.kind === kind)

const NO_MISSION: MissionState = {
  started: '',
  stage: 0,
  step: 0,
  run: { answers: {}, results: {}, misses: {}, hints: {} },
  attempts: 0,
  credited: [],
  done: '',
  clean: false,
  noHints: false,
  history: [],
}

/** Estado da missão, ou o estado vazio (sem criar registro) quando ela nunca foi aberta. */
export const missionState = (s: StudyState, id: string): MissionState => s.missions[id] ?? NO_MISSION

/** Resultado da atividade na tentativa atual. Nas de código, segue o desafio do laboratório. */
export function resultOf(s: StudyState, spec: ActivitySpec, m: MissionState): ActivityResult | null {
  if (spec.kind === 'spot') return isChallengeDone(s.challenges[spec.challenge]) ? 'best' : null
  return m.run.results[spec.id] ?? null
}

/** A atividade já rendeu crédito alguma vez (resposta certa ou decisão boa). */
export function isCredited(s: StudyState, spec: ActivitySpec, m: MissionState): boolean {
  return spec.kind === 'spot' ? isChallengeDone(s.challenges[spec.challenge]) : m.credited.includes(spec.id)
}

/** Posição da primeira atividade sem resultado na tentativa atual (o total, se todas têm). */
export function firstPending(s: StudyState, mission: MissionSpec, m: MissionState): number {
  const i = mission.activities.findIndex((a) => resultOf(s, a, m) === null)
  return i === -1 ? mission.activities.length : i
}

/** Marcas deixadas pelas decisões da tentativa atual (as que ainda valem, sem as refeitas). */
export function runFlags(mission: MissionSpec, m: MissionState): string[] {
  const flags = new Set<string>()
  for (const a of mission.activities) {
    if (!isDecision(a) || (a.kind !== 'decide' && a.kind !== 'adr')) continue
    const result = m.run.results[a.id]
    const pick = m.run.answers[a.id]?.v[0]
    if (result === undefined || result === 'revealed' || pick === undefined) continue
    for (const f of a.options[pick]?.flags ?? []) flags.add(f)
  }
  return [...flags]
}

/** A tentativa cumpre os critérios "limpos" da missão (por exemplo, evidências preservadas e credenciais giradas). */
export function isCleanRun(mission: MissionSpec, m: MissionState): boolean {
  if (!mission.clean.require.length && !mission.clean.forbid.length) return false
  const flags = new Set(runFlags(mission, m))
  return mission.clean.require.every((f) => flags.has(f)) && mission.clean.forbid.every((f) => !flags.has(f))
}

export const missionDone = (s: StudyState, id: string): boolean => Boolean(s.missions[id]?.done)

/** Concluída com todas as atividades creditadas (cumulativo entre tentativas). É o que as conquistas contam. */
export function missionPassed(s: StudyState, mission: MissionSpec): boolean {
  const m = s.missions[mission.id]
  return Boolean(m?.done) && mission.activities.every((a) => isCredited(s, a, m))
}

export function campaignDone(s: StudyState, ctx: ProgressContext, id: string): boolean {
  const c = findCampaign(ctx, id)
  return Boolean(c) && c!.missions.every((mid) => missionDone(s, mid))
}

export function campaignPassed(s: StudyState, ctx: ProgressContext, id: string): boolean {
  const c = findCampaign(ctx, id)
  return Boolean(c) && c!.missions.every((mid) => {
    const mission = findMission(ctx, mid)
    return Boolean(mission) && missionPassed(s, mission!)
  })
}

export type MissionLock = { locked: false } | { locked: true; reason: 'campaign' | 'previous'; campaigns: string[]; previous: string | null }

/** Uma missão abre quando as campanhas exigidas estão concluídas e a missão anterior foi concluída.
 *  Quem já começou a missão continua com acesso. Exercícios de dossiê e amostras de análise de
 *  código estão sempre abertos. */
export function missionLock(s: StudyState, ctx: ProgressContext, id: string): MissionLock {
  const mission = findMission(ctx, id)
  if (!mission || mission.kind !== 'mission' || s.missions[id]?.started) return { locked: false }
  const campaign = findCampaign(ctx, mission.campaign)
  if (!campaign) return { locked: false }
  const pending = campaign.requires.filter((c) => !campaignDone(s, ctx, c))
  if (pending.length) return { locked: true, reason: 'campaign', campaigns: pending, previous: null }
  const previous = mission.order > 1 ? campaign.missions[mission.order - 2] : undefined
  if (previous && !missionDone(s, previous)) return { locked: true, reason: 'previous', campaigns: [], previous }
  return { locked: false }
}

export const isMissionUnlocked = (s: StudyState, ctx: ProgressContext, id: string): boolean => !missionLock(s, ctx, id).locked

/* XP */

/** Atividades de uma missão que rendem XP próprio (as de código rendem o XP do desafio). */
const paying = (mission: MissionSpec) => mission.activities.filter((a) => a.kind !== 'spot')

/** XP máximo de uma missão (atividades próprias e bônus de conclusão), sem o dos desafios de código. */
/** XP por etapa e por conclusão, conforme o tipo de missão. */
const xpOf = (kind: MissionSpec['kind']) => (kind === 'dossier' ? DOSSIER_XP : kind === 'review' ? REVIEW_XP : MISSION_XP)

export function missionMaxXp(mission: MissionSpec): number {
  const xp = xpOf(mission.kind)
  return paying(mission).length * xp.activity + xp.passed
}

export function missionXp(s: StudyState, mission: MissionSpec): number {
  const m = s.missions[mission.id]
  if (!m) return 0
  const xp = xpOf(mission.kind)
  const credited = paying(mission).filter((a) => m.credited.includes(a.id)).length
  return credited * xp.activity + (missionPassed(s, mission) ? xp.passed : 0)
}

/** XP de campanhas, dossiês, aulas dos submódulos e revisões de arquitetura. */
export function learningXp(s: StudyState, ctx: ProgressContext): number {
  let xp = 0
  for (const mission of ctx.missions) {
    xp += missionXp(s, mission)
    if (mission.kind === 'dossier' && s.dossiers[mission.id]) xp += DOSSIER_XP.read
  }
  xp += ctx.lessons.filter((id) => s.lessons[id]).length * LESSON_XP
  for (const { id } of ctx.architect) {
    const a = s.architect[id]
    if (a?.evaluated) xp += ARCHITECT_XP.review
    if (a?.adrDone) xp += ARCHITECT_XP.adr
  }
  return xp
}

export function maxLearningXp(ctx: ProgressContext): number {
  let xp = 0
  for (const mission of ctx.missions) {
    const dossier = mission.kind === 'dossier'
    xp += paying(mission).length * (dossier ? DOSSIER_XP.activity : MISSION_XP.activity) + (dossier ? DOSSIER_XP.passed + DOSSIER_XP.read : MISSION_XP.passed)
  }
  return xp + ctx.lessons.length * LESSON_XP + ctx.architect.length * (ARCHITECT_XP.review + ARCHITECT_XP.adr)
}

/* Estatísticas para conquistas. Missões e desafios são contados em separado. */

export interface LearningStats {
  missionsStarted: number
  missionsDone: number
  missionsPassed: number
  missionsClean: number
  missionsNoHints: number
  activitiesCredited: number
  /** Atividades creditadas que dependem de autoavaliação (ADR), separadas das corrigidas por regras. */
  selfAssessed: number
  dossiersRead: number
  dossiersPassed: number
  /** Amostras do treino de análise de código concluídas com todas as etapas creditadas. */
  reviewsPassed: number
  campaignsPassed: number
  lessons: number
  architectEvaluated: number
  adrDone: number
  /** Missões passadas por campanha. */
  byCampaign: Record<string, number>
}

export function learningStats(s: StudyState, ctx: ProgressContext): LearningStats {
  const out: LearningStats = {
    missionsStarted: 0,
    missionsDone: 0,
    missionsPassed: 0,
    missionsClean: 0,
    missionsNoHints: 0,
    activitiesCredited: 0,
    selfAssessed: 0,
    dossiersRead: 0,
    dossiersPassed: 0,
    reviewsPassed: 0,
    campaignsPassed: 0,
    lessons: ctx.lessons.filter((id) => s.lessons[id]).length,
    architectEvaluated: 0,
    adrDone: 0,
    byCampaign: {},
  }
  for (const mission of ctx.missions) {
    const m = s.missions[mission.id]
    const passed = missionPassed(s, mission)
    if (mission.kind === 'dossier') {
      if (s.dossiers[mission.id]) out.dossiersRead += 1
      if (passed && s.dossiers[mission.id]) out.dossiersPassed += 1
    } else if (mission.kind === 'review') {
      if (passed) out.reviewsPassed += 1
    } else {
      if (m?.started) out.missionsStarted += 1
      if (m?.done) out.missionsDone += 1
      if (passed) {
        out.missionsPassed += 1
        if (mission.campaign) out.byCampaign[mission.campaign] = (out.byCampaign[mission.campaign] ?? 0) + 1
      }
      if (m?.clean) out.missionsClean += 1
      if (m?.noHints && passed) out.missionsNoHints += 1
    }
    if (m) {
      for (const a of mission.activities) {
        if (a.kind === 'spot' || !m.credited.includes(a.id)) continue
        out.activitiesCredited += 1
        if (a.kind === 'adr') out.selfAssessed += 1
      }
    }
  }
  out.campaignsPassed = ctx.campaigns.filter((c) => campaignPassed(s, ctx, c.id)).length
  for (const { id } of ctx.architect) {
    if (s.architect[id]?.evaluated) out.architectEvaluated += 1
    if (s.architect[id]?.adrDone) out.adrDone += 1
  }
  return out
}

