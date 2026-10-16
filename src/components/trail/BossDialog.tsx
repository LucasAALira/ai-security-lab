import { ArrowRight, Check, RotateCcw, Skull, Swords, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { QuestionCard } from '@/components/study/QuestionCard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { bossOfModule } from '@/data/bosses'
import { modules } from '@/data/modules'
import { BOSS_QUESTIONS, BOSS_XP, formatDay, isModuleComplete } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

/** Chefe do módulo: três cenários que combinam o que foi estudado. Só abre com a fogueira acesa.
 *  Errar mostra o motivo e permite tentar de novo; vencer rende XP uma única vez e repetir não pontua. */
export function BossDialog({ module, onClose }: { module: number; onClose: () => void }) {
  const { state, dispatch } = useProgress()
  const boss = bossOfModule(module)
  const m = modules[module]
  const run = state.bosses[module]
  const total = boss ? Math.min(BOSS_QUESTIONS, boss.questions.length) : 0
  const allDone = Boolean(boss) && run.done.slice(0, total).every(Boolean)
  const [stage, setStage] = useState<'play' | 'result'>(allDone ? 'result' : 'play')
  const [view, setView] = useState(() => Math.max(0, run.done.slice(0, total).findIndex((d) => !d)))
  const lit = isModuleComplete(state.modules[module])

  if (!boss) return null
  const q = boss.questions[view]

  function answer(choice: number, ok: boolean): string | void {
    const result = dispatch({ type: 'bossAnswer', module, index: view, option: choice })
    if (!ok) return
    const win = result.events.find((e) => e.kind === 'boss')
    if (win && win.kind === 'boss') {
      if (win.first) return `Chefe vencido! +${BOSS_XP} XP, uma única vez.${win.flawless ? ' Sem nenhum erro.' : ''}`
      return 'Chefe vencido de novo. Repetir não rende XP novamente.'
    }
  }

  function next() {
    if (view < total - 1) setView(view + 1)
    else setStage('result')
  }

  function again() {
    dispatch({ type: 'bossRetry', module })
    setView(0)
    setStage('play')
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-tint-line bg-card sm:max-w-[640px]">
        <div className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
          Chefe do módulo {m.number} · {m.title}
        </div>
        <DialogTitle className="flex items-center gap-2 text-2xl leading-tight font-medium">
          <Skull className="size-6 shrink-0 text-primary" aria-hidden="true" />
          {boss.name}
        </DialogTitle>
        <DialogDescription className="text-[13px] leading-relaxed">
          <em className="text-foreground/85">{boss.epithet}.</em> {boss.intro}
        </DialogDescription>

        {!lit ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm">
            <p>O chefe só aparece depois que a fogueira deste módulo estiver acesa: conclua as aulas, a pesquisa, a atividade prática e o quiz.</p>
            <Button asChild size="sm" className="mt-3">
              <Link to={`/modulo/${module}`}>
                Estudar o módulo <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : stage === 'result' && allDone ? (
          <div className="rounded-lg border border-tint-line bg-tint-strong p-4">
            <p className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="size-5 text-primary" aria-hidden="true" /> {run.won ? `Chefe vencido em ${formatDay(run.won)}` : 'Chefe vencido'}
            </p>
            <ul className="mt-2 grid gap-1 text-[13px] text-muted-foreground">
              <li>
                {total} de {total} cenários resolvidos nesta tentativa · {run.mistakes} {run.mistakes === 1 ? 'erro' : 'erros'}.
              </li>
              {run.flawless ? <li>Você já venceu uma tentativa sem erros.</li> : <li>Vença uma tentativa sem erros para o selo de perfeição.</li>}
              <li>Você pode repetir o chefe quando quiser; repetir não rende XP novamente.</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={again}>
                <RotateCcw aria-hidden="true" /> Repetir desafio
              </Button>
              <Button size="sm" onClick={onClose}>
                <Check aria-hidden="true" /> Voltar à trilha
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ol aria-label="Cenários do chefe" className="flex items-center gap-2 text-xs">
              {Array.from({ length: total }, (_, i) => (
                <li key={i} aria-current={i === view ? 'step' : undefined} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${i === view ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                  {run.done[i] ? <Check className="size-3" aria-hidden="true" /> : <Swords className="size-3" aria-hidden="true" />}
                  Cenário {i + 1}
                  <span className="sr-only">{run.done[i] ? ' resolvido' : ' pendente'}</span>
                </li>
              ))}
            </ol>
            <QuestionCard
              key={`${module}-${view}-${run.wins}`}
              number={view + 1}
              title={q.scenario}
              options={q.options}
              correct={q.correct}
              feedback={q.feedback}
              solved={Boolean(run.done[view])}
              onAnswer={answer}
            />
            {run.done[view] ? (
              <Button className="justify-self-end" onClick={next}>
                {view < total - 1 ? 'Próximo cenário' : 'Ver resultado'} <ArrowRight aria-hidden="true" />
              </Button>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
