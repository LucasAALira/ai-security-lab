import { tierNames } from '@/lib/format'
import type { Medal } from '@/lib/progress'
import { Pop } from '@/components/motion/Pop'
import { MedalBadge } from './MedalBadge'

/** Aviso discreto de conquista desbloqueada, mostrado dentro do Sonner. Não rouba o foco nem interrompe:
 *  o Sonner anuncia o texto por uma região educada (aria-live polite). */
export function MedalToast({ medal }: { medal: Medal }) {
  return (
    <div className={`tier-${medal.tier} flex w-[340px] max-w-[calc(100vw-36px)] items-center gap-3 rounded-xl border border-tier-line bg-popover p-3 text-popover-foreground shadow-lg`}>
      <Pop>
        <MedalBadge icon={medal.icon} tier={medal.tier} className="size-12" />
      </Pop>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold tracking-[0.18em] text-tier uppercase">Conquista desbloqueada</div>
        <strong className="block text-sm leading-snug">{medal.name}</strong>
        <small className="block text-[11px] text-muted-foreground">
          {tierNames[medal.tier]} · +{medal.xp} XP
        </small>
      </div>
    </div>
  )
}
