import { describe, expect, it } from 'vitest'
import { missionContentById } from '@/data/campaigns'
import { challengeById } from '@/data/challenges'
import { progressContext as ctx } from '@/data/progress-context'
import { journeyOf } from './journey'
import { applyAction, cleanState, missionMaxXp, nextObjective, summary, type StudyState } from './progress'

const now = new Date(2026, 9, 17, 12)
const view = (s: StudyState) => journeyOf(s, ctx, nextObjective(s, ctx), summary(s, ctx).xp)

describe('missão atual da página inicial', () => {
  it('quem chega pela primeira vez recebe uma primeira missão clara, sem números inventados', () => {
    const j = view(cleanState({}))
    expect(j.kind).toBe('first')
    expect(j.label).toBe('Sua primeira missão')
    expect(j.cta).toBe('Começar jornada')
    expect(j.minutes).toBeNull()
    expect(j.to).toBe('/modulo/0')
  })

  it('quem parou no meio de uma missão retoma a missão real, com a duração e o XP que ainda faltam', () => {
    const mission = ctx.missions.find((m) => m.kind === 'mission' && m.order === 1 && m.campaign === ctx.campaigns[0].id)!
    const content = missionContentById(mission.id)!
    // "Começar a missão" na interface só avança a etapa (missionGo); ainda não há resposta registrada.
    const r = applyAction(cleanState({}), { type: 'missionGo', mission: mission.id, stage: 1 }, ctx, now)
    expect(r.changed).toBe(true)
    const j = view(r.state)
    expect(j.kind).toBe('resume')
    expect(j.title).toBe(content.title)
    expect(j.minutes).toBe(content.minutes)
    expect(j.xp).toBe(missionMaxXp(mission))
    expect(j.cta).toBe('Continuar jornada')
    expect(j.to).toBe(`/campanhas/${content.campaign}/${content.id}`)
  })

  it('um desafio começado vira a provação em andamento, com o XP restante', () => {
    const spec = ctx.challenges.find((c) => c.module === null)!
    const r = applyAction(cleanState({}), { type: 'identify', challenge: spec.id, lines: spec.vulnerable }, ctx, now)
    const j = view(r.state)
    expect(j.kind).toBe('resume')
    expect(j.title).toBe(challengeById(spec.id)!.title)
    expect(j.xp).toBe(15)
  })
})
