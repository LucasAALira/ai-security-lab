import { describe, expect, it } from 'vitest'
import { cueFor } from './soundscape'
import type { ApplyResult } from '@/lib/progress'
const result = (events: ApplyResult['events'], changed = true) => ({ events, changed } as ApplyResult)
describe('sound selection from actual progress results', () => {
  it('does not celebrate unchanged or restored progress', () => {
    expect(cueFor(result([{ kind: 'xp', amount: 10 }], false))).toBeNull()
    expect(cueFor(result([]))).toBeNull()
  })
  it('plays purchase only on successful purchase', () => {
    expect(cueFor(result([{ kind: 'purchase', item: 'relic', name: 'Relíquia' }]))).toBe('purchase')
    expect(cueFor(result([], false))).toBeNull()
  })
  it('prioritizes one victory over the XP in the same event', () => {
    expect(cueFor(result([{ kind: 'xp', amount: 30 }, { kind: 'boss', module: 0, flawless: true, first: true }]))).toBe('victory')
    expect(cueFor(result([{ kind: 'boss', module: 0, flawless: true, first: false }]))).toBeNull()
  })
  it('handles XP and retry without victory', () => {
    expect(cueFor(result([{ kind: 'xp', amount: 5 }]))).toBe('xp')
    expect(cueFor(result([{ kind: 'boss-miss', module: 0 }]))).toBe('retry')
  })
})
