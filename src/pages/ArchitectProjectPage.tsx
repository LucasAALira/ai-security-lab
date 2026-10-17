import { Lock, RotateCcw } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { AdrStage } from '@/components/architect/AdrStage'
import { AnalysisStage } from '@/components/architect/AnalysisStage'
import { REVIEW_AFTER_RUNS, STAGES, type StageId } from '@/components/architect/architect-ui'
import { EvaluationStage } from '@/components/architect/EvaluationStage'
import { ProjectBrief } from '@/components/architect/ProjectBrief'
import { ReviewStage } from '@/components/architect/ReviewStage'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundHere } from '@/components/common/NotFoundHere'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { architectById } from '@/data/architect'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

export function ArchitectProjectPage() {
  const { project: id } = useParams()
  const project = id ? architectById(id) : undefined
  useDocumentTitle(project ? `Arquiteto: ${project.title}` : 'Projeto não encontrado')
  const { state, dispatch } = useProgress()
  const [params, setParams] = useSearchParams()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  const stage: StageId = STAGES.find((s) => s.id === params.get('etapa'))?.id ?? 'projeto'
  const st = project ? state.architect[project.id] : undefined
  const reviewOpen = Boolean(st?.evaluated) || (st?.runs ?? 0) >= REVIEW_AFTER_RUNS

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [stage])

  if (!project) return <NotFoundHere title="Projeto não encontrado" to="/arquiteto" back="Ver os projetos" />

  const go = (s: StageId) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (s === 'projeto') next.delete('etapa')
      else next.set('etapa', s)
      return next
    })

  const index = STAGES.findIndex((s) => s.id === stage)
  const label = STAGES[index].label

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: 'Modo Arquiteto', to: '/arquiteto' }, { label: project.title }]} />
      <header>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
          Modo Arquiteto · {project.company} (empresa fictícia)
        </p>
        <h1 className="mt-2 text-2xl leading-tight font-medium tracking-tight sm:text-3xl">{project.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{project.level}</span>
          <span aria-hidden="true">·</span>
          <span>cerca de {project.minutes} min</span>
          {st?.evaluated ? <Badge variant="outline" className="rounded border-primary text-primary">Revisão aprovada</Badge> : null}
          {st?.adrDone ? <Badge variant="outline" className="rounded border-primary text-primary">ADR registrada</Badge> : null}
        </div>
      </header>

      <nav aria-label="Etapas da revisão">
        <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-xs">
          {STAGES.map((s, i) => {
            const locked = s.id === 'revisao' && !reviewOpen
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  disabled={locked}
                  aria-current={stage === s.id ? 'step' : undefined}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60',
                    stage === s.id ? 'border-primary bg-tint-strong text-foreground' : 'border-border hover:border-primary',
                  )}
                >
                  {locked ? <Lock className="size-3" aria-hidden="true" /> : null}
                  {i + 1}. {s.label}
                  {locked ? <span className="sr-only"> (abre depois da aprovação ou de {REVIEW_AFTER_RUNS} avaliações)</span> : null}
                </button>
              </li>
            )
          })}
        </ol>
        {!reviewOpen ? <p className="mt-1.5 text-xs text-muted-foreground">A revisão comentada mostra as respostas e abre depois da aprovação ou de {REVIEW_AFTER_RUNS} avaliações.</p> : null}
      </nav>

      <section aria-labelledby="etapa-arquiteto" className="grid grid-cols-[minmax(0,1fr)] gap-4">
        <h2 id="etapa-arquiteto" ref={headingRef} tabIndex={-1} className="text-lg font-medium outline-none">
          {index + 1}. {label}
        </h2>
        {stage === 'projeto' ? <ProjectBrief project={project} /> : null}
        {stage === 'analise' ? <AnalysisStage project={project} st={st} /> : null}
        {stage === 'avaliacao' ? <EvaluationStage project={project} st={st} onReview={() => go('revisao')} /> : null}
        {stage === 'adr' ? <AdrStage project={project} st={st} /> : null}
        {stage === 'revisao' && reviewOpen ? <ReviewStage project={project} /> : null}
        {stage === 'revisao' && !reviewOpen ? <p className="text-sm text-muted-foreground">A revisão abre depois da aprovação ou de {REVIEW_AFTER_RUNS} avaliações.</p> : null}

        <div className="flex flex-wrap gap-2">
          {index < STAGES.length - 1 && !(STAGES[index + 1].id === 'revisao' && !reviewOpen) ? (
            <Button type="button" onClick={() => go(STAGES[index + 1].id)} className="h-auto max-w-full py-2 whitespace-normal">
              Próxima etapa: {STAGES[index + 1].label}
            </Button>
          ) : null}
          {st?.started && (stage === 'analise' || stage === 'avaliacao') ? (
            <Button type="button" variant="outline" onClick={() => dispatch({ type: 'architectReset', project: project.id })}>
              <RotateCcw aria-hidden="true" /> Recomeçar a análise
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  )
}
