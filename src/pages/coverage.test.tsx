import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { frameworks } from '@/data/frameworks'
import { CoveragePage } from './CoveragePage'

function open(search = '') {
  render(
    <MemoryRouter initialEntries={[`/cobertura${search}`]}>
      <CoveragePage />
    </MemoryRouter>,
  )
}

const rowOf = (item: string) => screen.getByText(item, { selector: 'span.font-mono' }).closest('tr') as HTMLElement

describe('página de cobertura de frameworks', () => {
  it('lista todas as fontes registradas com edição e data de revisão', () => {
    open()
    const registro = screen.getByRole('table', { name: /Frameworks e normas registrados/ })
    expect(within(registro).getAllByRole('row')).toHaveLength(frameworks.length + 1)
    expect(within(registro).getAllByText('17/10/2026').length).toBe(frameworks.length)
  })

  it('a matriz mostra o que cada item trabalha e assume as lacunas', () => {
    open('?framework=owasp-top10')
    const a03 = rowOf('A03')
    expect(within(a03).getAllByRole('link').length).toBeGreaterThan(0)
    expect(within(rowOf('A10')).getByText(/Sem conteúdo ainda/)).toBeInTheDocument()
  })

  it('"só as lacunas" esconde o que tem conteúdo', () => {
    open('?framework=owasp-top10&lacunas=1')
    expect(screen.getByText('A10', { selector: 'span.font-mono' })).toBeInTheDocument()
    expect(screen.queryByText('A03', { selector: 'span.font-mono' })).toBeNull()
  })

  it('o filtro de tipo restringe as fontes e avisa que o "sem conteúdo" é do recorte', () => {
    open('?framework=owasp-top10&tipo=dossi%C3%AA')
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(/sem conteúdo deste recorte/)
    const a03 = rowOf('A03')
    for (const badge of within(a03).queryAllByText(/^(desafio|missão|dossiê)$/)) expect(badge).toHaveTextContent('dossiê')
  })

  it('filtros inválidos no endereço voltam para "todos"', () => {
    open('?framework=nao-existe&area=xyz&tipo=outro')
    expect(screen.getByRole('status')).not.toHaveTextContent('neste recorte')
    expect(screen.getAllByRole('region').length).toBeGreaterThan(frameworks.length - 1)
  })

  it('frameworks sem lista de itens (só referência) não viram linhas vazias', () => {
    open()
    expect(screen.queryByRole('table', { name: /Itens de ASVS/ })).toBeNull()
  })
})
