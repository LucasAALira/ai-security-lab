import type { EconomyState } from './economy'
import type { ActivitySpec } from './activities'
import type { EVENT_KINDS } from './constants'

/** Estado salvo no navegador. Campos novos são opcionais no armazenamento e preenchidos por `cleanState`. */

export interface ModuleState {
  reads: boolean[]
  research: boolean
  practice: boolean
  solved: boolean[]
  notes: string
  researchNote: string
  /** Respostas erradas por questão, enquanto ela ainda não foi acertada. */
  misses: number[]
  /** Questão acertada sem nenhum erro antes. */
  firstTry: boolean[]
}

export interface Streak {
  last: string
  current: number
  best: number
  /** Último dia em que um escudo cobriu dias sem estudo ('' se nunca). */
  shieldUsed: string
}

export interface PersonalReward {
  id: string
  title: string
  price: number
  redeemed: number
}

export interface Shop {
  shields: number
  /** Temas comprados (o tema padrão "dragon" é sempre do usuário). */
  owned: string[]
  theme: string
  rewards: PersonalReward[]
  /** Módulos de acesso antecipado desbloqueados com moedas (ids). */
  unlocked: number[]
  relics: string[]
  display: string[]
  room: string
  /** A pessoa escolheu um tema (na loja ou ao comprar). Sem isso, o tema padrão acompanha o padrão do site. */
  themeChosen?: boolean
}

/** Contadores do dia local atual; zeram na virada do dia. */
export interface Daily {
  day: string
  reads: number
  answers: number
  practices: number
  cases: number
  reviews: number
  xp: number
}

export interface Quests {
  swaps?: number
  retired?: string[]
  day: string
  ids: string[]
  done: string[]
  chest: boolean
}

export interface Lifetime {
  reviews: number
  perfectReviews: number
  quests: number
  shields: number
  redeemed: number
}

/** Tipo do desafio de código: identificar falhas em geral ou falhas de autorização. */
export type ChallengeKind = 'vuln' | 'auth'

/** Tentativa em andamento de um desafio. Uma nova tentativa só começa depois de concluir a anterior. */
export interface ChallengeRun {
  /** Dicas já mostradas nesta tentativa, por posição. Qualquer dica impede a conquista "Sem Ajuda". */
  hints: boolean[]
  identified: boolean
  fixed: boolean
}

export interface ChallengeState {
  /** Já identificou as linhas vulneráveis alguma vez (vale XP uma única vez). */
  identified: boolean
  /** Já escolheu a correção certa alguma vez (vale XP uma única vez). */
  fixed: boolean
  /** Já concluiu uma tentativa sem usar nenhuma dica. */
  helpless: boolean
  /** Já encontrou a falha opcional do desafio. */
  extra: boolean
  /** Envios feitos (certos e errados) e envios errados. */
  attempts: number
  misses: number
  /** Dicas usadas ao todo, somando todas as tentativas. */
  hints: number
  /** Dia da primeira conclusão ('' se nunca concluiu). */
  solved: string
  run: ChallengeRun
}

/** Desafio final do módulo (o "chefe"): uma sequência de cenários que se vence acertando todos. */
export interface BossState {
  /** Cenários já resolvidos na tentativa atual. */
  done: boolean[]
  /** Erros na tentativa atual. */
  mistakes: number
  wins: number
  /** Dia da primeira vitória ('' se ainda não venceu). */
  won: string
  /** Já venceu uma tentativa sem nenhum erro. */
  flawless: boolean
}

/** Dias reais de estudo seguidos, sem escudos: base da conquista "Persistência".
 *  Guarda também o total de dias com atividade e o tempo medido com o site em uso. */
export interface StudyDays {
  last: string
  current: number
  best: number
  /** Dias distintos em que houve alguma atividade registrada. */
  total: number
  /** Minutos medidos ao todo, contados só com a aba visível e com interação recente. */
  minutes: number
  /** Dia a que `minutesToday` se refere (AAAA-MM-DD). */
  clockDay: string
  minutesToday: number
}

export type LearningEventKind = (typeof EVENT_KINDS)[number]

