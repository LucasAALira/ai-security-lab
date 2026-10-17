import { describe, expect, it } from 'vitest'
import {
  applyAction,
  buildContext,
  cleanState,
  emptyState,
  exportProgress,
  gradeActivity,
  learningXp,
  maxLearningXp,
  medals,
  missionLock,
  missionPassed,
  parseBackup,
  resumePoint,
  subProgress,
  summary,
  type Action,
  type ActivitySpec,
  type CampaignSpec,
  type MissionSpec,
  type ProgressContext,
  type StudyState,
  type SubSpec,
} from '.'

/* Motor das campanhas com um cenário pequeno e fictício, que usa todos os formatos de atividade. */

const D = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12)
const NOW = D(2026, 10, 17)

const decide: ActivitySpec = {
  id: 'decidir',
  kind: 'decide',
  options: [
    { quality: 'best', flags: ['preservou', 'girou'] },
    { quality: 'good', flags: ['preservou'] },
    { quality: 'poor', flags: ['apagou'] },
  ],
}
const multi: ActivitySpec = { id: 'marcar', kind: 'multi', options: 4, correct: [0, 2] }
const order: ActivitySpec = { id: 'ordenar', kind: 'order', items: 3, before: [[0, 1], [1, 2]] }
const assign: ActivitySpec = { id: 'associar', kind: 'assign', rows: 2, choices: 3, accept: [[0], [1, 2]] }
const budget: ActivitySpec = { id: 'orcamento', kind: 'budget', budget: 6, costs: [2, 3, 4, 1], covers: [[0], [1], [0, 1], []], critical: [0, 1], risks: 2, mandatory: [3] }
const adr: ActivitySpec = { id: 'adr', kind: 'adr', options: [{ quality: 'best', flags: [] }, { quality: 'poor', flags: [] }], rubric: 2, fields: 2 }
const spot: ActivitySpec = { id: 'codigo', kind: 'spot', challenge: 'desafio-teste' }

const mission = (id: string, order_: number, campaign: string, activities: ActivitySpec[], clean = { require: [] as string[], forbid: [] as string[] }): MissionSpec => ({
  id,
  kind: 'mission',
  campaign,
  order: order_,
  activities,
  clean,
  tags: [],
})

const missions: MissionSpec[] = [
  mission('a1', 1, 'camp-a', [decide, multi, order, assign, budget, adr], { require: ['preservou', 'girou'], forbid: ['apagou'] }),
  mission('a2', 2, 'camp-a', [multi, spot]),
  mission('b1', 1, 'camp-b', [decide]),
  { id: 'dossie-x', kind: 'dossier', campaign: null, order: 1, activities: [{ ...multi, id: 'ex1' }], clean: { require: [], forbid: [] }, tags: [] },
]
const campaigns: CampaignSpec[] = [
  { id: 'camp-a', requires: [], missions: ['a1', 'a2'] },
  { id: 'camp-b', requires: ['camp-a'], missions: ['b1'] },
]
const subs: SubSpec[] = [
  { id: 'sub-aula', module: 'mod', area: 'web', available: true, legacy: null, lesson: true, challenges: ['desafio-teste'] },
  { id: 'sub-planejado', module: 'mod', area: 'web', available: false, legacy: null, lesson: false, challenges: [] },
  { id: 'sub-so-aula', module: 'mod', area: 'web', available: true, legacy: null, lesson: true, challenges: [] },
]

const ctx: ProgressContext = buildContext(
  [{ category: 'Fundamentos', prereqs: [] }],
  [],
  {
    challenges: [{ id: 'desafio-teste', module: null, tags: ['web'], kind: 'vuln', lines: 4, vulnerable: [1], also: [], extra: [], options: 3, fix: 0 }],
    missions,
    campaigns,
    lessons: ['sub-aula', 'sub-so-aula'],
    curriculum: { areas: [{ id: 'web', modules: ['mod'] }], modules: [{ id: 'mod', area: 'web', subs: subs.map((x) => x.id) }], subs },
  },
)

const act = (state: StudyState, action: Action, now = NOW) => applyAction(state, action, ctx, now)
const run = (state: StudyState, ...actions: Action[]) => actions.reduce((s, a) => act(s, a).state, state)
const answer = (mission_: string, activity: string, v: number[], t?: string[]): Action => ({ type: 'missionAnswer', mission: mission_, activity, answer: t ? { v, t } : { v } })

