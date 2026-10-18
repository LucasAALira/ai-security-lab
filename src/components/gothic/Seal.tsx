import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Selo de cera: o sinal de bloqueio da Biblioteca. Desenho próprio. O selo nunca aparece sozinho:
   o requisito para abrir vem sempre escrito ao lado (o símbolo é decorativo). */

const WAX = 'M24 3 28.3 5.3 33.1 5.1 36 9 40.4 10.9 41.3 15.7 44.5 19.3 43.2 24 44.5 28.7 41.3 32.3 40.4 37.1 36 39 33.1 42.9 28.3 42.7 24 45 19.7 42.7 14.9 42.9 12 39 7.6 37.1 6.7 32.3 3.5 28.7 4.8 24 3.5 19.3 6.7 15.7 7.6 10.9 12 9 14.9 5.1 19.7 5.3Z'

export function SealMark({ tone = 'ember', className }: { tone?: 'ember' | 'violet'; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('gx-seal', tone === 'violet' && 'is-violet', className)}>
      <svg viewBox="0 0 48 48" focusable="false">
        <path d={WAX} fill="var(--seal)" stroke="color-mix(in oklab, var(--seal) 60%, black)" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="14.5" fill="none" stroke="color-mix(in oklab, var(--seal) 55%, white)" strokeOpacity="0.45" strokeWidth="1" />
        <circle cx="24" cy="24" r="12" fill="color-mix(in oklab, var(--seal) 85%, black)" />
        {/* fechadura: o mesmo vocabulário do brasão do site */}
        <circle cx="24" cy="21.5" r="3.6" fill="color-mix(in oklab, var(--seal) 35%, #f2c46d)" />
        <path d="M22.2 23.5 L21 30.5 H27 L25.8 23.5 Z" fill="color-mix(in oklab, var(--seal) 35%, #f2c46d)" />
        <path d="M14 17 A11 11 0 0 1 20 12.6" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/** Bloqueio com o requisito escrito. `title` diz o que está fechado; `children`, o que falta para abrir. */
export function Seal({ title, children, tone = 'ember', className }: { title: ReactNode; children: ReactNode; tone?: 'ember' | 'violet'; className?: string }) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <SealMark tone={tone} />
      <div className="min-w-0 pt-0.5">
        <p className="font-display text-[15px] font-semibold">{title}</p>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
