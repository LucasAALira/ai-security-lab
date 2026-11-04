import { ArrowLeft, ArrowRight, Check, RotateCcw, Skull, Swords, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { BossPortrait, formaDoModulo } from '@/components/gothic/BossArt'
import { NextOpponents } from '@/components/trail/NextOpponents'
import { QuestionCard } from '@/components/study/QuestionCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { bossOfModule } from '@/data/bosses'
import { modules } from '@/data/modules'
import { BOSS_QUESTIONS, BOSS_XP, formatDay, isModuleComplete } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

/** Página do chefe do módulo (`/chefe/:n`): três cenários que combinam o que foi estudado.
 *  Era um diálogo sobre a trilha; virou página porque o enfrentamento é uma etapa inteira, com
 *  leitura, erro e repetição — e porque assim ele tem endereço próprio, volta no histórico e
 *  cabe na tela do celular sem rolagem dentro de rolagem. */
export function BossPage() {
  const { n } = useParams()
  const index = n !== undefined && /^\d+$/.test(n) ? Number(n) : -1
  if (index < 0 || index >= modules.length) return <Navigate to="/trilha" replace />
  return <Arena key={index} module={index} />
}

function Arena({ module }: { module: number }) {
  const { state, dispatch } = useProgress()
  const boss = bossOfModule(module)
  const m = modules[module]
  useDocumentTitle(boss ? `${boss.name} · chefe do módulo ${m.number}` : `Chefe do módulo ${m.number}`)
  const run = state.bosses[module]
  const total = boss ? Math.min(BOSS_QUESTIONS, boss.questions.length) : 0
  const allDone = Boolean(boss) && run.done.slice(0, total).every(Boolean)
  const [stage, setStage] = useState<'play' | 'result'>(allDone ? 'result' : 'play')
  const [view, setView] = useState(() => Math.max(0, run.done.slice(0, total).findIndex((d) => !d)))
  const lit = isModuleComplete(state.modules[module])

  if (!boss) {
    return (
      <div className="py-8 md:py-10">
        <p className="text-sm text-muted-foreground">Este módulo não tem chefe.</p>
        <Button asChild size="sm" className="mt-3">
          <Link to="/trilha">
            <ArrowLeft aria-hidden="true" /> Voltar à trilha
          </Link>
        </Button>
      </div>
    )
  }
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
    <div className="py-8 md:py-10">
      <Link to="/trilha" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
        <ArrowLeft aria-hidden="true" className="size-4" /> Voltar à trilha
      </Link>

      <header className="mt-3">
        <div className="boss-dialog-banner" data-vencido={run.won ? 'true' : undefined}>
          <BossPortrait shape={formaDoModulo(module)} vencido={Boolean(run.won)} className="boss-dialog-sprite" />
        </div>
        <p className="gx-inscription mt-4">
          Chefe do módulo {m.number} · {m.title}
        </p>
        <h1 className="mt-2 flex items-center gap-2.5 text-[26px] leading-tight max-sm:text-[21px]">
          <Skull className="size-6 shrink-0 text-primary" aria-hidden="true" />
          {boss.name}
        </h1>
        <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
          <em className="text-foreground/85">{boss.epithet}.</em> {boss.intro}
        </p>
      </header>

      <div className="mt-6 grid gap-4">
        {!lit ? (
          <Card className="gap-3 border-dashed p-5">
            <p className="text-sm leading-relaxed">O chefe só aparece depois que a fogueira deste módulo estiver acesa: conclua as aulas, a pesquisa, a atividade prática e o quiz.</p>
            <Button asChild size="sm" className="justify-self-start">
              <Link to={`/modulo/${module}`}>
                Estudar o módulo <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Card>
        ) : stage === 'result' && allDone ? (
          <>
            <Card className="gap-2 p-5">
              <p className="flex items-center gap-2 text-base font-semibold">
                <Trophy className="size-5 text-primary" aria-hidden="true" /> {run.won ? `Chefe vencido em ${formatDay(run.won)}` : 'Chefe vencido'}
              </p>
              <ul className="grid gap-1 text-[13px] text-muted-foreground">
                <li>
                  {total} de {total} cenários resolvidos nesta tentativa · {run.mistakes} {run.mistakes === 1 ? 'erro' : 'erros'}.
                </li>
                {run.flawless ? <li>Você já venceu uma tentativa sem erros.</li> : <li>Vença uma tentativa sem erros para o selo de perfeição.</li>}
                <li>Você pode repetir o chefe quando quiser; repetir não rende XP novamente.</li>
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={again}>
                  <RotateCcw aria-hidden="true" /> Repetir desafio
                </Button>
                <Button asChild size="sm">
                  <Link to="/trilha">
                    <Check aria-hidden="true" /> Voltar à trilha
                  </Link>
                </Button>
              </div>
            </Card>
            {/* Caiu um guardião: a escolha do próximo é de quem venceu. */}
            <NextOpponents vencido={module} />
          </>
        ) : (
          <>
            <ol aria-label="Cenários do chefe" className="flex flex-wrap items-center gap-2 text-xs">
              {Array.from({ length: total }, (_, i) => (
                <li
                  key={i}
                  aria-current={i === view ? 'step' : undefined}
                  className={`inline-flex items-center gap-1 border px-2.5 py-1 ${i === view ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
                >
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
      </div>
    </div>
  )
}