const goodA1: Action[] = [
  answer('a1', 'decidir', [0]),
  answer('a1', 'marcar', [0, 2]),
  answer('a1', 'ordenar', [0, 1, 2]),
  answer('a1', 'associar', [0, 2]),
  answer('a1', 'orcamento', [3, 0, 1]),
  answer('a1', 'adr', [0, 1, 1], ['porque o risco é alto', 'validar com um teste']),
]

describe('correção das atividades', () => {
  it('multi: exige exatamente o conjunto certo e aponta o que revisar', () => {
    expect(gradeActivity(multi, { v: [0, 2] })).toMatchObject({ valid: true, ok: true, quality: 'best', bad: [] })
    expect(gradeActivity(multi, { v: [2, 0] }).ok).toBe(true)
    expect(gradeActivity(multi, { v: [0] })).toMatchObject({ ok: false, bad: [2] })
    expect(gradeActivity(multi, { v: [0, 1, 2] })).toMatchObject({ ok: false, bad: [1] })
    expect(gradeActivity(multi, { v: [] }).ok).toBe(false)
  })

  it('rejeita respostas com forma inválida, em qualquer formato', () => {
    for (const spec of [decide, multi, order, assign, budget, adr]) {
      for (const bad of [undefined, null, 42, 'x', {}, { v: 'a' }, { v: [99] }, { v: [-1] }, { v: [0.5] }]) expect(gradeActivity(spec, bad).valid).toBe(false)
    }
    expect(gradeActivity(multi, { v: [0, 0] }).valid).toBe(false)
    expect(gradeActivity(order, { v: [0, 0, 1] }).valid).toBe(false)
    expect(gradeActivity(order, { v: [0, 1] }).valid).toBe(false)
  })

  it('order: confere as restrições de precedência, não uma única ordem textual', () => {
    expect(gradeActivity(order, { v: [0, 1, 2] }).ok).toBe(true)
    expect(gradeActivity(order, { v: [1, 0, 2] })).toMatchObject({ ok: false, bad: [0, 1] })
    const flexible: ActivitySpec = { id: 'f', kind: 'order', items: 3, before: [[0, 2]] }
    expect(gradeActivity(flexible, { v: [0, 1, 2] }).ok).toBe(true)
    expect(gradeActivity(flexible, { v: [1, 0, 2] }).ok).toBe(true)
    expect(gradeActivity(flexible, { v: [2, 1, 0] }).ok).toBe(false)
  })

  it('assign: aceita mais de uma resposta defensável por linha', () => {
    expect(gradeActivity(assign, { v: [0, 1] }).ok).toBe(true)
    expect(gradeActivity(assign, { v: [0, 2] }).ok).toBe(true)
    expect(gradeActivity(assign, { v: [1, 2] })).toMatchObject({ ok: false, bad: [0] })
  })

  it('budget: cobre os riscos críticos, respeita o limite, exige o obrigatório e nota o redundante', () => {
    expect(gradeActivity(budget, { v: [3, 0, 1] })).toMatchObject({ ok: true, quality: 'best' })
    expect(gradeActivity(budget, { v: [3, 2] })).toMatchObject({ ok: true, quality: 'best' }) // 1 + 4 = 5 <= 6, cobre 0 e 1
    expect(gradeActivity(budget, { v: [0, 1] }).budget?.missing).toEqual([3]) // falta o controle obrigatório
    expect(gradeActivity(budget, { v: [3, 0] })).toMatchObject({ ok: false, bad: [1] }) // risco 1 sem cobertura
    expect(gradeActivity(budget, { v: [3, 1, 2] }).budget?.over).toBe(true) // 1 + 3 + 4 = 8 > 6
    expect(gradeActivity(budget, { v: [3, 0, 1, 2] }).ok).toBe(false) // 10 > 6
    const redundant = gradeActivity({ ...budget, budget: 20 }, { v: [3, 0, 1, 2] })
    expect(redundant).toMatchObject({ ok: true, quality: 'good' })
    expect(redundant.budget?.redundant.length).toBeGreaterThan(0)
  })

  it('decide e adr: a qualidade vem da opção, e a ADR exige texto e autoavaliação marcada 0 ou 1', () => {
    expect(gradeActivity(decide, { v: [1] })).toMatchObject({ ok: true, quality: 'good', flags: ['preservou'] })
    expect(gradeActivity(decide, { v: [2] })).toMatchObject({ ok: false, quality: 'poor' })
    expect(gradeActivity(adr, { v: [0, 1, 0], t: ['texto suficiente', 'outro texto longo'] }).ok).toBe(true)
    expect(gradeActivity(adr, { v: [0, 1, 0], t: ['curto', 'outro texto longo'] }).valid).toBe(false)
    expect(gradeActivity(adr, { v: [0, 2, 0], t: ['texto suficiente', 'outro texto longo'] }).valid).toBe(false)
    expect(gradeActivity(adr, { v: [0, 1, 0], t: ['texto suficiente'] }).valid).toBe(false)
    // O texto nunca é avaliado por palavras-chave: o que vale é a decisão escolhida.
    expect(gradeActivity(adr, { v: [1, 1, 1], t: ['qualquer coisa ok', 'qualquer coisa ok'] }).ok).toBe(false)
  })
})

