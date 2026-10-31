import { beforeEach, describe, expect, it, vi } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { applyAction, emptyState, type Action, type ApplyResult } from '@/lib/progress'

const toast = vi.hoisted(() => Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), custom: vi.fn() }))
const chime = vi.hoisted(() => vi.fn())
vi.mock('sonner', () => ({ toast }))
vi.mock('@/lib/sound', () => ({ playUnlockChime: chime }))

import { notifyResult } from './ProgressFeedback'

/** Estado em que marcar um flashcard libera uma conquista (a 7ª sequência de estudo). */
function unlockingByCard(sound: boolean): [ApplyResult, Action] {
  const now = new Date(2026, 9, 16, 12)
  const state = emptyState()
  state.prefs.sound = sound
  state.study = { ...state.study, last: '2026-10-15', current: 6, best: 6, total: 6 }
  const action: Action = { type: 'card', id: 'm0-c1', known: true }
  return [applyAction(state, action, progressContext, now), action]
}

describe('avisos de progresso', () => {
  beforeEach(() => {
    toast.mockClear()
    toast.success.mockClear()
    toast.error.mockClear()
    toast.custom.mockClear()
    chime.mockClear()
  })

  it('flashcard é silencioso, mas uma conquista liberada por ele ainda avisa', () => {
    const [result, action] = unlockingByCard(false)
    expect(result.events.some((e) => e.kind === 'medal' && e.medal.id === 'persistencia')).toBe(true)
    notifyResult(result, action)
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.custom).toHaveBeenCalledTimes(result.events.filter((e) => e.kind === 'medal').length)
    expect(chime).not.toHaveBeenCalled()
  })

  it('o som só toca quando a pessoa ligou a opção', () => {
    const [result, action] = unlockingByCard(true)
    notifyResult(result, action)
    expect(chime).toHaveBeenCalledTimes(1)
  })

  it('ação recusada mostra o motivo, sem som nem medalha', () => {
    const rejected: ApplyResult = { state: emptyState(), events: [], changed: false, rejected: 'prereq' }
    notifyResult(rejected, { type: 'read', module: 2, index: 0 })
    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/pré-requisitos/))
    expect(chime).not.toHaveBeenCalled()
  })
})
