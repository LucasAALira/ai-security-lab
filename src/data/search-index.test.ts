import { describe, expect, it } from 'vitest'
import { challenges } from './challenges'
import { areas, submodules } from './curriculum'
import { normalize, search, searchIndex, searchKinds } from './search-index'

describe('busca global', () => {
  it('indexa áreas, módulos, submódulos, desafios, missões e casos reais', () => {
    const kinds = new Set(searchIndex.map((e) => e.kind))
    for (const k of ['área', 'módulo', 'submódulo', 'desafio', 'missão', 'caso real'] as const) expect(kinds.has(k), k).toBe(true)
    expect(searchKinds).toContain('aula')
    expect(searchIndex.filter((e) => e.kind === 'área')).toHaveLength(areas.length)
    expect(searchIndex.filter((e) => e.kind === 'submódulo')).toHaveLength(submodules.length)
    expect(searchIndex.filter((e) => e.kind === 'desafio')).toHaveLength(challenges.length)
  })

  it('cada entrada leva a um endereço interno e não repete (tipo + id)', () => {
    const keys = searchIndex.map((e) => `${e.kind}:${e.id}`)
    expect(new Set(keys).size).toBe(keys.length)
    for (const e of searchIndex) expect(e.href, `${e.kind}:${e.id}`).toMatch(/^\/[a-z]/)
  })

  it('ignora acentos e maiúsculas, e exige todas as palavras', () => {
    expect(normalize('Autenticação')).toBe('autenticacao')
    const a = search({ query: 'AUTENTICACAO' })
    const b = search({ query: 'autenticação' })
    expect(a.length).toBeGreaterThan(0)
    expect(a.map((e) => e.id)).toEqual(b.map((e) => e.id))
    const both = search({ query: 'sql injecao' })
    const only = search({ query: 'sql' })
    expect(both.length).toBeLessThanOrEqual(only.length)
  })

  it('acerto no título vem antes de acerto só no corpo', () => {
    const r = search({ query: 'dados' })
    const hits = r.map((e) => e.titleNorm.includes('dados'))
    expect(hits.some(Boolean) && hits.some((h) => !h)).toBe(true)
    // monotônico: todos os acertos no título aparecem antes dos que só acertam no corpo
    expect(hits.join(',')).toMatch(/^(true,)*(false,?)*$/)
  })

  it('filtros combinam: tipo, área, nível e plataforma', () => {
    for (const e of search({ kind: 'desafio', area: 'mobile' })) {
      expect(e.kind).toBe('desafio')
      expect(e.area).toBe('mobile')
    }
    for (const e of search({ level: 'Avançado' })) expect(e.level).toBe('Avançado')
    const android = search({ platform: 'android', kind: 'desafio' })
    expect(android.length).toBeGreaterThan(2)
    for (const e of android) expect(e.platforms).toContain('android')
  })

  it('consulta sem resultado devolve lista vazia, e sem consulta devolve tudo o que passa nos filtros', () => {
    expect(search({ query: 'zzzzqqqq' })).toEqual([])
    expect(search({})).toHaveLength(searchIndex.length)
  })

  it('um submódulo planejado também é encontrado, marcado pelo submódulo (sem fingir conteúdo)', () => {
    const r = search({ query: 'oficina', kind: 'submódulo' })
    expect(r.length).toBeGreaterThan(0)
  })
})
