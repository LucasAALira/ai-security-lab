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

export interface StudyState {
  version: 2
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

export interface Medal {
  id: string
  name: string
  desc: string
  tier: Tier
  icon: MedalIcon
  xp: number
  value: number
  target: number
  unlocked: boolean
  date: string | null
}

export interface LevelInfo {
  number: number
  name: string
  start: number
  next: number | null
}

export interface TrackInfo {
  name: string
  modules: number[]
}

/** Dados estáticos de que o progresso depende (derivados dos módulos e cenários). */
export interface ProgressContext {
  tracks: TrackInfo[]
  prereqs: number[][]
  /** Porte da empresa de cada cenário de correção, na ordem dos cenários. */
  sizes: string[]
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
