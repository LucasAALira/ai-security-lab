import { ArrowRight, Bug, CheckCircle2, Lightbulb, Lock, RotateCcw, ShieldCheck, XCircle } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { challengeById } from '@/data/challenges'
import { areaTitleOf } from '@/data/curriculum'
import { modules } from '@/data/modules'
import { eventsToText, rejectText } from '@/lib/events-text'
import { letters } from '@/lib/format'
import { canOpenContent, CHALLENGE_XP, emptyChallenge, findChallenge, gradeLines, hintsUsed, HINT_PHASES, isRunDone, type ApplyResult } from '@/lib/progress'
import { EarlyAccessPreview } from '@/components/shop/EarlyAccessPreview'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { CodeLines, type LineMark } from './CodeLines'

type Phase = 'identify' | 'fix' | 'done'

const phaseNames: { id: Phase; label: string }[] = [
  { id: 'identify', label: 'Identificar' },
  { id: 'fix', label: 'Corrigir' },
  { id: 'done', label: 'Resultado' },
]

interface Props {
  id: string
  /** Próximo desafio sugerido, para o botão do resultado. */
  nextTo?: string
}

/** Um desafio de código: 1) marcar as linhas vulneráveis, 2) escolher a correção, 3) ver o resultado.
 *  Dicas ajudam, mas qualquer uma delas tira o "Sem Ajuda" desta tentativa. Errar mostra o motivo
 *  e permite tentar de novo; repetir um desafio concluído nunca soma XP outra vez. */
