import { useEffect, useRef, useState } from 'react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { remediationCases } from '@/data/scenarios'
import type { CompanySize, RemediationCase } from '@/data/types'
import { letters } from '@/lib/format'
import { CASE_COUNT, XP } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

export const companySizes: CompanySize[] = ['Pequena', 'Média', 'Grande']

const companyDescriptions: Record<CompanySize, string> = {
  Pequena: 'Equipe enxuta, poucos serviços e operação simples: priorize redução de permissões, isolamento de dados e fluxos manuais claros.',
  Média: 'Várias equipes e integrações compartilhadas: reutilize identidade, gestão de segredos e verificações no processo de entrega.',
  Grande: 'Muitas unidades, clientes ou transações: coordene políticas, segregação de funções e testes de isolamento em escala.',
}

interface Props {
  size: CompanySize
  onSizeChange: (size: CompanySize) => void
  active: number | null
  onActiveChange: (index: number) => void
  /** Aumenta quando outra parte da página pede para mostrar o caso aberto. */
  revealToken: number
}

export function RemediationSection({ size, onSizeChange, active, onActiveChange, revealToken }: Props) {
  const { state } = useProgress()
  const workspace = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!revealToken) return
    workspace.current?.scrollIntoView({ block: 'start' })
    workspace.current?.focus({ preventScroll: true })
  }, [revealToken])

  return (
    <section id="cenarios" aria-labelledby="scenario-title" className="mb-14 border-t-2 border-primary pt-6">
      <SectionHeading eyebrow="SANDBOX DE CORREÇÃO" id="scenario-title" title="Vulnerabilidades no dia a dia" aside={<span className="font-sans text-muted-foreground">{state.cases.filter(Boolean).length}/{CASE_COUNT} cenários concluídos</span>} />
      <p className="mt-3 text-[13px] text-muted-foreground">
        Escolha o porte da empresa, investigue o caso e selecione uma solução. Cada primeiro acerto vale <strong className="text-foreground">{XP.fix} XP</strong>. Os cenários são fictícios e a avaliação é local, sem executar ataques ou chamar modelos.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        O porte indica recursos e complexidade neste exercício; a escolha real de controles depende do risco, dos dados e do contexto. Uma empresa pequena também pode tratar dados de alto risco.
      </p>
      <div role="group" aria-label="Porte da empresa" className="my-[18px] flex flex-wrap gap-2">
        {companySizes.map((s) => (
          <Button key={s} variant={s === size ? 'default' : 'outline'} aria-pressed={s === size} onClick={() => onSizeChange(s)} className={cn(s === size && 'font-semibold')}>
            {s === 'Pequena' ? 'Pequena empresa' : s === 'Média' ? 'Média empresa' : 'Grande empresa'}
          </Button>
        ))}
      </div>
      <p className="rounded-md border border-tint-line bg-tint px-3 py-2.5 text-xs">{companyDescriptions[size]}</p>

      <div className="my-[18px] grid gap-4 sm:grid-cols-2">
        {remediationCases.map((c, i) =>
          c.size !== size ? null : (
            <article key={c.id} className="flex flex-col rounded-[10px] border border-border bg-[linear-gradient(145deg,var(--tint-strong),var(--card))] p-6 max-sm:p-5">
              <Badge variant="secondary" className="self-start rounded text-[9px] text-primary">
                {c.size} empresa · {XP.fix} XP
              </Badge>
              <h3 className="mt-3.5 mb-2 text-xl leading-snug">{c.title}</h3>
              <p className="mb-[18px] text-xs text-muted-foreground">{c.risk}</p>
              <Button variant="outline" size="sm" className="mt-auto self-start" onClick={() => onActiveChange(i)}>
                {state.cases[i] ? '✓ Revisar solução' : 'Investigar e corrigir →'}
              </Button>
            </article>
          ),
        )}
      </div>

      <div ref={workspace} id="case-workspace" tabIndex={-1} className="scroll-mt-5 outline-none">
        {active !== null ? <CaseDetail key={active} index={active} /> : null}
      </div>
    </section>
  )
}

