import { ArrowRight, BookOpenCheck, CheckCircle2, FlaskConical, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { formatDay, LAYERS } from '@/components/mission/dossier-layers'
import { RichParagraphs, RichText } from '@/components/rich/RichText'
import { missionStatus, statusText } from '@/components/mission/mission-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { dossierById } from '@/data/campaigns'
import { refLabel, resolveRef } from '@/data/frameworks'
import { findMission } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

function Layer({ id, layer, tone, children }: { id: string; layer: keyof typeof LAYERS; tone: 'facts' | 'analysis' | 'simulation'; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge id={id} className={cn('rounded', tone === 'facts' ? '' : 'border-primary bg-transparent text-primary')} variant={tone === 'facts' ? 'default' : 'outline'}>
          {LAYERS[layer].label}
        </Badge>
        <span className="text-xs text-muted-foreground">{LAYERS[layer].hint}</span>
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-4">{children}</div>
    </section>
  )
}

export function DossierPage() {
  const { dossier } = useParams()
  const { state, ctx, dispatch } = useProgress()
  const d = dossier ? dossierById(dossier) : undefined
  useDocumentTitle(d ? `Caso real: ${d.title}` : 'Caso não encontrado')

  if (!d) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Caso não encontrado</h1>
        <p className="mt-3 mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Escolha um dossiê na lista.</p>
        <Button asChild>
          <Link to="/casos">Ver os casos reais</Link>
        </Button>
      </div>
    )
  }

  const spec = findMission(ctx, d.id)
  const read = state.dossiers[d.id]
  const status = spec ? missionStatus(state, ctx, spec) : 'new'
  const frameworks = (d.frameworks ?? []).filter((f) => resolveRef(f))

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <nav aria-label="Você está em" className="text-xs text-muted-foreground">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <li>
            <Link to="/casos" className="underline underline-offset-2 hover:text-primary">Casos reais</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{d.title}</li>
        </ol>
      </nav>

      <header>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">Caso real · Dossiê</p>
        <h1 className="mt-2 text-2xl leading-tight font-medium tracking-tight sm:text-3xl">{d.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{d.subtitle}</p>
        <dl className="mt-3 grid gap-1 text-xs sm:grid-cols-3">
          <div>
            <dt className="font-medium">Incidente</dt>
            <dd className="text-muted-foreground">{d.incidentDate}</dd>
          </div>
          <div>
            <dt className="font-medium">Divulgação</dt>
            <dd className="text-muted-foreground">{d.publishedDate}</dd>
          </div>
          <div>
            <dt className="font-medium">Dossiê revisado em</dt>
            <dd className="text-muted-foreground">{formatDay(d.reviewed)}</dd>
          </div>
        </dl>
        {d.notice ? (
          <p role="note" className="mt-3 flex items-start gap-2 rounded-lg border border-tint-line bg-tint-strong p-3 text-[13px] leading-relaxed">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{d.notice}</span>
          </p>
        ) : null}
        <nav aria-label="Seções do dossiê" className="mt-3">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0 text-xs">
            {[
              ['fatos', LAYERS.facts.label],
              ['analise', LAYERS.analysis.label],
              ['simulacao', LAYERS.simulation.label],
              ['fontes', 'Fontes'],
            ].map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  className="rounded-full border border-border px-3 py-1 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => {
                    const el = document.getElementById(id)
                    el?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
                    el?.focus({ preventScroll: true })
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div id="fatos" tabIndex={-1} className="scroll-mt-4 outline-none">
        <Layer id="camada-fatos" layer="facts" tone="facts">
          <div>
            <h2 className="text-lg font-medium">O que está documentado</h2>
            <div className="mt-2">
              <RichParagraphs texts={d.summary} cites className="text-[14px] leading-relaxed" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Linha do tempo</h3>
            <div className="mt-2 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label="Linha do tempo (rolável)">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
                <caption className="sr-only">Linha do tempo do caso, com a fonte de cada registro</caption>
                <thead className="bg-muted/40 text-xs">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Data</th>
                    <th scope="col" className="px-3 py-2 font-medium">O que aconteceu</th>
                    <th scope="col" className="px-3 py-2 font-medium">Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {d.timeline.map((t, i) => (
                    <tr key={i} className="border-t border-border align-top">
                      <th scope="row" className="px-3 py-2 font-mono text-xs font-normal whitespace-nowrap">{t.when}</th>
                      <td className="px-3 py-2 leading-relaxed">
                        <RichText as="span" text={t.what} />
                      </td>
                      <td className="px-3 py-2">
                        <RichText as="span" text={`[${t.source}]`} cites />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-tint-line bg-tint p-3.5">
            <h3 className="text-sm font-semibold">Componente comprometido e relação de confiança</h3>
            <p className="mt-1 text-[13px] font-medium">{d.component.name}</p>
            <RichText text={d.component.trust} className="mt-1 text-[13px] leading-relaxed" cites />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Impacto confirmado</h3>
            <ul className="mt-1.5 grid gap-1.5 pl-5 text-[13px] leading-relaxed">
              {d.impact.map((t, i) => (
                <li key={i}>
                  <RichText as="span" text={t} cites />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-dashed border-border p-3.5">
            <h3 className="text-sm font-semibold">Incertezas e limites das fontes</h3>
            <ul className="mt-1.5 grid gap-1.5 pl-5 text-[13px] leading-relaxed">
              {d.uncertainties.map((t, i) => (
                <li key={i}>
                  <RichText as="span" text={t} cites />
                </li>
              ))}
            </ul>
          </div>
        </Layer>
      </div>

      <div id="analise" tabIndex={-1} className="scroll-mt-4 outline-none">
        <Layer id="camada-analise" layer="analysis" tone="analysis">
          <div>
            <h2 className="text-lg font-medium">Como ler o caso</h2>
            <div className="mt-2">
              <RichParagraphs texts={d.analysis} className="text-[14px] leading-relaxed" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Lições para aplicar</h3>
            <ul className="mt-1.5 grid gap-1.5 pl-5 text-[13px] leading-relaxed">
              {d.lessons.map((t, i) => (
                <li key={i}>
                  <RichText as="span" text={t} />
                </li>
              ))}
            </ul>
          </div>
          {frameworks.length ? (
            <div>
              <h3 className="text-sm font-semibold">Itens de frameworks que o caso ilustra</h3>
              <ul className="mt-1.5 grid gap-1 pl-5 text-[13px]">
                {frameworks.map((f) => {
                  const r = resolveRef(f)!
                  return (
                    <li key={`${f.framework}-${f.id}`}>
                      <a href={r.url} target="_blank" rel="noreferrer noopener" className="text-primary underline underline-offset-2">
                        {refLabel(f)}
                      </a>{' '}
                      <span className="text-muted-foreground">({r.framework.edition})</span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Só entram correspondências conferidas. Edições e datas de revisão estão em <Link to="/cobertura" className="text-primary underline underline-offset-2">Cobertura de frameworks</Link>.
              </p>
            </div>
          ) : null}
        </Layer>
      </div>

      <div id="simulacao" tabIndex={-1} className="scroll-mt-4 outline-none">
        <Layer id="camada-simulacao" layer="simulation" tone="simulation">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-medium">
              <FlaskConical className="size-5 text-primary" aria-hidden="true" /> {d.exercise.title}
            </h2>
            <RichText text={d.exercise.objective} className="mt-2 text-[14px] leading-relaxed" />
            <p className="mt-2 text-xs text-muted-foreground">
              Tudo nesta simulação é inventado: empresa, pessoas, servidores e endereços usam nomes e faixas reservadas para exemplos. Ela usa o mesmo formato das missões das campanhas e dá XP e conquistas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link to={`/casos/${d.id}/simulacao`}>
                {status === 'new' ? 'Começar a simulação' : status === 'passed' ? 'Rever a simulação' : 'Continuar a simulação'} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">Situação: {statusText[status]}</span>
          </div>
        </Layer>
      </div>

      <section id="fontes" tabIndex={-1} aria-labelledby="fontes-titulo" className="scroll-mt-4 rounded-xl border border-border bg-card p-4 outline-none sm:p-5">
        <h2 id="fontes-titulo" className="flex items-center gap-2 text-lg font-medium">
          <BookOpenCheck className="size-5 text-primary" aria-hidden="true" /> Fontes
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Fontes primárias primeiro. Os links levam a sites externos e precisam de internet; o restante do dossiê funciona offline. Consultadas em {formatDay(d.reviewed)}.</p>
        <ol className="mt-3 grid gap-2 pl-0 text-[13px]">
          {d.sources.map((s, i) => (
            <li key={s.url} id={`fonte-${i + 1}`} tabIndex={-1} className="flex flex-wrap items-baseline gap-x-2 rounded-md px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="font-mono text-xs text-primary">[{i + 1}]</span>
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="text-primary underline underline-offset-2 [overflow-wrap:anywhere]">
                {s.label}
              </a>
              <Badge variant="outline" className="rounded text-[10px]">
                {s.kind}
              </Badge>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="leitura-titulo" className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 id="leitura-titulo" className="text-lg font-medium">
          Seu registro de leitura
        </h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Marcar como lido vale 10 XP uma única vez e conta para a conquista Investigador junto com a simulação aprovada. É um registro seu: o site não verifica a leitura.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {read ? (
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <CheckCircle2 className="size-4" aria-hidden="true" /> Lido em {formatDay(read)}
            </p>
          ) : (
            <Button type="button" variant="outline" onClick={() => dispatch({ type: 'dossierRead', dossier: d.id })}>
              Marcar como lido
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link to="/casos">Voltar aos casos reais</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
