import { describe, expect, it } from 'vitest'
import { termsIn } from '@/components/rich/rich-parse'
import {
  applyAction,
  emptyState,
  findMission,
  gradeActivity,
  medals,
  missionPassed,
  solveActivity,
  type Action,
  type StudyState,
} from '@/lib/progress'
import { toActivitySpec, type DecisionOption } from '../campaigns'
import { glossaryById } from '../glossary'
import { resolveRef } from '../frameworks'
import { progressContext as ctx } from '../progress-context'
import { reviewActivities, reviewAsMission, reviewSamples, reviewSpecs } from '.'
import { VERDICTS } from './types'

const NOW = new Date(2026, 9, 30, 12)
const ID = /^[a-z0-9-]{1,40}$/
const IP = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g
/* Faixas aceitas: as reservadas para documentação e o endereço de ligação local usado pelos
   serviços de metadados das nuvens, que é um endereço técnico e não o host de alguém. */
const RESERVED = /^(198\.51\.100|203\.0\.113|192\.0\.2|169\.254)\./
const act = (s: StudyState, a: Action) => applyAction(s, a, ctx, NOW).state

function* strings(value: unknown): Generator<string> {
  if (typeof value === 'string') yield value
  else if (Array.isArray(value)) for (const v of value) yield* strings(v)
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* strings(v)
}

