import { economyOf } from './economy'
import { bossCount, challengeStats, isBossWon, gameXp } from './challenges'
import { BOSS_XP, CHALLENGE_XP, MAX_TASK_XP, READS_PER_MODULE, STUDY_GOAL, TIER_XP, TOTAL_TASKS } from './constants'
import { baseTotals, coreModules, countDone, isModuleComplete } from './core'
import { learningStats, learningXp, maxLearningXp, missionPassed } from './missions'
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
  /** Missões das campanhas (sem os exercícios de dossiê) concluídas com todas as atividades creditadas. */
  missionsPassed: number
  /** Missões concluídas numa tentativa que cumpre os critérios (contenção e preservação de evidências). */
  missionsClean: number
  missionsNoHints: number
  /** Dossiês lidos cujo exercício foi creditado. */
  dossiersPassed: number
  reviewsPassed: number
  /** ADRs guiadas concluídas: decisão aceitável, texto escrito e autoavaliação registrada. */
  adrs: number
  architectEvaluated: number
  /** Desafios concluídos por marca (`web`, `api`, `mobile`...). */
  done: Record<string, number>
  /** Campanhas e revisões concluídas, por id. */
  campaignPassed: Record<string, boolean>
  missionPassed: Record<string, boolean>
  architectDone: Record<string, boolean>
}

const sum = <T,>(list: readonly T[], f: (item: T) => number) => list.reduce((n, item) => n + f(item), 0)

export function computeStats(s: StudyState, ctx: ProgressContext): ProgressStats {
  // As metas que citam totais ("24 leituras", "12 de 16 questões", "8 módulos") valem só para a trilha
  // principal; o módulo de acesso antecipado tem as próprias conquistas.
  const ms = coreModules(s)
  const all = Object.values(s.modules)
  const ch = challengeStats(s, ctx)
  const lr = learningStats(s, ctx)
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
    missionsPassed: lr.missionsPassed,
    missionsClean: lr.missionsClean,
    missionsNoHints: lr.missionsNoHints,
    dossiersPassed: lr.dossiersPassed,
    reviewsPassed: lr.reviewsPassed,
    adrs: lr.selfAssessed + lr.adrDone,
    architectEvaluated: lr.architectEvaluated,
    done: ch.byTag,
    campaignPassed: Object.fromEntries(ctx.campaigns.map((c) => [c.id, lr.byCampaign[c.id] === c.missions.length])),
    missionPassed: Object.fromEntries(ctx.missions.map((m) => [m.id, missionPassed(s, m)])),
    architectDone: Object.fromEntries(ctx.architect.map(({ id }) => [id, Boolean(s.architect[id]?.evaluated)])),
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
  /** `false` quando o conteúdo que a conquista exige ainda não existe: ela não entra no catálogo. */
  when?: boolean
}

