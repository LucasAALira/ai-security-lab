import { describe, expect, it } from 'vitest'
import { termsIn } from '@/components/rich/rich-parse'
import {
  ADR_MIN_CHARS,
  HINTS_PER_ACTIVITY,
  ID_PATTERN,
  applyAction,
  emptyState,
  findChallenge,
  findMission,
  gradeActivity,
  isGood,
  medals,
  missionPassed,
  solveActivity,
  type Action,
  type Answer,
  type StudyState,
} from '@/lib/progress'
import { challenges } from '../challenges'
import { glossaryById } from '../glossary'
import { progressContext as ctx } from '../progress-context'
import { resolveRef } from '../frameworks'
import { campaigns, dossierAsMission, dossiers, missionContents, toActivitySpec, type ActivityContent, type DecisionOption, type MissionContent } from '.'

const NOW = new Date(2026, 9, 17, 12)
const IP_ANY = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g
const RESERVED_IP_ANY = /^(198\.51\.100|203\.0\.113|192\.0\.2)\./
const act = (s: StudyState, a: Action) => applyAction(s, a, ctx, NOW).state
const run = (s: StudyState, ...actions: Action[]) => actions.reduce(act, s)

/** Todas as strings de um valor (para varrer o conteúdo inteiro). */
function* strings(value: unknown): Generator<string> {
  if (typeof value === 'string') yield value
  else if (Array.isArray(value)) for (const v of value) yield* strings(v)
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* strings(v)
}

const options = (a: ActivityContent): DecisionOption[] => (a.kind === 'decide' || a.kind === 'adr' ? a.options : [])
const everyFlag = (m: MissionContent) => new Set(m.activities.flatMap((a) => options(a).flatMap((o) => o.flags ?? [])))

/** Resposta correta de uma atividade; nas decisões, a opção `pick` (por padrão, a melhor). */
function answerOf(m: MissionContent, a: ActivityContent, pick?: number): Action[] {
  if (a.kind === 'spot') {
    const c = findChallenge(ctx, a.challenge)!
    return [
      { type: 'identify', challenge: a.challenge, lines: [...c.vulnerable] },
      { type: 'fix', challenge: a.challenge, option: c.fix },
    ]
  }
  const spec = toActivitySpec(a)
  let answer: Answer
  if (a.kind === 'decide' || a.kind === 'adr') {
    const best = a.options.findIndex((o) => o.quality === 'best')
    const v = pick ?? best
    answer = a.kind === 'adr' ? { v: [v, ...a.rubric.map(() => 1)], t: a.fields.map(() => 'x'.repeat(ADR_MIN_CHARS)) } : { v: [v] }
  } else {
    answer = solveActivity(spec)!
  }
  return [{ type: 'missionAnswer', mission: m.id, activity: a.id, answer }]
}

/** Conclui a missão pelo caminho da melhor decisão. */
function pass(s: StudyState, m: MissionContent): StudyState {
  let st = act(s, { type: 'missionStart', mission: m.id })
  for (const a of m.activities) st = run(st, ...answerOf(m, a))
  return act(st, { type: 'missionFinish', mission: m.id })
}

describe('estrutura das campanhas', () => {
  it('cada campanha tem missões numeradas em sequência e com identificadores únicos', () => {
    const ids = missionContents.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of campaigns) {
      expect(ID_PATTERN.test(c.id)).toBe(true)
      expect(c.missions.map((m) => m.order)).toEqual(c.missions.map((_, i) => i + 1))
      for (const m of c.missions) {
        expect(m.campaign).toBe(c.id)
        expect(ID_PATTERN.test(m.id)).toBe(true)
      }
    }
  })

  it('as campanhas requeridas existem e não formam ciclo', () => {
    const byId = new Map(campaigns.map((c) => [c.id, c]))
    for (const c of campaigns) {
      for (const r of c.requires) expect(byId.has(r)).toBe(true)
      const seen = new Set<string>()
      const visit = (id: string) => {
        expect(seen.has(id)).toBe(false)
        seen.add(id)
        for (const r of byId.get(id)!.requires) visit(r)
        seen.delete(id)
      }
      visit(c.id)
    }
  })
})

