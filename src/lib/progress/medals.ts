import { bossCount, challengeStats, isBossWon, gameXp } from './challenges'
import { BOSS_XP, CHALLENGE_XP, MAX_TASK_XP, READS_PER_MODULE, STUDY_GOAL, TIER_XP, TOTAL_TASKS } from './constants'
import { baseTotals, coreModules, countDone, isModuleComplete } from './core'
import type { AchievementCategory, Medal, MedalIcon, ProgressContext, StudyState, Tier } from './types'

export interface ProgressStats {
  reads: number
  researches: number
  practices: number
  answers: number
  firstTry: number
  retried: number
  modules: number
  cases: number
  solvedSizes: number
  sizeCount: number
  lab: number
  streak: number
  steps: number
  reviews: number
  perfectReviews: number
  quests: number
  shields: number
  redeemed: number
  bestDayXp: number
  /** Aulas concluídas: módulos com as três etapas (Conceito, Exemplo e Como corrigir) lidas. */
  lessons: number
  vulnIdentified: number
  authDone: number
  fixedDistinct: number
  helpless: number
  extra: number
  /** Maior sequência de dias reais de estudo, sem escudos. */
  studyDays: number
  /** Módulos com as aulas concluídas e o chefe derrotado. */
  mastered: number
  /** Módulos de acesso antecipado desbloqueados com moedas. */
  unlocks: number
}

const sum = <T,>(list: readonly T[], f: (item: T) => number) => list.reduce((n, item) => n + f(item), 0)

export function computeStats(s: StudyState, ctx: ProgressContext): ProgressStats {
  // As metas que citam totais ("24 leituras", "12 de 16 questões", "8 módulos") valem só para a trilha
  // principal; o módulo de acesso antecipado tem as próprias conquistas.
  const ms = coreModules(s)
  const all = Object.values(s.modules)
  const ch = challengeStats(s, ctx)
  return {
    reads: sum(ms, (m) => countDone(m.reads)),
    researches: sum(ms, (m) => Number(m.research)),
    practices: sum(ms, (m) => Number(m.practice)),
    answers: sum(ms, (m) => countDone(m.solved)),
    firstTry: sum(ms, (m) => countDone(m.firstTry)),
    retried: sum(ms, (m) => m.solved.filter((v, j) => v && m.misses[j] > 0).length),
    modules: ms.filter(isModuleComplete).length,
    cases: countDone(s.cases),
    solvedSizes: new Set(ctx.sizes.filter((_, i) => s.cases[i])).size,
    sizeCount: new Set(ctx.sizes).size,
    lab: Number(s.lab),
    streak: s.streak.best,
    steps: baseTotals(s).steps,
    reviews: s.lifetime.reviews,
    perfectReviews: s.lifetime.perfectReviews,
    quests: s.lifetime.quests,
    shields: s.lifetime.shields,
    redeemed: s.lifetime.redeemed,
    bestDayXp: s.bestDayXp,
    lessons: all.filter((m) => countDone(m.reads) === READS_PER_MODULE).length,
    vulnIdentified: ch.vulnIdentified,
    authDone: ch.authDone,
    fixedDistinct: ch.fixed,
    helpless: ch.helpless,
    extra: ch.extra,
    studyDays: s.study.best,
    mastered: all.filter((m, i) => countDone(m.reads) === READS_PER_MODULE && (ctx.bosses[i]?.length ?? 0) > 0 && isBossWon(s.bosses[i])).length,
    unlocks: s.shop.unlocked.length,
  }
}

export interface MedalDef {
  id: string
  name: string
  /** Condição para conquistar, em linguagem simples. */
  desc: string
  tier: Tier
  icon: MedalIcon
  category: AchievementCategory
  /** Conquista secreta: nome, descrição e progresso ficam ocultos até o desbloqueio. */
  secret?: boolean
  hint?: string
  /** Devolve [valor atual, meta]. Meta 0 nunca libera a medalha. */
  goal: (st: ProgressStats, s: StudyState) => [number, number]
}

