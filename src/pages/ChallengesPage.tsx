import { Bug, CheckCircle2, Circle, Lock, Target } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CodeChallenge } from '@/components/challenge/CodeChallenge'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { challenges } from '@/data/challenges'
import { modules } from '@/data/modules'
import { isChallengeDone } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

const GOALS = ['explorador-de-falhas', 'guardiao-das-apis', 'codigo-protegido', 'sem-ajuda']

export function ChallengesPage() {
  useDocumentTitle('Laboratório de código')
  const { state, derived } = useProgress()
  const [params, setParams] = useSearchParams()

  const statusOf = (id: string, module: number) => {
    const c = state.challenges[id]
    if (isChallengeDone(c)) return 'done' as const
    if (!derived.trail[module]?.unlocked) return 'locked' as const
    return c && (c.attempts > 0 || c.run.identified) ? ('progress' as const) : ('new' as const)
  }
  const statusText = { done: 'Concluído', locked: 'Bloqueado', progress: 'Em andamento', new: 'Novo' } as const

  const wantedModule = params.get('modulo')
  const moduleFilter = wantedModule !== null && /^\d+$/.test(wantedModule) && Number(wantedModule) < modules.length ? Number(wantedModule) : null
  const shown = moduleFilter === null ? challenges : challenges.filter((c) => c.module === moduleFilter)

  // O desafio aberto vem do endereço; sem ele, o primeiro ainda não concluído e liberado (o próximo objetivo).
  const wanted = params.get('desafio')
  const fallback = challenges.find((c) => statusOf(c.id, c.module) !== 'done' && statusOf(c.id, c.module) !== 'locked') ?? challenges[0]
  const active = challenges.find((c) => c.id === wanted) ?? (shown.length ? shown.find((c) => statusOf(c.id, c.module) !== 'done' && statusOf(c.id, c.module) !== 'locked') ?? shown[0] : fallback)
  const activeIndex = challenges.findIndex((c) => c.id === active.id)
  const following = challenges.slice(activeIndex + 1).concat(challenges.slice(0, activeIndex)).find((c) => statusOf(c.id, c.module) !== 'done' && statusOf(c.id, c.module) !== 'locked')

  const open = (id: string) => setParams((prev) => { const next = new URLSearchParams(prev); next.set('desafio', id); return next })
  const done = challenges.filter((c) => isChallengeDone(state.challenges[c.id])).length
  const goals = derived.medals.filter((m) => GOALS.includes(m.id))

  const byModule = modules.map((m) => ({ m, list: shown.filter((c) => c.module === m.id) })).filter((g) => g.list.length)

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="PRÁTICA"
        level="h1"
        title="Laboratório de código"
        description="Leia o código, marque as linhas vulneráveis e escolha a correção. Dicas ajudam, mas tiram o “Sem Ajuda” da tentativa. Dá para repetir qualquer desafio."
        aside={`${done}/${challenges.length} concluídos`}
      />

      <ul aria-label="Metas das conquistas deste laboratório" className="mt-5 grid gap-2.5 sm:grid-cols-2 min-[1151px]:grid-cols-4">
        {goals.map((g) => (
          <li key={g.id} className="rounded-lg border border-border bg-card px-3.5 py-2.5">
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Target className="size-3.5 text-primary" aria-hidden="true" /> {g.name}
            </p>
            <p className="mt-1 text-sm font-medium">
              {g.unlocked ? (
                <span className="inline-flex items-center gap-1 text-primary">
                  <CheckCircle2 className="size-4" aria-hidden="true" /> Conquistada
                </span>
              ) : (
                <>
                  {g.value} de {g.target}
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-5 min-[1000px]:grid-cols-[300px_minmax(0,1fr)]">
        <aside aria-label="Lista de desafios" className="min-[1000px]:sticky min-[1000px]:top-4 min-[1000px]:self-start">
          <div className="min-[1000px]:hidden">
            <Label htmlFor="escolher-desafio" className="mb-1.5 text-xs">
              Desafio:
            </Label>
            <Select value={active.id} onValueChange={open}>
              <SelectTrigger id="escolher-desafio" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {byModule.map(({ m, list }) => (
                  <SelectGroup key={m.id}>
                    <SelectLabel>
                      Módulo {m.number}
                    </SelectLabel>
                    {list.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title} ({statusText[statusOf(c.id, c.module)]})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card className="hidden gap-3 p-3 min-[1000px]:flex">
            {moduleFilter !== null ? (
              <p className="px-1 text-xs text-muted-foreground">
                Mostrando só o módulo {modules[moduleFilter].number}.{' '}
                <Link to="/desafios" className="text-primary underline underline-offset-2">
                  Ver todos
                </Link>
              </p>
            ) : null}
            {byModule.map(({ m, list }) => (
              <div key={m.id}>
                <h2 className="px-1 pb-1 text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
                  Módulo {m.number}
                </h2>
                <ul className="grid gap-0.5">
                  {list.map((c) => {
                    const st = statusOf(c.id, c.module)
                    const Icon = st === 'done' ? CheckCircle2 : st === 'locked' ? Lock : st === 'progress' ? Bug : Circle
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          aria-current={c.id === active.id ? 'true' : undefined}
                          onClick={() => open(c.id)}
                          className={cn('flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-[13px] leading-snug hover:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none', c.id === active.id && 'bg-tint-strong text-primary')}
                        >
                          <Icon className={cn('mt-0.5 size-4 shrink-0', st === 'done' ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true" />
                          <span className="min-w-0">
                            {c.title}
                            <span className="block text-[11px] text-muted-foreground">
                              {statusText[st]} · {c.kind === 'auth' ? 'autorização' : 'identificação'}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </Card>
        </aside>

        <CodeChallenge key={active.id} id={active.id} nextTo={following ? `/desafios?desafio=${following.id}` : undefined} />
      </div>
    </div>
  )
}
