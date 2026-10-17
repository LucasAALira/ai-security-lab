import { RELICS, ROOMS, DISPLAY_LIMIT, roomOwned } from './relics'
import { DEFAULT_THEME, isEarlyAccess, isThemeId, QUEST_IDS, QUESTS_PER_DAY, REWARD_LIMITS, SHIELD, THEMES } from './catalog'
import {
  BOSS_QUESTIONS,
  CASE_COUNT,
  MISSION_STAGES,
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
import type { ActivityResult, Answer, ArchitectState, BossState, ChallengeState, DecisionEntry, LearningEvent, MissionRun, MissionState, ModuleState, PersonalReward, Quality, StudyState } from './types'

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

export function emptyRun(): MissionRun {
  return { answers: {}, results: {}, misses: {}, hints: {} }
}

export function emptyMission(): MissionState {
  return { started: '', stage: 0, step: 0, run: emptyRun(), attempts: 0, credited: [], done: '', clean: false, noHints: false, history: [] }
}

export function emptyArchitect(): ArchitectState {
  return { started: '', found: {}, applied: {}, adr: [], self: [], evaluated: '', adrDone: '', runs: 0 }
}

const QUALITIES: readonly string[] = ['best', 'good', 'partial', 'poor']
const RESULTS: readonly string[] = [...QUALITIES, 'revealed']
const clampInt = (v: unknown, min: number, max: number): number =>
  typeof v === 'number' && Number.isInteger(v) ? Math.min(max, Math.max(min, v)) : min

function cleanAnswer(raw: unknown): Answer | null {
  const v = at(raw, 'v')
  if (!Array.isArray(v) || v.length > LIMITS.answerNumbers || !v.every((n) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 999)) return null
  const t = at(raw, 't')
  const answer: Answer = { v: [...v] }
  if (Array.isArray(t)) answer.t = t.slice(0, LIMITS.answerTexts).map((x) => text(x, LIMITS.answerText))
  return answer
}

/** Mapa `id da atividade -> valor`, com ids válidos e no máximo `LIMITS.activities` entradas. */
function cleanById<T>(raw: unknown, pick: (value: unknown) => T | null): Record<string, T> {
  const out: Record<string, T> = {}
  if (!isObject(raw)) return out
  for (const [id, value] of Object.entries(raw).slice(0, LIMITS.activities)) {
    if (!ID_PATTERN.test(id)) continue
    const clean = pick(value)
    if (clean !== null) out[id] = clean
  }
  return out
}

function cleanMission(raw: unknown): MissionState {
  const done = day(at(raw, 'done'))
  const started = day(at(raw, 'started')) || done
  const run = at(raw, 'run')
  const rawCredited = at(raw, 'credited')
  const credited = Array.isArray(rawCredited)
    ? [...new Set(rawCredited.filter((id): id is string => typeof id === 'string' && ID_PATTERN.test(id)))].slice(0, LIMITS.activities)
    : []
  const history: DecisionEntry[] = []
  const rawHistory = at(raw, 'history')
  if (Array.isArray(rawHistory)) {
    for (const e of rawHistory.slice(-LIMITS.history)) {
      const activity = at(e, 'activity')
      const quality = at(e, 'quality')
      const d = at(e, 'day')
      if (typeof activity === 'string' && ID_PATTERN.test(activity) && typeof quality === 'string' && QUALITIES.includes(quality) && isDayKey(d)) {
        history.push({ attempt: Math.max(1, small(at(e, 'attempt'))), activity, pick: clampInt(at(e, 'pick'), 0, 99), quality: quality as Quality, day: d })
      }
    }
  }
  return {
    started,
    stage: started ? clampInt(at(raw, 'stage'), 0, MISSION_STAGES - 1) : 0,
    step: started ? clampInt(at(raw, 'step'), 0, LIMITS.activities - 1) : 0,
    run: {
      answers: cleanById(at(run, 'answers'), cleanAnswer),
      results: cleanById(at(run, 'results'), (r) => (typeof r === 'string' && RESULTS.includes(r) ? (r as ActivityResult) : null)),
      misses: cleanById(at(run, 'misses'), (n) => small(n)),
      hints: cleanById(at(run, 'hints'), (n) => clampInt(n, 0, 3)),
    },
    attempts: started ? Math.max(1, small(at(raw, 'attempts'))) : 0,
    credited,
    done,
    clean: Boolean(done) && at(raw, 'clean') === true,
    noHints: Boolean(done) && at(raw, 'noHints') === true,
    history,
  }
}

function cleanIndexMap(raw: unknown, size: number): Record<string, number[]> {
  const out: Record<string, number[]> = {}
  if (!isObject(raw)) return out
  for (const [id, list] of Object.entries(raw).slice(0, LIMITS.components)) {
    if (!ID_PATTERN.test(id) || !Array.isArray(list)) continue
    out[id] = [...new Set(list.filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < size))].sort((a, b) => a - b)
  }
  return out
}

