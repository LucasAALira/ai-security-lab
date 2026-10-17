import type { ProgressEvent } from './actions'
import { hasText } from './activities'
import { LIMITS } from './constants'
import { dayKey } from './dates'
import { nothing, reject, type Outcome } from './outcome'
import { emptyArchitect } from './state'
import type { ArchitectSpec, ArchitectState, ProgressContext, StudyState } from './types'

/* Modo Arquiteto. A revisão é corrigida por regras explícitas (ameaças que se aplicam, controles
   obrigatórios, posição de cada controle, custo e complexidade). A ADR não é corrigida: o texto é do
   aluno, e a autoavaliação contra a rubrica fica registrada como autoavaliação. */

export type ArchitectAction =
  /** Marca (ou desmarca) uma ameaça candidata de um componente como aplicável. */
  | { type: 'architectFind'; project: string; component: string; threat: number; on: boolean }
  /** Aplica (ou retira) um controle do catálogo em um componente. */
  | { type: 'architectApply'; project: string; component: string; control: number; on: boolean }
  /** Avalia a solução atual. A primeira avaliação aprovada rende XP uma vez. */
  | { type: 'architectEvaluate'; project: string }
  /** Registra a ADR (texto livre) e a autoavaliação contra a rubrica (0 ou 1 por critério). */
  | { type: 'architectAdr'; project: string; fields: string[]; self: number[] }
  /** Recomeça a análise. A aprovação e a ADR já registradas permanecem. */
  | { type: 'architectReset'; project: string }

export const ARCHITECT_ACTIONS = ['architectFind', 'architectApply', 'architectEvaluate', 'architectAdr', 'architectReset'] as const

export interface ThreatRef {
  component: string
  threat: number
}

export interface ArchitectGrade {
  ok: boolean
  /** Ameaças que se aplicam e não foram marcadas. */
  missed: ThreatRef[]
  /** Ameaças marcadas que não se aplicam àquele componente. */
  wrong: ThreatRef[]
  /** Ameaças críticas sem nenhum controle bem posicionado que as trate. */
  unmitigated: ThreatRef[]
  /** Controles obrigatórios que não foram aplicados em nenhum lugar adequado. */
  missingMandatory: number[]
  /** Controles aplicados em um componente onde não fazem sentido. */
  misplaced: { component: string; control: number }[]
  /** Controles bem posicionados que não tratam nada que outro controle aplicado já não trate (não reprovam). */
  redundant: number[]
  cost: number
  complexity: number
  overBudget: boolean
  overComplexity: boolean
}

export const findArchitect = (ctx: ProgressContext, id: unknown): ArchitectSpec | undefined =>
  typeof id === 'string' ? ctx.architect.find((a) => a.id === id) : undefined

const key = (r: ThreatRef) => `${r.component}:${r.threat}`

/** Aplicações bem posicionadas: [componente, controle]. */
function placements(spec: ArchitectSpec, st: ArchitectState): { component: string; control: number }[] {
  return Object.entries(st.applied).flatMap(([component, list]) =>
    list.filter((c) => c < spec.controls.length).map((control) => ({ component, control })),
  )
}

export function gradeArchitect(spec: ArchitectSpec, st: ArchitectState): ArchitectGrade {
  const missed: ThreatRef[] = []
  const wrong: ThreatRef[] = []
  for (const comp of spec.components) {
    const marked = new Set(st.found[comp.id] ?? [])
    comp.threats.forEach((t, i) => {
      if (t.real && !marked.has(i)) missed.push({ component: comp.id, threat: i })
      if (!t.real && marked.has(i)) wrong.push({ component: comp.id, threat: i })
    })
  }

  const all = placements(spec, st)
  const valid = all.filter((p) => spec.controls[p.control].places.includes(p.component))
  const misplaced = all.filter((p) => !spec.controls[p.control].places.includes(p.component))
  const validControls = [...new Set(valid.map((p) => p.control))]

  const covered = new Set(validControls.flatMap((c) => spec.controls[c].mitigates.map(key)))
  const unmitigated = spec.components.flatMap((comp) =>
    comp.threats.flatMap((t, i) => (t.real && t.critical && !covered.has(key({ component: comp.id, threat: i })) ? [{ component: comp.id, threat: i }] : [])),
  )
  const missingMandatory = spec.controls.flatMap((c, i) => (c.mandatory && !validControls.includes(i) ? [i] : []))
  const redundant = validControls.filter((c) => {
    if (spec.controls[c].mandatory) return false
    const others = new Set(validControls.filter((o) => o !== c).flatMap((o) => spec.controls[o].mitigates.map(key)))
    return spec.controls[c].mitigates.every((m) => others.has(key(m)))
  })

  // Custo e complexidade contam uma vez por controle aplicado em cada lugar (aplicar em dois lugares custa dobrado).
  const cost = all.reduce((n, p) => n + spec.controls[p.control].cost, 0)
  const complexity = all.reduce((n, p) => n + spec.controls[p.control].complexity, 0)
  const overBudget = cost > spec.budget
  const overComplexity = complexity > spec.complexity

  const ok =
    missed.length === 0 &&
    wrong.length === 0 &&
    unmitigated.length === 0 &&
    missingMandatory.length === 0 &&
    misplaced.length === 0 &&
    !overBudget &&
    !overComplexity
  return { ok, missed, wrong, unmitigated, missingMandatory, misplaced, redundant, cost, complexity, overBudget, overComplexity }
}

