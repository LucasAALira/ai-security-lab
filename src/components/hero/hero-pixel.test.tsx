import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { montarPersonagem } from '@/components/pixel/montar'
import { spriteProblems, spriteRuns, spriteSize } from '@/components/pixel/sprite'
import { progressContext } from '@/data/progress-context'
import { HEROIS } from '@/data/herois'
import { heroEscolhido, heroOf, trajeOf } from '@/lib/hero'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { FirstChoice } from './FirstChoice'

const loja = () => createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 10, 3, 12) })

function abrir(store = loja()) {
  render(
    <MemoryRouter>
      <ProgressProvider store={store}>
        <FirstChoice />
      </ProgressProvider>
    </MemoryRouter>,
  )
  return store
}

describe('sprites dos personagens', () => {
  it('todo traje de todo caminho monta um sprite válido', () => {
    for (const h of HEROIS) {
      for (const t of h.trajes) {
        const sprite = montarPersonagem(`${h.id}`, t.pecas, t.palette)
        expect(spriteProblems(sprite), `${h.nome} / ${t.nome}`).toEqual([])
        expect(spriteSize(sprite)).toEqual({ width: 40, height: 56 })
        // tem desenho de verdade, não uma grade vazia
        expect(spriteRuns(sprite).length, `${h.nome} / ${t.nome}`).toBeGreaterThan(60)
      }
    }
  })

  it('cada caminho tem silhueta ou paleta própria', () => {
    const assinaturas = HEROIS.map((h) => {
      const t = h.trajes[0]
      return JSON.stringify([t.pecas, t.palette])
    })
    expect(new Set(assinaturas).size).toBe(HEROIS.length)
  })

  it('os três trajes de um caminho são diferentes entre si', () => {
    for (const h of HEROIS) {
      const desenhos = h.trajes.map((t) => montarPersonagem(h.id, t.pecas, t.palette).rows.join('|') + JSON.stringify(t.palette))
      expect(new Set(desenhos).size, h.nome).toBe(3)
    }
  })

  it('recusa peça inexistente em vez de desenhar errado', () => {
    const t = HEROIS[0].trajes[0]
    expect(() => montarPersonagem('x', { ...t.pecas, arma: 'raio-laser' }, t.palette)).toThrow(/arma desconhecida/)
    expect(() => montarPersonagem('x', { ...t.pecas, capa: 'invisivel' }, t.palette)).toThrow(/capa desconhecida/)
  })
})

describe('escolha do caminho na primeira visita', () => {
  it('abre para quem nunca escolheu e mostra os dez', () => {
    abrir()
    const dialogo = screen.getByRole('dialog')
    expect(dialogo).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('heading', { level: 1, name: 'Escolha o seu caminho' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio', { name: /errante|Duelista|Bárbaro|Ladrão|Astrólogo|Clérigo|Espadachim|Prisioneiro|Penitente|Sobrevivente/ }).length).toBeGreaterThanOrEqual(10)
  })

  it('escolher e confirmar guarda o caminho e fecha a tela', async () => {
    const user = userEvent.setup()
    const store = abrir()
    expect(heroEscolhido(store.getState())).toBe(false)
    await user.click(screen.getByRole('radio', { name: 'Penitente' }))
    await user.click(screen.getByRole('radio', { name: 'Traje II' }))
    await user.click(screen.getByRole('button', { name: /Entrar no santuário/ }))
    const s = store.getState()
    expect(heroOf(s).id).toBe('penitente')
    expect(trajeOf(s)).toBe(1)
    expect(heroEscolhido(s)).toBe(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('não abre de novo para quem já escolheu', () => {
    const store = loja()
    const atual = store.getState()
    store.replace({ ...atual, prefs: { ...atual.prefs, hero: 'ladrao' } })
    abrir(store)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('a ficha descreve o equipamento do caminho em foco', async () => {
    const user = userEvent.setup()
    abrir()
    await user.click(screen.getByRole('radio', { name: 'Astrólogo' }))
    expect(screen.getByText('cajado arcano')).toBeInTheDocument()
    expect(screen.getByText('manto fechado')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Astrólogo, Traje I/ })).toBeInTheDocument()
  })
})
