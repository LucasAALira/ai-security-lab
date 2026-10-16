import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TierChip } from '@/components/gamification/TierChip'
import { modules } from '@/data/modules'
import { eventsToText } from '@/lib/events-text'
import { plural, tierNames } from '@/lib/format'
import { isModuleComplete, moduleSteps, moduleXp, nextTierFor, tierFor, XP, MODULE_XP, TASKS_PER_MODULE } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { QuestionForm } from './QuestionForm'

const PARTS = [
  { title: 'Compreender', section: 'compreender' },
  { title: 'Conectar', section: 'conectar' },
  { title: 'Aplicar', section: 'aplicar' },
] as const

const DEFAULT_MESSAGE = 'Leitura e pesquisa são autodeclaradas. O XP registra tarefas, não certifica domínio do tema.'
const MIN_NOTE = 20

export function LessonDialog({ index, onClose }: { index: number; onClose: () => void }) {
  const { state, dispatch } = useProgress()
  const m = modules[index]
  const s = state.modules[index]
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const [researchNote, setResearchNote] = useState(s.researchNote)
  const [notes, setNotes] = useState(s.notes)
  const [confirmed, setConfirmed] = useState(s.research)
  const [researchError, setResearchError] = useState('')
  const [practiceError, setPracticeError] = useState('')

  const steps = moduleSteps(s)
  const tier = tierFor(steps, TASKS_PER_MODULE)
  const nextTier = nextTierFor(steps, TASKS_PER_MODULE)
  const xp = moduleXp(s)

  /** Mostra no aviso fixo do diálogo o que a ação rendeu. */
  function announce(lines: string[]) {
    if (!lines.length) return
    const earned = lines.some((l) => l.startsWith('+') && l.includes('XP'))
    setMessage(`${lines.join(' · ')}.${earned ? ' Esta conquista não pontuará novamente.' : ''}`)
  }

  function run(action: Parameters<typeof dispatch>[0]) {
    announce(eventsToText(dispatch(action).events))
  }

  function completeResearch() {
    if (!confirmed || researchNote.trim().length < MIN_NOTE) {
      setResearchError('Leia a matéria interna, escreva pelo menos 20 caracteres e confirme a pesquisa.')
      return
    }
    setResearchError('')
    run({ type: 'research', module: index })
  }

  function completePractice() {
    if (notes.trim().length < MIN_NOTE) {
      setPracticeError('Registre pelo menos 20 caracteres sobre a atividade antes de concluir.')
      return
    }
    setPracticeError('')
    run({ type: 'practice', module: index })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto border-tint-line bg-card p-8 sm:max-w-[780px] max-sm:p-6">
        <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">
          MÓDULO {m.number} / {m.category}
        </div>
        <DialogTitle className="my-5 text-[28px] leading-tight font-medium max-sm:text-2xl">{m.title}</DialogTitle>
        <DialogDescription className="sr-only">Leituras, pesquisa, atividade prática e questões do módulo {m.title}.</DialogDescription>

        <div className="my-4 rounded-lg border border-tint-line border-l-4 border-l-primary bg-tint-strong p-4">
          <p className="mb-3 text-[13px] text-foreground/80">Estude a explicação completa, com conceitos, exemplos e aplicação.</p>
          <Button asChild>
            <Link to={`/materias/${m.slug}`}>Ler matéria completa neste site →</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-md border border-tint-line bg-tint px-3.5 py-3 text-xs">
          <div
            className="radial-progress shrink-0 text-primary"
            style={{ '--value': Math.round((xp / MODULE_XP) * 100), '--size': '3.5rem', '--thickness': '4px' } as React.CSSProperties}
            role="progressbar"
            aria-label="XP do módulo"
            aria-valuenow={xp}
            aria-valuemin={0}
            aria-valuemax={MODULE_XP}
          >
            <span className="text-[11px] text-foreground">{xp}</span>
          </div>
          <p id="lesson-progress" className="min-w-0 flex-1 text-xs text-foreground/85">
            {steps}/{TASKS_PER_MODULE} tarefas · {xp}/{MODULE_XP} XP{tier ? ` · Medalha ${tierNames[tier]}` : ''}
            {nextTier ? ` · faltam ${nextTier.remaining} ${plural(nextTier.remaining, 'tarefa', 'tarefas')} para a medalha ${tierNames[nextTier.tier]}` : ''}
            {isModuleComplete(s) ? ' · Módulo concluído!' : ''} {tier ? <TierChip tier={tier} className="ml-1" /> : null}
          </p>
        </div>

        <section className="mt-5 rounded-md border border-border border-l-[3px] border-l-primary bg-tint px-4 pb-3">
          <h3 className="mt-5 mb-1 text-sm font-semibold text-primary">O que você precisa saber</h3>
          <p className="text-[13px] text-foreground/80">
            <strong>Nível:</strong> {m.level} · Sem exigência de formação formal.
          </p>
          <ul className="list-disc pl-5 text-[13px] text-foreground/75">
            {m.requires.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-foreground/80">
            <strong>Módulos recomendados:</strong>{' '}
            {m.prereqs.length ? m.prereqs.map((j) => `${modules[j].title} ${isModuleComplete(state.modules[j]) ? '(concluído)' : '(a estudar)'}`).join('; ') : 'nenhum; você pode começar por aqui.'}
          </p>
          <h3 className="mt-5 mb-1 text-sm font-semibold text-primary">Ao concluir, você será capaz de:</h3>
          <ul className="list-disc pl-5 text-[13px] text-foreground/75">
            {m.objectives.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {m.parts.map((part, j) => {
          const done = s.reads[j]
          return (
            <section key={PARTS[j].section} className="mb-5 border-b border-border pb-5">
              <h3 className="mt-6 mb-2 text-sm font-semibold text-primary">
                0{j + 1} / {PARTS[j].title}
              </h3>
              <p className="text-sm leading-[1.8] text-foreground/75">{part}</p>
              <Link to={`/materias/${m.slug}?secao=${PARTS[j].section}`} className="my-3 block text-xs text-primary hover:underline">
                Ler esta parte da matéria →
              </Link>
              <Button variant="outline" size="sm" disabled={done} onClick={() => run({ type: 'read', module: index, index: j })}>
                {done ? `✓ Leitura registrada · ${XP.read} XP` : `Li e revisei esta seção · +${XP.read} XP`}
              </Button>
            </section>
          )
        })}

        <section className="mb-5 border-b border-border pb-5">
          <h3 className="mt-6 mb-2 text-[17px] font-semibold text-primary">Pesquisa orientada · {XP.research} XP</h3>
          <p className="text-sm leading-[1.8] text-foreground/75">{m.research}</p>
          <Link to={`/materias/${m.slug}?secao=pesquisa`} className="my-5 block text-xs text-primary hover:underline">
            Abrir matéria e pesquisa neste site →
          </Link>
          <Label htmlFor="research-note" className="mb-1.5 text-xs">
            Registre uma descoberta da pesquisa (mínimo 20 caracteres)
          </Label>
          <Textarea
            id="research-note"
            value={researchNote}
            placeholder="Escreva com suas palavras o que aprendeu na matéria…"
            className="min-h-[110px] resize-y"
            onChange={(e) => {
              setResearchNote(e.target.value)
              dispatch({ type: 'note', module: index, field: 'researchNote', value: e.target.value })
            }}
          />
          <Label htmlFor="research-confirm" className="my-3 items-start gap-2 text-xs font-normal">
            <Checkbox id="research-confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} disabled={s.research} className="mt-0.5" />
            Li a matéria e registrei o aprendizado.
          </Label>
          <Button variant="outline" size="sm" disabled={s.research} onClick={completeResearch}>
            {s.research ? `✓ Pesquisa concluída · ${XP.research} XP` : `Concluir pesquisa · +${XP.research} XP`}
          </Button>
          <p role="status" className="mt-2 text-xs text-destructive">
            {researchError}
          </p>
        </section>

        <section className="mb-5 border-b border-border pb-5">
          <h3 className="mt-6 mb-2 text-[17px] font-semibold text-primary">Atividade prática · {XP.practice} XP</h3>
          <p className="text-sm leading-[1.8] text-foreground/75">{m.practice}</p>
          <Label htmlFor="notes" className="mt-4 mb-1.5 text-xs">
            Sua resposta ou evidências (mínimo 20 caracteres)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            placeholder="Registre a análise, o controle proposto e a evidência que buscaria…"
            className="min-h-[110px] resize-y"
            onChange={(e) => {
              setNotes(e.target.value)
              dispatch({ type: 'note', module: index, field: 'notes', value: e.target.value })
            }}
          />
          <p className="my-2 text-[11px] text-muted-foreground">A atividade é autoavaliada. Não registre dados pessoais ou segredos.</p>
          <Button variant="outline" size="sm" disabled={s.practice} onClick={completePractice}>
            {s.practice ? `✓ Atividade concluída · ${XP.practice} XP` : `Concluir atividade · +${XP.practice} XP`}
          </Button>
          <p role="status" className="mt-2 text-xs text-destructive">
            {practiceError}
          </p>
        </section>

        <section className="mb-5">
          <h3 className="mt-6 mb-2 text-[17px] font-semibold text-primary">Perguntas e respostas · {XP.question * 2} XP</h3>
          <p className="text-sm leading-[1.8] text-foreground/75">
            Duas questões, quatro alternativas e uma resposta correta. Cada primeiro acerto vale {XP.question} XP. Você pode tentar novamente sem penalidade.
          </p>
          {m.questions.map((_, j) => (
            <QuestionForm key={j} moduleIndex={index} questionIndex={j} onResult={announce} />
          ))}
        </section>

        <p
          id="lesson-message"
          role="status"
          aria-live="polite"
          className={cn('sticky -bottom-8 z-10 -mx-8 -mb-8 border-t border-tint-line bg-tint-strong px-8 py-3.5 text-xs text-foreground/85 max-sm:-bottom-6 max-sm:-mx-6 max-sm:-mb-6 max-sm:px-6 max-sm:py-3')}
        >
          {message}
        </p>
      </DialogContent>
    </Dialog>
  )
}
