import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Circle, Clock, Compass, Lock, RotateCcw, ScrollText, Trophy } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RichParagraphs, RichText } from '@/components/rich/RichText'
import { campaignById, dossierById, missionContentById, type Evidence, type MissionContent } from '@/data/campaigns'
import { isGood, MISSION_STAGES, firstPending, isCleanRun, missionLock, missionPassed, missionState, missionXp, runFlags, type ActivityResult, type MissionSpec } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { ActivityPlayer } from './ActivityPlayer'
import { qualityLabels } from './ActivityFrame'
import { EvidencePanel } from './EvidencePanel'

export const STAGES = [
  { id: 'contexto', label: 'Contexto' },
  { id: 'evidencias', label: 'Evidências' },
  { id: 'decisao', label: 'Decisão' },
  { id: 'consequencias', label: 'Consequências' },
  { id: 'revisao', label: 'Revisão' },
] as const

/** Evidências liberadas para a tentativa: pela posição atual e pelas marcas das decisões já tomadas. */
export function visibleEvidence(content: MissionContent, pending: number, flags: string[]): Evidence[] {
  return content.evidence.filter((e) => e.from <= pending && (e.when ?? []).every((f) => flags.includes(f)))
}

/** Texto de fechamento: o primeiro cujas marcas coincidem com as da tentativa. */
export function closingFor(content: MissionContent, flags: string[]): string {
  return (content.closing.find((c) => (c.when ?? []).every((f) => flags.includes(f))) ?? content.closing[content.closing.length - 1]).text
}

