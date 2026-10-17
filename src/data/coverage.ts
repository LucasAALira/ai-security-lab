import { architectProjects } from './architect'
import { campaigns, dossiers } from './campaigns'
import { challenges } from './challenges'
import { areaIdOfSub } from './curriculum'
import { frameworks, type Framework, type FrameworkItem } from './frameworks'
import type { FrameworkRef } from './types'

/* Matriz de cobertura: para cada item de cada framework registrado, onde o conteúdo do site o trabalha.
   Só entram correspondências declaradas no próprio conteúdo (`frameworks` do desafio, `framework` das referências
   da missão, `frameworks` do dossiê, `refs` das ameaças e do projeto do modo Arquiteto). Nenhuma correspondência é inferida por nome ou por palavra-chave. */

export type SourceKind = 'desafio' | 'missão' | 'dossiê' | 'arquiteto'

export interface CoverageSource {
  kind: SourceKind
  id: string
  title: string
  /** Área do currículo, quando o conteúdo pertence a uma. */
  area: string | null
  href: string
}

export interface CoverageRow {
  framework: Framework
  item: FrameworkItem
  sources: CoverageSource[]
}

function declared(): { ref: FrameworkRef; source: CoverageSource }[] {
  const out: { ref: FrameworkRef; source: CoverageSource }[] = []
  for (const c of challenges) {
    const source: CoverageSource = { kind: 'desafio', id: c.id, title: c.title, area: areaIdOfSub(c.submodule) ?? null, href: `/desafios?desafio=${c.id}` }
    for (const ref of c.frameworks ?? []) out.push({ ref, source })
  }
  for (const campaign of campaigns) {
    for (const m of campaign.missions) {
      const source: CoverageSource = { kind: 'missão', id: m.id, title: m.title, area: campaign.area, href: `/campanhas/${campaign.id}/${m.id}` }
      for (const r of m.refs) if (r.framework) out.push({ ref: r.framework, source })
    }
  }
  for (const d of dossiers) {
    const source: CoverageSource = { kind: 'dossiê', id: d.id, title: d.title, area: 'supply', href: `/casos/${d.id}` }
    for (const ref of d.frameworks ?? []) out.push({ ref, source })
  }
  for (const p of architectProjects) {
    const source: CoverageSource = { kind: 'arquiteto', id: p.id, title: p.title, area: 'arq', href: `/arquiteto/${p.id}` }
    const refs = [...p.components.flatMap((c) => c.threats.flatMap((t) => t.refs ?? [])), ...p.refs.flatMap((r) => (r.framework ? [r.framework] : []))]
    const seen = new Set<string>()
    for (const ref of refs) {
      const key = `${ref.framework}:${ref.id}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ ref, source })
    }
  }
  return out
}

/** Todas as referências declaradas pelo conteúdo, para validação e para a matriz. */
export const declaredRefs = (): FrameworkRef[] => declared().map((d) => d.ref)

/** Uma linha por item registrado, com as fontes que o trabalham (lista vazia = lacuna assumida). */
export function coverageRows(): CoverageRow[] {
  const all = declared()
  const rows: CoverageRow[] = []
  for (const framework of frameworks) {
    for (const item of framework.items) {
      const seen = new Set<string>()
      const sources: CoverageSource[] = []
      for (const d of all) {
        if (d.ref.framework !== framework.id || d.ref.id !== item.id) continue
        const key = `${d.source.kind}:${d.source.id}`
        if (seen.has(key)) continue
        seen.add(key)
        sources.push(d.source)
      }
      rows.push({ framework, item, sources })
    }
  }
  return rows
}
