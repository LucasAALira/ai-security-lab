import { campaigns, dossiers } from './campaigns'
import { challenges } from './challenges'
import { areas, areaById, curriculumModuleList, lessons, submodules, subById, moduleById } from './curriculum'
import type { AreaId, Platform } from './curriculum'
import type { Level } from './types'

/* Índice da busca global. Tudo é montado a partir dos próprios dados do site, em memória e sem rede:
   a busca funciona offline e não depende de nenhum serviço. */

export type SearchKind = 'área' | 'módulo' | 'submódulo' | 'aula' | 'desafio' | 'missão' | 'caso real'

export const searchKinds: SearchKind[] = ['área', 'módulo', 'submódulo', 'aula', 'desafio', 'missão', 'caso real']

export interface SearchEntry {
  kind: SearchKind
  id: string
  title: string
  /** Onde o item fica (para o aluno se situar). */
  where: string
  area: AreaId | null
  level: Level | null
  platforms: Platform[]
  href: string
  /** Texto pesquisável (sem acentos e em minúsculas). */
  haystack: string
  /** Título normalizado, para dar mais peso a acertos no título. */
  titleNorm: string
}

/** Minúsculas e sem acentos: "Autenticação" e "autenticacao" se encontram. */
export const normalize = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const PLATFORM_TAGS: Platform[] = ['web', 'api', 'android', 'ios', 'ia', 'cicd']
const platformsOfTags = (tags: string[]): Platform[] => {
  const out = PLATFORM_TAGS.filter((p) => tags.includes(p))
  if (tags.includes('supply') && !out.includes('cicd')) out.push('cicd')
  return out.length ? out : ['geral']
}

function entry(e: Omit<SearchEntry, 'haystack' | 'titleNorm'>, body: string): SearchEntry {
  return { ...e, titleNorm: normalize(e.title), haystack: normalize(`${e.title} ${e.where} ${body}`) }
}

function build(): SearchEntry[] {
  const out: SearchEntry[] = []
  for (const a of areas) out.push(entry({ kind: 'área', id: a.id, title: a.title, where: 'Áreas', area: a.id, level: null, platforms: [], href: `/areas/${a.id}` }, a.summary))
  for (const m of curriculumModuleList) {
    out.push(entry({ kind: 'módulo', id: m.id, title: m.title, where: areaById(m.area)?.title ?? '', area: m.area, level: null, platforms: [], href: `/areas/${m.area}/${m.id}` }, m.summary))
  }
  for (const s of submodules) {
    const where = `${areaById(s.area)?.title ?? ''} › ${moduleById(s.module)?.title ?? ''}`
    const href = `/areas/${s.area}/${s.module}/${s.id}`
    out.push(entry({ kind: 'submódulo', id: s.id, title: s.title, where, area: s.area, level: s.level, platforms: s.platforms, href }, s.objective))
    const lesson = lessons[s.id]
    if (lesson) {
      const body = [lesson.context, ...lesson.concept, lesson.validation, ...(lesson.review ?? []).flatMap((r) => [r.front, r.back])].join(' ')
      out.push(entry({ kind: 'aula', id: s.id, title: `Aula: ${s.title}`, where, area: s.area, level: s.level, platforms: s.platforms, href }, body))
    }
  }
  for (const c of challenges) {
    const sub = subById(c.submodule)
    out.push(
      entry(
        { kind: 'desafio', id: c.id, title: c.title, where: sub ? `${areaById(sub.area)?.title ?? ''} › ${sub.title}` : 'Laboratório de código', area: sub?.area ?? null, level: c.level, platforms: platformsOfTags(c.tags), href: `/desafios?desafio=${c.id}` },
        `${c.scenario} ${c.tags.join(' ')} ${c.file}`,
      ),
    )
  }
  for (const camp of campaigns) {
    for (const m of camp.missions) {
      out.push(entry({ kind: 'missão', id: m.id, title: m.title, where: `Campanha ${camp.title}`, area: camp.area as AreaId, level: m.level, platforms: platformsOfTags(m.tags), href: `/campanhas/${camp.id}/${m.id}` }, `${m.objective} ${m.tags.join(' ')} ${m.context.join(' ')}`))
    }
  }
  for (const d of dossiers) {
    out.push(entry({ kind: 'caso real', id: d.id, title: d.title, where: 'Casos reais', area: 'supply', level: null, platforms: platformsOfTags(d.tags), href: `/casos/${d.id}` }, `${d.subtitle} ${d.tags.join(' ')} ${d.summary.join(' ')}`))
  }
  return out
}

export const searchIndex: SearchEntry[] = build()

export interface SearchFilters {
  query?: string
  kind?: SearchKind
  area?: AreaId
  level?: Level
  platform?: Platform
}

/** Todas as palavras da consulta precisam aparecer. Acerto no título vale mais do que no corpo. Sem consulta, só filtra. */
export function search(filters: SearchFilters, index: SearchEntry[] = searchIndex): SearchEntry[] {
  const tokens = normalize(filters.query ?? '').split(/\s+/).filter(Boolean)
  const scored: { e: SearchEntry; score: number; order: number }[] = []
  index.forEach((e, order) => {
    if (filters.kind && e.kind !== filters.kind) return
    if (filters.area && e.area !== filters.area) return
    if (filters.level && e.level !== filters.level) return
    if (filters.platform && !e.platforms.includes(filters.platform)) return
    let score = 0
    for (const t of tokens) {
      if (!e.haystack.includes(t)) return
      score += e.titleNorm.includes(t) ? 3 : 1
    }
    scored.push({ e, score, order })
  })
  return scored.sort((a, b) => b.score - a.score || a.order - b.order).map((x) => x.e)
}