function Stepper({ stage, reachable, onGo }: { stage: number; reachable: number; onGo: (n: number) => void }) {
  return (
    <nav aria-label="Etapas da missão">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-xs">
        {STAGES.map((s, i) => {
          const state = i < stage ? 'feita' : i === stage ? 'atual' : 'pendente'
          const enabled = i <= reachable
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!enabled}
                aria-current={i === stage ? 'step' : undefined}
                onClick={() => onGo(i)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
                  i === stage ? 'border-primary text-primary' : i < stage ? 'border-tint-line text-foreground/80' : 'border-border text-muted-foreground',
                )}
              >
                <span className="font-mono">{i + 1}</span> {s.label}
                <span className="sr-only"> ({state}{enabled ? '' : ', bloqueada até concluir as atividades'})</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

const resultIcon = (r: ActivityResult | null) => (r === null ? Circle : r === 'revealed' ? Circle : isGood(r) ? CheckCircle2 : Circle)

export function MissionView({ content, spec }: { content: MissionContent; spec: MissionSpec }) {
  const { state, ctx, dispatch, derived } = useProgress()
  const m = missionState(state, spec.id)
  const lock = missionLock(state, ctx, spec.id)
  const campaign = campaignById(content.campaign)
  const dossier = spec.kind === 'dossier' ? dossierById(spec.id) : undefined
  const total = spec.activities.length
  const pending = firstPending(state, spec, m)
  const flags = useMemo(() => runFlags(spec, m), [spec, m])
  const started = Boolean(m.started)
  const stage = started ? m.stage : 0
  const reachable = started ? (pending >= total ? MISSION_STAGES - 1 : 2) : 1
  const step = Math.min(m.step, Math.max(0, total - 1), pending)
  const evidence = visibleEvidence(content, pending, flags)
  const passed = missionPassed(state, spec)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  // Ao trocar de etapa ou de atividade, o foco vai para o título: leitores de tela e teclado acompanham.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [stage, step])

  if (lock.locked) {
    const previous = lock.previous ? missionContentById(lock.previous) : undefined
    return (
      <div className="rounded-xl border border-dashed border-border p-5 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <Lock className="size-4" aria-hidden="true" /> Missão bloqueada
        </p>
        <p className="mt-2 text-muted-foreground">
          {lock.reason === 'previous' ? (
            <>Conclua antes a missão anterior{previous ? <>: <Link to={`/campanhas/${previous.campaign}/${previous.id}`} className="text-primary underline underline-offset-2">{previous.title}</Link></> : ''}.</>
          ) : (
            <>Conclua antes {lock.campaigns.length === 1 ? 'a campanha' : 'as campanhas'}: {lock.campaigns.map((c) => campaignById(c)?.title ?? c).join(', ')}.</>
          )}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link to="/campanhas">Ver as campanhas</Link>
        </Button>
      </div>
    )
  }

  const go = (n: number, st?: number) => dispatch({ type: 'missionGo', mission: spec.id, stage: n, step: st })
  const xp = missionXp(state, spec)
  const next = campaign?.missions.find((x) => x.order === content.order + 1)
  const decisionList = content.activities.map((a, i) => ({ a, i, result: m.run.results[a.id] ?? null }))

  return (
    <div className="grid gap-5">
      <header>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
          {dossier ? `Simulação fictícia · inspirada em ${dossier.title}` : `Campanha ${campaign?.title ?? ''} · Missão ${content.order} de ${campaign?.missions.length ?? '?'}`}
        </p>
        <h1 className="mt-2 text-2xl leading-tight font-medium tracking-tight sm:text-3xl">{content.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="rounded">
            {content.level}
          </Badge>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" /> cerca de {content.minutes} min
          </span>
          <span>{campaign?.company ? `Empresa fictícia: ${campaign.company}` : dossier ? 'Empresa, nomes e dados inventados' : ''}</span>
          {started ? (
            <span>
              Atividades: {pending} de {total}
            </span>
          ) : null}
          <span>XP desta missão: {xp}</span>
        </div>
      </header>

      <Stepper stage={stage} reachable={reachable} onGo={(n) => (n === MISSION_STAGES - 1 ? dispatch({ type: 'missionFinish', mission: spec.id }) : go(n))} />

      {stage === 0 ? (
        <section aria-labelledby="etapa-titulo" className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="etapa-titulo" ref={headingRef} tabIndex={-1} className="text-lg font-medium outline-none">
            1. Contexto
          </h2>
          <RichParagraphs texts={content.context} className="text-[14px] leading-relaxed" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-tint-line bg-tint p-3.5">
              <h3 className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Objetivo</h3>
              <RichText text={content.objective} className="mt-1 text-[13px] leading-relaxed" />
              <h3 className="mt-3 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Antes de começar</h3>
              <RichText text={content.prereqs} className="mt-1 text-[13px] leading-relaxed text-muted-foreground" />
            </div>
            <div className="rounded-lg border border-tint-line bg-tint p-3.5">
              <h3 className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Como você será avaliado</h3>
              <ul className="mt-1 grid gap-1 pl-4 text-[13px] leading-relaxed">
                {content.criteria.map((c, i) => (
                  <li key={i}>
                    <RichText as="span" text={c} />
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted-foreground">As atividades usam formatos variados (decisão, marcação, ordenação, associação, orçamento, código) e são corrigidas por regras. Nada é avaliado por palavras-chave.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => go(1)}>
              {started ? 'Continuar' : 'Começar a missão'} <ArrowRight aria-hidden="true" />
            </Button>
            <span className="text-xs text-muted-foreground">Seu avanço é salvo neste navegador a cada passo.</span>
          </div>
        </section>
      ) : null}

      {stage === 1 ? (
        <section aria-labelledby="etapa-titulo" className="grid gap-4">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h2 id="etapa-titulo" ref={headingRef} tabIndex={-1} className="text-lg font-medium outline-none">
              2. Evidências
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Examine o que já está disponível. Novas evidências são liberadas conforme você avança e conforme as suas decisões, e todas ficam acessíveis depois de liberadas.
            </p>
          </div>
          <EvidencePanel items={evidence} step={pending} label="Evidências disponíveis" />
          <div>
            <Button type="button" onClick={() => go(2, pending >= total ? total - 1 : pending)}>
              {pending > 0 ? 'Voltar às atividades' : 'Ir para as decisões'} <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </section>
      ) : null}

      {stage === 2 ? (
        <section aria-labelledby="etapa-titulo" className="grid gap-4">
          <h2 id="etapa-titulo" ref={headingRef} tabIndex={-1} className="text-lg font-medium outline-none">
            3. Decisão · {content.activities[step].title}
          </h2>
          <nav aria-label="Atividades da missão">
            <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0 text-xs">
              {decisionList.map(({ a, i, result }) => {
                const Icon = resultIcon(result)
                const enabled = i <= pending
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      disabled={!enabled}
                      aria-current={i === step ? 'step' : undefined}
                      onClick={() => go(2, i)}
                      className={cn('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50', i === step ? 'border-primary text-primary' : 'border-border text-muted-foreground')}
                    >
                      <Icon className={cn('size-3.5', result !== null && result !== 'revealed' && isGood(result) && 'text-primary')} aria-hidden="true" />
                      {i + 1}. {a.title}
                      <span className="sr-only">{result === null ? ' (pendente)' : result === 'revealed' ? ' (solução mostrada)' : isGood(result) ? ' (com crédito)' : ' (sem crédito, pode refazer)'}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
          <div className="grid items-start gap-4 min-[1100px]:grid-cols-2">
            <div className="min-w-0 min-[1100px]:sticky min-[1100px]:top-4 min-[1100px]:max-h-[calc(100vh-2rem)] min-[1100px]:overflow-y-auto">
              <EvidencePanel items={evidence} step={pending} />
            </div>
            <div className="min-w-0">
              <ActivityPlayer key={`${spec.id}-${m.attempts}-${content.activities[step].id}`} missionId={spec.id} content={content.activities[step]} spec={spec.activities[step]} index={step} total={total} />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" disabled={step === 0} onClick={() => go(2, step - 1)}>
                  <ArrowLeft aria-hidden="true" /> Atividade anterior
                </Button>
                {step < total - 1 ? (
                  <Button type="button" size="sm" disabled={step >= pending} onClick={() => go(2, step + 1)}>
                    Próxima atividade <ArrowRight aria-hidden="true" />
                  </Button>
                ) : (
                  <Button type="button" size="sm" disabled={pending < total} onClick={() => go(3)}>
                    Ver as consequências <ArrowRight aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {stage === 3 ? (
        <section aria-labelledby="etapa-titulo" className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 id="etapa-titulo" ref={headingRef} tabIndex={-1} className="text-lg font-medium outline-none">
            4. Consequências
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Esta é uma <strong>simulação educacional</strong>: cada decisão leva a um desfecho coerente com as evidências, sem porcentagens de “chance de sucesso” inventadas. O objetivo é ver o encadeamento, e não prever números.
          </p>
          <ol className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-3 p-0">
            {content.activities.map((a, i) => {
              const result = m.run.results[a.id] ?? null
              if (a.kind === 'decide' || a.kind === 'adr') {
                const pick = m.run.answers[a.id]?.v[0]
                const option = pick === undefined ? undefined : a.options[pick]
                return (
                  <li key={a.id} className="rounded-lg border border-border bg-background/40 p-3.5 text-[13px] leading-relaxed">
                    <p className="font-medium">
                      {i + 1}. {a.title}
                    </p>
                    {option ? (
                      <>
                        <p className="mt-1 text-muted-foreground">
                          Você escolheu: <RichText as="span" text={option.text} /> <strong className="text-foreground">({qualityLabels[option.quality]})</strong>
                        </p>
                        <p className="mt-1.5">
                          <strong>Desfecho: </strong>
                          {option.consequence}
                        </p>
                        {!isGood(option.quality) ? (
                          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => dispatch({ type: 'missionRewind', mission: spec.id, activity: a.id })}>
                            <RotateCcw aria-hidden="true" /> Refazer esta decisão
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                  </li>
                )
              }
              return (
                <li key={a.id} className="rounded-lg border border-border bg-background/40 p-3.5 text-[13px] leading-relaxed">
                  <p className="font-medium">
                    {i + 1}. {a.title}
                  </p>
                  <p className="mt-1 text-muted-foreground">{result === 'revealed' ? 'Solução mostrada, sem crédito.' : result ? 'Concluída com crédito.' : 'Pendente.'}</p>
                </li>
              )
            })}
          </ol>
          <div className="rounded-lg border border-tint-line bg-tint-strong p-3.5">
            <h3 className="text-sm font-semibold">Como terminou</h3>
            <RichText text={closingFor(content, flags)} className="mt-1 text-[13px] leading-relaxed" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => { dispatch({ type: 'missionFinish', mission: spec.id }) }}>
              Concluir e ir para a revisão <ArrowRight aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" onClick={() => go(2, Math.max(0, total - 1))}>
              <ArrowLeft aria-hidden="true" /> Voltar às atividades
            </Button>
          </div>
        </section>
      ) : null}

      {stage === 4 ? (
        <section aria-labelledby="etapa-titulo" className="grid gap-4">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h2 id="etapa-titulo" ref={headingRef} tabIndex={-1} className="text-lg font-medium outline-none">
              5. Revisão
            </h2>
            <p className={cn('mt-2 flex items-start gap-2 rounded-lg border p-3 text-[13px] leading-relaxed', passed ? 'border-tint-line bg-tint-strong' : 'border-border bg-muted/40')}>
              {passed ? <Trophy className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> : <Compass className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />}
              <span>
                {passed
                  ? `Missão aprovada: todas as atividades têm crédito.${m.clean ? ' Os critérios de contenção e preservação de evidências foram cumpridos.' : ''}${m.noHints ? ' Você a concluiu sem dicas.' : ''}`
                  : 'Missão concluída, mas ainda há atividades sem crédito (decisões frágeis ou soluções mostradas). Comece uma nova tentativa para obtê-lo: o que você já conquistou permanece.'}
                {m.done && !isCleanRun(spec, m) && content.clean ? ' Nesta tentativa, os critérios de contenção precisa não foram todos cumpridos.' : ''}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Explicação completa da solução</h3>
            <div className="mt-2">
              <RichParagraphs texts={content.review.solution} className="text-[13px] leading-relaxed" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h3 className="text-sm font-semibold">Risco residual</h3>
              <RichText text={content.review.residual} className="mt-1.5 text-[13px] leading-relaxed" />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h3 className="text-sm font-semibold">Como validar</h3>
              <RichText text={content.review.validation} className="mt-1.5 text-[13px] leading-relaxed" />
            </div>
          </div>

          {content.deeper?.length ? (
            <details className="rounded-xl border border-border bg-card p-4 text-[13px] sm:p-5">
              <summary className="cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">Aprofundar</summary>
              <div className="mt-2">
                <RichParagraphs texts={content.deeper} className="leading-relaxed" />
              </div>
            </details>
          ) : null}

          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <BookOpenCheck className="size-4 text-primary" aria-hidden="true" /> Referências
            </h3>
            <ul className="mt-2 grid gap-1 pl-4 text-[13px]">
              {content.refs.map((r) => (
                <li key={r.label}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer noopener" className="text-primary underline underline-offset-2">
                      {r.label}
                    </a>
                  ) : (
                    r.label
                  )}
                  {r.note ? <span className="text-muted-foreground"> — {r.note}</span> : null}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">Os links levam a fontes externas (precisam de internet); o conteúdo da missão funciona offline. Edições e datas de revisão estão em <Link to="/cobertura" className="text-primary underline underline-offset-2">Cobertura de frameworks</Link>.</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ScrollText className="size-4 text-primary" aria-hidden="true" /> Seu progresso e suas conquistas
            </h3>
            <ul className="mt-2 grid gap-1 pl-0 text-[13px]">
              {content.medals.map((id) => {
                const medal = derived.medals.find((x) => x.id === id)
                return medal ? (
                  <li key={id} className="list-none">
                    <span className={cn('font-medium', medal.unlocked && 'text-primary')}>{medal.name}</span>: {medal.unlocked ? 'conquistada' : `${medal.value} de ${medal.target}`} <span className="text-muted-foreground">— {medal.desc}</span>
                  </li>
                ) : null
              })}
            </ul>
            {dossier && !state.dossiers[dossier.id] ? (
              <p className="mt-2 text-xs">
                Falta marcar o dossiê como lido para contar nas conquistas de casos reais. <Link to={`/casos/${dossier.id}`} className="text-primary underline underline-offset-2">Abrir o dossiê</Link>.
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              Conquistas só contam atividades corrigidas por regras ou decisões com crédito; abrir telas não conquista nada. <Link to="/conquistas" className="text-primary underline underline-offset-2">Ver todas as conquistas</Link>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {dossier ? (
              <Button asChild>
                <Link to={`/casos/${dossier.id}`}>
                  Voltar ao dossiê <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : next ? (
              <Button asChild>
                <Link to={`/campanhas/${content.campaign}/${next.id}`}>
                  Próxima missão: {next.title} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/campanhas">Voltar às campanhas</Link>
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => dispatch({ type: 'missionRestart', mission: spec.id })}>
              <RotateCcw aria-hidden="true" /> Nova tentativa (mantém o que já conquistou)
            </Button>
            <Button type="button" variant="outline" onClick={() => go(1)}>
              Rever as evidências
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}
