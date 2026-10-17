import { RELICS, ROOMS, DISPLAY_LIMIT, SWAP_PRICE, roomOwned } from './relics'
import { questReplacement } from './quests'
import { medals } from './medals'
import { isThemeId, DEFAULT_THEME, moduleUnlockPrice, REVIEW, REWARD_LIMITS, SHIELD, THEMES } from './catalog'
import { findChallenge, gradeBoss, gradeFix, gradeLines, hintsUsed, isRunDone } from './challenges'
import {
  BOSS_QUESTIONS,
  CASE_COUNT,
  FLASHCARD_ID,
  HINTS_PER_CHALLENGE,
  LIMITS,
  MODULE_COUNT,
  QUESTIONS_PER_MODULE,
  READS_PER_MODULE,
} from './constants'
import { coinBalance } from './coins'
import { isModuleComplete, levelFor, trackProgress } from './core'
import { dayKey } from './dates'
import { logEvent } from './events'
import { recordMedals, summary } from './medals'
import { rollDay, settleQuests, type ChestEvent, type QuestEvent } from './quests'
import { canReview } from './review'
import { touchStreak, touchStudy } from './streak'
import { emptyBoss, emptyChallenge } from './state'
import { isChallengeOpen, isModuleUnlocked } from './trail'
import { mutateMission, type MissionAction } from './mission-actions'
import { mutateArchitect, type ArchitectAction } from './architect'
import { nothing, reject, type Outcome } from './outcome'
import type { LevelInfo, Medal, ProgressContext, Quality, StudyState, Tier } from './types'

export type Action =
  | { type: 'buyRelic'; id: string }
  | { type: 'buyRoom'; id: string }
  | { type: 'setRoom'; id: string }
  | { type: 'toggleDisplay'; id: string }
  | { type: 'swapQuest'; id: string; day: string }

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
  /** Desbloqueio imediato de um módulo de acesso antecipado, pago com moedas. */
  | { type: 'unlockModule'; module: number }
  | { type: 'setTheme'; theme: string }
  | { type: 'addReward'; title: string; price: number }
  | { type: 'removeReward'; id: string }
  | { type: 'redeemReward'; id: string }
  /** Mostra uma dica do desafio (posição 0 a 2). Qualquer dica impede o "Sem Ajuda" desta tentativa. */
  | { type: 'hint'; challenge: string; index: number }
  /** Envia as linhas marcadas como vulneráveis (posições a partir de 0). */
  | { type: 'identify'; challenge: string; lines: number[] }
  /** Escolhe a correção (só depois de identificar a falha na tentativa). */
  | { type: 'fix'; challenge: string; option: number }
  /** Começa outra tentativa de um desafio já concluído. Não rende XP de novo. */
  | { type: 'retry'; challenge: string }
  /** Resposta a um cenário do chefe do módulo (exige a fogueira acesa). */
  | { type: 'bossAnswer'; module: number; index: number; option: number }
  | { type: 'bossRetry'; module: number }
  /** Marca um flashcard como sabido ou para revisar. Não rende XP. */
  | { type: 'card'; id: string; known: boolean }
  | { type: 'setSound'; on: boolean }
  | MissionAction
  | ArchitectAction