/** "Ataques e defesa" -> "ataques-e-defesa" */
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Uma conquista de ouro por campanha concluída (todas as missões com todas as atividades creditadas). */
const CAMPAIGN_MEDALS: { id: string; campaign: string; name: string; icon: MedalIcon; desc: string }[] = [
  { id: 'elo-protegido', campaign: 'atualizacao-confiavel', name: 'Elo Protegido', icon: 'link', desc: 'Conclua a campanha A atualização confiável, sobre cadeia de suprimentos de software.' },
  { id: 'memoria-com-cracha', campaign: 'assistente-sabia-demais', name: 'Memória com Crachá', icon: 'key-round', desc: 'Conclua a campanha O assistente que sabia demais, sobre RAG, tenants e injeção indireta.' },
  { id: 'agente-sob-controle', campaign: 'agente-poder-demais', name: 'Agente sob Controle', icon: 'shield', desc: 'Conclua a campanha O agente com poder demais, sobre privilégio mínimo e aprovação humana.' },
  { id: 'lancamento-responsavel', campaign: 'lancamento-sob-pressao', name: 'Lançamento Responsável', icon: 'scale', desc: 'Conclua a campanha O lançamento sob pressão, sobre ameaças, fornecedores e risco aceito.' },
  { id: 'carrinho-seguro', campaign: 'checkout-outro-cliente', name: 'Carrinho Seguro', icon: 'globe', desc: 'Conclua a campanha O checkout de outro cliente, sobre autorização e regras de negócio.' },
  { id: 'segredo-contido', campaign: 'a-chave-no-pacote', name: 'Segredo Contido', icon: 'key-round', desc: 'Conclua a campanha A chave que saiu no pacote, sobre engenharia reversa defensiva e segredos expostos.' },
  { id: 'rastros-apagados', campaign: 'app-deixou-rastros', name: 'Rastros Apagados', icon: 'smartphone', desc: 'Conclua a campanha O aplicativo que deixou rastros, sobre segurança Mobile.' },
  { id: 'uma-conta-um-padrao', campaign: 'uma-conta-muitos-caminhos', name: 'Uma Conta, Um Padrão', icon: 'network', desc: 'Conclua a campanha Uma conta, muitos caminhos, sobre controles consistentes entre canais.' },
]

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

  // Campanhas, casos reais e revisões de arquitetura. Contam só atividades corrigidas por regras ou
  // decisões com crédito; abrir uma tela, sozinho, nunca conquista nada.
  const missionTotal = ctx.missions.filter((m) => m.kind === 'mission').length
  const dossierTotal = ctx.missions.filter((m) => m.kind === 'dossier').length
  const reviewTotal = ctx.missions.filter((m) => m.kind === 'review').length
  const hasClean = ctx.missions.some((m) => m.kind === 'mission' && (m.clean.require.length > 0 || m.clean.forbid.length > 0))
  const hasAdr = ctx.architect.length > 0 || ctx.missions.some((m) => m.activities.some((a) => a.kind === 'adr'))
  const tagged = (tag: string) => ctx.challenges.filter((c) => c.tags.includes(tag)).length
  list.push(
    { id: 'primeira-missao', category: 'campanhas', name: 'Primeira Missão', tier: 'bronze', icon: 'map', desc: 'Conclua uma missão de campanha com todas as atividades creditadas.', goal: (st) => [st.missionsPassed, 1], when: missionTotal > 0 },
    { id: 'missoes-12', category: 'campanhas', name: 'Campo de Provas', tier: 'prata', icon: 'map', desc: 'Conclua 12 missões de campanha com todas as atividades creditadas.', goal: (st) => [st.missionsPassed, 12], when: missionTotal >= 12 },
    { id: 'missoes-todas', category: 'campanhas', name: 'Todas as Campanhas', tier: 'dragao', icon: 'crown', desc: 'Conclua todas as missões das sete campanhas.', goal: (st) => [st.missionsPassed, missionTotal], when: missionTotal > 0 },
    ...CAMPAIGN_MEDALS.map(
      (c): MedalDef => ({
        id: c.id,
        category: 'campanhas',
        name: c.name,
        tier: 'ouro',
        icon: c.icon,
        desc: c.desc,
        goal: (st) => [Number(Boolean(st.campaignPassed[c.campaign])), 1],
        when: ctx.campaigns.some((x) => x.id === c.campaign),
      }),
    ),
    { id: 'contencao-precisa', category: 'campanhas', name: 'Contenção Precisa', tier: 'ouro', icon: 'shield-check', desc: 'Conclua um cenário de incidente respeitando os critérios de contenção e de preservação de evidências.', goal: (st) => [st.missionsClean, 1], when: hasClean },
    { id: 'sem-dicas-missao', category: 'campanhas', name: 'Missão Sem Dicas', tier: 'prata', icon: 'lightbulb-off', desc: 'Conclua uma missão aprovada sem abrir nenhuma dica.', goal: (st) => [st.missionsNoHints, 1], when: missionTotal > 0 },
    { id: 'decisao-fundamentada', category: 'campanhas', name: 'Decisão Fundamentada', tier: 'prata', icon: 'scale', desc: 'Complete uma decisão arquitetural guiada (ADR): decisão aceitável, justificativa escrita e autoavaliação registrada.', goal: (st) => [st.adrs, 1], when: hasAdr },
    { id: 'investigador', category: 'campanhas', name: 'Investigador', tier: 'prata', icon: 'microscope', desc: 'Leia um dossiê de caso real e conclua o exercício dele.', goal: (st) => [st.dossiersPassed, 1], when: dossierTotal > 0 },
    { id: 'arquivo-completo', category: 'campanhas', name: 'Arquivo Completo', tier: 'ouro', icon: 'microscope', desc: 'Leia todos os dossiês de casos reais e conclua o exercício de cada um.', goal: (st) => [st.dossiersPassed, dossierTotal], when: dossierTotal > 0 },
    { id: 'triagem-certeira', category: 'desafios', name: 'Triagem Certeira', tier: 'prata', icon: 'search-check', desc: 'Conclua uma amostra do treino de análise de código: veredito, sinais e o que fazer em seguida.', goal: (st) => [st.reviewsPassed, 1], when: reviewTotal > 0 },
    { id: 'mesa-de-escrutinio', category: 'desafios', name: 'Mesa de Escrutínio', tier: 'ouro', icon: 'search-check', desc: 'Conclua todas as amostras do treino de análise de código, inclusive as de falso positivo.', goal: (st) => [st.reviewsPassed, reviewTotal], when: reviewTotal > 0 },
    { id: 'autorizacao-entre-canais', category: 'campanhas', name: 'Mesma Regra em Todo Canal', tier: 'prata', icon: 'network', desc: 'Conclua a missão em que um controle existe no site e falta no aplicativo e na API, e corrija a autorização entre os canais.', goal: (st) => [Number(Boolean(st.missionPassed['controle-so-no-site'])), 1], when: ctx.missions.some((m) => m.id === 'controle-so-no-site') },
    { id: 'fronteiras-definidas', category: 'arquitetura', name: 'Fronteiras Definidas', tier: 'prata', icon: 'blocks', desc: 'Conclua uma revisão de arquitetura: ameaças identificadas e controles obrigatórios aplicados dentro das restrições.', goal: (st) => [st.architectEvaluated, 1], when: ctx.architect.length > 0 },
    { id: 'revisao-web', category: 'arquitetura', name: 'Revisão Web Concluída', tier: 'prata', icon: 'globe', desc: 'Conclua a revisão de arquitetura da loja com site, API e pagamentos.', goal: (st) => [Number(Boolean(st.architectDone['loja-web-api'])), 1], when: ctx.architect.some((a) => a.id === 'loja-web-api') },
    { id: 'revisao-mobile', category: 'arquitetura', name: 'Revisão Mobile Concluída', tier: 'prata', icon: 'smartphone', desc: 'Conclua a revisão de arquitetura do aplicativo e do backend.', goal: (st) => [Number(Boolean(st.architectDone['app-e-backend'])), 1], when: ctx.architect.some((a) => a.id === 'app-e-backend') },
    { id: 'revisao-completa', category: 'arquitetura', name: 'Arquitetura Completa', tier: 'ouro', icon: 'server', desc: 'Conclua as três revisões originais de arquitetura, incluindo a plataforma com site, aplicativo, API e assistente de IA.', goal: (st) => [['loja-web-api', 'app-e-backend', 'conta-multicanal'].filter(id => st.architectDone[id]).length, 3], when: ctx.architect.length >= 3 },
    { id: 'defensor-web', category: 'desafios', name: 'Defensor Web', tier: 'prata', icon: 'globe', desc: 'Conclua 10 desafios de segurança Web: identifique a falha e escolha a correção.', goal: (st) => [st.done.web ?? 0, 10], when: tagged('web') >= 10 },
    { id: 'defensor-de-apis', category: 'desafios', name: 'Defensor de APIs', tier: 'prata', icon: 'server', desc: 'Conclua 10 desafios de segurança de APIs: identifique a falha e escolha a correção.', goal: (st) => [st.done.api ?? 0, 10], when: tagged('api') >= 10 },
    { id: 'defensor-mobile', category: 'desafios', name: 'Defensor Mobile', tier: 'prata', icon: 'smartphone', desc: 'Conclua 10 desafios Mobile, em Android e iOS: identifique a falha e escolha a correção.', goal: (st) => [st.done.mobile ?? 0, 10], when: tagged('mobile') >= 10 },
    { id: 'cadeia-de-suprimentos', category: 'desafios', name: 'Cadeia sob Controle', tier: 'prata', icon: 'package-check', desc: 'Conclua 5 desafios sobre dependências e pipelines.', goal: (st) => [st.done.supply ?? 0, 5], when: tagged('supply') >= 5 },
  )
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
  return list.filter((d) => d.when !== false)
}

export function medals(s: StudyState, ctx: ProgressContext): Medal[] {
  const st = computeStats(s, ctx)
  const tierXp = economyOf(s).tierXp
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
      xp: tierXp[d.tier],
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
  const taskXp = base.xp + gameXp(s, ctx) + learningXp(s, ctx)
  const got = medals(s, ctx).filter((m) => m.unlocked)
  const medalXp = got.reduce((n, m) => n + m.xp, 0)
  return { ...base, taskXp, medalXp, xp: taskXp + medalXp, medals: got.length, medalTotal: medalDefinitions(ctx).length }
}

export function maxXp(ctx: ProgressContext, s?: Pick<StudyState, 'economy'>): { tasks: number; medals: number } {
  const tierXp = s ? economyOf(s).tierXp : TIER_XP
  const game = ctx.challenges.length * (CHALLENGE_XP.identify + CHALLENGE_XP.fix) + bossCount(ctx) * BOSS_XP
  return { tasks: MAX_TASK_XP + game + maxLearningXp(ctx), medals: medalDefinitions(ctx).reduce((n, d) => n + tierXp[d.tier], 0) }
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
