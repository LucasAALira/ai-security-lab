import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const SPARKS = [
  { x: '-14px', d: 0 },
  { x: '9px', d: 60 },
  { x: '-4px', d: 120 },
  { x: '16px', d: 40 },
  { x: '-20px', d: 160 },
  { x: '3px', d: 220 },
]

/**
 * Brasas que sobem uma vez quando `value` aumenta (XP recebido). Seis faíscas, menos de um segundo,
 * sem repetir ao recarregar a página e sem nada com "reduzir movimento".
 */
export function EmberBurst({ value }: { value: number }) {
  const reduced = useReducedMotion()
  const previous = useRef(value)
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    const before = previous.current
    previous.current = value
    if (value > before && !reduced) setBurst((n) => n + 1)
  }, [value, reduced])

  useEffect(() => {
    if (!burst) return
    const t = window.setTimeout(() => setBurst(0), 1200)
    return () => window.clearTimeout(t)
  }, [burst])

  if (!burst) return null
  return (
    <span key={burst} aria-hidden="true" data-testid="ember-burst" className="pointer-events-none absolute inset-0 overflow-visible">
      {SPARKS.map((s, i) => (
        <span key={i} className="gx-ember" style={{ ['--x' as string]: s.x, ['--d' as string]: `${s.d}ms` }} />
      ))}
    </span>
  )
}
