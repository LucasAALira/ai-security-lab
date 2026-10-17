import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

/* Brasão de área: janela em arco ogival com moldura dupla de bronze e um campo na "tintura" da área.
   Cada área tem a sua cor de campo e o seu símbolo; o nome sempre aparece ao lado (o brasão é decorativo). */

export const AREA_TINCTURES: Record<string, string> = {
  web: '#27405e',
  api: '#2c4a36',
  ia: '#45325f',
  mobile: '#5a2a26',
  supply: '#3a3631',
  arq: '#5a4520',
  gov: '#36404d',
}

const ARCH = 'M4 54 V22 C4 12 12 5 24 2 C36 5 44 12 44 22 V54 Z'
const INNER = 'M8.5 50 V23 C8.5 15 14.5 9.5 24 7 C33.5 9.5 39.5 15 39.5 23 V50 Z'

export function Crest({ area, icon: Icon, className }: { area: string; icon: LucideIcon; className?: string }) {
  const id = useId().replace(/:/g, '')
  const field = AREA_TINCTURES[area] ?? '#3a3631'
  return (
    <span aria-hidden="true" className={cn('relative inline-grid h-14 w-12 shrink-0 place-items-center', className)}>
      <svg viewBox="0 0 48 56" className="absolute inset-0 size-full" focusable="false">
        <defs>
          <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="color-mix(in oklab, var(--bronze) 70%, white)" />
            <stop offset="0.55" stopColor="var(--bronze)" />
            <stop offset="1" stopColor="var(--bronze-deep)" />
          </linearGradient>
          <radialGradient id={`${id}f`} cx="0.5" cy="0.3" r="0.8">
            <stop offset="0" stopColor={`color-mix(in oklab, ${field} 70%, white)`} />
            <stop offset="1" stopColor={`color-mix(in oklab, ${field} 80%, black)`} />
          </radialGradient>
        </defs>
        <path d={ARCH} fill={`url(#${id}m)`} stroke="#1a120b" strokeWidth="1" />
        <path d={INNER} fill={`url(#${id}f)`} stroke="#1a120b" strokeOpacity="0.6" strokeWidth="1" />
        {/* chumbo do vitral: duas linhas finas */}
        <path d="M24 7 V50 M8.5 34 H39.5" stroke="#000" strokeOpacity="0.28" strokeWidth="0.8" />
      </svg>
      <Icon className="relative mt-1.5 size-[42%] text-[var(--ivory)] drop-shadow-[0_1px_1px_rgb(0_0_0/0.7)]" strokeWidth={1.8} />
    </span>
  )
}
