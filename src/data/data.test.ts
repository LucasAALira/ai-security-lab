import { describe, expect, it } from 'vitest'
import { BOSS_QUESTIONS, CASE_COUNT, FLASHCARD_ID, HINTS_PER_CHALLENGE, ID_PATTERN, MODULE_COUNT, QUESTIONS_PER_MODULE, READS_PER_MODULE } from '@/lib/progress'
import { bosses } from './bosses'
import { challenges } from './challenges'
import { flashcards } from './flashcards'
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

/** Os textos de estudo: cada matéria precisa ser explicada com profundidade, não só listada. Os pisos abaixo
 *  não medem qualidade, mas impedem que uma edição futura volte a deixar uma matéria em poucas linhas. */
describe('textos de estudo', () => {
  const words = (html: string) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' })

  it.each(materias.map((m) => [m.slug, m] as const))('%s: cada leitura tem corpo suficiente e o conjunto passa de 1.400 palavras', (_slug, m) => {
    for (const s of m.sections) {
      expect(words(s.html), `${m.slug}#${s.id}`).toBeGreaterThanOrEqual(300)
      expect(s.html, `${m.slug}#${s.id} sem subtítulos`).toMatch(/<h3>|<dl class="concept-list">/)
    }
    expect(m.sections.reduce((n, s) => n + words(s.html), 0)).toBeGreaterThanOrEqual(1400)
  })

  it.each(materias.map((m) => [m.slug, m] as const))('%s: tem resumo, glossário em ordem alfabética e um quadro "Em palavras simples" ou exemplo', (_slug, m) => {
    expect(m.recap?.length ?? 0).toBeGreaterThanOrEqual(5)
    for (const r of m.recap ?? []) {
      expect(r).not.toMatch(/[<>]/)
      expect(r.length).toBeGreaterThan(40)
    }
    const terms = (m.glossary ?? []).map((g) => g.term)
    expect(terms.length).toBeGreaterThanOrEqual(8)
    expect(new Set(terms.map((t) => t.toLowerCase())).size).toBe(terms.length)
    expect([...terms].sort(collator.compare)).toEqual(terms)
    for (const g of m.glossary ?? []) {
      expect(g.definition.length).toBeGreaterThan(30)
      expect(g.definition).not.toMatch(/[<>]/)
    }
    expect(m.sections.map((s) => s.html).join('\n')).toMatch(/Em palavras simples|Exemplo|Caso didático/)
  })

  it('as tabelas são acessíveis: legenda, cabeçalhos com escopo e região rolável focável', () => {
    let tables = 0
    for (const m of materias) {
      for (const s of m.sections) {
        const found = s.html.match(/<table\b/g)?.length ?? 0
        tables += found
        if (!found) continue
        expect(s.html.match(/<caption>/g)?.length, `${m.slug}#${s.id} sem legenda`).toBe(found)
        expect(s.html.match(/<th scope="(col|row)">/g)?.length ?? 0, `${m.slug}#${s.id} sem escopo`).toBeGreaterThan(0)
        expect(s.html.match(/<th>/g), `${m.slug}#${s.id} cabeçalho sem escopo`).toBeNull()
        expect(s.html.match(/<div class="table-wrap" role="region" aria-label="[^"]+" tabindex="0">/g)?.length, `${m.slug}#${s.id} região`).toBe(found)
      }
    }
    expect(tables).toBeGreaterThan(10)
  })

  it('o resumo de cada etapa (parts) explica a ideia, em vez de listar siglas', () => {
    for (const m of modules) for (const p of m.parts) expect(p.length, `${m.slug}`).toBeGreaterThanOrEqual(150)
  })

  it('o calendário do AI Act cita o regulamento que o alterou e as datas conferidas', () => {
    const ai = materias.find((m) => m.slug === 'eu-ai-act')!
    const text = ai.sections.map((s) => s.html).join('\n')
    expect(text).toContain('2026/1744')
    expect(text).toContain('2 dez 2027')
    expect(text).toContain('2 ago 2028')
    expect(text).toContain('EUR-Lex')
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

describe('desafios de código', () => {
  it('têm identificador estável e válido, sem repetição, e pertencem a um módulo existente', () => {
    expect(new Set(challenges.map((c) => c.id)).size).toBe(challenges.length)
    for (const c of challenges) {
      expect(ID_PATTERN.test(c.id)).toBe(true)
      expect(c.module).toBeGreaterThanOrEqual(0)
      expect(c.module).toBeLessThan(MODULE_COUNT)
      expect(['vuln', 'auth']).toContain(c.kind)
    }
  })

  it('o gabarito sai das marcas do código e nenhuma marca sobra no texto mostrado', () => {
    for (const c of challenges) {
      expect(c.code.length).toBeGreaterThan(3)
      for (const line of c.code) expect(line).not.toMatch(/[⟦⟧]/)
      expect(c.vulnerable.length).toBeGreaterThan(0)
      const all = [...c.vulnerable, ...c.also, ...c.extra]
      expect(new Set(all).size).toBe(all.length) // uma linha tem uma só função
      for (const n of [...all, ...Object.keys(c.notes).map(Number)]) {
        expect(Number.isInteger(n) && n >= 0 && n < c.code.length).toBe(true)
        expect(c.code[n].trim().length).toBeGreaterThan(0) // nunca uma linha em branco
      }
      for (const n of Object.keys(c.notes).map(Number)) expect(all).not.toContain(n) // nota só em linha que não é falha
    }
  })

  it('cada desafio tem correção válida com uma explicação por alternativa e três dicas', () => {
    for (const c of challenges) {
      expect(c.fixes).toHaveLength(4)
      expect(Number.isInteger(c.fix) && c.fix >= 0 && c.fix < c.fixes.length).toBe(true)
      for (const f of c.fixes) {
        expect(f.text.length).toBeGreaterThan(10)
        expect(f.feedback.length).toBeGreaterThan(10)
      }
      expect(c.hints).toHaveLength(HINTS_PER_CHALLENGE)
      expect(new Set(c.hints).size).toBe(HINTS_PER_CHALLENGE)
      expect(c.why.length).toBeGreaterThan(40)
      if (c.extra.length) expect(c.extraNote.length).toBeGreaterThan(40)
      else expect(c.extraNote).toBe('')
    }
  })

  it('a alternativa correta não fica sempre na mesma posição', () => {
    expect(new Set(challenges.map((c) => c.fix)).size).toBeGreaterThanOrEqual(3)
  })

  it('há conteúdo para todas as conquistas: 5 de identificação, 5 de autorização, correções e falha opcional', () => {
    expect(challenges.filter((c) => c.kind === 'vuln').length).toBeGreaterThanOrEqual(5)
    expect(challenges.filter((c) => c.kind === 'auth').length).toBeGreaterThanOrEqual(5)
    expect(challenges.filter((c) => c.extra.length > 0).length).toBeGreaterThanOrEqual(1)
  })

  it('o código não traz segredos reais', () => {
    for (const c of challenges) expect(c.code.join('\n')).not.toMatch(/AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY/)
  })
})

describe('flashcards', () => {
  it('têm cinco cartões por módulo, ids válidos e únicos', () => {
    expect(new Set(flashcards.map((c) => c.id)).size).toBe(flashcards.length)
    for (let i = 0; i < MODULE_COUNT; i++) expect(flashcards.filter((c) => c.module === i)).toHaveLength(5)
    for (const c of flashcards) {
      expect(FLASHCARD_ID.test(c.id)).toBe(true)
      expect(c.id.startsWith(`m${c.module}-`)).toBe(true)
      expect(c.front.trim().endsWith('?')).toBe(true)
      expect(c.back.length).toBeGreaterThan(10)
    }
  })
})

describe('chefes', () => {
  it('há um chefe por módulo, com os cenários esperados e uma explicação por alternativa', () => {
    expect(bosses.map((b) => b.module)).toEqual(Array.from({ length: MODULE_COUNT }, (_, i) => i))
    for (const b of bosses) {
      expect(b.questions).toHaveLength(BOSS_QUESTIONS)
      for (const q of b.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2)
        expect(q.options.length).toBeLessThanOrEqual(4)
        expect(q.correct).toBeGreaterThanOrEqual(0)
        expect(q.correct).toBeLessThan(q.options.length)
        expect(q.feedback).toHaveLength(q.options.length)
        expect(new Set(q.options).size).toBe(q.options.length)
      }
    }
  })

  it('a resposta correta varia de posição', () => {
    const positions = new Set(bosses.flatMap((b) => b.questions.map((q) => q.correct)))
    expect(positions.size).toBeGreaterThanOrEqual(3)
  })
})
