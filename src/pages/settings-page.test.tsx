import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { cleanState } from '@/lib/progress'
import { SettingsPage } from '@/pages/SettingsPage'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'

function setup(native: boolean) {
  const store = createProgressStore({ storage: null, ctx: progressContext })
  store.replace(cleanState({ coins: { bonus: 50 } }))
  render(
    <MemoryRouter>
      <ProgressProvider store={store}>
        <SettingsPage native={native} />
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('configurações: dificuldade e modo deus', () => {
  it('no navegador só mostra o modo atual, sem editor', () => {
    setup(false)
    expect(screen.getByText(/só podem ser alterados no app Android/)).toBeTruthy()
    expect(screen.queryByRole('radio')).toBeNull()
  })

  it('no app troca a dificuldade e salva ajustes do modo deus', async () => {
    const store = setup(true)
    const user = userEvent.setup()
    expect((screen.getByRole('radio', { name: /Soulslike/ }) as HTMLButtonElement).getAttribute('data-state')).toBe('checked')
    await user.click(screen.getByRole('radio', { name: /Fácil/ }))
    expect(store.getState().economy).toEqual({ mode: 'facil' })

    const shield = screen.getByLabelText(/Escudo de Silício/)
    await user.clear(shield)
    await user.type(shield, '1')
    await user.click(screen.getByRole('button', { name: /Salvar ajustes/ }))
    expect(store.getState().economy).toEqual({ mode: 'facil', overrides: { prices: { shield: 1 } } })

    await user.click(screen.getByRole('button', { name: /Restaurar valores do modo/ }))
    expect(store.getState().economy).toEqual({ mode: 'facil' })
  })
})
