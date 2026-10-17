import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { architectProjects } from '@/data/architect'
import { progressContext } from '@/data/progress-context'
import type { Action } from '@/lib/progress'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { ArchitectListPage } from './ArchitectListPage'
import { ArchitectProjectPage } from './ArchitectProjectPage'

const NOW = new Date(2026, 9, 17, 12)

function open(path: string, seed: Action[] = []) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => NOW })
  for (const a of seed) store.dispatch(a)
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider store={store}>
        <Routes>
          <Route path="/arquiteto" element={<ArchitectListPage />} />
          <Route path="/arquiteto/:project" element={<ArchitectProjectPage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

/** Ações que aplicam a primeira solução comentada do projeto (todas as ameaças reais marcadas). */
function solvedActions(): Action[] {
  const p = architectProjects[0]
  const out: Action[] = []
  for (const c of p.components) c.threats.forEach((t, i) => t.real && out.push({ type: 'architectFind', project: p.id, component: c.id, threat: i, on: true }))
  for (const id of p.solutions[0].controls) {
    const i = p.controls.findIndex((c) => c.id === id)
    out.push({ type: 'architectApply', project: p.id, component: p.controls[i].places[0], control: i, on: true })
  }
  return out
}

describe('lista do modo Arquiteto', () => {
  it('mostra os três projetos com situação e link', () => {
    open('/arquiteto')
    expect(screen.getByRole('heading', { level: 1, name: 'Arquiteto de Segurança' })).toBeInTheDocument()
    for (const p of architectProjects) expect(screen.getByRole('link', { name: p.title })).toHaveAttribute('href', `/arquiteto/${p.id}`)
    expect(screen.getAllByText('Não iniciada')).toHaveLength(3)
  })
})

describe('projeto do modo Arquiteto', () => {
  const p = architectProjects[0]

  it('abre no projeto, com requisitos, perfis, restrições e fluxos; a revisão começa bloqueada', () => {
    open(`/arquiteto/${p.id}`)
    expect(screen.getByRole('heading', { level: 1, name: p.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Requisitos funcionais' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Perfis de acesso' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /fronteira de confiança/ })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Etapas da revisão' })
    expect(within(nav).getByRole('button', { name: /5\. Revisão/ })).toBeDisabled()
  })

  it('pelo teclado: abre a análise, seleciona um componente, marca uma ameaça e aplica um controle', async () => {
    const user = userEvent.setup()
    const store = open(`/arquiteto/${p.id}?etapa=analise`)
    expect(screen.getByRole('heading', { level: 2, name: /2\. Análise/ })).toBeInTheDocument()
    const gateway = screen.getByRole('button', { name: /Gateway da API/ })
    gateway.focus()
    await user.keyboard('{Enter}')
    expect(gateway).toHaveAttribute('aria-pressed', 'true')

    const threat = screen.getByRole('checkbox', { name: /versão 1 da API continua publicada/ })
    threat.focus()
    await user.keyboard(' ')
    expect(store.getState().architect[p.id].found.gateway).toEqual([1])

    const control = screen.getByRole('checkbox', { name: /Retirar a versão 1 da API/ })
    control.focus()
    await user.keyboard(' ')
    const index = p.controls.findIndex((c) => c.id === 'retirar-v1')
    expect(store.getState().architect[p.id].applied.gateway).toEqual([index])
    expect(screen.getByRole('status')).toHaveTextContent('Custo: 1 de 20')
  })

  it('avalia sem aprovar e aponta o que revisar sem entregar as ameaças não encontradas', async () => {
    const user = userEvent.setup()
    open(`/arquiteto/${p.id}?etapa=avaliacao`)
    await user.click(screen.getByRole('button', { name: 'Avaliar a solução' }))
    expect(screen.getByText(/Ainda não passou/)).toBeInTheDocument()
    expect(screen.getAllByText(/faltam marcar|falta marcar/).length).toBeGreaterThan(0)
    // ameaça não marcada não é revelada pelo título
    expect(screen.queryByText(/Avaliações exibidas sem codificação/)).toBeNull()
  })

  it('com uma solução defensável, aprova, libera a revisão comentada e mostra as duas soluções', async () => {
    const user = userEvent.setup()
    const store = open(`/arquiteto/${p.id}?etapa=avaliacao`, solvedActions())
    await user.click(screen.getByRole('button', { name: 'Avaliar a solução' }))
    expect(screen.getByText(/Solução aprovada nos critérios do projeto/)).toBeInTheDocument()
    expect(store.getState().architect[p.id].evaluated).toBe('2026-10-17')
    await user.click(screen.getByRole('button', { name: 'Abrir a revisão' }))
    expect(screen.getByRole('heading', { level: 2, name: /5\. Revisão/ })).toBeInTheDocument()
    for (const s of p.solutions) expect(screen.getByRole('heading', { name: s.title })).toBeInTheDocument()
    expect(screen.getAllByText('Obrigatório').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Não se aplica').length).toBeGreaterThan(0)
  })

  it('a ADR exige os sete campos, registra a autoavaliação e então mostra a resposta comentada', async () => {
    const user = userEvent.setup()
    const store = open(`/arquiteto/${p.id}?etapa=adr`)
    const submit = screen.getByRole('button', { name: 'Registrar a ADR e a autoavaliação' })
    expect(submit).toBeDisabled()
    expect(screen.getByRole('group', { name: /Autoavaliação \(não é correção automática\)/ })).toBeInTheDocument()
    for (const f of p.adr.fields) await user.type(screen.getByRole('textbox', { name: new RegExp(f.label) }), 'Texto do meu registro.')
    await user.click(screen.getAllByRole('checkbox')[0])
    expect(submit).toBeEnabled()
    await user.click(submit)
    const a = store.getState().architect[p.id]
    expect(a.adrDone).toBe('2026-10-17')
    expect(a.self[0]).toBe(1)
    expect(screen.getByRole('heading', { name: /Resposta comentada/ })).toBeInTheDocument()
  })

  it('projeto inexistente mostra o caminho de volta', () => {
    open('/arquiteto/nao-existe')
    expect(screen.getByRole('heading', { name: 'Projeto não encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver os projetos' })).toHaveAttribute('href', '/arquiteto')
  })
})
