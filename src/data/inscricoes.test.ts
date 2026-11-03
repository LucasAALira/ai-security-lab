import { describe, expect, it } from 'vitest'
import { INSCRICOES, inscricaoDoDia } from './inscricoes'

describe('inscrições do santuário', () => {
  it('há frases de cada tom, curtas e sem repetição', () => {
    const textos = INSCRICOES.map((i) => i.texto)
    expect(new Set(textos).size).toBe(textos.length)
    for (const tom of ['fogueira', 'batalha', 'vigilia'] as const) {
      expect(INSCRICOES.filter((i) => i.tom === tom).length, tom).toBeGreaterThanOrEqual(6)
    }
    for (const i of INSCRICOES) {
      expect(i.texto.length, i.texto).toBeLessThanOrEqual(70)
      expect(i.texto[0], i.texto).toBe(i.texto[0].toUpperCase())
    }
  })

  it('nenhuma frase empurra quem está cansado a continuar', () => {
    const proibidas = /(não desista|nunca pare|sem desculpa|mais forte que a dor|durma depois|vire a noite|sem dormir)/i
    for (const i of INSCRICOES) expect(i.texto, i.texto).not.toMatch(proibidas)
  })

  it('a frase do dia é estável e muda de um dia para o outro', () => {
    expect(inscricaoDoDia('fogueira', '2026-11-02')).toBe(inscricaoDoDia('fogueira', '2026-11-02'))
    const semana = new Set(['02', '03', '04', '05', '06', '07', '08'].map((d) => inscricaoDoDia('fogueira', `2026-11-${d}`)))
    expect(semana.size).toBeGreaterThan(1)
  })

  it('o deslocamento separa frases do mesmo dia, e o tom é respeitado', () => {
    const batalha = INSCRICOES.filter((i) => i.tom === 'batalha').map((i) => i.texto)
    const quadros = [0, 1, 2, 3].map((n) => inscricaoDoDia('batalha', '2026-11-02', n))
    for (const q of quadros) expect(batalha).toContain(q)
    expect(new Set(quadros).size).toBeGreaterThan(1)
  })

  it('sem dia informado, ainda devolve uma frase do tom', () => {
    expect(INSCRICOES.filter((i) => i.tom === 'fogueira').map((i) => i.texto)).toContain(inscricaoDoDia('fogueira', ''))
  })
})
