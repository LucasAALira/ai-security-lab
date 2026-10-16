import { Check, Heart, RotateCw, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { RiveSlot } from '@/components/rive/RiveSlot'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { modules } from '@/data/modules'
import { eventsToText } from '@/lib/events-text'
import { letters, plural } from '@/lib/format'
import { answeredCount, answerReview, buildReview, currentItem, REVIEW, startReview, type ProgressEvent, type ReviewSession } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

interface Checked {
  correct: boolean
  chosen: number
}

export function ReviewPage() {
  useDocumentTitle('Revisão com vidas')
  const { state, derived, dispatch } = useProgress()
  const [session, setSession] = useState<ReviewSession | null>(null)
  const [events, setEvents] = useState<ProgressEvent[]>([])
  const [missed, setMissed] = useState<number[]>([])
  const [leaving, setLeaving] = useState(false)

  function start() {
    setSession(startReview(buildReview(state)))
    setEvents([])
    setMissed([])
  }

  if (!session) return <Intro canReview={derived.canReview} reviewsToday={derived.daily.reviewsToday} onStart={start} />

  if (session.status === 'won') {
    return (
      <Result
        won
        session={session}
        events={events}
        onAgain={start}
      />
    )
  }
  if (session.status === 'lost') return <Result session={session} events={[]} missedModules={missed} onAgain={start} />

  return (
    <Playing
      key={`${session.total}-${answeredCount(session)}-${session.lost}`}
      session={session}
      leaving={leaving}
      onLeavingChange={setLeaving}
      onExit={() => setSession(null)}
      onAnswer={(correct, moduleIndex) => {
        const next = answerReview(session, correct)
        if (!correct) setMissed((list) => (list.includes(moduleIndex) ? list : [...list, moduleIndex]))
        setSession(next)
        // Só o fim vitorioso rende moedas e conta como dia de estudo; a derrota não registra nada.
        if (next.status === 'won') setEvents(dispatch({ type: 'review', total: next.total, lost: next.lost }).events)
      }}
    />
  )
}

function Intro({ canReview, reviewsToday, onStart }: { canReview: boolean; reviewsToday: number; onStart: () => void }) {
  const coinsLeft = reviewsToday < REVIEW.coinSessionsPerDay
  return (
    <div className="mx-auto max-w-xl py-10 md:py-16">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">REVISÃO COM VIDAS</div>
      <h1 className="my-4 text-3xl font-semibold tracking-tight sm:text-4xl">Fixe o que você já aprendeu</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Uma sessão curta com até {REVIEW.size} questões que você já acertou. Você começa com {REVIEW.hearts} vidas: cada erro custa uma e a questão volta para o fim da fila. Terminou com vidas? A sessão conta como estudo do dia e rende moedas.
      </p>
      <ul className="my-6 grid gap-2 text-sm">
        <li className="flex gap-2">
          <Heart className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> {REVIEW.hearts} vidas por sessão. Sem vidas, a sessão termina e você pode tentar de novo.
        </li>
        <li className="flex gap-2">
          <RotateCw className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> As questões em que você mais errou entram primeiro.
        </li>
        <li className="flex gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          {coinsLeft ? `Moedas: ${REVIEW.coinsPerSession} por sessão, +${REVIEW.perfectBonus} se não perder nenhuma vida (as ${REVIEW.coinSessionsPerDay} primeiras do dia).` : `As moedas de hoje já foram pagas (${REVIEW.coinSessionsPerDay} sessões), mas a revisão continua valendo como estudo.`}
        </li>
      </ul>
      <p className="mb-6 text-xs text-muted-foreground">Atalhos: teclas 1 a 4 escolhem a alternativa, Enter confere e continua.</p>
      {canReview ? (
        <Button size="lg" onClick={onStart}>
          Começar revisão
        </Button>
      ) : (
        <p role="note" className="rounded-md border border-tint-line bg-tint px-4 py-3 text-sm">
          Acerte pelo menos {REVIEW.minPool} questões nos módulos para liberar a revisão.{' '}
          <Link to="/?secao=trilhas" className="text-primary underline underline-offset-4">
            Ir para os módulos
          </Link>
        </p>
      )}
    </div>
  )
}

/** `losing`: a vida de índice `left` acabou de ser perdida e faz uma animação de quebra. */
function Hearts({ left, losing = false }: { left: number; losing?: boolean }) {
  return (
    <span role="img" aria-label={`${left} de ${REVIEW.hearts} ${plural(REVIEW.hearts, 'vida', 'vidas')}`} className="inline-flex gap-1">
      {Array.from({ length: REVIEW.hearts }, (_, i) => (
        <motion.span
          key={i < left ? 'on' : 'off'}
          className="inline-flex"
          initial={losing && i === left ? { scale: 1.6, rotate: -14 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 12 }}
        >
          <Heart className={cn('size-5', i < left ? 'fill-primary text-primary' : 'text-muted-foreground')} aria-hidden="true" />
        </motion.span>
      ))}
    </span>
  )
}

interface PlayingProps {
  session: ReviewSession
  leaving: boolean
  onLeavingChange: (open: boolean) => void
  onExit: () => void
  onAnswer: (correct: boolean, moduleIndex: number) => void
}

function Playing({ session, leaving, onLeavingChange, onExit, onAnswer }: PlayingProps) {
  const item = currentItem(session)!
  const q = modules[item.module].questions[item.question]
  const [chosen, setChosen] = useState('')
  const [checked, setChecked] = useState<Checked | null>(null)
  const next = useRef<HTMLButtonElement>(null)

  function check() {
    if (chosen === '' || checked) return
    const n = Number(chosen)
    setChecked({ correct: n === q.correct, chosen: n })
  }

  // Atalhos: 1 a 4 escolhem a alternativa (antes de conferir).
  useEffect(() => {
    if (checked || leaving) return
    const onKey = (e: KeyboardEvent) => {
      const k = Number(e.key)
      if (e.ctrlKey || e.metaKey || e.altKey || !Number.isInteger(k) || k < 1 || k > q.options.length) return
      if ((e.target as HTMLElement).closest('input, textarea')) return
      setChosen(String(k - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [checked, leaving, q.options.length])

  useEffect(() => {
    if (checked) next.current?.focus()
  }, [checked])

  return (
    <motion.div className="mx-auto max-w-2xl py-6 md:py-10" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Sair da revisão" onClick={() => onLeavingChange(true)}>
          <X />
        </Button>
        <Progress value={(answeredCount(session) / session.total) * 100} aria-label={`${answeredCount(session)} de ${session.total} questões`} className="h-3 flex-1" />
        <Hearts left={session.hearts - (checked && !checked.correct ? 1 : 0)} losing={checked !== null && !checked.correct} />
      </div>

      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">
        {modules[item.module].number} · {modules[item.module].title.toUpperCase()}
      </div>
      <h1 className="my-3 text-xl leading-snug font-semibold sm:text-2xl">{q.title}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          check()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !checked && chosen !== '' && (e.target as HTMLElement).getAttribute('role') === 'radio') {
            e.preventDefault()
            check()
          }
        }}
      >
        <RadioGroup value={chosen} onValueChange={setChosen} disabled={checked !== null} aria-label="Alternativas" className="gap-2.5">
          {q.options.map((option, k) => {
            const isCorrect = checked && k === q.correct
            const isWrong = checked && !checked.correct && k === checked.chosen
            return (
              <Label
                key={option}
                htmlFor={`review-${k}`}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border-2 border-border bg-card px-4 py-3.5 text-sm font-normal transition-colors',
                  chosen === String(k) && !checked && 'border-primary bg-tint-strong',
                  isCorrect && 'border-success bg-success/10',
                  isWrong && 'border-destructive bg-destructive/10',
                  checked && 'cursor-default',
                )}
              >
                <RadioGroupItem id={`review-${k}`} value={String(k)} className="mt-0.5" />
                <span>
                  <kbd className="mr-2 rounded border border-border px-1.5 text-[10px] text-muted-foreground">{k + 1}</kbd>
                  {letters[k]}. {option}
                </span>
              </Label>
            )
          })}
        </RadioGroup>

        {checked ? (
          <div role="status" aria-live="polite" className={cn('mt-5 rounded-lg border-2 p-4 text-sm', checked.correct ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10')}>
            <strong className="block text-base">{checked.correct ? 'Correto!' : `Resposta certa: ${letters[q.correct]}`}</strong>
            <p className="mt-1.5 text-foreground/85">{q.feedback[checked.correct ? checked.chosen : q.correct]}</p>
            {!checked.correct ? <p className="mt-1.5 text-xs text-muted-foreground">Você perdeu uma vida e esta questão volta no fim da fila.</p> : null}
            <Button ref={next} type="button" className="mt-4" onClick={() => onAnswer(checked.correct, item.module)}>
              Continuar
            </Button>
          </div>
        ) : (
          <Button type="submit" size="lg" className="mt-5" disabled={chosen === ''}>
            Conferir
          </Button>
        )}
      </form>

      <AlertDialog open={leaving} onOpenChange={onLeavingChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da revisão?</AlertDialogTitle>
            <AlertDialogDescription>Você perde o andamento desta sessão. O que você já estudou continua salvo.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar revisando</AlertDialogCancel>
            <AlertDialogAction onClick={onExit}>Sair</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

interface ResultProps {
  won?: boolean
  session: ReviewSession
  events: ProgressEvent[]
  missedModules?: number[]
  onAgain: () => void
}

function Result({ won = false, session, events, missedModules = [], onAgain }: ResultProps) {
  const lines = eventsToText(events)
  return (
    <div className="mx-auto max-w-xl py-12 text-center md:py-20">
      {won ? <RiveSlot src="celebrate.riv" stateMachine="Celebrate" className="mx-auto mb-2 size-32" /> : null}
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">{won ? 'REVISÃO CONCLUÍDA' : 'SEM VIDAS'}</div>
      <h1 className="my-4 text-3xl font-semibold tracking-tight sm:text-4xl">{won ? (session.lost === 0 ? 'Revisão perfeita!' : 'Bom trabalho!') : 'Hoje não deu, mas dá para tentar de novo'}</h1>
      <div className="mb-5 flex justify-center">
        <Hearts left={session.hearts} />
      </div>
      <p className="text-sm text-muted-foreground">
        {won
          ? `${session.total} ${plural(session.total, 'questão revisada', 'questões revisadas')}, ${session.lost} ${plural(session.lost, 'vida perdida', 'vidas perdidas')}.`
          : 'Releia as seções dos módulos abaixo antes de tentar outra vez. Nada foi perdido: seu progresso e suas medalhas continuam iguais.'}
      </p>
      {won && lines.length ? (
        <ul role="status" className="mx-auto my-5 grid max-w-sm gap-1.5 rounded-lg border border-tint-line bg-tint p-4 text-left text-sm">
          {lines.map((l) => (
            <li key={l} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>
      ) : null}
      {!won && missedModules.length ? (
        <ul className="my-5 grid gap-1.5 text-sm">
          {missedModules.map((i) => (
            <li key={i}>
              <Link to={`/materias/${modules[i].slug}`} className="text-primary underline underline-offset-4">
                Reler {modules[i].title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onAgain}>{won ? 'Outra sessão' : 'Tentar de novo'}</Button>
        <Button asChild variant="outline">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  )
}