describe('fluxo da missão', () => {
  it('as atividades seguem a ordem e uma resposta só vale para a atividade atual', () => {
    const s0 = emptyState()
    const early = act(s0, answer('a1', 'marcar', [0, 2]))
    expect(early.changed).toBe(false)
    expect(early.rejected).toBe('order')
    expect(act(s0, answer('a1', 'nao-existe', [0])).rejected).toBe('missing')
    expect(act(s0, answer('nao-existe', 'decidir', [0])).rejected).toBe('missing')
    expect(act(s0, answer('a1', 'decidir', [9])).rejected).toBe('invalid')
  })

  it('uma decisão é confirmada de uma vez; só a primeira vez rende crédito', () => {
    const first = act(emptyState(), answer('a1', 'decidir', [1]))
    expect(first.events).toContainEqual({ kind: 'activity', mission: 'a1', activity: 'decidir', quality: 'good', first: true })
    const again = act(first.state, answer('a1', 'decidir', [0]))
    expect(again.changed).toBe(false)
    expect(again.state.missions.a1.run.results.decidir).toBe('good')
  })

  it('uma decisão ruim avança a simulação sem creditar, e refazê-la não apaga o histórico', () => {
    let s = run(emptyState(), answer('a1', 'decidir', [2]))
    expect(s.missions.a1.credited).toEqual([])
    expect(s.missions.a1.run.results.decidir).toBe('poor')
    s = run(s, { type: 'missionRewind', mission: 'a1', activity: 'decidir' })
    expect(s.missions.a1.run.results.decidir).toBeUndefined()
    expect(s.missions.a1.history).toHaveLength(1)
    s = run(s, answer('a1', 'decidir', [0]))
    expect(s.missions.a1.credited).toEqual(['decidir'])
    expect(s.missions.a1.history.map((h) => h.pick)).toEqual([2, 0])
  })

  it('erro nas atividades corrigidas por regras repete sem perder nada; a solução abre depois de 2 erros e não dá crédito', () => {
    let s = run(emptyState(), answer('a1', 'decidir', [0]))
    const miss1 = act(s, answer('a1', 'marcar', [1]))
    expect(miss1.events).toContainEqual({ kind: 'activity-miss', mission: 'a1', activity: 'marcar' })
    s = miss1.state
    expect(act(s, { type: 'missionReveal', mission: 'a1', activity: 'marcar' }).rejected).toBe('order') // ainda com 1 erro
    s = run(s, answer('a1', 'marcar', [3]))
    expect(s.missions.a1.run.misses.marcar).toBe(2)
    s = run(s, { type: 'missionReveal', mission: 'a1', activity: 'marcar' })
    expect(s.missions.a1.run.results.marcar).toBe('revealed')
    expect(s.missions.a1.credited).toEqual(['decidir'])
    expect(act(s, { type: 'missionReveal', mission: 'a1', activity: 'decidir' }).rejected).toBeDefined()
  })

  it('não conclui com atividades pendentes; conclui e aprova com tudo creditado', () => {
    let s = run(emptyState(), { type: 'missionStart', mission: 'a1' }, ...goodA1.slice(0, 5))
    expect(act(s, { type: 'missionFinish', mission: 'a1' }).rejected).toBe('order')
    s = run(s, goodA1[5], { type: 'missionFinish', mission: 'a1' })
    expect(s.missions.a1.done).toBe('2026-10-17')
    expect(missionPassed(s, missions[0])).toBe(true)
    expect(s.missions.a1.clean).toBe(true)
    expect(s.missions.a1.noHints).toBe(true)
  })

  it('missão concluída com a solução revelada fica concluída, mas não aprovada, e não conta como limpa', () => {
    let s = run(emptyState(), answer('a1', 'decidir', [0]), answer('a1', 'marcar', [1]), answer('a1', 'marcar', [1]), { type: 'missionReveal', mission: 'a1', activity: 'marcar' })
    s = run(s, answer('a1', 'ordenar', [0, 1, 2]), answer('a1', 'associar', [0, 2]), answer('a1', 'orcamento', [3, 0, 1]), answer('a1', 'adr', [0, 1, 1], ['porque o risco é alto', 'validar com um teste']))
    s = run(s, { type: 'missionFinish', mission: 'a1' })
    expect(s.missions.a1.done).not.toBe('')
    expect(missionPassed(s, missions[0])).toBe(false)
    expect(s.missions.a1.clean).toBe(false)
    expect(medals(s, ctx).find((m) => m.id === 'primeira-missao')?.unlocked).toBe(false)
  })

  it('"limpa" depende das marcas das decisões: decidir mal bloqueia a contenção precisa', () => {
    const wrong: Action[] = [answer('a1', 'decidir', [1]), ...goodA1.slice(1), { type: 'missionFinish', mission: 'a1' }] // boa, mas sem 'girou'
    const s = run(emptyState(), ...wrong)
    expect(missionPassed(s, missions[0])).toBe(true)
    expect(s.missions.a1.clean).toBe(false)
    expect(medals(s, ctx).find((m) => m.id === 'contencao-precisa')?.unlocked).toBe(false)
  })

  it('dica não bloqueia nada, mas tira o "sem dicas"', () => {
    let s = run(emptyState(), { type: 'missionHint', mission: 'a1', activity: 'decidir', index: 0 }, ...goodA1, { type: 'missionFinish', mission: 'a1' })
    expect(s.missions.a1.run.hints.decidir).toBe(1)
    expect(missionPassed(s, missions[0])).toBe(true)
    expect(s.missions.a1.noHints).toBe(false)
    // Uma nova tentativa sem dicas conquista o "sem dicas" e mantém o crédito.
    s = run(s, { type: 'missionRestart', mission: 'a1' }, ...goodA1, { type: 'missionFinish', mission: 'a1' })
    expect(s.missions.a1.attempts).toBe(2)
    expect(s.missions.a1.noHints).toBe(true)
    expect(medals(s, ctx).find((m) => m.id === 'sem-dicas-missao')?.unlocked).toBe(true)
  })

  it('etapa e atividade atual ficam salvas, e as etapas finais só abrem depois das decisões', () => {
    let s = run(emptyState(), { type: 'missionStart', mission: 'a1' })
    expect(act(s, { type: 'missionGo', mission: 'a1', stage: 3 }).rejected).toBe('order')
    s = run(s, { type: 'missionGo', mission: 'a1', stage: 2, step: 0 }, answer('a1', 'decidir', [0]))
    expect(s.missions.a1.stage).toBe(2)
    expect(s.missions.a1.step).toBe(0) // responder não avança sozinho: a pessoa lê o retorno antes de seguir
    s = run(s, { type: 'missionGo', mission: 'a1', stage: 2, step: 1 })
    expect(s.missions.a1.step).toBe(1)
    expect(act(s, { type: 'missionGo', mission: 'a1', stage: 2, step: 3 }).rejected).toBe('order') // não pula atividades
    expect(act(s, { type: 'missionGo', mission: 'a1', stage: 9 }).rejected).toBe('invalid')
    expect(resumePoint(s, ctx)).toEqual({ kind: 'mission', id: 'a1' })
  })
})

