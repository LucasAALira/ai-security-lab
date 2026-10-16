import CountUp from '@/components/reactbits/CountUp'
import { Progress } from '@/components/ui/progress'
import { formatNumber, plural, tierNames } from '@/lib/format'
import { formatDay, MAX_TASK_XP, maxXp } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

export function XpPanel() {
  const { derived, ctx, state } = useProgress()
  const { summary, level, medals, streak } = derived
  const got = medals.filter((m) => m.unlocked)
  const recent = [...got].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 3)
  const next = level.next
  const bonus = maxXp(ctx).medals
  const pct = next ? Math.min(100, ((summary.xp - level.start) / (next - level.start)) * 100) : 100

  return (
    <>
      <div className="mt-4 grid gap-x-6 gap-y-3 rounded-xl border border-tint-line bg-[linear-gradient(120deg,var(--tint-strong),var(--card))] p-6 max-sm:p-5 sm:grid-cols-[180px_1fr]">
        <div>
          <strong className="block text-[34px] leading-tight font-semibold tracking-tight text-primary"><CountUp to={summary.xp} duration={1.2} trigger="load" separator="." /> XP</strong>
          <span className="block text-xs text-foreground/80">
            Nível {level.number} · {level.name}
          </span>
          <small className="mt-1 block text-[11px] text-muted-foreground">
            {summary.taskXp} XP em tarefas + {summary.medalXp} XP em medalhas
          </small>
        </div>
        <div className="self-center">
          <span className="text-xs">{next ? `${formatNumber(next - summary.xp)} XP para o próximo nível` : 'Último nível alcançado · continue revisando'}</span>
          <Progress value={pct} aria-label="Progresso até o próximo nível" className="my-2 h-1.5" />
        </div>
        <ul aria-label="Conquistas" className="flex flex-wrap gap-2 border-t border-border pt-3 sm:col-span-2">
          <Chip on={got.length > 0}>
            {got.length}/{medals.length} medalhas
          </Chip>
          {recent.map((m) => (
            <Chip key={m.id} on title={`${tierNames[m.tier]}${m.date ? ` · ${formatDay(m.date)}` : ''}`}>
              ✓ {m.name}
            </Chip>
          ))}
          <Chip on={streak > 0} title="Dias seguidos com atividade de estudo">
            {streak} {plural(streak, 'dia seguido', 'dias seguidos')}
          </Chip>
        </ul>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Ganhe até 100 XP por módulo: 30 por leitura, 20 por pesquisa, 20 pela atividade e 30 pelas questões. O laboratório vale 30 XP e cada um dos seis cenários de correção vale 40 XP. Total disponível em tarefas: {formatNumber(MAX_TASK_XP)} XP. Cada conquista pontua uma única vez. Medalhas somam até {formatNumber(bonus)} XP de bônus ({medals.length} medalhas).
      </p>
      {state.migrated ? (
        <p className="mt-3 rounded-md border border-tint-line bg-tint px-3 py-2.5 text-xs">
          As conclusões da versão anterior foram aproveitadas como leitura. Complete as novas tarefas de pesquisa, prática e questões para concluir cada módulo.
        </p>
      ) : null}
    </>
  )
}

function Chip({ on, title, children }: { on?: boolean; title?: string; children: React.ReactNode }) {
  return (
    <li title={title} className={`rounded-full border px-2.5 py-1 text-xs ${on ? 'border-tint-line bg-tint-strong text-primary' : 'border-border bg-card text-muted-foreground'}`}>
      {children}
    </li>
  )
}
