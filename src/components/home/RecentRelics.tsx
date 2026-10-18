import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { MedalBadge } from '@/components/gamification/MedalBadge'
import { XpBar } from '@/components/gamification/XpBar'
import { Button } from '@/components/ui/button'
import { tierNames } from '@/lib/format'
import { formatDay } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

/** Progresso e a última conquista, com acesso ao relicário. Sem conquista ainda, diz como ganhar a primeira. */
export function RecentRelics() {
  const { derived } = useProgress()
  const unlocked = derived.medals.filter((m) => m.unlocked && m.date)
  const last = unlocked.reduce<(typeof unlocked)[number] | null>((best, m) => (!best || (m.date ?? '') >= (best.date ?? '') ? m : best), null)
  return (
    <section id="relicario" aria-labelledby="relicario-titulo" className="mb-14">
      <SectionHeading eyebrow="Relicário" id="relicario-titulo" title="Seu progresso e conquistas" aside={`${derived.summary.medals}/${derived.summary.medalTotal} conquistas`} />
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="gx-panel grid content-start gap-4 border p-5">
          <XpBar />
          <p className="text-[13px] text-muted-foreground">O XP vem de aulas, missões, desafios e revisões. Repetir algo já concluído não soma de novo.</p>
        </div>
        <div className="gx-panel flex flex-col gap-4 border p-5 sm:flex-row sm:items-center">
          {last ? (
            <>
              <MedalBadge icon={last.icon} tier={last.tier} className="size-20 self-center" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Última conquista · {tierNames[last.tier]}
                  {last.date ? ` · ${formatDay(last.date)}` : ''}
                </p>
                <h3 className="font-display text-lg font-semibold">{last.name}</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">{last.desc}</p>
              </div>
            </>
          ) : (
            <p className="flex-1 text-[14px] text-muted-foreground">
              Nenhuma conquista ainda. A primeira, Primeira Chama, chega ao concluir as três etapas da aula de um módulo.
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/conquistas">
            Abrir o relicário <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/sala-de-trofeus">Sala de troféus</Link>
        </Button>
      </div>
    </section>
  )
}