describe.each(missionContents.map((m) => [m.id, m] as const))('missão %s', (_id, m) => {
  it('tem os elementos obrigatórios preenchidos', () => {
    expect(m.objective.length).toBeGreaterThan(40)
    expect(m.prereqs.length).toBeGreaterThan(10)
    expect(m.minutes).toBeGreaterThan(0)
    expect(m.context.length).toBeGreaterThanOrEqual(2)
    expect(m.criteria.length).toBeGreaterThanOrEqual(3)
    expect(m.activities.length).toBeGreaterThanOrEqual(4)
    expect(m.review.solution.length).toBeGreaterThan(0)
    expect(m.review.residual.length).toBeGreaterThan(40)
    expect(m.review.validation.length).toBeGreaterThan(40)
    expect(m.refs.length).toBeGreaterThan(0)
    expect(m.medals.length).toBeGreaterThan(0)
    expect(m.closing.length).toBeGreaterThan(0)
    expect(m.closing[m.closing.length - 1].when).toBeUndefined() // sempre há um texto de fechamento padrão
  })

  it('usa pelo menos três formatos de atividade diferentes', () => {
    expect(new Set(m.activities.map((a) => a.kind)).size).toBeGreaterThanOrEqual(3)
  })

  it('identificadores de atividades e evidências são válidos e únicos', () => {
    const a = m.activities.map((x) => x.id)
    const e = m.evidence.map((x) => x.id)
    expect(new Set(a).size).toBe(a.length)
    expect(new Set(e).size).toBe(e.length)
    for (const id of [...a, ...e]) expect(ID_PATTERN.test(id)).toBe(true)
  })

  it('as evidências são liberadas por etapas válidas, com conteúdo no formato declarado', () => {
    for (const ev of m.evidence) {
      expect(ev.from).toBeGreaterThanOrEqual(0)
      expect(ev.from).toBeLessThanOrEqual(m.activities.length - 1)
      if (ev.kind === 'code') expect(ev.lines?.length).toBeGreaterThan(0)
      if (ev.kind === 'table') {
        expect(ev.head?.length).toBeGreaterThan(0)
        for (const row of ev.rows ?? []) expect(row).toHaveLength(ev.head!.length)
      }
      if (ev.kind === 'text') expect(ev.paragraphs?.length).toBeGreaterThan(0)
      if (ev.kind === 'diagram') {
        const nodes = new Set((ev.nodes ?? []).map((n) => n.id))
        expect(nodes.size).toBeGreaterThan(1)
        for (const e of ev.edges ?? []) {
          expect(nodes.has(e.from)).toBe(true)
          expect(nodes.has(e.to)).toBe(true)
        }
        for (const n of ev.nodes ?? []) {
          expect(n.x).toBeGreaterThanOrEqual(0)
          expect(n.x).toBeLessThanOrEqual(5)
          expect(n.y).toBeGreaterThanOrEqual(0)
          expect(n.y).toBeLessThanOrEqual(5)
        }
      }
    }
  })

  it('as marcas usadas em evidências, fechamentos e regras existem em alguma decisão', () => {
    const known = everyFlag(m)
    const used = [...(m.clean?.require ?? []), ...(m.clean?.forbid ?? []), ...m.evidence.flatMap((e) => e.when ?? []), ...m.closing.flatMap((c) => c.when ?? [])]
    for (const flag of used) expect(known.has(flag)).toBe(true)
  })

  it('toda decisão tem uma opção melhor, feedback e consequência específicos por opção', () => {
    for (const a of m.activities) {
      if (a.kind !== 'decide' && a.kind !== 'adr') continue
      expect(a.options.length).toBeGreaterThanOrEqual(4)
      expect(a.options.filter((o) => o.quality === 'best').length).toBe(1)
      expect(a.options.some((o) => !isGood(o.quality))).toBe(true)
      const feedbacks = a.options.map((o) => o.feedback)
      expect(new Set(feedbacks).size).toBe(feedbacks.length)
      for (const o of a.options) {
        expect(o.feedback.length).toBeGreaterThan(40)
        expect(o.consequence.length).toBeGreaterThan(30)
      }
    }
  })

  it('as atividades com gabarito têm explicação, enunciado, três dicas e solução possível', () => {
    for (const a of m.activities) {
      expect(a.prompt.length).toBeGreaterThan(20)
      expect(a.explain.length).toBeGreaterThan(40)
      if (a.kind === 'spot') {
        expect(findChallenge(ctx, a.challenge)).toBeTruthy()
        continue
      }
      expect(a.hints).toHaveLength(HINTS_PER_ACTIVITY)
      expect(new Set(a.hints).size).toBe(HINTS_PER_ACTIVITY)
      if (a.kind === 'multi') {
        for (const o of a.options) expect(o.feedback.length).toBeGreaterThan(20)
        expect(a.correct.length).toBeGreaterThan(0)
        expect(a.correct.length).toBeLessThan(a.options.length) // nem tudo é certo
      }
      if (a.kind === 'order') {
        expect(a.items.length).toBeGreaterThanOrEqual(4)
        for (const it of a.items) expect(it.why.length).toBeGreaterThan(20)
      }
      if (a.kind === 'assign') {
        expect(a.accept).toHaveLength(a.rows.length)
        for (const r of a.rows) expect(r.why.length).toBeGreaterThan(20)
        for (const list of a.accept) for (const c of list) expect(c).toBeLessThan(a.choices.length)
      }
      if (a.kind === 'budget') for (const c of a.controls) expect(c.note.length).toBeGreaterThan(20)
      if (a.kind === 'adr') {
        expect(a.fields.length).toBeGreaterThanOrEqual(4)
        expect(a.model).toHaveLength(a.fields.length)
        expect(a.rubric.length).toBeGreaterThanOrEqual(4)
      }
      if (a.kind !== 'decide' && a.kind !== 'adr') {
        const sol = solveActivity(toActivitySpec(a))
        expect(sol).not.toBeNull()
        expect(gradeActivity(toActivitySpec(a), sol!).ok).toBe(true)
      }
    }
  })

  it('o caminho da melhor decisão conclui a missão e as demais ramificações também têm saída', () => {
    // Antes de começar, as missões anteriores da campanha precisam estar concluídas.
    const campaign = campaigns.find((c) => c.id === m.campaign)!
    let base = emptyState()
    for (const earlier of campaign.missions.filter((x) => x.order < m.order)) base = pass(base, earlier)

    const best = pass(base, m)
    expect(best.missions[m.id].done).toBeTruthy()
    expect(missionPassed(best, findMission(ctx, m.id)!)).toBe(true)

    // Em cada decisão, qualquer opção pode ser escolhida; se não rende crédito, é possível refazer e seguir.
    for (const [index, a] of m.activities.entries()) {
      if (a.kind !== 'decide' && a.kind !== 'adr') continue
      for (const [k, option] of a.options.entries()) {
        let s = act(base, { type: 'missionStart', mission: m.id })
        for (const before of m.activities.slice(0, index)) s = run(s, ...answerOf(m, before))
        s = run(s, ...answerOf(m, a, k))
        if (!isGood(option.quality)) s = run(s, { type: 'missionRewind', mission: m.id, activity: a.id }, ...answerOf(m, a))
        for (const after of m.activities.slice(index + 1)) s = run(s, ...answerOf(m, after))
        s = act(s, { type: 'missionFinish', mission: m.id })
        expect(missionPassed(s, findMission(ctx, m.id)!)).toBe(true)
      }
    }
  })

  it('o texto só usa termos do glossário que existem', () => {
    for (const text of strings(m)) for (const id of termsIn(text)) expect(glossaryById(id)).toBeTruthy()
  })
})

