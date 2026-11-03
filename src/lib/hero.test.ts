import { describe, expect, it } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { applyAction, cleanState, emptyState, type StudyState } from '@/lib/progress'
import { DEFAULT_HERO, HEROES, HERO_IDS, heroOf, isHeroId } from './hero'

const ctx = progressContext
const agora = new Date(2026, 10, 2, 12)

describe('classes do santuário', () => {
  it('cada classe tem nome, lema, arma e trilha', () => {
    expect(HEROES.length).toBeGreaterThanOrEqual(4)
    expect(new Set(HERO_IDS).size).toBe(HEROES.length)
    for (const h of HEROES) {
      expect(h.nome.length, h.id).toBeGreaterThan(4)
      expect(h.lema.length, h.id).toBeGreaterThan(20)
      expect(h.arma.length, h.id).toBeGreaterThan(3)
      expect(h.descricao.length, h.id).toBeGreaterThan(40)
    }
  })

  it('sem escolha, vale a classe padrão', () => {
    expect(heroOf(emptyState()).id).toBe(DEFAULT_HERO)
  })

  it('reconhece só os identificadores conhecidos', () => {
    expect(isHeroId('clerigo')).toBe(true)
    expect(isHeroId('paladino')).toBe(false)
    expect(isHeroId(7)).toBe(false)
    expect(isHeroId(undefined)).toBe(false)
  })
})

describe('escolher a classe', () => {
  const trocar = (s: StudyState, hero: string) => applyAction(s, { type: 'setHero', hero }, ctx, agora)

  it('troca a classe e nada mais', () => {
    const antes = emptyState()
    const r = trocar(antes, 'arcanista')
    expect(r.changed).toBe(true)
    expect(heroOf(r.state).id).toBe('arcanista')
    // não é estudo: sem XP, sem evento, sem dia de estudo, sem sequência
    expect(r.events).toEqual([])
    expect(r.state.study).toEqual(antes.study)
    expect(r.state.streak).toEqual(antes.streak)
    expect(r.state.coins).toEqual(antes.coins)
    expect(r.state.badges).toEqual(antes.badges)
  })

  it('recusa classe desconhecida e repetição', () => {
    const s = trocar(emptyState(), 'batedor').state
    expect(trocar(s, 'batedor').changed).toBe(false)
    expect(trocar(s, 'necromante').changed).toBe(false)
    expect(heroOf(s).id).toBe('batedor')
  })

  it('sobrevive ao saneamento e descarta lixo', () => {
    const salvo = cleanState({ prefs: { sound: true, hero: 'clerigo' } })
    expect(salvo.prefs.hero).toBe('clerigo')
    expect(salvo.prefs.sound).toBe(true)
    expect(cleanState({ prefs: { hero: 'dragao-supremo' } }).prefs.hero).toBeUndefined()
    expect(heroOf(cleanState({ prefs: { hero: 123 } })).id).toBe(DEFAULT_HERO)
  })
})
