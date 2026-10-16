import { DEFAULT_THEME, isThemeId, QUEST_IDS, QUESTS_PER_DAY, REWARD_LIMITS, SHIELD, THEMES } from './catalog'
import {
  CASE_COUNT,
  ID_PATTERN,
  LEGACY_STORAGE_KEY,
  LIMITS,
  MODULE_COUNT,
  QUESTIONS_PER_MODULE,
  READS_PER_MODULE,
  STORAGE_KEY,
} from './constants'
import { isDayKey } from './dates'
import type { ModuleState, PersonalReward, StudyState } from './types'

type Loose = Record<string | number, unknown>

const isObject = (v: unknown): v is Loose => typeof v === 'object' && v !== null
const at = (v: unknown, k: string | number): unknown => (isObject(v) ? v[k] : undefined)
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/** Inteiro positivo limitado, ou 0. */
const natural = (v: unknown, max: number): number =>
  typeof v === 'number' && Number.isInteger(v) && v > 0 ? Math.min(v, max) : 0
const small = (v: unknown) => natural(v, LIMITS.small)
const big = (v: unknown) => natural(v, LIMITS.big)
const day = (v: unknown): string => (isDayKey(v) ? v : '')
const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const text = (v: unknown, max: number): string => str(v).slice(0, max)

export function emptyModule(): ModuleState {
  return {
    reads: range(READS_PER_MODULE).map(() => false),
    research: false,
    practice: false,
    solved: range(QUESTIONS_PER_MODULE).map(() => false),
    notes: '',
    researchNote: '',
    misses: range(QUESTIONS_PER_MODULE).map(() => 0),
    firstTry: range(QUESTIONS_PER_MODULE).map(() => false),
  }
}

