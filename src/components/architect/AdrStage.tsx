import { CheckCircle2 } from 'lucide-react'
import { useId, useState } from 'react'
import { RichText } from '@/components/rich/RichText'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ArchitectProject } from '@/data/architect'
import { formatDay } from '@/components/mission/dossier-layers'
import { ADR_MIN_CHARS, type ArchitectState } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

/** Etapa 4: ADR simplificada (sete campos), autoavaliação contra a rubrica e resposta comentada. */
export function AdrStage({ project: p, st }: { project: ArchitectProject; st: ArchitectState | undefined }) {
  const { dispatch } = useProgress()
  const uid = useId()
  const [texts, setTexts] = useState<string[]>(() => p.adr.fields.map((_, i) => st?.adr[i] ?? ''))
  const [self, setSelf] = useState<number[]>(() => p.adr.rubric.map((_, i) => st?.self[i] ?? 0))
  const [message, setMessage] = useState('')
  const filled = texts.every((t) => t.trim().length >= ADR_MIN_CHARS)
  const done = Boolean(st?.adrDone)

  const save = () => {
    const r = dispatch({ type: 'architectAdr', project: p.id, fields: texts.map((t) => t.trim()), self })
    setMessage(r.rejected ? 'Não foi possível registrar: preencha todos os campos.' : 'ADR e autoavaliação registradas.')
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Escreva a decisão com as suas palavras. O texto <strong>não é corrigido</strong> por palavras-chave: ele é o seu registro. Depois, marque na rubrica o que você acha que cumpriu e compare com a resposta comentada. A autoavaliação fica identificada como tal.
      </p>

      <form
        className="grid grid-cols-[minmax(0,1fr)] gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (filled) save()
        }}
      >
        {p.adr.fields.map((f, i) => {
          const id = `${uid}-f${i}`
          const short = texts[i].trim().length < ADR_MIN_CHARS
          return (
            <div key={f.label} className="grid gap-1">
              <Label htmlFor={id} className="text-sm font-medium">
                {i + 1}. {f.label}
              </Label>
              <p id={`${id}-dica`} className="text-xs text-muted-foreground">
                {f.hint}
              </p>
              <Textarea
                id={id}
                aria-describedby={`${id}-dica`}
                value={texts[i]}
                onChange={(e) => setTexts((prev) => prev.map((t, k) => (k === i ? e.target.value.slice(0, 1500) : t)))}
                rows={3}
                aria-invalid={short && texts[i].length > 0 ? true : undefined}
              />
            </div>
          )
        })}

        <fieldset className="m-0 min-w-0 rounded-xl border border-border p-3">
          <legend className="px-1 text-sm font-semibold">Autoavaliação (não é correção automática)</legend>
          <ul className="mt-1 grid gap-1.5 pl-0">
            {p.adr.rubric.map((r, i) => {
              const id = `${uid}-r${i}`
              return (
                <li key={r} className="flex list-none items-start gap-2">
                  <Checkbox id={id} checked={self[i] === 1} onCheckedChange={(v) => setSelf((prev) => prev.map((n, k) => (k === i ? (v === true ? 1 : 0) : n)))} className="mt-0.5" />
                  <Label htmlFor={id} className="text-[13px] leading-snug font-normal">
                    {r}
                  </Label>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!filled}>
            {done ? 'Atualizar a ADR' : 'Registrar a ADR e a autoavaliação'}
          </Button>
          <span className="text-xs text-muted-foreground">Cada campo precisa de ao menos {ADR_MIN_CHARS} caracteres.</span>
        </div>
        <p role="status" className="text-xs text-primary">
          {message}
        </p>
      </form>

      {done ? (
        <section aria-labelledby={`${uid}-modelo`} className="rounded-xl border border-tint-line bg-tint p-4">
          <h3 id={`${uid}-modelo`} className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4 text-primary" aria-hidden="true" /> Resposta comentada (registrada em {formatDay(st!.adrDone)})
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">Uma resposta possível, entre outras defensáveis. Compare o que está e o que não está no seu texto.</p>
          <dl className="mt-3 grid gap-3 text-[13px] leading-relaxed">
            {p.adr.fields.map((f, i) => (
              <div key={f.label}>
                <dt className="font-medium">{f.label}</dt>
                <dd className="m-0">
                  <RichText text={p.adr.model[i]} className="text-muted-foreground" />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  )
}
