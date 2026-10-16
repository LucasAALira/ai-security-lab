import { describe, expect, it } from 'vitest'
import { bossAnswers } from '@/data/bosses'
import { progressContext } from '@/data/progress-context'
import {
  applyAction,
  canOpenContent,
  cleanState,
  coinBalance,
  CORE_MODULE_COUNT,
  emptyState,
  isEarlyAccess,
  isModuleUnlocked,
  loadState,
  medals,
  MODULE_COUNT,
  MODULE_UNLOCKS,
  moduleUnlockPrice,
  nextObjective,
  saveState,
  summary,
  trail,
  type Action,
  type StudyState,
} from '.'

const ctx = progressContext
const D = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12)
const NOW = D(2026, 10, 16)
const RE = 8
const PRICE = 5000

function run(state: StudyState, ...actions: Action[]): StudyState {
  return actions.reduce((s, a) => applyAction(s, a, ctx, NOW).state, state)
}

/** Estado sem missões no dia, para o saldo não depender de sorteios. */
function quiet(): StudyState {
  const s = emptyState()
  s.quests.day = '2026-10-16'
  return s
}

/** Um estado que já tem moedas de sobra (bônus de missões, baús e revisões). */
function withCoins(bonus: number): StudyState {
  const s = quiet()
  s.coins.bonus = bonus
  return s
}

const finish = (i: number): Action[] => [
  { type: 'read', module: i, index: 0 },
  { type: 'read', module: i, index: 1 },
  { type: 'read', module: i, index: 2 },
  { type: 'research', module: i },
  { type: 'practice', module: i },
  { type: 'answer', module: i, index: 0 },
  { type: 'answer', module: i, index: 1 },
]

const unlocked = (s: StudyState) => medals(s, ctx).filter((m) => m.unlocked).map((m) => m.id)

describe('catálogo de acesso antecipado', () => {
  it('o módulo de Engenharia Reversa custa 5.000 moedas e é o único à venda', () => {
    expect(MODULE_UNLOCKS).toEqual({ 8: 5000 })
    expect(moduleUnlockPrice(RE)).toBe(PRICE)
    expect(isEarlyAccess(RE)).toBe(true)
    for (let i = 0; i < CORE_MODULE_COUNT; i++) {
      expect(isEarlyAccess(i)).toBe(false)
      expect(moduleUnlockPrice(i)).toBeNull()
    }
    expect(MODULE_COUNT).toBe(CORE_MODULE_COUNT + 1)
  })

  it('começa bloqueado: o conteúdo fecha e estudar é recusado até a liberação', () => {
    const s = quiet()
    const t = trail(s, ctx)[RE]
    expect(t).toMatchObject({ unlocked: false, earlyAccess: true, price: PRICE, purchased: false })
    expect(t.missing).toEqual([0, 3])
    expect(canOpenContent(s, ctx, RE)).toBe(false)
    expect(canOpenContent(s, ctx, 0)).toBe(true) // módulos comuns sempre abrem para leitura
    const r = applyAction(s, { type: 'read', module: RE, index: 0 }, ctx, NOW)
    expect(r).toMatchObject({ changed: false, rejected: 'prereq' })
  })
})

