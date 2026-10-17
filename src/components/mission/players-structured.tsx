import { ArrowDown, ArrowUp, ShieldCheck } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RichText } from '@/components/rich/RichText'
import { CodeChallenge } from '@/components/challenge/CodeChallenge'
import { challengeById } from '@/data/challenges'
import type { ActivityContent } from '@/data/campaigns/types'
import { gradeActivity, solveActivity, type ActivitySpec } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { ActivityFrame, Notice } from './ActivityFrame'
import { useActivity } from './use-activity'

type Order = Extract<ActivityContent, { kind: 'order' }>
type Assign = Extract<ActivityContent, { kind: 'assign' }>
type Budget = Extract<ActivityContent, { kind: 'budget' }>
type Spot = Extract<ActivityContent, { kind: 'spot' }>

interface Common {
  missionId: string
  index: number
  total: number
}

/** Ordem inicial embaralhada de forma estável e que nunca já é uma resposta aceita. */
export function scrambled(spec: Extract<ActivitySpec, { kind: 'order' }>): number[] {
  const base = Array.from({ length: spec.items }, (_, i) => i)
  for (let shift = 2; shift < spec.items + 2; shift++) {
    const candidate = base.map((_, i) => base[(i * 3 + shift) % spec.items] ?? i)
    if (new Set(candidate).size === spec.items && !gradeActivity(spec, { v: candidate }).ok) return candidate
  }
  const reversed = [...base].reverse()
  return gradeActivity(spec, { v: reversed }).ok ? [...base.slice(1), base[0]] : reversed
}

