import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TierChip } from '@/components/gamification/TierChip'
import { plural, tierNames } from '@/lib/format'
import { useProgress } from '@/state/ProgressProvider'

/** Evolução por trilha: cada categoria de módulos tem uma medalha que sobe com as tarefas concluídas. */
export function TracksCard({ onPickTrack }: { onPickTrack: (track: string) => void }) {
  const { derived } = useProgress()
  return (
    <section aria-labelledby="tracks-title" className="rounded-lg border border-border bg-card p-5 max-sm:p-4">
      <h3 id="tracks-title" className="mb-1.5 text-base font-semibold">
        Evolução por trilha
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Cada trilha reúne módulos de um mesmo tema. A medalha da trilha sobe com as tarefas concluídas: bronze a partir de 40%, prata a partir de 70% e ouro aos 100%.
      </p>
      <div>
        {derived.tracks.map((t) => {
          const pct = Math.round((t.steps / t.maxSteps) * 100)
          const next = t.next ? ` · faltam ${t.next.remaining} ${plural(t.next.remaining, 'tarefa', 'tarefas')} para ${tierNames[t.next.tier]}` : ' · medalha máxima'
          return (
            <article key={t.name} className="border-t border-border py-3.5 first:border-t-0 first:pt-1">
              <div className="flex items-center justify-between gap-2.5 text-[13px]">
                <strong>{t.name}</strong>
                <TierChip tier={t.tier} />
              </div>
              <Progress value={pct} aria-label={`${pct}% da trilha ${t.name}`} className="my-2 h-1" />
              <p className="mb-2 text-[11px] leading-normal text-muted-foreground">
                {t.xp}/{t.maxXp} XP · {t.complete}/{t.count} {plural(t.count, 'módulo', 'módulos')} · {t.steps}/{t.maxSteps} tarefas{next}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/?secao=trilhas" onClick={() => onPickTrack(t.name)}>
                  Ver módulos da trilha
                </Link>
              </Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