describe('dados sintéticos', () => {
  const HOST = /\b(?:https?:\/\/)?([a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.[a-z]{2,})(?::\d+)?(?=[/\s"'`,.;)\]]|$)/gi
  const IP = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g
  const RESERVED_IP = /^(198\.51\.100|203\.0\.113|192\.0\.2)\./
  /** Endereços de referências externas (documentação de frameworks), fora do conteúdo fictício. */
  const withoutRefs = (m: MissionContent) => ({ ...m, refs: [] })

  it('nenhum endereço do conteúdo fictício aponta para fora do domínio reservado .example', () => {
    for (const m of missionContents) {
      for (const text of strings(withoutRefs(m))) {
        for (const match of text.matchAll(/https?:\/\/([^/\s"'`)]+)/g)) {
          expect(match[1], `${m.id}: ${text.slice(0, 60)}`).toMatch(/\.example(:\d+)?$/)
        }
        for (const match of text.matchAll(IP)) expect(RESERVED_IP.test(match[1]), `${m.id}: ${match[1]}`).toBe(true)
        for (const match of text.matchAll(HOST)) {
          const host = match[1].toLowerCase()
          if (/^\d+(\.\d+)+$/.test(host)) continue // versões e endereços IP são tratados acima
          if (/\.(ts|js|json|yml|yaml|sh|md|txt|tgz|css|html|py|pdf|xlsx|csv|log|zip|png|jpg|xml|plist|kt|swift|apk|ipa)$/.test(host)) continue // nomes de arquivo
          if (/^(package-lock|package|release|deploy|prep|preparar|deploy)\./.test(host)) continue
          expect(host, `${m.id}: ${host}`).toMatch(/\.example$/)
        }
      }
    }
  })

  it('os desafios de código só usam endereços .example ou de documentação', () => {
    // identificadores de espaço de nomes XML não são endereços contactados
    const NAMESPACES = /^(schemas\.android\.com|www\.apple\.com)$/
    for (const c of challenges.filter((x) => x.submodule && x.tags.length > 0 && x.module === null)) {
      const lines = [...c.code, ...(c.fixedCode ?? []), ...Object.values(c.behaviors ?? {}).flat()]
      for (const line of lines) {
        for (const match of line.matchAll(/https?:\/\/([^/\s"'`)<>]+)/g)) {
          if (NAMESPACES.test(match[1])) continue
          expect(match[1], `${c.id}: ${line}`).toMatch(/\.example(:\d+)?$/)
        }
        for (const match of line.matchAll(IP)) expect(RESERVED_IP.test(match[1]), `${c.id}: ${match[1]}`).toBe(true)
      }
    }
  })
})

describe('casos reais', () => {
  it('os identificadores dos dossiês são únicos e não colidem com os das missões', () => {
    const ids = [...dossiers.map((d) => d.id), ...missionContents.map((m) => m.id)]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('há vários dossiês, e ao menos um é de um incidente em pacote público (npm ou PyPI)', () => {
    expect(dossiers.length).toBeGreaterThanOrEqual(15)
    expect(dossiers.some((d) => /npm|pypi/i.test(d.title))).toBe(true)
  })
})

describe.each(dossiers.map((d) => [d.id, d] as const))('dossiê %s', (_id, d) => {
  const DATE = /^\d{4}(-\d{2}(-\d{2})?)?/ // alguns casos só têm o ano divulgado

  it('informa a data do incidente, a data da divulgação e a data da revisão', () => {
    expect(d.incidentDate).toMatch(DATE)
    expect(d.publishedDate).toMatch(DATE)
    expect(d.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(d.incidentDate.slice(0, 7) <= d.publishedDate.slice(0, 7)).toBe(true)
  })

  it('lista as fontes primárias antes das secundárias, todas com endereço https', () => {
    expect(d.sources.length).toBeGreaterThanOrEqual(3)
    expect(d.sources[0].kind).toBe('primária')
    const firstSecondary = d.sources.findIndex((x) => x.kind === 'secundária')
    if (firstSecondary >= 0) expect(d.sources.slice(firstSecondary).every((x) => x.kind === 'secundária')).toBe(true)
    for (const x of d.sources) expect(x.url, x.label).toMatch(/^https:\/\//)
  })

  it('os fatos citam fontes numeradas que existem, e a linha do tempo aponta para fontes válidas', () => {
    const cited = new Set<number>()
    for (const t of [...d.summary, ...d.impact, ...d.uncertainties]) for (const m of t.matchAll(/\[(\d+)\]/g)) cited.add(Number(m[1]))
    for (const n of cited) expect(n >= 1 && n <= d.sources.length, `fonte [${n}]`).toBe(true)
    for (const item of d.summary) expect(item, 'todo fato do resumo cita uma fonte').toMatch(/\[\d+\]/)
    for (const t of d.timeline) expect(t.source >= 1 && t.source <= d.sources.length, t.what).toBe(true)
    expect(d.timeline.length).toBeGreaterThanOrEqual(4)
  })

  it('separa fatos, incertezas, análise educacional e lições, cada um com conteúdo', () => {
    expect(d.summary.length).toBeGreaterThanOrEqual(5)
    expect(d.uncertainties.length).toBeGreaterThanOrEqual(3)
    expect(d.analysis.length).toBeGreaterThanOrEqual(3)
    expect(d.lessons.length).toBeGreaterThanOrEqual(4)
    expect(d.component.name.length).toBeGreaterThan(10)
    expect(d.component.trust.length).toBeGreaterThan(60)
  })

  it('não atribui mecanismos de IA a um incidente que não os tem', () => {
    expect(d.notice ?? '').toMatch(/não envolve inteligência artificial/i)
    const text = [...strings({ ...d, notice: '' })].join(' ')
    expect(text).not.toMatch(/\b(LLM|IA generativa|modelo de linguagem|prompt injection|aprendizado de máquina)\b/i)
  })

  it('a simulação é identificada como fictícia e usa só endereços de exemplo', () => {
    expect(d.exercise.context.join(' ')).toMatch(/simulação fictícia/i)
    for (const text of strings(d.exercise)) {
      for (const match of text.matchAll(/https?:\/\/([^/\s"'`)<>]+)/g)) expect(match[1], text.slice(0, 50)).toMatch(/\.example(:\d+)?$/)
      for (const match of text.matchAll(IP_ANY)) expect(RESERVED_IP_ANY.test(match[1]), match[1]).toBe(true)
    }
  })

  it('o exercício tem ao menos três formatos de atividade, identificadores únicos e dicas distintas', () => {
    const m = dossierAsMission(d)
    expect(new Set(m.activities.map((a) => a.kind)).size).toBeGreaterThanOrEqual(3)
    const ids = [...m.activities.map((a) => a.id), ...m.evidence.map((e) => e.id)]
    expect(new Set(ids).size).toBe(ids.length)
    for (const a of m.activities) if ('hints' in a) expect(new Set(a.hints).size, a.id).toBe(3)
    for (const o of m.activities.flatMap(options)) {
      expect(o.feedback.length).toBeGreaterThan(40)
      expect(o.consequence.length).toBeGreaterThan(30)
    }
    for (const a of m.activities) if (a.kind === 'decide') expect(a.options.filter((o) => o.quality === 'best')).toHaveLength(1)
  })

  it('cada referência a framework do dossiê existe no registro verificado', () => {
    expect((d.frameworks ?? []).length).toBeGreaterThanOrEqual(2)
    for (const ref of d.frameworks ?? []) expect(resolveRef(ref), `${ref.framework} ${ref.id}`).toBeDefined()
  })

  it('o exercício é concluível, rende crédito uma vez só e libera a conquista do dossiê', () => {
    const m = dossierAsMission(d)
    expect(findMission(ctx, d.id)?.kind).toBe('dossier')
    let st = act(emptyState(), { type: 'dossierRead', dossier: d.id })
    st = act(st, { type: 'missionStart', mission: d.id })
    for (const a of m.activities) st = run(st, ...answerOf(m, a))
    st = act(st, { type: 'missionFinish', mission: d.id })
    expect(missionPassed(st, findMission(ctx, d.id)!)).toBe(true)
    expect(medals(st, ctx).find((x) => x.id === 'investigador')?.unlocked).toBe(true)
    const again = run(st, { type: 'dossierRead', dossier: d.id })
    expect(again.dossiers).toEqual(st.dossiers) // ler de novo não duplica nada
  })
})
