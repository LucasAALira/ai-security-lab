import { describe, expect, it } from 'vitest'
import { modules } from '@/data/modules'
import { remediationCases } from '@/data/scenarios'
import {
  activeStreak,
  applyAction,
  buildContext,
  cleanState,
  emptyState,
  improvements,
  levelFor,
  loadState,
  maxXp,
  medals,
  moduleRemaining,
  moduleXp,
  nextTierFor,
  saveState,
  streakStatus,
  summary,
  tierFor,
  trackProgress,
  type Action,
  type ProgressEvent,
  type ProgressContext,
  type StudyState,
} from '.'
import { touchStreak } from './streak'

const ctx = buildContext(modules, remediationCases)
const emptyCtx: ProgressContext = { tracks: [], prereqs: [], sizes: [] }
/** Meio-dia local, para a data não depender do fuso do computador de testes. */
const D = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12)
const NOW = D(2026, 10, 16)

function run(state: StudyState, now: Date, ...actions: Action[]): StudyState {
  return actions.reduce((s, a) => applyAction(s, a, ctx, now).state, state)
}

const finishModule = (i: number): Action[] => [
  { type: 'read', module: i, index: 0 },
  { type: 'read', module: i, index: 1 },
  { type: 'read', module: i, index: 2 },
  { type: 'research', module: i },
  { type: 'practice', module: i },
  { type: 'answer', module: i, index: 0 },
  { type: 'answer', module: i, index: 1 },
]

/** Medalhas que dependem de revisão, missões, loja e dia de muito XP — não de concluir o conteúdo. */
const MECHANIC_MEDALS = ['first-review', 'reviewer-10', 'flawless-review', 'quest-1', 'quest-15', 'shield-up', 'first-reward', 'big-day']

/** Estado sem missões no dia de `NOW`, para testar XP sem a interferência de medalhas de missão. */
function quiet(): StudyState {
  const s = emptyState()
  s.quests.day = '2026-10-16'
  return s
}

const unlockedIds = (s: StudyState, c = ctx) => medals(s, c).filter((m) => m.unlocked).map((m) => m.id)

describe('contexto', () => {
  it('deriva 4 trilhas, 8 módulos e 6 cenários dos dados', () => {
    expect(ctx.tracks.map((t) => [t.name, t.modules.length])).toEqual([
      ['Fundamentos', 1],
      ['Ataques e defesa', 3],
      ['Governança', 2],
      ['Regulação', 2],
    ])
    expect(ctx.sizes).toHaveLength(6)
    expect([...new Set(ctx.sizes)].sort()).toEqual(['Grande', 'Média', 'Pequena'])
  })
})

describe('totais', () => {
  it('estado vazio: 0 XP, nenhuma medalha, catálogo de 34 (26 de estudo + 8 das mecânicas)', () => {
    const sm = summary(emptyState(), ctx)
    expect(sm.xp).toBe(0)
    expect(sm.medals).toBe(0)
    expect(sm.medalTotal).toBe(34)
    expect(medals(emptyState(), ctx).filter((m) => !MECHANIC_MEDALS.includes(m.id))).toHaveLength(26)
  })

  it('máximos: 1070 XP em tarefas + 710 de bônus de medalhas (590 de estudo + 120 das mecânicas)', () => {
    expect(maxXp(ctx)).toEqual({ tasks: 1070, medals: 710 })
    const study = medals(emptyState(), ctx).filter((m) => !MECHANIC_MEDALS.includes(m.id))
    expect(study.reduce((n, m) => n + m.xp, 0)).toBe(590)
  })

  it('conclusão total: 1070 em tarefas, todas as medalhas, 1660 XP e nível máximo', () => {
    let s = run(emptyState(), NOW, { type: 'miss', module: 0, index: 0 }) // 'Aprendeu com o erro' e 'Precisão de elite' coexistem
    for (let i = 0; i < 8; i++) s = run(s, NOW, ...finishModule(i))
    s = run(s, NOW, { type: 'completeLab' }, ...[0, 1, 2, 3, 4, 5].map((index): Action => ({ type: 'solveCase', index })))

    const sm = summary(s, ctx)
    expect(sm.taskXp).toBe(1070)
    expect(sm.steps).toBe(63)
    expect(sm.complete).toBe(8)
    const missing = medals(s, ctx).filter((m) => !m.unlocked && !MECHANIC_MEDALS.includes(m.id)).map((m) => m.id)
    expect(missing).toEqual(['streak-3', 'streak-7'])

    for (let k = 0; k < 7; k++) touchStreak(s, D(2026, 11, 1 + k))
    const all = summary(s, ctx)
    const study = medals(s, ctx).filter((m) => m.unlocked && !MECHANIC_MEDALS.includes(m.id))
    expect(study).toHaveLength(26)
    expect(study.reduce((n, m) => n + m.xp, 0)).toBe(590)
    expect(all.taskXp).toBe(1070)
    expect(all.xp).toBeGreaterThanOrEqual(1070 + 590)
    expect(levelFor(all.xp).name).toBe('Mestre Dragão')
    expect(levelFor(all.xp).next).toBeNull()
    expect(improvements(s, ctx)).toEqual([])
  })
})

