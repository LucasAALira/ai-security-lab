import type { ArchitectControl, ArchitectProject, Criterion, Stride } from '@/data/architect'
import type { ArchitectState } from '@/lib/progress'

export const STRIDE_NAMES: Record<Stride, string> = {
  S: 'Falsificação de identidade',
  T: 'Adulteração',
  R: 'Repúdio',
  I: 'Vazamento de informação',
  D: 'Negação de serviço',
  E: 'Elevação de privilégio',
}

export const CRITERIA: { id: Criterion; label: string }[] = [
  { id: 'seguranca', label: 'Segurança' },
  { id: 'privacidade', label: 'Privacidade' },
  { id: 'disponibilidade', label: 'Disponibilidade' },
  { id: 'experiencia', label: 'Experiência do usuário' },
]

export const STAGES = [
  { id: 'projeto', label: 'Projeto' },
  { id: 'analise', label: 'Análise' },
  { id: 'avaliacao', label: 'Avaliação' },
  { id: 'adr', label: 'ADR' },
  { id: 'revisao', label: 'Revisão' },
] as const
export type StageId = (typeof STAGES)[number]['id']

/** Revisão comentada: depois da aprovação ou de três avaliações (ela mostra as respostas). */
export const REVIEW_AFTER_RUNS = 3

/** Controles aplicados, com o componente onde foram aplicados. */
export function appliedControls(p: ArchitectProject, st: ArchitectState | undefined): { control: ArchitectControl; component: string }[] {
  if (!st) return []
  return Object.entries(st.applied).flatMap(([component, list]) => list.flatMap((i) => (p.controls[i] ? [{ control: p.controls[i], component }] : [])))
}

/** Soma dos efeitos dos controles aplicados por critério (perfil da solução, e não nota). */
export function profile(p: ArchitectProject, st: ArchitectState | undefined): Record<Criterion, number> {
  const out: Record<Criterion, number> = { seguranca: 0, privacidade: 0, disponibilidade: 0, experiencia: 0 }
  for (const { control } of appliedControls(p, st)) for (const c of CRITERIA) out[c.id] += control.effects[c.id] ?? 0
  return out
}

export const signed = (n: number) => (n > 0 ? `+${n}` : String(n))

export const componentLabel = (p: ArchitectProject, id: string) => p.components.find((c) => c.id === id)?.label ?? id
