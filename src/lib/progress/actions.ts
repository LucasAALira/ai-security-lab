import { isThemeId, DEFAULT_THEME, REVIEW, REWARD_LIMITS, SHIELD, THEMES } from './catalog'
import { CASE_COUNT, LIMITS, MODULE_COUNT, QUESTIONS_PER_MODULE, READS_PER_MODULE } from './constants'
import { coinBalance } from './coins'
import { isModuleComplete, levelFor, trackProgress } from './core'
import { dayKey } from './dates'
import { recordMedals, summary } from './medals'
import { rollDay, settleQuests, type ChestEvent, type QuestEvent } from './quests'
import { canReview } from './review'
import { touchStreak } from './streak'
import type { LevelInfo, Medal, ProgressContext, StudyState, Tier } from './types'

export type Action =
  | { type: 'read'; module: number; index: number }
  | { type: 'research'; module: number }
  | { type: 'practice'; module: number }
  /** Acerto de uma questão (a primeira vez que ela é acertada). */
  | { type: 'answer'; module: number; index: number }
  /** Resposta errada, enquanto a questão ainda não foi acertada. */
  | { type: 'miss'; module: number; index: number }
  | { type: 'solveCase'; index: number }
  | { type: 'completeLab' }
  | { type: 'note'; module: number; field: 'notes' | 'researchNote'; value: string }
  /** Sessão de revisão concluída: `total` questões, `lost` vidas perdidas pelo caminho. */
  | { type: 'review'; total: number; lost: number }
  | { type: 'buyShield' }
  | { type: 'buyTheme'; theme: string }
  | { type: 'setTheme'; theme: string }
  | { type: 'addReward'; title: string; price: number }
  | { type: 'removeReward'; id: string }
  | { type: 'redeemReward'; id: string }

export type ProgressEvent =
  | { kind: 'xp'; amount: number }
  | { kind: 'medal'; medal: Medal }
  | { kind: 'level'; level: LevelInfo }
  | { kind: 'module'; module: number }
  | { kind: 'track'; name: string; tier: Tier }
  | { kind: 'streak'; current: number }
  | { kind: 'shield-used'; count: number }
  | { kind: 'coins'; amount: number }
  | { kind: 'purchase'; item: 'shield' | 'theme'; name: string }
  | { kind: 'redeem'; title: string; price: number }
  | QuestEvent
  | ChestEvent

/** Por que uma ação foi recusada (quando não foi só repetida). */
export type RejectReason = 'invalid' | 'coins' | 'limit' | 'owned' | 'locked' | 'missing'

export interface ApplyResult {
  /** O mesmo objeto recebido quando nada mudou, para a interface não renderizar de novo. */
  state: StudyState
  events: ProgressEvent[]
  changed: boolean
  rejected?: RejectReason
}

