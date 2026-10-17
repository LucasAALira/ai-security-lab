import { Link, useParams } from 'react-router'
import { MissionView } from '@/components/mission/MissionView'
import { Button } from '@/components/ui/button'
import { dossierAsMission, dossierById } from '@/data/campaigns'
import { findMission } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

export function DossierSimulationPage() {
  const { dossier } = useParams()
  const { ctx } = useProgress()
  const d = dossier ? dossierById(dossier) : undefined
  const spec = d ? findMission(ctx, d.id) : undefined
  useDocumentTitle(d ? `Simulação: ${d.exercise.title}` : 'Simulação não encontrada')

  if (!d || !spec) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Simulação não encontrada</h1>
        <p className="mt-3 mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Escolha um dossiê na lista.</p>
        <Button asChild>
          <Link to="/casos">Ver os casos reais</Link>
        </Button>
      </div>
    )
  }
  return (
    <div className="py-8 md:py-10">
      <nav aria-label="Você está em" className="mb-4 text-xs text-muted-foreground">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <li>
            <Link to="/casos" className="underline underline-offset-2 hover:text-primary">Casos reais</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/casos/${d.id}`} className="underline underline-offset-2 hover:text-primary">{d.title}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Simulação fictícia</li>
        </ol>
      </nav>
      <MissionView key={d.id} content={dossierAsMission(d)} spec={spec} />
    </div>
  )
}
