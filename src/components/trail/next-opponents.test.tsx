import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { bosses } from '@/data/bosses'
import { modules } from '@/data/modules'
import { progressContext } from '@/data/progress-context'
import { emptyBoss, emptyModule, type StudyState } from '@/lib/progress'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { NextOpponents } from './NextOpponents'

/* Depois de derrubar o primeiro guardião, quem escolhe o próximo é quem estuda: os liberados ficam
   à vista e os demais temas, num submenu fechado, para não disputarem a atenção. */

const feito = () => ({ ...emptyModule(), reads: [true, true, true], research: true, practice: true, solved: [true, true] })

function abrir({ completos = [] as number[], vencidos = [] as number[], vencido }: { completos?: number[]; vencidos?: number[]; vencido?: number } = {}) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 10, 4, 12) })
  const s = store.getState()
  store.replace({
    ...s,
    modules: { ...s.modules, ...Object.fromEntries(completos.map((i) => [i, feito()])) },
    fires: Object.fromEntries(completos.map((i) => [i, '2026-11-01'])),
    bosses: { ...s.bosses, ...Object.fromEntries(vencidos.map((i) => [i, { ...emptyBoss(), done: [true, true, true], wins: 1, won: '2026-11-02' }])) },
  } as StudyState)
  render(
    <MemoryRouter>
      <ProgressProvider store={store}>
        <NextOpponents vencido={vencido} />
      </ProgressProvider>
    </MemoryRouter>,
  )
}

describe('escolha do próximo oponente', () => {
  it('oferece os chefes com a fogueira acesa e que ainda estão de pé', () => {
    abrir({ completos: [0, 1], vencidos: [0], vencido: 0 })
    expect(screen.getByRole('heading', { level: 2, name: 'Quem você enfrenta agora' })).toBeInTheDocument()
    const lista = screen.getAllByRole('listitem').filter((li) => within(li).queryByRole('link', { name: /Enfrentar/ }))
    expect(lista.length).toBe(1)
    expect(within(lista[0]).getByRole('link', { name: /Enfrentar/ })).toHaveAttribute('href', '/chefe/1')
    expect(within(lista[0]).getByRole('heading', { level: 3, name: bosses[1].name })).toBeInTheDocument()
  })

  it('o chefe recém-derrubado não volta à lista', () => {
    abrir({ completos: [0], vencido: 0 })
    expect(screen.queryByRole('link', { name: /Enfrentar/ })).toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'O que estudar agora' })).toBeInTheDocument()
  })

  it('os demais temas ficam num submenu, fechado', () => {
    abrir({ completos: [0], vencidos: [0], vencido: 0 })
    const submenu = screen.getByText(/Demais temas a estudar/).closest('details')
    expect(submenu).toBeTruthy()
    expect(submenu).not.toHaveAttribute('open')
    // dentro de um <details> fechado o conteúdo não entra na árvore de acessibilidade: a busca é pelo texto
    const item = within(submenu!).getByText(`Módulo ${modules[1].number} · ${modules[1].title}`)
    expect(item.closest('a')).toHaveAttribute('href', '/modulo/1')
    // o módulo já concluído não entra na lista do que falta estudar
    expect(within(submenu!).queryByText(`Módulo ${modules[0].number} · ${modules[0].title}`)).toBeNull()
  })
})
