import { describe, expect, it } from 'vitest'
import { CASE_COUNT, MODULE_COUNT, QUESTIONS_PER_MODULE, READS_PER_MODULE } from '@/lib/progress'
import { materias } from './materias'
import { modules } from './modules'
import { pentestReadingHtml } from './pentest'
import { remediationCases } from './scenarios'

describe('módulos', () => {
  it('seguem as constantes do progresso', () => {
    expect(modules).toHaveLength(MODULE_COUNT)
    expect(remediationCases).toHaveLength(CASE_COUNT)
    modules.forEach((m, i) => {
      expect(m.id).toBe(i)
      expect(m.parts).toHaveLength(READS_PER_MODULE)
      expect(m.questions).toHaveLength(QUESTIONS_PER_MODULE)
      expect(m.prereqs.every((p) => Number.isInteger(p) && p >= 0 && p < i)).toBe(true) // só módulos anteriores
    })
    expect(new Set(modules.map((m) => m.slug)).size).toBe(MODULE_COUNT)
  })

  it('cada questão tem gabarito válido e um comentário por alternativa', () => {
    for (const m of modules) {
      for (const q of m.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2)
        expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length).toBe(true)
        expect(q.feedback).toHaveLength(q.options.length)
        expect(q.hint.length).toBeGreaterThan(0)
      }
    }
  })

  it('cada cenário de correção tem gabarito válido e plano de solução', () => {
    expect(new Set(remediationCases.map((c) => c.id)).size).toBe(CASE_COUNT)
    for (const c of remediationCases) {
      expect(c.correct).toBeGreaterThanOrEqual(0)
      expect(c.correct).toBeLessThan(c.options.length)
      expect(c.feedback).toHaveLength(c.options.length)
      expect(c.solution.length).toBeGreaterThan(0)
      expect(['Pequena', 'Média', 'Grande']).toContain(c.size)
    }
  })
})

describe('matérias', () => {
  it('há uma matéria por módulo, na mesma ordem, com as três leituras', () => {
    expect(materias.map((m) => m.slug)).toEqual(modules.map((m) => m.slug))
    materias.forEach((m, i) => {
      expect(m.moduleIndex).toBe(i)
      expect(m.number).toBe(modules[i].number)
      expect(m.sections.map((s) => s.id)).toEqual(['compreender', 'conectar', 'aplicar'])
    })
  })
})

/** Todo HTML do repositório é renderizado como confiável (TrustedHtml). Este teste barra
 *  o que não deveria existir nele: scripts, manipuladores de evento e destinos de link inseguros. */
describe('HTML confiável', () => {
  const pages: Array<[string, string]> = [
    ['pentest', pentestReadingHtml],
    ...materias.flatMap((m): Array<[string, string]> => [
      ...m.sections.map((s): [string, string] => [`${m.slug}#${s.id}`, s.html]),
      [`${m.slug} pesquisa`, m.research.html],
      [`${m.slug} bibliografia`, m.bibliography.html],
    ]),
  ]

  it.each(pages)('%s não tem script, iframe, evento inline nem link inseguro', (_name, html) => {
    expect(html).not.toMatch(/<\s*(script|iframe|object|embed|style|form|input|button|img|svg|link|meta|base)\b/i)
    expect(html).not.toMatch(/\son[a-z]+\s*=/i)
    expect(html).not.toMatch(/javascript:|data:text|srcdoc/i)
    for (const [, tag] of html.matchAll(/<a\b([^>]*)>/gi)) {
      const href = /href="([^"]*)"/.exec(tag)?.[1] ?? ''
      expect(href, `href inválido em ${tag}`).toMatch(/^(#[\w-]+|https:\/\/[^\s"]+)$/)
      if (href.startsWith('https://')) {
        expect(tag).toMatch(/target="_blank"/)
        expect(tag).toMatch(/rel="[^"]*noopener[^"]*"/)
      }
    }
  })

  it('os atalhos internos da leitura de pentest apontam para âncoras que existem', () => {
    const ids = new Set([...pentestReadingHtml.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
    for (const [, target] of pentestReadingHtml.matchAll(/href="#([^"]+)"/g)) {
      expect(ids.has(target), `âncora #${target} sem destino`).toBe(true)
    }
  })
})
