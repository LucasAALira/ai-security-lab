import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** Duração total da tela de carregamento na troca de página. Curta de propósito: é uma pausa, não uma espera. */
export const VEIL_MS = 480

/** O brasão do site recolorido no metal do tema (o PNG serve de máscara). */
export function LogoMark({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('gx-veil-mark block', className)} />
}

/**
 * Tela de carregamento rápida, como nos jogos: o brasão aparece por um instante a cada troca de página.
 * Não bloqueia nada: a página nova já está montada por baixo, cliques passam (pointer-events: none) e o
 * leitor de tela não a anuncia. Com "reduzir movimento" ela não aparece.
 */
export function PageVeil({ page }: { page: string }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState<number | null>(null)
  const first = useRef(true)
  const count = useRef(0)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduced) return
    count.current += 1
    setShown(count.current)
    const timer = window.setTimeout(() => setShown(null), VEIL_MS)
    return () => window.clearTimeout(timer)
  }, [page, reduced])

  if (shown === null) return null
  return (
    <div key={shown} className="gx-veil" aria-hidden="true" data-testid="page-veil" style={{ ['--veil-ms' as string]: `${VEIL_MS}ms` }}>
      <div className="grid justify-items-center">
        <LogoMark />
        <span className="gx-veil-line" />
      </div>
    </div>
  )
}

/** Enquanto o código de uma página ainda está chegando: o mesmo brasão, com um texto que o leitor de tela lê. */
export function LoadingSigil() {
  return (
    <div role="status" className="grid min-h-[40vh] place-items-center py-16">
      <div className="grid justify-items-center gap-4">
        <LogoMark className="size-20 motion-safe:animate-pulse" />
        <p className="gx-inscription">Abrindo os arquivos…</p>
      </div>
    </div>
  )
}
