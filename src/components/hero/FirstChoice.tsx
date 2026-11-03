import { useEffect, useRef } from 'react'
import { PathChooser } from './PathChooser'
import { heroEscolhido } from '@/lib/hero'
import { useProgress } from '@/state/ProgressProvider'

/** Primeira visita: antes de entrar no santuário, escolha um caminho.
 *  Aparece só enquanto ninguém escolheu; depois a troca fica na loja. */
export function FirstChoice() {
  const { state } = useProgress()
  const aberto = !heroEscolhido(state)
  const dialogo = useRef<HTMLDivElement>(null)

  // Prende o foco no diálogo e devolve para a página quando ele fecha.
  useEffect(() => {
    if (!aberto) return
    const anterior = document.activeElement as HTMLElement | null
    dialogo.current?.focus()
    const trava = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogo.current) return
      const focaveis = dialogo.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (!focaveis.length) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', trava)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', trava)
      document.body.style.overflow = overflow
      anterior?.focus?.()
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-[color-mix(in_oklab,var(--background)_92%,#000)] p-4 sm:p-8">
      <div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="escolha-titulo"
        aria-describedby="escolha-texto"
        tabIndex={-1}
        className="my-auto w-full max-w-5xl border border-[var(--line-strong)] bg-card p-5 shadow-2xl outline-none sm:p-8"
      >
        <p className="gx-inscription">Antes de entrar</p>
        <h1 id="escolha-titulo" className="gx-display mt-2 text-[26px] leading-tight sm:text-[34px]">
          Escolha o seu caminho
        </h1>
        <p id="escolha-texto" className="mt-2 max-w-prose text-sm text-muted-foreground">
          Seis arquétipos entram no santuário pela mesma porta. O caminho muda a sua figura ao lado da fogueira e nada mais: o estudo, o XP e as
          conquistas são os mesmos para todos, e dá para trocar quando quiser, de graça, na loja.
        </p>
        <div className="mt-6">
          <PathChooser confirmLabel="Entrar no santuário" />
        </div>
      </div>
    </div>
  )
}
