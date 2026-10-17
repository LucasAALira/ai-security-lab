import { ArrowRight, CheckCircle2, Circle, CircleDashed, Flag, Loader } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundHere } from '@/components/common/NotFoundHere'
import { SectionHeading } from '@/components/common/SectionHeading'
import { platformLabel, rollupPercent, subStatus, subStatusText, type SubStatus } from '@/components/curriculum/curriculum-ui'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { architectById } from '@/data/architect'
import { missionContentById } from '@/data/campaigns'
import { challengeById } from '@/data/challenges'
import { areaById, challengeIdsOf, lessonOf, moduleById, subsOfModule } from '@/data/curriculum'
import { plural } from '@/lib/format'
import { isChallengeDone, isModuleCurriculumDone, missionDone, moduleRollup, type StudyState } from '@/lib/progress'
import type { CurriculumModule } from '@/data/curriculum/types'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

type IntegratorRef = NonNullable<CurriculumModule['integrator']>

function integratorInfo(i: IntegratorRef): { href: string; kind: string; title: string } {
  if (i.kind === 'challenge') return { href: `/desafios?desafio=${i.id}`, kind: 'Desafio de código', title: challengeById(i.id)?.title ?? i.id }
  if (i.kind === 'architect') return { href: `/arquiteto/${i.id}`, kind: 'Projeto do modo Arquiteto', title: architectById(i.id)?.title ?? i.id }
  const m = missionContentById(i.id)
  return { href: m ? `/campanhas/${m.campaign}/${m.id}` : '/campanhas', kind: 'Missão', title: m?.title ?? i.id }
}

function integratorDone(s: StudyState, i: IntegratorRef): boolean {
  if (i.kind === 'challenge') return isChallengeDone(s.challenges[i.id])
  if (i.kind === 'architect') return Boolean(s.architect[i.id]?.evaluated)
  return missionDone(s, i.id)
}

const statusIcon: Record<SubStatus, typeof Circle> = { planned: CircleDashed, new: Circle, progress: Loader, done: CheckCircle2 }