describe('treino de análise de código', () => {
  it('tem amostras suficientes, com identificadores únicos e áreas variadas', () => {
    expect(reviewSamples.length).toBeGreaterThanOrEqual(12)
    const ids = reviewSamples.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(ID.test(id), id).toBe(true)
    expect(new Set(reviewSamples.map((s) => s.area)).size).toBeGreaterThanOrEqual(5)
  })

  it('treina os três vereditos, com falsos positivos de verdade', () => {
    const conta = (v: string) => reviewSamples.filter((s) => s.verdict === v).length
    expect(conta('procede')).toBeGreaterThanOrEqual(5)
    expect(conta('falso-positivo')).toBeGreaterThanOrEqual(4)
    expect(conta('falta-contexto')).toBeGreaterThanOrEqual(2)
  })

  it('os identificadores não colidem com os das missões e dos dossiês', () => {
    const outros = ctx.missions.filter((m) => m.kind !== 'review').map((m) => m.id)
    for (const s of reviewSamples) expect(outros).not.toContain(s.id)
    expect(reviewSpecs.every((s) => s.kind === 'review')).toBe(true)
  })

  it('não usa endereços nem endereços IP fora dos reservados para exemplo', () => {
    for (const s of reviewSamples) {
      for (const text of strings(s)) {
        for (const m of text.matchAll(/https?:\/\/([^/\s"'`)<>]+)/g)) {
          const host = m[1].replace(/:\d+$/, '')
          expect(host.endsWith('.example') || RESERVED.test(host), `${s.id}: ${host}`).toBe(true)
        }
        for (const m of text.matchAll(IP)) expect(RESERVED.test(m[1]), `${s.id}: ${m[1]}`).toBe(true)
      }
    }
  })
})

describe.each(reviewSamples.map((s) => [s.id, s] as const))('amostra %s', (_id, s) => {
  const atividades = reviewActivities(s)
  const options = (a: (typeof atividades)[number]): DecisionOption[] => (a.kind === 'decide' ? a.options : [])

  it('descreve o achado, o contexto e o trecho analisado', () => {
    expect(s.title.length).toBeGreaterThan(10)
    expect(s.subtitle.length).toBeGreaterThan(40)
    expect(s.context.length).toBeGreaterThanOrEqual(2)
    expect(s.code.length).toBeGreaterThanOrEqual(8)
    expect(s.finding.line).toBeGreaterThanOrEqual(1)
    expect(s.finding.line).toBeLessThanOrEqual(s.code.length)
    expect(s.finding.message.length).toBeGreaterThan(20)
    expect(s.file).toMatch(/\.[a-z]+$/)
  })

  it('explica cada veredito possível, inclusive os dois descartados', () => {
    expect(s.verdictFeedback).toHaveLength(VERDICTS.length)
    for (const f of s.verdictFeedback) expect(f.length).toBeGreaterThan(60)
    expect(new Set(s.verdictFeedback).size).toBe(VERDICTS.length)
    expect(s.verdictExplain.length).toBeGreaterThan(60)
  })

  it('os sinais têm distratores e explicação por opção', () => {
    expect(s.signals.length).toBeGreaterThanOrEqual(4)
    expect(s.correctSignals.length).toBeGreaterThan(0)
    expect(s.correctSignals.length).toBeLessThan(s.signals.length)
    for (const o of s.signals) expect(o.feedback.length).toBeGreaterThan(20)
    for (const i of s.correctSignals) expect(i).toBeLessThan(s.signals.length)
  })

  it('a decisão seguinte tem uma melhor resposta e explica por que as outras não bastam', () => {
    const decisao = atividades.find((a) => a.kind === 'decide')!
    const opts = options(decisao)
    expect(opts.length).toBeGreaterThanOrEqual(4)
    expect(opts.filter((o) => o.quality === 'best')).toHaveLength(1)
    expect(opts.some((o) => o.quality === 'partial' || o.quality === 'poor')).toBe(true)
    expect(new Set(opts.map((o) => o.feedback)).size).toBe(opts.length)
    for (const o of opts) {
      expect(o.feedback.length).toBeGreaterThan(40)
      expect(o.consequence.length).toBeGreaterThan(30)
    }
  })

  it('cada etapa tem enunciado, três dicas distintas e explicação', () => {
    for (const a of atividades) {
      expect(a.prompt.length).toBeGreaterThan(20)
      expect(a.explain.length).toBeGreaterThan(40)
      if (a.kind === 'spot') continue
      expect(a.hints).toHaveLength(3)
      expect(new Set(a.hints).size).toBe(3)
      if (a.kind !== 'decide' && a.kind !== 'adr') {
        const sol = solveActivity(toActivitySpec(a))
        expect(sol).not.toBeNull()
        expect(gradeActivity(toActivitySpec(a), sol!).ok).toBe(true)
      }
    }
  })

  it('fecha com solução, risco residual e como validar', () => {
    expect(s.review.solution.length).toBeGreaterThanOrEqual(3)
    expect(s.review.residual.length).toBeGreaterThan(60)
    expect(s.review.validation.length).toBeGreaterThan(60)
    expect(s.closing.length).toBeGreaterThan(40)
  })

  it('só cita termos do glossário e itens de framework que existem', () => {
    for (const text of strings(s)) for (const id of termsIn(text)) expect(glossaryById(id), id).toBeTruthy()
    expect((s.frameworks ?? []).length).toBeGreaterThanOrEqual(1)
    for (const ref of s.frameworks ?? []) expect(resolveRef(ref), `${ref.framework} ${ref.id}`).toBeDefined()
  })

  it('é concluível pelo motor, rende XP uma vez e libera a conquista da área', () => {
    const spec = findMission(ctx, s.id)!
    expect(spec.kind).toBe('review')
    const content = reviewAsMission(s)
    expect(content.activities).toHaveLength(spec.activities.length)
    let st = act(emptyState(), { type: 'missionStart', mission: s.id })
    for (const a of content.activities) {
      const answer =
        a.kind === 'decide' ? { v: [a.options.findIndex((o) => o.quality === 'best')] } : solveActivity(toActivitySpec(a))!
      st = act(st, { type: 'missionAnswer', mission: s.id, activity: a.id, answer })
    }
    st = act(st, { type: 'missionFinish', mission: s.id })
    expect(missionPassed(st, spec)).toBe(true)
    expect(medals(st, ctx).find((m) => m.id === 'triagem-certeira')?.unlocked).toBe(true)
  })

  it('cada decisão errada tem saída: dá para refazer e concluir', () => {
    const spec = findMission(ctx, s.id)!
    const content = reviewAsMission(s)
    const decisao = content.activities.find((a) => a.kind === 'decide')!
    if (decisao.kind !== 'decide') return
    for (const [k] of decisao.options.entries()) {
      let st = act(emptyState(), { type: 'missionStart', mission: s.id })
      for (const a of content.activities) {
        if (a.id === decisao.id) {
          st = act(st, { type: 'missionAnswer', mission: s.id, activity: a.id, answer: { v: [k] } })
          st = act(st, { type: 'missionRewind', mission: s.id, activity: a.id })
          st = act(st, { type: 'missionAnswer', mission: s.id, activity: a.id, answer: { v: [decisao.options.findIndex((o) => o.quality === 'best')] } })
          continue
        }
        st = act(st, { type: 'missionAnswer', mission: s.id, activity: a.id, answer: solveActivity(toActivitySpec(a))! })
      }
      st = act(st, { type: 'missionFinish', mission: s.id })
      expect(missionPassed(st, spec)).toBe(true)
    }
  })
})
