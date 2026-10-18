import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Medidor de RPG com o valor sempre escrito: a barra é apoio, o número é a informação. */
export function Gauge({
  value,
  max,
  label,
  valueText,
  children,
  className,
  height = 'h-2.5',
}: {
  value: number
  max: number
  /** Nome acessível do medidor. */
  label: string
  /** Texto lido pelo leitor de tela (por exemplo "120 de 300 XP"). */
  valueText: string
  /** Legenda visível, acima da barra. */
  children?: ReactNode
  className?: string
  height?: string
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <div className={cn('grid gap-1.5', className)}>
      {children}
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText} className={cn('gx-gauge', height)}>
        <div className="gx-gauge-fill" style={{ transform: `translateX(-${100 - pct}%)` }} />
      </div>
    </div>
  )
}