/** "Ataques e defesa" -> "ataques-e-defesa" */
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function medalDefinitions(ctx: ProgressContext): MedalDef[] {
  const list: MedalDef[] = [
    // Conquistas do sistema de aprendizado interativo (desafios de código, trilha e chefes).
    { id: 'primeira-chama', category: 'aprendizado', name: 'Primeira Chama', tier: 'bronze', icon: 'flame-kindling', desc: 'Conclua a primeira aula: as três etapas (Conceito, Exemplo e Como corrigir) de um módulo.', goal: (st) => [st.lessons, 1] },
    { id: 'explorador-de-falhas', category: 'desafios', name: 'Explorador de Falhas', tier: 'prata', icon: 'bug', desc: 'Identifique as linhas vulneráveis em 5 desafios de código diferentes.', goal: (st) => [st.vulnIdentified, 5] },
    { id: 'guardiao-das-apis', category: 'desafios', name: 'Guardião das APIs', tier: 'prata', icon: 'key-round', desc: 'Conclua 5 desafios de autorização diferentes: identifique a falha e escolha a correção.', goal: (st) => [st.authDone, 5] },
    { id: 'codigo-protegido', category: 'desafios', name: 'Código Protegido', tier: 'prata', icon: 'file-lock', desc: 'Escolha a correção certa em 3 desafios de código diferentes.', goal: (st) => [st.fixedDistinct, 3] },
    { id: 'sem-ajuda', category: 'desafios', name: 'Sem Ajuda', tier: 'prata', icon: 'lightbulb-off', desc: 'Conclua um desafio de código sem usar nenhuma dica naquela tentativa.', goal: (st) => [st.helpless, 1] },
    { id: 'persistencia', category: 'constancia', name: 'Persistência', tier: 'ouro', icon: 'calendar-check', desc: `Estude em ${STUDY_GOAL} dias consecutivos. Só contam dias reais de estudo: escudos não preenchem lacunas.`, goal: (st) => [st.studyDays, STUDY_GOAL] },
    { id: 'mestre-do-modulo', category: 'trilha', name: 'Mestre do Módulo', tier: 'ouro', icon: 'swords', desc: 'Conclua as aulas e derrote o desafio final (o chefe) de um módulo.', goal: (st) => [st.mastered, 1] },
    {
      id: 'alem-do-obvio',
      category: 'desafios',
      name: 'Além do Óbvio',
      tier: 'ouro',
      icon: 'eye',
      secret: true,
      hint: 'Nem toda falha de um laboratório está no enunciado. Releia o código com calma.',
      desc: 'Encontre uma falha opcional prevista em um desafio do laboratório de código.',
      goal: (st) => [st.extra, 1],
    },
    { id: 'first-read', category: 'aprendizado', name: 'Primeira leitura', tier: 'bronze', icon: 'book-open', desc: 'Registre a leitura de uma seção de matéria.', goal: (st) => [st.reads, 1] },
    { id: 'reader-12', category: 'aprendizado', name: 'Leitor dedicado', tier: 'prata', icon: 'book-open', desc: 'Registre 12 leituras de seção.', goal: (st) => [st.reads, 12] },
    { id: 'reader-24', category: 'aprendizado', name: 'Biblioteca completa', tier: 'ouro', icon: 'library', desc: 'Registre as 24 leituras de seção, nos oito módulos.', goal: (st) => [st.reads, 24] },
    { id: 'first-research', category: 'aprendizado', name: 'Primeira pesquisa', tier: 'bronze', icon: 'search', desc: 'Conclua a pesquisa orientada de um módulo.', goal: (st) => [st.researches, 1] },
    { id: 'researcher-4', category: 'aprendizado', name: 'Pesquisador', tier: 'prata', icon: 'telescope', desc: 'Conclua a pesquisa orientada de 4 módulos.', goal: (st) => [st.researches, 4] },
    { id: 'first-practice', category: 'aprendizado', name: 'Mão na massa', tier: 'bronze', icon: 'wrench', desc: 'Conclua a atividade prática de um módulo.', goal: (st) => [st.practices, 1] },
    { id: 'practitioner-4', category: 'aprendizado', name: 'Prática constante', tier: 'prata', icon: 'hammer', desc: 'Conclua a atividade prática de 4 módulos.', goal: (st) => [st.practices, 4] },
    { id: 'first-answer', category: 'aprendizado', name: 'Primeiro acerto', tier: 'bronze', icon: 'diamond', desc: 'Acerte uma questão de múltipla escolha.', goal: (st) => [st.answers, 1] },
    { id: 'retry', category: 'aprendizado', name: 'Aprendeu com o erro', tier: 'bronze', icon: 'rotate-ccw', desc: 'Acerte uma questão depois de errar e revisar o conteúdo.', goal: (st) => [st.retried, 1] },
    { id: 'sharp-5', category: 'aprendizado', name: 'Mira afiada', tier: 'prata', icon: 'target', desc: 'Acerte 5 questões de primeira, sem erros anteriores.', goal: (st) => [st.firstTry, 5] },
    { id: 'sharp-12', category: 'aprendizado', name: 'Precisão de elite', tier: 'ouro', icon: 'crosshair', desc: 'Acerte 12 das 16 questões de primeira.', goal: (st) => [st.firstTry, 12] },
    { id: 'first-module', category: 'trilha', name: 'Primeiro módulo', tier: 'bronze', icon: 'circle-dot', desc: 'Conclua as 7 tarefas de um módulo.', goal: (st) => [st.modules, 1] },
    { id: 'half-modules', category: 'trilha', name: 'Meio caminho', tier: 'prata', icon: 'circle-dot', desc: 'Conclua 4 dos 8 módulos.', goal: (st) => [st.modules, 4] },
    { id: 'all-modules', category: 'trilha', name: 'Módulos dominados', tier: 'ouro', icon: 'graduation-cap', desc: 'Conclua os 8 módulos de estudo.', goal: (st) => [st.modules, 8] },
  ]
  for (const t of ctx.tracks) {
    list.push({
      id: `track-${slugify(t.name)}`,
      category: 'trilha',
      name: `Trilha ${t.name}`,
      tier: 'prata',
      icon: 'mountain',
      desc: `Conclua todos os módulos da trilha ${t.name}.`,
      goal: (_, s) => [t.modules.filter((i) => s.modules[i] && isModuleComplete(s.modules[i])).length, t.modules.length],
    })
  }
  list.push(
    { id: 'lab-done', category: 'desafios', name: 'Laboratório concluído', tier: 'bronze', icon: 'flask-conical', desc: 'Analise o cenário do laboratório de injeção de prompt.', goal: (st) => [st.lab, 1] },
    { id: 'first-fix', category: 'desafios', name: 'Primeira correção', tier: 'bronze', icon: 'check-check', desc: 'Resolva um cenário de correção.', goal: (st) => [st.cases, 1] },
    { id: 'fixer-3', category: 'desafios', name: 'Corretor', tier: 'prata', icon: 'check-check', desc: 'Resolva 3 cenários de correção.', goal: (st) => [st.cases, 3] },
    { id: 'all-sizes', category: 'desafios', name: 'Todos os portes', tier: 'prata', icon: 'hexagon', desc: 'Resolva ao menos um cenário de cada porte de empresa.', goal: (st) => [st.solvedSizes, st.sizeCount] },
    { id: 'all-fixes', category: 'desafios', name: 'Correções aplicadas', tier: 'ouro', icon: 'shield-check', desc: 'Resolva os 6 cenários de correção.', goal: (st) => [st.cases, 6] },
    { id: 'streak-3', category: 'constancia', name: 'Constância', tier: 'bronze', icon: 'flame', desc: 'Estude em 3 dias seguidos.', goal: (st) => [st.streak, 3] },
    { id: 'streak-7', category: 'constancia', name: 'Semana de estudo', tier: 'prata', icon: 'flame', desc: 'Estude em 7 dias seguidos.', goal: (st) => [st.streak, 7] },
    { id: 'first-review', category: 'constancia', name: 'Primeira revisão', tier: 'bronze', icon: 'repeat', desc: 'Complete uma sessão de revisão.', goal: (st) => [st.reviews, 1] },
    { id: 'reviewer-10', category: 'constancia', name: 'Memória afiada', tier: 'prata', icon: 'repeat', desc: 'Complete 10 sessões de revisão.', goal: (st) => [st.reviews, 10] },
    { id: 'flawless-review', category: 'constancia', name: 'Revisão perfeita', tier: 'prata', icon: 'sparkles', desc: 'Termine uma revisão sem perder nenhuma vida.', goal: (st) => [st.perfectReviews, 1] },
    { id: 'quest-1', category: 'constancia', name: 'Missão cumprida', tier: 'bronze', icon: 'scroll-text', desc: 'Conclua uma missão diária.', goal: (st) => [st.quests, 1] },
    { id: 'quest-15', category: 'constancia', name: 'Rotina de estudos', tier: 'prata', icon: 'scroll-text', desc: 'Conclua 15 missões diárias.', goal: (st) => [st.quests, 15] },
    { id: 'shield-up', category: 'extras', name: 'Escudo ativado', tier: 'bronze', icon: 'shield', desc: 'Compre um escudo de sequência na loja.', goal: (st) => [st.shields, 1] },
    { id: 'acesso-antecipado', category: 'extras', name: 'Acesso Antecipado', tier: 'prata', icon: 'lock-open', desc: 'Desbloqueie o módulo de Engenharia Reversa com moedas, sem esperar pelos pré-requisitos.', goal: (st) => [st.unlocks, 1] },
    { id: 'first-reward', category: 'extras', name: 'Recompensa merecida', tier: 'bronze', icon: 'gift', desc: 'Resgate uma recompensa pessoal.', goal: (st) => [st.redeemed, 1] },
    { id: 'big-day', category: 'extras', name: 'Dia de peso', tier: 'prata', icon: 'zap', desc: 'Ganhe 200 XP em um único dia.', goal: (st) => [st.bestDayXp, 200] },
    { id: 'full-track', category: 'trilha', name: 'Trilha completa', tier: 'dragao', icon: 'crown', desc: `Conclua todas as ${TOTAL_TASKS} tarefas: módulos, laboratório e cenários.`, goal: (st) => [st.steps, TOTAL_TASKS] },
  )
  return list
}

