import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { progressContext } from '@/data/progress-context'
import { knightGear } from '@/lib/knight'
import { emptyState } from '@/lib/progress'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { KnightArmor } from '@/components/shop/KnightArmor'
import { KnightArt } from './KnightArt'

const desenhar = (xp: number, estado = emptyState()) =>
  render(
    <svg data-testid="fig">
      <KnightArt gear={knightGear(estado, xp)} />
    </svg>,
  )

afterEach(() => vi.restoreAllMocks())

describe('figura do cavaleiro', () => {
  it('o andarilho não veste placa nenhuma; o cavaleiro completo veste todas', () => {
    const { container, unmount } = desenhar(0)
    const placas = (c: ParentNode) => c.querySelectorAll('.knight-cloak, .knight-visor').length
    expect(placas(container)).toBe(0)
    unmount()

    const s = emptyState()
    const completo = { ...s, shop: { ...s.shop, relics: ['ember'], owned: ['ashes'] }, lifetime: { ...s.lifetime, shields: 1 } }
    const { container: c2 } = desenhar(7000, completo)
    expect(c2.querySelector('.knight-cloak'), 'manto').not.toBeNull()
    expect(c2.querySelector('.knight-visor'), 'viseira do elmo').not.toBeNull()
    expect(c2.querySelector('.knight-glint'), 'lampejo da lâmina').not.toBeNull()
  })

  it('anima por padrão, para quando a aba some e obedece quem pede figura parada', () => {
    const { container, unmount } = desenhar(0)
    const raiz = container.querySelector('svg > g')!
    expect(raiz.classList.contains('knight')).toBe(true)
    expect(raiz.getAttribute('data-paused')).toBeNull()
    expect(container.querySelector('.knight-breathe')).not.toBeNull()
    unmount()

    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    const { container: c2 } = desenhar(0)
    expect(c2.querySelector('svg > g')!.getAttribute('data-paused')).toBe('true')
  })

  it('a folha de estilo pausa e desliga o movimento quando é preciso', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/components/gothic/knight.css'), 'utf8')
    expect(css).toContain('prefers-reduced-motion')
    expect(css).toContain('[data-paused="true"]')
    // Nada de piscar rápido: toda animação dura mais de 2 segundos.
    const tempos = [...css.matchAll(/animation:[^;]*?([\d.]+)s/g)].map((m) => Number(m[1]))
    expect(tempos.length).toBeGreaterThan(3)
    expect(Math.min(...tempos)).toBeGreaterThan(2)
  })
})

describe('armadura na loja', () => {
  function abrir(xp = 0) {
    const store = createProgressStore({ storage: null, ctx: progressContext, now: () => new Date(2026, 10, 2, 12) })
    render(
      <MemoryRouter>
        <ProgressProvider store={store}>
          <KnightArmor />
        </ProgressProvider>
      </MemoryRouter>,
    )
    return xp
  }

  it('lista cada peça com o caminho para consegui-la', () => {
    abrir()
    expect(screen.getByRole('heading', { level: 2, name: 'A armadura do cavaleiro' })).toBeInTheDocument()
    const itens = screen.getAllByRole('listitem')
    expect(itens.length).toBe(9)
    // a escolha de caminho vem junto: dez arquétipos e três trajes
    expect(screen.getAllByRole('radio', { name: /Traje/ }).length).toBe(3)
    expect(screen.getAllByRole('radio').length).toBe(13)
    expect(screen.getByRole('radio', { name: 'Cavaleiro errante' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Botas de couro')).toBeInTheDocument()
    expect(screen.getByText('250 XP acumulados')).toBeInTheDocument()
    expect(screen.getByText('Compre uma relíquia na loja')).toBeInTheDocument()
    // Quem está começando só tem a faca.
    expect(screen.getAllByText(/— conquistada$/).length).toBe(1)
    expect(screen.getByRole('img', { name: /Cavaleiro errante Andarilho, de perfil e em guarda, com 1 de 9 peças/ })).toBeInTheDocument()
  })
})
