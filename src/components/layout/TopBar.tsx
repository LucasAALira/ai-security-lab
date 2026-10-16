import { Coins, Flame } from 'lucide-react'
import { Link } from 'react-router'
import { Bump } from '@/components/motion/Bump'
import { cn } from '@/lib/utils'
import { plural } from '@/lib/format'
import { useProgress } from '@/state/ProgressProvider'

export function TopBar() {
  const { derived } = useProgress()
  const { streak, streakStatus, balance, level } = derived
  const atRisk = streak > 0 && streakStatus === 'open'
  const streakLabel = streak
    ? `${streak} ${plural(streak, 'dia seguido', 'dias seguidos')}${atRisk ? ': estude hoje para manter a sequência' : streakStatus === 'shielded' ? ': um escudo vai cobrir os dias sem estudo' : ''}`
    : 'Nenhuma sequência ativa: estude hoje para começar'
  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-border text-[10px] tracking-[1.4px] text-muted-foreground md:h-[85px]">
      <span className="truncate">
        CENTRAL DE ESTUDOS <b className="font-normal text-foreground/85">/ SEGURANÇA DE IA</b>
      </span>
      <div className="flex shrink-0 items-center gap-2 tracking-normal">
        <span
          title={streakLabel}
          aria-label={streakLabel}
          role="img"
          className={cn('inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px]', streak > 0 && 'border-tint-line text-primary', atRisk && 'motion-safe:animate-pulse')}
        >
          <Flame className="size-3.5" aria-hidden="true" />
          <Bump value={streak}>{streak}</Bump>
        </span>
        <Link
          to="/loja"
          title={`${balance} moedas — abrir a loja`}
          aria-label={`${balance} ${plural(balance, 'moeda', 'moedas')} — abrir a loja`}
          className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] hover:border-tint-line hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Coins className="size-3.5" aria-hidden="true" />
          <Bump value={balance}>{balance}</Bump>
        </Link>
        <Link
          to="/conquistas"
          aria-label={`Nível ${level.number}, ${level.name} — abrir as conquistas`}
          className="hidden rounded-full border border-border px-3 py-1 text-[11px] hover:border-tint-line hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:inline"
        >
          Nível {level.number}
        </Link>
        <span className="rounded-full border border-border px-3 py-1 text-[10px] tracking-[1.4px]">
          PT-BR <span className="ml-0.5 inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />
        </span>
      </div>
    </header>
  )
}
