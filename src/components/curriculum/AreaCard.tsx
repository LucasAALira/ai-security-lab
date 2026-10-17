import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Progress } from '@/components/ui/progress'
import type { Area } from '@/data/curriculum'
import { areaRollup } from '@/lib/progress'
import { plural } from '@/lib/format'
import { useProgress } from '@/state/ProgressProvider'
import { areaIcons, rollupPercent } from './curriculum-ui'

/** Card de uma área. O progresso conta só o que é obrigatório e já existe; o que está planejado aparece à parte. */
export function AreaCard({ area, headingLevel: H = 'h3' }: { area: Area; headingLevel?: 'h2' | 'h3' }) {
  const { state, ctx } = useProgress()
  const r = areaRollup(state, ctx, area.id)
  const pct = rollupPercent(r)
  const Icon = areaIcons[area.icon]
  const planned = r.subsTotal - r.subsAvailable
  return (
    <li className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-tint-line bg-tint text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <H className="text-lg leading-snug font-medium">
            <Link to={`/areas/${area.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              {area.title}
            </Link>
          </H>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{area.summary}</p>
        </div>
      </div>
      <div className="mt-3">
        {pct === null ? (
          <p className="text-xs text-muted-foreground">Nenhuma atividade obrigatória ainda: o progresso desta área começa quando houver conteúdo para concluir.</p>
        ) : (
          <>
            <Progress value={pct} aria-label={`${pct}% das atividades obrigatórias da área ${area.title}`} className="h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {r.done} de {r.total} {plural(r.total, 'atividade obrigatória', 'atividades obrigatórias')} · {pct}%
            </p>
          </>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {r.subsAvailable} de {r.subsTotal} submódulos com conteúdo{planned > 0 ? `, ${planned} planejados` : ''}
        </p>
      </div>
      <div className="mt-auto pt-3">
        <Link to={`/areas/${area.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          Abrir a área <ArrowRight className="size-4" aria-hidden="true" />
          <span className="sr-only">: {area.title}</span>
        </Link>
      </div>
    </li>
  )
}