export function OrderActivity({ missionId, index, total, content, spec }: Common & { content: Order; spec: Extract<ActivitySpec, { kind: 'order' }> }) {
  const uid = useId()
  const view = useActivity(missionId, spec)
  const initial = useMemo(() => scrambled(spec), [spec])
  const [order, setOrder] = useState<number[]>(initial)
  const [bad, setBad] = useState<number[]>([])
  const [announce, setAnnounce] = useState('')
  const answered = view.result !== null
  const shown = answered ? (view.result === 'revealed' ? (solveActivity(spec)?.v ?? order) : (view.answer?.v ?? order)) : order

  function move(pos: number, dir: -1 | 1) {
    const target = pos + dir
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[pos], next[target]] = [next[target], next[pos]]
    setOrder(next)
    setBad([])
    setAnnounce(`${content.items[order[pos]].text} movido para a posição ${target + 1} de ${order.length}.`)
  }

  function check() {
    const grade = gradeActivity(spec, { v: order })
    const result = view.submit({ v: order })
    if (result.changed && !grade.ok) setBad(grade.bad)
  }

  return (
    <ActivityFrame content={content} view={view} index={index} total={total} status={announce || (bad.length ? 'Há passos fora de ordem.' : undefined)}>
      <p className="mb-2 text-xs text-muted-foreground">Use os botões “Subir” e “Descer” para mover cada passo (não é preciso arrastar).</p>
      <ol className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-1.5 p-0" aria-label="Passos, na ordem atual">
        {shown.map((item, pos) => (
          <li key={item} className={cn('flex items-start gap-2.5 rounded-lg border bg-background/40 px-3 py-2.5 text-[13px] leading-relaxed', bad.includes(item) ? 'border-destructive' : 'border-border')}>
            <span aria-hidden="true" className="mt-0.5 w-5 shrink-0 font-mono text-muted-foreground">
              {pos + 1}.
            </span>
            <div className="min-w-0 flex-1">
              <RichText text={content.items[item].text} />
              {answered ? <p className="mt-1 text-xs text-muted-foreground">{content.items[item].why}</p> : null}
              {bad.includes(item) ? <p className="mt-1 text-xs font-medium text-destructive">Revise a posição deste passo em relação aos que dependem dele.</p> : null}
            </div>
            {!answered ? (
              <div className="flex shrink-0 gap-1">
                <Button type="button" variant="outline" size="icon-sm" aria-label={`Subir: ${content.items[item].text}`} disabled={pos === 0} onClick={() => move(pos, -1)}>
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button type="button" variant="outline" size="icon-sm" aria-label={`Descer: ${content.items[item].text}`} disabled={pos === shown.length - 1} onClick={() => move(pos, 1)}>
                  <ArrowDown aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {!answered ? (
        <div className="mt-3">
          <Button type="button" onClick={check} id={`${uid}-conferir`}>
            <ShieldCheck aria-hidden="true" /> Conferir a ordem
          </Button>
        </div>
      ) : null}
      {bad.length ? (
        <Notice>
          <strong>Ainda não.</strong> Os passos marcados dependem de outros que ainda estão na posição errada. Ajuste e confira de novo.
        </Notice>
      ) : null}
    </ActivityFrame>
  )
}

export function AssignActivity({ missionId, index, total, content, spec }: Common & { content: Assign; spec: Extract<ActivitySpec, { kind: 'assign' }> }) {
  const uid = useId()
  const view = useActivity(missionId, spec)
  const [values, setValues] = useState<string[]>(() => content.rows.map(() => ''))
  const [bad, setBad] = useState<number[]>([])
  const answered = view.result !== null
  const shown = answered ? (view.result === 'revealed' ? (solveActivity(spec)?.v ?? []) : (view.answer?.v ?? [])) : values.map(Number)
  const complete = values.every((v) => v !== '')

  function check() {
    const v = values.map(Number)
    const grade = gradeActivity(spec, { v })
    const result = view.submit({ v })
    if (result.changed && !grade.ok) setBad(grade.bad)
  }

  return (
    <ActivityFrame content={content} view={view} index={index} total={total} status={bad.length ? `${bad.length} linha(s) a rever.` : undefined}>
      <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-2 p-0">
        {content.rows.map((row, k) => (
          <li key={k} className={cn('min-w-0 rounded-lg border bg-background/40 px-3 py-2.5 text-[13px] leading-relaxed', bad.includes(k) ? 'border-destructive' : 'border-border')}>
            <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
              <Label htmlFor={`${uid}-${k}`} className="min-w-0 flex-1 basis-64 items-start font-normal leading-relaxed">
                <span className="font-mono text-muted-foreground">{k + 1}.</span> <RichText as="span" text={row.text} />
              </Label>
              <select
                id={`${uid}-${k}`}
                value={answered ? String(shown[k] ?? '') : values[k]}
                disabled={answered}
                onChange={(e) => {
                  setValues((prev) => prev.map((x, i) => (i === k ? e.target.value : x)))
                  setBad((prev) => prev.filter((x) => x !== k))
                }}
                className="h-8 w-full max-w-full min-w-0 rounded-md border border-input bg-background sm:w-auto sm:min-w-44 px-2 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-80"
              >
                <option value="">Escolha…</option>
                {content.choices.map((c, i) => (
                  <option key={c} value={i}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {answered ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                <strong className="text-foreground">{view.result === 'revealed' ? content.choices[shown[k]] : content.choices[shown[k]]}. </strong>
                {row.why}
              </p>
            ) : null}
            {bad.includes(k) ? <p className="mt-1.5 text-xs font-medium text-destructive">Reveja esta linha com as evidências.</p> : null}
          </li>
        ))}
      </ul>
      {!answered ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" disabled={!complete} onClick={check}>
            <ShieldCheck aria-hidden="true" /> Conferir
          </Button>
          {!complete ? <span className="text-xs text-muted-foreground">Responda todas as linhas para conferir.</span> : null}
        </div>
      ) : null}
      {bad.length ? (
        <Notice>
          <strong>Ainda não.</strong> {bad.length === 1 ? 'Uma linha está' : `${bad.length} linhas estão`} marcada(s) para revisão. Volte às evidências e ajuste: errar não tira XP nem conquistas.
        </Notice>
      ) : null}
    </ActivityFrame>
  )
}

export function BudgetActivity({ missionId, index, total, content, spec }: Common & { content: Budget; spec: Extract<ActivitySpec, { kind: 'budget' }> }) {
  const uid = useId()
  const view = useActivity(missionId, spec)
  const [picked, setPicked] = useState<number[]>([])
  const [miss, setMiss] = useState<ReturnType<typeof gradeActivity> | null>(null)
  const answered = view.result !== null
  const shown = answered ? (view.result === 'revealed' ? (solveActivity(spec)?.v ?? []) : (view.answer?.v ?? [])) : picked
  const total_ = shown.reduce((n, c) => n + content.controls[c].cost, 0)
  const covered = new Set(shown.flatMap((c) => content.controls[c].covers))
  const over = total_ > content.budget

  function toggle(k: number) {
    setMiss(null)
    setPicked((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k].sort((a, b) => a - b)))
  }

  function check() {
    const grade = gradeActivity(spec, { v: picked })
    const result = view.submit({ v: picked })
    if (result.changed && !grade.ok) setMiss(grade)
  }

  return (
    <ActivityFrame content={content} view={view} index={index} total={total} status={`Total ${total_} de ${content.budget} ${content.unit}.`}>
      <p className="mb-2 text-xs text-muted-foreground">Os custos são {content.unit} ilustrativos de implantação e não medem eficácia. A cobertura de riscos abaixo atualiza conforme você escolhe.</p>
      <fieldset disabled={answered} className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">Controles disponíveis</legend>
        {content.controls.map((c, k) => {
          const on = shown.includes(k)
          return (
            <div key={k} className={cn('my-1.5 flex items-start gap-2.5 rounded-lg border border-border bg-background/40 px-3.5 py-3 text-[13px] leading-relaxed', on && 'border-primary bg-tint-strong')}>
              <Checkbox id={`${uid}-${k}`} checked={on} onCheckedChange={() => toggle(k)} className="mt-0.5" disabled={answered} />
              <div className="min-w-0 flex-1">
                <Label htmlFor={`${uid}-${k}`} className="items-start font-normal leading-relaxed">
                  <RichText as="span" text={c.text} />
                </Label>
                {answered ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {content.mandatory.includes(k) ? <strong className="text-primary">Obrigatório em qualquer contexto. </strong> : null}
                    {c.note}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[11px]" aria-label={`Custo: ${c.cost} ${content.unit}`}>
                {c.cost}
              </span>
            </div>
          )
        })}
      </fieldset>

      <div className={cn('mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-3 py-2 text-[13px]', over ? 'border-destructive' : 'border-border')}>
        <span className="font-medium">
          Total: {total_} de {content.budget} {content.unit}
        </span>
        {over ? <span className="text-xs font-medium text-destructive">Acima do orçamento</span> : null}
      </div>

      <div className="mt-2 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label="Cobertura dos riscos, tabela rolável">
        <table className="w-full min-w-max border-collapse text-left text-xs">
          <caption className="sr-only">Riscos e se estão cobertos pelos controles escolhidos</caption>
          <thead className="bg-tint">
            <tr>
              <th scope="col" className="px-3 py-1.5 font-semibold">Risco</th>
              <th scope="col" className="px-3 py-1.5 font-semibold">Prioridade</th>
              <th scope="col" className="px-3 py-1.5 font-semibold">Situação</th>
            </tr>
          </thead>
          <tbody>
            {content.risks.map((r, k) => (
              <tr key={k} className="border-t border-border">
                <td className="px-3 py-1.5">{r}</td>
                <td className="px-3 py-1.5">{content.critical.includes(k) ? <strong>Crítico</strong> : 'Importante'}</td>
                <td className="px-3 py-1.5">{covered.has(k) ? 'Coberto' : 'Sem cobertura'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!answered ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" disabled={picked.length === 0} onClick={check}>
            <ShieldCheck aria-hidden="true" /> Conferir
          </Button>
        </div>
      ) : null}
      {miss?.budget ? (
        <Notice>
          <strong>Ainda não.</strong>{' '}
          {miss.budget.over ? 'A soma passa do orçamento. ' : ''}
          {miss.budget.uncovered.length ? `${miss.budget.uncovered.length === 1 ? 'Um risco crítico segue' : `${miss.budget.uncovered.length} riscos críticos seguem`} sem cobertura. ` : ''}
          {miss.budget.missing.length ? 'Falta um controle obrigatório, daqueles que valem em qualquer contexto. ' : ''}
          Ajuste a escolha e confira de novo.
        </Notice>
      ) : null}
    </ActivityFrame>
  )
}

export function SpotActivity({ missionId, index, total, content, spec }: Common & { content: Spot; spec: Extract<ActivitySpec, { kind: 'spot' }> }) {
  const view = useActivity(missionId, spec)
  const challenge = challengeById(content.challenge)
  const done = view.result !== null
  return (
    <article className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
        Atividade {index + 1} de {total} · Código
      </p>
      <h3 className="mt-2 text-lg leading-snug font-medium">{content.title}</h3>
      <RichText text={content.prompt} className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground" />
      <p role="status" aria-live="polite" className="mt-3 text-xs text-primary">
        {done ? 'Desafio de código concluído: a atividade está creditada.' : 'Conclua o desafio abaixo (identificar a falha e escolher a correção) para creditar esta atividade.'}
      </p>
      {challenge ? (
        <div className="mt-3">
          <CodeChallenge id={content.challenge} nested />
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Desafio não encontrado. <Link to="/desafios" className="text-primary underline underline-offset-2">Abrir o laboratório</Link>
        </p>
      )}
      {done ? <RichText text={content.explain} className="mt-3 rounded-lg border border-tint-line bg-tint-strong p-3.5 text-[13px] leading-relaxed" /> : null}
    </article>
  )
}
