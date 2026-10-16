import type { Tier } from './types'

export const STORAGE_KEY = 'ai-security-study-v2'
export const LEGACY_STORAGE_KEY = 'ai-security-study-v1'

export const MODULE_COUNT = 8
export const CASE_COUNT = 6
export const READS_PER_MODULE = 3
export const QUESTIONS_PER_MODULE = 2
/** 3 leituras + pesquisa + prática + 2 questões. */
export const TASKS_PER_MODULE = 7
/** Módulos + laboratório + cenários de correção. */
export const TOTAL_TASKS = MODULE_COUNT * TASKS_PER_MODULE + 1 + CASE_COUNT

export const XP = { read: 10, research: 20, practice: 20, question: 15, lab: 30, fix: 40 } as const
/** 3 × 10 + 20 + 20 + 2 × 15 */
export const MODULE_XP = 100
export const MAX_TASK_XP = MODULE_COUNT * MODULE_XP + XP.lab + CASE_COUNT * XP.fix

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
] as const

/** Limites de saneamento do que vem do armazenamento. */
export const LIMITS = {
  small: 9999,
  misses: 99,
  big: 999_999,
  badges: 64,
  noteLength: 20_000,
} as const

export const ID_PATTERN = /^[a-z0-9-]{1,40}$/
