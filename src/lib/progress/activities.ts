import { ADR_MIN_CHARS } from './constants'
import type { Answer, Quality } from './types'

/* Atividades das missões: gabarito (sem textos) e correção por regras. A mesma função serve à
   interface (feedback) e ao motor (crédito e XP), então os dois nunca divergem. Nenhuma correção
   procura palavras-chave em texto livre: respostas abertas só têm rubrica e autoavaliação. */

export interface OptionSpec {
  quality: Quality
  /** Marcas que a escolha deixa na simulação (por exemplo `evidenciaPreservada`). */
  flags: string[]
}

export type ActivitySpec =
  /** Uma decisão com consequências. Mais de uma opção pode ser defensável. */
  | { id: string; kind: 'decide'; options: OptionSpec[] }
  /** Decisão arquitetural guiada: escolha da decisão + campos de texto + autoavaliação por rubrica. */
  | { id: string; kind: 'adr'; options: OptionSpec[]; rubric: number; fields: number }
  /** Marcar tudo o que se aplica (comparação de código, inspeção de diagrama, afirmações). */
  | { id: string; kind: 'multi'; options: number; correct: number[] }
  /** Colocar em ordem. `before` lista os pares (a, b) em que a vem antes de b. */
  | { id: string; kind: 'order'; items: number; before: [number, number][] }
  /** Associar cada linha a uma alternativa (ameaça -> controle, apontamento -> classificação). */
  | { id: string; kind: 'assign'; rows: number; choices: number; accept: number[][] }
  /** Escolher controles dentro de um orçamento. */
  | { id: string; kind: 'budget'; budget: number; costs: number[]; covers: number[][]; critical: number[]; risks: number; mandatory: number[] }
  /** Usa um desafio do laboratório de código; o crédito é o do próprio desafio. */
  | { id: string; kind: 'spot'; challenge: string }

export type ActivityKind = ActivitySpec['kind']

export interface Grade {
  /** A resposta tem forma válida para a atividade. */
  valid: boolean
  /** Atende aos critérios (nas decisões: a qualidade é `best` ou `good`). */
  ok: boolean
  quality: Quality | null
  /** Posições a revisar: opções erradas (multi), itens que violam a ordem, linhas erradas (assign), riscos sem cobertura (budget). */
  bad: number[]
  /** Só em `budget`. */
  budget: { total: number; over: boolean; uncovered: number[]; missing: number[]; redundant: number[] } | null
  flags: string[]
}

const invalid: Grade = { valid: false, ok: false, quality: null, bad: [], budget: null, flags: [] }

const isInts = (v: unknown, size: number, opts: { unique?: boolean; length?: number } = {}): v is number[] =>
  Array.isArray(v) &&
  v.every((n) => Number.isInteger(n) && n >= 0 && n < size) &&
  (!opts.unique || new Set(v).size === v.length) &&
  (opts.length === undefined || v.length === opts.length)

export const isGood = (q: Quality | null | undefined): boolean => q === 'best' || q === 'good'

/** Texto livre mínimo para uma ADR: só confere que há conteúdo, nunca o que ele diz. */
export const hasText = (t: unknown): boolean => typeof t === 'string' && t.trim().length >= ADR_MIN_CHARS

export function gradeActivity(spec: ActivitySpec, answer: unknown): Grade {
  const a = (typeof answer === 'object' && answer !== null ? answer : {}) as Partial<Answer>
  const v = a.v
  switch (spec.kind) {
    case 'spot':
      return invalid

    case 'decide': {
      if (!isInts(v, spec.options.length, { length: 1 })) return invalid
      const opt = spec.options[v[0]]
      return { valid: true, ok: isGood(opt.quality), quality: opt.quality, bad: [], budget: null, flags: opt.flags }
    }

    case 'adr': {
      // v = [decisão, ...rubrica (0 ou 1 por critério)]; t = campos de texto.
      if (!Array.isArray(v) || v.length !== 1 + spec.rubric) return invalid
      if (!isInts([v[0]], spec.options.length)) return invalid
      if (!v.slice(1).every((n) => n === 0 || n === 1)) return invalid
      if (!Array.isArray(a.t) || a.t.length !== spec.fields || !a.t.every(hasText)) return invalid
      const opt = spec.options[v[0]]
      return { valid: true, ok: isGood(opt.quality), quality: opt.quality, bad: [], budget: null, flags: opt.flags }
    }

    case 'multi': {
      if (!isInts(v, spec.options, { unique: true })) return invalid
      const chosen = new Set(v)
      const want = new Set(spec.correct)
      const bad = [...new Set([...v.filter((n) => !want.has(n)), ...spec.correct.filter((n) => !chosen.has(n))])].sort((x, y) => x - y)
      const ok = v.length > 0 && bad.length === 0
      return { valid: true, ok, quality: ok ? 'best' : null, bad, budget: null, flags: [] }
    }

    case 'order': {
      // v é a ordem escolhida: v[posição] = item.
      if (!isInts(v, spec.items, { unique: true, length: spec.items })) return invalid
      const pos = new Map(v.map((item, i) => [item, i]))
      const broken = spec.before.filter(([x, y]) => (pos.get(x) ?? 0) > (pos.get(y) ?? 0))
      const bad = [...new Set(broken.flatMap(([x, y]) => [x, y]))].sort((p, q) => p - q)
      const ok = broken.length === 0
      return { valid: true, ok, quality: ok ? 'best' : null, bad, budget: null, flags: [] }
    }

    case 'assign': {
      if (!Array.isArray(v) || v.length !== spec.rows || !v.every((n) => Number.isInteger(n) && n >= 0 && n < spec.choices)) return invalid
      const bad = v.flatMap((choice, row) => (spec.accept[row].includes(choice) ? [] : [row]))
      const ok = bad.length === 0
      return { valid: true, ok, quality: ok ? 'best' : null, bad, budget: null, flags: [] }
    }

    case 'budget': {
      if (!isInts(v, spec.costs.length, { unique: true })) return invalid
      const chosen = new Set(v)
      const total = v.reduce((n, c) => n + spec.costs[c], 0)
      const covered = new Set(v.flatMap((c) => spec.covers[c]))
      const uncovered = spec.critical.filter((r) => !covered.has(r))
      const missing = spec.mandatory.filter((c) => !chosen.has(c))
      // Controle redundante: não cobre nada que outro controle escolhido já não cubra.
      const redundant = v.filter((c) => {
        if (spec.mandatory.includes(c)) return false
        const others = new Set(v.filter((o) => o !== c).flatMap((o) => spec.covers[o]))
        return spec.covers[c].every((r) => others.has(r))
      })
      const over = total > spec.budget
      const ok = v.length > 0 && !over && uncovered.length === 0 && missing.length === 0
      return {
        valid: true,
        ok,
        quality: ok ? (redundant.length ? 'good' : 'best') : null,
        bad: uncovered,
        budget: { total, over, uncovered, missing, redundant },
        flags: [],
      }
    }
  }
}

/** A atividade guarda uma resposta (as de `spot` seguem o desafio do laboratório). */
export const isAnswerable = (spec: ActivitySpec): boolean => spec.kind !== 'spot'
/** Decisões são confirmadas de uma vez (sem "tentar de novo"); as demais repetem até acertar. */
export const isDecision = (spec: ActivitySpec): boolean => spec.kind === 'decide' || spec.kind === 'adr'
