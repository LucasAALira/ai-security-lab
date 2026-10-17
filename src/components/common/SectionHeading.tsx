import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  eyebrow: string
  title: ReactNode
  id?: string
  /** Texto ou controle alinhado à direita (contadores de progresso). */
  aside?: ReactNode
  description?: ReactNode
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function SectionHeading({ eyebrow, title, id, aside, description, level: Level = 'h2', className }: Props) {
  return (
    <div className={cn('flex items-start justify-between gap-5', className)}>
      <div className="min-w-0">
        <div className="gx-inscription">{eyebrow}</div>
        <Level id={id} className={cn('mt-2.5 mb-1', Level === 'h3' ? 'text-xl font-semibold' : 'text-[26px] leading-tight sm:text-[32px]')}>
          {title}
        </Level>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {aside ? <div className="mt-6 shrink-0 text-right text-xs font-semibold text-primary tabular-nums">{aside}</div> : null}
    </div>
  )
}
