import { ArrowRight, CheckCircle2, Circle, Code2, Info } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundHere } from '@/components/common/NotFoundHere'
import { LessonBody } from '@/components/curriculum/LessonBody'
import { platformLabel, subStatus, subStatusText } from '@/components/curriculum/curriculum-ui'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { challengeById } from '@/data/challenges'
import { areaById, challengeIdsOf, lessonOf, moduleById, subById, subsOfModule } from '@/data/curriculum'
import { isChallengeDone, subProgress, findSub } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

export function SubmodulePage() {
  const { area: areaId, module: moduleId, sub: subId } = useParams()
  const { state, ctx, dispatch } = useProgress()
  const area = areaId ? areaById(areaId) : undefined
  const mod = moduleId ? moduleById(moduleId) : undefined
  const sub = subId ? subById(subId) : undefined
  const valid = Boolean(area && mod && sub && mod.area === area.id && sub.module === mod.id)
  useDocumentTitle(valid ? `Submódulo: ${sub!.title}` : 'Submódulo não encontrado')
  if (!area || !mod || !sub || mod.area !== area.id || sub.module !== mod.id) return <NotFoundHere title="Submódulo não encontrado" back="Ver as áreas" to="/areas" />

  const spec = findSub(ctx, sub.id)
  const progress = spec ? subProgress(state, spec) : null
  const status = subStatus(state, ctx, sub.id)
  const lesson = lessonOf(sub.id)
  const challengeIds = challengeIdsOf(sub.id)
  const readOn = state.lessons[sub.id]
  const siblings = subsOfModule(mod.id)
  const index = siblings.findIndex((s) => s.id === sub.id)
  const next = siblings[index + 1]
  const before = sub.recommends.map((id) => subById(id)).filter((s) => s !== undefined)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <header>
        <Breadcrumbs items={[{ label: 'Áreas', to: '/areas' }, { label: area.title, to: `/areas/${area.id}` }, { label: mod.title, to: `/areas/${area.id}/${mod.id}` }, { label: sub.title }]} />
        <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
          Submódulo {index + 1} de {siblings.length}
        </p>
        <h1 className="mt-2 text-2xl leading-tight font-medium tracking-tight sm:text-3xl">{sub.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{sub.objective}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <Badge variant="outline" className="rounded">
            {sub.level}
          </Badge>
          {sub.platforms.map((p) => (
            <Badge key={p} variant="outline" className="rounded">
              {platformLabel[p]}
            </Badge>
          ))}
          <Badge variant="outline" className={cn('rounded', status === 'done' && 'border-primary text-primary')}>
            {subStatusText[status]}
          </Badge>
          {progress ? (
            <span className="text-muted-foreground">
              {progress.done} de {progress.total} atividades obrigatórias
            </span>
          ) : null}
        </div>
      </header>

      {before.length ? (
        <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-[13px] leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <strong>Recomendado antes:</strong>{' '}
            {before.map((b, i) => (
              <span key={b.id}>
                {i > 0 ? ', ' : ''}
                <Link to={`/areas/${b.area}/${b.module}/${b.id}`} className="text-primary underline underline-offset-2">
                  {b.title}
                </Link>
              </span>
            ))}
            . Este submódulo parte do que ele ensina: {before[0].objective} A ordem é só uma sugestão, e nada fica bloqueado.
          </span>
        </p>
      ) : null}

      {status === 'planned' ? (
        <section aria-labelledby="planejado-titulo" className="rounded-xl border border-dashed border-border p-4 sm:p-5">
          <h2 id="planejado-titulo" className="text-lg font-medium">
            Planejado
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Este submódulo ainda não tem aula nem atividades. Ele aparece aqui para mostrar o caminho completo, mas não conta em nenhuma porcentagem de progresso e não pode ser marcado como concluído.
          </p>
        </section>
      ) : null}

      {sub.legacy !== null ? (
        <section aria-labelledby="classico-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="classico-titulo" className="text-lg font-medium">
            Aulas e tarefas
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Este submódulo usa as três etapas de aula, as questões, a atividade prática e o chefe do módulo clássico. O seu progresso anterior foi mantido.
          </p>
          <Button asChild className="mt-3">
            <Link to={`/trilha/modulo/${sub.legacy}`}>
              Abrir o módulo na trilha <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      ) : null}

      {lesson ? (
        <section aria-labelledby="aula-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="aula-titulo" className="text-lg font-medium">
              Aula
            </h2>
            {readOn ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Lida
              </p>
            ) : null}
          </div>
          <div className="mt-3">
            <LessonBody lesson={lesson} />
          </div>
          {!readOn ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => dispatch({ type: 'lessonRead', sub: sub.id })}>
                Marcar a aula como lida
              </Button>
              <span className="text-xs text-muted-foreground">Vale XP uma única vez. É um registro seu: o site não verifica a leitura.</span>
            </div>
          ) : null}
        </section>
      ) : status !== 'planned' && sub.legacy === null ? (
        <p className="rounded-lg border border-dashed border-border p-3 text-[13px] text-muted-foreground">A aula deste submódulo ainda está em preparação. As atividades abaixo já estão disponíveis e valem progresso.</p>
      ) : null}

      {challengeIds.length ? (
        <section aria-labelledby="atividades-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="atividades-titulo" className="flex items-center gap-2 text-lg font-medium">
            <Code2 className="size-5 text-primary" aria-hidden="true" /> Atividades
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Desafios de código fictício e inerte. Os obrigatórios entram no progresso do submódulo quando você os conclui.</p>
          <ul className="mt-3 grid list-none gap-2 p-0">
            {challengeIds.map((id) => {
              const c = challengeById(id)
              if (!c) return null
              const done = isChallengeDone(state.challenges[id])
              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5 text-[13px]">
                  <span className="flex min-w-0 items-center gap-2">
                    {done ? <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" /> : <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                      <span className="sr-only">{done ? 'Concluído: ' : 'Pendente: '}</span>
                      {c.title}
                    </span>
                  </span>
                  <Button asChild size="sm" variant={done ? 'outline' : 'default'}>
                    <Link to={`/desafios?desafio=${id}`}>
                      {done ? 'Rever' : 'Fazer'} <ArrowRight aria-hidden="true" />
                      <span className="sr-only">: {c.title}</span>
                    </Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <nav aria-label="Navegação entre submódulos" className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to={`/areas/${area.id}/${mod.id}`}>Voltar ao módulo</Link>
        </Button>
        {next ? (
          <Button asChild size="sm" className="h-auto max-w-full py-2 text-left whitespace-normal">
            <Link to={`/areas/${area.id}/${mod.id}/${next.id}`}>
              Próximo: {next.title} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </nav>
    </div>
  )
}
