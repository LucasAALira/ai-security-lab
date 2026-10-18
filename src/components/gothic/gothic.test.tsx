import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navGroups } from '@/components/layout/nav'
import { progressContext as ctx } from '@/data/progress-context'
import { applyAction, cleanState, type ApplyResult } from '@/lib/progress'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { EmberBurst } from './EmberBurst'
import { PageVeil, VEIL_MS } from './PageVeil'
import { BANNER_MS, TrialBanner, trialOf } from './TrialBanner'

const now = new Date(2026, 9, 17, 12)
const spec = ctx.challenges.find((c) => c.module === null)!

function solve(state = cleanState({})) {
  const a = applyAction(state, { type: 'identify', challenge: spec.id, lines: spec.vulnerable }, ctx, now)
  return applyAction(a.state, { type: 'fix', challenge: spec.id, option: spec.fix }, ctx, now)
}

describe('faixa "Provação superada"', () => {
  it('aparece na primeira vitória de um desafio, com o nome dele', () => {
    const t = trialOf(solve())
    expect(t?.title).toBe('Provação superada')
    expect(t?.detail.length).toBeGreaterThan(0)
  })

  it('não aparece de novo ao repetir um desafio já vencido (nada de conquista antiga)', () => {
    const first = solve()
    const retry = applyAction(first.state, { type: 'retry', challenge: spec.id }, ctx, now)
    expect(trialOf(solve(retry.state))).toBeNull()
  })

  it('não aparece em erro, em ação recusada nem sem XP novo', () => {
    const wrong = applyAction(cleanState({}), { type: 'identify', challenge: spec.id, lines: [] }, ctx, now)
    expect(trialOf(wrong)).toBeNull()
    const refused: ApplyResult = { state: cleanState({}), events: [], changed: false, rejected: 'coins' }
    expect(trialOf(refused)).toBeNull()
    const noXp: ApplyResult = { state: cleanState({}), events: [{ kind: 'mission', mission: 'x', passed: true }], changed: true }
    expect(trialOf(noXp)).toBeNull()
  })

  it('missão aprovada pela primeira vez (com XP) também é celebrada', () => {
    const m = ctx.missions.find((x) => x.kind === 'mission')!
    const r: ApplyResult = { state: cleanState({}), events: [{ kind: 'xp', amount: 25 }, { kind: 'mission', mission: m.id, passed: true }], changed: true }
    expect(trialOf(r)?.detail).toMatch(/^Missão: /)
  })

  describe('na tela', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('não bloqueia a página e some sozinha', () => {
      const store = createProgressStore({ storage: null, ctx, now: () => now })
      render(
        <MemoryRouter>
          <ProgressProvider store={store}>
            <TrialBanner />
          </ProgressProvider>
        </MemoryRouter>,
      )
      act(() => {
        store.dispatch({ type: 'identify', challenge: spec.id, lines: spec.vulnerable })
        store.dispatch({ type: 'fix', challenge: spec.id, option: spec.fix })
      })
      const banner = screen.getByTestId('trial-banner')
      expect(banner).toHaveAttribute('aria-hidden', 'true')
      expect(banner).toHaveClass('gx-banner')
      act(() => void vi.advanceTimersByTime(BANNER_MS + 10))
      expect(screen.queryByTestId('trial-banner')).toBeNull()
    })
  })
})

describe('tela de carregamento entre páginas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('não aparece no primeiro carregamento; aparece rápido na troca de página e some sozinha', () => {
    const { rerender } = render(<PageVeil page="/" />)
    expect(screen.queryByTestId('page-veil')).toBeNull()
    rerender(<PageVeil page="/areas" />)
    const veil = screen.getByTestId('page-veil')
    expect(veil).toHaveAttribute('aria-hidden', 'true')
    act(() => void vi.advanceTimersByTime(VEIL_MS + 10))
    expect(screen.queryByTestId('page-veil')).toBeNull()
    expect(VEIL_MS).toBe(720)
  })
})

describe('brasas de XP', () => {
  it('só sobem quando o XP aumenta, nunca ao abrir a página', () => {
    const { rerender } = render(<EmberBurst value={120} />)
    expect(screen.queryByTestId('ember-burst')).toBeNull()
    rerender(<EmberBurst value={120} />)
    expect(screen.queryByTestId('ember-burst')).toBeNull()
    rerender(<EmberBurst value={150} />)
    expect(screen.getByTestId('ember-burst')).toBeInTheDocument()
  })
})

describe('navegação temática', () => {
  const items = navGroups.flatMap((g) => g.items)

  it('mantém todos os destinos das versões anteriores', () => {
    const before = [
      '/?secao=inicio', '/areas', '/trilha', '/conquistas', '/?secao=trilhas', '/?secao=tarefas', '/?secao=requisitos', '/?secao=hoje', '/revisao',
      '/sala-de-trofeus', '/loja', '/campanhas', '/casos', '/arquiteto', '/desafios', '/?secao=laboratorio', '/?secao=cenarios', '/?secao=pentest',
      '/em-breve', '/?secao=fontes', '/referencias', '/explorar', '/cobertura',
    ]
    const now = items.map((i) => i.to)
    for (const to of before) expect(now, to).toContain(to)
  })

  it('cada nome temático vem com a função escrita ao lado', () => {
    const themed: Record<string, string> = { Jornada: '/?secao=inicio', Arquivos: '/areas', Contratos: '/?secao=hoje', Provações: '/desafios', Relicário: '/conquistas', Mercador: '/loja' }
    for (const [label, to] of Object.entries(themed)) {
      const item = items.find((i) => i.label === label)
      expect(item?.to, label).toBe(to)
      expect(item?.hint, label).toBeTruthy()
    }
  })
})
