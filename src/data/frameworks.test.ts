import { describe, expect, it } from 'vitest'
import { declaredRefs, coverageRows } from './coverage'
import { frameworkById, frameworks, refLabel, resolveRef } from './frameworks'

describe('registro de frameworks', () => {
  it('cada entrada tem edição, endereço https oficial, data de revisão e forma de verificação', () => {
    const ids = frameworks.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of frameworks) {
      expect(f.edition.length, f.id).toBeGreaterThan(0)
      expect(f.url, f.id).toMatch(/^https:\/\//)
      expect(f.reviewed, f.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(f.verification.length, f.id).toBeGreaterThan(30)
      const itemIds = f.items.map((i) => i.id)
      expect(new Set(itemIds).size, f.id).toBe(itemIds.length)
      for (const i of f.items) expect(i.title.length, `${f.id} ${i.id}`).toBeGreaterThan(2)
    }
  })

  it('as listas completas têm o número de itens da edição citada', () => {
    expect(frameworkById('owasp-top10')!.items).toHaveLength(10)
    expect(frameworkById('owasp-api-top10')!.items).toHaveLength(10)
    expect(frameworkById('owasp-mobile-top10')!.items).toHaveLength(10)
    expect(frameworkById('owasp-llm-top10')!.items).toHaveLength(10)
    expect(frameworkById('masvs')!.items).toHaveLength(8)
  })

  it('toda referência do conteúdo (desafios, missões, dossiês) resolve para um item verificado', () => {
    const refs = declaredRefs()
    expect(refs.length).toBeGreaterThan(50)
    for (const ref of refs) expect(resolveRef(ref), `${ref.framework} ${ref.id}`).toBeDefined()
  })

  it('o rótulo mostra a edição e o título do item', () => {
    expect(refLabel({ framework: 'owasp-top10', id: 'A01' })).toBe('OWASP Top 10:2025 · A01 Broken Access Control')
    expect(refLabel({ framework: 'cwe', id: 'CWE-79' })).toContain('Cross-site Scripting')
    expect(refLabel({ framework: 'nao-existe', id: 'X' })).toBe('nao-existe X')
  })

  it('a matriz traz uma linha por item registrado e assume as lacunas, sem preencher', () => {
    const rows = coverageRows()
    expect(rows.length).toBe(frameworks.reduce((n, f) => n + f.items.length, 0))
    const a03 = rows.find((r) => r.framework.id === 'owasp-top10' && r.item.id === 'A03')!
    expect(a03.sources.some((s) => s.kind === 'missão')).toBe(true)
    expect(a03.sources.some((s) => s.kind === 'desafio')).toBe(true)
    // A10 e M7 ainda não têm conteúdo: a matriz mostra a lacuna, não inventa cobertura
    expect(rows.find((r) => r.framework.id === 'owasp-top10' && r.item.id === 'A10')!.sources).toEqual([])
    for (const r of rows) {
      const keys = r.sources.map((s) => `${s.kind}:${s.id}`)
      expect(new Set(keys).size).toBe(keys.length)
    }
  })
})
