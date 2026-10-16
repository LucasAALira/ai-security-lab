import type { Tier } from './types'

/** A chave continua a mesma da versão 2: o formato novo é lido e migrado por `cleanState`. */
export const STORAGE_KEY = 'ai-security-study-v2'
export const LEGACY_STORAGE_KEY = 'ai-security-study-v1'

/** Módulos da trilha principal. As conquistas de "tudo concluído" (e as tarefas totais) contam só estes. */
export const CORE_MODULE_COUNT = 8
/** Todos os módulos, incluindo os de acesso antecipado (que vêm depois dos da trilha principal). */
export const MODULE_COUNT = 9
export const CASE_COUNT = 6
export const READS_PER_MODULE = 3
export const QUESTIONS_PER_MODULE = 2
/** 3 leituras + pesquisa + prática + 2 questões. */
export const TASKS_PER_MODULE = 7
/** Módulos da trilha principal + laboratório + cenários de correção. */
export const TOTAL_TASKS = CORE_MODULE_COUNT * TASKS_PER_MODULE + 1 + CASE_COUNT

export const XP = { read: 10, research: 20, practice: 20, question: 15, lab: 30, fix: 40 } as const
/** 3 × 10 + 20 + 20 + 2 × 15 */
export const MODULE_XP = 100
export const MAX_TASK_XP = MODULE_COUNT * MODULE_XP + XP.lab + CASE_COUNT * XP.fix

/** Desafios de código: cada fase vale XP uma única vez por desafio, por mais que seja repetida. */
export const CHALLENGE_XP = { identify: 15, fix: 15 } as const
/** Primeira vitória sobre o chefe de um módulo. Repetir o chefe não rende XP. */
export const BOSS_XP = 60
/** Dicas por desafio: duas para identificar a falha e uma para escolher a correção. */
export const HINTS_PER_CHALLENGE = 3
/** Posições das dicas que pertencem a cada fase. */
export const HINT_PHASES = { identify: [0, 1], fix: [2] } as const
/** Cenários de cada chefe e limite de alternativas aceitas. */
export const BOSS_QUESTIONS = 3
export const OPTION_LIMIT = 8
/** Dias reais seguidos de estudo para a conquista "Persistência". */
export const STUDY_GOAL = 7
export const FLASHCARD_ID = /^m[0-9]-c[0-9]{1,2}$/

/** Eventos de aprendizagem registrados no histórico. */
export const EVENT_KINDS = [
  'read',
  'research',
  'practice',
  'answer',
  'miss',
  'identify',
  'fix',
  'challenge',
  'challenge-miss',
  'hint',
  'retry',
  'boss',
  'boss-miss',
  'fogueira',
  'achievement',
  'card',
  'review',
  'case',
  'lab',
  'unlock',
] as const

/** XP de bônus de cada medalha, por nível. */
export const TIER_XP: Record<Tier, number> = { bronze: 10, prata: 20, ouro: 40, dragao: 100 }

/** Faixas de uma medalha de módulo ou trilha, em fração das tarefas concluídas. */
export const TIER_THRESHOLDS = { bronze: 0.4, prata: 0.7, ouro: 1 } as const

export const LEVELS = [
  { at: 0, name: 'Iniciante' },
  { at: 100, name: 'Explorador' },
  { at: 300, name: 'Praticante' },
  { at: 500, name: 'Analista' },
  { at: 800, name: 'Trilha avançada' },
  { at: 1000, name: 'Defensor de IA' },
  { at: 1250, name: 'Guardião de IA' },
  { at: 1500, name: 'Mestre Dragão' },
  { at: 1900, name: 'Sentinela da Brasa' },
  { at: 2400, name: 'Lenda do AppSec' },
] as const

/** Limites de saneamento do que vem do armazenamento. */
export const LIMITS = {
  small: 9999,
  misses: 99,
  big: 999_999,
  badges: 128,
  noteLength: 20_000,
  challenges: 64,
  cards: 200,
  events: 300,
} as const

export const ID_PATTERN = /^[a-z0-9-]{1,40}$/
