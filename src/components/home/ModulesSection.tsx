import { ArrowRight, Check, Coins, Lock } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { TierChip } from '@/components/gamification/TierChip'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { NewSeal } from '@/components/common/NewSeal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { modules } from '@/data/modules'
import type { Category } from '@/data/types'
import { CORE_MODULE_COUNT, isModuleComplete, moduleSteps, moduleXp, nextTierFor, tierFor, TASKS_PER_MODULE, MODULE_XP } from '@/lib/progress'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { isNewClassicModule } from '@/data/whats-new'
import { useProgress } from '@/state/ProgressProvider'

export type ModuleFilter = 'Todos' | Category
export const moduleFilters: ModuleFilter[] = ['Todos', 'Fundamentos', 'Ataques e defesa', 'Governança', 'Regulação', 'Engenharia reversa']

interface Props {
  filter: ModuleFilter
  onFilterChange: (filter: ModuleFilter) => void
}

/** O cartão do React Bits usa as mesmas cores do tema do site, em vez das próprias. */
const CARD_VARS = { '--spotlight-card-surface': 'var(--card)', '--spotlight-card-border': 'var(--border)', '--spotlight-card-shadow': 'none' } as React.CSSProperties

export function ModulesSection({ filter, onFilterChange }: Props) {
  const { state, derived } = useProgress()
  const [term, setTerm] = useState('')
  const q = term.toLocaleLowerCase('pt-BR')
  const shown = modules.filter((m) => (filter === 'Todos' || m.category === filter) && `${m.title} ${m.summary}`.toLocaleLowerCase('pt-BR').includes(q))
  const pct = Math.round((derived.summary.complete / CORE_MODULE_COUNT) * 100)

  return (
    <section id="trilhas" aria-labelledby="trilhas-titulo" className="mb-14">
      <SectionHeading eyebrow="CONTEÚDO" id="trilhas-titulo" title="Módulos de estudo" description="Comece pelos fundamentos e avance até a governança. A engenharia reversa é um módulo extra, de acesso antecipado." aside={`${pct}% concluído`} />
      <Progress value={pct} aria-label="Módulos concluídos" className="my-5 h-[3px]" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtrar módulos" className="flex flex-wrap gap-1.5">
          {moduleFilters.map((f) => (
            <Button key={f} size="sm" variant={f === filter ? 'secondary' : 'ghost'} aria-pressed={f === filter} className={cn('h-8 text-[11px]', f !== filter && 'text-muted-foreground')} onClick={() => onFilterChange(f)}>
              {f}
            </Button>
          ))}
        </div>
        <Input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar tema…" aria-label="Buscar módulos" className="h-9 w-full text-xs sm:w-44" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 min-[1151px]:grid-cols-3">
        {shown.map((m) => {
          const s = state.modules[m.id]
          const steps = moduleSteps(s)
          const done = isModuleComplete(s)
          const t = derived.trail[m.id]
          const gated = Boolean(m.earlyAccess) && !t.unlocked
          return (
            <SpotlightCard
              key={m.slug}
              spotlightColor="var(--primary)"
              intensity={0.12}
              spotlightSize={260}
              style={CARD_VARS}
              className="flex min-h-[265px] flex-col !rounded-[10px] bg-[linear-gradient(150deg,var(--tint-strong),var(--card))] !p-6 transition-transform motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-mono text-lg text-muted-foreground">
                  {m.number}
                  {isNewClassicModule(m.id) ? <NewSeal title={`módulo ${m.title}`} /> : null}
                </span>
                <Badge variant="secondary" className="rounded text-[9px] text-primary">
                  {gated ? <Lock className="size-2.5" aria-hidden="true" /> : null}
                  {gated ? 'Acesso antecipado' : m.category}
                </Badge>
              </div>
              <h3 className="mt-6 mb-1 text-[19px] leading-snug font-medium">{m.title}</h3>
              <p className="mb-5 text-xs text-muted-foreground">{m.summary}</p>
              {gated ? (
                <p className="mt-auto mb-3.5 rounded-md border border-dashed border-tint-line bg-tint px-2 py-1.5 text-[11px] text-foreground/80">
                  {m.level} · <Coins className="mr-0.5 inline size-3 align-[-1px] text-primary" aria-hidden="true" />
                  {formatNumber(t.price ?? 0)} moedas para abrir agora, ou de graça pelos módulos {t.missing.map((p) => modules[p].number).join(' e ')}
                </p>
              ) : (
                <p className="mt-auto mb-3.5 rounded-md border border-border bg-tint px-2 py-1.5 text-[11px] text-foreground/75" aria-label={nextTierFor(steps, TASKS_PER_MODULE) ? undefined : 'Medalha máxima'}>
                  {m.level} · {steps}/{TASKS_PER_MODULE} tarefas · {moduleXp(s)}/{MODULE_XP} XP {tierFor(steps, TASKS_PER_MODULE) ? <TierChip tier={tierFor(steps, TASKS_PER_MODULE)} className="ml-1" /> : null}
                </p>
              )}
              <Link to={`/modulo/${m.id}`} state={{ overlay: true }} className="flex items-center justify-between border-t border-border pt-3.5 text-xs text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring">
                {done ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="size-3.5" aria-hidden="true" /> Revisar módulo
                  </span>
                ) : gated ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="size-3.5" aria-hidden="true" /> Ver prévia e desbloquear
                  </span>
                ) : (
                  'Estudar módulo'
                )}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              {gated ? (
                <Link to="/em-breve" className="mt-3 text-[11px] leading-normal text-foreground/60 hover:text-primary">
                  Ver o que vem por aí →
                </Link>
              ) : (
                <Link to={`/materias/${m.slug}`} className="mt-3 text-[11px] leading-normal text-foreground/60 hover:text-primary">
                  Ler matéria completa →
                </Link>
              )}
            </SpotlightCard>
          )
        })}
      </div>
      {shown.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nenhum módulo encontrado. Tente outro tema.</p> : null}
    </section>
  )
}
