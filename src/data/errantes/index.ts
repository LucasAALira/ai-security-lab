import type { MissionSpec } from '@/lib/progress'
import { toActivitySpec } from '../campaigns'
import { geada } from './e01-geada'
import { peconha } from './e02-peconha'
import type { ErranteSpec } from './types'

/* Guardiões errantes: vilões que não guardam módulo nenhum e aparecem nas Crônicas.
   O combate roda no mesmo motor das missões; cada um vale o XP de uma triagem. */

export const errantes: ErranteSpec[] = [geada, peconha]

export const erranteById = (id: string): ErranteSpec | undefined => errantes.find((e) => e.id === id)

export const ELEMENTOS: Record<ErranteSpec['elemento'], { label: string; cor: string }> = {
  gelo: { label: 'Gelo', cor: 'var(--frost, #8ec6e6)' },
  veneno: { label: 'Veneno', cor: 'var(--venom, #8ec46a)' },
}

/** O gabarito que o motor de progresso usa, sem nenhum texto. */
export const errantSpecs: MissionSpec[] = errantes.map((e) => ({
  id: e.id,
  kind: 'errante',
  campaign: null,
  order: 1,
  activities: e.missao.activities.map(toActivitySpec),
  clean: e.missao.clean ?? { require: [], forbid: [] },
  tags: e.missao.tags,
}))

export type { ErranteSpec }
