import { describe, expect, it } from 'vitest'
import { bossAnswers } from '@/data/bosses'
import { challengeSpecs } from '@/data/challenges'
import { progressContext } from '@/data/progress-context'
import {
  DEFAULT_THEME,
  activeStudyDays,
  applyAction,
  backupFileName,
  cleanState,
  emptyState,
  exportProgress,
  findChallenge,
  gameXp,
  gradeFix,
  gradeLines,
  isChallengeOpen,
  isModuleUnlocked,
  levelFor,
  medals,
  missingPrereqs,
  nextObjective,
  parseBackup,
  summary,
  trail,
  BACKUP_APP,
  type Action,
  type ProgressContext,
  type StudyState,
} from '.'

const real = progressContext
/** Desafios que alguma missão usa como atividade de encontrar a falha. */
const spotIds = new Set(real.missions.flatMap((m) => m.activities.filter((a) => a.kind === 'spot').map((a) => a.challenge)))
/** Sem pré-requisitos entre módulos: para testar desafios, chefes e conquistas em qualquer ordem. */
const open: ProgressContext = { ...real, prereqs: real.prereqs.map(() => []) }
const D = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12)
const NOW = D(2026, 10, 16)

function run(state: StudyState, ctx: ProgressContext, now: Date, ...actions: Action[]): StudyState {
  return actions.reduce((s, a) => applyAction(s, a, ctx, now).state, state)
}

const spec = (id: string) => {
  const found = findChallenge(real, id)
  if (!found) throw new Error(`desafio inexistente: ${id}`)
  return found
}

const identify = (id: string): Action => ({ type: 'identify', challenge: id, lines: [...spec(id).vulnerable] })
const fix = (id: string): Action => ({ type: 'fix', challenge: id, option: spec(id).fix })
/** Concluir um desafio sem dicas: identificar e escolher a correção. */
const solve = (id: string): Action[] => [identify(id), fix(id)]

const vulnIds = challengeSpecs.filter((c) => c.kind === 'vuln').map((c) => c.id)
const authIds = challengeSpecs.filter((c) => c.kind === 'auth').map((c) => c.id)
const unlockedIds = (s: StudyState, ctx = open) => medals(s, ctx).filter((m) => m.unlocked).map((m) => m.id)

