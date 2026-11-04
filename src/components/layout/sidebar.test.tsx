import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { Sidebar } from './Sidebar'
import { navGroups } from './nav'

/* O menu mostra cinco entradas e guarda o resto dentro delas. O que este teste protege: o submenu
   fechado não deixa os links à mostra (um `hidden` sozinho não vence a classe de display), e quem
   chega por um link direto encontra o menu já aberto na página em que está. */

function abrir(rota = '/') {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 10, 4, 12) })
  render(
    <MemoryRouter initialEntries={[rota]}>
      <ProgressProvider store={store}>
        <Sidebar />
      </ProgressProvider>
    </MemoryRouter>,
  )
  return screen.getByRole('navigation', { name: 'Navegação principal' })
}

const submenuDe = (nav: HTMLElement, grupo: string) => nav.querySelector<HTMLElement>(`#submenu-${grupo}`)

describe('menu lateral', () => {
  it('mostra cinco entradas no primeiro nível', () => {
    const nav = abrir()
    expect(navGroups.length).toBe(5)
    // a primeira faixa do menu é a das entradas; os submenus vêm depois dela
    const topo = [...(nav.firstElementChild?.children ?? [])]
    expect(topo.length).toBe(5)
    const nomes = topo.map((e) => e.querySelector<HTMLElement>('[class*="font-semibold"]')?.textContent)
    expect(nomes).toEqual(['Jornada', 'Estudar', 'Praticar', 'Progresso', 'Biblioteca'])
  })

  it('submenu fechado não deixa os links à mostra', () => {
    const nav = abrir()
    const sub = submenuDe(nav, 'Praticar')!
    expect(sub).toHaveAttribute('hidden')
    expect(sub.style.display).toBe('none')
    expect(within(nav).queryByRole('link', { name: /Campanhas/ })).toBeNull()
  })

  it('clicar na entrada abre o submenu, e clicar de novo fecha', async () => {
    const user = userEvent.setup()
    const nav = abrir()
    const botao = within(nav).getByRole('button', { name: /Praticar/ })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(within(nav).getByRole('link', { name: /Campanhas/ })).toHaveAttribute('href', '/campanhas')
    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'false')
  })

  it('abre um submenu de cada vez', async () => {
    const user = userEvent.setup()
    const nav = abrir()
    await user.click(within(nav).getByRole('button', { name: /Praticar/ }))
    await user.click(within(nav).getByRole('button', { name: /Biblioteca/ }))
    expect(within(nav).getByRole('button', { name: /Praticar/ })).toHaveAttribute('aria-expanded', 'false')
    expect(within(nav).getByRole('button', { name: /Biblioteca/ })).toHaveAttribute('aria-expanded', 'true')
  })

  it('quem chega por um link direto encontra o menu aberto na página em que está', () => {
    const nav = abrir('/loja')
    expect(within(nav).getByRole('button', { name: /Progresso/ })).toHaveAttribute('aria-expanded', 'true')
    expect(within(nav).getByRole('link', { name: /Mercador/ })).toHaveAttribute('href', '/loja')
  })
})