describe('desbloqueio imediato com moedas', () => {
  it('sem moedas suficientes, recusa e não altera nada', () => {
    const s = withCoins(PRICE - 5) // faltam 5 moedas
    expect(coinBalance(s, ctx)).toBe(PRICE - 5)
    const r = applyAction(s, { type: 'unlockModule', module: RE }, ctx, NOW)
    expect(r).toMatchObject({ changed: false, rejected: 'coins' })
    expect(r.state).toBe(s) // o mesmo objeto: nada a salvar nem a renderizar
  })

  it('com o saldo exato, desbloqueia, gasta 5.000 e libera o conteúdo', () => {
    const s = withCoins(PRICE)
    expect(coinBalance(s, ctx)).toBe(PRICE)
    const r = applyAction(s, { type: 'unlockModule', module: RE }, ctx, NOW)
    expect(r.changed).toBe(true)
    expect(r.state.coins.spent).toBe(PRICE)
    expect(r.state.shop.unlocked).toEqual([RE])
    expect(isModuleUnlocked(r.state, ctx, RE)).toBe(true)
    expect(canOpenContent(r.state, ctx, RE)).toBe(true)
    expect(trail(r.state, ctx)[RE]).toMatchObject({ unlocked: true, purchased: true })
    expect(r.events).toEqual(expect.arrayContaining([{ kind: 'purchase', item: 'module', name: 'Módulo 9' }, { kind: 'unlock', module: RE }]))
    expect(r.state.events.at(-2)).toMatchObject({ kind: 'unlock', ref: 'm8' })
    // Depois da compra, estudar o módulo funciona e rende XP.
    const studied = applyAction(r.state, { type: 'read', module: RE, index: 0 }, ctx, NOW)
    expect(studied.changed).toBe(true)
    expect(summary(studied.state, ctx).taskXp).toBe(10)
  })

  it('4.999 moedas não bastam; 5.000 bastam', () => {
    expect(applyAction(withCoins(4999), { type: 'unlockModule', module: RE }, ctx, NOW).rejected).toBe('coins')
    expect(applyAction(withCoins(5000), { type: 'unlockModule', module: RE }, ctx, NOW).changed).toBe(true)
  })

  it('comprar nunca reduz XP, nível nem medalhas já conquistadas', () => {
    let s = withCoins(PRICE)
    s = run(s, { type: 'read', module: 0, index: 0 }, { type: 'read', module: 0, index: 1 }, { type: 'read', module: 0, index: 2 })
    const before = summary(s, ctx)
    const medalsBefore = unlocked(s)
    const after = applyAction(s, { type: 'unlockModule', module: RE }, ctx, NOW).state
    const sm = summary(after, ctx)
    expect(sm.taskXp).toBe(before.taskXp)
    expect(sm.xp).toBeGreaterThanOrEqual(before.xp) // a medalha "Acesso Antecipado" soma XP
    for (const id of medalsBefore) expect(unlocked(after)).toContain(id)
    expect(unlocked(after)).toContain('acesso-antecipado')
  })

  it('não cobra duas vezes', () => {
    const once = applyAction(withCoins(PRICE * 2), { type: 'unlockModule', module: RE }, ctx, NOW)
    const twice = applyAction(once.state, { type: 'unlockModule', module: RE }, ctx, NOW)
    expect(twice).toMatchObject({ changed: false, rejected: 'owned' })
    expect(twice.state.coins.spent).toBe(PRICE)
  })

  it('não cobra de quem já abriu o módulo pelos pré-requisitos', () => {
    let s = withCoins(PRICE)
    for (const i of [0, 1, 2, 3]) s = run(s, ...finish(i))
    expect(isModuleUnlocked(s, ctx, RE)).toBe(true) // liberado de graça: a fogueira de 1 e 4 acesas
    const spentBefore = s.coins.spent
    const r = applyAction(s, { type: 'unlockModule', module: RE }, ctx, NOW)
    expect(r).toMatchObject({ changed: false, rejected: 'open' })
    expect(r.state.coins.spent).toBe(spentBefore)
  })

  it('rejeita módulos que não estão à venda ou que não existem', () => {
    const s = withCoins(PRICE)
    for (const module of [0, 3, 7, 9, 99, -1, 1.5, Number.NaN]) {
      const r = applyAction(s, { type: 'unlockModule', module }, ctx, NOW)
      expect(r.changed).toBe(false)
      expect(r.rejected).toBe('invalid')
    }
  })

  it('a compra conta como moedas gastas e deixa o saldo coerente', () => {
    const s = withCoins(PRICE + 37)
    const after = applyAction(s, { type: 'unlockModule', module: RE }, ctx, NOW).state
    // 37 de saldo + 4 moedas da medalha "Acesso Antecipado" (20 XP / 5)
    expect(coinBalance(after, ctx)).toBe(37 + 4)
  })
})

