import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { AreaPage } from './AreaPage'
import { AreasPage } from './AreasPage'
import { ModulePage } from './ModulePage'
import { SubmodulePage } from './SubmodulePage'

/* Hoje todo submódulo tem conteúdo. Estes testes simulam uma área ainda sem aulas (Arquitetura)
   e um módulo sem integrador para garantir que o que está planejado nunca finge progresso. */

vi.mock('@/data/curriculum/lessons', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/data/curriculum/lessons')>()
  return { lessons: Object.fromEntries(Object.entries(real.lessons).filter(([id]) => !id.startsWith('arq-'))) }
})

vi.mock('@/data/curriculum/integrators', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/data/curriculum/integrators')>()
  const rest = { ...real.integrators }
  delete rest['web-autenticacao']
  return { integrators: rest }
})

function open(path: string) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 17, 12) })
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider store={store}>
        <Routes>
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/areas/:area" element={<AreaPage />} />
          <Route path="/areas/:area/:module" element={<ModulePage />} />
          <Route path="/areas/:area/:module/:sub" element={<SubmodulePage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  )
}

describe('conteúdo planejado', () => {
  it('uma área sem conteúdo não finge progresso', () => {
    open('/areas')
    const arq = screen.getByRole('link', { name: 'Arquitetura de Segurança' }).closest('li')!
    expect(within(arq).getByText(/Nenhuma atividade obrigatória ainda/)).toBeInTheDocument()
    expect(within(arq).queryByRole('progressbar')).toBeNull()
    expect(within(arq).getByText(/0 de 24 submódulos com conteúdo, 24 planejados/)).toBeInTheDocument()
  })

  it('a área lista o módulo vazio como planejado', () => {
    open('/areas/arq')
    expect(screen.getAllByText(/Planejado: nenhum submódulo tem conteúdo ainda/).length).toBeGreaterThan(0)
  })

  it('módulo sem submódulo com conteúdo não aparece como concluído', () => {
    open('/areas/arq/arq-modelagem')
    expect(screen.getByText(/Sem conteúdo ainda: o checkpoint abre/)).toBeInTheDocument()
    expect(screen.queryByText(/Concluído: todos os submódulos/)).toBeNull()
  })

  it('submódulo planejado diz que não conta no progresso e não oferece "marcar como lida"', () => {
    open('/areas/arq/arq-modelagem/arq-diagramas')
    expect(screen.getByRole('heading', { name: 'Planejado' })).toBeInTheDocument()
    expect(screen.getByText(/não conta em nenhuma porcentagem/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Marcar a aula/ })).toBeNull()
  })

  it('módulo sem integrador diz que ele está planejado', () => {
    open('/areas/web/web-autenticacao')
    expect(screen.getByText(/Planejado\. Ainda não há um desafio que reúna/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Abrir o integrador/ })).toBeNull()
  })
})
