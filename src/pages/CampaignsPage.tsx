import { ArrowRight, Lock, Map as MapIcon } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { campaignSummary, missionStatus, statusText } from '@/components/mission/mission-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { campaigns } from '@/data/campaigns'
import { areaById } from '@/data/curriculum'
import { findCampaign, learningStats, resumePoint } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

export function CampaignsPage() {
  useDocumentTitle('Campanhas')
  const { state, ctx } = useProgress()
  const stats = learningStats(state, ctx)
  const resume = resumePoint(state, ctx)
  const resumeMission = resume?.kind === 'mission' ? ctx.missions.find((m) => m.id === resume.id) : undefined

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="CAMPANHAS"
        level="h1"
        title="Campanhas de investigação"
        description="Histórias com empresas fictícias: leia as evidências, decida, veja as consequências e revise. Os dados são sintéticos e nada aqui toca em sistemas reais."
        aside={`${stats.missionsPassed}/${ctx.missions.filter((m) => m.kind === 'mission').length} missões aprovadas`}
      />

      {resumeMission && resumeMission.campaign ? (
        <p className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-tint-line bg-tint-strong px-4 py-3 text-sm">
          <MapIcon className="size-4 text-primary" aria-hidden="true" /> Você parou numa missão em andamento.
          <Button asChild size="sm">
            <Link to={`/campanhas/${resumeMission.campaign}/${resumeMission.id}`}>
              Continuar de onde parei <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </p>
      ) : null}

      <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        {campaigns.map((c) => {
          const spec = findCampaign(ctx, c.id)
          if (!spec) return null
          const sum = campaignSummary(state, ctx, spec)
          const blocked = sum.pendingRequirements.length > 0
          const nextMission = sum.missions.find((m) => missionStatus(state, ctx, m) !== 'passed')
          return (
            <li key={c.id} className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                {areaById(c.area)?.title ?? c.area} · {c.company}
              </p>
              <h2 className="mt-1.5 text-xl font-medium">
                <Link to={`/campanhas/${c.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {c.title}
                </Link>
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground italic">{c.tagline}</p>
              <p className="mt-2 text-[13px] leading-relaxed">{c.summary}</p>
              <ol className="mt-3 m-0 grid grid-cols-[minmax(0,1fr)] list-none gap-1 p-0 text-xs">
                {sum.missions.map((m) => {
                  const st = missionStatus(state, ctx, m)
                  const content = c.missions.find((x) => x.id === m.id)
                  return (
                    <li key={m.id} className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate">
                        {m.order}. {content?.title}
                      </span>
                      <Badge variant="outline" className={cn('shrink-0 rounded text-[10px]', st === 'passed' && 'border-primary text-primary')}>
                        {st === 'locked' ? (
                          <>
                            <Lock className="mr-1 size-3" aria-hidden="true" />
                          </>
                        ) : null}
                        {statusText[st]}
                      </Badge>
                    </li>
                  )
                })}
              </ol>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {blocked ? (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="size-3.5" aria-hidden="true" /> Conclua antes: {sum.pendingRequirements.map((r) => campaigns.find((x) => x.id === r)?.title ?? r).join(', ')}
                  </p>
                ) : nextMission ? (
                  <Button asChild size="sm">
                    <Link to={`/campanhas/${c.id}/${nextMission.id}`}>
                      {missionStatus(state, ctx, nextMission) === 'new' && sum.passed === 0 ? 'Começar a campanha' : 'Continuar a campanha'} <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                ) : (
                  <p className="text-xs font-medium text-primary">Campanha concluída</p>
                )}
                <span className="text-xs text-muted-foreground">
                  {sum.passed} de {sum.total} missões aprovadas
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