function CaseDetail({ index }: { index: number }) {
  const { state, dispatch } = useProgress()
  const c = remediationCases[index]
  const done = state.cases[index]
  const [chosen, setChosen] = useState<string>(done ? String(c.correct) : '')
  const [feedback, setFeedback] = useState<{ text: string; kind: 'info' | 'warn' } | null>(done ? { text: 'Você já concluiu este caso. Revise a justificativa e o plano de validação abaixo.', kind: 'info' } : null)
  const [wrong, setWrong] = useState(false)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (chosen === '') return setFeedback({ text: 'Selecione uma solução antes de avaliar.', kind: 'warn' })
    const n = Number(chosen)
    if (n !== c.correct) {
      setWrong(true)
      return setFeedback({ text: `${c.feedback[n]} A vulnerabilidade permanece sem correção suficiente neste cenário. Tente outra solução.`, kind: 'warn' })
    }
    const result = dispatch({ type: 'solveCase', index })
    setFeedback({ text: c.feedback[n] + (result.changed ? ` +${XP.fix} XP pelo primeiro acerto.` : ''), kind: 'info' })
  }

  return (
    <article className="rounded-[10px] border border-tint-line bg-tint-strong p-7 max-sm:p-5">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">
        CASO {index + 1} / {c.size.toUpperCase()} EMPRESA
      </div>
      <h3 className="mt-3 mb-[18px] text-2xl leading-snug text-primary max-sm:text-xl">{c.title}</h3>
      <dl className="mb-6">
        {(
          [
            ['Ambiente', c.context],
            ['Sinal da falha', c.signal],
            ['Objetivo da correção', c.goal],
          ] as const
        ).map(([term, text]) => (
          <div key={term}>
            <dt className="mt-3 text-xs font-bold tracking-wide text-foreground/70">{term}</dt>
            <dd className="mt-1 text-sm leading-[1.8] text-foreground/85 max-sm:text-[13px]">{text}</dd>
          </div>
        ))}
      </dl>
      <form onSubmit={submit}>
        <fieldset disabled={done} className="min-w-0 border-0 p-0">
          <legend className="mb-2.5 text-sm font-bold">Qual solução trata melhor o problema descrito?</legend>
          <RadioGroup value={chosen} onValueChange={setChosen} disabled={done} className="gap-2">
            {c.options.map((option, k) => (
              <Label key={option} htmlFor={`case-${index}-${k}`} className={cn('flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-card px-3.5 py-3 text-[13px] font-normal', chosen === String(k) && 'border-primary bg-tint-strong')}>
                <RadioGroupItem id={`case-${index}-${k}`} value={String(k)} className="mt-0.5" />
                <span>
                  {letters[k]}. {option}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
        <Button type="submit" className="mt-4" disabled={done}>
          {done ? `✓ Correção concluída · ${XP.fix} XP` : 'Avaliar correção'}
        </Button>
      </form>
      <div role="status" aria-live="polite" className={cn('mt-[18px] text-[13px]', feedback?.kind === 'warn' && 'rounded-md border border-warning/50 bg-warning/10 px-3 py-2.5 text-warning', feedback?.kind === 'info' && 'rounded-md border border-tint-line bg-tint px-3 py-2.5')}>
        {feedback?.text}
      </div>
      {wrong && !done ? (
        <details className="mt-4 text-[13px] text-foreground/80">
          <summary className="cursor-pointer text-primary">Consultar solução comentada</summary>
          <p className="mt-2">
            <strong>
              {letters[c.correct]}. {c.options[c.correct]}
            </strong>
          </p>
          <p>{c.feedback[c.correct]}</p>
        </details>
      ) : null}
      {done ? <SolutionPlan c={c} /> : null}
      <a href={c.source} className="mt-[18px] inline-block text-xs text-primary hover:underline" target="_blank" rel="noopener noreferrer">
        Referência OWASP · edição 2025 ↗
      </a>
    </article>
  )
}

function SolutionPlan({ c }: { c: RemediationCase }) {
  return (
    <div className="mt-[18px] rounded-md border border-border border-l-4 border-l-primary bg-card p-[18px]">
      <h4 className="text-sm font-semibold text-primary">Plano de correção</h4>
      <ol className="my-2 list-decimal space-y-2 pl-[22px] text-[13px] leading-[1.8] text-foreground/80">
        {c.solution.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h4 className="mt-3 text-sm font-semibold text-primary">Como verificar a correção</h4>
      <p className="mt-1.5 text-[13px] text-foreground/80">{c.test}</p>
      <h4 className="mt-3 text-sm font-semibold text-primary">Aplicação para este porte</h4>
      <p className="mt-1.5 text-[13px] text-foreground/80">{c.tradeoff}</p>
      <h4 className="mt-3 text-sm font-semibold text-primary">O que ainda precisa de atenção</h4>
      <p className="mt-1.5 text-[13px] text-foreground/80">{c.residual}</p>
      <p className="mt-3 text-xs text-muted-foreground">O acerto confirma a escolha no exercício. A simulação não executa controles nem comprova segurança de um sistema real.</p>
    </div>
  )
}
