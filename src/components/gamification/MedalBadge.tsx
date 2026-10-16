import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MedalIcon, Tier } from '@/lib/progress'
import { medalIcons } from './medal-icons'

interface Props {
  icon: MedalIcon
  tier: Tier
  locked?: boolean
  className?: string
}

/** Medalha redonda: preenchida na cor do nível quando conquistada, tracejada quando bloqueada. */
export function MedalBadge({ icon, tier, locked = false, className }: Props) {
  const Icon = medalIcons[icon]
  return (
    <span
      aria-hidden="true"
      className={cn(
        `tier-${tier} relative grid size-11 shrink-0 place-items-center rounded-full border-2`,
        locked
          ? 'border-dashed border-border bg-muted text-muted-foreground'
          : 'border-tier-line bg-[radial-gradient(circle_at_32%_26%,#ffffffaa_0,#ffffff00_46%),var(--tier)] text-[#1d1111] shadow-[0_0_0_3px_var(--tier-soft)]',
        !locked && tier === 'dragao' && 'shadow-[0_0_0_3px_var(--tier-soft),0_0_16px_#ed808080]',
        className,
      )}
    >
      {locked ? <Lock className="size-4" /> : <Icon className="size-5" strokeWidth={2.4} />}
    </span>
  )
}