describe('abertura de missões e campanhas', () => {
  const finishA1 = () => run(emptyState(), ...goodA1, { type: 'missionFinish', mission: 'a1' })

  it('cada missão abre depois da anterior; a campanha seguinte, depois da campanha exigida', () => {
    const s = emptyState()
    expect(missionLock(s, ctx, 'a1').locked).toBe(false)
    expect(missionLock(s, ctx, 'a2')).toMatchObject({ locked: true, reason: 'previous', previous: 'a1' })
    expect(missionLock(s, ctx, 'b1')).toMatchObject({ locked: true, reason: 'campaign', campaigns: ['camp-a'] })
    expect(act(s, answer('a2', 'marcar', [0, 2])).rejected).toBe('missionLocked')
    expect(act(s, answer('b1', 'decidir', [0])).rejected).toBe('missionLocked')
    const done1 = finishA1()
    expect(missionLock(done1, ctx, 'a2').locked).toBe(false)
    expect(missionLock(done1, ctx, 'b1').locked).toBe(true)
  })

  it('exercícios de dossiê ficam sempre abertos, e o dossiê rende XP de leitura uma vez', () => {
    expect(missionLock(emptyState(), ctx, 'dossie-x').locked).toBe(false)
    let s = run(emptyState(), { type: 'dossierRead', dossier: 'dossie-x' })
    const xp = learningXp(s, ctx)
    s = run(s, { type: 'dossierRead', dossier: 'dossie-x' })
    expect(learningXp(s, ctx)).toBe(xp)
    expect(act(emptyState(), { type: 'dossierRead', dossier: 'a1' }).rejected).toBe('missing')
  })

  it('o desafio de código dentro da missão segue o crédito do próprio desafio', () => {
    let s = run(finishA1(), { type: 'missionStart', mission: 'a2' }, answer('a2', 'marcar', [0, 2]))
    expect(act(s, { type: 'missionFinish', mission: 'a2' }).rejected).toBe('order') // o desafio ainda não foi concluído
    s = run(s, { type: 'identify', challenge: 'desafio-teste', lines: [1] }, { type: 'fix', challenge: 'desafio-teste', option: 0 }, { type: 'missionFinish', mission: 'a2' })
    expect(missionPassed(s, missions[1])).toBe(true)
  })
})

