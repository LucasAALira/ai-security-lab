import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { bosses } from '@/data/bosses'
import { errantes } from '@/data/errantes'
import { progressContext } from '@/data/progress-context'
import { emptyBoss } from '@/lib/progress'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { BattleGallery } from './BattleGallery'

function abrir(vitorias: Record<number, { won: string; flawless: boolean }> = {}) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 10, 2, 12) })
  const estado = store.getState()
  store.replace({
    ...estado,
    bosses: Object.fromEntries(Object.entries(vitorias).map(([m, v]) => [m, { ...emptyBoss(), done: [true, true, true], wins: 1, ...v }])),
  })
  render(
    <MemoryRouter>
      <ProgressProvider store={store}>
        <BattleGallery />
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('crônicas do santuário', () => {
  it('tem um quadro por guardião e conta os derrubados', () => {
    abrir({ 0: { won: '2026-10-02', flawless: true }, 3: { won: '2026-10-29', flawless: false } })
    expect(screen.getByRole('heading', { level: 2, name: 'Crônicas do santuário' })).toBeInTheDocument()
    const total = bosses.length + errantes.length
    expect(screen.getAllByRole('tab').length).toBe(total)
    expect(screen.getByText(`2/${total} derrubados`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: bosses[0].name })).toBeInTheDocument()
    expect(screen.getByText(/Caiu em 02\/10\/2026, sem um erro sequer\./)).toBeInTheDocument()
  })

  it('avança e volta pelos botões, sem sair da lista', async () => {
    const user = userEvent.setup()
    abrir()
    await user.click(screen.getByRole('button', { name: 'Próximo quadro' }))
    expect(screen.getByRole('heading', { level: 3, name: bosses[1].name })).toBeInTheDocument()
    // voltar duas vezes dá a volta e chega no último quadro, que é o errante do fim da lista
    await user.click(screen.getByRole('button', { name: 'Quadro anterior' }))
    await user.click(screen.getByRole('button', { name: 'Quadro anterior' }))
    expect(screen.getByRole('heading', { level: 3, name: errantes.at(-1)!.nome })).toBeInTheDocument()
  })

  it('escolhe um quadro pela faixa de miniaturas', async () => {
    const user = userEvent.setup()
    abrir({ 2: { won: '2026-10-10', flawless: false } })
    const marca = screen.getByRole('tab', { name: `03 — ${bosses[2].name}, derrubado` })
    await user.click(marca)
    expect(marca).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/Caiu em 10\/10\/2026\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Reencontrar/ })).toHaveAttribute('href', '/modulo/2')
  })

  it('guardião ainda de pé ganha uma inscrição, não uma data', () => {
    abrir()
    expect(screen.getByText(/Módulo 01 · de pé/)).toBeInTheDocument()
    expect(screen.queryByText(/Caiu em/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Enfrentar/ })).toBeInTheDocument()
    const faixa = screen.getAllByRole('tab')
    expect(within(faixa[0]).queryByText(/derrubado/)).toBeNull()
  })

  it('os errantes entram no fim das crônicas, com a própria fala', async () => {
    const user = userEvent.setup()
    abrir()
    const primeiro = errantes[0]
    await user.click(screen.getByRole('tab', { name: new RegExp(`${primeiro.nome}, ainda de pé`) }))
    expect(screen.getByRole('heading', { level: 3, name: primeiro.nome })).toBeInTheDocument()
    expect(screen.getByText(new RegExp(primeiro.fala.slice(0, 30)))).toBeInTheDocument()
    expect(screen.getByText(/Errante · (Gelo|Veneno) · de pé/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Enfrentar/ })).toHaveAttribute('href', `/errantes/${primeiro.id}`)
  })

  it('a cena descreve em texto quem está diante de quem', () => {
    abrir({ 0: { won: '2026-10-02', flawless: false } })
    expect(screen.getByRole('img', { name: new RegExp(`diante de ${bosses[0].name}`) })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Derrotado em 02\/10\/2026/ })).toBeInTheDocument()
  })
})
