import { Link, useParams } from 'react-router'
import { MissionView } from '@/components/mission/MissionView'
import { Button } from '@/components/ui/button'
import { reviewAsMission, reviewById } from '@/data/code-review'
import { findMission } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

export function CodeReviewSamplePage() {
  const { amostra } = useParams()
  const { ctx } = useProgress()
  const s = amostra ? reviewById(amostra) : undefined
  const spec = s ? findMission(ctx, s.id) : undefined
  useDocumentTitle(s ? `Análise: ${s.title}` : 'Amostra não encontrada')

  if (!s || !spec) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Amostra não encontrada</h1>
        <p className="mt-3 mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Escolha uma amostra na lista do treino.</p>
        <Button asChild>
          <Link to="/analise">Ver o treino de análise de código</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-10">
      <nav aria-label="Você está em" className="mb-4 text-xs text-muted-foreground">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <li>
            <Link to="/analise" className="underline underline-offset-2 hover:text-primary">
              Análise de código
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{s.title}</li>
        </ol>
      </nav>
      <MissionView key={s.id} content={reviewAsMission(s)} spec={spec} />
    </div>
  )
}
