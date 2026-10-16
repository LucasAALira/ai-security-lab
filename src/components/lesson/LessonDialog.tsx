import { BookOpen, Check, Code2, Flame, HelpCircle, Layers, Lock, PenLine, ShieldCheck, Swords } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FlashcardDeck } from '@/components/study/FlashcardDeck'
import { TierChip } from '@/components/gamification/TierChip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { flashcardsOfModule } from '@/data/flashcards'
import { modules } from '@/data/modules'
import { eventsToText } from '@/lib/events-text'
import { plural, tierNames } from '@/lib/format'
import { isModuleComplete, moduleSteps, moduleXp, nextTierFor, tierFor, MODULE_XP, QUESTIONS_PER_MODULE, TASKS_PER_MODULE, type Action, type ModuleState } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { LessonPart, PART_TABS } from './LessonPart'
import { PracticePanel } from './PracticePanel'
import { QuizPanel } from './QuizPanel'

const TABS = ['conceito', 'exemplo', 'corrigir', 'revisar', 'praticar', 'quiz'] as const
type Tab = (typeof TABS)[number]

const DEFAULT_MESSAGE = 'Leitura e pesquisa são autodeclaradas. O XP registra tarefas, não certifica domínio do tema.'

/** Aba inicial: a pedida no endereço (`?aba=`) ou a primeira etapa ainda não feita. */
function initialTab(requested: string | null, s: ModuleState): Tab {
  if ((TABS as readonly string[]).includes(requested ?? '')) return requested as Tab
  const part = s.reads.findIndex((r) => !r)
  if (part !== -1) return TABS[part]
  if (!s.research || !s.practice) return 'praticar'
  if (s.solved.some((v) => !v)) return 'quiz'
  return 'conceito'
}