describe('saneamento e armazenamento', () => {
  it('estado antigo (v2 sem campos novos) carrega sem perder progresso', () => {
    const old = {
      version: 2,
      lab: true,
      cases: [true, false, false, false, false, false],
      modules: { 0: { reads: [true, true, false], research: true, practice: false, solved: [true, false], notes: 'abc', researchNote: 'x' } },
    }
    const s = cleanState(JSON.parse(JSON.stringify(old)))
    expect(moduleXp(s.modules[0])).toBe(10 * 2 + 20 + 15)
    expect(s.modules[0].misses).toEqual([0, 0])
    expect(s.modules[0].firstTry).toEqual([false, false])
    expect(s.modules[0].notes).toBe('abc')
    expect(summary(s, ctx).taskXp).toBe(55 + 30 + 40)
    expect(s.shop).toEqual({ shields: 0, owned: [], theme: 'dragon', rewards: [] })
    expect(s.quests).toEqual({ day: '', ids: [], done: [], chest: false })
  })

  it('estado legado v1 migra', () => {
    const store = { getItem: (k: string) => (k === 'ai-security-study-v1' ? JSON.stringify({ 0: { done: true, notes: 'n' } }) : null) }
    const s = loadState(store)
    expect(s.migrated).toBe(true)
    expect(s.modules[0].reads).toEqual([true, true, true])
    expect(s.modules[0].notes).toBe('n')
  })

  it('armazenamento quebrado cai para o estado inicial', () => {
    expect(loadState({ getItem: () => '{não é json' })).toEqual(emptyState())
    expect(
      loadState({
        getItem: () => {
          throw new Error('bloqueado')
        },
      }),
    ).toEqual(emptyState())
    expect(
      saveState(
        {
          setItem: () => {
            throw new Error('cota cheia')
          },
        },
        emptyState(),
      ),
    ).toBe(false)
  })

  it('entrada corrompida é saneada', () => {
    const s = cleanState({
      badges: { 'ok-id': '2026-10-16', 'BAD ID': '2026-10-16', x: 'not-a-date', y: 5, z: '2026-13-45' },
      streak: { last: 'lixo', current: -4, best: 'a' },
      modules: { 0: { misses: [-1, 1e9], firstTry: [true, true], solved: [false, true] } },
    })
    expect(Object.keys(s.badges)).toEqual(['ok-id'])
    expect(s.streak).toEqual({ last: '', current: 0, best: 0, shieldUsed: '' })
    expect(s.modules[0].misses).toEqual([0, 99])
    expect(s.modules[0].firstTry).toEqual([false, true])
    expect(() => cleanState(null)).not.toThrow()
    expect(() => cleanState('x')).not.toThrow()
    expect(() => cleanState([])).not.toThrow()
  })

  it('loja: tema não comprado volta ao padrão e valores fora do limite são cortados', () => {
    const s = cleanState({
      shop: {
        shields: 50,
        owned: ['cyber', 'inexistente', 'dragon'],
        theme: 'arcane',
        rewards: [
          { id: 'cafe', title: '  Café  ', price: 10, redeemed: 2 },
          { id: 'cafe', title: 'duplicado', price: 5 },
          { id: 'Inválido!', title: 'x', price: 5 },
          { id: 'sem-preco', title: 'x', price: 0 },
          { id: 'sem-titulo', title: '   ', price: 5 },
          { id: 'caro', title: 'Caro', price: 99999 },
        ],
      },
    })
    expect(s.shop.shields).toBe(2)
    expect(s.shop.owned).toEqual(['cyber'])
    expect(s.shop.theme).toBe('dragon')
    expect(s.shop.rewards).toEqual([
      { id: 'cafe', title: 'Café', price: 10, redeemed: 2 },
      { id: 'caro', title: 'Caro', price: 999, redeemed: 0 },
    ])
    expect(cleanState({ shop: { owned: ['arcane'], theme: 'arcane' } }).shop.theme).toBe('arcane')
  })

  it('missões: ids desconhecidos, dia inválido e baú sem missões concluídas são descartados', () => {
    const q = cleanState({ quests: { day: '2026-10-16', ids: ['read-2', 'nada', 'read-2', 'xp-50'], done: ['xp-50', 'case-1'], chest: true } }).quests
    expect(q).toEqual({ day: '2026-10-16', ids: ['read-2', 'xp-50'], done: ['xp-50'], chest: false })
    expect(cleanState({ quests: { day: 'ontem', ids: ['read-2'], done: ['read-2'], chest: true } }).quests).toEqual({ day: '', ids: [], done: [], chest: false })
  })

  it('serialização ida e volta preserva tudo', () => {
    const s = run(emptyState(), NOW, { type: 'read', module: 2, index: 1 }, { type: 'miss', module: 2, index: 0 })
    expect(cleanState(JSON.parse(JSON.stringify(s)))).toEqual(s)
  })
})

