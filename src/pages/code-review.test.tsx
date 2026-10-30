import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { reviewSamples, verdictLabel } from '@/data/code-review'
import { progressContext } from '@/data/progress-context'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { CodeReviewPage } from './CodeReviewPage'
import { CodeReviewSamplePage } from './CodeReviewSamplePage'

function open(path: string) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 30, 12) })
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider store={store}>
        <Routes>
          <Route path="/analise" element={<CodeReviewPage />} />
          <Route path="/analise/:amostra" element={<CodeReviewSamplePage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('guia de análise de código', () => {
  it('lista todas as amostras com o achado e o arquivo', () => {
    open('/analise')
    const itens = screen.getAllByRole('listitem').filter((li) => within(li).queryByRole('heading', { level: 2 }))
    expect(itens.length).toBe(reviewSamples.length)
    const primeira = reviewSamples[0]
    expect(screen.getByRole('heading', { level: 2, name: primeira.title })).toBeInTheDocument()
    expect(screen.getAllByText(new RegExp(primeira.finding.rule.split(' · ')[0])).length).toBeGreaterThan(0)
    expect(screen.getAllByText(primeira.file).length).toBeGreaterThan(0)
  })

  it('não entrega o veredito de quem ainda não concluiu a amostra', () => {
    open('/analise')
    for (const s of reviewSamples) expect(screen.queryByText(`Veredito: ${verdictLabel(s.verdict)}`)).toBeNull()
  })

  it('mostra o veredito depois que a triagem é concluída', () => {
    const alvo = reviewSamples[0]
    const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 30, 12) })
    const spec = progressContext.missions.find((m) => m.id === alvo.id)!
    store.dispatch({ type: 'missionStart', mission: alvo.id })
    store.dispatch({ type: 'missionAnswer', mission: alvo.id, activity: 'veredito', answer: { v: [1] } })
    store.dispatch({ type: 'missionAnswer', mission: alvo.id, activity: 'sinais', answer: { v: alvo.correctSignals } })
    const melhor = alvo.next.options.findIndex((o) => o.quality === 'best')
    store.dispatch({ type: 'missionAnswer', mission: alvo.id, activity: 'proximo-passo', answer: { v: [melhor] } })
    store.dispatch({ type: 'missionFinish', mission: alvo.id })
    expect(spec.kind).toBe('review')
    render(
      <MemoryRouter initialEntries={['/analise']}>
        <ProgressProvider store={store}>
          <Routes>
            <Route path="/analise" element={<CodeReviewPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    )
    expect(screen.getByText(`Veredito: ${verdictLabel(alvo.verdict)}`)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(`1 de ${reviewSamples.length} concluídas`)
  })

  it('filtra as amostras por área', async () => {
    const user = userEvent.setup()
    open('/analise')
    const area = reviewSamples[0].area
    const daArea = reviewSamples.filter((s) => s.area === area)
    const outra = reviewSamples.find((s) => s.area !== area)!
    const botao = screen.getAllByRole('button').find((b) => b.getAttribute('aria-pressed') === 'false' && b.textContent?.includes(String(daArea.length)))!
    await user.click(botao)
    expect(screen.getByRole('heading', { level: 2, name: daArea[0].title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: outra.title })).toBeNull()
  })

  it('a página da amostra abre no contexto, com as cinco etapas da triagem', () => {
    const s = reviewSamples[0]
    open(`/analise/${s.id}`)
    expect(screen.getByRole('heading', { level: 1, name: s.title })).toBeInTheDocument()
    expect(screen.getByText(/Treino de análise de código · triagem de um achado/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Começar a triagem/ })).toBeInTheDocument()
    const etapas = screen.getByRole('navigation', { name: /Etapas da triagem/ })
    expect(within(etapas).getAllByRole('button')).toHaveLength(5)
    expect(screen.getByText(/XP desta triagem/)).toBeInTheDocument()
  })

  it('endereço desconhecido leva de volta ao treino', () => {
    open('/analise/nao-existe')
    expect(screen.getByRole('heading', { level: 1, name: /Amostra não encontrada/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver o treino de análise de código/ })).toBeInTheDocument()
  })
})
