import { Link, useParams } from 'react-router'
import { MissionView } from '@/components/mission/MissionView'
import { Button } from '@/components/ui/button'
import { campaignById, missionContentById } from '@/data/campaigns'
import { findMission } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

export function MissionPage() {
  const { campaign, mission } = useParams()
  const { ctx } = useProgress()
  const content = mission ? missionContentById(mission) : undefined
  const spec = mission ? findMission(ctx, mission) : undefined
  useDocumentTitle(content ? `Missão: ${content.title}` : 'Missão não encontrada')

  if (!content || !spec || content.campaign !== campaign) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Missão não encontrada</h1>
        <p className="mt-3 mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Escolha uma missão na lista de campanhas.</p>
        <Button asChild>
          <Link to="/campanhas">Ver as campanhas</Link>
        </Button>
      </div>
    )
  }
  return (
    <div className="py-8 md:py-10">
      <nav aria-label="Você está em" className="mb-4 text-xs text-muted-foreground">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <li>
            <Link to="/campanhas" className="underline underline-offset-2 hover:text-primary">Campanhas</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/campanhas/${content.campaign}`} className="underline underline-offset-2 hover:text-primary">{campaignById(content.campaign)?.title ?? content.campaign}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{content.title}</li>
        </ol>
      </nav>
      <MissionView key={content.id} content={content} spec={spec} />
    </div>
  )
}
