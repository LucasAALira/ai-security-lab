import { describe, expect, it } from 'vitest'
import { emptyState, type StudyState } from '@/lib/progress'
import { GEAR, GEAR_IDS, knightGear } from './knight'

/** Estado com as compras pedidas, sem mexer em mais nada. */
function comprou(mudancas: { relicas?: number; tema?: string; escudos?: number } = {}): StudyState {
  const s = emptyState()
  return {
    ...s,
    shop: {
      ...s.shop,
      relics: Array.from({ length: mudancas.relicas ?? 0 }, (_, i) => `r${i}`),
      owned: mudancas.tema ? [mudancas.tema] : [],
    },
    lifetime: { ...s.lifetime, shields: mudancas.escudos ?? 0 },
  }
}

describe('equipamento do cavaleiro', () => {
  it('quem está começando tem só a faca', () => {
    const g = knightGear(emptyState(), 0)
    expect(g.pecas).toEqual(['faca'])
    expect(g.titulo).toBe('Andarilho')
    expect(g.completo).toBe(1)
    expect(g.total).toBe(GEAR.length)
  })

  it('as peças de estudo chegam nos marcos de XP, e não antes', () => {
    for (const peca of GEAR.filter((p) => p.xp !== undefined)) {
      expect(knightGear(emptyState(), peca.xp! - 1).tem(peca.id), `${peca.id} antes do marco`).toBe(false)
      expect(knightGear(emptyState(), peca.xp!).tem(peca.id), `${peca.id} no marco`).toBe(true)
    }
  })

  it('as peças de loja chegam com a compra, sem depender de XP', () => {
    expect(knightGear(comprou({ relicas: 1 }), 0).tem('bracadeiras')).toBe(true)
    expect(knightGear(comprou({ escudos: 1 }), 0).tem('escudo')).toBe(true)
    expect(knightGear(comprou({ tema: 'ashes' }), 0).tem('manto')).toBe(true)
    const nada = knightGear(emptyState(), 0)
    expect(nada.tem('bracadeiras')).toBe(false)
    expect(nada.tem('escudo')).toBe(false)
    expect(nada.tem('manto')).toBe(false)
  })

  it('tema gratuito não conta como compra', () => {
    expect(knightGear(comprou({ tema: 'library' }), 0).tem('manto')).toBe(false)
    expect(knightGear(comprou({ tema: 'dragon' }), 0).tem('manto')).toBe(false)
  })

  it('o escudo guardado agora também vale, não só o histórico', () => {
    const s = emptyState()
    const comEscudo = { ...s, shop: { ...s.shop, shields: 1 } }
    expect(knightGear(comEscudo, 0).tem('escudo')).toBe(true)
  })

  it('a espada longa aposenta a faca', () => {
    const espada = GEAR.find((p) => p.id === 'espada')!
    const antes = knightGear(emptyState(), espada.xp! - 1)
    expect(antes.tem('faca')).toBe(true)
    expect(antes.tem('espada')).toBe(false)
    const depois = knightGear(emptyState(), espada.xp!)
    expect(depois.tem('espada')).toBe(true)
    expect(depois.tem('faca')).toBe(false)
  })

  it('o título acompanha quantas peças já foram conquistadas', () => {
    expect(knightGear(emptyState(), 0).titulo).toBe('Andarilho')
    expect(knightGear(emptyState(), 250).titulo).toBe('Escudeiro')
    expect(knightGear(comprou({ relicas: 1, escudos: 1 }), 800).titulo).toBe('Sentinela')
    const quaseTudo = knightGear(comprou({ relicas: 1, escudos: 1, tema: 'ashes' }), 4000)
    expect(quaseTudo.titulo).toBe('Cavaleiro')
    const tudo = knightGear(comprou({ relicas: 1, escudos: 1, tema: 'ashes' }), 7000)
    expect(tudo.titulo).toBe('Cavaleiro Dracônico')
    expect(tudo.completo).toBe(GEAR.length)
  })

  it('diz qual é a próxima peça e o que falta para ela', () => {
    const inicio = knightGear(emptyState(), 0)
    expect(inicio.proxima?.peca.id).toBe('botas')
    expect(inicio.proxima?.falta).toBe('Faltam 250 XP')
    const comprador = knightGear(comprou(), 250)
    expect(comprador.proxima?.peca.id).toBe('grevas')
    const semCompras = knightGear(emptyState(), 800)
    expect(semCompras.proxima?.peca.id).toBe('bracadeiras')
    expect(semCompras.proxima?.falta).toContain('relíquia')
    expect(knightGear(comprou({ relicas: 1, escudos: 1, tema: 'ashes' }), 7000).proxima).toBeUndefined()
  })

  it('não altera o progresso de quem olha a figura', () => {
    const s = comprou({ relicas: 1 })
    const copia = JSON.parse(JSON.stringify(s))
    knightGear(s, 5000)
    expect(s).toEqual(copia)
  })

  it('toda peça tem nome, história e um caminho declarado', () => {
    expect(new Set(GEAR_IDS).size).toBe(GEAR.length)
    for (const peca of GEAR) {
      expect(peca.nome.length, peca.id).toBeGreaterThan(3)
      expect(peca.lore.length, peca.id).toBeGreaterThan(20)
      if (peca.id !== 'faca') expect(peca.xp !== undefined || peca.compra !== undefined, peca.id).toBe(true)
      if (peca.compra) expect(peca.compra.como, peca.id).toMatch(/[Cc]ompre/)
    }
    // Os marcos de XP sobem na ordem em que as peças são vestidas.
    const marcos = GEAR.filter((p) => p.xp !== undefined).map((p) => p.xp!)
    expect([...marcos].sort((a, b) => a - b)).toEqual(marcos)
  })
})
