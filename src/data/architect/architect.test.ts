import { describe, expect, it } from 'vitest'
import { termsIn } from '@/components/rich/rich-parse'
import { ADR_MIN_CHARS, applyAction, emptyArchitect, emptyState, gradeArchitect, learningXp, medals, solveArchitect, type ArchitectState, type StudyState } from '@/lib/progress'
import { resolveRef } from '../frameworks'
import { glossaryById } from '../glossary'
import { progressContext as ctx } from '../progress-context'
import { architectProjects, architectSpecs, toArchitectSpec, type ArchitectProject } from '.'

const NOW = new Date(2026, 9, 17, 12)
const ID = /^[a-z0-9-]{1,40}$/
const act = (s: StudyState, a: Parameters<typeof applyAction>[1]) => applyAction(s, a, ctx, NOW)

function* strings(value: unknown): Generator<string> {
  if (typeof value === 'string') yield value
  else if (Array.isArray(value)) for (const v of value) yield* strings(v)
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* strings(v)
}

/** Estado com todas as ameaças reais marcadas e os controles de uma solução aplicados no primeiro lugar adequado. */
function stateFor(p: ArchitectProject, controls: string[]): ArchitectState {
  const st = emptyArchitect()
  for (const c of p.components) {
    const real = c.threats.flatMap((t, i) => (t.real ? [i] : []))
    if (real.length) st.found[c.id] = real
  }
  for (const id of controls) {
    const index = p.controls.findIndex((c) => c.id === id)
    const place = p.controls[index].places[0]
    ;(st.applied[place] ??= []).push(index)
  }
  return st
}

describe('projetos do modo Arquiteto', () => {
  it('há três projetos, com identificadores únicos e registrados no contexto do progresso', () => {
    expect(architectProjects.map((p) => p.id)).toEqual(['loja-web-api', 'app-e-backend', 'conta-multicanal'])
    expect(ctx.architect.map((a) => a.id)).toEqual(architectProjects.map((p) => p.id))
  })
})

