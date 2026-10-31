import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StudyTimeSection } from '@/components/home/StudyTimeSection'
import { progressContext } from '@/data/progress-context'
import { dayKey } from '@/lib/progress'
import { ProgressProvider } from './ProgressProvider'
import { createProgressStore } from './progress-store'
import { countsAsStudy, IDLE_MS, TICK_MS } from './use-study-clock'

describe('quando o minuto conta como estudo', () => {
  const agora = 1_000_000

  it('conta com a aba à frente e interação recente', () => {
    expect(countsAsStudy({ visible: true, lastActive: agora - 1000, now: agora })).toBe(true)
    expect(countsAsStudy({ visible: true, lastActive: agora - (IDLE_MS - 1), now: agora })).toBe(true)
  })

  it('não conta com a aba escondida', () => {
    expect(countsAsStudy({ visible: false, lastActive: agora, now: agora })).toBe(false)
  })

  it('não conta depois do tempo de inatividade', () => {
    expect(countsAsStudy({ visible: true, lastActive: agora - IDLE_MS, now: agora })).toBe(false)
    expect(countsAsStudy({ visible: true, lastActive: agora - 10 * IDLE_MS, now: agora })).toBe(false)
  })

  it('ignora última interação no futuro (relógio do sistema mudou)', () => {
    expect(countsAsStudy({ visible: true, lastActive: agora + 5000, now: agora })).toBe(false)
  })
})

function montar() {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 30, 12) })
  render(
    <MemoryRouter>
      <ProgressProvider store={store}>
        <StudyTimeSection />
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('relógio ligado à página', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('soma minutos enquanto a aba está em uso e mostra na tela', () => {
    const store = montar()
    expect(screen.getByText('Tempo de estudo ao todo').previousElementSibling?.textContent).toBe('0 min')

    document.dispatchEvent(new Event('pointerdown'))
    vi.advanceTimersByTime(TICK_MS * 3)
    expect(store.getState().study.minutes).toBe(3)
  })

  it('pausa quando a aba sai da frente', () => {
    const store = montar()
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    vi.advanceTimersByTime(TICK_MS * 5)
    expect(store.getState().study.minutes).toBe(0)
    visibility.mockRestore()
  })

  it('pausa quando ninguém interage há muito tempo', () => {
    const store = montar()
    vi.advanceTimersByTime(IDLE_MS + TICK_MS * 2)
    const parado = store.getState().study.minutes
    vi.advanceTimersByTime(TICK_MS * 3)
    expect(store.getState().study.minutes).toBe(parado)
  })
})

describe('seção de horas e dias', () => {
  // A interface mostra o dia do próprio relógio do navegador, não o do armazenamento.
  const hoje = dayKey(new Date())

  it('mostra o tempo medido, os dias e o recorde', () => {
    const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 30, 12) })
    const atual = store.getState()
    store.replace({ ...atual, study: { last: hoje, current: 3, best: 9, total: 14, minutes: 200, clockDay: hoje, minutesToday: 25 } })
    render(
      <MemoryRouter>
        <ProgressProvider store={store}>
          <StudyTimeSection />
        </ProgressProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Horas e dias de estudo' })).toBeInTheDocument()
    const valor = (rotulo: string) => screen.getByText(rotulo).previousElementSibling?.textContent
    expect(valor('Tempo de estudo ao todo')).toBe('3 h 20 min')
    expect(valor('dias com atividade registrada')).toBe('14')
    expect(valor('Tempo de estudo hoje')).toBe('25 min')
    expect(valor('Recorde de dias seguidos')).toBe('9')
  })

  it('zera o tempo de hoje quando o registro é de outro dia', () => {
    const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 30, 12) })
    const atual = store.getState()
    store.replace({ ...atual, study: { ...atual.study, total: 2, minutes: 90, clockDay: '2020-01-02', minutesToday: 40 } })
    render(
      <MemoryRouter>
        <ProgressProvider store={store}>
          <StudyTimeSection />
        </ProgressProvider>
      </MemoryRouter>,
    )
    expect(screen.getByText('Tempo de estudo hoje').previousElementSibling?.textContent).toBe('0 min')
    expect(screen.getByText('Tempo de estudo ao todo').previousElementSibling?.textContent).toBe('1 h 30 min')
  })
})
