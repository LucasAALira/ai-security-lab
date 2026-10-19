import { Lock, Skull, Sword } from 'lucide-react'
import { Link, Outlet, useSearchParams } from 'react-router'
import { NewSeal } from '@/components/common/NewSeal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { NextObjective } from '@/components/gamification/NextObjective'
import { XpBar } from '@/components/gamification/XpBar'
import { Checkpoint } from '@/components/trail/Checkpoint'
import { BossDialog } from '@/components/trail/BossDialog'
import { TrailStep } from '@/components/trail/TrailStep'
import { Card } from '@/components/ui/card'
import { bossOfModule } from '@/data/bosses'
import { modules } from '@/data/modules'
import { isNewClassicModule } from '@/data/whats-new'
import { formatNumber } from '@/lib/format'
import { CORE_MODULE_COUNT, type StepId, type TrailModule } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { SealMark } from '@/components/gothic/Seal'
import { PrismFlame } from '@/components/gothic/PrismFlame'

const stepLabel: Record<StepId, string> = {
  aulas: 'Aulas: Conceito, Exemplo e Como corrigir',
  pesquisa: 'Pesquisa orientada',
  pratica: 'Atividade prática',
  questoes: 'Quiz do módulo',
  fogueira: 'Fogueira',
  chefe: 'Chefe do módulo',
  desafios: 'Desafios de código',
}

function stepTarget(step: StepId, module: number): string | undefined {
  switch (step) {
    case 'aulas':
      return `/trilha/modulo/${module}?aba=conceito`
    case 'pesquisa':
    case 'pratica':
      return `/trilha/modulo/${module}?aba=praticar`
    case 'questoes':
      return `/trilha/modulo/${module}?aba=quiz`
    case 'desafios':
      return `/desafios?modulo=${module}`
    default:
      return undefined
  }
}

function ModuleNode({ t, onBoss }: { t: TrailModule; onBoss: (module: number) => void }) {
  const m = modules[t.module]
  const required = t.steps.filter((s) => !s.optional && s.id !== 'fogueira' && s.id !== 'chefe')
  const requiredDone = required.filter((s) => s.status === 'done').length
  const state = t.complete ? 'Concluído' : t.unlocked ? 'Em andamento' : 'Bloqueado'
  return (
    <li className="relative pl-9 max-sm:pl-8">
      {/* Marcador da trilha: concluído, a fogueira digital acesa; senão, uma runa (losango de 1 px). */}
      {t.complete ? (
        <PrismFlame lit className="absolute top-3 -left-1 h-10 w-8" />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-5 left-0.5 grid size-6 rotate-45 place-items-center border bg-background',
            t.unlocked ? 'border-primary text-primary shadow-[0_0_10px_-2px_var(--glow)]' : 'border-dashed border-muted-foreground/60 text-muted-foreground',
          )}
        >
          {t.unlocked ? <Sword className="size-3.5 -rotate-45" /> : <Lock className="size-3.5 -rotate-45" />}
        </span>
      )}
      <Card className={cn('gap-3 p-4 sm:p-5', t.unlocked ? 'border-border' : 'border-dashed bg-card/60')}>
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
              <span>
                Módulo {m.number} · {m.category}
              </span>
              {isNewClassicModule(t.module) ? <NewSeal title={`módulo ${m.title}`} /> : null}
            </p>
            <h3 className="mt-1 text-lg leading-snug font-medium">{m.title}</h3>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            <span className={cn('font-medium', t.unlocked ? 'text-foreground' : '')}>{state}</span> · {requiredDone} de {required.length} etapas
          </p>
        </header>

        {!t.unlocked && t.earlyAccess ? (
          <div className="rounded-lg border border-dashed border-tint-line bg-tint p-3 text-[13px] leading-relaxed">
            <p className="flex items-start gap-2">
              <SealMark className="!size-8" />
              <span>
                <strong>Módulo de acesso antecipado.</strong> Abra agora por {formatNumber(t.price ?? 0)} moedas ou, de graça, acendendo a fogueira de{' '}
                {t.missing.map((p, i) => (
                  <span key={p}>
                    {i > 0 ? (i === t.missing.length - 1 ? ' e ' : ', ') : ''}
                    <strong>
                      módulo {modules[p].number} ({modules[p].title})
                    </strong>
                  </span>
                ))}
                .
              </span>
            </p>
            <p className="mt-1.5 ml-6 text-xs">
              <Link to={`/trilha/modulo/${t.module}`} className="text-primary underline underline-offset-2">
                Ver prévia e desbloquear
              </Link>
            </p>
          </div>
        ) : null}

        {!t.unlocked && !t.earlyAccess ? (
          <div className="rounded-lg border border-dashed border-border p-3 text-[13px] leading-relaxed">
            <p className="flex items-start gap-2">
              <SealMark className="!size-8" />
              <span>
                Para liberar este módulo, acenda a fogueira de{' '}
                {t.missing.map((p, i) => (
                  <span key={p}>
                    {i > 0 ? (i === t.missing.length - 1 ? ' e ' : ', ') : ''}
                    <strong>
                      módulo {modules[p].number} ({modules[p].title})
                    </strong>
                  </span>
                ))}
                .
              </span>
            </p>
            <p className="mt-1.5 ml-6 text-xs text-muted-foreground">
              Você ainda pode ler a explicação e revisar os cartões, mas o XP só conta depois da liberação.{' '}
              <Link to={`/materias/${m.slug}`} className="text-primary underline underline-offset-2">
                Ler a matéria
              </Link>
            </p>
          </div>
        ) : null}

        <ul className="grid grid-cols-[minmax(0,1fr)] gap-0.5">
          {t.steps.map((s) => {
            if (s.id === 'fogueira') return <Checkpoint key={s.id} lit={t.fire.lit} day={t.fire.day} lessonTo={`/trilha/modulo/${t.module}?aba=conceito`} />
            if (s.id === 'chefe') {
              const boss = bossOfModule(t.module)
              return (
                <TrailStep
                  key={s.id}
                  icon={<Skull className="size-3.5" />}
                  label={boss ? `Chefe: ${boss.name}` : stepLabel.chefe}
                  detail={t.boss.won ? `${t.boss.wins} ${t.boss.wins === 1 ? 'vitória' : 'vitórias'}${t.boss.flawless ? ' · sem erros' : ''}` : `${t.boss.total} cenários`}
                  status={s.status}
                  xp={s.xp}
                  cta="Enfrentar"
                  doneCta="Repetir"
                  onSelect={() => onBoss(t.module)}
                />
              )
            }
            const to = stepTarget(s.id, t.module)
            return (
              <TrailStep
                key={s.id}
                label={stepLabel[s.id]}
                detail={s.total > 1 ? `${s.done} de ${s.total}` : undefined}
                status={s.status}
                optional={s.optional}
                xp={s.xp}
                to={to}
                cta={s.id === 'desafios' ? 'Praticar' : s.done > 0 ? 'Continuar' : 'Começar'}
                doneCta={s.id === 'desafios' ? 'Praticar' : 'Revisar'}
              />
            )
          })}
        </ul>
        {!t.boss.exists ? null : !t.complete ? (
          <p className="text-[11px] text-muted-foreground">O chefe fica disponível quando a fogueira estiver acesa.</p>
        ) : null}
      </Card>
    </li>
  )
}

