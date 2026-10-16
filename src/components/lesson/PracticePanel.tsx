import { CheckCircle2, Code2, FlaskConical, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { challengesOfModule } from '@/data/challenges'
import { modules } from '@/data/modules'
import { isChallengeDone, XP } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

const MIN_NOTE = 20

interface Props {
  module: number
  locked: boolean
  run: (action: Parameters<ReturnType<typeof useProgress>['dispatch']>[0]) => void
}

/** Pesquisa orientada e atividade prática do módulo, com os desafios de código ligados a ele. */
export function PracticePanel({ module, locked, run }: Props) {
  const { state, dispatch } = useProgress()
  const m = modules[module]
  const s = state.modules[module]
  const [researchNote, setResearchNote] = useState(s.researchNote)
  const [notes, setNotes] = useState(s.notes)
  const [confirmed, setConfirmed] = useState(s.research)
  const [researchError, setResearchError] = useState('')
  const [practiceError, setPracticeError] = useState('')
  const challenges = challengesOfModule(module)

  function completeResearch() {
    if (!confirmed || researchNote.trim().length < MIN_NOTE) {
      setResearchError('Leia a matéria interna, escreva pelo menos 20 caracteres e confirme a pesquisa.')
      return
    }
    setResearchError('')
    run({ type: 'research', module })
  }

  function completePractice() {
    if (notes.trim().length < MIN_NOTE) {
      setPracticeError('Registre pelo menos 20 caracteres sobre a atividade antes de concluir.')
      return
    }
    setPracticeError('')
    run({ type: 'practice', module })
  }

  return (
    <div className="grid gap-5">
      <section aria-labelledby="pesquisa-titulo" className="rounded-xl border border-border bg-tint p-4 sm:p-5">
        <h3 id="aba-titulo-praticar" tabIndex={-1} className="sr-only outline-none">
          Praticar
        </h3>
        <h4 id="pesquisa-titulo" className="flex items-center gap-2 text-base font-semibold">
          <Search className="size-4 text-primary" aria-hidden="true" /> Pesquisa orientada <span className="font-mono text-xs font-normal text-muted-foreground">+{XP.research} XP</span>
        </h4>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{m.research}</p>
        <Link to={`/materias/${m.slug}?secao=pesquisa`} className="mt-2 inline-block text-xs text-primary hover:underline">
          Abrir a matéria e a pesquisa
        </Link>
        <Label htmlFor="research-note" className="mt-4 mb-1.5 text-xs">
          Registre uma descoberta da pesquisa (mínimo 20 caracteres)
        </Label>
        <Textarea
          id="research-note"
          value={researchNote}
          placeholder="Escreva com suas palavras o que aprendeu na matéria…"
          className="min-h-[96px] resize-y"
          onChange={(e) => {
            setResearchNote(e.target.value)
            dispatch({ type: 'note', module, field: 'researchNote', value: e.target.value })
          }}
        />
        <Label htmlFor="research-confirm" className="my-3 items-start gap-2 text-xs font-normal">
          <Checkbox id="research-confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} disabled={s.research} className="mt-0.5" />
          Li a matéria e registrei o aprendizado.
        </Label>
        <Button size="sm" variant="outline" disabled={s.research || locked} onClick={completeResearch}>
          {s.research ? (
            <>
              <CheckCircle2 aria-hidden="true" /> Pesquisa concluída
            </>
          ) : (
            'Concluir pesquisa'
          )}
        </Button>
        <p role="status" className="mt-2 text-xs text-destructive empty:hidden">
          {researchError}
        </p>
      </section>

      <section aria-labelledby="pratica-titulo" className="rounded-xl border border-border bg-tint p-4 sm:p-5">
        <h4 id="pratica-titulo" className="flex items-center gap-2 text-base font-semibold">
          <FlaskConical className="size-4 text-primary" aria-hidden="true" /> Atividade prática <span className="font-mono text-xs font-normal text-muted-foreground">+{XP.practice} XP</span>
        </h4>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{m.practice}</p>
        <Label htmlFor="notes" className="mt-4 mb-1.5 text-xs">
          Sua resposta ou evidências (mínimo 20 caracteres)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          placeholder="Registre a análise, o controle proposto e a evidência que buscaria…"
          className="min-h-[96px] resize-y"
          onChange={(e) => {
            setNotes(e.target.value)
            dispatch({ type: 'note', module, field: 'notes', value: e.target.value })
          }}
        />
        <p className="my-2 text-[11px] text-muted-foreground">A atividade é autoavaliada. Não registre dados pessoais ou segredos.</p>
        <Button size="sm" variant="outline" disabled={s.practice || locked} onClick={completePractice}>
          {s.practice ? (
            <>
              <CheckCircle2 aria-hidden="true" /> Atividade concluída
            </>
          ) : (
            'Concluir atividade'
          )}
        </Button>
        <p role="status" className="mt-2 text-xs text-destructive empty:hidden">
          {practiceError}
        </p>
      </section>

      {challenges.length ? (
        <section aria-labelledby="desafios-titulo" className="rounded-xl border border-border bg-tint p-4 sm:p-5">
          <h4 id="desafios-titulo" className="flex items-center gap-2 text-base font-semibold">
            <Code2 className="size-4 text-primary" aria-hidden="true" /> Desafios de código <span className="text-xs font-normal text-muted-foreground">opcionais</span>
          </h4>
          <ul className="mt-2 grid gap-1">
            {challenges.map((c) => (
              <li key={c.id}>
                <Link to={`/desafios?desafio=${c.id}`} className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-[13px] hover:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring">
                  <span>{c.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{isChallengeDone(state.challenges[c.id]) ? 'Concluído' : 'Praticar'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
