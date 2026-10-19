import { additionalArchitectProjects } from './extra-scenarios'
import type { ArchitectSpec } from '@/lib/progress'
import { appEBackend } from './app-e-backend'
import { contaMulticanal } from './conta-multicanal'
import { lojaWebApi } from './loja-web-api'
import type { ArchitectProject } from './types'

export * from './types'
export { ADR_FIELDS } from './adr'

/* Projetos do modo Arquiteto de Segurança, do mais focado ao mais amplo. */
export const architectProjects: ArchitectProject[] = [lojaWebApi, appEBackend, contaMulticanal, ...additionalArchitectProjects]

export const architectById = (id: string): ArchitectProject | undefined => architectProjects.find((p) => p.id === id)

/** Gabarito do motor, extraído do conteúdo: o texto e a correção não têm como divergir. */
export function toArchitectSpec(p: ArchitectProject): ArchitectSpec {
  const where = new Map<string, { component: string; threat: number }>()
  for (const c of p.components) c.threats.forEach((t, i) => where.set(t.id, { component: c.id, threat: i }))
  return {
    id: p.id,
    components: p.components.map((c) => ({ id: c.id, threats: c.threats.map((t) => ({ real: t.real, critical: t.critical })) })),
    controls: p.controls.map((c) => ({
      places: [...c.places],
      mitigates: c.mitigates.map((id) => where.get(id)).filter((r): r is { component: string; threat: number } => Boolean(r)),
      mandatory: c.mandatory,
      cost: c.cost,
      complexity: c.complexity,
    })),
    budget: p.budget,
    complexity: p.complexity,
    rubric: p.adr.rubric.length,
    fields: p.adr.fields.length,
  }
}

export const architectSpecs: ArchitectSpec[] = architectProjects.map(toArchitectSpec)