/** Saneia qualquer valor vindo do armazenamento: só o que tem forma e limite válidos é mantido. */
export function cleanState(raw: unknown): StudyState {
  const modules: StudyState['modules'] = {}
  for (const i of range(MODULE_COUNT)) {
    const m = at(at(raw, 'modules'), i)
    const solved = range(QUESTIONS_PER_MODULE).map((j) => at(at(m, 'solved'), j) === true)
    modules[i] = {
      reads: range(READS_PER_MODULE).map((j) => at(at(m, 'reads'), j) === true),
      research: at(m, 'research') === true,
      practice: at(m, 'practice') === true,
      solved,
      notes: str(at(m, 'notes')),
      researchNote: str(at(m, 'researchNote')),
      misses: range(QUESTIONS_PER_MODULE).map((j) => Math.min(LIMITS.misses, small(at(at(m, 'misses'), j)))),
      firstTry: range(QUESTIONS_PER_MODULE).map((j) => solved[j] && at(at(m, 'firstTry'), j) === true),
    }
  }

  const badges: StudyState['badges'] = {}
  const rawBadges = at(raw, 'badges')
  if (isObject(rawBadges)) {
    for (const [id, d] of Object.entries(rawBadges).slice(0, LIMITS.badges)) {
      if (ID_PATTERN.test(id) && isDayKey(d)) badges[id] = d
    }
  }

  const k = at(raw, 'streak')
  const current = small(at(k, 'current'))
  const streak: StudyState['streak'] = {
    last: day(at(k, 'last')),
    current,
    best: Math.max(small(at(k, 'best')), current),
    shieldUsed: day(at(k, 'shieldUsed')),
  }

  // Loja: o tema ativo só vale se for o padrão ou tiver sido comprado.
  const paid = THEMES.filter((t) => t.price > 0).map((t) => t.id as string)
  const rawOwned = at(at(raw, 'shop'), 'owned')
  const owned = Array.isArray(rawOwned) ? paid.filter((id) => rawOwned.includes(id)) : []
  const theme = at(at(raw, 'shop'), 'theme')
  const rewards: PersonalReward[] = []
  const rawRewards = at(at(raw, 'shop'), 'rewards')
  if (Array.isArray(rawRewards)) {
    for (const r of rawRewards.slice(0, REWARD_LIMITS.max)) {
      const id = at(r, 'id')
      const title = text(at(r, 'title'), REWARD_LIMITS.title).trim()
      const price = natural(at(r, 'price'), REWARD_LIMITS.price)
      if (typeof id === 'string' && ID_PATTERN.test(id) && title && price > 0 && !rewards.some((x) => x.id === id)) {
        rewards.push({ id, title, price, redeemed: small(at(r, 'redeemed')) })
      }
    }
  }
  const shop: StudyState['shop'] = {
    shields: Math.min(SHIELD.max, small(at(at(raw, 'shop'), 'shields'))),
    owned,
    theme: isThemeId(theme) && (theme === DEFAULT_THEME || owned.includes(theme)) ? theme : DEFAULT_THEME,
    rewards,
  }

  const d = at(raw, 'daily')
  const q = at(raw, 'quests')
  const questDay = day(at(q, 'day'))
  const rawIds = at(q, 'ids')
  const ids =
    questDay && Array.isArray(rawIds)
      ? [...new Set(rawIds.filter((id): id is string => typeof id === 'string' && QUEST_IDS.includes(id)))].slice(0, QUESTS_PER_DAY)
      : []
  const rawDone = at(q, 'done')
  const done = ids.filter((id) => Array.isArray(rawDone) && rawDone.includes(id))
  const quests: StudyState['quests'] = {
    day: questDay,
    ids,
    done,
    chest: at(q, 'chest') === true && ids.length > 0 && done.length === ids.length,
  }

  const l = at(raw, 'lifetime')
  return {
    version: 2,
    modules,
    lab: at(raw, 'lab') === true,
    migrated: at(raw, 'migrated') === true,
    cases: range(CASE_COUNT).map((i) => at(at(raw, 'cases'), i) === true),
    badges,
    streak,
    coins: { bonus: big(at(at(raw, 'coins'), 'bonus')), spent: big(at(at(raw, 'coins'), 'spent')) },
    shop,
    daily: {
      day: day(at(d, 'day')),
      reads: small(at(d, 'reads')),
      answers: small(at(d, 'answers')),
      practices: small(at(d, 'practices')),
      cases: small(at(d, 'cases')),
      reviews: small(at(d, 'reviews')),
      xp: small(at(d, 'xp')),
    },
    quests,
    lifetime: {
      reviews: small(at(l, 'reviews')),
      perfectReviews: small(at(l, 'perfectReviews')),
      quests: small(at(l, 'quests')),
      shields: small(at(l, 'shields')),
      redeemed: small(at(l, 'redeemed')),
    },
    bestDayXp: big(at(raw, 'bestDayXp')),
  }
}

export function emptyState(): StudyState {
  return cleanState({})
}

type ReadableStorage = Pick<Storage, 'getItem'>
type WritableStorage = Pick<Storage, 'setItem'>

/** Lê o progresso salvo; migra o formato v1 (módulos concluídos viram as três leituras). */
export function loadState(storage: ReadableStorage): StudyState {
  try {
    const current = storage.getItem(STORAGE_KEY)
    if (current) return cleanState(JSON.parse(current))
  } catch {
    // armazenamento indisponível ou JSON inválido: cai para o estado inicial ou para a migração
  }
  const state = emptyState()
  try {
    const legacy: unknown = JSON.parse(storage.getItem(LEGACY_STORAGE_KEY) || '{}')
    for (const i of range(MODULE_COUNT)) {
      const old = at(legacy, i)
      if (at(old, 'done')) {
        state.modules[i].reads = range(READS_PER_MODULE).map(() => true)
        state.migrated = true
      }
      if (typeof at(old, 'notes') === 'string') state.modules[i].notes = at(old, 'notes') as string
    }
  } catch {
    // sem dados antigos aproveitáveis
  }
  return state
}

/** Grava o progresso; devolve false se o navegador recusar (modo privado, cota cheia). */
export function saveState(storage: WritableStorage, state: StudyState): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