describe('o módulo de acesso antecipado não muda as conquistas da trilha principal', () => {
  it('estudar só o módulo 09 não soma para "tudo concluído" nem para as metas com totais', () => {
    let s = run(withCoins(PRICE), { type: 'unlockModule', module: RE }, ...finish(RE))
    const sm = summary(s, ctx)
    expect(sm.complete).toBe(0) // módulos concluídos da trilha principal
    expect(sm.steps).toBe(0)
    expect(sm.taskXp).toBe(100)
    const ids = unlocked(s)
    expect(ids).toContain('track-engenharia-reversa')
    for (const id of ['first-module', 'half-modules', 'all-modules', 'full-track', 'reader-24', 'sharp-12']) expect(ids).not.toContain(id)
    s = run(s, { type: 'completeLab' })
    expect(summary(s, ctx).steps).toBe(1)
  })

  it('terminar os oito módulos da trilha principal continua dando "Módulos dominados" sem exigir o 09', () => {
    let s = quiet()
    for (let i = 0; i < CORE_MODULE_COUNT; i++) s = run(s, ...finish(i))
    s = run(s, { type: 'completeLab' }, ...[0, 1, 2, 3, 4, 5].map((index): Action => ({ type: 'solveCase', index })))
    const ids = unlocked(s)
    expect(ids).toEqual(expect.arrayContaining(['all-modules', 'full-track', 'reader-24', 'sharp-12']))
    expect(summary(s, ctx).complete).toBe(8)
  })

  it('o próximo objetivo só aponta para o módulo 09 depois que ele está liberado', () => {
    const locked = quiet()
    for (const next of [nextObjective(locked, ctx)]) expect(next).not.toMatchObject({ module: RE })
    let s = quiet()
    for (let i = 0; i < CORE_MODULE_COUNT; i++) {
      s = run(s, ...finish(i))
      for (let j = 0; j < 3; j++) s = run(s, { type: 'bossAnswer', module: i, index: j, option: bossAnswers[i][j] })
    }
    expect(nextObjective(s, ctx)).toMatchObject({ kind: 'step', module: RE, started: false })
  })
})

describe('salvamento e migração', () => {
  it('um progresso antigo (8 módulos, sem a lista de desbloqueios) ganha o módulo 09 vazio e preserva tudo', () => {
    const old = JSON.parse(JSON.stringify(withCoins(120)))
    for (let i = 0; i < 8; i++) old.modules[i] = { reads: [true, true, true], research: true, practice: true, solved: [true, true], notes: `n${i}`, researchNote: '', misses: [0, 0], firstTry: [true, true] }
    delete old.modules[8]
    delete old.shop.unlocked
    old.badges = { 'all-modules': '2026-10-01', 'full-track': '2026-10-02' }
    const s = cleanState(old)
    expect(Object.keys(s.modules)).toHaveLength(MODULE_COUNT)
    expect(s.modules[8]).toMatchObject({ research: false, practice: false })
    expect(s.shop.unlocked).toEqual([])
    expect(s.modules[3].notes).toBe('n3')
    expect(s.badges['all-modules']).toBe('2026-10-01') // medalhas já ganhas permanecem
    expect(s.badges['full-track']).toBe('2026-10-02')
    expect(summary(s, ctx).taskXp).toBe(800) // 8 módulos x 100; o novo módulo não muda o que já foi feito
    expect(summary(s, ctx).complete).toBe(8)
    expect(trail(s, ctx)[8].unlocked).toBe(true) // 1 e 4 já têm fogueira: o acesso é gratuito
  })

  it('saneia a lista de desbloqueios: só ids vendidos, sem repetição', () => {
    for (const bad of [[8, 8, 3, 'x', 99, -1, 1.5, null], 'x', { 0: 8 }, null, 8]) {
      const raw = { shop: { unlocked: bad } }
      const s = cleanState(raw)
      expect(s.shop.unlocked).toEqual(Array.isArray(bad) ? [8] : [])
    }
  })

  it('o desbloqueio sobrevive a salvar e carregar', () => {
    const state = applyAction(withCoins(PRICE), { type: 'unlockModule', module: RE }, ctx, NOW).state
    const store = new Map<string, string>()
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
    expect(saveState(storage, state)).toBe(true)
    const loaded = loadState(storage)
    expect(loaded.shop.unlocked).toEqual([RE])
    expect(loaded.coins.spent).toBe(PRICE)
    expect(isModuleUnlocked(loaded, ctx, RE)).toBe(true)
  })
})
