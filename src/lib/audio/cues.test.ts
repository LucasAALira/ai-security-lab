import { describe, expect, it } from 'vitest'
import { cueLength, cuePeak, cueVoices, CUES, REVERB, type Cue } from './cues'
import { reverbSamples } from './soundscape'

describe('composição dos efeitos', () => {
  it('todo toque tem vozes com tempo, duração e volume sãos', () => {
    for (const cue of CUES) {
      const vozes = cueVoices(cue)
      expect(vozes.length, cue).toBeGreaterThan(0)
      for (const v of vozes) {
        expect(v.at, `${cue}: início`).toBeGreaterThanOrEqual(0)
        expect(v.length, `${cue}: duração`).toBeGreaterThan(0)
        expect(v.volume, `${cue}: volume`).toBeGreaterThan(0)
        expect(v.volume, `${cue}: volume`).toBeLessThanOrEqual(0.25)
        if (v.kind !== 'noise') expect(v.hz, `${cue}: frequência`).toBeGreaterThanOrEqual(20)
        expect(v.kind === 'noise' ? v.hz : v.hz * 5.4, `${cue}: audível`).toBeLessThan(18000)
      }
    }
  })

  it('nenhuma pilha de vozes estoura o ganho dos efeitos', () => {
    for (const cue of CUES) expect(cuePeak(cue), cue).toBeLessThanOrEqual(0.5)
  })

  it('o menu é curto e seco; o chefe é longo e ressoa', () => {
    expect(cueLength('select')).toBeLessThan(0.15)
    expect(cueLength('back')).toBeLessThan(0.2)
    expect(REVERB.select).toBeLessThan(0.1)
    expect(cueLength('boss')).toBeGreaterThan(3)
    expect(cueLength('boss')).toBeLessThan(6)
    expect(REVERB.boss).toBeGreaterThan(REVERB.xp)
  })

  it('o chefe derrotado tem impacto grave, coral e sino', () => {
    const vozes = cueVoices('boss')
    const impacto = vozes.find((v) => v.kind === 'noise' && v.filter === 'lowpass')
    expect(impacto, 'impacto').toBeDefined()
    expect(impacto!.at).toBe(0)
    const coral = vozes.filter((v) => v.kind === 'tone' && v.wave === 'triangle')
    expect(coral.length, 'vozes do coral').toBeGreaterThanOrEqual(4)
    // Lá menor: as vozes são oitavas e terças de lá, nada fora do acorde.
    for (const v of coral) expect([110, 130.81, 164.81, 220, 261.63, 329.63]).toContain(v.hz)
    expect(vozes.filter((v) => v.kind === 'bell').length, 'sinos').toBeGreaterThanOrEqual(1)
  })

  it('a conquista soa como sino, e o item como metal curto', () => {
    expect(cueVoices('medal').some((v) => v.kind === 'bell')).toBe(true)
    expect(cueLength('medal')).toBeGreaterThan(1.5)
    const item = cueVoices('item')
    expect(item[0].kind).toBe('noise')
    expect(cueLength('item')).toBeLessThan(1)
  })

  it('as vozes saem na ordem em que entram', () => {
    for (const cue of CUES) {
      const tempos = cueVoices(cue).map((v) => v.at)
      expect([...tempos].sort((a, b) => a - b), cue).toEqual(tempos)
    }
  })

  it('cada toque tem uma dose de reverberação declarada', () => {
    for (const cue of CUES) {
      expect(REVERB[cue as Cue], cue).toBeGreaterThanOrEqual(0)
      expect(REVERB[cue as Cue], cue).toBeLessThanOrEqual(1)
    }
  })
})

describe('resposta da nave (reverberação)', () => {
  it('decai até o silêncio e cabe entre -1 e 1', () => {
    let semente = 7
    const random = () => ((semente = (semente * 1664525 + 1013904223) >>> 0) / 4294967296)
    const amostras = reverbSamples(8000, 1, random)
    expect(amostras.length).toBe(8000)
    expect(amostras.every((v) => Number.isFinite(v) && Math.abs(v) <= 1)).toBe(true)
    expect(Math.abs(amostras[0])).toBeLessThan(0.05)
    expect(Math.abs(amostras.at(-1)!)).toBeLessThan(0.01)
    const inicio = amostras.slice(400, 1200).reduce((s, v) => s + Math.abs(v), 0)
    const fim = amostras.slice(-800).reduce((s, v) => s + Math.abs(v), 0)
    expect(inicio).toBeGreaterThan(fim * 5)
  })
})