export type ProgressEvent =
  | { kind: 'xp'; amount: number }
  | { kind: 'medal'; medal: Medal }
  | { kind: 'level'; level: LevelInfo }
  | { kind: 'module'; module: number }
  | { kind: 'track'; name: string; tier: Tier }
  | { kind: 'streak'; current: number }
  | { kind: 'shield-used'; count: number }
  | { kind: 'coins'; amount: number }
  | { kind: 'purchase'; item: 'shield' | 'theme' | 'module' | 'relic' | 'room' | 'swap'; name: string }
  | { kind: 'redeem'; title: string; price: number }
  | { kind: 'hint'; challenge: string }
  /** `identify`: falha identificada; `done`: tentativa concluída. `first`: foi a primeira vez (rende XP). */
  | { kind: 'challenge'; challenge: string; phase: 'identify' | 'done'; first: boolean; helpless: boolean }
  | { kind: 'challenge-miss'; challenge: string; phase: 'identify' | 'fix' }
  | { kind: 'boss'; module: number; flawless: boolean; first: boolean }
  | { kind: 'boss-miss'; module: number }
  /** Um módulo foi liberado porque os pré-requisitos ganharam fogueira. */
  | { kind: 'unlock'; module: number }
  /** Atividade de missão: `first` quando creditou (e rendeu XP) pela primeira vez. */
  | { kind: 'activity'; mission: string; activity: string; quality: Quality; first: boolean }
  | { kind: 'activity-miss'; mission: string; activity: string }
  | { kind: 'mission'; mission: string; passed: boolean }
  | { kind: 'lesson'; sub: string }
  | { kind: 'dossier'; dossier: string }
  /** Revisão de arquitetura avaliada: `first` quando aprovou pela primeira vez (rende XP). */
  | { kind: 'architect'; project: string; passed: boolean; first: boolean }
  | { kind: 'architect-adr'; project: string; first: boolean }
  | QuestEvent
  | ChestEvent

/** Por que uma ação foi recusada (quando não foi só repetida). */
export type RejectReason = 'invalid' | 'coins' | 'limit' | 'owned' | 'locked' | 'missing' | 'prereq' | 'fogueira' | 'order' | 'open' | 'missionLocked'

export interface ApplyResult {
  /** O mesmo objeto recebido quando nada mudou, para a interface não renderizar de novo. */
  state: StudyState
  events: ProgressEvent[]
  changed: boolean
  rejected?: RejectReason
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const inRange = (n: unknown, size: number): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < size
const bump = (n: number) => Math.min(LIMITS.small, n + 1)
const challengeOf = (s: StudyState, id: string) => (s.challenges[id] ??= emptyChallenge())
const bossOf = (s: StudyState, module: number) => (s.bosses[module] ??= emptyBoss())

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
      return { changed: true, study: true, log: [['lab', 'laboratorio']] }