describe('XP e conquistas sem duplicidade', () => {
  it('XP: 10 por atividade creditada + 15 ao aprovar; repetir a missão não soma de novo', () => {
    const s = run(emptyState(), ...goodA1, { type: 'missionFinish', mission: 'a1' })
    expect(learningXp(s, ctx)).toBe(6 * 10 + 15)
    const again = run(s, { type: 'missionRestart', mission: 'a1' }, ...goodA1, { type: 'missionFinish', mission: 'a1' })
    expect(learningXp(again, ctx)).toBe(learningXp(s, ctx))
    expect(summary(again, ctx).xp).toBe(summary(s, ctx).xp)
  })

  it('o XP total nunca passa do máximo possível', () => {
    expect(maxLearningXp(ctx)).toBeGreaterThan(0)
    const s = run(emptyState(), ...goodA1, { type: 'missionFinish', mission: 'a1' })
    expect(learningXp(s, ctx)).toBeLessThanOrEqual(maxLearningXp(ctx))
  })

  it('cada conquista é registrada uma vez, com a data da primeira conclusão', () => {
    let s = run(emptyState(), ...goodA1, { type: 'missionFinish', mission: 'a1' })
    const date = s.badges['primeira-missao']
    expect(date).toBe('2026-10-17')
    s = applyAction(s, { type: 'missionRestart', mission: 'a1' }, ctx, D(2026, 10, 20)).state
    for (const a of goodA1) s = applyAction(s, a, ctx, D(2026, 10, 20)).state
    s = applyAction(s, { type: 'missionFinish', mission: 'a1' }, ctx, D(2026, 10, 20)).state
    expect(s.badges['primeira-missao']).toBe(date)
    const events = act(s, { type: 'missionFinish', mission: 'a1' }).events
    expect(events.filter((e) => e.kind === 'medal')).toHaveLength(0)
  })

  it('abrir telas ou iniciar a missão não conquista nada', () => {
    const s = run(emptyState(), { type: 'missionStart', mission: 'a1' }, { type: 'missionGo', mission: 'a1', stage: 1 })
    expect(summary(s, ctx).medals).toBe(0)
    expect(learningXp(s, ctx)).toBe(0)
  })

  it('a conquista da campanha exige todas as missões aprovadas', () => {
    const s = run(emptyState(), ...goodA1, { type: 'missionFinish', mission: 'a1' })
    expect(s.missions.a1.done).not.toBe('')
    // camp-a ainda tem a missão a2.
    expect(medals(s, ctx).find((m) => m.id === 'elo-protegido')).toBeUndefined() // a campanha de teste tem outro id
    expect(medals(s, ctx).find((m) => m.id === 'missoes-todas')?.unlocked).toBe(false)
  })

  it('aula lida rende XP uma vez e só vale para submódulos com aula', () => {
    let s = run(emptyState(), { type: 'lessonRead', sub: 'sub-aula' })
    expect(learningXp(s, ctx)).toBe(4)
    s = run(s, { type: 'lessonRead', sub: 'sub-aula' })
    expect(learningXp(s, ctx)).toBe(4)
    expect(act(emptyState(), { type: 'lessonRead', sub: 'sub-planejado' }).rejected).toBe('missing')
  })
})

