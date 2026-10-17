import { describe, expect, it } from 'vitest'
import { modules } from '@/data/modules'
import { remediationCases } from '@/data/scenarios'
import {
  answerReview,
  applyAction,
  buildContext,
  buildReview,
  canReview,
  CHEST_COINS,
  cleanState,
  coinBalance,
  coinsEarned,
  currentItem,
  dailyView,
  emptyState,
  medals,
  pickQuests,
  QUEST_IDS,
  reviewPool,
  startReview,
  summary,
  type Action,
  type StudyState,
} from '.'
import { seededRandom } from './random'

// Aqui só importam as mecânicas (missões, revisão, loja): módulos sem pré-requisitos deixam os testes
// estudarem em qualquer ordem. A regra de liberação por fogueira é testada em trail.test.ts.
const ctx = buildContext(
  modules.map((m) => ({ ...m, prereqs: [] })),
  remediationCases,
)
const D = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12)
const NOW = D(2026, 10, 16)
const TODAY = '2026-10-16'

function run(state: StudyState, now: Date, ...actions: Action[]): StudyState {
  return actions.reduce((s, a) => applyAction(s, a, ctx, now).state, state)
}

/** Estado com as missões de hoje fixadas, para os testes não dependerem do sorteio. */
function withQuests(ids: string[], extra: Record<string, unknown> = {}): StudyState {
  return cleanState({ ...extra, daily: { day: TODAY }, quests: { day: TODAY, ids, done: [], chest: false } })
}

/** Estado com alguns módulos concluídos (dá saldo de XP e questões para a revisão). */
const studied = (): StudyState =>
  run(withQuests([]), NOW, { type: 'answer', module: 0, index: 0 }, { type: 'answer', module: 0, index: 1 }, { type: 'answer', module: 1, index: 0 })

