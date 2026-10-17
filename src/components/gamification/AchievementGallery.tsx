import { useState } from 'react'
import type { Medal } from '@/lib/progress'
import { AchievementCard } from './AchievementCard'
import { AchievementDialog } from './AchievementDialog'

/** Grade de conquistas com o diálogo de detalhes. Reaproveitada na página Conquistas e na página inicial. */
export function AchievementGallery({ medals, empty }: { medals: Medal[]; empty: string }) {
  const [open, setOpen] = useState<string | null>(null)
  // O diálogo lê a conquista do estado atual, para mostrar os dados reais assim que ela é desbloqueada.
  const current = medals.find((m) => m.id === open) ?? null
  return (
    <>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 min-[460px]:grid-cols-2 lg:grid-cols-3 min-[1300px]:grid-cols-4">
        {medals.length ? medals.map((m) => <AchievementCard key={m.id} medal={m} onOpen={(x) => setOpen(x.id)} />) : <li className="col-span-full rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">{empty}</li>}
      </ul>
      <AchievementDialog medal={current} onClose={() => setOpen(null)} />
    </>
  )
}
