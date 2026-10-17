import { CheckCircle2, CircleAlert, Info } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ArchitectProject } from '@/data/architect'
import { findArchitect, gradeArchitect, type ArchitectGrade, type ArchitectState } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
import { componentLabel } from './architect-ui'
import { SolutionMeter } from './SolutionMeter'

/** Agrupa por componente e conta (para não revelar ameaças que o aluno ainda não encontrou). */
function byComponent(list: { component: string }[]): [string, number][] {
  const m = new Map<string, number>()
  for (const r of list) m.set(r.component, (m.get(r.component) ?? 0) + 1)
  return [...m.entries()]
}

/** Etapa 3: avaliar a solução contra os critérios do projeto. */
export function EvaluationStage({ project: p, st, onReview }: { project: ArchitectProject; st: ArchitectState | undefined; onReview: () => void }) {
  const { dispatch, ctx } = useProgress()
  const spec = findArchitect(ctx, p.id)
  const [grade, setGrade] = useState<ArchitectGrade | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  if (!spec) return null

  const evaluate = () => {
    dispatch({ type: 'architectEvaluate', project: p.id })
    // A correção é a mesma regra do motor, aplicada ao estado atual.
    setGrade(gradeArchitect(spec, st ?? { started: '', found: {}, applied: {}, adr: [], self: [], evaluated: '', adrDone: '', runs: 0 }))
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  const threatTitle = (component: string, i: number) => p.components.find((c) => c.id === component)?.threats[i]?.title ?? ''
  const marked = (component: string, i: number) => (st?.found[component] ?? []).includes(i)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        A avaliação confere: as ameaças que se aplicam foram marcadas (e nenhuma que não se aplica), toda ameaça crítica tem um controle no lugar certo, os controles obrigatórios estão presentes e a solução cabe no orçamento e na complexidade. Avaliar quantas vezes quiser não tira pontos.
      </p>
      <SolutionMeter project={p} st={st} />
      <div>
        <Button type="button" onClick={evaluate}>
          Avaliar a solução
        </Button>
      </div>

      {grade ? (
        <div ref={resultRef} tabIndex={-1} className="grid grid-cols-[minmax(0,1fr)] gap-3 outline-none" aria-live="polite">
          {grade.ok ? (
            <p className="flex items-start gap-2 rounded-lg border border-tint-line bg-tint-strong p-3 text-[13px]">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong>Solução aprovada nos critérios do projeto.</strong> Escreva agora a ADR, e depois veja a revisão comentada, com as duas soluções de referência.{' '}
                <button type="button" onClick={onReview} className="text-primary underline underline-offset-2">
                  Abrir a revisão
                </button>
              </span>
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-[13px]">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong>Ainda não passou.</strong> Os pontos abaixo dizem o que revisar, sem entregar a resposta.
              </span>
            </p>
          )}

          <ul className="grid gap-2 pl-0 text-[13px] leading-relaxed">
            {byComponent(grade.missed).map(([c, n]) => (
              <li key={`m-${c}`} className="list-none rounded-md border border-border p-2.5">
                <strong>{componentLabel(p, c)}:</strong> {n === 1 ? 'falta marcar 1 ameaça que se aplica.' : `faltam marcar ${n} ameaças que se aplicam.`}
              </li>
            ))}
            {grade.wrong.map((r) => (
              <li key={`w-${r.component}-${r.threat}`} className="list-none rounded-md border border-border p-2.5">
                <strong>{componentLabel(p, r.component)}:</strong> “{threatTitle(r.component, r.threat)}” não se aplica a este componente neste projeto. Releia o detalhe do componente.
              </li>
            ))}
            {byComponent(grade.unmitigated).map(([c, n]) => {
              const known = grade.unmitigated.filter((r) => r.component === c && marked(r.component, r.threat))
              return (
                <li key={`u-${c}`} className="list-none rounded-md border border-border p-2.5">
                  <strong>{componentLabel(p, c)}:</strong> {n === 1 ? '1 ameaça crítica sem controle no lugar certo' : `${n} ameaças críticas sem controle no lugar certo`}
                  {known.length ? `: ${known.map((r) => `“${threatTitle(r.component, r.threat)}”`).join(', ')}.` : '.'}
                </li>
              )
            })}
            {grade.missingMandatory.length ? (
              <li className="list-none rounded-md border border-border p-2.5">
                {grade.missingMandatory.length === 1 ? 'Falta 1 controle que é obrigatório em qualquer solução.' : `Faltam ${grade.missingMandatory.length} controles que são obrigatórios em qualquer solução.`} Pense no que nenhum contexto dispensaria.
              </li>
            ) : null}
            {grade.misplaced.map((m) => (
              <li key={`p-${m.component}-${m.control}`} className="list-none rounded-md border border-border p-2.5">
                “{p.controls[m.control]?.title}” foi aplicado em <strong>{componentLabel(p, m.component)}</strong>, mas precisa existir em outro componente para funcionar.
              </li>
            ))}
            {grade.overBudget ? (
              <li className="list-none rounded-md border border-border p-2.5">
                A solução custa {grade.cost} pontos, acima do orçamento de {p.budget}. Retire o que não trata nenhuma ameaça crítica ou troque por uma alternativa mais barata.
              </li>
            ) : null}
            {grade.overComplexity ? (
              <li className="list-none rounded-md border border-border p-2.5">
                A complexidade operacional é {grade.complexity}, acima do limite de {p.complexity}. A equipe não conseguiria operar tudo isso.
              </li>
            ) : null}
            {grade.redundant.map((c) => (
              <li key={`r-${c}`} className="flex list-none items-start gap-2 rounded-md border border-dashed border-border p-2.5 text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> “{p.controls[c]?.title}” não trata nada que outro controle aplicado já não trate. Não reprova, mas consome orçamento.
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
