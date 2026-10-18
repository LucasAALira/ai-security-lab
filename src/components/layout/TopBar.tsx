import { Coins, Flame } from 'lucide-react'
import { Link } from 'react-router'
import { LevelBadge } from '@/components/gamification/LevelBadge'
import { EmberBurst } from '@/components/gothic/EmberBurst'
import { Bump } from '@/components/motion/Bump'
import { formatNumber, plural } from '@/lib/format'
import { LEVELS } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

/** Cabeçalho compacto, como a barra de status de um RPG: brasão do nível, XP, sequência e moedas. */
export function TopBar() {
  const { derived } = useProgress()
  const { streak, streakStatus, balance, level, summary } = derived
  const atRisk = streak > 0 && streakStatus === 'open'
  const streakLabel = streak
    ? `${streak} ${plural(streak, 'dia seguido', 'dias seguidos')}${atRisk ? ': estude hoje para manter a sequência' : streakStatus === 'shielded' ? ': um escudo vai cobrir os dias sem estudo' : ''}`
    : 'Nenhuma sequência ativa: estude hoje para começar'
  const span = level.next === null ? 1 : level.next - level.start
  const pct = level.next === null ? 100 : Math.max(0, Math.min(100, Math.round(((summary.xp - level.start) / span) * 100)))
  const nextName = level.next === null ? null : LEVELS[level.number]?.name
  const chip = 'inline-flex min-h-9 items-center gap-1.5 rounded-[2px] border border-[var(--stone-line)] bg-[var(--stone)] px-2.5 text-[13px] font-semibold tabular-nums'

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-[var(--stone-line)] py-2.5 md:min-h-[76px]">
      <Link
        to="/conquistas"
        className="group flex min-w-0 items-center gap-2.5 rounded-[2px] focus-visible:outline-2"
      >
        <LevelBadge level={level.number} className="size-10" />
        <span className="relative min-w-0">
          <span className="block truncate text-[13px] font-semibold group-hover:text-primary">
            Nível {level.number} <span className="font-normal text-muted-foreground">· {level.name}</span>
          </span>
          <span className="mt-1 flex items-center gap-2">
            <span className="gx-gauge relative h-2 w-[clamp(72px,16vw,180px)]" aria-hidden="true">
              <span className="gx-gauge-fill block" style={{ transform: `translateX(-${100 - pct}%)` }} />
            </span>
            <span className="text-[11.5px] text-muted-foreground tabular-nums" data-testid="xp-header">
              {formatNumber(summary.xp)} XP
            </span>
          </span>
          <span className="sr-only">
            {nextName && level.next !== null ? `, faltam ${formatNumber(level.next - summary.xp)} XP para ${nextName}` : ''}. Abrir o relicário
          </span>
          <EmberBurst value={summary.xp} />
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-1.5">
        <span title={streakLabel} aria-label={streakLabel} role="img" className={cn(chip, streak > 0 && 'border-[var(--ornament-soft)] text-primary', atRisk && 'motion-safe:animate-pulse')}>
          <Flame className="size-4" aria-hidden="true" />
          <Bump value={streak}>{streak}</Bump>
        </span>
        <Link
          to="/loja"
          title={`${balance} moedas — abrir o mercador`}
          aria-label={`${balance} ${plural(balance, 'moeda', 'moedas')} — abrir o mercador`}
          className={cn(chip, 'hover:border-[var(--ornament)] hover:text-primary focus-visible:outline-2')}
        >
          <Coins className="size-4 text-[var(--candle)]" aria-hidden="true" />
          <Bump value={balance}>{balance}</Bump>
        </Link>
      </div>
    </header>
  )
}