    case 'solveCase':
      if (!inRange(action.index, CASE_COUNT) || s.cases[action.index]) return nothing
      s.cases[action.index] = true
      s.daily.cases = bump(s.daily.cases)
      return { changed: true, study: true, log: [['case', `cenario-${action.index + 1}`]] }

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
      return { changed: true, study: true, events, log: [['review', `revisao-${total}`]] }
    }

    case 'buyRelic': {
      const item = RELICS.find(r => r.id === action.id)
      if (!item) return reject('invalid')
      if (s.shop.relics.includes(item.id)) return reject('owned')
      if (!spend(s, ctx, item.price)) return reject('coins')
      s.shop.relics.push(item.id)
      return { changed: true, events: [{ kind: 'purchase', item: 'relic', name: item.name }] }
    }
    case 'buyRoom': {
      const room = ROOMS.find(r => r.id === action.id && r.price > 0)
      if (!room) return reject('invalid')
      if (roomOwned(room.id, s.shop.relics)) return reject('owned')
      if (!spend(s, ctx, room.price)) return reject('coins')
      s.shop.relics.push('room:' + room.id)
      s.shop.room = room.id
      return { changed: true, events: [{ kind: 'purchase', item: 'room', name: room.name }] }
    }
    case 'setRoom':
      if (!ROOMS.some(r => r.id === action.id) || !roomOwned(action.id, s.shop.relics)) return reject('locked')
      if (s.shop.room === action.id) return nothing
      s.shop.room = action.id
      return { changed: true }
    case 'toggleDisplay': {
      const has = s.shop.display.includes(action.id)
      if (has) { s.shop.display = s.shop.display.filter(x => x !== action.id); return { changed: true } }
      const valid = RELICS.some(r => r.id === action.id) && s.shop.relics.includes(action.id)
        || medals(s, ctx).some(m => 'medal:' + m.id === action.id && m.unlocked)
      if (!valid) return reject('locked')
      if (s.shop.display.length >= DISPLAY_LIMIT) return reject('limit')
      s.shop.display.push(action.id)
      return { changed: true }
    }
    case 'swapQuest': {
      if (action.day !== s.quests.day) return reject('invalid')
      const replacement = questReplacement(s, ctx, action.id)
      if (!replacement) return reject('limit')
      if (!spend(s, ctx, SWAP_PRICE)) return reject('coins')
      s.quests.ids = s.quests.ids.map(id => id === action.id ? replacement.id : id)
      s.quests.retired = [...(s.quests.retired ?? []), action.id]
      s.quests.swaps = (s.quests.swaps ?? 0) + 1
      return { changed: true, events: [{ kind: 'purchase', item: 'swap', name: 'Nova missão: ' + replacement.title }] }
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

    case 'unlockModule': {
      const price = Number.isInteger(action.module) ? moduleUnlockPrice(action.module) : null
      if (price === null || !s.modules[action.module]) return reject('invalid')
      if (s.shop.unlocked.includes(action.module)) return reject('owned')
      // Já liberado pelos pré-requisitos (ou por progresso anterior): não há o que pagar.
      if (isModuleUnlocked(s, ctx, action.module)) return reject('open')
      if (!spend(s, ctx, price)) return reject('coins')
      s.shop.unlocked = [...s.shop.unlocked, action.module].sort((a, b) => a - b)
      return {
        changed: true,
        events: [{ kind: 'purchase', item: 'module', name: `Módulo ${action.module + 1}` }],
        log: [['unlock', `m${action.module}`]],
      }
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

    case 'hint': {
      const spec = findChallenge(ctx, action.challenge)
      if (!spec) return reject('missing')
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= HINTS_PER_CHALLENGE) return reject('invalid')
      if (!isChallengeOpen(s, ctx, spec)) return reject('prereq')
      const c = challengeOf(s, spec.id)
      if (isRunDone(c) || c.run.hints[action.index]) return nothing
      c.run.hints[action.index] = true
      c.hints = bump(c.hints)
      return { changed: true, study: true, events: [{ kind: 'hint', challenge: spec.id }], log: [['hint', `${spec.id}:${action.index + 1}`]] }
    }

    case 'identify': {
      const spec = findChallenge(ctx, action.challenge)
      if (!spec) return reject('missing')
      if (!isChallengeOpen(s, ctx, spec)) return reject('prereq')
      const grade = gradeLines(spec, action.lines)
      if (!grade.valid) return reject('invalid')
      const c = challengeOf(s, spec.id)
      if (c.run.identified) return nothing
      c.attempts = bump(c.attempts)
      if (!grade.ok) {
        c.misses = bump(c.misses)
        return {
          changed: true,
          study: true,
          events: [{ kind: 'challenge-miss', challenge: spec.id, phase: 'identify' }],
          log: [['challenge-miss', `${spec.id}:identificar`]],
        }
      }
      const first = !c.identified
      c.run.identified = true
      c.identified = true
      if (grade.extra) c.extra = true
      return {
        changed: true,
        study: true,
        events: [{ kind: 'challenge', challenge: spec.id, phase: 'identify', first, helpless: false }],
        log: [['identify', spec.id]],
      }
    }

    case 'fix': {
      const spec = findChallenge(ctx, action.challenge)
      if (!spec) return reject('missing')
      if (!isChallengeOpen(s, ctx, spec)) return reject('prereq')
      const grade = gradeFix(spec, action.option)
      if (!grade.valid) return reject('invalid')
      const c = challengeOf(s, spec.id)
      if (!c.run.identified) return reject('order')
      if (c.run.fixed) return nothing
      c.attempts = bump(c.attempts)
      if (!grade.ok) {
        c.misses = bump(c.misses)
        return {
          changed: true,
          study: true,
          events: [{ kind: 'challenge-miss', challenge: spec.id, phase: 'fix' }],
          log: [['challenge-miss', `${spec.id}:corrigir`]],
        }
      }
      const first = !c.fixed
      c.run.fixed = true
      c.fixed = true
      if (!c.solved) c.solved = dayKey(now)
      const helpless = hintsUsed(c) === 0
      if (helpless) c.helpless = true
      return {
        changed: true,
        study: true,
        events: [{ kind: 'challenge', challenge: spec.id, phase: 'done', first, helpless }],
        log: [
          ['fix', spec.id],
          ['challenge', spec.id],
        ],
      }
    }

    case 'retry': {
      const spec = findChallenge(ctx, action.challenge)
      if (!spec) return reject('missing')
      if (!isChallengeOpen(s, ctx, spec)) return reject('prereq')
      const c = challengeOf(s, spec.id)
      if (!isRunDone(c)) return reject('order')
      c.run = emptyChallenge().run
      return { changed: true, log: [['retry', spec.id]] }
    }

    case 'card': {
      if (typeof action.id !== 'string' || !FLASHCARD_ID.test(action.id) || typeof action.known !== 'boolean') return reject('invalid')
      if (/^m\d/.test(action.id) && Number(action.id[1]) >= MODULE_COUNT) return reject('invalid')
      if (s.cards[action.id] === action.known) return nothing
      if (!(action.id in s.cards) && Object.keys(s.cards).length >= LIMITS.cards) return reject('limit')
      s.cards[action.id] = action.known
      return { changed: true, study: true, log: [['card', action.id]] }
    }

    case 'missionStart':
    case 'missionGo':
    case 'missionHint':
    case 'missionAnswer':
    case 'missionReveal':
    case 'missionRewind':
    case 'missionFinish':
    case 'missionRestart':
    case 'dossierRead':
    case 'lessonRead':
      return mutateMission(s, action, ctx, now)

    case 'architectFind':
    case 'architectApply':
    case 'architectEvaluate':
    case 'architectAdr':
    case 'architectReset':
      return mutateArchitect(s, action, ctx, now)

    case 'setSound':
      if (typeof action.on !== 'boolean' || s.prefs.sound === action.on) return nothing
      s.prefs.sound = action.on
      return { changed: true }
  }

  // As demais ações são sobre um módulo.
  if (!inRange(action.module, MODULE_COUNT)) return nothing
  const m = s.modules[action.module]
  const n = action.module
  // Registrar tarefas exige o módulo liberado (pré-requisitos com fogueira acesa, ou progresso anterior).
  const closed = () => !isModuleUnlocked(s, ctx, n)
  switch (action.type) {
    case 'read':
      if (!inRange(action.index, READS_PER_MODULE) || m.reads[action.index]) return nothing
      if (closed()) return reject('prereq')
      m.reads[action.index] = true
      s.daily.reads = bump(s.daily.reads)
      return { changed: true, study: true, log: [['read', `m${n}-aula-${action.index + 1}`]] }
    case 'research':
      if (m.research) return nothing
      if (closed()) return reject('prereq')
      m.research = true
      return { changed: true, study: true, log: [['research', `m${n}-pesquisa`]] }
    case 'practice':
      if (m.practice) return nothing
      if (closed()) return reject('prereq')
      m.practice = true
      s.daily.practices = bump(s.daily.practices)
      return { changed: true, study: true, log: [['practice', `m${n}-pratica`]] }
    case 'answer':
      if (!inRange(action.index, QUESTIONS_PER_MODULE) || m.solved[action.index]) return nothing
      if (closed()) return reject('prereq')
      m.firstTry[action.index] = m.misses[action.index] === 0
      m.solved[action.index] = true
      s.daily.answers = bump(s.daily.answers)
      return { changed: true, study: true, log: [['answer', `m${n}-q${action.index + 1}`]] }
    case 'miss':
      if (!inRange(action.index, QUESTIONS_PER_MODULE) || m.solved[action.index]) return nothing
      if (closed()) return reject('prereq')
      m.misses[action.index] = Math.min(LIMITS.misses, m.misses[action.index] + 1)
      return { changed: true, study: true, log: [['miss', `m${n}-q${action.index + 1}`]] }
    case 'note': {
      const value = String(action.value).slice(0, LIMITS.noteLength)
      if (m[action.field] === value) return nothing
      m[action.field] = value
      return { changed: true }
    }

    case 'bossAnswer': {
      const answers = ctx.bosses[n] ?? []
      if (!answers.length) return reject('missing')
      if (!isModuleComplete(m)) return reject('fogueira')
      const grade = gradeBoss(answers, action.index, action.option)
      if (!grade.valid) return reject('invalid')
      const boss = bossOf(s, n)
      if (boss.done[action.index]) return nothing
      if (!grade.ok) {
        boss.mistakes = bump(boss.mistakes)
        return { changed: true, study: true, events: [{ kind: 'boss-miss', module: n }], log: [['boss-miss', `m${n}-chefe-${action.index + 1}`]] }
      }
      boss.done[action.index] = true
      const total = Math.min(BOSS_QUESTIONS, answers.length)
      if (!boss.done.slice(0, total).every(Boolean)) {
        return { changed: true, study: true, log: [['boss', `m${n}-chefe-${action.index + 1}`]] }
      }
      const first = !boss.won
      const flawless = boss.mistakes === 0
      boss.wins = bump(boss.wins)
      if (first) boss.won = dayKey(now)
      if (flawless) boss.flawless = true
      return { changed: true, study: true, events: [{ kind: 'boss', module: n, flawless, first }], log: [['boss', `m${n}-chefe`]] }
    }

    case 'bossRetry': {
      const answers = ctx.bosses[n] ?? []
      if (!answers.length) return reject('missing')
      const boss = bossOf(s, n)
      const total = Math.min(BOSS_QUESTIONS, answers.length)
      if (!boss.won || !boss.done.slice(0, total).every(Boolean)) return reject('order')
      boss.done = emptyBoss().done
      boss.mistakes = 0
      return { changed: true, log: [['retry', `m${n}-chefe`]] }
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
  const openBefore = Object.keys(draft.modules).map((i) => isModuleUnlocked(draft, ctx, Number(i)))

  const out = mutate(draft, action, ctx, now)
  if (!out.changed) return { state, events: [], changed: false, rejected: out.rejected }

  const today = dayKey(now)
  if (!draft.learner.id) draft.learner = { id: `a${now.getTime().toString(36)}`, since: today }
  for (const [kind, ref] of out.log ?? []) logEvent(draft, now, kind, ref)

  const head: ProgressEvent[] = []
  if (out.study) {
    touchStudy(draft, now)
    const touch = touchStreak(draft, now)
    if (touch.shieldsUsed) head.push({ kind: 'shield-used', count: touch.shieldsUsed })
    if (touch.extended) head.push({ kind: 'streak', current: draft.streak.current })
  }
  head.push(...(out.events ?? []))

  // Medalhas dão XP, XP cumpre missões, missões liberam medalhas: repete até estabilizar.
  const tail: ProgressEvent[] = []
  let seen = before.xp
  for (let guard = 0; guard < 6; guard++) {
    const fresh = recordMedals(draft, ctx, today)
    for (const medal of fresh) {
      tail.push({ kind: 'medal', medal })
      logEvent(draft, now, 'achievement', medal.id)
    }
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
    if (!completeBefore[i] && isModuleComplete(m)) {
      draft.fires[i] = today
      logEvent(draft, now, 'fogueira', `m${i}`)
      events.push({ kind: 'module', module: i })
    }
  })
  Object.keys(draft.modules).forEach((key, i) => {
    if (!openBefore[i] && isModuleUnlocked(draft, ctx, Number(key))) events.push({ kind: 'unlock', module: Number(key) })
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
