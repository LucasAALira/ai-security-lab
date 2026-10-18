import { useEffect, useRef, useState } from 'react'

/** Quanto dura a onda de "carregamento de dados de fogo" num medidor (igual ao CSS de .is-charging). */
export const CHARGE_MS = 1200

/** Fica `true` por um instante quando o valor sobe (nunca na primeira renderização nem quando desce).
 *  Os medidores usam isso para pulsar os blocos de luz quando o XP ou o progresso aumenta. */
export function useRise(value: number): boolean {
  const previous = useRef(value)
  const [charging, setCharging] = useState(false)
  useEffect(() => {
    const rose = value > previous.current
    previous.current = value
    if (!rose) return
    setCharging(true)
    const t = window.setTimeout(() => setCharging(false), CHARGE_MS)
    return () => window.clearTimeout(t)
  }, [value])
  return charging
}