describe('missões diárias', () => {
  it('o sorteio é estável para o mesmo dia e traz até 3 missões sem repetir', () => {
    const s = emptyState()
    const first = pickQuests(s, ctx, TODAY)
    expect(pickQuests(s, ctx, TODAY)).toEqual(first)
    expect(first).toHaveLength(3)
    expect(new Set(first).size).toBe(3)
    expect(first.every((id) => QUEST_IDS.includes(id))).toBe(true)
    expect(first.filter((id) => id.startsWith('xp-')).length).toBeLessThanOrEqual(1)
  })

  it('varia de um dia para o outro', () => {
    const s = emptyState()
    const days = Array.from({ length: 30 }, (_, i) => pickQuests(s, ctx, `2026-11-${String(i + 1).padStart(2, '0')}`).join())
    expect(new Set(days).size).toBeGreaterThan(5)
  })

  it('só oferece missões possíveis de cumprir', () => {
    const empty = emptyState() // ninguém respondeu nada: não há o que revisar
    for (let i = 1; i <= 28; i++) expect(pickQuests(empty, ctx, `2026-11-${String(i).padStart(2, '0')}`)).not.toContain('review-1')

    let done = emptyState()
    for (let i = 0; i < 9; i++) {
      for (const a of [0, 1, 2].map((index): Action => ({ type: 'read', module: i, index }))) done = run(done, NOW, a)
      done = run(done, NOW, { type: 'practice', module: i }, { type: 'answer', module: i, index: 0 }, { type: 'answer', module: i, index: 1 })
    }
    done = run(done, NOW, ...[0, 1, 2, 3, 4, 5].map((index): Action => ({ type: 'solveCase', index })))
    for (let i = 1; i <= 28; i++) {
      const ids = pickQuests(done, ctx, `2026-12-${String(i).padStart(2, '0')}`)
      for (const impossible of ['read-2', 'answer-2', 'practice-1', 'case-1']) expect(ids).not.toContain(impossible)
    }
  })

  it('a primeira ação do dia sorteia as missões e a virada de dia zera os contadores', () => {
    const day1 = applyAction(emptyState(), { type: 'read', module: 0, index: 0 }, ctx, NOW).state
    expect(day1.quests.day).toBe(TODAY)
    expect(day1.quests.ids).toHaveLength(3)
    expect(day1.daily).toMatchObject({ day: TODAY, reads: 1 })

    const day2 = applyAction(day1, { type: 'read', module: 0, index: 1 }, ctx, D(2026, 10, 17)).state
    expect(day2.daily).toMatchObject({ day: '2026-10-17', reads: 1 })
    expect(day2.quests.day).toBe('2026-10-17')
    expect(day2.quests.done.every((id) => day2.quests.ids.includes(id))).toBe(true)
  })

  it('dailyView mostra as missões de hoje sem alterar o estado salvo', () => {
    const stale = run(emptyState(), D(2026, 10, 15), { type: 'read', module: 0, index: 0 })
    const snapshot = JSON.stringify(stale)
    const view = dailyView(stale, ctx, NOW)
    expect(JSON.stringify(stale)).toBe(snapshot)
    expect(view.quests.length).toBeGreaterThan(0)
    expect(view.quests.every((q) => q.progress === 0 && !q.done)).toBe(true)
    expect(view.xpToday).toBe(0)
    expect(view.allDone).toBe(false)
  })

  it('cumprir uma missão credita as moedas uma única vez', () => {
    const s0 = withQuests(['read-2'])
    const r1 = applyAction(s0, { type: 'read', module: 0, index: 0 }, ctx, NOW)
    expect(r1.events.some((e) => e.kind === 'quest')).toBe(false)
    const r2 = applyAction(r1.state, { type: 'read', module: 0, index: 1 }, ctx, NOW)
    expect(r2.events).toContainEqual({ kind: 'quest', id: 'read-2', title: 'Leia 2 seções de matéria', coins: 5 })
    expect(r2.events).toContainEqual({ kind: 'chest', coins: CHEST_COINS }) // era a única missão do dia
    expect(r2.state.coins.bonus).toBe(5 + CHEST_COINS)
    expect(r2.state.lifetime.quests).toBe(1)
    expect(r2.events.some((e) => e.kind === 'medal' && e.medal.id === 'quest-1')).toBe(true)
    const r3 = applyAction(r2.state, { type: 'read', module: 0, index: 2 }, ctx, NOW)
    expect(r3.events.some((e) => e.kind === 'quest' || e.kind === 'chest')).toBe(false)
    expect(r3.state.coins.bonus).toBe(5 + CHEST_COINS)
  })

  it('o baú só abre quando todas as missões do dia estão cumpridas', () => {
    let s = withQuests(['read-2', 'answer-2', 'practice-1'])
    s = run(s, NOW, { type: 'read', module: 0, index: 0 }, { type: 'read', module: 0, index: 1 }, { type: 'practice', module: 0 })
    expect(s.quests.done).toEqual(['read-2', 'practice-1'])
    expect(s.quests.chest).toBe(false)
    const last = applyAction(run(s, NOW, { type: 'answer', module: 0, index: 0 }), { type: 'answer', module: 0, index: 1 }, ctx, NOW)
    expect(last.state.quests.chest).toBe(true)
    expect(last.events.filter((e) => e.kind === 'chest')).toHaveLength(1)
    expect(last.state.coins.bonus).toBe(5 + 5 + 5 + CHEST_COINS)
    expect(dailyView(last.state, ctx, NOW)).toMatchObject({ allDone: true, chest: true })
  })

  it('missão de XP considera também o bônus das medalhas e o melhor dia vira medalha', () => {
    let s = withQuests(['xp-50'])
    s = run(s, NOW, { type: 'research', module: 0 }, { type: 'practice', module: 0 }) // 40 de tarefas + medalhas
    expect(s.quests.done).toEqual(['xp-50'])
    expect(s.daily.xp).toBeGreaterThanOrEqual(50)
    expect(s.bestDayXp).toBe(s.daily.xp)

    const big = run(withQuests([]), NOW, { type: 'completeLab' }, ...[0, 1, 2, 3, 4, 5].map((index): Action => ({ type: 'solveCase', index })))
    expect(big.bestDayXp).toBeGreaterThanOrEqual(200)
    expect(medals(big, ctx).find((m) => m.id === 'big-day')?.unlocked).toBe(true)
  })
})

