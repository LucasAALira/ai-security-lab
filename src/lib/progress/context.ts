import type { RemediationCase, StudyModule } from '@/data/types'
import type { CampaignSpec, ChallengeSpec, CurriculumSpec, MissionSpec, ProgressContext } from './types'

/** Deriva o contexto do progresso a partir dos módulos e cenários: trilhas = categorias, na ordem
 *  em que aparecem; pré-requisitos por módulo; porte de cada cenário. */
export function buildContext(
  modules: readonly Pick<StudyModule, 'category' | 'prereqs'>[],
  cases: readonly Pick<RemediationCase, 'size'>[],
  extras: {
    challenges?: readonly ChallengeSpec[]
    bosses?: readonly (readonly number[])[]
    missions?: readonly MissionSpec[]
    campaigns?: readonly CampaignSpec[]
    lessons?: readonly string[]
    architect?: readonly string[]
    curriculum?: CurriculumSpec
  } = {},
): ProgressContext {
  const names = [...new Set(modules.map((m) => m.category))]
  return {
    tracks: names.map((name) => ({
      name,
      modules: modules.flatMap((m, i) => (m.category === name ? [i] : [])),
    })),
    prereqs: modules.map((m) => m.prereqs),
    sizes: cases.map((c) => c.size),
    challenges: [...(extras.challenges ?? [])],
    bosses: modules.map((_, i) => [...(extras.bosses?.[i] ?? [])]),
    missions: [...(extras.missions ?? [])],
    campaigns: [...(extras.campaigns ?? [])],
    lessons: [...(extras.lessons ?? [])],
    architect: [...(extras.architect ?? [])],
    curriculum: extras.curriculum ?? { areas: [], modules: [], subs: [] },
  }
}
