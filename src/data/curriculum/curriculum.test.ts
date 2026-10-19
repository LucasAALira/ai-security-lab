import { describe, expect, it } from 'vitest'
import { architectById } from '../architect'
import { campaigns } from '../campaigns'
import { challenges } from '../challenges'
import { modules as classicModules } from '../modules'
import { progressContext } from '../progress-context'
import { ID_PATTERN } from '@/lib/progress'
import { integrators } from './integrators'
import { areas, curriculumModuleList, curriculumSpec, lessonOf, lessons, subById, submodules } from '.'

const unique = (list: string[]) => new Set(list).size === list.length

/** Ordenação topológica: `true` quando não há ciclo nas recomendações. */
function acyclic(nodes: { id: string; recommends: string[] }[]): boolean {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const state = new Map<string, 1 | 2>()
  const visit = (id: string): boolean => {
    if (state.get(id) === 2) return true
    if (state.get(id) === 1) return false
    state.set(id, 1)
    for (const next of byId.get(id)?.recommends ?? []) if (!visit(next)) return false
    state.set(id, 2)
    return true
  }
  return nodes.every((n) => visit(n.id))
}

describe('hierarquia Área > Módulo > Submódulo', () => {
  it('tem as oito áreas pedidas, na ordem do menu', () => {
    expect(areas.map((a) => a.id)).toEqual(['web', 'api', 'ia', 'mobile', 'supply', 'arq', 'rev', 'gov'])
  })

  it('ids únicos, no formato aceito pelo progresso salvo', () => {
    for (const ids of [areas.map((a) => a.id), curriculumModuleList.map((m) => m.id), submodules.map((s) => s.id)]) {
      expect(unique(ids)).toBe(true)
      expect(ids.every((id) => ID_PATTERN.test(id))).toBe(true)
    }
    // Um id de submódulo nunca pode ser igual ao de um módulo: os dois aparecem em endereços.
    const all = [...curriculumModuleList.map((m) => m.id), ...submodules.map((s) => s.id)]
    expect(unique(all)).toBe(true)
  })

  it('toda referência aponta para algo que existe e a árvore é consistente', () => {
    for (const area of areas) for (const id of area.modules) expect(curriculumModuleList.find((m) => m.id === id)?.area).toBe(area.id)
    for (const m of curriculumModuleList) {
      expect(areas.some((a) => a.id === m.area)).toBe(true)
      expect(m.subs.length).toBeGreaterThan(0)
      for (const id of m.subs) {
        const sub = subById(id)
        expect(sub, `submódulo ${id}`).toBeDefined()
        expect(sub!.module).toBe(m.id)
        expect(sub!.area).toBe(m.area)
      }
      for (const r of m.recommends) expect(curriculumModuleList.some((x) => x.id === r), `${m.id} recomenda ${r}`).toBe(true)
    }
    for (const s of submodules) {
      expect(curriculumModuleList.some((m) => m.id === s.module && m.subs.includes(s.id))).toBe(true)
      for (const r of s.recommends) expect(subById(r), `${s.id} recomenda ${r}`).toBeDefined()
      expect(s.title.length).toBeGreaterThan(2)
      expect(s.objective.length).toBeGreaterThan(20)
    }
  })

  it('pré-requisitos recomendados não formam ciclo', () => {
    expect(acyclic(curriculumModuleList)).toBe(true)
    expect(acyclic(submodules)).toBe(true)
  })

  it('os módulos clássicos são preservados por mapeamento explícito, sem renumerar', () => {
    const legacy = submodules.filter((s) => s.legacy !== null)
    expect(legacy.map((s) => s.legacy).sort()).toEqual(classicModules.map((m) => m.id))
    const byIndex = Object.fromEntries(legacy.map((s) => [s.legacy, s.id]))
    expect(byIndex).toEqual({
      0: 'ia-owasp-llm',
      1: 'ia-injecao-direta',
      2: 'ia-mitre-atlas',
      3: 'ia-red-teaming',
      4: 'gov-nist-rmf',
      5: 'gov-iso-42001',
      6: 'gov-lgpd',
      7: 'gov-ai-act',
      8: 'mob-engenharia-reversa',
    })
  })

  it('desafios e aulas só apontam para submódulos que existem', () => {
    for (const c of challenges) expect(subById(c.submodule), `desafio ${c.id}`).toBeDefined()
    for (const id of Object.keys(lessons)) expect(subById(id), `aula ${id}`).toBeDefined()
  })

  it('submódulo sem conteúdo é "planejado" e fica fora do progresso', () => {
    for (const spec of curriculumSpec.subs) {
      const sub = subById(spec.id)!
      const hasContent = sub.legacy !== null || Boolean(lessonOf(sub.id)) || challenges.some((c) => c.submodule === sub.id)
      expect(spec.available).toBe(hasContent)
      if (!spec.available) {
        expect(spec.lesson).toBe(false)
        expect(spec.challenges).toEqual([])
      }
    }
  })

  it('o contexto do progresso usa a mesma hierarquia', () => {
    expect(progressContext.curriculum).toBe(curriculumSpec)
    expect(progressContext.curriculum.subs).toHaveLength(submodules.length)
  })
})

describe('integradores', () => {
  it('todo módulo com conteúdo tem um integrador que existe', () => {
    for (const m of curriculumModuleList) {
      const i = m.integrator
      expect(i, m.id).not.toBeNull()
      if (!i) continue
      if (i.kind === 'challenge') expect(challenges.some((c) => c.id === i.id), `${m.id} → ${i.id}`).toBe(true)
      if (i.kind === 'mission') expect(campaigns.some((c) => c.missions.some((x) => x.id === i.id)), `${m.id} → ${i.id}`).toBe(true)
      if (i.kind === 'architect') expect(architectById(i.id), `${m.id} → ${i.id}`).toBeDefined()
    }
  })

  it('não há integrador para módulo que não existe', () => {
    const ids = new Set(curriculumModuleList.map((m) => m.id))
    for (const id of Object.keys(integrators)) expect(ids.has(id), id).toBe(true)
  })

  it('cada módulo tem ao menos uma aula escrita ou um submódulo clássico', () => {
    for (const m of curriculumModuleList) {
      const subs = submodules.filter((s) => s.module === m.id)
      expect(subs.some((s) => s.legacy !== null || lessonOf(s.id)), m.id).toBe(true)
    }
  })
})
