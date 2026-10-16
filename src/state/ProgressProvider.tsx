import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { progressContext } from '@/data/progress-context'
import {
  activeStreak,
  activeStudyDays,
  canReview,
  coinBalance,
  dailyView,
  dayKey,
  improvements,
  levelFor,
  medals,
  nextObjective,
  streakStatus,
  summary,
  trackProgress,
  trail,
  type Action,
  type ApplyResult,
  type DailyView,
  type Improvement,
  type LevelInfo,
  type Medal,
  type Objective,
  type ProgressContext,
  type StreakStatus,
  type StudyState,
  type Summary,
  type TrackProgress,
  type TrailModule,
} from '@/lib/progress'
import { browserStorage, createProgressStore, type ProgressStore } from './progress-store'

export { progressContext }

/** Tudo o que a interface mostra, calculado uma vez por mudança de estado ou de dia. */
export interface Derived {
  summary: Summary
  level: LevelInfo
  medals: Medal[]
  tracks: TrackProgress[]
  improvements: Improvement[]
  daily: DailyView
  balance: number
  streak: number
  streakStatus: StreakStatus
  canReview: boolean
  /** Dias reais seguidos de estudo (sem escudos). */
  studyDays: number
  trail: TrailModule[]
  /** O próximo objetivo real da trilha. */
  objective: Objective
}

export interface ProgressValue {
  store: ProgressStore
  state: StudyState
  ctx: ProgressContext
  storageOk: boolean
  /** Dia local (AAAA-MM-DD); muda sozinho à meia-noite. */
  today: string
  derived: Derived
  dispatch: (action: Action) => ApplyResult
}

const Ctx = createContext<ProgressValue | null>(null)

export function derive(state: StudyState, ctx: ProgressContext, now: Date): Derived {
  const sm = summary(state, ctx)
  return {
    summary: sm,
    level: levelFor(sm.xp),
    medals: medals(state, ctx),
    tracks: trackProgress(state, ctx),
    improvements: improvements(state, ctx),
    daily: dailyView(state, ctx, now),
    balance: coinBalance(state, ctx),
    streak: activeStreak(state, now),
    streakStatus: streakStatus(state, now),
    canReview: canReview(state),
    studyDays: activeStudyDays(state, now),
    trail: trail(state, ctx),
    objective: nextObjective(state, ctx),
  }
}

/** Dia local de hoje, atualizado à meia-noite e quando a aba volta a ficar visível. */
export function useToday(): string {
  const [today, setToday] = useState(() => dayKey(new Date()))
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const refresh = () => setToday(dayKey(new Date()))
    const schedule = () => {
      const now = new Date()
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
      timer = setTimeout(() => {
        refresh()
        schedule()
      }, Math.max(1000, next.getTime() - now.getTime()))
    }
    schedule()
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return today
}

export function ProgressProvider({ children, store: injected }: { children: ReactNode; store?: ProgressStore }) {
  const [store] = useState(() => injected ?? createProgressStore({ storage: browserStorage(), ctx: progressContext }))
  const state = useSyncExternalStore(store.subscribe, store.getState)
  const storageOk = useSyncExternalStore(store.subscribe, store.getStorageOk)
  const today = useToday()

  // Outra aba mudou o progresso: relê o armazenamento.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => store.handleStorageEvent(event)
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [store])

  // `today` entra nas dependências para recalcular missões e sequência na virada do dia.
  const derived = useMemo(() => derive(state, progressContext, new Date()), [state, today])
  const dispatch = useCallback((action: Action) => store.dispatch(action), [store])
  const value = useMemo<ProgressValue>(
    () => ({ store, state, ctx: progressContext, storageOk, today, derived, dispatch }),
    [store, state, storageOk, today, derived, dispatch],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProgress(): ProgressValue {
  const value = useContext(Ctx)
  if (!value) throw new Error('useProgress precisa estar dentro de <ProgressProvider>')
  return value
}
