import { describe, expect, it } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { applyAction, emptyState, findMission, missionMaxXp, missionPassed, learningStats, missionXp, summary, type Action, type StudyState } from '@/lib/progress'
import { frameworks } from '../frameworks'
import { errantes, errantSpecs, erranteById } from '.'

const ctx = progressContext
const agora = new Date(2026, 10, 2, 12)

describe('guardiões errantes', () => {
  it('cada errante tem nome, epíteto, fala e exercício completo', () => {
    expect(errantes.length).toBeGreaterThanOrEqual(2)
    expect(new Set(errantes.map((e) => e.id)).size).toBe(errantes.length)
    for (const e of errantes) {
      expect(e.nome.length, e.id).toBeGreaterThan(3)
      expect(e.epiteto.length, e.id).toBeGreaterThan(15)
      expect(e.fala.length, e.id).toBeGreaterThan(40)
      expect(e.resumo.length, e.id).toBeGreaterThan(40)
      expect(['gelo', 'veneno']).toContain(e.elemento)
      expect(e.missao.id, e.id).toBe(e.id)
      expect(e.missao.activities.length, e.id).toBeGreaterThanOrEqual(3)
      expect(e.missao.evidence.length, e.id).toBeGreaterThanOrEqual(2)
      expect(e.missao.review.solution.length, e.id).toBeGreaterThanOrEqual(2)
      expect(e.missao.closing.length, e.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('toda atividade tem três dicas e explicação', () => {
    for (const e of errantes) {
      for (const a of e.missao.activities) {
        if (a.kind === 'spot') continue
        expect(a.hints.length, `${e.id}/${a.id}`).toBe(3)
        expect(a.explain.length, `${e.id}/${a.id}`).toBeGreaterThan(60)
        if (a.kind === 'multi') {
          expect(a.correct.length, `${e.id}/${a.id}`).toBeGreaterThan(0)
          for (const o of a.options) expect(o.feedback.length, `${e.id}/${a.id}: ${o.text}`).toBeGreaterThan(15)
        }
        if (a.kind === 'decide') {
          expect(a.options.some((o) => o.quality === 'best'), `${e.id}/${a.id}`).toBe(true)
          for (const o of a.options) expect(o.consequence.length, `${e.id}/${a.id}`).toBeGreaterThan(15)
        }
      }
    }
  })

  it('só usa dados sintéticos: host .example e faixas reservadas', () => {
    const texto = JSON.stringify(errantes)
    // só interessa o que tem cara de endereço de serviço: ponto seguido de domínio de topo conhecido
    for (const host of texto.match(/[a-z0-9-]+\.(com|net|org|br|io|dev|app|cloud|example)\b/gi) ?? []) {
      expect(host.toLowerCase(), `host não sintético: ${host}`).toMatch(/\.example$/)
    }
    for (const ip of texto.match(/\b\d{1,3}(\.\d{1,3}){3}\b/g) ?? []) {
      expect(ip, `IP fora das faixas de documentação: ${ip}`).toMatch(/^(198\.51\.100|203\.0\.113|192\.0\.2)\./)
    }
  })

  it('as referências apontam para itens que existem no registro verificado', () => {
    for (const e of errantes) {
      for (const r of e.missao.refs) {
        if (!r.framework) continue
        const fw = frameworks.find((f) => f.id === r.framework!.framework)
        expect(fw, `framework desconhecido: ${r.framework.framework}`).toBeDefined()
        expect(fw!.items?.some((i) => i.id === r.framework!.id), `item inexistente: ${r.framework.framework}/${r.framework.id}`).toBe(true)
      }
    }
  })

  it('entram no contexto de progresso com o tipo próprio', () => {
    expect(errantSpecs.length).toBe(errantes.length)
    for (const spec of errantSpecs) {
      expect(spec.kind).toBe('errante')
      expect(spec.campaign).toBeNull()
      expect(findMission(ctx, spec.id)).toBeDefined()
    }
  })
})

describe('combater um errante', () => {
  /** Responde certo a todas as atividades do errante. */
  function vencer(estado: StudyState, id: string): StudyState {
    const e = erranteById(id)!
    let s = applyAction(estado, { type: 'missionStart', mission: id }, ctx, agora).state
    e.missao.activities.forEach((a, i) => {
      const escolha = a.kind === 'multi' ? a.correct : a.kind === 'decide' ? [a.options.findIndex((o) => o.quality === 'best')] : []
      const acao: Action = { type: 'missionAnswer', mission: id, activity: a.id, answer: { v: escolha } }
      s = applyAction(s, acao, ctx, agora).state
      expect(s.missions[id]?.credited, `${id}/${a.id} (${i})`).toContain(a.id)
    })
    // o combate só conta como vencido depois de encerrado
    return applyAction(s, { type: 'missionFinish', mission: id }, ctx, agora).state
  }

  it('rende XP próprio e marca o errante como derrubado', () => {
    const antes = emptyState()
    const depois = vencer(antes, 'errante-geada')
    const spec = findMission(ctx, 'errante-geada')!
    expect(missionPassed(depois, spec)).toBe(true)
    expect(missionXp(depois, spec)).toBe(missionMaxXp(spec))
    // o total ganho inclui o bônus da conquista que o combate desbloqueia
    const ganho = summary(depois, ctx).xp - summary(antes, ctx).xp
    expect(ganho).toBeGreaterThanOrEqual(missionMaxXp(spec))
  })

  it('não conta como missão de campanha', () => {
    const s = vencer(emptyState(), 'errante-peconha')
    const aprendizado = learningStats(s, ctx)
    expect(aprendizado.missionsPassed).toBe(0)
    expect(aprendizado.missionsStarted).toBe(0)
    expect(aprendizado.errantesPassed).toBe(1)
  })

  it('derrotar os dois desbloqueia as conquistas dos errantes', () => {
    let s = vencer(emptyState(), 'errante-geada')
    expect(Object.keys(s.badges)).toContain('cacador-de-errantes')
    s = vencer(s, 'errante-peconha')
    expect(Object.keys(s.badges)).toContain('fim-dos-errantes')
  })
})
