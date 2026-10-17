import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { isNativeApp } from '@/lib/native'
import { LogoMark } from './PageVeil'

/** Duração total da tela de abertura do app, contada desde o toque no ícone (inclui o carregamento). */
export const SPLASH_MS = 2000
const FADE_MS = 260

/** No app Android ela sempre aparece; no navegador, só com `?splash` no endereço (para testar). */
export const splashEnabled = (search = typeof window === 'undefined' ? '' : window.location.search) => isNativeApp() || new URLSearchParams(search).has('splash')

/**
 * Tela de abertura do app: o brasão, o nome e uma linha de carregamento, por 2 segundos no total.
 * Um toque pula. O tempo conta desde a abertura (performance.now), então o carregamento real do app
 * já entra nos 2 segundos. Com "reduzir movimento", tudo fica parado e some sem fade.
 */
export function AppSplash({ enabled = splashEnabled(), total = SPLASH_MS }: { enabled?: boolean; total?: number }) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'show' | 'fade' | 'gone'>(enabled ? 'show' : 'gone')
  // O que falta dos 2 segundos quando o React monta (o carregamento do app já consumiu parte).
  const [left] = useState(() => Math.max(300, total - (typeof performance === 'undefined' ? 0 : performance.now())))

  useEffect(() => {
    if (phase !== 'show') return
    // O fade de saída faz parte dos 2 segundos: some exatamente no fim.
    const t = window.setTimeout(() => setPhase(reduced ? 'gone' : 'fade'), reduced ? left : Math.max(0, left - FADE_MS))
    return () => window.clearTimeout(t)
  }, [phase, reduced, left])

  useEffect(() => {
    if (phase !== 'fade') return
    const t = window.setTimeout(() => setPhase('gone'), FADE_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  if (phase === 'gone') return null
  const skip = () => setPhase(reduced ? 'gone' : 'fade')
  return (
    <div
      role="status"
      aria-label="Abrindo o AI Security Lab"
      data-testid="app-splash"
      onClick={skip}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') && skip()}
      tabIndex={-1}
      className="gx-splash"
      data-phase={phase}
      style={{ ['--splash-ms' as string]: `${left}ms`, ['--fade-ms' as string]: `${FADE_MS}ms` }}
    >
      <div className="grid justify-items-center gap-5 px-6 text-center">
        <LogoMark className="gx-splash-mark !size-28" />
        <div>
          <p className="gx-gothic text-[34px] leading-none text-[var(--ivory)]">AI Security Lab</p>
          <p className="mt-2 font-display text-[11px] font-semibold tracking-[0.18em] text-primary">Biblioteca dos Condenados</p>
        </div>
        <span className="gx-splash-track" aria-hidden="true">
          <span className="gx-splash-fill" />
        </span>
        <p className="text-[12px] text-muted-foreground">Toque para pular</p>
      </div>
    </div>
  )
}
