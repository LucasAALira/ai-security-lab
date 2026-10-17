import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundHere } from '@/components/common/NotFoundHere'
import { SectionHeading } from '@/components/common/SectionHeading'
import { areaIcons, rollupPercent } from '@/components/curriculum/curriculum-ui'
import { ResumeCard } from '@/components/curriculum/ResumeCard'
import { Progress } from '@/components/ui/progress'
import { areaById, modulesOfArea } from '@/data/curriculum'
import { plural } from '@/lib/format'
import { isModuleCurriculumDone, moduleRollup, areaRollup } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

export function AreaPage() {
  const { area: areaId } = useParams()
  const { state, ctx } = useProgress()
  const area = areaId ? areaById(areaId) : undefined
  useDocumentTitle(area ? `Área: ${area.title}` : 'Área não encontrada')
  if (!area) return <NotFoundHere title="Área não encontrada" back="Ver as áreas" to="/areas" />

  const Icon = areaIcons[area.icon]
  const roll = areaRollup(state, ctx, area.id)
  const pct = rollupPercent(roll)
  const mods = modulesOfArea(area.id)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <div>
        <Breadcrumbs items={[{ label: 'Áreas', to: '/areas' }, { label: area.title }]} />
        <SectionHeading eyebrow="ÁREA" level="h1" title={<span className="inline-flex items-center gap-3"><Icon className="size-7 text-primary" aria-hidden="true" /> {area.title}</span>} description={area.summary} />
        <div className="mt-4 max-w-xl">
          {pct === null ? (
            <p className="text-xs text-muted-foreground">Sem atividades obrigatórias concluíveis ainda. {roll.subsTotal} submódulos planejados.</p>
          ) : (
            <>
              <Progress value={pct} aria-label={`${pct}% das atividades obrigatórias da área`} className="h-1.5" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {roll.done} de {roll.total} atividades obrigatórias · {roll.subsComplete} de {roll.subsAvailable} submódulos com conteúdo concluídos · {roll.subsTotal - roll.subsAvailable} planejados
              </p>
            </>
          )}
        </div>
      </div>
      <ResumeCard />
      <ol className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-4 p-0 md:grid-cols-2">
        {mods.map((m, i) => {
          const r = moduleRollup(state, ctx, m.id)
          const p = rollupPercent(r)
          const done = isModuleCurriculumDone(state, ctx, m.id)
          return (
            <li key={m.id} className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Módulo {i + 1}</p>
              <h2 className="mt-1 text-lg leading-snug font-medium">
                <Link to={`/areas/${area.id}/${m.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {m.title}
                </Link>
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{m.summary}</p>
              <div className="mt-3">
                {p === null ? (
                  <p className="text-xs text-muted-foreground">Planejado: nenhum submódulo tem conteúdo ainda ({r.subsTotal} previstos).</p>
                ) : (
                  <>
                    <Progress value={p} aria-label={`${p}% do módulo ${m.title}`} className="h-1.5" />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {r.done} de {r.total} {plural(r.total, 'atividade', 'atividades')} · {r.subsAvailable} de {r.subsTotal} submódulos com conteúdo{done ? ' · módulo concluído' : ''}
                    </p>
                  </>
                )}
              </div>
              <div className="mt-auto pt-3">
                <Link to={`/areas/${area.id}/${m.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  Ver os submódulos <ArrowRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">: {m.title}</span>
                </Link>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
