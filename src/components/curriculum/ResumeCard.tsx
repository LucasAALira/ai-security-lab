import { ArrowRight, Map as MapIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { challengeById } from '@/data/challenges'
import { dossierById, missionContentById } from '@/data/campaigns'
import { findMission, resumePoint } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

/** "Continuar de onde parei": a missão, o caso ou o desafio que ficou aberto por último. Some quando não há nada em andamento. */
export function ResumeCard() {
  const { state, ctx } = useProgress()
  const point = resumePoint(state, ctx)
  if (!point) return null

  let label: string | null = null
  let to = ''
  if (point.kind === 'mission') {
    const spec = findMission(ctx, point.id)
    if (spec?.kind === 'dossier') {
      const d = dossierById(point.id)
      label = d ? `Simulação: ${d.exercise.title}` : null
      to = `/casos/${point.id}/simulacao`
    } else {
      const m = missionContentById(point.id)
      label = m ? `Missão: ${m.title}` : null
      to = `/campanhas/${m?.campaign}/${point.id}`
    }
  } else {
    const c = challengeById(point.id)
    label = c ? `Desafio: ${c.title}` : null
    to = `/desafios?desafio=${point.id}`
  }
  if (!label) return null
  return (
    <p className="flex flex-wrap items-center gap-3 rounded-xl border border-tint-line bg-tint-strong px-4 py-3 text-sm">
      <MapIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0 [overflow-wrap:anywhere]">
        Você parou em <strong>{label}</strong>.
      </span>
      <Button asChild size="sm">
        <Link to={to}>
          Continuar de onde parei <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </p>
  )
}
