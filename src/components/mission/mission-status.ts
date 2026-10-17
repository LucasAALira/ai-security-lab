import { campaignDone, isMissionUnlocked, missionDone, missionPassed, missionState, type CampaignSpec, type MissionSpec, type ProgressContext, type StudyState } from '@/lib/progress'

export type MissionStatus = 'locked' | 'new' | 'progress' | 'review' | 'passed'

export const statusText: Record<MissionStatus, string> = {
  locked: 'Bloqueada',
  new: 'Nova',
  progress: 'Em andamento',
  review: 'Concluída, com atividades sem crédito',
  passed: 'Aprovada',
}

export function missionStatus(s: StudyState, ctx: ProgressContext, mission: MissionSpec): MissionStatus {
  if (missionPassed(s, mission)) return 'passed'
  if (missionDone(s, mission.id)) return 'review'
  if (!isMissionUnlocked(s, ctx, mission.id)) return 'locked'
  return missionState(s, mission.id).started ? 'progress' : 'new'
}

export function campaignSummary(s: StudyState, ctx: ProgressContext, campaign: CampaignSpec) {
  const missions = campaign.missions.map((id) => ctx.missions.find((m) => m.id === id)).filter((m): m is MissionSpec => Boolean(m))
  const passed = missions.filter((m) => missionPassed(s, m)).length
  return {
    missions,
    total: missions.length,
    passed,
    complete: missions.length > 0 && passed === missions.length,
    /** Campanhas exigidas que ainda não foram concluídas. */
    pendingRequirements: campaign.requires.filter((c) => !campaignDone(s, ctx, c)),
  }
}
