import { useEffect, useRef, type ReactNode } from 'react'

/** Caixa de abertura: ocupa a tela inteira antes de o santuário aparecer.
 *  Prende o foco enquanto está aberta e devolve para a página quando fecha, para quem navega pelo
 *  teclado ou por leitor de tela não cair atrás dela. */
export function Overlay({ labelledBy, describedBy, children }: { labelledBy: string; describedBy?: string; children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    caixa.current?.focus()
    const trava = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !caixa.current) return
      const focaveis = caixa.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
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
  }, [])

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-[color-mix(in_oklab,var(--background)_92%,#000)] p-4 sm:p-8">
      <div
        ref={caixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className="my-auto w-full max-w-4xl border border-[var(--line-strong)] bg-card p-5 shadow-2xl outline-none sm:p-8"
      >
        {children}
      </div>
    </div>
  )
}