export function TrailPage() {
  useDocumentTitle('Trilha de módulos')
  const { derived } = useProgress()
  const [params, setParams] = useSearchParams()
  const trail = derived.trail
  const core = trail.filter((t) => t.module < CORE_MODULE_COUNT)
  const fires = core.filter((t) => t.fire.lit).length
  const bossesWon = core.filter((t) => t.boss.won).length
  const bossTotal = core.filter((t) => t.boss.exists).length
  const extra = trail.filter((t) => t.module >= CORE_MODULE_COUNT)

  const bossParam = params.get('chefe')
  const bossModule = bossParam !== null && /^\d+$/.test(bossParam) && Number(bossParam) < trail.length && trail[Number(bossParam)].boss.exists ? Number(bossParam) : null
  const openBoss = (module: number) => setParams({ chefe: String(module) })
  const closeBoss = () => setParams({}, { replace: true })

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="TRILHA"
        level="h1"
        title="Trilha de módulos"
        description="Conclua as etapas de cada módulo para acender a fogueira, enfrentar o chefe e liberar os módulos seguintes. Você pode revisar e repetir qualquer coisa."
      />

      <div className="mt-6 grid gap-4 min-[900px]:grid-cols-2">
        <Card className="gap-4 p-5">
          <XpBar />
          <p className="text-xs text-muted-foreground">
            {fires} de {core.length} fogueiras acesas · {bossesWon} de {bossTotal} chefes vencidos
            {extra.length ? ` (trilha principal; ${extra.length === 1 ? 'o módulo extra não entra' : 'os módulos extras não entram'} na conta)` : ''}
          </p>
        </Card>
        <NextObjective variant="card" className="self-stretch" />
      </div>

      <h2 className="sr-only">Módulos da trilha</h2>
      <ol aria-label="Módulos da trilha" className="relative mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 before:absolute before:top-6 before:bottom-6 before:left-[13px] before:w-px before:bg-border max-sm:before:left-[13px]">
        {trail.map((t) => (
          <ModuleNode key={t.module} t={t} onBoss={openBoss} />
        ))}
      </ol>

      <Outlet />
      {bossModule !== null ? <BossDialog key={bossModule} module={bossModule} onClose={closeBoss} /> : null}
    </div>
  )
}
