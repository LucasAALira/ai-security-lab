import { ShieldX } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Botão de compra do mercado negro. Com saldo, a linha acende em âmbar; sem saldo, fica
 *  "Acesso negado · saldo insuficiente" em carmim apagado (desabilitado, mas legível) e diz
 *  quanto falta. `blocked` cobre outros impedimentos, como o limite de escudos. */
export function BuyButton({
  price,
  balance,
  onBuy,
  children,
  blocked,
  size = 'sm',
  className,
}: {
  price: number
  balance: number
  onBuy: () => void
  children: ReactNode
  blocked?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  if (blocked) {
    return (
      <Button size={size} variant="secondary" disabled className={className}>
        {blocked}
      </Button>
    )
  }
  const missing = price - balance
  if (missing > 0) {
    return (
      <Button size={size} disabled className={cn('gx-denied h-auto max-w-full min-h-9 shrink py-1.5 text-left leading-tight whitespace-normal', className)}>
        <ShieldX aria-hidden="true" />
        Acesso negado · saldo insuficiente
        <span className="sr-only">: faltam {formatNumber(missing)} moedas</span>
      </Button>
    )
  }
  return (
    <Button size={size} onClick={onBuy} className={cn('gx-buy', className)}>
      {children}
    </Button>
  )
}
