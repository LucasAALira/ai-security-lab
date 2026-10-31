import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { aceitaCor, DESENHOS, escaparBat, escaparSh, escolher, gerarBat, gerarSh, montar, NOMES, principal } from './arte.mjs'

const caminho = (nome) => fileURLToPath(new URL(nome, import.meta.url))
const ler = (nome) => readFileSync(caminho(nome), 'utf8')

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

  it('gera os arquivos de shell e de CMD a partir destes mesmos desenhos', () => {
    expect(ler('arte.sh')).toBe(gerarSh())
    expect(ler('arte.bat')).toBe(gerarBat())
  })
})

describe('desenho em shell (scripts/arte.sh)', () => {
  const rodar = (args, env = {}) =>
    execFileSync('sh', [caminho('arte.sh'), ...args], { encoding: 'utf8', env: { PATH: process.env.PATH, ...env } })

  it('escolhe pelo nome e mostra a inscrição', () => {
    const saida = rodar(['cadeado'])
    const cadeado = escolher('cadeado')
    expect(saida).toContain('AI SECURITY LAB')
    expect(saida).toContain(cadeado.inscricao)
    for (const linha of cadeado.linhas) expect(saida).toContain(linha)
  })

  it('sem terminal, não escreve nenhum código de escape', () => {
    // eslint-disable-next-line no-control-regex
    expect(rodar(['hacker'])).not.toMatch(/\u001B\[/)
  })

  it('com FORCE_COLOR, abre e fecha a cor', () => {
    const saida = rodar(['hacker'], { FORCE_COLOR: '1' })
    expect(saida).toMatch(/\u001B\[38;5;\d+m/)
    expect(saida).toContain('\u001B[0m')
    expect(rodar(['hacker'], { FORCE_COLOR: '1', NO_COLOR: '1' })).not.toMatch(/\u001B\[38/)
    expect(rodar(['hacker'], { FORCE_COLOR: '1', TERM: 'dumb' })).not.toMatch(/\u001B\[38/)
  })

  it('lista os nomes e recusa um desenho inexistente', () => {
    expect(rodar(['--lista']).trim().split('\n')).toEqual(NOMES)
    expect(() => rodar(['nao-existe'])).toThrow()
  })

  it('sorteia sem argumento, sempre dentro da lista', () => {
    const inscricoes = DESENHOS.map((d) => d.inscricao)
    for (let i = 0; i < 5; i++) {
      const saida = rodar([])
      expect(inscricoes.some((t) => saida.includes(t))).toBe(true)
    }
  })

  it('escapa aspas simples do shell sem quebrar o texto', () => {
    expect(escaparSh("d'Ávila")).toBe(`'d'\\''Ávila'`)
  })
})

describe('desenho no Prompt de Comando (scripts/arte.bat)', () => {
  const bat = ler('arte.bat')
  const linhas = bat.split('\r\n')

  it('usa quebra de linha do Windows', () => {
    expect(bat).toContain('\r\n')
    expect(bat.split('\n').every((l, i, todas) => i === todas.length - 1 || l.endsWith('\r'))).toBe(true)
  })

  it('tem um rótulo para cada desenho e nenhum salto sem destino', () => {
    const rotulos = new Set(linhas.filter((l) => l.startsWith(':')).map((l) => l.slice(1).trim().toLowerCase()))
    for (let i = 0; i < DESENHOS.length; i++) {
      expect(rotulos.has(`figura_${i}`), `figura_${i}`).toBe(true)
      expect(rotulos.has(`desenho_${i}`), `desenho_${i}`).toBe(true)
    }
    for (const l of linhas) {
      // Saltos montados em tempo de execução (`call :figura_%ESCOLHA%`) são conferidos pelos rótulos acima.
      const salto = /^\s*(?:goto|call)\s+:([a-z_]+)\s*$/i.exec(l)
      if (!salto || salto[1].toLowerCase() === 'eof') continue
      expect(rotulos.has(salto[1].toLowerCase()), l).toBe(true)
    }
  })

  it('escapa os caracteres que o CMD comeria', () => {
    expect(escaparBat('a&b|c<d>e^f%g')).toBe('a^&b^|c^<d^>e^^f%%g')
    for (const linha of linhas.filter((l) => l.startsWith('echo(') && l.includes('%COR%'))) {
      const texto = linha.replaceAll('%COR%', '').replaceAll('%COR_FIM%', '')
      expect(texto.match(/(?<!\^)[&<>|]/), linha).toBeNull()
    }
  })

  it('leva todos os nomes e todas as linhas de cada desenho', () => {
    for (const d of DESENHOS) {
      expect(bat).toContain(`if /i "%~1"=="${d.nome}"`)
      for (const linha of d.linhas) expect(bat).toContain(escaparBat(linha))
    }
  })
})
