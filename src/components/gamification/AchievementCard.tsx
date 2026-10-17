import { Check, EyeOff, Lock } from 'lucide-react'
import { tierNames } from '@/lib/format'
import { formatDay, type Medal, type Tier } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { categoryNames } from './achievement-meta'
import { MedalBadge } from './MedalBadge'

/** Raridade em três sinais além da cor: o desenho do medalhão (asas, coroa, chifres), este símbolo e o nome. */
const RARITY_GLYPH: Record<Tier, string> = { bronze: '◆', prata: '◆◆', ouro: '♛', dragao: '✦✦✦' }

export function Rarity({ tier }: { tier: Tier }) {
  return (
    <span className="inline-flex items-center gap-1 text-tier">
      <span aria-hidden="true" className="text-[9px] tracking-[0.1em]">
        {RARITY_GLYPH[tier]}
      </span>
      {tierNames[tier]}
    </span>
  )
}

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

/** Um nicho do relicário: o medalhão em destaque, o nome, o requisito escrito e o progresso real. Abre os detalhes. */
export function AchievementCard({ medal, onOpen }: Props) {
  const pct = medal.target ? Math.round((medal.value / medal.target) * 100) : 0
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(medal)}
        className={cn(
          `tier-${medal.tier} gx-niche gx-candle flex h-full w-full flex-col items-center px-4 pt-6 pb-4 text-center`,
          !medal.unlocked && 'is-locked',
        )}
      >
        <MedalBadge icon={medal.icon} tier={medal.tier} locked={!medal.unlocked} hidden={medal.masked} className="size-[72px]" />
        <span className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-muted-foreground">
          <Status medal={medal} />
          <span aria-hidden="true">·</span>
          <span>{medal.masked ? 'Secreta' : categoryNames[medal.category]}</span>
        </span>
        <strong className={cn('mt-1.5 block font-display text-[15px] leading-snug font-semibold', !medal.unlocked && 'text-foreground/85')}>{medal.name}</strong>
        <span className="mt-1 line-clamp-3 block text-[12.5px] leading-relaxed text-muted-foreground">{medal.desc}</span>
        <span className="mt-auto w-full pt-3 text-[11.5px]">
          {medal.unlocked ? (
            <span className="block">
              <Rarity tier={medal.tier} /> · <span className="text-primary">{medal.date ? `obtida em ${formatDay(medal.date)}` : 'obtida'}</span> · +{medal.xp} XP
            </span>
          ) : medal.masked ? (
            <span className="block text-muted-foreground">Requisito oculto até o desbloqueio</span>
          ) : (
            <span className="block">
              <span role="progressbar" aria-label={`Progresso de ${medal.name}`} aria-valuemin={0} aria-valuemax={medal.target} aria-valuenow={medal.value} className="gx-gauge block h-1.5">
                <span className="gx-gauge-fill block" style={{ transform: `translateX(-${100 - pct}%)` }} />
              </span>
              <span className="mt-1 block text-muted-foreground">
                {medal.value} de {medal.target} · <Rarity tier={medal.tier} /> · +{medal.xp} XP
              </span>
            </span>
          )}
        </span>
      </button>
    </li>
  )
}
