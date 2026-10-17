import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { formatDay, LAYERS } from '@/components/mission/dossier-layers'
import { missionStatus, statusText } from '@/components/mission/mission-status'
import { Badge } from '@/components/ui/badge'
import { dossiers } from '@/data/campaigns'
import { findMission } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

export function DossiersPage() {
  useDocumentTitle('Casos reais')
  const { state, ctx } = useProgress()

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="CASOS REAIS"
        level="h1"
        title="Dossiês de incidentes documentados"
        description="Quatro casos de cadeia de suprimentos, cada um com os fatos, a análise e uma simulação fictícia separados e rotulados."
      />

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {Object.values(LAYERS).map((l) => (
          <div key={l.label} className="rounded-xl border border-tint-line bg-tint p-3.5 text-[13px] leading-relaxed">
            <p className="font-semibold">{l.label}</p>
            <p className="mt-1 text-muted-foreground">{l.hint}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        As fontes primárias vêm primeiro em cada dossiê, o texto funciona sem internet (só os links externos precisam dela) e cada caso traz a data em que foi revisado. Quando as fontes não confirmam algo, isso aparece como incerteza, e não como fato.
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {dossiers.map((d) => {
          const spec = findMission(ctx, d.id)
          const read = state.dossiers[d.id]
          const status = spec ? missionStatus(state, ctx, spec) : 'new'
          return (
            <li key={d.id} className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="text-xl leading-snug font-medium">
                <Link to={`/casos/${d.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {d.title}
                </Link>
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d.subtitle}</p>
              <dl className="mt-3 grid gap-1 text-xs">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-medium">Incidente:</dt>
                  <dd className="text-muted-foreground">{d.incidentDate}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-medium">Divulgação:</dt>
                  <dd className="text-muted-foreground">{d.publishedDate}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-medium">Revisado em:</dt>
                  <dd className="text-muted-foreground">{formatDay(d.reviewed)}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className={cn('rounded', read && 'border-primary text-primary')}>
                  {read ? (
                    <>
                      <CheckCircle2 aria-hidden="true" /> Lido em {formatDay(read)}
                    </>
                  ) : (
                    'Não lido'
                  )}
                </Badge>
                <Badge variant="outline" className={cn('rounded', status === 'passed' && 'border-primary text-primary')}>
                  Simulação: {statusText[status]}
                </Badge>
              </div>
              <div className="mt-4">
                <Link
                  to={`/casos/${d.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Abrir o dossiê <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
