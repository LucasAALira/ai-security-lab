import { describe, expect, it } from 'vitest'
import { aceitaCor, DESENHOS, escolher, montar, NOMES, principal } from './arte.mjs'

describe('desenho do terminal', () => {
  it('cada figura tem nome único, inscrição e no máximo 46 colunas', () => {
    expect(DESENHOS.length).toBeGreaterThanOrEqual(8)
    expect(new Set(NOMES).size).toBe(NOMES.length)
    for (const d of DESENHOS) {
      expect(d.nome, d.nome).toMatch(/^[a-z]+$/)
      expect(d.linhas.length, d.nome).toBeGreaterThanOrEqual(6)
      expect(d.inscricao.length, d.nome).toBeGreaterThan(25)
      for (const linha of d.linhas) expect(linha.length, `${d.nome}: ${linha}`).toBeLessThanOrEqual(46)
      expect(['brasa', 'ouro', 'titanio']).toContain(d.cor)
    }
  })

  it('o sorteio alcança a primeira e a última figura e nunca sai da lista', () => {
    expect(escolher(undefined, 0)).toBe(DESENHOS[0])
    expect(escolher(undefined, 0.999999)).toBe(DESENHOS[DESENHOS.length - 1])
    for (const v of [0, 0.25, 0.5, 0.75, 0.9999]) expect(DESENHOS).toContain(escolher(undefined, v))
    // valores fora da faixa não quebram o sorteio
    expect(DESENHOS).toContain(escolher(undefined, 1))
    expect(DESENHOS).toContain(escolher(undefined, -1))
  })

  it('escolhe pelo nome quando ele é informado', () => {
    expect(escolher('cadeado').nome).toBe('cadeado')
    expect(escolher('inexistente')).toBeUndefined()
  })

  it('respeita NO_COLOR, TERM=dumb e a ausência de terminal', () => {
    expect(aceitaCor({}, true)).toBe(true)
    expect(aceitaCor({}, false)).toBe(false)
    expect(aceitaCor({ NO_COLOR: '1' }, true)).toBe(false)
    expect(aceitaCor({ TERM: 'dumb' }, true)).toBe(false)
    expect(aceitaCor({ FORCE_COLOR: '1' }, false)).toBe(true)
  })

  it('sem cor, a saída não tem nenhum código de escape', () => {
    const texto = montar(escolher('hacker'), { cor: false, versao: '9.9.9' })
    // eslint-disable-next-line no-control-regex
    expect(texto).not.toMatch(/\u001B\[/)
    expect(texto).toContain('AI SECURITY LAB')
    expect(texto).toContain('versão 9.9.9')
    expect(texto).toContain(escolher('hacker').inscricao)
  })

  it('com cor, abre e fecha todas as sequências', () => {
    const texto = montar(escolher('cadeado'), { cor: true })
    const aberturas = texto.match(/\u001B\[38;5;\d+m/g) ?? []
    const fechamentos = texto.match(/\u001B\[0m/g) ?? []
    expect(aberturas.length).toBe(fechamentos.length)
    expect(aberturas.length).toBeGreaterThan(0)
  })

  it('a linha de comando lista os nomes e avisa quando o desenho não existe', () => {
    expect(principal(['--lista'], {}).split('\n')).toEqual(NOMES)
    expect(principal(['nao-existe'], {})).toContain('Desenho desconhecido')
    expect(principal([], { NO_COLOR: '1' })).toContain('AI SECURITY LAB')
  })
})
