import { Blocks, Brain, Globe, Package, Scale, Server, Smartphone, type LucideIcon } from 'lucide-react'
import type { Area, Platform } from '@/data/curriculum'
import { findSub, subProgress, type ProgressContext, type Rollup, type StudyState } from '@/lib/progress'

/* Apoio de interface para a hierarquia Área > Módulo > Submódulo. O cálculo de progresso mora em
   `lib/progress/curriculum.ts`; aqui só há rótulos e a tradução do progresso em um estado legível. */

export type SubStatus = 'planned' | 'new' | 'progress' | 'done'

export const subStatusText: Record<SubStatus, string> = {
  planned: 'Planejado',
  new: 'Novo',
  progress: 'Em andamento',
  done: 'Concluído',
}

export function subStatus(state: StudyState, ctx: ProgressContext, id: string): SubStatus {
  const spec = findSub(ctx, id)
  if (!spec || !spec.available) return 'planned'
  const p = subProgress(state, spec)
  if (!p) return 'planned'
  if (p.complete) return 'done'
  return p.done > 0 || p.practiced ? 'progress' : 'new'
}

export const platformLabel: Record<Platform, string> = {
  web: 'Web',
  api: 'API',
  android: 'Android',
  ios: 'iOS',
  ia: 'IA',
  cicd: 'CI/CD',
  geral: 'Geral',
}

export const areaIcons: Record<Area['icon'], LucideIcon> = {
  globe: Globe,
  server: Server,
  brain: Brain,
  smartphone: Smartphone,
  package: Package,
  blocks: Blocks,
  scale: Scale,
}

/** Porcentagem do que é obrigatório e já foi feito. `null` quando não há nada que possa ser concluído. */
export const rollupPercent = (r: Rollup): number | null => (r.total > 0 ? Math.round((r.done / r.total) * 100) : null)
