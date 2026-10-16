import { cn } from '@/lib/utils'
import { tierNames } from '@/lib/format'
import type { Tier } from '@/lib/progress'

/** Selo do nível da medalha (bronze, prata, ouro, dragão). */
export function TierChip({ tier, className }: { tier: Tier | null; className?: string }) {
  return (
    <span
      className={cn(
        `tier-${tier ?? 'none'} inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-tier-line bg-tier-soft px-2.5 py-0.5 align-middle text-[10px] leading-snug font-semibold text-tier`,
        className,
      )}
    >
      <span aria-hidden="true">●</span>
      {tier ? tierNames[tier] : 'Sem medalha'}
    </span>
  )
}