describe('applyAction', () => {
  it('é idempotente e não pontua duas vezes', () => {
    const first = applyAction(emptyState(), { type: 'read', module: 0, index: 0 }, ctx, NOW)
    expect(first.changed).toBe(true)
    const again = applyAction(first.state, { type: 'read', module: 0, index: 0 }, ctx, NOW)
    expect(again.changed).toBe(false)
    expect(again.state).toBe(first.state)
    expect(again.events).toEqual([])
    for (const action of [
      { type: 'read', module: 0, index: 9 },
      { type: 'read', module: 99, index: 0 },
      { type: 'answer', module: 0, index: 2 },
      { type: 'solveCase', index: 6 },
      { type: 'solveCase', index: 1.5 },
    ] as Action[]) {
      expect(applyAction(first.state, action, ctx, NOW).changed).toBe(false)
    }
    expect(summary(first.state, ctx).taskXp).toBe(10)
  })

  it('não altera o estado recebido', () => {
    const s = emptyState()
    const snapshot = JSON.stringify(s)
    applyAction(s, { type: 'research', module: 1 }, ctx, NOW)
    expect(JSON.stringify(s)).toBe(snapshot)
  })

  it('medalha libera uma vez, registra a data e o bônus entra no XP total', () => {
    const r = applyAction(quiet(), { type: 'read', module: 0, index: 0 }, ctx, NOW)
    const sm = summary(r.state, ctx)
    expect([sm.taskXp, sm.medalXp, sm.xp]).toEqual([10, 10, 20])
    expect(r.events.filter((e) => e.kind === 'medal').map((e) => e.medal.id)).toEqual(['first-read'])
    expect(r.events).toContainEqual({ kind: 'xp', amount: 20 })
    expect(r.events).toContainEqual({ kind: 'streak', current: 1 })
    expect(r.state.badges['first-read']).toBe('2026-10-16')
    expect(medals(r.state, ctx).find((m) => m.id === 'first-read')?.date).toBe('2026-10-16')
    const next = applyAction(r.state, { type: 'read', module: 0, index: 1 }, ctx, NOW)
    expect(next.events.some((e) => e.kind === 'medal' && e.medal.id === 'first-read')).toBe(false)
    expect(next.events).toContainEqual({ kind: 'xp', amount: 10 })
  })

  it('acerto de primeira x depois de errar', () => {
    let s = run(emptyState(), NOW, { type: 'answer', module: 0, index: 0 })
    expect(s.modules[0].firstTry[0]).toBe(true)
    s = run(s, NOW, { type: 'miss', module: 0, index: 1 }, { type: 'miss', module: 0, index: 1 })
    expect(s.modules[0].misses[1]).toBe(2)
    s = run(s, NOW, { type: 'answer', module: 0, index: 1 })
    expect(s.modules[0].firstTry[1]).toBe(false)
    s = run(s, NOW, { type: 'miss', module: 0, index: 1 })
    expect(s.modules[0].misses[1]).toBe(2) // erro depois de acertar não conta
    const ids = unlockedIds(s)
    expect(ids).toContain('retry')
    expect(ids).toContain('first-answer')
    expect(ids).not.toContain('sharp-5')
  })

  it('anuncia módulo concluído, nível e medalha de trilha', () => {
    let state = emptyState()
    const events: ProgressEvent[] = []
    for (const action of finishModule(0)) {
      const r = applyAction(state, action, ctx, NOW)
      state = r.state
      events.push(...r.events)
    }
    expect(events.filter((e) => e.kind === 'module')).toEqual([{ kind: 'module', module: 0 }])
    expect(events).toContainEqual({ kind: 'track', name: 'Fundamentos', tier: 'ouro' })
    expect(events.some((e) => e.kind === 'medal' && e.medal.id === 'track-fundamentos')).toBe(true)
    expect(events.filter((e) => e.kind === 'level').map((e) => e.level.name)).toEqual(['Explorador'])
    expect(applyAction(state, { type: 'answer', module: 0, index: 1 }, ctx, NOW).events).toEqual([])
  })

  it('anotações não contam como estudo nem dão XP, e têm limite de tamanho', () => {
    const r = applyAction(emptyState(), { type: 'note', module: 0, field: 'notes', value: 'x'.repeat(30_000) }, ctx, NOW)
    expect(r.changed).toBe(true)
    expect(r.state.modules[0].notes).toHaveLength(20_000)
    expect(r.events).toEqual([])
    expect(r.state.streak.last).toBe('')
    expect(applyAction(r.state, { type: 'note', module: 0, field: 'notes', value: 'x'.repeat(20_000) }, ctx, NOW).changed).toBe(false)
  })

  it('medalhas de trilha e de porte usam o contexto; sem contexto não liberam', () => {
    let s = run(emptyState(), NOW, ...finishModule(0))
    expect(unlockedIds(s)).toContain('track-fundamentos')
    expect(medals(s, emptyCtx).some((m) => m.id.startsWith('track-'))).toBe(false)
    expect(medals(s, emptyCtx).find((m) => m.id === 'all-sizes')?.unlocked).toBe(false) // meta 0 nunca libera
    s = run(s, NOW, ...[0, 1, 2, 3, 4].map((index): Action => ({ type: 'solveCase', index })))
    expect(unlockedIds(s)).toContain('all-sizes')
  })
})