describe.each(architectProjects.map((p) => [p.id, p] as const))('projeto %s', (_id, p) => {
  it('tem requisitos, perfis, serviços externos, restrições, fluxos e componentes clicáveis', () => {
    expect(p.requirements.functional.length).toBeGreaterThanOrEqual(3)
    expect(p.requirements.nonFunctional.length).toBeGreaterThanOrEqual(3)
    expect(p.profiles.length).toBeGreaterThanOrEqual(3)
    expect(p.externals.length).toBeGreaterThanOrEqual(2)
    expect(p.constraints.length).toBeGreaterThanOrEqual(2)
    expect(p.flows.some((f) => f.boundary)).toBe(true)
    expect(p.components.length).toBeGreaterThanOrEqual(6)
    for (const e of p.edges) {
      expect(p.components.some((c) => c.id === e.from), e.from).toBe(true)
      expect(p.components.some((c) => c.id === e.to), e.to).toBe(true)
    }
  })

  it('identificadores de componentes, ameaças e controles são válidos e únicos', () => {
    const ids = [...p.components.map((c) => c.id), ...p.components.flatMap((c) => c.threats.map((t) => t.id)), ...p.controls.map((c) => c.id)]
    for (const id of ids) expect(ID.test(id), id).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada controle fica em componentes que existem e trata ameaças que existem e se aplicam', () => {
    const threats = new Map(p.components.flatMap((c) => c.threats.map((t) => [t.id, t] as const)))
    for (const c of p.controls) {
      expect(c.places.length).toBeGreaterThan(0)
      for (const place of c.places) expect(p.components.some((x) => x.id === place), `${c.id}@${place}`).toBe(true)
      for (const m of c.mitigates) {
        expect(threats.has(m), `${c.id} -> ${m}`).toBe(true)
        expect(threats.get(m)!.real, `${c.id} trata um distrator`).toBe(true)
      }
      expect(c.note.length).toBeGreaterThan(20)
    }
  })

  it('toda ameaça crítica tem ao menos um controle, e há distratores e ameaças reais que podem ser aceitas', () => {
    const all = p.components.flatMap((c) => c.threats)
    for (const t of all.filter((x) => x.critical)) {
      expect(t.real).toBe(true)
      expect(p.controls.some((c) => c.mitigates.includes(t.id)), t.id).toBe(true)
    }
    expect(all.filter((t) => !t.real).length).toBeGreaterThanOrEqual(3)
    expect(all.filter((t) => t.real && !t.critical).length).toBeGreaterThanOrEqual(2)
    for (const t of all) {
      expect(t.stride.length).toBeGreaterThan(0)
      expect(t.why.length).toBeGreaterThan(20)
    }
  })

  it('diferencia controles obrigatórios de escolhas: há ameaças críticas com mais de um controle possível', () => {
    expect(p.controls.some((c) => c.mandatory)).toBe(true)
    expect(p.controls.some((c) => !c.mandatory)).toBe(true)
    const alternatives = p.components.flatMap((c) => c.threats).filter((t) => t.critical && p.controls.filter((c) => c.mitigates.includes(t.id)).length >= 2)
    expect(alternatives.length).toBeGreaterThanOrEqual(2)
  })

  it('aceita mais de uma solução defensável, e cada solução comentada passa nos critérios', () => {
    expect(p.solutions.length).toBeGreaterThanOrEqual(2)
    const spec = toArchitectSpec(p)
    for (const s of p.solutions) {
      for (const id of s.controls) expect(p.controls.some((c) => c.id === id), id).toBe(true)
      const g = gradeArchitect(spec, stateFor(p, s.controls))
      expect(g, s.title).toMatchObject({ ok: true, overBudget: false, overComplexity: false })
    }
    const sets = p.solutions.map((s) => [...s.controls].sort().join(','))
    expect(new Set(sets).size).toBe(sets.length)
  })

  it('aplicar todos os controles estoura o orçamento ou a complexidade: mais ferramentas não é melhor', () => {
    const g = gradeArchitect(toArchitectSpec(p), stateFor(p, p.controls.map((c) => c.id)))
    expect(g.overBudget || g.overComplexity).toBe(true)
    expect(g.ok).toBe(false)
  })

  it('só os controles obrigatórios não bastam', () => {
    const g = gradeArchitect(toArchitectSpec(p), stateFor(p, p.controls.filter((c) => c.mandatory).map((c) => c.id)))
    expect(g.ok).toBe(false)
    expect(g.unmitigated.length).toBeGreaterThan(0)
  })

  it('o motor encontra uma solução de menor custo', () => {
    const spec = architectSpecs.find((a) => a.id === p.id)!
    const solved = solveArchitect(spec)
    expect(solved).not.toBeNull()
    expect(gradeArchitect(spec, solved!).ok).toBe(true)
  })

  it('a ADR tem os sete campos, rubrica e resposta comentada por campo', () => {
    expect(p.adr.fields.map((f) => f.label)).toEqual(['Contexto', 'Decisão', 'Alternativas', 'Justificativa', 'Consequências', 'Risco residual', 'Plano de validação'])
    expect(p.adr.model).toHaveLength(p.adr.fields.length)
    expect(p.adr.rubric.length).toBeGreaterThanOrEqual(5)
    for (const m of p.adr.model) expect(m.length).toBeGreaterThan(60)
  })

  it('todas as correspondências com frameworks existem no registro verificado', () => {
    const refs = [...p.components.flatMap((c) => c.threats.flatMap((t) => t.refs ?? [])), ...p.refs.flatMap((r) => (r.framework ? [r.framework] : []))]
    for (const r of refs) expect(resolveRef(r), `${r.framework} ${r.id}`).toBeTruthy()
  })

  it('usa só endereços .example e termos de glossário que existem', () => {
    const content = { ...p, refs: [] }
    for (const text of strings(content)) {
      for (const match of text.matchAll(/https?:\/\/([^/\s"'`)]+)/g)) expect(match[1]).toMatch(/\.example(:\d+)?$/)
      for (const id of termsIn(text)) expect(glossaryById(id), id).toBeTruthy()
    }
  })
})

describe('motor do modo Arquiteto', () => {
  const p = architectProjects[0]
  const spec = architectSpecs[0]
  const sol = p.solutions[0]

  function solved(): StudyState {
    let s = emptyState()
    const target = stateFor(p, sol.controls)
    for (const [component, list] of Object.entries(target.found)) for (const threat of list) s = act(s, { type: 'architectFind', project: p.id, component, threat, on: true }).state
    for (const [component, list] of Object.entries(target.applied)) for (const control of list) s = act(s, { type: 'architectApply', project: p.id, component, control, on: true }).state
    return s
  }

  it('recusa projeto, componente ou posição inexistentes', () => {
    const s = emptyState()
    expect(act(s, { type: 'architectEvaluate', project: 'nao-existe' }).rejected).toBe('missing')
    expect(act(s, { type: 'architectFind', project: p.id, component: 'nao-existe', threat: 0, on: true }).rejected).toBe('invalid')
    expect(act(s, { type: 'architectFind', project: p.id, component: 'site', threat: 99, on: true }).rejected).toBe('invalid')
    expect(act(s, { type: 'architectApply', project: p.id, component: 'site', control: 99, on: true }).rejected).toBe('invalid')
  })

  it('marcar e desmarcar é idempotente', () => {
    let s = emptyState()
    s = act(s, { type: 'architectFind', project: p.id, component: 'site', threat: 0, on: true }).state
    expect(act(s, { type: 'architectFind', project: p.id, component: 'site', threat: 0, on: true }).changed).toBe(false)
    s = act(s, { type: 'architectFind', project: p.id, component: 'site', threat: 0, on: false }).state
    expect(s.architect[p.id].found.site).toBeUndefined()
  })

  it('a avaliação reprovada não rende XP; a aprovada rende uma vez só, e a conquista é liberada', () => {
    let s = emptyState()
    s = act(s, { type: 'architectFind', project: p.id, component: 'site', threat: 0, on: true }).state
    const fail = act(s, { type: 'architectEvaluate', project: p.id })
    expect(fail.events).toContainEqual({ kind: 'architect', project: p.id, passed: false, first: false })
    expect(learningXp(fail.state, ctx)).toBe(0)

    s = solved()
    const ok = act(s, { type: 'architectEvaluate', project: p.id })
    expect(ok.events).toContainEqual({ kind: 'architect', project: p.id, passed: true, first: true })
    expect(ok.state.architect[p.id].evaluated).toBe('2026-10-17')
    const xp = learningXp(ok.state, ctx)
    expect(xp).toBeGreaterThan(0)
    const again = act(ok.state, { type: 'architectEvaluate', project: p.id })
    expect(again.events).toContainEqual({ kind: 'architect', project: p.id, passed: true, first: false })
    expect(learningXp(again.state, ctx)).toBe(xp)
    expect(medals(again.state, ctx).find((m) => m.id === 'fronteiras-definidas')?.unlocked).toBe(true)
    expect(medals(again.state, ctx).find((m) => m.id === 'revisao-web')?.unlocked).toBe(true)
  })

  it('a ADR exige os sete campos preenchidos e uma autoavaliação por critério, e rende XP uma vez', () => {
    let s = emptyState()
    const fields = p.adr.fields.map(() => 'x'.repeat(ADR_MIN_CHARS))
    const self = p.adr.rubric.map(() => 1)
    expect(act(s, { type: 'architectAdr', project: p.id, fields: fields.slice(1), self }).rejected).toBe('invalid')
    expect(act(s, { type: 'architectAdr', project: p.id, fields: ['curto', ...fields.slice(1)], self }).rejected).toBe('invalid')
    expect(act(s, { type: 'architectAdr', project: p.id, fields, self: [2, ...self.slice(1)] }).rejected).toBe('invalid')
    const first = act(s, { type: 'architectAdr', project: p.id, fields, self })
    expect(first.events).toContainEqual({ kind: 'architect-adr', project: p.id, first: true })
    s = first.state
    const xp = learningXp(s, ctx)
    s = act(s, { type: 'architectAdr', project: p.id, fields, self: self.map(() => 0) }).state
    expect(learningXp(s, ctx)).toBe(xp)
    expect(s.architect[p.id].self.every((n) => n === 0)).toBe(true)
  })

  it('recomeçar limpa a análise e mantém a aprovação e a ADR já registradas', () => {
    let s = solved()
    s = act(s, { type: 'architectEvaluate', project: p.id }).state
    s = act(s, { type: 'architectReset', project: p.id }).state
    expect(s.architect[p.id].found).toEqual({})
    expect(s.architect[p.id].applied).toEqual({})
    expect(s.architect[p.id].evaluated).toBe('2026-10-17')
  })

  it('controle aplicado no lugar errado reprova e é apontado', () => {
    let s = solved()
    const webhook = p.controls.findIndex((c) => c.id === 'webhook')
    s = act(s, { type: 'architectApply', project: p.id, component: 'pedidos', control: webhook, on: false }).state
    s = act(s, { type: 'architectApply', project: p.id, component: 'pagamentos', control: webhook, on: true }).state
    const g = gradeArchitect(spec, s.architect[p.id])
    expect(g.ok).toBe(false)
    expect(g.misplaced).toContainEqual({ component: 'pagamentos', control: webhook })
  })

  it('marcar um distrator reprova, mesmo com todos os controles certos', () => {
    let s = solved()
    const decoy = p.components.find((c) => c.id === 'gateway')!.threats.findIndex((t) => !t.real)
    s = act(s, { type: 'architectFind', project: p.id, component: 'gateway', threat: decoy, on: true }).state
    const g = gradeArchitect(spec, s.architect[p.id])
    expect(g.ok).toBe(false)
    expect(g.wrong).toContainEqual({ component: 'gateway', threat: decoy })
  })

  it('o estado do Arquiteto sobrevive à limpeza do progresso (exportação e importação)', async () => {
    const { cleanState } = await import('@/lib/progress')
    let s = solved()
    s = act(s, { type: 'architectEvaluate', project: p.id }).state
    const back = cleanState(JSON.parse(JSON.stringify(s)))
    expect(back.architect[p.id]).toEqual(s.architect[p.id])
  })
})
