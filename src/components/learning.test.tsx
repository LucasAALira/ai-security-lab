import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AchievementGallery } from '@/components/gamification/AchievementGallery'
import { NextObjective } from '@/components/gamification/NextObjective'
import { CodeChallenge } from '@/components/challenge/CodeChallenge'
import { Flashcard } from '@/components/study/Flashcard'
import { QuestionCard } from '@/components/study/QuestionCard'
import { challengeById } from '@/data/challenges'
import { progressContext } from '@/data/progress-context'
import { medals, emptyState } from '@/lib/progress'
import { ProgressProvider, useProgress } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'

function makeStore() {
  return createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 9, 16, 12) })
}

function Gallery() {
  const { derived } = useProgress()
  return <AchievementGallery medals={derived.medals} empty="vazio" />
}

function wrap(ui: React.ReactNode, store = makeStore()) {
  return { store, ...render(<MemoryRouter><ProgressProvider store={store}>{ui}</ProgressProvider></MemoryRouter>) }
}

describe('QuestionCard', () => {
  const props = { number: 1, title: 'Qual é a certa?', options: ['A', 'B', 'C', 'D'], correct: 2, feedback: ['fa', 'fb', 'fc', 'fd'], hint: 'pense', solved: false }

  it('mostra o motivo do erro, deixa tentar de novo e trava no acerto', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<QuestionCard {...props} onAnswer={onAnswer} />)
    await user.click(screen.getByLabelText(/^B\./))
    await user.click(screen.getByRole('button', { name: 'Conferir' }))
    expect(onAnswer).toHaveBeenLastCalledWith(1, false)
    expect(screen.getByText(/Ainda não/)).toBeInTheDocument()
    expect(screen.getByText(/fb/)).toBeInTheDocument()
    expect(screen.getByText(/não tira XP/)).toBeInTheDocument()

    await user.click(screen.getByLabelText(/^C\./))
    await user.click(screen.getByRole('button', { name: 'Conferir de novo' }))
    expect(onAnswer).toHaveBeenLastCalledWith(2, true)
    expect(screen.getByRole('button', { name: /Acerto registrado/ })).toBeDisabled()
    expect(screen.getByText('Correta')).toBeInTheDocument()
  })

  it('a dica abre e fecha sem enviar resposta', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(<QuestionCard {...props} onAnswer={onAnswer} />)
    await user.click(screen.getByRole('button', { name: 'Dica' }))
    expect(screen.getByText('pense')).toBeInTheDocument()
    expect(onAnswer).not.toHaveBeenCalled()
  })

  it('questão já acertada abre travada, com a resposta certa', () => {
    render(<QuestionCard {...props} solved onAnswer={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Acerto registrado/ })).toBeDisabled()
    expect(screen.getByText(/fc/)).toBeInTheDocument()
  })

  it('não permite responder quando está bloqueada', () => {
    render(<QuestionCard {...props} disabled disabledReason="bloqueado" onAnswer={vi.fn()} />)
    expect(screen.getByText('bloqueado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conferir' })).toBeDisabled()
  })
})

describe('Flashcard', () => {
  it('só revela a resposta depois do botão e permite marcar como sabido', async () => {
    const user = userEvent.setup()
    const onMark = vi.fn()
    render(<Flashcard front="Pergunta?" back="Resposta!" known={false} onMark={onMark} />)
    expect(screen.queryByText('Resposta!')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Mostrar resposta/ }))
    expect(screen.getByText('Resposta!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Já sei/ }))
    expect(onMark).toHaveBeenCalledWith(true)
  })
})

describe('Galeria de conquistas', () => {
  it('lista as 8 conquistas iniciais e esconde a secreta até ser desbloqueada', () => {
    wrap(<Gallery />)
    for (const nome of ['Primeira Chama', 'Explorador de Falhas', 'Guardião das APIs', 'Código Protegido', 'Sem Ajuda', 'Persistência', 'Mestre do Módulo']) {
      expect(screen.getByText(nome)).toBeInTheDocument()
    }
    expect(screen.queryByText('Além do Óbvio')).not.toBeInTheDocument()
    expect(screen.getByText('Conquista secreta')).toBeInTheDocument()
    // o texto da regra também não pode vazar
    const secret = medals(emptyState(), progressContext).find((m) => m.secret)!
    expect(secret.masked).toBe(true)
    expect(secret.name).not.toMatch(/Além/)
  })

  it('abre os detalhes ao clicar e fecha com Esc', async () => {
    const user = userEvent.setup()
    wrap(<Gallery />)
    await user.click(screen.getByRole('button', { name: /Primeira Chama/ }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('Ainda não obtida')).toBeInTheDocument()
    expect(within(dialog).getByText(/Não há estatística de raridade/)).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Próximo objetivo', () => {
  it('aponta a primeira aula quando nada foi feito', () => {
    wrap(<NextObjective />)
    expect(screen.getByRole('complementary', { name: 'Próximo objetivo' })).toHaveTextContent(/3 etapas da aula/)
    expect(screen.getByRole('link', { name: /Continuar/ })).toHaveAttribute('href', '/modulo/0')
  })
})

describe('CodeChallenge', () => {
  const id = 'saida-no-dom'
  const spec = challengeById(id)!

  it('a dica impede o "Sem Ajuda" da tentativa; repetir sem dica conquista, sem somar XP de novo', async () => {
    const user = userEvent.setup()
    const { store } = wrap(<CodeChallenge id={id} />)

    await user.click(screen.getByRole('button', { name: 'Dica' }))
    expect(store.getState().challenges[id].run.hints[0]).toBe(true)
    expect(screen.getByLabelText(/Dicas desta tentativa/)).toBeInTheDocument()

    const solve = async () => {
      await user.click(screen.getByRole('button', { name: new RegExp(`^Linha ${spec.vulnerable[0] + 1}\\b`) }))
      await user.click(screen.getByRole('button', { name: 'Conferir linhas' }))
      await user.click(screen.getByLabelText(new RegExp(`^${'ABCD'[spec.fix]}\\.`)))
      await user.click(screen.getByRole('button', { name: 'Conferir correção' }))
    }
    await solve()
    expect(screen.getByLabelText('Resultado do desafio')).toHaveTextContent(/1 dica/)
    expect(store.getState().challenges[id].helpless).toBe(false)
    expect(store.getState().badges['sem-ajuda']).toBeUndefined()

    const xpDepois = medals(store.getState(), progressContext)
    expect(xpDepois.find((m) => m.id === 'sem-ajuda')?.unlocked).toBe(false)

    await user.click(screen.getByRole('button', { name: /Repetir desafio/ }))
    expect(store.getState().challenges[id].run.hints).toEqual([false, false, false])
    await solve()
    expect(store.getState().challenges[id].helpless).toBe(true)
    expect(store.getState().badges['sem-ajuda']).toBeTruthy()
  })

  it('linha errada mostra feedback e não conta como acerto', async () => {
    const user = userEvent.setup()
    const { store } = wrap(<CodeChallenge id={id} />)
    await user.click(screen.getByRole('button', { name: /^Linha 1\b/ }))
    await user.click(screen.getByRole('button', { name: 'Conferir linhas' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/Ainda não/)
    expect(store.getState().challenges[id].identified).toBe(false)
    expect(store.getState().challenges[id].misses).toBe(1)
  })

  it('módulo bloqueado: botões desabilitados e nada é registrado', async () => {
    wrap(<CodeChallenge id="modelo-sem-verificacao" />)
    expect(screen.getByText(/ainda bloqueado na trilha/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dica' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Conferir linhas' })).toBeDisabled()
  })
})
