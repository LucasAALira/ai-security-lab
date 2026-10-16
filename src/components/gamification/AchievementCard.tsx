import { Check, EyeOff, Lock } from 'lucide-react'
import { tierNames } from '@/lib/format'
import { formatDay, type Medal } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { categoryNames } from './achievement-meta'
import { MedalBadge } from './MedalBadge'

function Status({ medal }: { medal: Medal }) {
  if (medal.unlocked) {
    return (
      <span className="inline-flex items-center gap-1 text-primary">
        <Check className="size-3" aria-hidden="true" /> Conquistada
      </span>
    )
  }
  if (medal.masked) {
    return (
      <span className="inline-flex items-center gap-1">
        <EyeOff className="size-3" aria-hidden="true" /> Secreta
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Lock className="size-3" aria-hidden="true" /> Bloqueada
    </span>
  )
}

interface Props {
  medal: Medal
  onOpen: (medal: Medal) => void
}

/** Cartão da galeria de conquistas: brasão, nome, descrição curta e progresso real. Abre os detalhes. */
export function AchievementCard({ medal, onOpen }: Props) {
  const pct = medal.target ? Math.round((medal.value / medal.target) * 100) : 0
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(medal)}
        className={cn(
          `tier-${medal.tier} group flex h-full w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-[transform,border-color,background-color] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0`,
          medal.unlocked
            ? 'border-tier-line bg-[linear-gradient(135deg,var(--tier-soft),var(--card)_70%)]'
            : 'border-dashed border-border bg-card/60 hover:border-tint-line',
        )}
      >
        <MedalBadge icon={medal.icon} tier={medal.tier} locked={!medal.unlocked} hidden={medal.masked} className="mt-0.5 size-[54px]" />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 text-[10px] tracking-[0.6px] text-muted-foreground uppercase">
            <Status medal={medal} />
            <span aria-hidden="true">·</span>
            <span>{medal.masked ? 'Secreta' : categoryNames[medal.category]}</span>
          </span>
          <strong className={cn('mt-1 block text-[14px] leading-snug font-semibold', !medal.unlocked && 'text-foreground/85')}>{medal.name}</strong>
          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{medal.desc}</span>
          {medal.unlocked ? (
            <span className="mt-2 block text-[11px] text-primary">
              {medal.date ? `Obtida em ${formatDay(medal.date)}` : 'Obtida'} · {tierNames[medal.tier]} · +{medal.xp} XP
            </span>
          ) : medal.masked ? (
            <span className="mt-2 block text-[11px] text-muted-foreground">Progresso oculto até o desbloqueio</span>
          ) : (
            <span className="mt-2 block">
              <span role="progressbar" aria-label={`Progresso de ${medal.name}`} aria-valuemin={0} aria-valuemax={medal.target} aria-valuenow={medal.value} className="block h-1.5 overflow-hidden rounded-full bg-border">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {medal.value} de {medal.target} · {tierNames[medal.tier]} · +{medal.xp} XP
              </span>
            </span>
          )}
        </span>
      </button>
    </li>
  )
}
