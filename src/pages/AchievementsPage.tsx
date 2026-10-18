import { History, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { AchievementGallery } from '@/components/gamification/AchievementGallery'
import { categoryNames, categoryOrder } from '@/components/gamification/achievement-meta'
import { BackupCard } from '@/components/gamification/BackupCard'
import { NextObjective } from '@/components/gamification/NextObjective'
import { SoundToggle } from '@/components/gamification/SoundToggle'
import { XpBar } from '@/components/gamification/XpBar'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { describeLogEvent } from '@/lib/events-text'
import { formatNumber } from '@/lib/format'
import { formatDay, type AchievementCategory, type Medal } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

type Filter = 'todas' | 'desbloqueadas' | 'pendentes' | 'secretas'

const filters: { id: Filter; label: string; test: (m: Medal) => boolean; empty: string }[] = [
  { id: 'todas', label: 'Todas', test: () => true, empty: 'Nenhuma conquista nesta categoria.' },
  { id: 'desbloqueadas', label: 'Desbloqueadas', test: (m) => m.unlocked, empty: 'Nenhuma conquista desbloqueada nesta seleção ainda. Conclua uma aula ou um desafio para começar.' },
  { id: 'pendentes', label: 'Pendentes', test: (m) => !m.unlocked, empty: 'Nada pendente nesta seleção: você desbloqueou tudo.' },
  { id: 'secretas', label: 'Secretas', test: (m) => m.secret, empty: 'Nenhuma conquista secreta nesta categoria.' },
]

const RECENT = 8

export function AchievementsPage() {
  useDocumentTitle('Relicário — conquistas')
  const { derived, state } = useProgress()
  const [filter, setFilter] = useState<Filter>('todas')
  const [category, setCategory] = useState<AchievementCategory | 'todas'>('todas')

  const { medals } = derived
  const unlocked = medals.filter((m) => m.unlocked).length
  const pct = medals.length ? Math.round((unlocked / medals.length) * 100) : 0
  const names = useMemo(() => Object.fromEntries(medals.map((m) => [m.id, m.name])), [medals])

  const active = filters.find((f) => f.id === filter) ?? filters[0]
  // Conquista secreta ainda oculta não revela a categoria, então não entra num filtro por categoria.
  const inCategory = (m: Medal) => category === 'todas' || (!m.masked && m.category === category)
  const visible = medals.filter((m) => active.test(m) && inCategory(m))
  const count = (f: (typeof filters)[number]) => medals.filter((m) => f.test(m) && inCategory(m)).length

  const recent = state.events.slice(-RECENT).reverse()

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="Relicário · conquistas"
        level="h1"
        title="Suas conquistas"
        description="Cada medalhão guarda uma regra clara e o seu progresso real. É concedido uma única vez; a raridade aparece no desenho, no símbolo e no nome."
      />

      <div className="mt-6 grid gap-4 min-[900px]:grid-cols-[1.1fr_1fr]">
        <Card className="gap-4 p-5">
          <div className="flex items-center gap-3">
            <Trophy className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">
              {unlocked} de {medals.length} conquistas desbloqueadas
            </h2>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso geral das conquistas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-valuetext={`${pct}% das conquistas desbloqueadas`}
            className="gx-gauge h-2.5"
          >
            <div className="gx-gauge-fill" style={{ transform: `translateX(-${100 - pct}%)` }} />
          </div>
          <p className="text-xs text-muted-foreground">
            {pct}% do total · {formatNumber(derived.summary.medalXp)} XP vieram de conquistas.
          </p>
          <XpBar />
        </Card>
        <NextObjective variant="card" className="self-stretch" />
      </div>

      <section aria-labelledby="galeria" className="mt-10">
        <h2 id="galeria" className="sr-only">
          Galeria de conquistas
        </h2>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="gap-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <TabsList aria-label="Filtrar conquistas" className="h-auto flex-wrap">
              {filters.map((f) => (
                <TabsTrigger key={f.id} value={f.id} className="px-3 py-1.5">
                  {f.label}
                  <span className="rounded-[2px] bg-background/60 px-1.5 text-[11px] text-muted-foreground tabular-nums">{count(f)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Label htmlFor="categoria" className="text-xs">
                Categoria:
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as AchievementCategory | 'todas')}>
                <SelectTrigger id="categoria" size="sm" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {categoryOrder.map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryNames[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p role="status" className="mt-3 mb-3 text-xs text-muted-foreground">
            {visible.length} {visible.length === 1 ? 'conquista' : 'conquistas'} em “{active.label}”.
            {filter === 'secretas' || filter === 'todas' ? ' Conquistas secretas mostram nome e descrição só depois de desbloqueadas.' : ''}
          </p>
          {filters.map((f) => (
            <TabsContent key={f.id} value={f.id}>
              <AchievementGallery medals={visible} empty={active.empty} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <div className="mt-10 grid gap-4 min-[900px]:grid-cols-2">
        <Card className="gap-4 p-5">
          <SoundToggle />
        </Card>
        <BackupCard />
      </div>

      <section aria-labelledby="atividade" className="mt-10">
        <h2 id="atividade" className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <History className="size-5 text-primary" aria-hidden="true" /> Atividade recente
        </h2>
        {recent.length ? (
          <ol className="divide-y divide-border rounded-xl border border-border bg-card">
            {recent.map((e) => (
              <li key={`${e.at}-${e.kind}-${e.ref}`} className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-[13px]">
                <span>{describeLogEvent(e.kind, e.ref, names)}</span>
                <time dateTime={new Date(e.at).toISOString()} className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {formatDay(e.day)}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">Nada registrado ainda. Conclua uma etapa da trilha e o histórico aparece aqui.</p>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">O histórico guarda só os registros mais recentes e fica neste navegador.</p>
      </section>
    </div>
  )
}
