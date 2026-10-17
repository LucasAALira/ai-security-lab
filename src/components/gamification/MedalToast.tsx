import { tierNames } from '@/lib/format'
import type { Medal } from '@/lib/progress'
import { MedalBadge } from './MedalBadge'

/** Aviso discreto de conquista desbloqueada, mostrado dentro do Sonner. Não rouba o foco nem interrompe:
 *  o Sonner anuncia o texto por uma região educada (aria-live polite). */
export function MedalToast({ medal }: { medal: Medal }) {
  return (
    <div className={`tier-${medal.tier} gx-frame flex w-[340px] max-w-[calc(100vw-36px)] items-center gap-3 bg-popover p-3 text-popover-foreground [--ornament:var(--tier-line)]`}>
      {/* O medalhão surge da sombra, uma vez, quando a conquista é nova. */}
      <span className="gx-reveal">
        <MedalBadge icon={medal.icon} tier={medal.tier} className="size-14" />
      </span>
      <div className="min-w-0">
        <div className="font-display text-[11px] font-semibold tracking-[0.12em] text-tier">Conquista desbloqueada</div>
        <strong className="block font-display text-[15px] leading-snug">{medal.name}</strong>
        <small className="block text-[11px] text-muted-foreground">
          {tierNames[medal.tier]} · +{medal.xp} XP
        </small>
      </div>
    </div>
  )
}
