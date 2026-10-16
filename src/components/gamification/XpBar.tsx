import { formatNumber } from '@/lib/format'
import { LEVELS } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { LevelBadge } from './LevelBadge'

/** Nível, título e a barra de XP até o próximo nível. Os títulos vêm de metas de XP reais
 *  (tarefas, desafios, chefes e conquistas), então a barra nunca anda por outra via. */
export function XpBar({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { derived } = useProgress()
  const { summary, level } = derived
  const next = level.next === null ? null : LEVELS[level.number]
  const span = level.next === null ? 1 : level.next - level.start
  const pct = level.next === null ? 100 : Math.min(100, Math.round(((summary.xp - level.start) / span) * 100))
  return (
    <div className={cn('flex items-center gap-3.5', className)}>
      <LevelBadge level={level.number} className={compact ? 'size-10' : 'size-14'} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <strong className="text-sm font-semibold">
            Nível {level.number} · {level.name}
          </strong>
          <span data-testid="xp-total" className="font-mono text-xs text-muted-foreground">{formatNumber(summary.xp)} XP</span>
        </div>
        <div
          role="progressbar"
          aria-label={`Progresso para o próximo nível`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={next ? `${pct}% do caminho até ${next.name}` : 'Nível máximo'}
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-border"
        >
          <div className="h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--primary)_70%,#7a1b24),var(--primary))] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {next && level.next !== null ? `Faltam ${formatNumber(level.next - summary.xp)} XP para o título "${next.name}"` : 'Título máximo alcançado'}
        </p>
      </div>
    </div>
  )
}
