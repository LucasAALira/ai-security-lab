import { DEFAULT_THEME, isThemeId, QUEST_IDS, QUESTS_PER_DAY, REWARD_LIMITS, SHIELD, THEMES } from './catalog'
import {
  BOSS_QUESTIONS,
  CASE_COUNT,
  EVENT_KINDS,
  FLASHCARD_ID,
  HINTS_PER_CHALLENGE,
  ID_PATTERN,
  LEGACY_STORAGE_KEY,
  LIMITS,
  MODULE_COUNT,
  QUESTIONS_PER_MODULE,
  READS_PER_MODULE,
  STORAGE_KEY,
} from './constants'
import { isDayKey } from './dates'
import type { BossState, ChallengeState, LearningEvent, ModuleState, PersonalReward, StudyState } from './types'

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

export function emptyChallenge(): ChallengeState {
  return {
    identified: false,
    fixed: false,
    helpless: false,
    extra: false,
    attempts: 0,
    misses: 0,
    hints: 0,
    solved: '',
    run: { hints: range(HINTS_PER_CHALLENGE).map(() => false), identified: false, fixed: false },
  }
}

export function emptyBoss(): BossState {
  return { done: range(BOSS_QUESTIONS).map(() => false), mistakes: 0, wins: 0, won: '', flawless: false }
}

function cleanChallenge(raw: unknown): ChallengeState {
  const run = at(raw, 'run')
  const runIdentified = at(run, 'identified') === true
  const runFixed = runIdentified && at(run, 'fixed') === true
  const identified = at(raw, 'identified') === true || runIdentified
  const fixed = (identified && at(raw, 'fixed') === true) || runFixed
  const completed = identified && fixed
  return {
    identified,
    fixed,
    helpless: completed && at(raw, 'helpless') === true,
    extra: identified && at(raw, 'extra') === true,
    attempts: small(at(raw, 'attempts')),
    misses: small(at(raw, 'misses')),
    hints: small(at(raw, 'hints')),
    solved: completed ? day(at(raw, 'solved')) : '',
    run: {
      hints: range(HINTS_PER_CHALLENGE).map((j) => at(at(run, 'hints'), j) === true),
      identified: runIdentified,
      fixed: runFixed,
    },
  }
}

function cleanBoss(raw: unknown): BossState {
  const won = day(at(raw, 'won'))
  return {
    done: range(BOSS_QUESTIONS).map((j) => at(at(raw, 'done'), j) === true),
    mistakes: small(at(raw, 'mistakes')),
    wins: won ? Math.max(1, small(at(raw, 'wins'))) : 0,
    won,
    flawless: Boolean(won) && at(raw, 'flawless') === true,
  }
}

const EVENT_REF = /^[A-Za-z0-9:._-]{1,60}$/
const MAX_TIME = 8.64e15

function cleanEvents(raw: unknown): LearningEvent[] {
  if (!Array.isArray(raw)) return []
  const out: LearningEvent[] = []
  for (const e of raw.slice(-LIMITS.events)) {
    const time = at(e, 'at')
    const kind = at(e, 'kind')
    const ref = at(e, 'ref')
    const d = at(e, 'day')
    if (
      typeof time === 'number' &&
      Number.isInteger(time) &&
      time >= 0 &&
      time <= MAX_TIME &&
      typeof kind === 'string' &&
      (EVENT_KINDS as readonly string[]).includes(kind) &&
      typeof ref === 'string' &&
      EVENT_REF.test(ref) &&
      isDayKey(d)
    ) {
      out.push({ at: time, day: d, kind: kind as LearningEvent['kind'], ref })
    }
  }
  return out
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

  // Dias reais de estudo (sem escudos). Dados antigos não têm o campo: só se aproveita a sequência
  // antiga quando nenhum escudo foi usado, porque um escudo mascara dias sem estudo.
  const rawStudy = at(raw, 'study')
  const studyLast = day(at(rawStudy, 'last'))
  const studyCurrent = small(at(rawStudy, 'current'))
  const study: StudyState['study'] = isObject(rawStudy)
    ? { last: studyLast, current: studyCurrent, best: Math.max(small(at(rawStudy, 'best')), studyCurrent) }
    : streak.shieldUsed
      ? { last: streak.last, current: streak.last ? 1 : 0, best: streak.last ? 1 : 0 }
      : { last: streak.last, current: streak.current, best: streak.best }

  const challenges: StudyState['challenges'] = {}
  const rawChallenges = at(raw, 'challenges')
  if (isObject(rawChallenges)) {
    for (const [id, c] of Object.entries(rawChallenges).slice(0, LIMITS.challenges)) {
      if (ID_PATTERN.test(id)) challenges[id] = cleanChallenge(c)
    }
  }
  const bosses: StudyState['bosses'] = {}
  const fires: StudyState['fires'] = {}
  for (const i of range(MODULE_COUNT)) {
    bosses[i] = cleanBoss(at(at(raw, 'bosses'), i))
    const fire = day(at(at(raw, 'fires'), i))
    if (fire) fires[i] = fire
  }
  const cards: StudyState['cards'] = {}
  const rawCards = at(raw, 'cards')
  if (isObject(rawCards)) {
    for (const [id, known] of Object.entries(rawCards).slice(0, LIMITS.cards)) {
      if (FLASHCARD_ID.test(id) && typeof known === 'boolean') cards[id] = known
    }
  }
  const rawLearner = at(raw, 'learner')
  const learnerId = at(rawLearner, 'id')

  const l = at(raw, 'lifetime')
  return {
    version: 3,
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
    challenges,
    bosses,
    fires,
    cards,
    study,
    events: cleanEvents(at(raw, 'events')),
    prefs: { sound: at(at(raw, 'prefs'), 'sound') === true },
    learner: { id: typeof learnerId === 'string' && ID_PATTERN.test(learnerId) ? learnerId : '', since: day(at(rawLearner, 'since')) },
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
