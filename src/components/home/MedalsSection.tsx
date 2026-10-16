import { useState } from 'react'
import { MedalCard } from '@/components/gamification/MedalCard'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TIER_XP } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

type MedalFilter = 'all' | 'unlocked' | 'locked'

export function MedalsSection() {
  const { derived } = useProgress()
  const [mode, setMode] = useState<MedalFilter>('all')
  const got = derived.medals.filter((m) => m.unlocked).length
  const shown = derived.medals.filter((m) => mode === 'all' || (mode === 'unlocked') === m.unlocked)

  return (
    <section id="medalhas" aria-labelledby="medals-title" className="mt-9 mb-3">
      <SectionHeading level="h3" eyebrow="CONQUISTAS" id="medals-title" title="Medalhas" aside={`${got}/${derived.medals.length} medalhas`} />
      <p className="mt-2 text-xs text-muted-foreground">
        Cada medalha dá XP bônus uma única vez: bronze {TIER_XP.bronze}, prata {TIER_XP.prata}, ouro {TIER_XP.ouro} e dragão {TIER_XP.dragao}. As medalhas bloqueadas mostram quanto falta.
      </p>
      <div className="my-4 flex items-center gap-3 text-xs">
        <Label htmlFor="medal-filter" className="text-xs">
          Mostrar medalhas:
        </Label>
        <Select value={mode} onValueChange={(v) => setMode(v as MedalFilter)}>
          <SelectTrigger id="medal-filter" size="sm" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="unlocked">Conquistadas</SelectItem>
            <SelectItem value="locked">A conquistar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ul className="grid gap-2.5 sm:grid-cols-2 min-[1151px]:grid-cols-3">
        {shown.length ? (
          shown.map((m) => <MedalCard key={m.id} medal={m} />)
        ) : (
          <li className="col-span-full p-3.5 text-xs text-muted-foreground">
            {mode === 'unlocked' ? 'Nenhuma medalha conquistada ainda. Registre uma leitura para começar.' : 'Você conquistou todas as medalhas!'}
          </li>
        )}
      </ul>
    </section>
  )
}
