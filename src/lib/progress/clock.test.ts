import { describe, expect, it } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { formatDuration } from '@/lib/format'
import { applyAction, cleanState, emptyState, loadState, saveState, STUDY_CLOCK, studyMinutesToday, summary, type Action, type StudyState } from '.'
import { tickStudyClock, touchStudy } from './streak'

const ctx = progressContext
const dia = (d: number, h = 12) => new Date(2026, 9, d, h)

/** Soma `n` tiques de um minuto no mesmo instante. */
function tick(state: StudyState, now: Date, n: number, minutes?: number): StudyState {
  let out = state
  const action: Action = minutes === undefined ? { type: 'studyTick' } : { type: 'studyTick', minutes }
  for (let i = 0; i < n; i++) out = applyAction(out, action, ctx, now).state
  return out
}

describe('relógio de estudo', () => {
  it('começa zerado', () => {
    const s = emptyState()
    expect(s.study.minutes).toBe(0)
    expect(s.study.total).toBe(0)
    expect(s.study.minutesToday).toBe(0)
    expect(s.study.clockDay).toBe('')
  })

  it('soma um minuto por tique e guarda o dia', () => {
    const s = tick(emptyState(), dia(20), 3)
    expect(s.study.minutes).toBe(3)
    expect(s.study.minutesToday).toBe(3)
    expect(s.study.clockDay).toBe('2026-10-20')
    expect(studyMinutesToday(s, dia(20, 23))).toBe(3)
  })

  it('reinicia a conta do dia na virada, mantendo o total', () => {
    const s = tick(tick(emptyState(), dia(20), 5), dia(21), 2)
    expect(s.study.minutes).toBe(7)
    expect(s.study.minutesToday).toBe(2)
    expect(studyMinutesToday(s, dia(20))).toBe(0)
  })

  it('respeita o teto diário', () => {
    const s = tick(emptyState(), dia(20), STUDY_CLOCK.perDay / STUDY_CLOCK.maxPerTick + 3, STUDY_CLOCK.maxPerTick + 99)
    expect(s.study.minutesToday).toBe(STUDY_CLOCK.perDay)
    expect(s.study.minutes).toBe(STUDY_CLOCK.perDay)
    const repetido = applyAction(s, { type: 'studyTick' }, ctx, dia(20))
    expect(repetido.changed).toBe(false)
  })

  it('limita quanto um único tique pode somar', () => {
    const s = tick(emptyState(), dia(20), 1, 120)
    expect(s.study.minutes).toBe(STUDY_CLOCK.maxPerTick)
  })

  it('ignora tique sem minutos, negativo ou inválido', () => {
    const s = emptyState()
    for (const minutes of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(applyAction(s, { type: 'studyTick', minutes }, ctx, dia(20)).changed).toBe(false)
    }
    expect(tickStudyClock(cleanState({}), dia(20), 0)).toBe(false)
  })

  it('não rende XP, não conta dia de estudo nem sequência', () => {
    const antes = emptyState()
    const resultado = applyAction(antes, { type: 'studyTick' }, ctx, dia(20))
    expect(resultado.changed).toBe(true)
    expect(resultado.events).toEqual([])
    const s = resultado.state
    expect(summary(s, ctx).xp).toBe(summary(antes, ctx).xp)
    expect(s.study.last).toBe('')
    expect(s.study.current).toBe(0)
    expect(s.study.total).toBe(0)
    expect(s.streak.last).toBe('')
    expect(s.learner.id).toBe(antes.learner.id)
  })
})

describe('dias com atividade', () => {
  it('conta um dia por dia de estudo, inclusive depois de uma falha', () => {
    const s = emptyState()
    touchStudy(s, dia(20))
    touchStudy(s, dia(20, 22))
    expect(s.study.total).toBe(1)
    touchStudy(s, dia(21))
    touchStudy(s, dia(25))
    expect(s.study.total).toBe(3)
    expect(s.study.current).toBe(1)
    expect(s.study.best).toBe(2)
  })

  it('cresce com o estudo de verdade', () => {
    const s = applyAction(emptyState(), { type: 'read', module: 0, index: 0 }, ctx, dia(20)).state
    expect(s.study.total).toBe(1)
    expect(s.study.minutes).toBe(0)
  })
})

describe('compatibilidade do progresso salvo', () => {
  it('aproveita o que dá para afirmar de um estado sem os campos novos', () => {
    const s = cleanState({ study: { last: '2026-10-20', current: 4, best: 6 } })
    expect(s.study.total).toBe(4)
    expect(s.study.minutes).toBe(0)
    expect(s.study.minutesToday).toBe(0)
    expect(s.study.clockDay).toBe('')
  })

  it('nunca deixa o total abaixo da sequência, e descarta valor absurdo', () => {
    expect(cleanState({ study: { last: '2026-10-20', current: 9, best: 9, total: 2 } }).study.total).toBe(9)
    expect(cleanState({ study: { total: -3, minutes: 'muitas', minutesToday: 9e9, clockDay: 'ontem' } }).study).toMatchObject({
      total: 0,
      minutes: 0,
      minutesToday: STUDY_CLOCK.perDay,
      clockDay: '',
    })
  })

  it('sobrevive a gravar e reler', () => {
    const store: Record<string, string> = {}
    const storage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => void (store[k] = v) }
    const s = tick(emptyState(), dia(20), 7)
    saveState(storage, s)
    const lido = loadState(storage)
    expect(lido.study.minutes).toBe(7)
    expect(lido.study.minutesToday).toBe(7)
    expect(lido.study.clockDay).toBe('2026-10-20')
  })
})

describe('formato de duração', () => {
  it('escreve minutos e horas em português', () => {
    expect(formatDuration(0)).toBe('0 min')
    expect(formatDuration(1)).toBe('1 min')
    expect(formatDuration(59)).toBe('59 min')
    expect(formatDuration(60)).toBe('1 h')
    expect(formatDuration(200)).toBe('3 h 20 min')
    expect(formatDuration(60 * 1234)).toBe('1.234 h')
  })

  it('não quebra com entrada estranha', () => {
    expect(formatDuration(-10)).toBe('0 min')
    expect(formatDuration(Number.NaN)).toBe('0 min')
    expect(formatDuration(90.4)).toBe('1 h 30 min')
  })
})