describe('sequência de dias', () => {
  it('continua, quebra e guarda o recorde', () => {
    const s = emptyState()
    for (const d of [D(2026, 10, 14), D(2026, 10, 14), D(2026, 10, 15), D(2026, 10, 16)]) touchStreak(s, d)
    expect(s.streak).toEqual({ last: '2026-10-16', current: 3, best: 3, shieldUsed: '' })
    touchStreak(s, D(2026, 10, 20))
    expect(s.streak).toEqual({ last: '2026-10-20', current: 1, best: 3, shieldUsed: '' })
    expect(unlockedIds(s)).toContain('streak-3')
  })

  it('atravessa virada de mês, de ano e horário de verão', () => {
    const month = emptyState()
    touchStreak(month, D(2026, 2, 28))
    touchStreak(month, D(2026, 3, 1))
    expect(month.streak.current).toBe(2)
    const year = emptyState()
    touchStreak(year, D(2026, 12, 31))
    touchStreak(year, D(2027, 1, 1))
    expect(year.streak.current).toBe(2)
    const dst = emptyState()
    for (const d of [D(2026, 3, 7), D(2026, 3, 8), D(2026, 3, 9), D(2026, 10, 31), D(2026, 11, 1), D(2026, 11, 2)]) touchStreak(dst, d)
    expect(dst.streak.current).toBe(3)
  })

  it('só vale se o último estudo foi hoje ou ontem', () => {
    const s = emptyState()
    touchStreak(s, D(2026, 10, 14))
    touchStreak(s, D(2026, 10, 15))
    expect(activeStreak(s, D(2026, 10, 15))).toBe(2)
    expect(activeStreak(s, D(2026, 10, 16))).toBe(2)
    expect(activeStreak(s, D(2026, 10, 17))).toBe(0)
    expect(s.streak.best).toBe(2)
    expect([15, 16, 17].map((d) => streakStatus(s, D(2026, 10, d)))).toEqual(['done-today', 'open', 'lost'])
    expect(streakStatus(emptyState(), NOW)).toBe('none')
  })

  it('relógio voltando no tempo não zera a sequência', () => {
    const s = emptyState()
    touchStreak(s, D(2026, 10, 15))
    touchStreak(s, D(2026, 10, 16))
    touchStreak(s, D(2026, 10, 14))
    expect(s.streak).toMatchObject({ last: '2026-10-16', current: 2 })
  })

  it('escudo cobre um dia sem estudo; sem escudos suficientes a sequência recomeça', () => {
    const covered = emptyState()
    covered.shop.shields = 1
    touchStreak(covered, D(2026, 10, 10))
    touchStreak(covered, D(2026, 10, 11))
    expect(activeStreak(covered, D(2026, 10, 13))).toBe(2)
    expect(streakStatus(covered, D(2026, 10, 13))).toBe('shielded')
    const r = touchStreak(covered, D(2026, 10, 13))
    expect(r).toEqual({ extended: true, shieldsUsed: 1 })
    expect(covered.streak).toEqual({ last: '2026-10-13', current: 3, best: 3, shieldUsed: '2026-10-12' })
    expect(covered.shop.shields).toBe(0)

    const broken = emptyState()
    broken.shop.shields = 1
    touchStreak(broken, D(2026, 10, 10))
    touchStreak(broken, D(2026, 10, 11))
    expect(touchStreak(broken, D(2026, 10, 14))).toEqual({ extended: true, shieldsUsed: 0 })
    expect(broken.streak).toMatchObject({ current: 1, best: 2 })
    expect(broken.shop.shields).toBe(1) // escudo insuficiente não é gasto à toa

    const double = emptyState()
    double.shop.shields = 2
    touchStreak(double, D(2026, 10, 10))
    touchStreak(double, D(2026, 10, 13))
    expect(double.streak.current).toBe(2)
    expect(double.shop.shields).toBe(0)
  })
})

