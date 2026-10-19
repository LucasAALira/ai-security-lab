import { Lock } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { MedalIcon, Tier } from '@/lib/progress'
import { medalIcons } from './medal-icons'

interface Props {
  icon: MedalIcon
  tier: Tier
  locked?: boolean
  /** Conquista secreta ainda oculta: mostra o ícone de interrogação em vez de um cadeado. */
  hidden?: boolean
  className?: string
}

const SHIELD = 'M32 5 L57 13 V37 C57 54 46 65 32 71 C18 65 7 54 7 37 V13 Z'
const FIELD = 'M32 11 L51 17.5 V37 C51 50 43 59 32 64 C21 59 13 50 13 37 V17.5 Z'

/** Detalhes de cada nível, desenhados sobre o escudo: bronze liso, prata com asas, ouro com
 *  coroa e dragão com chifres e uma joia na ponta. Identidade própria, sem assets de jogos. */
function Ornament({ tier }: { tier: Tier }) {
  switch (tier) {
    case 'prata':
      return (
        <>
          <path d="M7 19 C0 22 -1 33 7 40" fill="none" stroke="var(--tier)" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M57 19 C64 22 65 33 57 40" fill="none" stroke="var(--tier)" strokeWidth="2.6" strokeLinecap="round" />
        </>
      )
    case 'ouro':
      return <path d="M20 12 L22 3 L27 9 L32 1 L37 9 L42 3 L44 12 Z" fill="var(--tier)" stroke="var(--tier-edge)" strokeWidth="1.2" strokeLinejoin="round" />
    case 'dragao':
      return (
        <>
          <path d="M18 14 C8 11 5 3 8 -2 C10 5 16 7 22 9 Z" fill="var(--tier)" stroke="var(--tier-edge)" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M46 14 C56 11 59 3 56 -2 C54 5 48 7 42 9 Z" fill="var(--tier)" stroke="var(--tier-edge)" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M32 66 L28 72 L32 78 L36 72 Z" fill="var(--tier)" stroke="var(--tier-edge)" strokeWidth="1.1" strokeLinejoin="round" />
        </>
      )
    default:
      return null
  }
}

/** Brasão da conquista: escudo com borda na cor do nível, campo escuro e o ícone em destaque.
 *  Bloqueado vira um contorno tracejado e apagado, com cadeado (ou interrogação, se oculta). */
export function MedalBadge({ icon, tier, locked = false, hidden = false, className }: Props) {
  const Icon = medalIcons[icon]
  const art: Partial<Record<MedalIcon, string>> = { swords:'black-blade', crown:'crown', 'key-round':'key', 'flame-kindling':'burning-embers', flame:'burning-embers', eye:'crystal-ball', 'book-open':'spell-book', library:'spell-book', gift:'locked-chest', 'shield-check':'chained-heart' }
  const symbol = art[icon] ?? (tier === 'dragao' ? 'dragon-head' : null)
  const gradient = useId().replace(/:/g, '')
  return (
    <span
      aria-hidden="true"
      className={cn(
        `tier-${tier} relative inline-grid size-11 shrink-0 place-items-center`,
        !locked && 'drop-shadow-[0_2px_6px_rgb(0_0_0/0.5)]',
        !locked && tier === 'dragao' && 'drop-shadow-[0_0_10px_color-mix(in_oklab,var(--tier)_55%,transparent)]',
        className,
      )}
    >
      <svg viewBox="-6 -6 76 90" className="absolute inset-0 size-full overflow-visible" focusable="false">
        {locked ? (
          <>
            <path d={SHIELD} fill="var(--card)" stroke="var(--muted-foreground)" strokeOpacity="0.55" strokeWidth="2.2" strokeDasharray="4 3.5" />
            <path d={FIELD} fill="color-mix(in oklab, var(--muted) 70%, transparent)" />
          </>
        ) : (
          <>
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="color-mix(in oklab, var(--tier) 60%, white)" />
                <stop offset="0.5" stopColor="var(--tier)" />
                <stop offset="1" stopColor="var(--tier-edge)" />
              </linearGradient>
            </defs>
            <Ornament tier={tier} />
            <path d={SHIELD} fill={`url(#${gradient})`} stroke="var(--tier-edge)" strokeWidth="1.4" strokeLinejoin="round" />
            <path d={FIELD} fill="#170c0e" stroke="color-mix(in oklab, var(--tier) 55%, transparent)" strokeWidth="1" />
            <path d="M32 15 L47 20 V29 C40 26 24 26 17 29 V20 Z" fill="color-mix(in oklab, var(--tier) 16%, transparent)" />
          </>
        )}
      </svg>
      {locked ? (
        hidden ? (
          <Icon className="relative -mt-[6%] size-[40%] text-muted-foreground" strokeWidth={2.2} />
        ) : (
          <Lock className="relative -mt-[6%] size-[36%] text-muted-foreground" strokeWidth={2.2} />
        )
      ) : (
        symbol ? <img src={`assets/relics/${symbol}.svg`} alt="" className="relative -mt-[6%] size-[46%] opacity-90" /> : <Icon className="relative -mt-[6%] size-[44%] text-tier" strokeWidth={2.2} />
      )}
    </span>
  )
}
