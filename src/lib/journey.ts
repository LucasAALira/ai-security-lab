import { campaignById, dossierById, missionContentById } from '@/data/campaigns'
import { challengeById } from '@/data/challenges'
import { modules } from '@/data/modules'
import { describeObjective } from '@/lib/objective-text'
import { CHALLENGE_XP, findMission, missionMaxXp, missionXp, resumePoint, type Objective, type ProgressContext, type Resume, type StudyState } from '@/lib/progress'

/** O que a página inicial mostra como "missão atual". Tudo vem do progresso salvo e do conteúdo: nada é inventado. */
export interface Journey {
  /** De onde vem: algo começado e não terminado, o próximo passo da trilha, ou a primeira missão. */
  kind: 'resume' | 'next' | 'first' | 'done'
  /** Rótulo curto acima do título ("Missão em andamento"...). */
  label: string
  title: string
  description: string
  /** Duração estimada, só quando o conteúdo informa. */
  minutes: number | null
  /** XP que ainda pode ser ganho aqui, só quando é calculável. */
  xp: number | null
  to: string
  cta: string
  /** Contexto extra (campanha, módulo...). */
  context: string | null
}

const firstSentence = (text: string, max = 180) => {
  const one = text.split(/(?<=[.!?])\s/)[0] ?? text
  return one.length > max ? `${one.slice(0, max - 1).trimEnd()}…` : one
}

/** Quem nunca registrou nada: nenhum evento, nenhum XP. */
export const isNewcomer = (s: StudyState, xp: number) => xp === 0 && s.events.length === 0

/** Missão aberta e não terminada, mesmo sem nenhuma resposta ainda (só "Começar a missão"). A mais recente vence. */
function startedMission(s: StudyState, ctx: ProgressContext): Resume | null {
  let best: { id: string; day: string } | null = null
  for (const m of ctx.missions) {
    const st = s.missions[m.id]
    if (!st?.started || st.done) continue
    if (!best || st.started > best.day) best = { id: m.id, day: st.started }
  }
  return best ? { kind: 'mission', id: best.id } : null
}

export function journeyOf(s: StudyState, ctx: ProgressContext, objective: Objective, xp: number): Journey {
  const point = resumePoint(s, ctx) ?? startedMission(s, ctx)
  if (point?.kind === 'mission') {
    const spec = findMission(ctx, point.id)
    const left = spec ? Math.max(0, missionMaxXp(spec) - missionXp(s, spec)) : null
    if (spec?.kind === 'dossier') {
      const d = dossierById(point.id)
      if (d)
        return {
          kind: 'resume',
          label: 'Simulação em andamento',
          title: d.exercise.title,
          description: firstSentence(d.exercise.objective),
          minutes: null,
          xp: left || null,
          to: `/casos/${d.id}/simulacao`,
          cta: 'Continuar jornada',
          context: `Caso real: ${d.title}`,
        }
    } else {
      const m = missionContentById(point.id)
      if (m)
        return {
          kind: 'resume',
          label: 'Missão em andamento',
          title: m.title,
          description: firstSentence(m.objective),
          minutes: m.minutes,
          xp: left || null,
          to: `/campanhas/${m.campaign}/${m.id}`,
          cta: 'Continuar jornada',
          context: campaignById(m.campaign)?.title ?? null,
        }
    }
  }
  if (point?.kind === 'challenge') {
    const c = challengeById(point.id)
    const st = s.challenges[point.id]
    if (c) {
      const left = (st?.identified ? 0 : CHALLENGE_XP.identify) + (st?.fixed ? 0 : CHALLENGE_XP.fix)
      return {
        kind: 'resume',
        label: 'Provação em andamento',
        title: c.title,
        description: firstSentence(c.scenario.replace(/`/g, '')),
        minutes: null,
        xp: left || null,
        to: `/desafios?desafio=${c.id}`,
        cta: 'Continuar jornada',
        context: 'Laboratório de código',
      }
    }
  }

  const view = describeObjective(objective)
  const newcomer = isNewcomer(s, xp)
  const module = objective.kind === 'step' || objective.kind === 'boss' ? modules[objective.module] : undefined
  const reward = 'xp' in objective && objective.xp > 0 ? objective.xp : null
  if (objective.kind === 'done')
    return { kind: 'done', label: 'Trilha completa', title: view.title, description: view.detail, minutes: null, xp: null, to: view.to, cta: 'Abrir o relicário', context: null }
  return {
    kind: newcomer ? 'first' : 'next',
    label: newcomer ? 'Sua primeira missão' : 'Próximo passo da jornada',
    title: view.title,
    description: module ? module.summary : view.detail,
    minutes: null,
    xp: reward,
    to: view.to,
    cta: newcomer ? 'Começar jornada' : 'Continuar jornada',
    context: module ? `Módulo ${module.number} · ${module.title}` : null,
  }
}
