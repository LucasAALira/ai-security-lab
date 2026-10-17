import { ArrowRight, Lock } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { campaignSummary, missionStatus, statusText } from '@/components/mission/mission-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { campaignById } from '@/data/campaigns'
import { findCampaign, missionXp } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { SealMark } from '@/components/gothic/Seal'

export function CampaignPage() {
  const { campaign: id } = useParams()
  const { state, ctx } = useProgress()
  const content = id ? campaignById(id) : undefined
  const spec = id ? findCampaign(ctx, id) : undefined
  useDocumentTitle(content ? `Campanha: ${content.title}` : 'Campanha não encontrada')

  if (!content || !spec) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Campanha não encontrada</h1>
        <Button asChild className="mt-6">
          <Link to="/campanhas">Ver as campanhas</Link>
        </Button>
      </div>
    )
  }
  const sum = campaignSummary(state, ctx, spec)

  return (
    <div className="py-8 md:py-10">
      <nav aria-label="Você está em" className="mb-4 text-xs text-muted-foreground">
        <ol className="m-0 flex list-none gap-1.5 p-0">
          <li>
            <Link to="/campanhas" className="underline underline-offset-2 hover:text-primary">Campanhas</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{content.title}</li>
        </ol>
      </nav>
      <SectionHeading eyebrow={`CAMPANHA · ${content.company.toUpperCase()}`} level="h1" title={content.title} description={content.summary} aside={`${sum.passed}/${sum.total} aprovadas`} />
      <p className="mt-2 text-sm text-muted-foreground italic">{content.tagline}</p>
      {sum.pendingRequirements.length ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm">
          <SealMark className="!size-8" /> Esta campanha abre depois de concluir: {sum.pendingRequirements.join(', ')}.
        </p>
      ) : null}
      <ol className="mt-6 grid list-none gap-3 p-0">
        {content.missions.map((m) => {
          const ms = sum.missions.find((x) => x.id === m.id)
          if (!ms) return null
          const st = missionStatus(state, ctx, ms)
          return (
            <li key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
                    Missão {m.order} · {m.level} · {m.minutes} min
                  </p>
                  <h2 className="mt-1 text-lg font-medium">{m.title}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{m.objective}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant="outline" className={cn('rounded text-[10px]', st === 'passed' && 'border-primary text-primary')}>
                    {statusText[st]}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{missionXp(state, ms)} XP</span>
                  {st === 'locked' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="size-3.5" aria-hidden="true" /> Bloqueada
                    </span>
                  ) : (
                    <Button asChild size="sm" variant={st === 'passed' ? 'outline' : 'default'}>
                      <Link to={`/campanhas/${content.id}/${m.id}`}>
                        {st === 'new' ? 'Começar' : st === 'progress' ? 'Continuar' : 'Rever'} <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
