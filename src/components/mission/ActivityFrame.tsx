import { CheckCircle2, CircleDashed, Eye, Lightbulb, RotateCcw, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RichText } from '@/components/rich/RichText'
import type { ActivityContent } from '@/data/campaigns/types'
import { HINTS_PER_ACTIVITY, REVEAL_AFTER, type Quality } from '@/lib/progress'
import { cn } from '@/lib/utils'
import type { ActivityView } from './use-activity'

export const kindLabels: Record<ActivityContent['kind'], string> = {
  decide: 'Decisão',
  adr: 'Decisão arquitetural (ADR)',
  multi: 'Marcar o que se aplica',
  order: 'Ordenar',
  assign: 'Associar',
  budget: 'Escolher dentro do orçamento',
  spot: 'Código',
}

export const variantLabels: Record<string, string> = {
  multi: 'Marcar o que se aplica',
  compare: 'Comparar',
  inspect: 'Inspecionar',
  classify: 'Classificar',
  match: 'Associar',
}

export const qualityLabels: Record<Quality, string> = {
  best: 'Melhor escolha',
  good: 'Defensável',
  partial: 'Parcial',
  poor: 'Frágil',
}

interface FrameProps {
  content: ActivityContent
  view: ActivityView
  index: number
  total: number
  /** Texto curto sobre o que fazer; aparece acima das instruções de acessibilidade. */
  children: ReactNode
  /** Mensagem de acompanhamento (aria-live) com o resultado do último envio. */
  status?: string
}

/** Moldura comum: título, enunciado, dicas e, depois de respondida, a explicação. */
export function ActivityFrame({ content, view, index, total, children, status }: FrameProps) {
  const label = content.kind === 'assign' || content.kind === 'multi' ? variantLabels[content.variant] : kindLabels[content.kind]
  const done = view.result !== null
  const canHint = content.kind !== 'spot' && !done
  const shownHints = 'hints' in content ? content.hints.slice(0, view.hints) : []
  const canReveal = !done && view.misses >= REVEAL_AFTER && content.kind !== 'decide' && content.kind !== 'adr' && content.kind !== 'spot'

  return (
    <article aria-labelledby={`atividade-${content.id}`} className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <header className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
        <span>
          Atividade {index + 1} de {total}
        </span>
        <Badge variant="outline" className="rounded text-[10px] tracking-normal normal-case">
          {label}
        </Badge>
        {view.credited ? (
          <span className="inline-flex items-center gap-1 tracking-normal normal-case">
            <CheckCircle2 className="size-3.5" aria-hidden="true" /> Crédito obtido
          </span>
        ) : null}
      </header>
      <h3 id={`atividade-${content.id}`} className="mt-2 text-lg leading-snug font-medium">
        {content.title}
      </h3>
      <RichText text={content.prompt} className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground" />

      <div className="mt-4">{children}</div>

      {canHint || shownHints.length ? (
        <section aria-label="Dicas" className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
          <div className="flex flex-wrap items-center gap-2">
            {canHint ? (
              <Button type="button" variant="outline" size="sm" disabled={view.hints >= HINTS_PER_ACTIVITY} onClick={() => view.hint(view.hints)}>
                <Lightbulb aria-hidden="true" /> {view.hints >= HINTS_PER_ACTIVITY ? 'Sem mais dicas' : view.hints === 0 ? 'Pedir uma dica' : 'Pedir outra dica'}
              </Button>
            ) : null}
            <span className="text-[11px] text-muted-foreground">
              Dicas orientam o olhar e nunca escondem evidência. Usar uma tira só a conquista “Missão Sem Dicas”.
            </span>
          </div>
          {shownHints.length ? (
            <ol className="mt-2 grid gap-1 pl-5 text-xs leading-relaxed text-muted-foreground">
              {shownHints.map((h, i) => (
                <li key={i}>
                  <RichText as="span" text={h} />
                </li>
              ))}
            </ol>
          ) : null}
        </section>
      ) : null}

      {canReveal ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => view.reveal()}>
            <Eye aria-hidden="true" /> Mostrar a solução (sem crédito)
          </Button>
          <span className="text-[11px] text-muted-foreground">Disponível depois de {REVEAL_AFTER} tentativas. Ver a solução não rende crédito nesta atividade.</span>
        </div>
      ) : null}

      <p role="status" aria-live="polite" className={cn('mt-3 min-h-5 text-xs', status ? 'text-primary' : 'sr-only')}>
        {status ?? ''}
      </p>

      {done ? (
        <section aria-label="Explicação" className="mt-3 rounded-lg border border-tint-line bg-tint-strong p-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            {view.result === 'revealed' ? <Eye className="size-4 text-primary" aria-hidden="true" /> : view.credited ? <CheckCircle2 className="size-4 text-primary" aria-hidden="true" /> : <CircleDashed className="size-4 text-primary" aria-hidden="true" />}
            {view.result === 'revealed' ? 'Solução mostrada (sem crédito)' : 'Por que é assim'}
          </p>
          <RichText text={content.explain} className="mt-1.5 text-[13px] leading-relaxed" />
        </section>
      ) : null}
    </article>
  )
}

export function Redo({ onClick, children = 'Refazer esta atividade' }: { onClick: () => void; children?: ReactNode }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <RotateCcw aria-hidden="true" /> {children}
    </Button>
  )
}

export function Notice({ tone = 'warn', children }: { tone?: 'warn' | 'ok'; children: ReactNode }) {
  return (
    <p role="alert" className={cn('mt-3 flex items-start gap-2 rounded-lg border p-3 text-[13px] leading-relaxed', tone === 'warn' ? 'border-destructive/50 bg-destructive/8' : 'border-tint-line bg-tint-strong')}>
      {tone === 'warn' ? <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  )
}