/** Uma solução que passa nos critérios (para testes e para validar o conteúdo): menor custo, sem redundância.
 *  Os obrigatórios entram sempre; combinam-se só os demais controles que tratam alguma ameaça crítica. */
export function solveArchitect(spec: ArchitectSpec): ArchitectState | null {
  const base = emptyArchitect()
  for (const comp of spec.components) {
    const real = comp.threats.flatMap((t, i) => (t.real ? [i] : []))
    if (real.length) base.found[comp.id] = real
  }
  const critical = new Set(spec.components.flatMap((c) => c.threats.flatMap((t, i) => (t.real && t.critical ? [key({ component: c.id, threat: i })] : []))))
  const mandatory = spec.controls.flatMap((c, i) => (c.mandatory ? [i] : []))
  const optional = spec.controls.flatMap((c, i) => (!c.mandatory && c.mitigates.some((m) => critical.has(key(m))) ? [i] : []))
  if (optional.length > 16) return null
  const build = (chosen: number[]): ArchitectState => {
    const st: ArchitectState = { ...base, applied: {} }
    for (const c of chosen) {
      const place = spec.controls[c].places[0]
      if (place) (st.applied[place] ??= []).push(c)
    }
    return st
  }
  let best: { chosen: number[]; cost: number } | null = null
  for (let mask = 0; mask < 1 << optional.length; mask++) {
    const chosen = [...mandatory, ...optional.filter((_, i) => mask & (1 << i))]
    const g = gradeArchitect(spec, build(chosen))
    if (g.ok && g.redundant.length === 0 && (!best || g.cost < best.cost)) best = { chosen, cost: g.cost }
  }
  return best ? build(best.chosen) : null
}

const small = (n: number) => Math.min(LIMITS.small, n + 1)

function stateOf(s: StudyState, id: string, today: string): ArchitectState | null {
  if (!s.architect[id] && Object.keys(s.architect).length >= LIMITS.architect) return null
  const a = (s.architect[id] ??= emptyArchitect())
  if (!a.started) a.started = today
  return a
}

function toggle(list: number[] | undefined, value: number, on: boolean): number[] | null {
  const set = new Set(list ?? [])
  if (set.has(value) === on) return null
  if (on) set.add(value)
  else set.delete(value)
  return [...set].sort((a, b) => a - b)
}

export function mutateArchitect(s: StudyState, action: ArchitectAction, ctx: ProgressContext, now: Date): Outcome {
  const spec = findArchitect(ctx, action.project)
  if (!spec) return reject('missing')
  const today = dayKey(now)

  switch (action.type) {
    case 'architectFind': {
      const comp = spec.components.find((c) => c.id === action.component)
      if (!comp || !Number.isInteger(action.threat) || action.threat < 0 || action.threat >= comp.threats.length || typeof action.on !== 'boolean') return reject('invalid')
      const a = stateOf(s, spec.id, today)
      if (!a) return reject('limit')
      const next = toggle(a.found[comp.id], action.threat, action.on)
      if (!next) return nothing
      if (next.length) a.found[comp.id] = next
      else delete a.found[comp.id]
      return { changed: true, study: true }
    }

    case 'architectApply': {
      const comp = spec.components.find((c) => c.id === action.component)
      if (!comp || !Number.isInteger(action.control) || action.control < 0 || action.control >= spec.controls.length || typeof action.on !== 'boolean') return reject('invalid')
      const a = stateOf(s, spec.id, today)
      if (!a) return reject('limit')
      const next = toggle(a.applied[comp.id], action.control, action.on)
      if (!next) return nothing
      if (next.length) a.applied[comp.id] = next
      else delete a.applied[comp.id]
      return { changed: true, study: true }
    }

    case 'architectEvaluate': {
      const a = stateOf(s, spec.id, today)
      if (!a) return reject('limit')
      a.runs = small(a.runs)
      const grade = gradeArchitect(spec, a)
      const first = grade.ok && !a.evaluated
      if (first) a.evaluated = today
      const events: ProgressEvent[] = [{ kind: 'architect', project: spec.id, passed: grade.ok, first }]
      return { changed: true, study: true, events, log: [['architect', `${spec.id}:${grade.ok ? 'aprovada' : 'revisar'}`]] }
    }

    case 'architectAdr': {
      if (!Array.isArray(action.fields) || action.fields.length !== spec.fields || !action.fields.every(hasText)) return reject('invalid')
      if (!Array.isArray(action.self) || action.self.length !== spec.rubric || !action.self.every((n) => n === 0 || n === 1)) return reject('invalid')
      const a = stateOf(s, spec.id, today)
      if (!a) return reject('limit')
      a.adr = action.fields.map((t) => t.slice(0, LIMITS.answerText))
      a.self = [...action.self]
      const first = !a.adrDone
      if (first) a.adrDone = today
      return { changed: true, study: true, events: [{ kind: 'architect-adr', project: spec.id, first }], log: [['architect', `${spec.id}:adr`]] }
    }

    case 'architectReset': {
      const a = s.architect[spec.id]
      if (!a) return nothing
      a.found = {}
      a.applied = {}
      a.adr = []
      a.self = []
      return { changed: true, log: [['architect', `${spec.id}:reinicio`]] }
    }
  }
  return nothing
}
