import type { ActivitySpec, CampaignSpec, MissionSpec } from '@/lib/progress'
import type { ActivityContent, CampaignContent, DossierContent, MissionContent } from './types'
import { campaign1 } from './c1'
import { dossiers } from './dossiers'

export * from './types'
export { dossiers } from './dossiers'

/* Campanhas e dossiês. O gabarito do motor de progresso é extraído do próprio conteúdo, então
   texto e correção não têm como divergir: a opção que o texto diz ser a melhor é a que o motor
   corrige como a melhor. */

export const campaigns: CampaignContent[] = [campaign1]

export const campaignById = (id: string): CampaignContent | undefined => campaigns.find((c) => c.id === id)
export const missionContents: MissionContent[] = campaigns.flatMap((c) => c.missions)
export const missionContentById = (id: string): MissionContent | undefined => missionContents.find((m) => m.id === id)
export const dossierById = (id: string): DossierContent | undefined => dossiers.find((d) => d.id === id)

export function toActivitySpec(a: ActivityContent): ActivitySpec {
  switch (a.kind) {
    case 'decide':
      return { id: a.id, kind: 'decide', options: a.options.map((o) => ({ quality: o.quality, flags: o.flags ?? [] })) }
    case 'adr':
      return { id: a.id, kind: 'adr', options: a.options.map((o) => ({ quality: o.quality, flags: o.flags ?? [] })), rubric: a.rubric.length, fields: a.fields.length }
    case 'multi':
      return { id: a.id, kind: 'multi', options: a.options.length, correct: a.correct }
    case 'order':
      return { id: a.id, kind: 'order', items: a.items.length, before: a.before }
    case 'assign':
      return { id: a.id, kind: 'assign', rows: a.rows.length, choices: a.choices.length, accept: a.accept }
    case 'budget':
      return { id: a.id, kind: 'budget', budget: a.budget, costs: a.controls.map((c) => c.cost), covers: a.controls.map((c) => c.covers), critical: a.critical, risks: a.risks.length, mandatory: a.mandatory }
    case 'spot':
      return { id: a.id, kind: 'spot', challenge: a.challenge }
  }
}

export const missionSpecs: MissionSpec[] = [
  ...missionContents.map(
    (m): MissionSpec => ({ id: m.id, kind: 'mission', campaign: m.campaign, order: m.order, activities: m.activities.map(toActivitySpec), clean: m.clean ?? { require: [], forbid: [] }, tags: m.tags }),
  ),
  ...dossiers.map((d): MissionSpec => ({ id: d.id, kind: 'dossier', campaign: null, order: 1, activities: d.exercise.activities.map(toActivitySpec), clean: { require: [], forbid: [] }, tags: d.tags })),
]

export const campaignSpecs: CampaignSpec[] = campaigns.map((c) => ({ id: c.id, requires: c.requires, missions: c.missions.map((m) => m.id) }))
