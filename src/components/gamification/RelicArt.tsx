import { cn } from '@/lib/utils'
/** Local SVGs, credited on References. Empty alt: the enclosing card supplies the name. */
export function RelicArt({ icon, tier = 'ouro', className }: { icon: string; tier?: string; className?: string }) {
  return <span aria-hidden="true" className={cn(`relic-art tier-${tier}`, className)}>
    <span className="relic-orbit" />
    <img src={`assets/relics/${icon}.svg`} alt="" className="relic-symbol" />
    <span className="relic-gem" />
  </span>
}