/** Registro de um evento de aprendizagem. `ref` identifica a atividade (por exemplo `m2-aula-1`). */
export interface LearningEvent {
  at: number
  day: string
  kind: LearningEventKind
  ref: string
}

export interface Learner {
  /** Identificador local do aluno ('' até a primeira ação). Não sai do navegador. */
  id: string
  since: string
}

export interface Prefs {
  /** Som opcional de conquista. Desligado por padrão. */
  sound: boolean
}

export interface StudyState {
  version: 4
  modules: Record<number, ModuleState>
  lab: boolean
  migrated: boolean
  cases: boolean[]
  /** id da medalha -> dia (AAAA-MM-DD) em que foi conquistada. */
  badges: Record<string, string>
  streak: Streak
  coins: { bonus: number; spent: number }
  shop: Shop
  daily: Daily
  quests: Quests
  lifetime: Lifetime
  bestDayXp: number
  /** Desafios de código, por id. */
  challenges: Record<string, ChallengeState>
  /** Chefes, por módulo. */
  bosses: Record<number, BossState>
  /** Módulo -> dia em que a fogueira (checkpoint de conclusão) foi acesa. */
  fires: Record<number, string>
  /** Flashcards: id -> o aluno marcou que já sabe. */
  cards: Record<string, boolean>
  study: StudyDays
  /** Últimos eventos de aprendizagem (os mais antigos saem quando passa do limite). */
  events: LearningEvent[]
  prefs: Prefs
  learner: Learner
  /** Dificuldade e ajustes do modo deus. Ausente: Soulslike, os valores originais. */
  economy?: EconomyState
  /** Campanhas: missões (e exercícios de dossiês), por id. */
  missions: Record<string, MissionState>
  /** Dossiês de casos reais lidos: id -> dia da leitura. O exercício do dossiê fica em `missions`. */
  dossiers: Record<string, string>
  /** Revisões de arquitetura, por id do projeto. */
  architect: Record<string, ArchitectState>
  /** Aulas dos submódulos marcadas como lidas: id do submódulo -> dia. */
  lessons: Record<string, string>
}

/* Campanhas, missões e atividades */

/** Qualidade de uma decisão ou de uma resposta. Só `best` e `good` creditam a atividade. */
export type Quality = 'best' | 'good' | 'partial' | 'poor'
/** Resultado de uma atividade na tentativa atual: a qualidade, ou `revealed` (solução vista sem crédito). */
export type ActivityResult = Quality | 'revealed'

/** Resposta confirmada de uma atividade: `v` guarda números (opção, ordem, seleção...) e `t` os textos livres. */
export interface Answer {
  v: number[]
  t?: string[]
}

/** Tentativa em andamento de uma missão. As chaves são ids de atividade. */
export interface MissionRun {
  answers: Record<string, Answer>
  results: Record<string, ActivityResult>
  /** Envios errados por atividade (liberam "mostrar a solução" a partir de 2). */
  misses: Record<string, number>
  /** Dicas já abertas por atividade (0 a 3). Só afetam a conquista de "sem dicas". */
  hints: Record<string, number>
}

/** Uma decisão registrada no histórico da missão (as mais recentes ficam guardadas). */
export interface DecisionEntry {
  attempt: number
  activity: string
  /** Opção escolhida (posição). */
  pick: number
  quality: Quality
  day: string
}

export interface MissionState {
  /** Dia em que a missão foi iniciada ('' se nunca). */
  started: string
  /** Etapa salva: 0 contexto, 1 evidências, 2 decisão, 3 consequências, 4 revisão. */
  stage: number
  /** Atividade atual dentro da etapa de decisão. */
  step: number
  run: MissionRun
  /** Tentativas iniciadas, contando a primeira. */
  attempts: number
  /** Atividades já creditadas (rendem XP uma única vez, mesmo em outra tentativa). */
  credited: string[]
  /** Dia em que a missão foi concluída pela primeira vez ('' se nunca). */
  done: string
  /** Já concluiu uma tentativa que cumpre os critérios da missão (contenção e preservação, por exemplo). */
  clean: boolean
  /** Já concluiu uma tentativa aprovada sem abrir nenhuma dica. */
  noHints: boolean
  history: DecisionEntry[]
}