describe('moedas', () => {
  it('uma moeda a cada 5 XP, mais bônus, menos o gasto', () => {
    const s = studied()
    const xp = summary(s, ctx).xp
    expect(coinsEarned(s, ctx)).toBe(Math.floor(xp / 5))
    expect(coinBalance(s, ctx)).toBe(Math.floor(xp / 5))
    const rich = cleanState({ ...s, coins: { bonus: 7, spent: 3 } })
    expect(coinBalance(rich, ctx)).toBe(Math.floor(xp / 5) + 4)
    expect(coinBalance(emptyState(), ctx)).toBe(0)
  })

  it('o saldo nunca fica negativo, mesmo com dados adulterados', () => {
    expect(coinBalance(cleanState({ coins: { spent: 500 } }), ctx)).toBe(0)
  })
})

describe('loja', () => {
  const rich = (n = 200) => withQuests([], { coins: { bonus: n, spent: 0 } })

  it('escudo: recusa sem moedas e acima do limite; compra desconta e não mexe no XP', () => {
    const poor = applyAction(emptyState(), { type: 'buyShield' }, ctx, NOW)
    expect(poor).toMatchObject({ changed: false, rejected: 'coins' })
    expect(poor.state).toBeDefined()

    const xpBefore = summary(rich(), ctx).xp
    const r = applyAction(rich(), { type: 'buyShield' }, ctx, NOW)
    expect(r.state.shop.shields).toBe(1)
    expect(r.state.coins.spent).toBe(20)
    expect(coinBalance(r.state, ctx)).toBe(200 - 20 + Math.floor(summary(r.state, ctx).xp / 5)) // a medalha do escudo rende 10 XP = 2 moedas
    expect(r.events).toContainEqual({ kind: 'purchase', item: 'shield', name: 'Escudo de sequência' })
    expect(r.events.some((e) => e.kind === 'medal' && e.medal.id === 'shield-up')).toBe(true)
    expect(r.state.streak.last).toBe('') // comprar não conta como dia de estudo
    expect(summary(r.state, ctx).xp - xpBefore).toBe(10) // só o bônus da medalha

    const two = run(r.state, NOW, { type: 'buyShield' })
    expect(two.shop.shields).toBe(2)
    expect(applyAction(two, { type: 'buyShield' }, ctx, NOW)).toMatchObject({ changed: false, rejected: 'limit' })
  })

  it('temas: compra ativa o tema, não compra duas vezes e só troca para os que possui', () => {
    expect(applyAction(emptyState(), { type: 'buyTheme', theme: 'cyber' }, ctx, NOW).rejected).toBe('coins')
    expect(applyAction(rich(), { type: 'buyTheme', theme: 'nada' }, ctx, NOW).rejected).toBe('invalid')
    expect(applyAction(rich(), { type: 'buyTheme', theme: 'dragon' }, ctx, NOW).rejected).toBe('invalid') // já é do usuário

    let s = run(rich(), NOW, { type: 'buyTheme', theme: 'cyber' })
    expect(s.shop).toMatchObject({ owned: ['cyber'], theme: 'cyber' })
    expect(s.coins.spent).toBe(40)
    expect(applyAction(s, { type: 'buyTheme', theme: 'cyber' }, ctx, NOW).rejected).toBe('owned')
    expect(applyAction(s, { type: 'setTheme', theme: 'arcane' }, ctx, NOW).rejected).toBe('locked')
    expect(applyAction(s, { type: 'setTheme', theme: 'cyber' }, ctx, NOW).changed).toBe(false)
    s = run(s, NOW, { type: 'setTheme', theme: 'dragon' })
    expect(s.shop.theme).toBe('dragon')
    s = run(s, NOW, { type: 'setTheme', theme: 'cyber' })
    expect(s.shop.theme).toBe('cyber')
  })

  it('recompensas pessoais: criar, validar, limitar, resgatar e remover', () => {
    for (const bad of [{ title: '   ', price: 5 }, { title: 'x', price: 0 }, { title: 'x', price: 1.5 }, { title: 'x', price: 1000 }]) {
      expect(applyAction(rich(), { type: 'addReward', ...bad }, ctx, NOW).rejected).toBe('invalid')
    }
    let s = run(rich(), NOW, { type: 'addReward', title: '  Um café  ', price: 30 })
    expect(s.shop.rewards).toHaveLength(1)
    expect(s.shop.rewards[0]).toMatchObject({ title: 'Um café', price: 30, redeemed: 0 })
    const id = s.shop.rewards[0].id
    expect(id).toMatch(/^[a-z0-9-]{1,40}$/)
    expect(cleanState(JSON.parse(JSON.stringify(s))).shop.rewards).toEqual(s.shop.rewards) // sobrevive ao salvar

    s = run(s, NOW, { type: 'addReward', title: 'Outra', price: 5 })
    expect(new Set(s.shop.rewards.map((r) => r.id)).size).toBe(2) // ids únicos mesmo no mesmo instante

    const redeemed = applyAction(s, { type: 'redeemReward', id }, ctx, NOW)
    expect(redeemed.events).toContainEqual({ kind: 'redeem', title: 'Um café', price: 30 })
    expect(redeemed.state.shop.rewards.find((r) => r.id === id)?.redeemed).toBe(1)
    expect(redeemed.state.coins.spent).toBe(30)
    expect(medals(redeemed.state, ctx).find((m) => m.id === 'first-reward')?.unlocked).toBe(true)
    expect(applyAction(emptyState(), { type: 'redeemReward', id }, ctx, NOW).rejected).toBe('missing')
    const broke = cleanState({ shop: { rewards: [{ id: 'caro', title: 'Caro', price: 500 }] } })
    expect(applyAction(broke, { type: 'redeemReward', id: 'caro' }, ctx, NOW).rejected).toBe('coins')

    expect(run(redeemed.state, NOW, { type: 'removeReward', id }).shop.rewards.map((r) => r.id)).not.toContain(id)
    expect(applyAction(s, { type: 'removeReward', id: 'nao-existe' }, ctx, NOW).rejected).toBe('missing')

    let full = rich(500)
    for (let i = 0; i < 8; i++) full = run(full, NOW, { type: 'addReward', title: `R${i}`, price: 1 })
    expect(applyAction(full, { type: 'addReward', title: 'Nona', price: 1 }, ctx, NOW).rejected).toBe('limit')
  })
})

