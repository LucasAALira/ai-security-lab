import { cn } from '@/lib/utils'
import { formatDay, type Medal } from '@/lib/progress'
import { tierNames } from '@/lib/format'
import { MedalBadge } from './MedalBadge'

/** Uma medalha do catálogo: conquistada (com data) ou bloqueada (com quanto falta). */
export function MedalCard({ medal }: { medal: Medal }) {
  const pct = Math.round((medal.value / medal.target) * 100)
  return (
    <li
      className={cn(
        `tier-${medal.tier} flex items-start gap-3.5 rounded-md border p-3.5`,
        medal.unlocked ? 'border-tier-line bg-[linear-gradient(135deg,var(--tier-soft),var(--card)_65%)]' : 'border-border bg-card',
      )}
    >
      <MedalBadge icon={medal.icon} tier={medal.tier} locked={!medal.unlocked} className="size-[46px]" />
      <div className="min-w-0 flex-1">
        <strong className="block text-[13px] leading-snug font-semibold">{medal.name}</strong>
        <span className={cn('mt-px block text-[10px] tracking-[0.6px] uppercase', medal.unlocked ? 'text-tier' : 'text-muted-foreground')}>
          {tierNames[medal.tier]} · {medal.xp} XP
        </span>
        <p className="my-1.5 text-[11px] leading-relaxed text-muted-foreground">{medal.desc}</p>
        {medal.unlocked ? (
          <small className="block text-[10px] text-primary">✓ Conquistada{medal.date ? ` em ${formatDay(medal.date)}` : ''}</small>
        ) : (
          <>
            <div role="img" aria-label={`${medal.value} de ${medal.target}`} className="mb-1.5 h-[3px] overflow-hidden rounded bg-border">
              <div className="h-full rounded bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <small className="block text-[10px] text-muted-foreground">
              Bloqueada · {medal.value}/{medal.target}
            </small>
          </>
        )}
      </div>
    </li>
  )
}
