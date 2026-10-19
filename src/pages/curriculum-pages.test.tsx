import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AreasSection } from '@/components/home/AreasSection'
import { challengeIdsOf, lessons, submodules } from '@/data/curriculum'
import { challengeById } from '@/data/challenges'
import { progressContext } from '@/data/progress-context'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { AreaPage } from './AreaPage'
import { AreasPage } from './AreasPage'
import { ExplorePage } from './ExplorePage'
import { ModulePage } from './ModulePage'
import { SubmodulePage } from './SubmodulePage'

function open(path: string, store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 17, 12) })) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider store={store}>
        <Routes>
          <Route path="/" element={<AreasSection />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/areas/:area" element={<AreaPage />} />
          <Route path="/areas/:area/:module" element={<ModulePage />} />
          <Route path="/areas/:area/:module/:sub" element={<SubmodulePage />} />
          <Route path="/explorar" element={<ExplorePage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('áreas', () => {
  it('mostra as oito áreas, cada uma com progresso medido pelo conteúdo que existe', () => {
    open('/areas')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(8)
    const arq = screen.getByRole('link', { name: 'Arquitetura de Segurança' }).closest('li')!
    expect(within(arq).getByRole('progressbar')).toBeInTheDocument()
    expect(within(arq).getByText(/24 de 24 submódulos com conteúdo/)).toBeInTheDocument()
  })

  it('a página inicial traz os cards das áreas', () => {
    open('/')
    expect(screen.getByRole('heading', { name: 'Escolha por onde começar' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^Abrir a área/ })).toHaveLength(8)
  })

  it('a página da área lista os módulos com migalhas de pão', () => {
    open('/areas/web')
    expect(screen.getByRole('heading', { level: 1, name: /Segurança Web/ })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Você está em' })
    expect(within(nav).getByRole('link', { name: 'Áreas' })).toHaveAttribute('href', '/areas')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6)
  })

  it('área inexistente mostra erro com caminho de volta', () => {
    open('/areas/nao-existe')
    expect(screen.getByRole('heading', { name: 'Área não encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver as áreas' })).toHaveAttribute('href', '/areas')
  })
})

describe('módulo', () => {
  it('lista os submódulos com estado e explica que as recomendações não bloqueiam', () => {
    open('/areas/web/web-autenticacao')
    expect(screen.getByRole('heading', { level: 1, name: /Autenticação/ })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(5)
    expect(screen.getByText(/Nada aqui fica bloqueado/)).toBeInTheDocument()
  })

  it('o integrador do módulo leva à missão, ao desafio ou ao projeto do Arquiteto', () => {
    open('/areas/web/web-autenticacao')
    expect(screen.getByRole('link', { name: /Abrir o integrador/ })).toHaveAttribute('href', '/campanhas/checkout-outro-cliente/link-de-recuperacao')
    cleanup()
    open('/areas/arq/arq-oficina')
    expect(screen.getByRole('link', { name: /Abrir o integrador/ })).toHaveAttribute('href', '/arquiteto/loja-web-api')
    cleanup()
    open('/areas/api/api-integracoes')
    expect(screen.getByRole('link', { name: /Abrir o integrador/ })).toHaveAttribute('href', '/desafios?desafio=webhook-destino-livre')
  })

  it('módulo de outra área (endereço trocado) não abre', () => {
    open('/areas/api/web-autenticacao')
    expect(screen.getByRole('heading', { name: 'Módulo não encontrado' })).toBeInTheDocument()
  })

})

describe('submódulo', () => {
  const sample = submodules.find((s) => s.legacy === null && lessons[s.id])!
  const withChallenges = submodules.find((s) => s.legacy === null && !lessons[s.id] && challengeIdsOf(s.id).length > 0)
  const legacy = submodules.find((s) => s.legacy !== null)!

  it('submódulo com desafios lista as atividades e liga para o laboratório', () => {
    if (!withChallenges) return
    open(`/areas/${withChallenges.area}/${withChallenges.module}/${withChallenges.id}`)
    const ids = challengeIdsOf(withChallenges.id)
    for (const id of ids) {
      const c = challengeById(id)!
      expect(screen.getByRole('link', { name: new RegExp(`${c.title.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) })).toHaveAttribute('href', `/desafios?desafio=${id}`)
    }
  })

  it('submódulo clássico leva ao módulo da trilha, preservando o progresso anterior', () => {
    open(`/areas/${legacy.area}/${legacy.module}/${legacy.id}`)
    expect(screen.getByRole('link', { name: /Abrir o módulo na trilha/ })).toHaveAttribute('href', `/trilha/modulo/${legacy.legacy}`)
  })

  it('endereço com submódulo de outro módulo não abre', () => {
    open(`/areas/${sample.area}/outro-modulo/${sample.id}`)
    expect(screen.getByRole('heading', { name: 'Submódulo não encontrado' })).toBeInTheDocument()
  })

  it('aula existente pode ser marcada como lida uma única vez', async () => {
    const id = Object.keys(lessons)[0]
    if (!id) return
    const sub = submodules.find((s) => s.id === id)!
    const user = userEvent.setup()
    const store = open(`/areas/${sub.area}/${sub.module}/${sub.id}`)
    await user.click(screen.getByRole('button', { name: 'Marcar a aula como lida' }))
    expect(store.getState().lessons[id]).toBe('2026-10-17')
    expect(screen.queryByRole('button', { name: 'Marcar a aula como lida' })).toBeNull()
  })
})

describe('explorar', () => {
  it('filtra pelo endereço e mostra o total', () => {
    open('/explorar?q=token&tipo=desafio')
    expect(screen.getByRole('status')).toHaveTextContent(/resultado/)
    for (const badge of screen.getAllByText('desafio')) expect(badge).toBeInTheDocument()
  })

  it('consulta sem resultado oferece limpar a busca', async () => {
    const user = userEvent.setup()
    open('/explorar?q=zzzzqqqq')
    expect(screen.getByText('Nada encontrado.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Limpar a busca e os filtros' }))
    expect(screen.queryByText('Nada encontrado.')).toBeNull()
  })

  it('digitar atualiza os resultados', async () => {
    const user = userEvent.setup()
    open('/explorar')
    await user.type(screen.getByRole('searchbox', { name: /O que você quer estudar/ }), 'webview')
    expect(screen.getByRole('status')).toHaveTextContent(/para esta busca/)
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })
})
