import { describe, expect, it } from 'vitest'
import { challenges } from './challenges'
import { apiChallenges } from './challenge-packs/api'
import { generalChallenges } from './challenge-packs/general'
import { mobileChallenges } from './challenge-packs/mobile'
import { supplyChallenges } from './challenge-packs/supply'
import { webChallenges } from './challenge-packs/web'
import { areaIdOfSub, subById } from './curriculum'

/* Biblioteca de desafios das áreas novas: contagens mínimas e campos obrigatórios de cada formato. */

const novos = challenges.filter((c) => c.module === null)
const tagged = (tag: string) => novos.filter((c) => c.tags.includes(tag))

describe('biblioteca de desafios das áreas novas', () => {
  it('traz ao menos 42 desafios novos: 12 gerais de código ou configuração, 10 Web, 10 de API e 10 Mobile', () => {
    expect(novos.length).toBeGreaterThanOrEqual(42)
    expect([...supplyChallenges, ...generalChallenges].length).toBeGreaterThanOrEqual(12)
    expect(webChallenges.length).toBeGreaterThanOrEqual(10)
    expect(apiChallenges.length).toBeGreaterThanOrEqual(10)
    expect(mobileChallenges.length).toBeGreaterThanOrEqual(10)
  })

  it('cada pacote usa as etiquetas da sua área (usadas por filtros e conquistas)', () => {
    for (const c of webChallenges) expect(c.tags, c.id).toContain('web')
    for (const c of apiChallenges) expect(c.tags, c.id).toContain('api')
    for (const c of mobileChallenges) {
      expect(c.tags, c.id).toContain('mobile')
      expect(c.tags.some((t) => t === 'android' || t === 'ios'), c.id).toBe(true)
    }
    expect(tagged('web').length).toBeGreaterThanOrEqual(10)
    expect(tagged('api').length).toBeGreaterThanOrEqual(10)
    expect(tagged('mobile').length).toBeGreaterThanOrEqual(10)
  })

  it('o pacote Mobile cobre Android e iOS, com Kotlin, Swift, manifesto e plist', () => {
    expect(mobileChallenges.filter((c) => c.tags.includes('android')).length).toBeGreaterThanOrEqual(3)
    expect(mobileChallenges.filter((c) => c.tags.includes('ios')).length).toBeGreaterThanOrEqual(3)
    const linguagens = new Set(mobileChallenges.map((c) => c.language))
    for (const l of ['kt', 'swift', 'xml', 'plist'] as const) expect(linguagens.has(l), l).toBe(true)
  })

  it('os desafios de API trazem o comportamento esperado, o vulnerável e o corrigido', () => {
    for (const c of apiChallenges) {
      expect(c.behaviors, c.id).toBeDefined()
      for (const parte of ['expected', 'vulnerable', 'fixed'] as const) expect(c.behaviors![parte].length, `${c.id}.${parte}`).toBeGreaterThanOrEqual(2)
    }
  })

  it('cada desafio novo tem finalidade, fronteira de confiança, código corrigido, validação e referências', () => {
    for (const c of novos) {
      expect(c.purpose?.length ?? 0, `${c.id}: finalidade`).toBeGreaterThan(30)
      expect(c.boundary?.length ?? 0, `${c.id}: fronteira de confiança`).toBeGreaterThan(30)
      expect(c.fixedCode?.length ?? 0, `${c.id}: código corrigido`).toBeGreaterThanOrEqual(3)
      expect(c.validation?.length ?? 0, `${c.id}: validação`).toBeGreaterThan(60)
      expect(c.frameworks?.length ?? 0, `${c.id}: referências`).toBeGreaterThanOrEqual(1)
      for (const line of c.fixedCode ?? []) expect(line, c.id).not.toMatch(/[⟦⟧]/)
    }
  })

  it('cada alternativa explica por que serve ou por que não basta', () => {
    for (const c of novos) {
      for (const f of c.fixes) expect(f.feedback.length, `${c.id}: ${f.text.slice(0, 30)}`).toBeGreaterThan(45)
    }
  })

  it('o código corrigido difere do vulnerável (a correção muda algo de fato)', () => {
    for (const c of novos) {
      const antes = c.code.map((l) => l.replace(/\s+/g, ' ').trim()).join('\n')
      const depois = (c.fixedCode ?? []).map((l) => l.replace(/\s+/g, ' ').trim()).join('\n')
      expect(depois, c.id).not.toBe(antes)
    }
  })

  it('cada desafio aponta para um submódulo do currículo que existe e está na área certa', () => {
    for (const c of novos) {
      expect(subById(c.submodule), `${c.id}: submódulo ${c.submodule}`).toBeDefined()
      if (c.tags.includes('mobile')) expect(areaIdOfSub(c.submodule), c.id).toBe('mobile')
      if (c.tags.includes('api')) expect(areaIdOfSub(c.submodule), c.id).toBe('api')
    }
  })

  it('nenhum texto apresenta ofuscação, detecção de root ou pinning como solução universal', () => {
    const universal = /(sempre (use|usar|faça|fazer)|basta (ofuscar|usar pinning|detectar)|resolve (tudo|todos os problemas))/i
    for (const c of novos) {
      for (const f of c.fixes) expect(f.text + ' ' + f.feedback, c.id).not.toMatch(universal)
      expect(c.why, c.id).not.toMatch(universal)
    }
  })
})