export function LessonDialog({ index, onClose }: { index: number; onClose: () => void }) {
  const { state, dispatch, derived } = useProgress()
  const [params] = useSearchParams()
  const m = modules[index]
  const s = state.modules[index]
  const info = derived.trail[index]
  const locked = !info.unlocked
  const [tab, setTab] = useState<Tab>(() => initialTab(params.get('aba'), s))
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const moveFocus = useRef(false)

  // Depois de "Continuar", o botão some junto com a aba; o foco vai para o título da nova aba.
  // O conteúdo da aba nova monta um instante depois da troca, então o foco espera o próximo quadro.
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    const frame = requestAnimationFrame(() => document.getElementById(`aba-titulo-${tab}`)?.focus())
    return () => cancelAnimationFrame(frame)
  }, [tab])

  const steps = moduleSteps(s)
  const tier = tierFor(steps, TASKS_PER_MODULE)
  const nextTier = nextTierFor(steps, TASKS_PER_MODULE)
  const xp = moduleXp(s)
  const cards = flashcardsOfModule(index)
  const cardsKnown = cards.length > 0 && cards.every((c) => state.cards[c.id])
  const complete = isModuleComplete(s)

  /** Mostra no aviso fixo do diálogo o que a ação rendeu. */
  function announce(lines: string[]) {
    if (!lines.length) return
    const earned = lines.some((l) => l.startsWith('+') && l.includes('XP'))
    setMessage(`${lines.join(' · ')}.${earned ? ' Esta conquista não pontuará novamente.' : ''}`)
  }

  function run(action: Action) {
    announce(eventsToText(dispatch(action).events))
  }

  function go(next: Tab) {
    moveFocus.current = true
    setTab(next)
  }

  const done: Record<Tab, boolean> = {
    conceito: s.reads[0],
    exemplo: s.reads[1],
    corrigir: s.reads[2],
    revisar: cardsKnown,
    praticar: s.research && s.practice,
    quiz: s.solved.every(Boolean),
  }
  const triggers: { tab: Tab; label: string; icon: typeof BookOpen }[] = [
    { tab: 'conceito', label: 'Conceito', icon: BookOpen },
    { tab: 'exemplo', label: 'Exemplo', icon: Code2 },
    { tab: 'corrigir', label: 'Como corrigir', icon: ShieldCheck },
    { tab: 'revisar', label: 'Revisar', icon: Layers },
    { tab: 'praticar', label: 'Praticar', icon: PenLine },
    { tab: 'quiz', label: 'Quiz', icon: HelpCircle },
  ]

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] gap-0 overflow-y-auto border-tint-line bg-card p-6 sm:max-w-[780px] sm:p-8">
        <div className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
          Módulo {m.number} / {m.category}
        </div>
        <DialogTitle className="mt-3 mb-2 text-[26px] leading-tight font-medium max-sm:text-2xl">{m.title}</DialogTitle>
        <DialogDescription className="sr-only">Etapas, revisão, pesquisa, atividade prática e quiz do módulo {m.title}.</DialogDescription>

        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg border border-tint-line bg-tint px-3.5 py-3 text-xs">
          <div
            className="radial-progress shrink-0 text-primary"
            style={{ '--value': Math.round((xp / MODULE_XP) * 100), '--size': '3.25rem', '--thickness': '4px' } as React.CSSProperties}
            role="progressbar"
            aria-label="XP do módulo"
            aria-valuenow={xp}
            aria-valuemin={0}
            aria-valuemax={MODULE_XP}
          >
            <span className="text-[11px] text-foreground">{xp}</span>
          </div>
          <p className="min-w-0 flex-1 text-xs text-foreground/85">
            {steps}/{TASKS_PER_MODULE} tarefas · {xp}/{MODULE_XP} XP{tier ? ` · Medalha ${tierNames[tier]}` : ''}
            {nextTier ? ` · faltam ${nextTier.remaining} ${plural(nextTier.remaining, 'tarefa', 'tarefas')} para a medalha ${tierNames[nextTier.tier]}` : ''} {tier ? <TierChip tier={tier} className="ml-1" /> : null}
          </p>
        </div>

        {locked ? (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-[13px] leading-relaxed">
            <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>
              Módulo ainda bloqueado na trilha: acenda a fogueira de{' '}
              {info.missing.map((p, i) => (
                <span key={p}>
                  {i > 0 ? (i === info.missing.length - 1 ? ' e ' : ', ') : ''}
                  <strong>{modules[p].title}</strong>
                </span>
              ))}{' '}
              para pontuar. Você pode ler tudo e revisar os cartões livremente.{' '}
              <Link to="/trilha" className="text-primary underline underline-offset-2">
                Ver a trilha
              </Link>
            </span>
          </p>
        ) : null}

        {complete ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tint-line bg-tint-strong p-3">
            <p className="flex items-center gap-2 text-[13px] font-medium">
              <Flame className="size-4 text-primary" aria-hidden="true" />
              {info.fire.lit ? 'Fogueira acesa. Revise quando quiser.' : 'Módulo concluído.'}
              {info.boss.exists && !info.boss.won ? ' O chefe do módulo está liberado.' : ''}
            </p>
            {info.boss.exists ? (
              <Button asChild size="sm">
                <Link to={`/trilha?chefe=${index}`}>
                  <Swords aria-hidden="true" /> {info.boss.won ? 'Repetir o chefe' : 'Enfrentar o chefe'}
                </Link>
              </Button>
            ) : null}
          </div>
        ) : null}

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-5 min-w-0">
          <TabsList aria-label="Etapas do módulo" className="h-auto w-full max-w-full justify-start gap-1 overflow-x-auto">
            {triggers.map((t) => (
              <TabsTrigger key={t.tab} value={t.tab} className="h-auto flex-none gap-1.5 px-3 py-1.5 text-[13px]">
                <t.icon aria-hidden="true" />
                {t.label}
                {done[t.tab] ? (
                  <>
                    <Check className="size-3 text-primary" aria-hidden="true" />
                    <span className="sr-only"> (concluída)</span>
                  </>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>

          {PART_TABS.map((p, j) => (
            <TabsContent key={p.tab} value={p.tab} className="mt-3 rounded-xl border border-border bg-background/30 p-4 sm:p-5">
              <LessonPart module={index} part={j as 0 | 1 | 2} locked={locked} onRead={() => run({ type: 'read', module: index, index: j })} onContinue={() => go(TABS[j + 1])} />
            </TabsContent>
          ))}

          <TabsContent value="revisar" className="mt-3 rounded-xl border border-border bg-background/30 p-4 sm:p-5">
            <h3 id="aba-titulo-revisar" tabIndex={-1} className="mb-1 text-xl font-medium outline-none">
              Revisar
            </h3>
            <p className="mb-4 text-[13px] text-muted-foreground">Responda de cabeça, mostre a resposta e marque se já sabe. Cartões não rendem XP: são para fixar.</p>
            <FlashcardDeck module={index} />
            <Button className="mt-4" onClick={() => go('praticar')}>
              Continuar
            </Button>
          </TabsContent>

          <TabsContent value="praticar" className="mt-3 rounded-xl border border-border bg-background/30 p-4 sm:p-5">
            <PracticePanel module={index} locked={locked} run={run} />
            <Button className="mt-4" onClick={() => go('quiz')}>
              Continuar
            </Button>
          </TabsContent>

          <TabsContent value="quiz" className="mt-3 rounded-xl border border-border bg-background/30 p-4 sm:p-5">
            <QuizPanel module={index} locked={locked} onResult={announce} />
            <p className="mt-4 text-xs text-muted-foreground">
              {s.solved.filter(Boolean).length} de {QUESTIONS_PER_MODULE} questões acertadas.
            </p>
          </TabsContent>
        </Tabs>

        <p
          id="lesson-message"
          role="status"
          aria-live="polite"
          className={cn('sticky -bottom-8 z-10 -mx-8 -mb-8 mt-5 border-t border-tint-line bg-tint-strong px-8 py-3 text-xs text-foreground/85 max-sm:-bottom-6 max-sm:-mx-6 max-sm:-mb-6 max-sm:px-6')}
        >
          {message}
        </p>
      </DialogContent>
    </Dialog>
  )
}