/** Revisão de arquitetura: o que o aluno marcou e aplicou, e a ADR escrita. */
export interface ArchitectState {
  started: string
  /** Componente -> ameaças que o aluno identificou (posições). */
  found: Record<string, number[]>
  /** Componente -> controles aplicados (posições no catálogo do projeto). */
  applied: Record<string, number[]>
  /** Campos da ADR (texto livre, não corrigido automaticamente). */
  adr: string[]
  /** Autoavaliação da ADR contra a rubrica (0 ou 1 por critério). */
  self: number[]
  /** Dia em que a arquitetura passou nos critérios obrigatórios pela primeira vez. */
  evaluated: string
  /** Dia em que a autoavaliação da ADR foi registrada pela primeira vez. */
  adrDone: string
  /** Avaliações feitas. */
  runs: number
}

export type Tier = 'bronze' | 'prata' | 'ouro' | 'dragao'

/** Chave do ícone de cada medalha; a interface mapeia cada uma para um ícone do lucide-react. */
export type MedalIcon =
  | 'book-open'
  | 'library'
  | 'search'
  | 'telescope'
  | 'wrench'
  | 'hammer'
  | 'diamond'
  | 'rotate-ccw'
  | 'target'
  | 'crosshair'
  | 'circle-dot'
  | 'graduation-cap'
  | 'mountain'
  | 'flask-conical'
  | 'check-check'
  | 'hexagon'
  | 'shield-check'
  | 'flame'
  | 'crown'
  | 'repeat'
  | 'sparkles'
  | 'scroll-text'
  | 'shield'
  | 'gift'
  | 'zap'
  | 'flame-kindling'
  | 'bug'
  | 'key-round'
  | 'file-lock'
  | 'lightbulb-off'
  | 'calendar-check'
  | 'lock-open'
  | 'swords'
  | 'eye'
  | 'circle-help'
  | 'link'
  | 'map'
  | 'microscope'
  | 'search-check'
  | 'scale'
  | 'network'
  | 'smartphone'
  | 'globe'
  | 'server'
  | 'package-check'
  | 'git-branch'
  | 'radar'
  | 'blocks'

export type AchievementCategory = 'aprendizado' | 'desafios' | 'trilha' | 'campanhas' | 'arquitetura' | 'constancia' | 'extras'

export interface Medal {
  id: string
  /** Em conquistas secretas ainda bloqueadas, nome e descrição já vêm ocultos (ver `masked`). */
  name: string
  desc: string
  tier: Tier
  icon: MedalIcon
  category: AchievementCategory
  secret: boolean
  /** Secreta e ainda bloqueada: nome, descrição e progresso ficam ocultos. */
  masked: boolean
  /** Dica opcional de uma conquista secreta. */
  hint: string | null
  xp: number
  value: number
  target: number
  unlocked: boolean
  date: string | null
}

export interface LevelInfo {
  number: number
  /** Título do nível. */
  name: string
  start: number
  next: number | null
}

export interface TrackInfo {
  name: string
  modules: number[]
}

/** Gabarito e metadados de um desafio de código (sem textos): o suficiente para validar e contar. */
export interface ChallengeSpec {
  id: string
  /** Módulo clássico que libera o desafio; `null` nos desafios das áreas novas, sempre abertos. */
  module: number | null
  kind: ChallengeKind
  /** Quantidade de linhas do código. */
  lines: number
  /** Linhas (a partir de 0) que formam a falha principal; todas precisam ser marcadas. */
  vulnerable: number[]
  /** Linhas relacionadas que também são aceitas como corretas, mas não são obrigatórias. */
  also: number[]
  /** Linhas de uma falha opcional; marcá-las junto da principal revela a conquista secreta. */
  extra: number[]
  /** Quantidade de alternativas de correção e índice da correta. */
  options: number
  fix: number
  /** Áreas e plataformas do desafio (`web`, `api`, `mobile`, `android`, `ios`...), para contagens por conquista. */
  tags: string[]
}

