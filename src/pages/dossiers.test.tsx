import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { parseRich } from '@/components/rich/rich-parse'
import { dossiers } from '@/data/campaigns'
import { progressContext } from '@/data/progress-context'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { DossierPage } from './DossierPage'
import { DossierSimulationPage } from './DossierSimulationPage'
import { DossiersPage } from './DossiersPage'

function open(path: string) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 17, 12) })
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider store={store}>
        <Routes>
          <Route path="/casos" element={<DossiersPage />} />
          <Route path="/casos/:dossier" element={<DossierPage />} />
          <Route path="/casos/:dossier/simulacao" element={<DossierSimulationPage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('citações [n] nos textos', () => {
  it('só viram citação quando o chamador pede; sem o pedido, continuam texto', () => {
    expect(parseRich('fato [3] e **negrito**').some((t) => t.kind === 'cite')).toBe(false)
    const tokens = parseRich('fato [3][12] e **negrito**', { cites: true })
    expect(tokens.filter((t) => t.kind === 'cite')).toEqual([{ kind: 'cite', n: 3 }, { kind: 'cite', n: 12 }])
    expect(tokens.some((t) => t.kind === 'bold')).toBe(true)
  })

  it('colchetes que não são números continuam texto', () => {
    expect(parseRich('lista [a] e [123]', { cites: true }).every((t) => t.kind === 'text')).toBe(true)
  })
})

describe('página de casos reais', () => {
  it('lista os dossiês com datas, situação de leitura e link para cada um', () => {
    open('/casos')
    expect(screen.getByRole('heading', { level: 1, name: /Dossiês de incidentes/ })).toBeInTheDocument()
    for (const d of dossiers) {
      const link = screen.getByRole('link', { name: d.title })
      expect(link).toHaveAttribute('href', `/casos/${d.id}`)
    }
    expect(screen.getAllByText('Não lido')).toHaveLength(dossiers.length)
    expect(screen.getAllByText(/Fatos documentados/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Análise educacional/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Simulação fictícia/).length).toBeGreaterThan(0)
  })
})

describe.each(dossiers)('dossiê $id', (d) => {
  it('separa as três camadas rotuladas e lista as fontes numeradas, primárias primeiro', () => {
    open(`/casos/${d.id}`)
    expect(screen.getByRole('heading', { level: 1, name: d.title })).toBeInTheDocument()
    for (const label of ['Fatos documentados', 'Análise educacional', 'Simulação fictícia']) {
      expect(screen.getByRole('region', { name: label }), label).toBeInTheDocument()
    }
    const fontes = screen.getByRole('region', { name: /Fontes/ })
    const itens = within(fontes).getAllByRole('listitem')
    expect(itens).toHaveLength(d.sources.length)
    itens.forEach((li, i) => {
      expect(li.id).toBe(`fonte-${i + 1}`)
      expect(within(li).getByRole('link')).toHaveAttribute('href', d.sources[i].url)
    })
    // a primeira fonte é primária
    expect(within(itens[0]).getByText('primária')).toBeInTheDocument()
  })

  it('mostra incidente, divulgação, revisão, linha do tempo e incertezas', () => {
    open(`/casos/${d.id}`)
    expect(screen.getByText('Incidente').nextElementSibling).toHaveTextContent(d.incidentDate)
    expect(screen.getByText('Divulgação').nextElementSibling).toHaveTextContent(d.publishedDate)
    const [ano, mes, dia] = d.reviewed.split('-')
    expect(screen.getByText('Dossiê revisado em').nextElementSibling).toHaveTextContent(`${dia}/${mes}/${ano}`)
    expect(screen.getByRole('table', { name: /Linha do tempo/ })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(d.timeline.length + 1)
    expect(screen.getByRole('heading', { name: /Incertezas/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Componente comprometido/ })).toBeInTheDocument()
  })

  it('cada citação [n] é um botão que leva o foco à fonte correspondente', async () => {
    const user = userEvent.setup()
    open(`/casos/${d.id}`)
    const cites = screen.getAllByRole('button', { name: /^Ir à fonte \d+$/ })
    expect(cites.length).toBeGreaterThan(3)
    const alvo = cites[0]
    const n = Number(/(\d+)$/.exec(alvo.getAttribute('aria-label')!)![1])
    await user.click(alvo)
    expect(document.activeElement).toBe(document.getElementById(`fonte-${n}`))
  })

  it('marcar como lido grava a data uma vez, dá XP uma vez e muda o botão', async () => {
    const user = userEvent.setup()
    const store = open(`/casos/${d.id}`)
    expect(store.getState().dossiers[d.id]).toBeUndefined()
    await user.click(screen.getByRole('button', { name: 'Marcar como lido' }))
    expect(store.getState().dossiers[d.id]).toBe('2026-10-17')
    expect(screen.queryByRole('button', { name: 'Marcar como lido' })).toBeNull()
    expect(screen.getAllByText(/Lido em 17\/10\/2026/).length).toBeGreaterThan(0)
  })

  it('a simulação abre no contexto, rotulada como fictícia, com link de volta ao dossiê', async () => {
    open(`/casos/${d.id}/simulacao`)
    expect(screen.getByRole('heading', { level: 1, name: d.exercise.title })).toBeInTheDocument()
    expect(screen.getByText(/Simulação fictícia · inspirada em/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /1\. Contexto/ })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Você está em' })
    expect(within(nav).getByRole('link', { name: d.title })).toHaveAttribute('href', `/casos/${d.id}`)
  })
})

describe('endereços inválidos', () => {
  it('dossiê inexistente mostra a página de erro com caminho de volta', () => {
    open('/casos/nao-existe')
    expect(screen.getByRole('heading', { name: 'Caso não encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver os casos reais' })).toHaveAttribute('href', '/casos')
  })

  it('simulação inexistente também', () => {
    open('/casos/nao-existe/simulacao')
    expect(screen.getByRole('heading', { name: 'Simulação não encontrada' })).toBeInTheDocument()
  })
})
