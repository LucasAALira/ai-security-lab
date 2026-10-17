import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ArchitectProject } from '@/data/architect'
import { refLabel, resolveRef } from '@/data/frameworks'
import { componentLabel, STRIDE_NAMES } from './architect-ui'

/** Etapa 5: revisão comentada. Mostra o que cada ameaça é, o que cada controle é e duas soluções defensáveis. */
export function ReviewStage({ project: p }: { project: ArchitectProject }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <section aria-labelledby="rev-ameacas">
        <h3 id="rev-ameacas" className="text-base font-medium">Ameaças, componente a componente</h3>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-3">
          {p.components.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold">{c.label}</h4>
              <ul className="mt-2 grid gap-2 pl-0 text-[13px] leading-relaxed">
                {c.threats.map((t) => (
                  <li key={t.id} className="list-none">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className={t.real ? (t.critical ? 'rounded border-destructive text-destructive' : 'rounded border-primary text-primary') : 'rounded'}>
                        {t.real ? (t.critical ? 'Aplica-se · crítica' : 'Aplica-se · pode ser aceita com registro') : 'Não se aplica'}
                      </Badge>
                      <span className="font-medium">{t.title}</span>
                    </div>
                    <p className="mt-0.5 text-muted-foreground">{t.why}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      STRIDE: {t.stride.map((s) => STRIDE_NAMES[s]).join(', ')}
                      {t.refs?.length ? ` · ${t.refs.map(refLabel).join(' · ')}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="rev-controles">
        <h3 id="rev-controles" className="text-base font-medium">O catálogo de controles</h3>
        <ul className="mt-2 grid gap-2 pl-0 text-[13px] leading-relaxed">
          {p.controls.map((c) => (
            <li key={c.id} className="list-none rounded-lg border border-border bg-card p-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className={c.mandatory ? 'rounded border-primary text-primary' : 'rounded'}>
                  {c.mandatory ? 'Obrigatório' : 'Escolha de contexto'}
                </Badge>
                <span className="font-medium">{c.title}</span>
              </div>
              <p className="mt-0.5 text-muted-foreground">{c.note}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Onde fica: {c.places.map((id) => componentLabel(p, id)).join(', ')} · custo {c.cost} · complexidade {c.complexity}
                {c.mitigates.length === 0 ? ' · não trata nenhuma ameaça deste projeto sozinho' : ''}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rev-solucoes">
        <h3 id="rev-solucoes" className="text-base font-medium">Duas soluções defensáveis</h3>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
          {p.solutions.map((s) => (
            <div key={s.title} className="rounded-xl border border-tint-line bg-tint p-4 text-[13px] leading-relaxed">
              <h4 className="text-sm font-semibold">{s.title}</h4>
              <p className="mt-1">{s.tradeoffs}</p>
              <ul className="mt-2 grid gap-0.5 pl-4 text-xs text-muted-foreground">
                {s.controls.map((id) => (
                  <li key={id}>{p.controls.find((c) => c.id === id)?.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="rev-refs">
        <h3 id="rev-refs" className="text-base font-medium">Referências</h3>
        <ul className="mt-2 grid gap-1 pl-0 text-[13px]">
          {p.refs.map((r) => {
            const resolved = r.framework ? resolveRef(r.framework) : undefined
            const url = r.url ?? resolved?.url
            return (
              <li key={r.label} className="list-none">
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-primary underline underline-offset-2">
                    {r.label} <ExternalLink className="size-3" aria-hidden="true" />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : (
                  r.label
                )}
                {resolved ? <span className="text-xs text-muted-foreground"> · {resolved.framework.edition}</span> : null}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