interface Outcome {
  changed: boolean
  /** A ação conta como dia de estudo (sequência). */
  study?: boolean
  rejected?: RejectReason
  events?: ProgressEvent[]
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const inRange = (n: unknown, size: number): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < size
const nothing: Outcome = { changed: false }
const reject = (rejected: RejectReason): Outcome => ({ changed: false, rejected })
const bump = (n: number) => Math.min(LIMITS.small, n + 1)

/** Gasta moedas do saldo, se houver. */
function spend(s: StudyState, ctx: ProgressContext, price: number): boolean {
  if (coinBalance(s, ctx) < price) return false
  s.coins.spent = Math.min(LIMITS.big, s.coins.spent + price)
  return true
}

function newRewardId(s: StudyState, now: Date): string {
  const base = `r${now.getTime().toString(36)}`
  let id = base
  for (let n = 1; s.shop.rewards.some((r) => r.id === id); n++) id = `${base}-${n}`
  return id
}

/** Aplica a ação ao rascunho `s`. */
function mutate(s: StudyState, action: Action, ctx: ProgressContext, now: Date): Outcome {
  switch (action.type) {
    case 'completeLab':
      if (s.lab) return nothing
      s.lab = true
      return { changed: true, study: true }

    case 'solveCase':
      if (!inRange(action.index, CASE_COUNT) || s.cases[action.index]) return nothing
      s.cases[action.index] = true
      s.daily.cases = bump(s.daily.cases)
      return { changed: true, study: true }

    case 'review': {
      const { total, lost } = action
      if (!Number.isInteger(total) || total < 1 || total > REVIEW.size) return reject('invalid')
      if (!Number.isInteger(lost) || lost < 0 || lost >= REVIEW.hearts || !canReview(s)) return reject('invalid')
      s.daily.reviews = bump(s.daily.reviews)
      s.lifetime.reviews = bump(s.lifetime.reviews)
      if (lost === 0) s.lifetime.perfectReviews = bump(s.lifetime.perfectReviews)
      const events: ProgressEvent[] = []
      if (s.daily.reviews <= REVIEW.coinSessionsPerDay) {
        const amount = REVIEW.coinsPerSession + (lost === 0 ? REVIEW.perfectBonus : 0)
        s.coins.bonus = Math.min(LIMITS.big, s.coins.bonus + amount)
        events.push({ kind: 'coins', amount })
      }
      return { changed: true, study: true, events }
    }

    case 'buyShield': {
      if (s.shop.shields >= SHIELD.max) return reject('limit')
      if (!spend(s, ctx, SHIELD.price)) return reject('coins')
      s.shop.shields += 1
      s.lifetime.shields = bump(s.lifetime.shields)
      return { changed: true, events: [{ kind: 'purchase', item: 'shield', name: 'Escudo de sequência' }] }
    }

    case 'buyTheme': {
      const theme = THEMES.find((t) => t.id === action.theme && t.price > 0)
      if (!theme) return reject('invalid')
      if (s.shop.owned.includes(theme.id)) return reject('owned')
      if (!spend(s, ctx, theme.price)) return reject('coins')
      s.shop.owned.push(theme.id)
      s.shop.theme = theme.id
      return { changed: true, events: [{ kind: 'purchase', item: 'theme', name: `Tema ${theme.name}` }] }
    }

    case 'setTheme':
      if (!isThemeId(action.theme)) return reject('invalid')
      if (action.theme !== DEFAULT_THEME && !s.shop.owned.includes(action.theme)) return reject('locked')
      if (s.shop.theme === action.theme) return nothing
      s.shop.theme = action.theme
      return { changed: true }

    case 'addReward': {
      const title = String(action.title).trim().slice(0, REWARD_LIMITS.title)
      const price = action.price
      if (!title || !Number.isInteger(price) || price < 1 || price > REWARD_LIMITS.price) return reject('invalid')
      if (s.shop.rewards.length >= REWARD_LIMITS.max) return reject('limit')
      s.shop.rewards.push({ id: newRewardId(s, now), title, price, redeemed: 0 })
      return { changed: true }
    }

    case 'removeReward': {
      const before = s.shop.rewards.length
      s.shop.rewards = s.shop.rewards.filter((r) => r.id !== action.id)
      return s.shop.rewards.length === before ? reject('missing') : { changed: true }
    }

    case 'redeemReward': {
      const reward = s.shop.rewards.find((r) => r.id === action.id)
      if (!reward) return reject('missing')
      if (!spend(s, ctx, reward.price)) return reject('coins')
      reward.redeemed = bump(reward.redeemed)
      s.lifetime.redeemed = bump(s.lifetime.redeemed)
      return { changed: true, events: [{ kind: 'redeem', title: reward.title, price: reward.price }] }
    }
  }

  // As demais ações são sobre um módulo.
  if (!inRange(action.module, MODULE_COUNT)) return nothing
  const m = s.modules[action.module]
  switch (action.type) {
    case 'read':
      if (!inRange(action.index, READS_PER_MODULE) || m.reads[action.index]) return nothing
      m.reads[action.index] = true
      s.daily.reads = bump(s.daily.reads)
      return { changed: true, study: true }
    case 'research':
      if (m.research) return nothing
      m.research = true
      return { changed: true, study: true }
    case 'practice':
      if (m.practice) return nothing
      m.practice = true
      s.daily.practices = bump(s.daily.practices)
      return { changed: true, study: true }
    case 'answer':
      if (!inRange(action.index, QUESTIONS_PER_MODULE) || m.solved[action.index]) return nothing
      m.firstTry[action.index] = m.misses[action.index] === 0
      m.solved[action.index] = true
      s.daily.answers = bump(s.daily.answers)
      return { changed: true, study: true }
    case 'miss':
      if (!inRange(action.index, QUESTIONS_PER_MODULE) || m.solved[action.index]) return nothing
      m.misses[action.index] = Math.min(LIMITS.misses, m.misses[action.index] + 1)
      return { changed: true, study: true }
    case 'note': {
      const value = String(action.value).slice(0, LIMITS.noteLength)
      if (m[action.field] === value) return nothing
      m[action.field] = value
      return { changed: true }
    }
  }
}

const TIER_RANK: Record<Tier, number> = { bronze: 1, prata: 2, ouro: 3, dragao: 4 }

/** Único ponto de mudança do progresso. Devolve um novo estado (nunca altera o recebido),
 *  junto dos eventos para a interface: XP ganho, medalhas, nível, missões, compras etc. */
export function applyAction(state: StudyState, action: Action, ctx: ProgressContext, now: Date = new Date()): ApplyResult {
  const draft = clone(state)
  rollDay(draft, ctx, now)
  const before = summary(draft, ctx)
  const tracksBefore = trackProgress(draft, ctx)
  const completeBefore = Object.values(draft.modules).map(isModuleComplete)

  const out = mutate(draft, action, ctx, now)
  if (!out.changed) return { state, events: [], changed: false, rejected: out.rejected }

  const head: ProgressEvent[] = []
  if (out.study) {
    const touch = touchStreak(draft, now)
    if (touch.shieldsUsed) head.push({ kind: 'shield-used', count: touch.shieldsUsed })
    if (touch.extended) head.push({ kind: 'streak', current: draft.streak.current })
  }
  head.push(...(out.events ?? []))

  // Medalhas dão XP, XP cumpre missões, missões liberam medalhas: repete até estabilizar.
  const today = dayKey(now)
  const tail: ProgressEvent[] = []
  let seen = before.xp
  for (let guard = 0; guard < 6; guard++) {
    const fresh = recordMedals(draft, ctx, today)
    for (const medal of fresh) tail.push({ kind: 'medal', medal })
    const xp = summary(draft, ctx).xp
    draft.daily.xp = Math.min(LIMITS.small, draft.daily.xp + (xp - seen))
    draft.bestDayXp = Math.max(draft.bestDayXp, draft.daily.xp)
    seen = xp
    const quests = settleQuests(draft)
    tail.push(...quests)
    if (!fresh.length && !quests.length) break
  }

  const events: ProgressEvent[] = [...head]
  if (seen > before.xp) events.push({ kind: 'xp', amount: seen - before.xp })
  Object.values(draft.modules).forEach((m, i) => {
    if (!completeBefore[i] && isModuleComplete(m)) events.push({ kind: 'module', module: i })
  })
  trackProgress(draft, ctx).forEach((t, i) => {
    const was = tracksBefore[i].tier
    if (t.tier && (!was || TIER_RANK[t.tier] > TIER_RANK[was])) events.push({ kind: 'track', name: t.name, tier: t.tier })
  })
  events.push(...tail)
  const level = levelFor(seen)
  if (level.number > levelFor(before.xp).number) events.push({ kind: 'level', level })

  return { state: draft, events, changed: true }
}
