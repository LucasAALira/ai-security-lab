import { describe, expect, it } from 'vitest'
import { progressContext as ctx } from '@/data/progress-context'
import { applyAction, cleanState, coinBalance, coinsEarned, ECONOMY_MODES, economyOf, medals, SHIELD, summary, TIER_XP } from '.'

/* Dificuldade e modo deus: Soulslike é o padrão (valores de sempre); Difícil, Médio e Fácil multiplicam
   o XP das conquistas e as moedas recebidas por 10, 20 e 30, inclusive do que já foi conquistado. */

const now = new Date(2026, 9, 18, 12)
/** Estado com algumas conquistas e moedas de missões. */
const played = () => cleanState({ lab: true, cases: [true, true, true], coins: { bonus: 40, spent: 10 }, badges: {} })

describe('dificuldade', () => {
  it('Soulslike é o padrão e não aparece no estado salvo', () => {
    const s = cleanState({})
    expect(economyOf(s).mode).toBe('soulslike')
    expect(economyOf(s).multiplier).toBe(1)
    expect('economy' in s).toBe(false)
    expect(ECONOMY_MODES.map((m) => [m.id, m.multiplier])).toEqual([
      ['soulslike', 1],
      ['dificil', 10],
      ['medio', 20],
      ['facil', 30],
    ])
  })

  it('o multiplicador vale para o XP das conquistas e todas as moedas, também retroativamente', () => {
    const base = played()
    const sm = summary(base, ctx)
    const earned = coinsEarned(base, ctx)
    expect(sm.medalXp).toBeGreaterThan(0)
    const r = applyAction(base, { type: 'setEconomy', economy: { mode: 'facil' } }, ctx, now)
    expect(r.changed).toBe(true)
    const easy = summary(r.state, ctx)
    expect(easy.taskXp).toBe(sm.taskXp)
    // Cada conquista vale 30 vezes mais (mais XP pode liberar conquistas novas, que também valem ×30).
    const got = medals(r.state, ctx).filter((m) => m.unlocked)
    for (const m of got) expect(m.xp).toBe(TIER_XP[m.tier] * 30)
    expect(easy.medalXp).toBe(got.reduce((n, m) => n + TIER_XP[m.tier] * 30, 0))
    expect(easy.medalXp).toBeGreaterThanOrEqual(sm.medalXp * 30)
    expect(coinsEarned(r.state, ctx)).toBe((Math.floor(easy.xp / 5) + 40) * 30)
    // Voltar ao Soulslike restaura os valores; as moedas gastas continuam gastas.
    const back = applyAction(r.state, { type: 'setEconomy', economy: { mode: 'soulslike' } }, ctx, now).state
    expect('economy' in back).toBe(false)
    expect(coinsEarned(back, ctx)).toBe(earned)
    expect(back.coins.spent).toBe(10)
  })

  it('moedas de revisão aparecem já multiplicadas no aviso', () => {
    const s = cleanState({ economy: { mode: 'dificil' }, answered: {} })
    const ready = { ...s, modules: s.modules }
    const r = applyAction(ready, { type: 'review', total: 2, lost: 0 }, ctx, now)
    const coins = r.events.find((e) => e.kind === 'coins')
    if (coins && coins.kind === 'coins') expect(coins.amount % 10).toBe(0)
  })
})

describe('modo deus', () => {
  it('ajustes de XP, moedas e preços valem e são saneados', () => {
    const s = cleanState({
      coins: { bonus: 100 },
      economy: { mode: 'dificil', overrides: { tierXp: { bronze: 7, ouro: -1, prata: 1.5 }, coinMultiplier: 2, prices: { shield: 3, 'relic:ember': 0, inventado: 5, 'theme:ashes': 999999 } } },
    })
    expect(s.economy).toEqual({ mode: 'dificil', overrides: { tierXp: { bronze: 7 }, coinMultiplier: 2, prices: { shield: 3, 'relic:ember': 0 } } })
    const e = economyOf(s)
    expect(e.tierXp).toEqual({ bronze: 7, prata: 200, ouro: 400, dragao: 1000 })
    expect(e.coinMultiplier).toBe(2)
    expect(e.custom).toBe(true)
    expect(e.price('shield', SHIELD.price)).toBe(3)
  })

  it('compras cobram o preço ajustado', () => {
    const s = cleanState({ coins: { bonus: 10 }, economy: { mode: 'soulslike', overrides: { prices: { shield: 3, 'relic:ember': 0 } } } })
    const shield = applyAction(s, { type: 'buyShield' }, ctx, now)
    expect(shield.changed).toBe(true)
    expect(shield.state.coins.spent).toBe(3)
    expect(coinBalance(shield.state, ctx)).toBe(coinsEarned(shield.state, ctx) - 3)
    const relic = applyAction(shield.state, { type: 'buyRelic', id: 'ember' }, ctx, now)
    expect(relic.state.shop.relics).toContain('ember')
    expect(relic.state.coins.spent).toBe(3)
  })

  it('a dificuldade sobrevive ao recarregar e ao backup', () => {
    const r = applyAction(cleanState({}), { type: 'setEconomy', economy: { mode: 'medio', overrides: { coinMultiplier: 5 } } }, ctx, now)
    const reloaded = cleanState(JSON.parse(JSON.stringify(r.state)))
    expect(reloaded.economy).toEqual({ mode: 'medio', overrides: { coinMultiplier: 5 } })
    expect(applyAction(reloaded, { type: 'setEconomy', economy: { mode: 'medio', overrides: { coinMultiplier: 5 } } }, ctx, now).changed).toBe(false)
  })

  it('valores inválidos voltam ao padrão', () => {
    expect(cleanState({ economy: { mode: 'deus' } }).economy).toBeUndefined()
    expect(cleanState({ economy: 'facil' }).economy).toBeUndefined()
  })
})
