import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react'
import { useId, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RichText } from '@/components/rich/RichText'
import type { ActivityContent } from '@/data/campaigns/types'
import { ADR_MIN_CHARS, gradeActivity, isGood, type ActivitySpec } from '@/lib/progress'
import { letters } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ActivityFrame, Notice, qualityLabels, Redo } from './ActivityFrame'
import { useActivity } from './use-activity'

type Decide = Extract<ActivityContent, { kind: 'decide' }>
type Adr = Extract<ActivityContent, { kind: 'adr' }>
type Multi = Extract<ActivityContent, { kind: 'multi' }>

interface Common {
  missionId: string
  index: number
  total: number
}

const optionBox = 'my-1.5 flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-background/40 px-3.5 py-3 text-[13px] leading-relaxed font-normal has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring'

/** Mostra, depois de decidir, o que cada alternativa teria significado. */
function OtherOptions({ options, chosen }: { options: Decide['options']; chosen: number }) {
  return (
    <details className="mt-3 rounded-lg border border-border bg-background/40 p-3 text-[13px]">
      <summary className="cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">Comparar com as outras alternativas</summary>
      <ul className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-2.5 pl-0">
        {options.map((o, k) =>
          k === chosen ? null : (
            <li key={k} className="list-none">
              <p>
                <span className="font-mono text-muted-foreground">{letters[k]}.</span> {o.text}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <strong className="text-foreground">{qualityLabels[o.quality]}.</strong> {o.feedback}
              </p>
            </li>
          ),
        )}
      </ul>
    </details>
  )
}