/** Estado sem missões no dia de `NOW`, para o XP não depender das missões diárias. */
function quiet(): StudyState {
  const s = emptyState()
  s.quests.day = '2026-10-16'
  return s
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

describe('conteúdo do aprendizado interativo', () => {
  it('há desafios suficientes para cada conquista (nenhuma fica sem conteúdo)', () => {
    expect(vulnIds.length).toBeGreaterThanOrEqual(5) // Explorador de Falhas
    expect(authIds.length).toBeGreaterThanOrEqual(5) // Guardião das APIs
    expect(challengeSpecs.length).toBeGreaterThanOrEqual(3) // Código Protegido
    expect(challengeSpecs.some((c) => c.extra.length > 0)).toBe(true) // Além do Óbvio
    expect(real.bosses.every((a) => a.length === 3)).toBe(true) // Mestre do Módulo, em qualquer módulo
    expect(bossAnswers).toHaveLength(9)
  })
})

describe('correção dos desafios', () => {
  const c = spec('conta-de-servico') // uma só linha de falha, sem extra
  const x = spec('chave-no-navegador') // com falha opcional

  it('aceita só a falha principal e nenhuma linha fora das previstas', () => {
    expect(gradeLines(c, c.vulnerable)).toMatchObject({ valid: true, ok: true, wrong: [], missing: 0, extra: false })
    expect(gradeLines(c, [0])).toMatchObject({ ok: false, wrong: [0], missing: 1 })
    expect(gradeLines(c, [])).toMatchObject({ ok: false, missing: 1 })
    expect(gradeLines(c, [...c.vulnerable, 0])).toMatchObject({ ok: false, wrong: [0], missing: 0 })
  })

  it('rejeita seleção malformada', () => {
    expect(gradeLines(c, 'x').valid).toBe(false)
    expect(gradeLines(c, [99]).valid).toBe(false)
    expect(gradeLines(c, [-1]).valid).toBe(false)
    expect(gradeLines(c, [1, 1]).valid).toBe(false)
    expect(gradeLines(c, [1.5]).valid).toBe(false)
  })

  it('a falha opcional só conta junto da principal', () => {
    expect(gradeLines(x, x.vulnerable)).toMatchObject({ ok: true, extra: false })
    expect(gradeLines(x, [...x.vulnerable, ...x.extra])).toMatchObject({ ok: true, extra: true })
    expect(gradeLines(x, x.extra)).toMatchObject({ ok: false, extra: false, missing: x.vulnerable.length })
  })

  it('linhas relacionadas são aceitas, mas não obrigatórias', () => {
    const t = spec('exportar-dados-do-titular')
    expect(t.also.length).toBeGreaterThan(0)
    expect(gradeLines(t, t.vulnerable).ok).toBe(true)
    expect(gradeLines(t, [...t.vulnerable, ...t.also]).ok).toBe(true)
    expect(gradeLines(t, t.also).ok).toBe(false)
  })

  it('a correção certa é a única aceita', () => {
    expect(gradeFix(c, c.fix).ok).toBe(true)
    expect(gradeFix(c, (c.fix + 1) % c.options).ok).toBe(false)
    expect(gradeFix(c, c.options).valid).toBe(false)
    expect(gradeFix(c, '1').valid).toBe(false)
  })
})

describe('desafios no progresso', () => {
  const id = vulnIds[0]

  it('concluir um desafio atualiza o progresso e rende XP uma única vez', () => {
    let s = quiet()
    let r = applyAction(s, identify(id), open, NOW)
    expect(r.changed).toBe(true)
    expect(r.events).toContainEqual(expect.objectContaining({ kind: 'challenge', phase: 'identify', first: true }))
    expect(r.events).toContainEqual({ kind: 'xp', amount: 15 })
    s = r.state
    expect(s.challenges[id]).toMatchObject({ identified: true, fixed: false, attempts: 1, misses: 0 })

    r = applyAction(s, fix(id), open, NOW)
    expect(r.events).toContainEqual(expect.objectContaining({ kind: 'challenge', phase: 'done', first: true, helpless: true }))
    s = r.state
    expect(s.challenges[id]).toMatchObject({ identified: true, fixed: true, helpless: true, solved: '2026-10-16' })
    expect(gameXp(s, open)).toBe(30)
  })

  it('repetir a mesma ação não muda nada nem duplica XP', () => {
    const s = run(quiet(), open, NOW, ...solve(id))
    const xp = summary(s, open).xp
    const again = applyAction(s, identify(id), open, NOW)
    expect(again.changed).toBe(false)
    expect(again.state).toBe(s)
    expect(applyAction(s, fix(id), open, NOW).changed).toBe(false)
    expect(summary(s, open).xp).toBe(xp)
  })

  it('refazer o desafio (nova tentativa) não rende XP de novo', () => {
    let s = run(quiet(), open, NOW, ...solve(id))
    const xp = summary(s, open).xp
    s = run(s, open, NOW, { type: 'retry', challenge: id })
    expect(s.challenges[id].run).toEqual({ hints: [false, false, false], identified: false, fixed: false })
    expect(s.challenges[id]).toMatchObject({ identified: true, fixed: true }) // o que já foi conquistado fica
    s = run(s, open, NOW, ...solve(id))
    expect(summary(s, open).xp).toBe(xp)
    expect(gameXp(s, open)).toBe(30)
  })

  it('só refaz depois de concluir a tentativa', () => {
    const s = run(quiet(), open, NOW, identify(id))
    expect(applyAction(s, { type: 'retry', challenge: id }, open, NOW)).toMatchObject({ changed: false, rejected: 'order' })
    expect(applyAction(quiet(), { type: 'retry', challenge: id }, open, NOW)).toMatchObject({ changed: false, rejected: 'order' })
  })

  it('erro na identificação dá feedback, conta a tentativa e permite tentar de novo', () => {
    let s = quiet()
    const wrong = applyAction(s, { type: 'identify', challenge: id, lines: [0] }, open, NOW)
    expect(wrong.changed).toBe(true)
    expect(wrong.events).toContainEqual({ kind: 'challenge-miss', challenge: id, phase: 'identify' })
    expect(wrong.events.some((e) => e.kind === 'xp')).toBe(false)
    s = wrong.state
    expect(s.challenges[id]).toMatchObject({ identified: false, attempts: 1, misses: 1 })
    s = run(s, open, NOW, identify(id))
    expect(s.challenges[id]).toMatchObject({ identified: true, attempts: 2, misses: 1 })
  })

  it('só escolhe a correção depois de identificar a falha', () => {
    expect(applyAction(quiet(), fix(id), open, NOW)).toMatchObject({ changed: false, rejected: 'order' })
  })

  it('correção errada não apaga nada e permite nova tentativa', () => {
    let s = run(quiet(), open, NOW, identify(id))
    const wrongOption = (spec(id).fix + 1) % spec(id).options
    const r = applyAction(s, { type: 'fix', challenge: id, option: wrongOption }, open, NOW)
    expect(r.changed).toBe(true)
    expect(r.events).toContainEqual({ kind: 'challenge-miss', challenge: id, phase: 'fix' })
    s = r.state
    expect(s.challenges[id]).toMatchObject({ identified: true, fixed: false, misses: 1 })
    expect(s.challenges[id].run.identified).toBe(true)
    s = run(s, open, NOW, fix(id))
    expect(s.challenges[id].fixed).toBe(true)
  })

  it('recusa desafio inexistente e dados inválidos', () => {
    expect(applyAction(quiet(), { type: 'identify', challenge: 'nao-existe', lines: [0] }, open, NOW)).toMatchObject({ changed: false, rejected: 'missing' })
    expect(applyAction(quiet(), { type: 'identify', challenge: id, lines: [999] }, open, NOW)).toMatchObject({ changed: false, rejected: 'invalid' })
    const s = run(quiet(), open, NOW, identify(id))
    expect(applyAction(s, { type: 'fix', challenge: id, option: 99 }, open, NOW)).toMatchObject({ changed: false, rejected: 'invalid' })
    expect(applyAction(quiet(), { type: 'hint', challenge: id, index: 7 }, open, NOW)).toMatchObject({ changed: false, rejected: 'invalid' })
  })
})

describe('dicas e a conquista "Sem Ajuda"', () => {
  const id = vulnIds[1]

  it('concluir sem dicas conquista "Sem Ajuda"', () => {
    const s = run(quiet(), open, NOW, ...solve(id))
    expect(unlockedIds(s)).toContain('sem-ajuda')
  })

  it('usar uma dica impede a conquista nessa tentativa', () => {
    let s = run(quiet(), open, NOW, { type: 'hint', challenge: id, index: 0 })
    expect(s.challenges[id]).toMatchObject({ hints: 1 })
    expect(s.challenges[id].run.hints).toEqual([true, false, false])
    s = run(s, open, NOW, ...solve(id))
    expect(s.challenges[id]).toMatchObject({ identified: true, fixed: true, helpless: false })
    expect(unlockedIds(s)).not.toContain('sem-ajuda')
    expect(s.events.some((e) => e.kind === 'hint')).toBe(true)
  })

  it('a dica da fase de correção também conta', () => {
    let s = run(quiet(), open, NOW, identify(id), { type: 'hint', challenge: id, index: 2 })
    s = run(s, open, NOW, fix(id))
    expect(s.challenges[id].helpless).toBe(false)
  })

  it('a dica usada fica salva: recarregar a página não zera a tentativa', () => {
    const s = run(quiet(), open, NOW, { type: 'hint', challenge: id, index: 1 })
    const reloaded = cleanState(JSON.parse(JSON.stringify(s)))
    expect(reloaded.challenges[id].run.hints).toEqual([false, true, false])
  })

  it('pedir a mesma dica de novo não conta duas vezes', () => {
    let s = run(quiet(), open, NOW, { type: 'hint', challenge: id, index: 0 })
    const again = applyAction(s, { type: 'hint', challenge: id, index: 0 }, open, NOW)
    expect(again.changed).toBe(false)
    s = again.state
    expect(s.challenges[id].hints).toBe(1)
  })

  it('uma nova tentativa sem dicas conquista "Sem Ajuda" mesmo depois de uma com dica', () => {
    let s = run(quiet(), open, NOW, { type: 'hint', challenge: id, index: 0 }, ...solve(id))
    expect(unlockedIds(s)).not.toContain('sem-ajuda')
    s = run(s, open, NOW, { type: 'retry', challenge: id }, ...solve(id))
    expect(s.challenges[id].helpless).toBe(true)
    expect(unlockedIds(s)).toContain('sem-ajuda')
  })

  it('não se pede dica de uma tentativa já concluída', () => {
    const s = run(quiet(), open, NOW, ...solve(id))
    expect(applyAction(s, { type: 'hint', challenge: id, index: 0 }, open, NOW).changed).toBe(false)
  })
})

describe('conquistas dos desafios', () => {
  it('Explorador de Falhas: 5 desafios distintos de identificação; repetir um não conta duas vezes', () => {
    let s = quiet()
    for (const id of vulnIds.slice(0, 4)) s = run(s, open, NOW, identify(id))
    s = run(s, open, NOW, { type: 'retry', challenge: vulnIds[0] })
    expect(medals(s, open).find((m) => m.id === 'explorador-de-falhas')).toMatchObject({ value: 4, target: 5, unlocked: false })
    s = run(s, open, NOW, identify(vulnIds[0])) // o mesmo desafio de novo
    expect(medals(s, open).find((m) => m.id === 'explorador-de-falhas')?.value).toBe(4)
    s = run(s, open, NOW, identify(vulnIds[4]))
    expect(unlockedIds(s)).toContain('explorador-de-falhas')
  })

  it('Explorador de Falhas ignora os desafios de autorização', () => {
    let s = quiet()
    for (const id of authIds) s = run(s, open, NOW, identify(id))
    expect(medals(s, open).find((m) => m.id === 'explorador-de-falhas')?.value).toBe(0)
  })

  it('Guardião das APIs: 5 desafios de autorização concluídos (só identificar não basta)', () => {
    let s = quiet()
    for (const id of authIds.slice(0, 4)) s = run(s, open, NOW, ...solve(id))
    s = run(s, open, NOW, identify(authIds[4]))
    expect(medals(s, open).find((m) => m.id === 'guardiao-das-apis')).toMatchObject({ value: 4, unlocked: false })
    s = run(s, open, NOW, fix(authIds[4]))
    expect(unlockedIds(s)).toContain('guardiao-das-apis')
  })

  it('Código Protegido: 3 correções certas em desafios distintos', () => {
    let s = quiet()
    s = run(s, open, NOW, ...solve(vulnIds[0]), ...solve(authIds[0]))
    expect(unlockedIds(s)).not.toContain('codigo-protegido')
    s = run(s, open, NOW, { type: 'retry', challenge: vulnIds[0] }, ...solve(vulnIds[0])) // repetir o mesmo não soma
    expect(medals(s, open).find((m) => m.id === 'codigo-protegido')?.value).toBe(2)
    s = run(s, open, NOW, ...solve(vulnIds[1]))
    expect(unlockedIds(s)).toContain('codigo-protegido')
  })

  it('cada conquista é concedida uma vez, com a data, e não duplica XP', () => {
    let s = quiet()
    for (const id of authIds.slice(0, 5)) s = run(s, open, NOW, ...solve(id))
    expect(s.badges['guardiao-das-apis']).toBe('2026-10-16')
    const events: unknown[] = []
    const next = applyAction(s, { type: 'retry', challenge: authIds[0] }, open, D(2026, 10, 20))
    events.push(...next.events)
    expect(events.filter((e) => (e as { kind: string }).kind === 'medal')).toHaveLength(0)
    const solvedAgain = run(next.state, open, D(2026, 10, 20), ...solve(authIds[0]))
    expect(solvedAgain.badges['guardiao-das-apis']).toBe('2026-10-16') // a data original permanece
    expect(summary(solvedAgain, open).medalXp).toBe(summary(s, open).medalXp)
  })
})

describe('conquista secreta "Além do Óbvio"', () => {
  const id = 'chave-no-navegador'
  const x = spec(id)
  const alem = (s: StudyState, ctx = open) => medals(s, ctx).find((m) => m.id === 'alem-do-obvio')!

  it('fica oculta enquanto bloqueada: nome, descrição e progresso não aparecem', () => {
    const m = alem(quiet())
    expect(m).toMatchObject({ secret: true, masked: true, unlocked: false, value: 0, target: 0 })
    expect(m.name).toBe('Conquista secreta')
    expect(m.desc).not.toMatch(/falha opcional/i)
    expect(m.desc).toBe(m.hint) // mostra só a dica
  })

  it('acertar só a falha principal não revela a secreta', () => {
    const s = run(quiet(), open, NOW, ...solve(id))
    expect(s.challenges[id].extra).toBe(false)
    expect(alem(s).masked).toBe(true)
  })

  it('marcar a falha opcional junto da principal libera a conquista e mostra os dados reais', () => {
    const s = run(quiet(), open, NOW, { type: 'identify', challenge: id, lines: [...x.vulnerable, ...x.extra] })
    expect(s.challenges[id].extra).toBe(true)
    expect(alem(s)).toMatchObject({ name: 'Além do Óbvio', masked: false, unlocked: true, date: '2026-10-16' })
  })

  it('o aviso de desbloqueio traz o nome real', () => {
    const r = applyAction(quiet(), { type: 'identify', challenge: id, lines: [...x.vulnerable, ...x.extra] }, open, NOW)
    const event = r.events.find((e) => e.kind === 'medal' && e.medal.id === 'alem-do-obvio')
    expect(event).toBeDefined()
    expect(event && event.kind === 'medal' && event.medal.name).toBe('Além do Óbvio')
  })

  it('pode ser achada em uma nova tentativa', () => {
    let s = run(quiet(), open, NOW, ...solve(id))
    s = run(s, open, NOW, { type: 'retry', challenge: id }, { type: 'identify', challenge: id, lines: [...x.vulnerable, ...x.extra] })
    expect(alem(s).unlocked).toBe(true)
  })
})

describe('Persistência: dias reais de estudo', () => {
  /** Uma ação de estudo que sempre muda o estado (alterna o cartão), para contar o dia. */
  const study = (day: number): Action => ({ type: 'card', id: 'm0-c1', known: day % 2 === 0 })
  const days = (from: number, count: number) => Array.from({ length: count }, (_, i) => D(2026, 11, from + i))

  it('7 dias seguidos conquistam; 6 não', () => {
    let s = quiet()
    s.quests.day = ''
    for (const d of days(1, 6)) s = applyAction(s, study(d.getDate()), open, d).state
    expect(s.study).toMatchObject({ current: 6, best: 6 })
    expect(unlockedIds(s)).not.toContain('persistencia')
    s = applyAction(s, study(7), open, D(2026, 11, 7)).state
    expect(s.study.best).toBe(7)
    expect(unlockedIds(s)).toContain('persistencia')
    expect(s.badges.persistencia).toBe('2026-11-07')
  })

  it('um dia sem estudo zera a contagem e um escudo não preenche a lacuna', () => {
    let s = emptyState()
    s.shop.shields = 3
    for (const d of [D(2026, 11, 1), D(2026, 11, 2), D(2026, 11, 3), D(2026, 11, 6)]) s = applyAction(s, study(d.getDate()), open, d).state
    expect(s.streak.current).toBe(4) // a sequência com escudo continua
    expect(s.study).toMatchObject({ current: 1, best: 3 }) // os dias reais, não
  })

  it('várias ações no mesmo dia contam um dia só', () => {
    let s = emptyState()
    for (let i = 0; i < 3; i++) s = applyAction(s, { type: 'read', module: 0, index: i }, open, NOW).state
    expect(s.study).toMatchObject({ current: 1, best: 1 })
  })

  it('o dia segue o fuso local: 23h59 e 00h01 são dias diferentes', () => {
    let s = emptyState()
    s = applyAction(s, study(0), open, new Date(2026, 10, 1, 23, 59)).state
    s = applyAction(s, study(1), open, new Date(2026, 10, 2, 0, 1)).state
    expect(s.study).toMatchObject({ last: '2026-11-02', current: 2 })
  })

  it('a contagem em andamento vale só se estudou hoje ou ontem', () => {
    const s = applyAction(emptyState(), study(0), open, D(2026, 11, 1)).state
    expect(activeStudyDays(s, D(2026, 11, 1))).toBe(1)
    expect(activeStudyDays(s, D(2026, 11, 2))).toBe(1)
    expect(activeStudyDays(s, D(2026, 11, 3))).toBe(0)
  })
})

describe('trilha, fogueiras e pré-requisitos', () => {
  it('o módulo só abre com a fogueira dos pré-requisitos acesa', () => {
    const s = emptyState()
    expect(isModuleUnlocked(s, real, 0)).toBe(true)
    expect(isModuleUnlocked(s, real, 1)).toBe(false)
    expect(missingPrereqs(s, real, 3)).toEqual([1, 2])
    expect(trail(s, real).filter((m) => m.unlocked).map((m) => m.module)).toEqual([0, 4, 6]) // módulos sem pré-requisito
  })

  it('tarefas, dicas e desafios de um módulo bloqueado são recusados com o motivo', () => {
    const s = emptyState()
    expect(applyAction(s, { type: 'read', module: 1, index: 0 }, real, NOW)).toMatchObject({ changed: false, rejected: 'prereq' })
    expect(applyAction(s, { type: 'answer', module: 1, index: 0 }, real, NOW).rejected).toBe('prereq')
    expect(applyAction(s, { type: 'miss', module: 1, index: 0 }, real, NOW).rejected).toBe('prereq')
    // um desafio de módulo bloqueado que nenhuma missão usa (os usados por missões abrem pela missão)
    const blocked = challengeSpecs.find((c) => c.module !== null && c.module !== 8 && !isModuleUnlocked(s, real, c.module) && !spotIds.has(c.id))!
    expect(applyAction(s, { type: 'identify', challenge: blocked.id, lines: blocked.vulnerable }, real, NOW).rejected).toBe('prereq')
    expect(applyAction(s, { type: 'hint', challenge: blocked.id, index: 0 }, real, NOW).rejected).toBe('prereq')
  })

  it('um desafio clássico usado como atividade de missão abre pela missão, sem exigir o módulo da trilha', () => {
    const s = emptyState()
    const used = challengeSpecs.filter((c) => c.module !== null && !isModuleUnlocked(s, real, c.module) && spotIds.has(c.id))
    expect(used.length).toBeGreaterThan(0)
    for (const c of used) {
      expect(isChallengeOpen(s, real, c), c.id).toBe(true)
      expect(applyAction(s, { type: 'hint', challenge: c.id, index: 0 }, real, NOW).rejected, c.id).toBeUndefined()
    }
    // e o contrário: sem missão, o desafio de módulo bloqueado continua fechado
    const other = challengeSpecs.find((c) => c.module !== null && !isModuleUnlocked(s, real, c.module) && !spotIds.has(c.id))!
    expect(isChallengeOpen(s, real, other)).toBe(false)
  })

  it('anotações continuam livres em qualquer módulo', () => {
    const r = applyAction(emptyState(), { type: 'note', module: 3, field: 'notes', value: 'minhas notas' }, real, NOW)
    expect(r.changed).toBe(true)
  })

  it('concluir o módulo acende a fogueira, libera o seguinte e avisa', () => {
    let s = quiet()
    s = run(s, real, NOW, ...finishModule(0).slice(0, 6))
    const last = applyAction(s, finishModule(0)[6], real, NOW)
    expect(last.events).toContainEqual({ kind: 'module', module: 0 })
    expect(last.events).toContainEqual({ kind: 'unlock', module: 1 })
    expect(last.state.fires[0]).toBe('2026-10-16')
    expect(last.state.events.some((e) => e.kind === 'fogueira' && e.ref === 'm0')).toBe(true)
    expect(isModuleUnlocked(last.state, real, 1)).toBe(true)
    expect(trail(last.state, real)[0].fire).toEqual({ lit: true, day: '2026-10-16' })
  })

  it('quem já tinha começado um módulo antes da regra continua com acesso', () => {
    const old = cleanState({ modules: { 3: { reads: [true, false, false] } } })
    expect(missingPrereqs(old, real, 3)).toEqual([1, 2])
    expect(isModuleUnlocked(old, real, 3)).toBe(true)
    expect(applyAction(old, { type: 'read', module: 3, index: 1 }, real, NOW).changed).toBe(true)
  })

  it('permite revisitar: tarefa repetida não muda nada e as aulas seguem acessíveis', () => {
    const s = run(quiet(), real, NOW, ...finishModule(0))
    const again = applyAction(s, { type: 'read', module: 0, index: 0 }, real, NOW)
    expect(again.changed).toBe(false)
    expect(again.rejected).toBeUndefined()
    expect(summary(s, real).xp).toBe(summary(again.state, real).xp)
  })

  it('o chefe fica indisponível até a fogueira do módulo', () => {
    const t = trail(quiet(), real)[0]
    expect(t.boss).toMatchObject({ exists: true, available: false, won: false })
    expect(t.steps.find((x) => x.id === 'chefe')?.status).toBe('locked')
    expect(t.steps.find((x) => x.id === 'fogueira')?.status).toBe('locked')
  })

  it('as etapas mostram disponível, bloqueada ou concluída', () => {
    const s = run(quiet(), real, NOW, { type: 'read', module: 0, index: 0 }, { type: 'read', module: 0, index: 1 }, { type: 'read', module: 0, index: 2 })
    const t = trail(s, real)
    expect(t[0].steps.find((x) => x.id === 'aulas')).toMatchObject({ status: 'done', done: 3, total: 3 })
    expect(t[0].steps.find((x) => x.id === 'pesquisa')?.status).toBe('available')
    expect(t[1].steps.find((x) => x.id === 'aulas')?.status).toBe('locked')
    expect(t[1].missing).toEqual([0])
  })
})

describe('chefe do módulo', () => {
  const boss = (module: number, index: number, option: number): Action => ({ type: 'bossAnswer', module, index, option })
  const right = (module: number, index: number) => bossAnswers[module][index]
  const wrong = (module: number, index: number) => (bossAnswers[module][index] + 1) % 4
  const ready = () => run(quiet(), open, NOW, ...finishModule(0))

  it('exige a fogueira acesa', () => {
    expect(applyAction(quiet(), boss(0, 0, right(0, 0)), open, NOW)).toMatchObject({ changed: false, rejected: 'fogueira' })
  })

  it('erro mostra o resultado, conta o erro e permite tentar de novo sem perder nada', () => {
    let s = ready()
    const r = applyAction(s, boss(0, 0, wrong(0, 0)), open, NOW)
    expect(r.changed).toBe(true)
    expect(r.events).toContainEqual({ kind: 'boss-miss', module: 0 })
    s = r.state
    expect(s.bosses[0]).toMatchObject({ mistakes: 1, done: [false, false, false], won: '' })
    expect(s.fires[0]).toBe('2026-10-16') // a fogueira continua acesa
    s = run(s, open, NOW, boss(0, 0, right(0, 0)))
    expect(s.bosses[0].done).toEqual([true, false, false])
  })

  it('vencer rende 60 XP uma única vez e conquista "Mestre do Módulo"', () => {
    let s = ready()
    s = run(s, open, NOW, boss(0, 0, wrong(0, 0)), boss(0, 0, right(0, 0)), boss(0, 1, right(0, 1)))
    const before = summary(s, open).xp
    const win = applyAction(s, boss(0, 2, right(0, 2)), open, NOW)
    expect(win.events).toContainEqual({ kind: 'boss', module: 0, flawless: false, first: true })
    s = win.state
    expect(s.bosses[0]).toMatchObject({ won: '2026-10-16', wins: 1, flawless: false })
    expect(gameXp(s, open)).toBe(60)
    expect(unlockedIds(s)).toContain('mestre-do-modulo')
    expect(summary(s, open).xp).toBeGreaterThan(before + 59)
  })

  it('vencer sem erros marca vitória perfeita', () => {
    let s = ready()
    for (let j = 0; j < 3; j++) s = run(s, open, NOW, boss(0, j, right(0, j)))
    expect(s.bosses[0]).toMatchObject({ wins: 1, flawless: true })
  })

  it('enfrentar o chefe de novo não acumula XP nem duplica a conquista', () => {
    let s = ready()
    for (let j = 0; j < 3; j++) s = run(s, open, NOW, boss(0, j, right(0, j)))
    const xp = summary(s, open).xp
    expect(applyAction(s, { type: 'bossAnswer', module: 0, index: 0, option: right(0, 0) }, open, NOW).changed).toBe(false) // tentativa já concluída
    s = run(s, open, NOW, { type: 'bossRetry', module: 0 })
    expect(s.bosses[0]).toMatchObject({ done: [false, false, false], mistakes: 0, won: '2026-10-16' })
    for (let j = 0; j < 3; j++) s = run(s, open, D(2026, 10, 20), boss(0, j, right(0, j)))
    expect(s.bosses[0]).toMatchObject({ wins: 2, won: '2026-10-16' })
    expect(summary(s, open).xp).toBe(xp)
    expect(s.badges['mestre-do-modulo']).toBe('2026-10-16')
  })

  it('só repete o chefe depois de vencê-lo', () => {
    expect(applyAction(ready(), { type: 'bossRetry', module: 0 }, open, NOW)).toMatchObject({ changed: false, rejected: 'order' })
  })

  it('dados inválidos são recusados', () => {
    expect(applyAction(ready(), boss(0, 9, 0), open, NOW).rejected).toBe('invalid')
    expect(applyAction(ready(), boss(0, 0, -1), open, NOW).rejected).toBe('invalid')
    expect(applyAction(ready(), boss(0, 0, 99), open, NOW).rejected).toBe('invalid')
  })
})

describe('próximo objetivo', () => {
  it('começa pelas aulas do primeiro módulo', () => {
    expect(nextObjective(emptyState(), real)).toMatchObject({ kind: 'step', module: 0, step: 'aulas', started: false })
  })

  it('segue o módulo em andamento antes de começar outro', () => {
    const s = run(quiet(), real, NOW, { type: 'read', module: 0, index: 0 }, { type: 'read', module: 0, index: 1 }, { type: 'read', module: 0, index: 2 })
    expect(nextObjective(s, real)).toMatchObject({ kind: 'step', module: 0, step: 'pesquisa' })
  })

  it('depois da fogueira, o objetivo é o chefe', () => {
    const s = run(quiet(), real, NOW, ...finishModule(0))
    expect(nextObjective(s, real)).toEqual({ kind: 'boss', module: 0, xp: 60 })
  })

  it('vencido o chefe, o próximo módulo liberado vira o objetivo', () => {
    let s = run(quiet(), real, NOW, ...finishModule(0))
    for (let j = 0; j < 3; j++) s = run(s, real, NOW, { type: 'bossAnswer', module: 0, index: j, option: bossAnswers[0][j] })
    const next = nextObjective(s, real)
    expect(next).toMatchObject({ kind: 'step', step: 'aulas', started: false })
    expect(isModuleUnlocked(s, real, (next as { module: number }).module)).toBe(true)
  })

  it('com tudo feito, avisa que a trilha terminou', () => {
    let s = quiet()
    for (let i = 0; i < 9; i++) {
      s = run(s, real, NOW, ...finishModule(i))
      for (let j = 0; j < 3; j++) s = run(s, real, NOW, { type: 'bossAnswer', module: i, index: j, option: bossAnswers[i][j] })
    }
    s = run(s, real, NOW, { type: 'completeLab' }, ...[0, 1, 2, 3, 4, 5].map((index): Action => ({ type: 'solveCase', index })))
    for (const c of challengeSpecs) s = run(s, real, NOW, ...solve(c.id))
    expect(nextObjective(s, real)).toEqual({ kind: 'done' })
    expect(summary(s, real).xp).toBeGreaterThan(2400) // concluir a trilha clássica passa da Lenda do AppSec
    expect(levelFor(summary(s, real).xp).number).toBeGreaterThanOrEqual(10)
    expect(levelFor(summary(s, real).xp).name).not.toBe('Lenda da segurança completa') // o último nível exige também as campanhas e os dossiês
    expect(medals(s, real).filter((m) => m.unlocked && !m.secret)).toHaveLength(35) // faltam as de mecânicas, de dias reais e as das campanhas (nenhuma missão foi feita aqui)
    expect(unlockedIds(s, real)).toEqual(expect.arrayContaining(['primeira-chama', 'explorador-de-falhas', 'guardiao-das-apis', 'codigo-protegido', 'sem-ajuda', 'mestre-do-modulo']))
  })
})

describe('Primeira Chama', () => {
  it('exige as três etapas da aula, não apenas uma leitura', () => {
    let s = quiet()
    s = run(s, real, NOW, { type: 'read', module: 0, index: 0 }, { type: 'read', module: 0, index: 1 })
    expect(unlockedIds(s, real)).not.toContain('primeira-chama')
    expect(unlockedIds(s, real)).toContain('first-read')
    s = run(s, real, NOW, { type: 'read', module: 0, index: 2 })
    expect(unlockedIds(s, real)).toContain('primeira-chama')
  })
})

describe('flashcards e preferências', () => {
  it('marcar um cartão é registrado, sem XP, e não repete', () => {
    const s0 = quiet()
    const xp = summary(s0, real).xp
    const r = applyAction(s0, { type: 'card', id: 'm0-c1', known: true }, real, NOW)
    expect(r.changed).toBe(true)
    expect(r.state.cards['m0-c1']).toBe(true)
    expect(summary(r.state, real).xp).toBe(xp)
    expect(applyAction(r.state, { type: 'card', id: 'm0-c1', known: true }, real, NOW).changed).toBe(false)
    expect(applyAction(r.state, { type: 'card', id: 'm0-c1', known: false }, real, NOW).state.cards['m0-c1']).toBe(false)
  })

  it('recusa ids inválidos', () => {
    expect(applyAction(quiet(), { type: 'card', id: '../x', known: true }, real, NOW).rejected).toBe('invalid')
    expect(applyAction(quiet(), { type: 'card', id: 'm9-c1', known: true }, real, NOW).rejected).toBe('invalid')
  })

  it('o som das conquistas vem desligado e a preferência é salva', () => {
    expect(emptyState().prefs.sound).toBe(false)
    const s = applyAction(emptyState(), { type: 'setSound', on: true }, real, NOW).state
    expect(s.prefs.sound).toBe(true)
    expect(applyAction(s, { type: 'setSound', on: true }, real, NOW).changed).toBe(false)
  })
})

describe('histórico de eventos', () => {
  it('registra aula, dica, desafio e conquista', () => {
    const id = vulnIds[0]
    const s = run(quiet(), open, NOW, { type: 'read', module: 0, index: 0 }, { type: 'hint', challenge: id, index: 0 }, ...solve(id))
    const kinds = s.events.map((e) => e.kind)
    expect(kinds).toEqual(expect.arrayContaining(['read', 'hint', 'identify', 'fix', 'challenge', 'achievement']))
    expect(s.events[0]).toMatchObject({ kind: 'read', ref: 'm0-aula-1', day: '2026-10-16' })
  })

  it('guarda só os mais recentes', () => {
    let s = quiet()
    for (let i = 0; i < 350; i++) s = applyAction(s, { type: 'card', id: `m${i % 8}-c${(i % 5) + 1}`, known: i % 2 === 0 }, open, NOW).state
    expect(s.events.length).toBeLessThanOrEqual(300)
  })
})

describe('migração e saneamento do estado', () => {
  const v2 = {
    version: 2,
    lab: true,
    cases: [true, false, false, false, false, false],
    modules: { 0: { reads: [true, true, true], research: true, practice: true, solved: [true, true], notes: 'minhas notas', researchNote: 'pesquisa' } },
    badges: { 'first-read': '2026-10-01' },
    streak: { last: '2026-10-15', current: 4, best: 6, shieldUsed: '' },
    shop: { shields: 1, owned: [], theme: 'dragon', rewards: [] },
    coins: { bonus: 12, spent: 3 },
  }

  it('um estado da versão 2 vira versão 4 sem perder nada', () => {
    const s = cleanState(JSON.parse(JSON.stringify(v2)))
    expect(s.version).toBe(4)
    expect(s.lab).toBe(true)
    expect(s.cases[0]).toBe(true)
    expect(s.modules[0]).toMatchObject({ reads: [true, true, true], research: true, practice: true, solved: [true, true], notes: 'minhas notas' })
    expect(s.badges['first-read']).toBe('2026-10-01')
    expect(s.shop.shields).toBe(1)
    expect(s.coins).toEqual({ bonus: 12, spent: 3 })
    expect(s.challenges).toEqual({})
    expect(s.bosses[0]).toEqual({ done: [false, false, false], mistakes: 0, wins: 0, won: '', flawless: false })
    expect(s.prefs.sound).toBe(false)
    expect(s.events).toEqual([])
    // O módulo já concluído mantém o acesso à fogueira (derivada), e o módulo seguinte abre.
    expect(isModuleUnlocked(s, real, 1)).toBe(true)
  })

  it('migra dias reais de estudo da sequência antiga só quando nenhum escudo foi usado', () => {
    // O relógio de horas e os dias somados entraram depois: começam do que a sequência antiga garante.
    const zerado = { minutes: 0, clockDay: '', minutesToday: 0 }
    expect(cleanState(v2).study).toEqual({ last: '2026-10-15', current: 4, best: 6, total: 4, ...zerado })
    const shielded = cleanState({ ...v2, streak: { ...v2.streak, shieldUsed: '2026-10-10' } })
    expect(shielded.study).toEqual({ last: '2026-10-15', current: 1, best: 1, total: 1, ...zerado }) // sem progresso fictício
  })

  it('o XP e as medalhas antigas continuam iguais depois da migração', () => {
    const s = cleanState(v2)
    const sm = summary(s, real)
    expect(sm.taskXp).toBe(100 + 30 + 40)
    expect(medals(s, real).find((m) => m.id === 'first-read')).toMatchObject({ unlocked: true, date: '2026-10-01' })
  })

  it('descarta dados malformados dos campos novos', () => {
    const s = cleanState({
      challenges: {
        'saida-no-dom': { identified: 'sim', fixed: true, helpless: true, extra: true, attempts: -4, misses: 'x', run: { fixed: true, hints: 'abc' } },
        'Inválido!': { identified: true },
      },
      bosses: { 0: { done: [true, 'x', true], won: 'ontem', wins: 9, flawless: true } },
      cards: { 'm0-c1': true, '../x': true, 'm0-c2': 'sim' },
      events: [{ at: 1, day: '2026-10-16', kind: 'read', ref: 'm0-aula-1' }, { at: 'x' }, { at: 2, day: '2026-10-16', kind: 'hack', ref: 'x' }],
      prefs: { sound: 'yes' },
      learner: { id: 'ABC DEF', since: 'hoje' },
    })
    expect(Object.keys(s.challenges)).toEqual(['saida-no-dom'])
    // fixed/helpless/extra não valem sem a identificação: o estado é coerente
    expect(s.challenges['saida-no-dom']).toMatchObject({ identified: false, fixed: false, helpless: false, extra: false, attempts: 0, misses: 0 })
    expect(s.bosses[0]).toEqual({ done: [true, false, true], mistakes: 0, wins: 0, won: '', flawless: false })
    expect(s.cards).toEqual({ 'm0-c1': true })
    expect(s.events).toHaveLength(1)
    expect(s.prefs.sound).toBe(false)
    expect(s.learner).toEqual({ id: '', since: '' })
  })

  it('ignora o armazenamento que não é objeto', () => {
    for (const bad of [null, 42, 'x', [], undefined]) expect(cleanState(bad).version).toBe(4)
  })

  it('o aluno recebe um identificador local na primeira ação', () => {
    const s = applyAction(emptyState(), { type: 'read', module: 0, index: 0 }, real, NOW).state
    expect(s.learner.id).toMatch(/^a[a-z0-9]+$/)
    expect(s.learner.since).toBe('2026-10-16')
    const later = applyAction(s, { type: 'read', module: 0, index: 1 }, real, D(2026, 10, 18)).state
    expect(later.learner).toEqual(s.learner)
  })
})

describe('exportação e importação do progresso', () => {
  const sample = () => run(quiet(), open, NOW, ...solve(vulnIds[0]), { type: 'setSound', on: true })

  it('exportar e importar devolve o mesmo progresso', () => {
    const s = sample()
    const text = exportProgress(s, NOW, 'America/Sao_Paulo')
    const parsed = JSON.parse(text)
    expect(parsed).toMatchObject({ app: BACKUP_APP, format: 'progress', version: 4, timezone: 'America/Sao_Paulo' })
    const result = parseBackup(text)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.state).toEqual(s)
      expect(result.exportedAt).toBe(NOW.toISOString())
    }
  })

  it('aceita também a cópia crua do estado salvo (versão 2)', () => {
    const result = parseBackup(JSON.stringify({ version: 2, lab: true, modules: {}, cases: [] }))
    expect(result.ok && result.state.lab).toBe(true)
  })

  it('recusa arquivos que não são backup do site', () => {
    for (const text of ['', 'não é json', '[]', '42', '{}', JSON.stringify({ app: 'outro', format: 'progress', state: {} }), JSON.stringify({ app: BACKUP_APP, format: 'progress' })]) {
      expect(parseBackup(text).ok).toBe(false)
    }
    expect(parseBackup('x'.repeat(2_000_001)).ok).toBe(false)
  })

  it('o que vem do arquivo é saneado antes de entrar', () => {
    const text = JSON.stringify({ app: BACKUP_APP, format: 'progress', state: { lab: 'sim', modules: { 0: { reads: [true, 1, 'x'] } }, shop: { theme: 'inexistente', shields: 999 } } })
    const result = parseBackup(text)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.state.lab).toBe(false)
      expect(result.state.modules[0].reads).toEqual([true, false, false])
      expect(result.state.shop.theme).toBe(DEFAULT_THEME)
      expect(result.state.shop.shields).toBeLessThanOrEqual(5)
    }
  })

  it('o nome do arquivo tem a data local', () => {
    expect(backupFileName(NOW)).toBe('ai-security-lab-progresso-2026-10-16.json')
  })
})
