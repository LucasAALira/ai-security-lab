import { tierNames } from '@/lib/format'
import type { Medal } from '@/lib/progress'
import { Pop } from '@/components/motion/Pop'
import { MedalBadge } from './MedalBadge'

/** Aviso de medalha conquistada, mostrado dentro do Sonner. */
export function MedalToast({ medal }: { medal: Medal }) {
  return (
    <div className={`tier-${medal.tier} flex w-[340px] max-w-[calc(100vw-36px)] items-center gap-3 rounded-lg border border-tier-line bg-popover p-3.5 text-popover-foreground shadow-lg`}>
      <Pop>
        <MedalBadge icon={medal.icon} tier={medal.tier} className="size-10" />
      </Pop>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold tracking-[1.5px] text-tier uppercase">Nova medalha!</div>
        <strong className="block text-sm leading-snug">{medal.name}</strong>
        <small className="block text-[11px] text-muted-foreground">
          {tierNames[medal.tier]} · +{medal.xp} XP
        </small>
      </div>
    </div>
  )
}