function cleanArchitect(raw: unknown): ArchitectState {
  const adr = at(raw, 'adr')
  const self = at(raw, 'self')
  const evaluated = day(at(raw, 'evaluated'))
  return {
    started: day(at(raw, 'started')) || evaluated,
    found: cleanIndexMap(at(raw, 'found'), 100),
    applied: cleanIndexMap(at(raw, 'applied'), 100),
    adr: Array.isArray(adr) ? adr.slice(0, 7).map((x) => text(x, LIMITS.answerText)) : [],
    self: Array.isArray(self) ? self.slice(0, 16).map((x) => (x === 1 ? 1 : 0)) : [],
    evaluated,
    adrDone: day(at(raw, 'adrDone')),
    runs: small(at(raw, 'runs')),
  }
}

/** Mapa `id -> dia`, com ids válidos, dias reais e um limite de entradas. */
function cleanDays(raw: unknown, max: number): Record<string, string> {
  const out: Record<string, string> = {}
  if (!isObject(raw)) return out
  for (const [id, d] of Object.entries(raw).slice(0, max)) {
    if (ID_PATTERN.test(id) && isDayKey(d)) out[id] = d
  }
  return out
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
  const rawUnlocked = at(at(raw, 'shop'), 'unlocked')
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
  const rawRelics = at(at(raw, 'shop'), 'relics')
  const relics = [...RELICS.map(r => r.id as string), ...ROOMS.filter(r => r.price).map(r => 'room:' + r.id)].filter(id => Array.isArray(rawRelics) && rawRelics.includes(id))
  const rawDisplay = at(at(raw, 'shop'), 'display')
  const display = Array.isArray(rawDisplay) ? [...new Set(rawDisplay.filter((id): id is string => typeof id === 'string' && (relics.includes(id) || (id.startsWith('medal:') && id.slice(6) in badges))))].slice(0, DISPLAY_LIMIT) : []
  const room = str(at(at(raw, 'shop'), 'room'))
  const shop: StudyState['shop'] = {
    relics, display, room: ROOMS.some(r => r.id === room) && roomOwned(room, relics) ? room : 'stone',
    shields: Math.min(SHIELD.max, small(at(at(raw, 'shop'), 'shields'))),
    owned,
    theme: isThemeId(theme) && (theme === DEFAULT_THEME || owned.includes(theme)) ? theme : DEFAULT_THEME,
    rewards,
    unlocked: Array.isArray(rawUnlocked) ? [...new Set(rawUnlocked.filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && isEarlyAccess(n)))].sort((a, b) => a - b) : [],
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
    swaps: Math.min(1, small(at(q, 'swaps'))),
    retired: QUEST_IDS.filter(id => Array.isArray(at(q, 'retired')) && (at(q, 'retired') as unknown[]).includes(id)),
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
  const missions: StudyState['missions'] = {}
  const rawMissions = at(raw, 'missions')
  if (isObject(rawMissions)) {
    for (const [id, m] of Object.entries(rawMissions).slice(0, LIMITS.missions)) {
      if (!ID_PATTERN.test(id) || !isObject(m)) continue
      const clean = cleanMission(m)
      if (clean.started || clean.credited.length) missions[id] = clean
    }
  }
  const architect: StudyState['architect'] = {}
  const rawArchitect = at(raw, 'architect')
  if (isObject(rawArchitect)) {
    for (const [id, a] of Object.entries(rawArchitect).slice(0, LIMITS.architect)) {
      if (!ID_PATTERN.test(id) || !isObject(a)) continue
      const clean = cleanArchitect(a)
      if (clean.started) architect[id] = clean
    }
  }
  const rawLearner = at(raw, 'learner')
  const learnerId = at(rawLearner, 'id')

  const l = at(raw, 'lifetime')
  return {
    version: 4,
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
    missions,
    dossiers: cleanDays(at(raw, 'dossiers'), LIMITS.dossiers),
    architect,
    lessons: cleanDays(at(raw, 'lessons'), LIMITS.lessons),
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
