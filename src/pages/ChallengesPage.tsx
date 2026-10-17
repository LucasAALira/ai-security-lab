import { Bug, CheckCircle2, Circle, Lock, Search, Target } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CodeChallenge } from '@/components/challenge/CodeChallenge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { challenges } from '@/data/challenges'
import { areaTitleOf, areas, subById } from '@/data/curriculum'
import { modules } from '@/data/modules'
import type { CodeChallenge as Challenge } from '@/data/types'
import { isChallengeDone } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

const GOALS = ['explorador-de-falhas', 'guardiao-das-apis', 'codigo-protegido', 'sem-ajuda', 'defensor-web', 'defensor-de-apis', 'defensor-mobile', 'cadeia-de-suprimentos']

const ALL = 'todos'
const levels = ['Básico', 'Intermediário', 'Avançado'] as const
const platforms: { id: string; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'api', label: 'API' },
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
  { id: 'ia', label: 'IA' },
  { id: 'supply', label: 'Cadeia de suprimentos' },
]
const statusText = { done: 'Concluído', locked: 'Bloqueado', progress: 'Em andamento', new: 'Novo' } as const
type Status = keyof typeof statusText

/** Seção em que o desafio aparece na lista: o módulo clássico ou a área. */
const sectionOf = (c: Challenge) => (c.module !== null ? { key: `m${c.module}`, title: `Módulo ${modules[c.module].number}` } : { key: `a-${subById(c.submodule)?.area ?? 'x'}`, title: areaTitleOf(c.submodule) })