describe('níveis, faixas e melhorias', () => {
  it('níveis: limiares', () => {
    expect(levelFor(0).name).toBe('Iniciante')
    expect(levelFor(999).name).toBe('Trilha avançada')
    expect(levelFor(1000).name).toBe('Defensor de IA')
    expect(levelFor(1250).name).toBe('Guardião de IA')
    expect(levelFor(1500).number).toBe(8)
  })

  it('medalha de módulo/trilha: 40% / 70% / 100%', () => {
    expect([0, 2, 3, 4, 5, 6, 7].map((n) => tierFor(n, 7))).toEqual([null, null, 'bronze', 'bronze', 'prata', 'prata', 'ouro'])
    expect(nextTierFor(0, 7)).toEqual({ tier: 'bronze', remaining: 3 })
    expect(nextTierFor(3, 7)).toEqual({ tier: 'prata', remaining: 2 })
    expect(nextTierFor(5, 7)).toEqual({ tier: 'ouro', remaining: 2 })
    expect(nextTierFor(7, 7)).toBeNull()
    expect(nextTierFor(6, 14)).toEqual({ tier: 'prata', remaining: 4 })
    expect(nextTierFor(0, 0)).toBeNull()
  })

  it('pontos de melhoria: prioridade e limites', () => {
    let s = emptyState()
    let imp = improvements(s, ctx)
    expect(imp.map((x) => x.kind)).toEqual(['start', 'lab', 'cases'])
    expect(imp[0]).toMatchObject({ kind: 'start', module: 0 })

    s = run(s, NOW, { type: 'miss', module: 3, index: 0 }, { type: 'miss', module: 3, index: 0 })
    s = run(s, NOW, { type: 'read', module: 1, index: 0 }, { type: 'read', module: 1, index: 1 }, { type: 'read', module: 1, index: 2 }, { type: 'research', module: 1 })
    imp = improvements(s, ctx)
    expect(imp[0]).toMatchObject({ kind: 'retry', module: 3, misses: 2 })
    expect(imp[1]).toMatchObject({ kind: 'finish', module: 1, xp: 100 - 50 })
    expect(imp[1].kind === 'finish' && imp[1].left).toEqual({ reads: 0, research: false, practice: true, questions: 2 })
    expect(imp.length).toBeLessThanOrEqual(4)
    expect(improvements(s, ctx, 10).filter((x) => x.kind === 'start').map((x) => x.kind === 'start' && x.module)).toEqual([0]) // 1 só, respeitando pré-requisitos
  })

  it('o que falta em um módulo', () => {
    const s = run(emptyState(), NOW, { type: 'read', module: 0, index: 0 }, { type: 'practice', module: 0 })
    expect(moduleRemaining(s.modules[0])).toEqual({ reads: 2, research: true, practice: false, questions: 2 })
  })

  it('progresso por trilha', () => {
    const s = run(emptyState(), NOW, { type: 'read', module: 1, index: 0 }, { type: 'read', module: 1, index: 1 }, { type: 'read', module: 1, index: 2 })
    const t = trackProgress(s, ctx).find((x) => x.name === 'Ataques e defesa')
    expect(t).toMatchObject({ count: 3, steps: 3, maxSteps: 21, xp: 30, maxXp: 300, tier: null })
  })
})
