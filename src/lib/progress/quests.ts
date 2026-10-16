import { CHEST_COINS, QUESTS, QUESTS_PER_DAY, REVIEW, type QuestDef } from './catalog'
import { countDone } from './core'
import { LIMITS, MODULE_COUNT, QUESTIONS_PER_MODULE, READS_PER_MODULE, CASE_COUNT } from './constants'
import { dayKey } from './dates'
import { maxXp, summary } from './medals'
import { seededRandom, shuffled } from './random'
import type { Daily, ProgressContext, StudyState } from './types'

const zeroDaily = (day: string): Daily => ({ day, reads: 0, answers: 0, practices: 0, cases: 0, reviews: 0, xp: 0 })

/** Uma missão só entra no dia se ainda for possível cumpri-la com o que falta estudar. */
function feasible(q: QuestDef, s: StudyState, ctx: ProgressContext): boolean {
  const modules = Object.values(s.modules)
  const count = (f: (m: StudyState['modules'][number]) => number) => modules.reduce((n, m) => n + f(m), 0)
  switch (q.counter) {
    case 'reads':
      return MODULE_COUNT * READS_PER_MODULE - count((m) => countDone(m.reads)) >= q.target
    case 'answers':
      return MODULE_COUNT * QUESTIONS_PER_MODULE - count((m) => countDone(m.solved)) >= q.target
    case 'practices':
      return MODULE_COUNT - count((m) => Number(m.practice)) >= q.target
    case 'cases':
      return CASE_COUNT - countDone(s.cases) >= q.target
    case 'reviews':
      return count((m) => countDone(m.solved)) >= REVIEW.minPool
    case 'xp': {
      const max = maxXp(ctx)
      return max.tasks + max.medals - summary(s, ctx).xp >= q.target
    }
  }
}

/** Escolhe as missões do dia, sempre as mesmas para o mesmo dia e o mesmo progresso. */
export function pickQuests(s: StudyState, ctx: ProgressContext, day: string): string[] {
  const picked: QuestDef[] = []
  for (const q of shuffled(QUESTS.filter((q) => feasible(q, s, ctx)), seededRandom(`missoes:${day}`))) {
    if (picked.length === QUESTS_PER_DAY) break
    if (q.group && picked.some((p) => p.group === q.group)) continue
    picked.push(q)
  }
  return picked.map((q) => q.id)
}

/** Vira o dia (altera `s`): zera os contadores diários e sorteia as missões novas. */
export function rollDay(s: StudyState, ctx: ProgressContext, now: Date): void {
  const today = dayKey(now)
  if (s.daily.day !== today) s.daily = zeroDaily(today)
  if (s.quests.day !== today) s.quests = { day: today, ids: pickQuests(s, ctx, today), done: [], chest: false }
}

export interface QuestEvent {
  kind: 'quest'
  id: string
  title: string
  coins: number
}
export interface ChestEvent {
  kind: 'chest'
  coins: number
}

/** Marca as missões cumpridas, credita as moedas e abre o baú quando todas estiverem prontas
 *  (altera `s`). Devolve os eventos gerados. */
export function settleQuests(s: StudyState): Array<QuestEvent | ChestEvent> {
  const events: Array<QuestEvent | ChestEvent> = []
  for (const q of QUESTS) {
    if (!s.quests.ids.includes(q.id) || s.quests.done.includes(q.id) || s.daily[q.counter] < q.target) continue
    s.quests.done.push(q.id)
    s.coins.bonus = Math.min(LIMITS.big, s.coins.bonus + q.coins)
    s.lifetime.quests = Math.min(LIMITS.small, s.lifetime.quests + 1)
    events.push({ kind: 'quest', id: q.id, title: q.title, coins: q.coins })
  }
  if (!s.quests.chest && s.quests.ids.length > 0 && s.quests.done.length === s.quests.ids.length) {
    s.quests.chest = true
    s.coins.bonus = Math.min(LIMITS.big, s.coins.bonus + CHEST_COINS)
    events.push({ kind: 'chest', coins: CHEST_COINS })
  }
  return events
}

export interface QuestView {
  id: string
  title: string
  progress: number
  target: number
  coins: number
  done: boolean
}

export interface DailyView {
  quests: QuestView[]
  chest: boolean
  chestCoins: number
  allDone: boolean
  xpToday: number
  reviewsToday: number
}

/** Missões e contadores de hoje para exibir, mesmo antes da primeira ação do dia. */
export function dailyView(s: StudyState, ctx: ProgressContext, now: Date): DailyView {
  const view = JSON.parse(JSON.stringify(s)) as StudyState
  rollDay(view, ctx, now)
  const quests = view.quests.ids.flatMap((id): QuestView[] => {
    const q = QUESTS.find((x) => x.id === id)
    if (!q) return []
    return [{ id, title: q.title, progress: Math.min(q.target, view.daily[q.counter]), target: q.target, coins: q.coins, done: view.quests.done.includes(id) }]
  })
  return {
    quests,
    chest: view.quests.chest,
    chestCoins: CHEST_COINS,
    allDone: quests.length > 0 && quests.every((q) => q.done),
    xpToday: view.daily.xp,
    reviewsToday: view.daily.reviews,
  }
}