export function CodeChallenge({ id, nextTo }: Props) {
  const { state, ctx, dispatch, derived } = useProgress()
  const challenge = challengeById(id)
  const spec = findChallenge(ctx, id)
  const uid = useId()
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [check, setCheck] = useState<{ wrong: number[]; missing: number; notes: string[] } | null>(null)
  const [fixChoice, setFixChoice] = useState('')
  const [fixResult, setFixResult] = useState<{ ok: boolean; choice: number } | null>(null)
  const [message, setMessage] = useState('')

  // O registro do desafio só existe depois da primeira ação; antes disso vale o estado vazio.
  const run = state.challenges[id] ?? emptyChallenge()
  const moduleIndex = challenge?.module ?? null
  const trailModule = moduleIndex === null ? undefined : derived.trail[moduleIndex]
  if (!challenge || !spec) return <p className="text-sm text-muted-foreground">Desafio não encontrado.</p>
  // Desafios de um módulo de acesso antecipado só abrem depois da liberação: antes disso, a prévia do módulo.
  if (moduleIndex !== null && !canOpenContent(state, ctx, moduleIndex)) return <EarlyAccessPreview module={moduleIndex} headingLevel={2} />

  const locked = moduleIndex !== null && !trailModule?.unlocked
  const phase: Phase = isRunDone(run) ? 'done' : run.run.identified ? 'fix' : 'identify'
  const used = hintsUsed(run)
  const m = moduleIndex === null ? undefined : modules[moduleIndex]

  const lineMarks = new Map<number, LineMark>()
  if (phase === 'identify') {
    picked.forEach((n) => lineMarks.set(n, check?.wrong.includes(n) ? 'wrong' : 'picked'))
  } else {
    for (const n of [...challenge.vulnerable, ...(run.extra ? challenge.extra : [])]) lineMarks.set(n, 'flaw')
  }

  function announce(result: ApplyResult) {
    if (!result.changed && result.rejected) return setMessage(rejectText[result.rejected])
    setMessage(eventsToText(result.events.filter((e) => e.kind !== 'medal')).join(' · '))
  }

  function toggle(line: number) {
    setCheck(null)
    setMessage('')
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(line)) next.delete(line)
      else next.add(line)
      return next
    })
  }

  function submitLines() {
    const lines = [...picked].sort((a, b) => a - b)
    const grade = gradeLines(spec!, lines)
    const result = dispatch({ type: 'identify', challenge: id, lines })
    if (!result.changed) return announce(result)
    if (grade.ok) {
      setCheck(null)
      return announce(result)
    }
    setCheck({ wrong: grade.wrong, missing: grade.missing, notes: grade.wrong.map((n) => challenge!.notes[n]).filter(Boolean) })
    setMessage('')
  }

  function nextHint(phaseId: 'identify' | 'fix') {
    const index = HINT_PHASES[phaseId].find((i) => !run.run.hints[i])
    if (index === undefined) return
    announce(dispatch({ type: 'hint', challenge: id, index }))
  }

  function submitFix() {
    if (fixChoice === '') return
    const choice = Number(fixChoice)
    const result = dispatch({ type: 'fix', challenge: id, option: choice })
    if (!result.changed) return announce(result)
    setFixResult({ ok: choice === challenge!.fix, choice })
    announce(result)
  }

  function retry() {
    const result = dispatch({ type: 'retry', challenge: id })
    if (!result.changed) return announce(result)
    setPicked(new Set())
    setCheck(null)
    setFixChoice('')
    setFixResult(null)
    setMessage('Nova tentativa iniciada. Repetir o desafio não rende XP novamente, mas conta para o "Sem Ajuda" se você não usar dicas.')
  }

  const hintsLeft = (phaseId: 'identify' | 'fix') => HINT_PHASES[phaseId].some((i) => !run.run.hints[i])
  const shownHints = run.run.hints.map((on, i) => (on ? { i, text: challenge.hints[i] } : null)).filter((h): h is { i: number; text: string } => h !== null)
  const xpLeft = (run.identified ? 0 : CHALLENGE_XP.identify) + (run.fixed ? 0 : CHALLENGE_XP.fix)

  return (
    <article aria-labelledby={`${uid}-title`} className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <header>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
          <span>{m ? `Módulo ${m.number}` : areaTitleOf(challenge.submodule)}</span>
          <Badge variant="outline" className="rounded text-[10px] tracking-normal">
            {challenge.kind === 'auth' ? 'Autorização' : 'Identificar falha'}
          </Badge>
          {run.identified && run.fixed ? (
            <span className="inline-flex items-center gap-1 tracking-normal normal-case">
              <CheckCircle2 className="size-3.5" aria-hidden="true" /> Já concluído
            </span>
          ) : null}
        </div>
        <h2 id={`${uid}-title`} className="mt-2 text-xl leading-snug font-medium">
          {challenge.title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{challenge.scenario}</p>
      </header>

      <ol aria-label="Etapas do desafio" className="mt-4 flex flex-wrap gap-2 text-xs">
        {phaseNames.map((p, i) => {
          const order = phaseNames.findIndex((x) => x.id === phase)
          const state = i < order ? 'feita' : i === order ? 'atual' : 'pendente'
          return (
            <li key={p.id} aria-current={state === 'atual' ? 'step' : undefined} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1', state === 'atual' ? 'border-primary text-primary' : state === 'feita' ? 'border-tint-line text-foreground/80' : 'border-border text-muted-foreground')}>
              <span className="font-mono">{i + 1}</span> {p.label}
              <span className="sr-only"> ({state})</span>
            </li>
          )
        })}
      </ol>

      {locked ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-[13px]">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>
            Este desafio faz parte do módulo {m?.number}, ainda bloqueado na trilha. Acenda a fogueira dos pré-requisitos para pontuar.{' '}
            <Link to="/trilha" className="text-primary underline underline-offset-2">
              Ver a trilha
            </Link>
          </span>
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">
          {xpLeft > 0 ? `Vale até ${xpLeft} XP, só na primeira vez (${CHALLENGE_XP.identify} ao identificar e ${CHALLENGE_XP.fix} ao corrigir).` : 'Você já recebeu todo o XP deste desafio. Repetir não pontua de novo.'}
        </p>
      )}

      <div className="mt-4">
        <p className="mb-2 text-[13px] font-medium">
          {phase === 'identify' ? 'Marque as linhas vulneráveis e confira.' : phase === 'fix' ? 'Falha identificada. Agora escolha a correção.' : 'Código analisado.'}
        </p>
        <CodeLines code={challenge.code} file={challenge.file} selectable={phase === 'identify' && !locked} marks={lineMarks} onToggle={toggle} />
      </div>

      {phase === 'identify' ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button disabled={locked || picked.size === 0} onClick={submitLines}>
            <Bug aria-hidden="true" /> Conferir linhas
          </Button>
          <Button variant="outline" disabled={locked || !hintsLeft('identify')} onClick={() => nextHint('identify')}>
            <Lightbulb aria-hidden="true" /> Dica
          </Button>
          <span className="text-xs text-muted-foreground">{picked.size} {picked.size === 1 ? 'linha marcada' : 'linhas marcadas'}</span>
        </div>
      ) : null}

      {check ? (
        <div role="alert" className="mt-3 rounded-lg border border-destructive/50 bg-destructive/8 p-3 text-[13px] leading-relaxed">
          <p className="flex items-start gap-2">
            <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            <span>
              <strong>Ainda não.</strong>{' '}
              {check.wrong.length > 0 ? `${check.wrong.length} ${check.wrong.length === 1 ? 'linha marcada não é' : 'linhas marcadas não são'} a falha (marcadas como “não é”).` : ''}{' '}
              {check.missing > 0 ? `Falta marcar ${check.missing === 1 ? 'uma linha' : `${check.missing} linhas`} da falha principal.` : ''} Ajuste a seleção e confira de novo: errar não tira XP nem conquistas.
            </span>
          </p>
          {check.notes.length ? (
            <ul className="mt-2 ml-6 grid list-disc gap-1 text-xs text-muted-foreground">
              {check.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {phase === 'fix' || phase === 'done' ? (
        <section className="mt-4 rounded-lg border border-tint-line bg-tint-strong p-3.5" aria-label="Por que é uma falha">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Por que é uma falha
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed">{challenge.why}</p>
          {run.extra && challenge.extraNote ? <p className="mt-2 text-[13px] leading-relaxed text-primary">Você também notou uma falha extra: {challenge.extraNote}</p> : null}
        </section>
      ) : null}

      {phase === 'fix' || (phase === 'done' && fixResult) ? (
        <fieldset disabled={phase === 'done' || locked} className="m-0 mt-4 min-w-0 border-0 p-0">
          <legend className="mb-2 text-[13px] font-medium">Qual é a melhor correção?</legend>
          <RadioGroup value={phase === 'done' ? String(challenge.fix) : fixChoice} onValueChange={(v) => { setFixChoice(v); setFixResult(null) }} className="gap-0">
            {challenge.fixes.map((f, k) => (
              <Label
                key={f.text}
                htmlFor={`${uid}-fix-${k}`}
                className={cn(
                  'my-1.5 flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-background/40 px-3.5 py-3 text-[13px] leading-relaxed font-normal has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  fixChoice === String(k) && 'border-primary bg-tint-strong',
                  phase === 'done' && k === challenge.fix && 'border-primary',
                  fixResult && !fixResult.ok && fixResult.choice === k && 'border-destructive',
                  phase === 'done' && 'cursor-default',
                )}
              >
                <RadioGroupItem id={`${uid}-fix-${k}`} value={String(k)} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-muted-foreground">{letters[k]}.</span> {f.text}
                </span>
                {phase === 'done' && k === challenge.fix ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" /> Correta
                  </span>
                ) : null}
                {fixResult && !fixResult.ok && fixResult.choice === k ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-destructive">
                    <XCircle className="size-3.5" aria-hidden="true" /> Sua resposta
                  </span>
                ) : null}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
      ) : null}

      {phase === 'fix' ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button disabled={locked || fixChoice === ''} onClick={submitFix}>
            <ShieldCheck aria-hidden="true" /> Conferir correção
          </Button>
          <Button variant="outline" disabled={locked || !hintsLeft('fix')} onClick={() => nextHint('fix')}>
            <Lightbulb aria-hidden="true" /> Dica
          </Button>
        </div>
      ) : null}

      {fixResult && !fixResult.ok && phase === 'fix' ? (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/8 p-3 text-[13px] leading-relaxed">
          <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <span>
            <strong>Ainda não.</strong> {challenge.fixes[fixResult.choice].feedback} Escolha outra alternativa e confira de novo.
          </span>
        </p>
      ) : null}

      {phase === 'done' ? (
        <section className="mt-4 rounded-lg border border-tint-line bg-tint-strong p-3.5" aria-label="Resultado do desafio">
          <p className="flex items-center gap-2 text-base font-semibold">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" /> Desafio concluído
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed">{challenge.fixes[challenge.fix].feedback}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {used === 0 ? 'Você concluiu esta tentativa sem nenhuma dica.' : `Você usou ${used} ${used === 1 ? 'dica' : 'dicas'} nesta tentativa, então ela não conta para o "Sem Ajuda". Repita o desafio e tente sem dicas.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={retry}>
              <RotateCcw aria-hidden="true" /> Repetir desafio
            </Button>
            {nextTo ? (
              <Button asChild size="sm">
                <Link to={nextTo}>
                  Próximo desafio <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}

      {shownHints.length ? (
        <section className="mt-4 rounded-lg border border-border bg-muted/40 p-3" aria-label="Dicas desta tentativa">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <Lightbulb className="size-3.5 text-primary" aria-hidden="true" /> Dicas desta tentativa ({used} de {challenge.hints.length})
          </p>
          <ul className="mt-1.5 grid list-disc gap-1 pl-5 text-xs leading-relaxed text-muted-foreground">
            {shownHints.map((h) => (
              <li key={h.i}>{h.text}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {phase !== 'done' && !locked ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          {used === 0 ? 'Sem dicas até agora: se concluir assim, esta tentativa conta para a conquista "Sem Ajuda".' : 'Você já usou dica nesta tentativa, então ela não conta para a conquista "Sem Ajuda". Dá para repetir o desafio depois.'}
        </p>
      ) : null}

      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-primary">
        {message}
      </p>
    </article>
  )
}