export function medals(s: StudyState, ctx: ProgressContext): Medal[] {
  const st = computeStats(s, ctx)
  return medalDefinitions(ctx).map((d) => {
    const [value, target] = d.goal(st, s)
    const unlocked = target > 0 && value >= target
    const secret = Boolean(d.secret)
    const masked = secret && !unlocked
    return {
      id: d.id,
      name: masked ? 'Conquista secreta' : d.name,
      desc: masked ? (d.hint ?? 'Continue explorando para descobrir.') : d.desc,
      tier: d.tier,
      icon: masked ? 'circle-help' : d.icon,
      category: d.category,
      secret,
      masked,
      hint: d.hint ?? null,
      xp: TIER_XP[d.tier],
      value: masked ? 0 : Math.min(value, target),
      target: masked ? 0 : target,
      unlocked,
      date: unlocked ? (s.badges[d.id] ?? null) : null,
    }
  })
}

export interface Summary extends ReturnType<typeof baseTotals> {
  taskXp: number
  medalXp: number
  medals: number
  medalTotal: number
}

/** `xp` é o XP total: tarefas mais o bônus das medalhas conquistadas. */
export function summary(s: StudyState, ctx: ProgressContext): Summary {
  const base = baseTotals(s)
  const taskXp = base.xp + gameXp(s, ctx)
  const got = medals(s, ctx).filter((m) => m.unlocked)
  const medalXp = got.reduce((n, m) => n + m.xp, 0)
  return { ...base, taskXp, medalXp, xp: taskXp + medalXp, medals: got.length, medalTotal: medalDefinitions(ctx).length }
}

export function maxXp(ctx: ProgressContext): { tasks: number; medals: number } {
  const game = ctx.challenges.length * (CHALLENGE_XP.identify + CHALLENGE_XP.fix) + bossCount(ctx) * BOSS_XP
  return { tasks: MAX_TASK_XP + game, medals: medalDefinitions(ctx).reduce((n, d) => n + TIER_XP[d.tier], 0) }
}

/** Registra a data das medalhas recém-liberadas (altera `s`) e devolve a lista delas. */
export function recordMedals(s: StudyState, ctx: ProgressContext, day: string): Medal[] {
  const fresh: Medal[] = []
  for (const m of medals(s, ctx)) {
    if (m.unlocked && !s.badges[m.id]) {
      s.badges[m.id] = day
      fresh.push({ ...m, date: day })
    }
  }
  return fresh
}
