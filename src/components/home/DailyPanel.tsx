import { Check, Circle, Coins, Flame, Gift, RotateCw, Shield } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SectionHeading } from '@/components/common/SectionHeading'
import { plural } from '@/lib/format'
import { REVIEW, SHIELD, type StreakStatus } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { Bump } from '@/components/motion/Bump'
import { Pop } from '@/components/motion/Pop'

const streakText: Record<StreakStatus, string> = {
  none: 'Estude hoje para começar uma sequência.',
  'done-today': 'Hoje já conta! Volte amanhã para manter a sequência.',
  open: 'Estude hoje para manter a sequência.',
  shielded: 'Um escudo vai cobrir os dias sem estudo.',
  lost: 'A sequência recomeça no próximo estudo.',
}

export function DailyPanel() {
  const { state, derived } = useProgress()
  const { daily, streak, streakStatus, balance, canReview } = derived
  const doneCount = daily.quests.filter((q) => q.done).length

  return (
    <section id="hoje" aria-labelledby="hoje-titulo" className="mb-14">
      <SectionHeading
        eyebrow="MISSÕES E SEQUÊNCIA"
        id="hoje-titulo"
        title="Seu dia de estudo"
        aside={daily.quests.length ? `${doneCount}/${daily.quests.length} missões` : undefined}
      />
      <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr_260px]">
        <Card className="gap-3 border-tint-line bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] p-5">
          <div className="flex items-center gap-3">
            <Flame className={cn('size-9', streak > 0 ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true" />
            <div>
              <div className="text-3xl leading-none font-semibold tracking-tight">
                <Bump value={streak}>{streak}</Bump>
              </div>
              <div className="text-xs text-muted-foreground">{plural(streak, 'dia seguido', 'dias seguidos')}</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{streakText[streakStatus]}</p>
          <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="inline-flex items-center gap-1.5" title="Cada escudo cobre um dia sem estudo">
              <Shield className="size-3.5 text-primary" aria-hidden="true" />
              Escudos {state.shop.shields}/{SHIELD.max}
            </span>
            <span className="text-muted-foreground">Recorde {state.streak.best}</span>
          </div>
        </Card>

        <Card className="gap-3 p-5">
          <h3 className="text-sm font-semibold">Missões de hoje</h3>
          {daily.quests.length ? (
            <ul className="grid gap-2.5">
              {daily.quests.map((q) => (
                <li key={q.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1.5 text-[13px]">
                  {q.done ? (
                    <Pop>
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    </Pop>
                  ) : (
                    <Circle className="size-4 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className={cn(q.done && 'text-muted-foreground line-through')}>
                    {q.title}
                    <span className="sr-only">{q.done ? ' (concluída)' : ` (${q.progress} de ${q.target})`}</span>
                  </span>
                  <span className="font-mono text-[11px] text-primary">+{q.coins} moedas</span>
                  <span className="col-start-2 col-end-4">
                    <Progress value={(q.progress / q.target) * 100} aria-label={`${q.title}: ${q.progress} de ${q.target}`} className="h-1" />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Sem missões possíveis hoje: você já cobriu todo o conteúdo. Faça uma revisão para manter tudo fresco.</p>
          )}
          <div className={cn('mt-1 flex items-center gap-2 rounded-md border px-3 py-2 text-xs', daily.chest ? 'border-tier-line bg-tier-soft text-tier tier-ouro' : 'border-border text-muted-foreground')}>
            <Gift className="size-4" aria-hidden="true" />
            {daily.chest ? `Baú do dia aberto: +${daily.chestCoins} moedas!` : daily.quests.length ? `Conclua todas as missões para abrir o baú: +${daily.chestCoins} moedas.` : 'O baú abre quando há missões cumpridas.'}
          </div>
        </Card>

        <Card className="gap-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Revisão e moedas</h3>
            <span className="inline-flex items-center gap-1 font-mono text-sm text-primary">
              <Coins className="size-4" aria-hidden="true" />
              {balance}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Revise questões que você já acertou, com {REVIEW.hearts} vidas. Cada sessão rende moedas (as {REVIEW.coinSessionsPerDay} primeiras do dia) para gastar na loja.
          </p>
          {canReview ? (
            <Button asChild size="sm">
              <Link to="/revisao">
                <RotateCw aria-hidden="true" /> Iniciar revisão
              </Link>
            </Button>
          ) : (
            <p className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground" role="note">
              Acerte pelo menos {REVIEW.minPool} questões nos módulos para liberar a revisão.
            </p>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to="/loja">Abrir a loja</Link>
          </Button>
        </Card>
      </div>
    </section>
  )
}