describe('progresso por submódulo', () => {
  it('conta só o que é obrigatório e ignora submódulos planejados', () => {
    const [aula, planejado, soAula] = subs
    expect(subProgress(emptyState(), planejado)).toBeNull()
    expect(subProgress(emptyState(), aula)).toMatchObject({ done: 0, total: 2, complete: false, read: false, approved: false })
    let s = run(emptyState(), { type: 'lessonRead', sub: 'sub-aula' })
    expect(subProgress(s, aula)).toMatchObject({ done: 1, total: 2, read: true, practiced: false })
    s = run(s, { type: 'identify', challenge: 'desafio-teste', lines: [1] })
    expect(subProgress(s, aula)).toMatchObject({ practiced: true, complete: false })
    s = run(s, { type: 'fix', challenge: 'desafio-teste', option: 0 })
    expect(subProgress(s, aula)).toMatchObject({ done: 2, total: 2, complete: true, approved: true })
    expect(subProgress(s, soAula)).toMatchObject({ approved: null, complete: false })
  })
})

describe('migração, saneamento e cópia de segurança', () => {
  it('estado antigo (versão 3) vira versão 4 e ganha os campos novos vazios', () => {
    const v3 = JSON.parse(JSON.stringify(emptyState()))
    v3.version = 3
    delete v3.missions
    delete v3.dossiers
    delete v3.architect
    delete v3.lessons
    const s = cleanState(v3)
    expect(s.version).toBe(4)
    expect(s.missions).toEqual({})
    expect(s.dossiers).toEqual({})
    expect(s.architect).toEqual({})
    expect(s.lessons).toEqual({})
  })

  it('descarta dados malformados de missões sem quebrar o resto do estado', () => {
    const junk = JSON.parse(JSON.stringify(emptyState()))
    junk.lab = true
    junk.missions = {
      ok: { started: '2026-10-17', stage: 99, step: -4, run: { answers: { x: { v: [1, 'a', 2.5, -1], t: [5, 'texto'] } }, results: { x: 'deus', y: 'good' }, misses: { x: -9 }, hints: { x: 99 } }, attempts: 'muitas', credited: ['x', 3, 'x'], done: 'ontem', clean: 'sim', noHints: 1, history: [{}, 7] },
      'id inválido!': {},
      lista: [],
    }
    junk.dossiers = { 'd-1': '2026-10-17', lixo: 'amanhã' }
    junk.lessons = { 'sub-aula': '2026-10-17', 'x y': '2026-10-17' }
    const s = cleanState(junk)
    expect(s.lab).toBe(true)
    const m = s.missions.ok
    expect(m).toBeDefined()
    expect(m.stage).toBeLessThanOrEqual(4)
    expect(m.stage).toBeGreaterThanOrEqual(0)
    expect(m.step).toBeGreaterThanOrEqual(0)
    expect(m.attempts).toBeGreaterThanOrEqual(0)
    expect(Object.values(m.run.results).every((r) => ['best', 'good', 'partial', 'poor', 'revealed'].includes(r))).toBe(true)
    expect(m.credited).toEqual(['x'])
    expect(typeof m.clean).toBe('boolean')
    expect(s.missions['id inválido!']).toBeUndefined()
    expect(s.missions.lista).toBeUndefined()
    expect(s.dossiers['d-1']).toBe('2026-10-17')
    expect(s.dossiers.lixo).toBeUndefined()
    expect(s.lessons['sub-aula']).toBe('2026-10-17')
    expect(s.lessons['x y']).toBeUndefined()
  })

  it('exportar e importar devolve o progresso das missões sem alterações', () => {
    const s = run(emptyState(), { type: 'lessonRead', sub: 'sub-aula' }, { type: 'dossierRead', dossier: 'dossie-x' }, ...goodA1.slice(0, 3), { type: 'missionGo', mission: 'a1', stage: 2, step: 3 })
    const text = exportProgress(s, NOW, 'America/Sao_Paulo')
    const result = parseBackup(text)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.state).toEqual(s)
    // Importar e retomar: a missão continua de onde parou.
    if (result.ok) expect(result.state.missions.a1.step).toBe(3)
  })

  it('o limite de histórico de decisões é respeitado', () => {
    let s = emptyState()
    for (let i = 0; i < 60; i++) s = run(s, answer('b1', 'decidir', [0]).type === 'missionAnswer' ? answer('a1', 'decidir', [2]) : answer('a1', 'decidir', [2]), { type: 'missionRewind', mission: 'a1', activity: 'decidir' })
    expect(s.missions.a1.history.length).toBeLessThanOrEqual(40)
  })
})