/** Dados estáticos de que o progresso depende (derivados dos módulos, cenários e desafios). */
export interface ProgressContext {
  tracks: TrackInfo[]
  prereqs: number[][]
  /** Porte da empresa de cada cenário de correção, na ordem dos cenários. */
  sizes: string[]
  challenges: ChallengeSpec[]
  /** Alternativa correta de cada cenário do chefe, por módulo (lista vazia: módulo sem chefe). */
  bosses: number[][]
  /** Missões das campanhas e exercícios dos dossiês (gabarito, sem os textos). */
  missions: MissionSpec[]
  campaigns: CampaignSpec[]
  /** Ids dos submódulos que têm aula (marcar como lida rende XP uma vez). */
  lessons: string[]
  /** Projetos do modo Arquiteto: ameaças, controles e restrições (gabarito, sem os textos). */
  architect: ArchitectSpec[]
  /** Hierarquia Área -> Módulo -> Submódulo com o que é obrigatório em cada um. */
  curriculum: CurriculumSpec
}


export interface MissionSpec {
  id: string
  /** `dossier`: exercício de um dossiê de caso real. `review`: amostra do treino de análise de código.
   *  Os dois ficam fora da contagem de missões das campanhas e não dependem de missão anterior. */
  kind: 'mission' | 'dossier' | 'review'
  campaign: string | null
  /** Posição na campanha, a partir de 1. */
  order: number
  activities: ActivitySpec[]
  /** Marcas que a tentativa precisa ter (e não ter) para valer como "limpa". */
  clean: { require: string[]; forbid: string[] }
  tags: string[]
}

/** Projeto do modo Arquiteto, como o motor o enxerga. Posições de ameaça são relativas ao componente. */
export interface ArchitectSpec {
  id: string
  components: { id: string; threats: { real: boolean; critical: boolean }[] }[]
  controls: {
    /** Componentes em que o controle faz sentido. Aplicado em outro lugar, conta como mal posicionado. */
    places: string[]
    /** Ameaças que o controle trata, quando bem posicionado. */
    mitigates: { component: string; threat: number }[]
    /** Controle exigido em qualquer solução, independentemente do contexto. */
    mandatory: boolean
    cost: number
    complexity: number
  }[]
  /** Teto de custo e de complexidade operacional da solução. */
  budget: number
  complexity: number
  /** Critérios da rubrica de autoavaliação da ADR. */
  rubric: number
  /** Campos da ADR. */
  fields: number
}

export interface CampaignSpec {
  id: string
  /** Campanhas que precisam estar concluídas antes. */
  requires: string[]
  missions: string[]
}

export interface SubSpec {
  id: string
  module: string
  area: string
  /** Tem conteúdo publicado. Submódulo planejado não entra em nenhum cálculo de progresso. */
  available: boolean
  /** Índice do módulo clássico cujo progresso este submódulo usa (nunca interpretado como posição na hierarquia). */
  legacy: number | null
  /** A aula pode ser marcada como lida (rende XP uma vez) e conta como obrigatória. */
  lesson: boolean
  /** Desafios obrigatórios para concluir o submódulo. */
  challenges: string[]
}

export interface ModuleSpec {
  id: string
  area: string
  subs: string[]
}

export interface CurriculumSpec {
  areas: { id: string; modules: string[] }[]
  modules: ModuleSpec[]
  subs: SubSpec[]
}

export interface TrackProgress {
  name: string
  modules: number[]
  count: number
  complete: number
  steps: number
  maxSteps: number
  xp: number
  maxXp: number
  tier: Tier | null
  next: { tier: Tier; remaining: number } | null
}

export type Improvement =
  | { kind: 'retry'; module: number; question: number; misses: number; xp: number; priority: number }
  | { kind: 'finish'; module: number; left: ModuleRemaining; xp: number; priority: number }
  | { kind: 'start'; module: number; xp: number; priority: number }
  | { kind: 'lab'; xp: number; priority: number }
  | { kind: 'cases'; left: number; xp: number; priority: number }

export interface ModuleRemaining {
  reads: number
  research: boolean
  practice: boolean
  questions: number
}