describe('escudo e sequência pelo applyAction', () => {
  it('estudar depois de um dia sem estudo consome o escudo e mantém a sequência', () => {
    let s = run(withQuests([], { shop: { shields: 1 } }), D(2026, 10, 14), { type: 'read', module: 0, index: 0 })
    s = run(s, D(2026, 10, 15), { type: 'read', module: 0, index: 1 })
    const r = applyAction(s, { type: 'read', module: 0, index: 2 }, ctx, D(2026, 10, 17))
    expect(r.events).toContainEqual({ kind: 'shield-used', count: 1 })
    expect(r.events).toContainEqual({ kind: 'streak', current: 3 })
    expect(r.state.shop.shields).toBe(0)
    expect(r.state.streak).toMatchObject({ current: 3, shieldUsed: '2026-10-16' })
  })
})

describe('revisão com vidas', () => {
  it('só monta revisão com questões já resolvidas', () => {
    expect(canReview(emptyState())).toBe(false)
    const one = run(emptyState(), NOW, { type: 'answer', module: 0, index: 0 })
    expect(canReview(one)).toBe(false) // abaixo do mínimo de 2
    expect(canReview(studied())).toBe(true)
    expect(reviewPool(studied())).toEqual([
      { module: 0, question: 0 },
      { module: 0, question: 1 },
      { module: 1, question: 0 },
    ])
    expect(applyAction(emptyState(), { type: 'review', total: 3, lost: 0 }, ctx, NOW).rejected).toBe('invalid')
  })

  it('a sessão prioriza as questões com mais erros e respeita o tamanho', () => {
    let s = run(withQuests([]), NOW, { type: 'miss', module: 2, index: 1 }, { type: 'miss', module: 2, index: 1 })
    for (let i = 0; i < 4; i++) s = run(s, NOW, { type: 'answer', module: i, index: 0 }, { type: 'answer', module: i, index: 1 })
    expect(reviewPool(s)).toHaveLength(8)
    const items = buildReview(s, seededRandom('teste'), 3)
    expect(items).toHaveLength(3)
    expect(items).toContainEqual({ module: 2, question: 1 }) // a mais errada sempre entra
    expect(new Set(items.map((i) => `${i.module}:${i.question}`)).size).toBe(3)
    expect(buildReview(s, seededRandom('teste'), 3)).toEqual(items)
    expect(buildReview(studied())).toHaveLength(3) // menos questões do que o tamanho da sessão
  })

  it('máquina de vidas: erro volta a questão para o fim da fila; sem vidas a sessão acaba', () => {
    const items = [
      { module: 0, question: 0 },
      { module: 0, question: 1 },
      { module: 1, question: 0 },
    ]
    let r = startReview(items)
    expect(r).toMatchObject({ hearts: 3, total: 3, status: 'playing' })
    expect(currentItem(r)).toEqual(items[0])

    r = answerReview(r, false)
    expect(r).toMatchObject({ hearts: 2, lost: 1, status: 'playing' })
    expect(r.queue).toEqual([items[1], items[2], items[0]]) // a errada volta no fim
    r = answerReview(r, true)
    r = answerReview(r, true)
    expect(currentItem(r)).toEqual(items[0])
    r = answerReview(r, true)
    expect(r).toMatchObject({ status: 'won', lost: 1 })
    expect(currentItem(r)).toBeUndefined()
    expect(answerReview(r, false)).toBe(r) // sessão encerrada ignora respostas

    let lost = startReview(items)
    lost = answerReview(answerReview(answerReview(lost, false), false), false)
    expect(lost).toMatchObject({ hearts: 0, lost: 3, status: 'lost' })
    expect(answerReview(lost, true)).toBe(lost)
    expect(startReview([]).status).toBe('won')
  })

  it('sessão concluída: conta como estudo, rende moedas nas 3 primeiras do dia e libera medalhas', () => {
    let s = studied()
    const perfect = applyAction(s, { type: 'review', total: 3, lost: 0 }, ctx, NOW)
    expect(perfect.events).toContainEqual({ kind: 'coins', amount: 3 })
    expect(perfect.state.lifetime).toMatchObject({ reviews: 1, perfectReviews: 1 })
    const ids = perfect.events.filter((e) => e.kind === 'medal').map((e) => e.medal.id)
    expect(ids).toEqual(expect.arrayContaining(['first-review', 'flawless-review']))

    s = run(perfect.state, NOW, { type: 'review', total: 3, lost: 1 })
    expect(s.coins.bonus - perfect.state.coins.bonus).toBe(2)
    s = run(s, NOW, { type: 'review', total: 3, lost: 2 })
    const fourth = applyAction(s, { type: 'review', total: 3, lost: 0 }, ctx, NOW)
    expect(fourth.events.some((e) => e.kind === 'coins')).toBe(false) // limite diário de moedas
    expect(fourth.state.daily.reviews).toBe(4)
    expect(fourth.state.lifetime.perfectReviews).toBe(2)
  })

  it('valida os números da sessão e cumpre a missão de revisão', () => {
    const s = withQuests(['review-1'], { modules: studied().modules })
    for (const bad of [{ total: 0, lost: 0 }, { total: 6, lost: 0 }, { total: 3, lost: 3 }, { total: 3, lost: -1 }, { total: 2.5, lost: 0 }]) {
      expect(applyAction(s, { type: 'review', ...bad }, ctx, NOW)).toMatchObject({ changed: false, rejected: 'invalid' })
    }
    const ok = applyAction(s, { type: 'review', total: 3, lost: 1 }, ctx, NOW)
    expect(ok.state.quests.done).toEqual(['review-1'])
    expect(ok.state.streak.last).toBe(TODAY)
  })
})
