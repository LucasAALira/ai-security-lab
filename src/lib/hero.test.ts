import { describe, expect, it } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { applyAction, cleanState, emptyState, type StudyState } from '@/lib/progress'
import { DEFAULT_HERO, HEROIS, HERO_ANTIGOS, HERO_IDS, heroOf, isHeroId, normalizeHero } from './hero'

const ctx = progressContext
const agora = new Date(2026, 10, 2, 12)

describe('classes do santuário', () => {
  it('cada caminho tem nome, lema, ficha e três trajes', () => {
    expect(HEROIS.length).toBe(10)
    expect(new Set(HERO_IDS).size).toBe(HEROIS.length)
    for (const h of HEROIS) {
      expect(h.nome.length, h.id).toBeGreaterThan(4)
      expect(h.lema.length, h.id).toBeGreaterThan(25)
      expect(h.desc.length, h.id).toBeGreaterThan(40)
      expect(h.ficha.length, h.id).toBe(5)
      expect(h.trajes.length, h.id).toBe(3)
      for (const t of h.trajes) expect(Object.keys(t.palette).length, `${h.id}/${t.nome}`).toBeGreaterThan(10)
    }
  })

  it('os caminhos da versão anterior continuam valendo', () => {
    for (const [antigo, novo] of Object.entries(HERO_ANTIGOS)) {
      expect(normalizeHero(antigo), antigo).toBe(novo)
      expect(HERO_IDS).toContain(novo)
    }
  })

  it('sem escolha, vale a classe padrão', () => {
    expect(heroOf(emptyState()).id).toBe(DEFAULT_HERO)
  })

  it('reconhece só os identificadores conhecidos', () => {
    expect(isHeroId('clerigo')).toBe(true)
    expect(isHeroId('penitente')).toBe(true)
    expect(isHeroId('paladino')).toBe(false)
    expect(isHeroId(7)).toBe(false)
    expect(isHeroId(undefined)).toBe(false)
  })
})

describe('escolher a classe', () => {
  const trocar = (s: StudyState, hero: string) => applyAction(s, { type: 'setHero', hero }, ctx, agora)

  it('troca a classe e nada mais', () => {
    const antes = emptyState()
    const r = trocar(antes, 'astrologo')
    expect(r.changed).toBe(true)
    expect(heroOf(r.state).id).toBe('astrologo')
    // não é estudo: sem XP, sem evento, sem dia de estudo, sem sequência
    expect(r.events).toEqual([])
    expect(r.state.study).toEqual(antes.study)
    expect(r.state.streak).toEqual(antes.streak)
    expect(r.state.coins).toEqual(antes.coins)
    expect(r.state.badges).toEqual(antes.badges)
  })

  it('recusa caminho desconhecido e repetição', () => {
    const s = trocar(emptyState(), 'ladrao').state
    expect(trocar(s, 'ladrao').changed).toBe(false)
    expect(trocar(s, 'necromante').changed).toBe(false)
    expect(heroOf(s).id).toBe('ladrao')
  })

  it('guarda o traje junto do caminho, e só de 0 a 2', () => {
    const r = applyAction(emptyState(), { type: 'setHero', hero: 'penitente', traje: 2 }, ctx, agora)
    expect(r.state.prefs).toMatchObject({ hero: 'penitente', heroTraje: 2 })
    const fora = applyAction(r.state, { type: 'setHero', hero: 'penitente', traje: 9 }, ctx, agora)
    expect(fora.changed).toBe(false)
  })

  it('sobrevive ao saneamento e descarta lixo', () => {
    const salvo = cleanState({ prefs: { sound: true, hero: 'clerigo', heroTraje: 1 } })
    expect(salvo.prefs.hero).toBe('clerigo')
    expect(salvo.prefs.heroTraje).toBe(1)
    // o id antigo de uma versão anterior cai no equivalente de hoje
    expect(cleanState({ prefs: { hero: 'arcanista' } }).prefs.hero).toBe('astrologo')
    expect(salvo.prefs.sound).toBe(true)
    expect(cleanState({ prefs: { hero: 'dragao-supremo' } }).prefs.hero).toBeUndefined()
    expect(heroOf(cleanState({ prefs: { hero: 123 } })).id).toBe(DEFAULT_HERO)
  })
})
