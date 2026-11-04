import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { modules } from '@/data/modules'
import { progressContext } from '@/data/progress-context'
import { MODULO_TUTORIAL } from '@/lib/caminhos'
import { emptyModule, type StudyState } from '@/lib/progress'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { Abertura } from './Abertura'

/* A abertura é a primeira coisa que alguém vê, e a única parte do site que bloqueia o resto.
   Estes testes cobrem as três telas, a saída por "pular" e, principalmente, a garantia de que quem
   já estudava não cai numa tela de boas-vindas no meio do curso. */

function abrir(mudar: (s: StudyState) => StudyState = (s) => s) {
  const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 10, 4, 12) })
  store.replace(mudar(store.getState()))
  render(
    <MemoryRouter>
      <ProgressProvider store={store}>
        <Abertura />
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

const comHeroi = (s: StudyState): StudyState => ({ ...s, prefs: { ...s.prefs, hero: 'cavaleiro' } })
const moduloFeito = () => ({ ...emptyModule(), reads: [true, true, true], research: true, practice: true, solved: [true, true] })

describe('abertura do santuário', () => {
  it('sem caminho escolhido, pede o caminho antes de tudo', () => {
    abrir()
    expect(screen.getByRole('heading', { level: 1, name: 'Escolha o seu caminho' })).toBeInTheDocument()
  })

  it('com o caminho escolhido, abre o tutorial na primeira matéria de Fundamentos', () => {
    abrir(comHeroi)
    const m = modules[MODULO_TUTORIAL]
    expect(screen.getByRole('heading', { level: 1, name: m.title })).toBeInTheDocument()
    expect(m.category).toBe('Fundamentos')
    expect(screen.getByText(m.parts[0])).toBeInTheDocument()
  })

  it('cada etapa lida conta como leitura do módulo, e a última leva à questão', async () => {
    const user = userEvent.setup()
    const store = abrir(comHeroi)
    await user.click(screen.getByRole('button', { name: /Continuar/ }))
    expect(store.getState().modules[MODULO_TUTORIAL].reads[0]).toBe(true)
    await user.click(screen.getByRole('button', { name: /Continuar/ }))
    await user.click(screen.getByRole('button', { name: /Ir para a questão/ }))
    expect(store.getState().modules[MODULO_TUTORIAL].reads).toEqual([true, true, true])
    expect(screen.getByRole('heading', { level: 2, name: 'Uma questão para fechar' })).toBeInTheDocument()
  })

  it('pular registra a saída e passa às três trilhas, sem perder nada', async () => {
    const user = userEvent.setup()
    const store = abrir(comHeroi)
    await user.click(screen.getByRole('button', { name: /Pular o tutorial/ }))
    expect(store.getState().prefs.tutorial).toBe('pulado')
    expect(screen.getByRole('heading', { level: 1, name: 'Escolha por onde começar' })).toBeInTheDocument()
  })

  it('as três trilhas são os temas depois de Fundamentos', () => {
    abrir((s) => ({ ...comHeroi(s), prefs: { ...comHeroi(s).prefs, tutorial: 'feito' } }))
    const opcoes = screen.getAllByRole('radio').map((b) => b.textContent)
    expect(opcoes.length).toBe(3)
    for (const nome of ['Ataques e defesa', 'Governança', 'Regulação']) {
      expect(opcoes.some((t) => t?.includes(nome)), nome).toBe(true)
    }
  })

  it('escolher uma trilha guarda a escolha', async () => {
    const user = userEvent.setup()
    const store = abrir((s) => ({ ...comHeroi(s), prefs: { ...comHeroi(s).prefs, tutorial: 'feito' } }))
    await user.click(screen.getByRole('radio', { name: /Governança/ }))
    await user.click(screen.getByRole('button', { name: /Começar por/ }))
    expect(store.getState().prefs.caminho).toBe('governanca')
  })

  it('com a trilha escolhida, a abertura some', () => {
    const { container } = render(<div />)
    abrir((s) => ({ ...comHeroi(s), prefs: { ...comHeroi(s).prefs, tutorial: 'feito', caminho: 'ataques' } }))
    expect(container.textContent).toBe('')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('quem já estudava não vê a abertura, mesmo sem nada registrado nela', () => {
    abrir((s) => ({ ...comHeroi(s), modules: { ...s.modules, 1: moduloFeito() } }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('quem já concluiu a própria matéria do tutorial também não o vê de novo', () => {
    abrir((s) => ({ ...comHeroi(s), modules: { ...s.modules, [MODULO_TUTORIAL]: moduloFeito() } }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
