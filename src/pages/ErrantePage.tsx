import { Link, useParams } from 'react-router'
import { BossArt, BOSS_VIEWBOX } from '@/components/gothic/BossArt'
import { MissionView } from '@/components/mission/MissionView'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { erranteById, ELEMENTOS } from '@/data/errantes'
import { findMission, missionPassed } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

/** O combate contra um guardião errante: a apresentação do vilão e, abaixo, o mesmo motor das missões. */
export function ErrantePage() {
  const { errante } = useParams()
  const { ctx, state } = useProgress()
  const e = errante ? erranteById(errante) : undefined
  const spec = e ? findMission(ctx, e.id) : undefined
  useDocumentTitle(e ? `Combate: ${e.nome}` : 'Guardião não encontrado')

  if (!e || !spec) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Guardião não encontrado</h1>
        <p className="mt-3 mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Os errantes aparecem nas crônicas da página inicial.</p>
        <Button asChild>
          <Link to="/?secao=cronicas">Ver as crônicas</Link>
        </Button>
      </div>
    )
  }

  const vencido = missionPassed(state, spec)

  return (
    <div className="py-8 md:py-10">
      <nav aria-label="Você está em" className="mb-4 text-xs text-muted-foreground">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <li>
            <Link to="/?secao=cronicas" className="underline underline-offset-2 hover:text-primary">
              Crônicas
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{e.nome}</li>
        </ol>
      </nav>

      <Card className="mb-8 gap-4 border-tint-line bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] p-5 sm:flex-row sm:items-center">
        <svg
          viewBox={`0 0 ${BOSS_VIEWBOX.width} ${BOSS_VIEWBOX.height}`}
          width="120"
          height="150"
          role="img"
          aria-label={`${e.nome}, ${e.epiteto}. ${vencido ? 'Já derrotado.' : 'Ainda de pé.'}`}
          className="shrink-0"
        >
          <BossArt shape={e.forma} vencido={vencido} />
        </svg>
        <div className="min-w-0">
          <p className="gx-inscription">
            Guardião errante · {ELEMENTOS[e.elemento].label} · {vencido ? 'derrubado' : 'de pé'}
          </p>
          <h1 className="mt-1.5 text-[26px] leading-tight sm:text-[30px]">{e.nome}</h1>
          <p className="text-sm text-muted-foreground">{e.epiteto}</p>
          <p className="mt-3 text-[15px] text-[var(--gold-anodized)] italic">“{e.fala}”</p>
          <p className="mt-2 text-sm text-muted-foreground">{e.resumo}</p>
        </div>
      </Card>

      <MissionView content={e.missao} spec={spec} />
    </div>
  )
}
