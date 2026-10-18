import { cn } from '@/lib/utils'

/** Relíquia sobre um pedestal de luz holográfica: linhas vetoriais (projetor, feixes e anéis)
 *  sustentam a peça, que flutua. Arte original em public/assets/relics. Decorativa: o cartão
 *  ao redor dá o nome. A flutuação some com prefers-reduced-motion. */
export function RelicArt({ icon, tier = 'ouro', className }: { icon: string; tier?: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn(`relic-art tier-${tier}`, className)}>
      <HoloPedestal />
      <img src={`assets/relics/${icon}.svg`} alt="" className="relic-symbol" />
    </span>
  )
}

/** Só o pedestal (para pôr sob outra peça, como um brasão de conquista). Use dentro de .relic-art. */
export function HoloPedestal() {
  return (
    <svg className="relic-pedestal" viewBox="0 0 100 110" preserveAspectRatio="xMidYMax meet" focusable="false">
      <path className="relic-beam" d="M38 96 L20 30 H80 L62 96 Z" />
      <path className="relic-line" d="M38 96 L22 34 M62 96 L78 34 M50 96 V30" />
      <ellipse className="relic-ring is-far" cx="50" cy="44" rx="27" ry="5" />
      <ellipse className="relic-ring" cx="50" cy="96" rx="22" ry="4.5" />
      <ellipse className="relic-ring is-soft" cx="50" cy="96" rx="32" ry="7" />
      <path className="relic-base" d="M26 100 H74 L68 108 H32 Z" />
      <path className="relic-line" d="M32 104 H68" />
    </svg>
  )
}