export function ChallengesPage() {
  useDocumentTitle('Laboratório de código')
  const { state, derived } = useProgress()
  const [params, setParams] = useSearchParams()

  const statusOf = (c: Challenge): Status => {
    const run = state.challenges[c.id]
    if (isChallengeDone(run)) return 'done'
    if (c.module !== null && !derived.trail[c.module]?.unlocked) return 'locked'
    return run && (run.attempts > 0 || run.run.identified) ? 'progress' : 'new'
  }

  const q = (params.get('q') ?? '').trim().toLowerCase()
  const wantedModule = params.get('modulo')
  const moduleFilter = wantedModule !== null && /^\d+$/.test(wantedModule) && Number(wantedModule) < modules.length ? Number(wantedModule) : null
  const area = areas.find((a) => a.id === params.get('area'))?.id ?? ALL
  const platform = platforms.find((p) => p.id === params.get('plataforma'))?.id ?? ALL
  const level = levels.find((l) => l === params.get('nivel')) ?? ALL
  const status = (Object.keys(statusText) as Status[]).find((s) => s === params.get('estado')) ?? ALL

  const shown = useMemo(
    () =>
      challenges.filter((c) => {
        if (moduleFilter !== null && c.module !== moduleFilter) return false
        if (area !== ALL && subById(c.submodule)?.area !== area) return false
        if (platform !== ALL && !c.tags.includes(platform)) return false
        if (level !== ALL && c.level !== level) return false
        if (status !== ALL && statusOf(c) !== status) return false
        if (q && !`${c.title} ${c.scenario} ${c.file} ${c.tags.join(' ')}`.toLowerCase().includes(q)) return false
        return true
      }),
    // statusOf depende do progresso; recalcular quando ele muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [moduleFilter, area, platform, level, status, q, state.challenges, derived.trail],
  )

  // O desafio aberto vem do endereço; sem ele, o primeiro ainda não concluído e liberado (o próximo objetivo).
  const available = (c: Challenge) => statusOf(c) !== 'done' && statusOf(c) !== 'locked'
  const wanted = params.get('desafio')
  const pool = shown.length ? shown : challenges
  const active = challenges.find((c) => c.id === wanted) ?? pool.find(available) ?? pool[0]
  const activeIndex = challenges.findIndex((c) => c.id === active.id)
  const following = challenges.slice(activeIndex + 1).concat(challenges.slice(0, activeIndex)).find(available)

  const setParam = (key: string, value: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === ALL || value === '') next.delete(key)
      else next.set(key, value)
      return next
    })
  const open = (id: string) => setParam('desafio', id)
  const done = challenges.filter((c) => isChallengeDone(state.challenges[c.id])).length
  const goals = derived.medals.filter((m) => GOALS.includes(m.id))

  const sections = useMemo(() => {
    const map = new Map<string, { key: string; title: string; list: Challenge[] }>()
    for (const c of shown) {
      const s = sectionOf(c)
      if (!map.has(s.key)) map.set(s.key, { ...s, list: [] })
      map.get(s.key)!.list.push(c)
    }
    return [...map.values()]
  }, [shown])
  const filtered = moduleFilter !== null || area !== ALL || platform !== ALL || level !== ALL || status !== ALL || q !== ''

  const filterSelect = (id: string, label: string, value: string, set: (v: string) => void, options: { id: string; label: string }[]) => (
    <div className="min-w-0">
      <Label htmlFor={id} className="mb-1 text-[11px] text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={set}>
        <SelectTrigger id={id} className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="PRÁTICA"
        level="h1"
        title="Laboratório de código"
        description="Leia o código, marque as linhas vulneráveis e escolha a correção. Dicas ajudam, mas tiram o “Sem Ajuda” da tentativa. Dá para repetir qualquer desafio. Todo o código é fictício e inerte."
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

      <form role="search" aria-label="Filtrar desafios" className="mt-5 grid gap-2.5 sm:grid-cols-2 min-[1000px]:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]" onSubmit={(e) => e.preventDefault()}>
        <div className="min-w-0">
          <Label htmlFor="busca-desafio" className="mb-1 text-[11px] text-muted-foreground">
            Buscar
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="busca-desafio" type="search" value={params.get('q') ?? ''} onChange={(e) => setParam('q', e.target.value)} placeholder="título, arquivo ou etiqueta" className="h-8 pl-8 text-xs" />
          </div>
        </div>
        {filterSelect('filtro-area', 'Área', area, (v) => setParam('area', v), areas.map((a) => ({ id: a.id, label: a.title })))}
        {filterSelect('filtro-plataforma', 'Plataforma', platform, (v) => setParam('plataforma', v), platforms)}
        {filterSelect('filtro-nivel', 'Nível', level, (v) => setParam('nivel', v), levels.map((l) => ({ id: l, label: l })))}
        {filterSelect('filtro-estado', 'Estado', status, (v) => setParam('estado', v), (Object.keys(statusText) as Status[]).map((s) => ({ id: s, label: statusText[s] })))}
      </form>
      <p role="status" aria-live="polite" className="mt-2 text-xs text-muted-foreground">
        {filtered ? `${shown.length} de ${challenges.length} desafios.` : `${challenges.length} desafios.`}{' '}
        {filtered ? (
          <Link to="/desafios" className="text-primary underline underline-offset-2">
            Limpar filtros
          </Link>
        ) : null}
      </p>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 min-[1000px]:grid-cols-[300px_minmax(0,1fr)]">
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
                {sections.map(({ key, title, list }) => (
                  <SelectGroup key={key}>
                    <SelectLabel>{title}</SelectLabel>
                    {list.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title} ({statusText[statusOf(c)]})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card className="hidden max-h-[70vh] gap-3 overflow-y-auto p-3 min-[1000px]:flex">
            {sections.length === 0 ? <p className="px-1 text-xs text-muted-foreground">Nenhum desafio com esses filtros.</p> : null}
            {sections.map(({ key, title, list }) => (
              <div key={key}>
                <h2 className="px-1 pb-1 text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">{title}</h2>
                <ul className="grid gap-0.5">
                  {list.map((c) => {
                    const st = statusOf(c)
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
                              {statusText[st]} · {c.kind === 'auth' ? 'autorização' : 'identificação'} · {c.level}
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
