import { cn } from '@/lib/utils'

/** Escudo com o número do nível, no mesmo desenho dos brasões das conquistas. */
export function LevelBadge({ level, className }: { level: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('relative inline-grid size-11 shrink-0 place-items-center', className)}>
      <svg viewBox="0 0 64 76" className="absolute inset-0 size-full overflow-visible" focusable="false">
        <path d="M32 3 L58 11 V37 C58 55 46 66 32 73 C18 66 6 55 6 37 V11 Z" fill="color-mix(in oklab, var(--background) 70%, black)" stroke="var(--bronze)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 10 L51 16 V37 C51 50 43 59 32 65 C21 59 13 50 13 37 V16 Z" fill="none" stroke="var(--primary)" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M24 8 L32 3 L40 8" fill="none" stroke="var(--candle)" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="relative -mt-[8%] font-display text-[1.1rem] leading-none font-bold text-primary tabular-nums">{level}</span>
    </span>
  )
}