export function ModulePage() {
  const { area: areaId, module: moduleId } = useParams()
  const { state, ctx } = useProgress()
  const area = areaId ? areaById(areaId) : undefined
  const mod = moduleId ? moduleById(moduleId) : undefined
  const valid = Boolean(area && mod && mod.area === area.id)
  useDocumentTitle(valid ? `Módulo: ${mod!.title}` : 'Módulo não encontrado')
  if (!area || !mod || mod.area !== area.id) return <NotFoundHere title="Módulo não encontrado" back="Ver as áreas" to="/areas" />

  const subs = subsOfModule(mod.id)
  const roll = moduleRollup(state, ctx, mod.id)
  const pct = rollupPercent(roll)
  const done = isModuleCurriculumDone(state, ctx, mod.id)
  const before = mod.recommends.map((id) => moduleById(id)).filter((m) => m !== undefined)
  const missing = roll.subsAvailable - roll.subsComplete
  const integrator = mod.integrator ? integratorInfo(mod.integrator) : null
  const integratorIsDone = mod.integrator ? integratorDone(state, mod.integrator) : false

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <div>
        <Breadcrumbs items={[{ label: 'Áreas', to: '/areas' }, { label: area.title, to: `/areas/${area.id}` }, { label: mod.title }]} />
        <SectionHeading eyebrow={`MÓDULO · ${area.title.toUpperCase()}`} level="h1" title={mod.title} description={mod.summary} />
        <div className="mt-4 max-w-xl">
          {pct === null ? (
            <p className="text-xs text-muted-foreground">Planejado: nenhum submódulo deste módulo tem conteúdo ainda, então não há progresso a medir.</p>
          ) : (
            <>
              <Progress value={pct} aria-label={`${pct}% das atividades obrigatórias do módulo`} className="h-1.5" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {roll.done} de {roll.total} {plural(roll.total, 'atividade obrigatória', 'atividades obrigatórias')} · {roll.subsComplete} de {roll.subsAvailable} submódulos com conteúdo concluídos · {roll.subsTotal - roll.subsAvailable} planejados
              </p>
            </>
          )}
        </div>
      </div>

      {before.length ? (
        <section aria-labelledby="antes-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="antes-titulo" className="text-base font-medium">
            Recomendado antes
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">É uma recomendação de ordem de estudo. Nada aqui fica bloqueado: o conteúdo abre mesmo que você ainda não tenha passado por estes módulos.</p>
          <ul className="mt-2 grid gap-2 pl-0 text-[13px]">
            {before.map((b) => (
              <li key={b.id} className="list-none">
                <Link to={`/areas/${b.area}/${b.id}`} className="font-medium text-primary underline underline-offset-2">
                  {b.title}
                </Link>
                <span className="text-muted-foreground"> — {b.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="subs-titulo">
        <h2 id="subs-titulo" className="text-lg font-medium">
          Submódulos
        </h2>
        <ol className="m-0 mt-3 grid list-none grid-cols-[minmax(0,1fr)] gap-3 p-0">
          {subs.map((s, i) => {
            const st = subStatus(state, ctx, s.id)
            const Icon = statusIcon[st]
            const challengeCount = challengeIdsOf(s.id).length
            const hasLesson = Boolean(lessonOf(s.id))
            return (
              <li key={s.id} className={cn('rounded-xl border bg-card p-4', st === 'planned' ? 'border-dashed border-border' : 'border-border')}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="min-w-0 text-base leading-snug font-medium">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                    <Link to={`/areas/${area.id}/${mod.id}/${s.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                      {s.title}
                    </Link>
                  </h3>
                  <Badge variant="outline" className={cn('shrink-0 rounded', st === 'done' && 'border-primary text-primary')}>
                    <Icon aria-hidden="true" /> {subStatusText[st]}
                  </Badge>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.objective}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Badge variant="outline" className="rounded text-[10px]">
                    {s.level}
                  </Badge>
                  {s.platforms.map((p) => (
                    <Badge key={p} variant="outline" className="rounded text-[10px]">
                      {platformLabel[p]}
                    </Badge>
                  ))}
                  <span>
                    {st === 'planned'
                      ? 'Sem aula nem atividades ainda'
                      : s.legacy !== null
                        ? 'Aulas, tarefas e chefe do módulo clássico'
                        : `${hasLesson ? 'Aula' : 'Sem aula ainda'}${challengeCount ? ` · ${challengeCount} ${plural(challengeCount, 'desafio', 'desafios')}` : ''}`}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        <section aria-labelledby="integrador-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="integrador-titulo" className="flex items-center gap-2 text-base font-medium">
            <Flag className="size-4 text-primary" aria-hidden="true" /> Desafio integrador
          </h2>
          {integrator ? (
            <>
              <p className="mt-1 text-xs text-muted-foreground">Um cenário que junta o que os submódulos ensinam. É a prática recomendada para fechar o módulo; a porcentagem do módulo continua medida pelos submódulos.</p>
              <p className="mt-2 text-[13px]">
                <span className="text-muted-foreground">{integrator.kind}: </span>
                <span className="font-medium">{integrator.title}</span>
                {integratorIsDone ? (
                  <Badge variant="outline" className="ml-2 rounded border-primary text-primary">
                    <CheckCircle2 aria-hidden="true" /> Concluído
                  </Badge>
                ) : null}
              </p>
              <p className="mt-2 text-[13px]">
                <Link to={integrator.href} className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-2">
                  {integratorIsDone ? 'Rever o integrador' : 'Abrir o integrador'} <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-2 text-[13px] text-muted-foreground">Planejado. Ainda não há um desafio que reúna os submódulos deste módulo, então ele não conta como etapa concluída.</p>
          )}
        </section>
        <section aria-labelledby="checkpoint-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="checkpoint-titulo" className="text-base font-medium">
            Checkpoint do módulo
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed">
            {roll.subsAvailable === 0
              ? 'Sem conteúdo ainda: o checkpoint abre quando o primeiro submódulo for publicado.'
              : done
                ? 'Concluído: todos os submódulos com conteúdo foram feitos.'
                : `Faltam ${missing} ${plural(missing, 'submódulo com conteúdo', 'submódulos com conteúdo')} para fechar o checkpoint. Os submódulos planejados não entram na conta.`}
          </p>
        </section>
      </div>
    </div>
  )
}
