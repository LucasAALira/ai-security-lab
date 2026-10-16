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

/** Dias reais de estudo seguidos, sem escudos: base da conquista "Persistência". */
export interface StudyDays {
  last: string
  current: number
  best: number
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
  version: 3
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

export type AchievementCategory = 'aprendizado' | 'desafios' | 'trilha' | 'constancia' | 'extras'

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
  module: number
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