export function DecideActivity({ missionId, index, total, content, spec }: Common & { content: Decide; spec: Extract<ActivitySpec, { kind: 'decide' }> }) {
  const uid = useId()
  const view = useActivity(missionId, spec)
  const [pick, setPick] = useState('')
  const chosen = view.answer?.v[0]
  const answered = view.result !== null && chosen !== undefined
  const option = answered ? content.options[chosen] : undefined

  return (
    <ActivityFrame content={content} view={view} index={index} total={total} status={answered ? `Decisão registrada: ${qualityLabels[content.options[chosen].quality]}.` : undefined}>
      <fieldset disabled={answered} className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">Escolha uma alternativa</legend>
        <RadioGroup value={answered ? String(chosen) : pick} onValueChange={setPick} className="gap-0">
          {content.options.map((o, k) => (
            <Label key={k} htmlFor={`${uid}-${k}`} className={cn(optionBox, (answered ? chosen === k : pick === String(k)) && 'border-primary bg-tint-strong', answered && 'cursor-default')}>
              <RadioGroupItem id={`${uid}-${k}`} value={String(k)} className="mt-0.5" />
              <span className="min-w-0 flex-1">
                <span className="font-mono text-muted-foreground">{letters[k]}.</span> <RichText as="span" text={o.text} />
              </span>
              {answered && chosen === k ? <span className="shrink-0 text-[11px] font-medium text-primary">Sua escolha</span> : null}
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      {!answered ? (
        <div className="mt-3">
          <Button type="button" disabled={pick === ''} onClick={() => view.submit({ v: [Number(pick)] })}>
            <ShieldCheck aria-hidden="true" /> Confirmar decisão
          </Button>
          <p className="mt-1.5 text-[11px] text-muted-foreground">A decisão é confirmada de uma vez e a simulação segue a partir dela. Você poderá refazê-la depois; o histórico guarda suas escolhas.</p>
        </div>
      ) : option ? (
        <>
          <Notice tone={isGood(option.quality) ? 'ok' : 'warn'}>
            <strong>{qualityLabels[option.quality]}.</strong> {option.feedback}
          </Notice>
          <p className="mt-2 rounded-lg border border-border bg-muted/40 p-3 text-[13px] leading-relaxed">
            <strong>O que acontece na simulação: </strong>
            {option.consequence}
          </p>
          <OtherOptions options={content.options} chosen={chosen} />
          {!isGood(option.quality) ? (
            <div className="mt-3">
              <Redo onClick={() => view.rewind()}>Refazer a decisão</Redo>
            </div>
          ) : null}
        </>
      ) : null}
    </ActivityFrame>
  )
}

export function AdrActivity({ missionId, index, total, content, spec }: Common & { content: Adr; spec: Extract<ActivitySpec, { kind: 'adr' }> }) {
  const uid = useId()
  const view = useActivity(missionId, spec)
  const [pick, setPick] = useState('')
  const [texts, setTexts] = useState<string[]>(() => content.fields.map(() => ''))
  const [model, setModel] = useState(false)
  const [rubric, setRubric] = useState<number[]>(() => content.rubric.map(() => 0))
  const answered = view.result !== null && view.answer !== null
  const chosen = view.answer?.v[0]
  const savedTexts = view.answer?.t ?? []
  const savedRubric = view.answer?.v.slice(1) ?? []
  const filled = texts.every((t) => t.trim().length >= ADR_MIN_CHARS) && pick !== ''
  const locked = model || answered
  const option = answered && chosen !== undefined ? content.options[chosen] : undefined

  return (
    <ActivityFrame content={content} view={view} index={index} total={total}>
      <fieldset disabled={locked} className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-1 text-[13px] font-medium">1. Escolha a decisão</legend>
        <RadioGroup value={answered ? String(chosen) : pick} onValueChange={setPick} className="gap-0">
          {content.options.map((o, k) => (
            <Label key={k} htmlFor={`${uid}-o${k}`} className={cn(optionBox, (answered ? chosen === k : pick === String(k)) && 'border-primary bg-tint-strong', locked && 'cursor-default')}>
              <RadioGroupItem id={`${uid}-o${k}`} value={String(k)} className="mt-0.5" />
              <span className="min-w-0 flex-1">
                <span className="font-mono text-muted-foreground">{letters[k]}.</span> <RichText as="span" text={o.text} />
              </span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="mt-3 grid gap-3">
        <p className="text-[13px] font-medium">2. Escreva o registro com as suas palavras</p>
        {content.fields.map((f, k) => (
          <div key={k}>
            <Label htmlFor={`${uid}-t${k}`} className="mb-1 text-xs">
              {f.label}
            </Label>
            <Textarea
              id={`${uid}-t${k}`}
              value={answered ? (savedTexts[k] ?? '') : texts[k]}
              onChange={(e) => setTexts((prev) => prev.map((t, i) => (i === k ? e.target.value : t)))}
              disabled={locked}
              placeholder={f.hint}
              rows={3}
              maxLength={600}
              aria-describedby={`${uid}-t${k}-ajuda`}
            />
            <p id={`${uid}-t${k}-ajuda`} className="mt-0.5 text-[11px] text-muted-foreground">
              Mínimo de {ADR_MIN_CHARS} caracteres. O texto não é corrigido por palavras-chave: ele é o seu registro e o que você compara com a resposta comentada.
            </p>
          </div>
        ))}
      </div>

      {!answered && !model ? (
        <div className="mt-3">
          <Button type="button" variant="outline" disabled={!filled} onClick={() => setModel(true)}>
            Ver a resposta comentada
          </Button>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Ao abrir a resposta comentada, a decisão e o texto ficam travados para a autoavaliação ser honesta.</p>
        </div>
      ) : null}

      {model || answered ? (
        <section aria-label="Resposta comentada e autoavaliação" className="mt-3 rounded-lg border border-tint-line bg-tint-strong p-3.5">
          <h4 className="text-sm font-semibold">Resposta comentada (uma entre várias defensáveis)</h4>
          <ul className="mt-1.5 grid gap-1.5 pl-0 text-[13px] leading-relaxed">
            {content.model.map((m, k) => (
              <li key={k} className="list-none">
                <span className="font-medium">{content.fields[k]?.label ?? 'Comentário'}: </span>
                <RichText as="span" text={m} />
              </li>
            ))}
          </ul>
          <fieldset className="m-0 mt-3 min-w-0 border-0 p-0" disabled={answered}>
            <legend className="text-[13px] font-medium">3. Autoavaliação (não é corrigida automaticamente)</legend>
            <p className="mb-1 text-[11px] text-muted-foreground">Marque os critérios que o seu registro atende.</p>
            {content.rubric.map((r, k) => {
              const checked = answered ? savedRubric[k] === 1 : rubric[k] === 1
              return (
                <div key={k} className="my-1 flex items-start gap-2 text-[13px]">
                  <Checkbox id={`${uid}-r${k}`} checked={checked} onCheckedChange={(v) => setRubric((prev) => prev.map((x, i) => (i === k ? (v === true ? 1 : 0) : x)))} className="mt-0.5" />
                  <Label htmlFor={`${uid}-r${k}`} className="font-normal leading-relaxed">
                    <RichText as="span" text={r} />
                  </Label>
                </div>
              )
            })}
          </fieldset>
          {!answered ? (
            <div className="mt-3">
              <Button type="button" disabled={pick === ''} onClick={() => view.submit({ v: [Number(pick), ...rubric], t: texts.map((t) => t.trim()) })}>
                <ShieldCheck aria-hidden="true" /> Registrar decisão
              </Button>
            </div>
          ) : null}
        </section>
      ) : null}

      {option ? (
        <>
          <Notice tone={isGood(option.quality) ? 'ok' : 'warn'}>
            <strong>{qualityLabels[option.quality]}.</strong> {option.feedback}
          </Notice>
          <p className="mt-2 rounded-lg border border-border bg-muted/40 p-3 text-[13px] leading-relaxed">
            <strong>O que acontece na simulação: </strong>
            {option.consequence}
          </p>
          {!isGood(option.quality) ? (
            <div className="mt-3">
              <Redo onClick={() => view.rewind()}>Refazer a decisão</Redo>
            </div>
          ) : null}
        </>
      ) : null}
    </ActivityFrame>
  )
}

export function MultiActivity({ missionId, index, total, content, spec }: Common & { content: Multi; spec: Extract<ActivitySpec, { kind: 'multi' }> }) {
  const uid = useId()
  const view = useActivity(missionId, spec)
  const [picked, setPicked] = useState<number[]>([])
  const [miss, setMiss] = useState<{ wrong: number[]; missing: number } | null>(null)
  const answered = view.result !== null
  const shown = answered ? (view.result === 'revealed' ? content.correct : (view.answer?.v ?? [])) : picked

  function toggle(k: number) {
    setMiss(null)
    setPicked((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k].sort((a, b) => a - b)))
  }

  function check() {
    const grade = gradeActivity(spec, { v: picked })
    const result = view.submit({ v: picked })
    if (result.changed && !grade.ok) {
      const wrong = picked.filter((k) => !content.correct.includes(k))
      setMiss({ wrong, missing: content.correct.filter((k) => !picked.includes(k)).length })
    }
  }

  return (
    <ActivityFrame
      content={content}
      view={view}
      index={index}
      total={total}
      status={miss ? `Ainda não: ${miss.wrong.length} marcada(s) a rever e ${miss.missing} faltando.` : answered ? 'Atividade respondida.' : undefined}
    >
      <fieldset disabled={answered} className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">Marque todas as que se aplicam</legend>
        {content.options.map((o, k) => {
          const on = shown.includes(k)
          const isCorrect = content.correct.includes(k)
          const flagged = miss?.wrong.includes(k)
          return (
            <div key={k} className={cn(optionBox, on && 'border-primary bg-tint-strong', flagged && 'border-destructive', answered && 'cursor-default')}>
              <Checkbox id={`${uid}-${k}`} checked={on} onCheckedChange={() => toggle(k)} className="mt-0.5" disabled={answered} />
              <div className="min-w-0 flex-1">
                <Label htmlFor={`${uid}-${k}`} className="items-start font-normal leading-relaxed">
                  <span className="font-mono text-muted-foreground">{letters[k]}.</span> <RichText as="span" text={o.text} />
                </Label>
                {answered || flagged ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {answered ? (
                      <strong className="text-foreground">{isCorrect ? 'Aplica-se. ' : 'Não se aplica. '}</strong>
                    ) : (
                      <strong className="text-destructive">Rever esta marcação. </strong>
                    )}
                    {o.feedback}
                  </p>
                ) : null}
              </div>
              {answered ? isCorrect ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            </div>
          )
        })}
      </fieldset>
      {!answered ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" disabled={picked.length === 0} onClick={check}>
            <ShieldCheck aria-hidden="true" /> Conferir
          </Button>
          <span className="text-xs text-muted-foreground">{picked.length} marcada(s)</span>
        </div>
      ) : null}
      {miss ? (
        <Notice>
          <strong>Ainda não.</strong> {miss.wrong.length > 0 ? `${miss.wrong.length} marcação(ões) não se aplica(m): veja a explicação em cada uma.` : ''} {miss.missing > 0 ? `Falta marcar ${miss.missing === 1 ? 'uma opção' : `${miss.missing} opções`} que se aplica(m).` : ''} Errar não tira XP nem conquistas.
        </Notice>
      ) : null}
    </ActivityFrame>
  )
}
