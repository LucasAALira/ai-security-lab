import { ArrowRight, CheckCircle2, ScanSearch } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { missionStatus, statusText } from '@/components/mission/mission-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { REVIEW_AREAS, reviewSamples, verdictLabel } from '@/data/code-review'
import { findMission, REVIEW_XP } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

const ETAPAS = [
  { titulo: '1 · Veredito', texto: 'O alerta procede, é falso positivo ou falta contexto? Cada resposta vem com o motivo, inclusive as duas que você não escolheu.' },
  { titulo: '2 · Sinais', texto: 'O que, no próprio trecho, sustenta o seu veredito. Há distratores: coisas verdadeiras que não dizem nada sobre este achado.' },
  { titulo: '3 · O que fazer em seguida', texto: 'A pergunta que a ferramenta não responde. As opções são comparadas entre si: a melhor, as aceitáveis e as que parecem resolver.' },
]

export function CodeReviewPage() {
  useDocumentTitle('Treino de análise de código')
  const { state, ctx } = useProgress()
  const [area, setArea] = useState<string>('todas')

  const concluidas = reviewSamples.filter((s) => {
    const spec = findMission(ctx, s.id)
    return spec ? missionStatus(state, ctx, spec) === 'passed' : false
  }).length
  const amostras = area === 'todas' ? reviewSamples : reviewSamples.filter((s) => s.area === area)

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="ESCRUTÍNIO · ANÁLISE DE CÓDIGO"
        level="h1"
        title="Treino de análise de código"
        description={`${reviewSamples.length} achados para triar, um de cada vez: ler o trecho, decidir se o alerta procede e escolher o que fazer depois. Parte das amostras é de falso positivo de propósito, e você não sabe quais.`}
      />

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {ETAPAS.map((e) => (
          <div key={e.titulo} className="rounded-xl border border-tint-line bg-tint p-3.5 text-[13px] leading-relaxed">
            <p className="font-semibold">{e.titulo}</p>
            <p className="mt-1 text-muted-foreground">{e.texto}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Todo código é fictício e escrito para o treino; os endereços usam o domínio reservado <code className="font-mono">.example</code>. Cada amostra rende {REVIEW_XP.activity} XP por etapa e {REVIEW_XP.passed} XP ao concluir, uma única vez.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Área:</span>
        {[{ id: 'todas', label: 'Todas' }, ...REVIEW_AREAS].map((a) => {
          const n = a.id === 'todas' ? reviewSamples.length : reviewSamples.filter((s) => s.area === a.id).length
          if (!n) return null
          return (
            <Button key={a.id} size="sm" variant={area === a.id ? 'default' : 'outline'} aria-pressed={area === a.id} onClick={() => setArea(a.id)}>
              {a.label} <span className="font-mono text-[11px] opacity-80">{n}</span>
            </Button>
          )
        })}
        <p role="status" className="ml-auto font-mono text-[12px] text-muted-foreground">
          {concluidas} de {reviewSamples.length} concluídas
        </p>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {amostras.map((s) => {
          const spec = findMission(ctx, s.id)
          const status = spec ? missionStatus(state, ctx, spec) : 'new'
          const feito = status === 'passed'
          return (
            <li key={s.id} className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-primary uppercase">{REVIEW_AREAS.find((a) => a.id === s.area)?.label}</span>
                <span aria-hidden="true">·</span>
                <span>{s.level}</span>
                <span aria-hidden="true">·</span>
                <span>{s.minutes} min</span>
              </div>
              <h2 className="mt-1.5 text-xl leading-snug font-medium">
                <Link to={`/analise/${s.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {s.title}
                </Link>
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.subtitle}</p>
              <dl className="mt-3 grid gap-1 text-xs">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-medium">Achado:</dt>
                  <dd className="text-muted-foreground">
                    {s.finding.rule} · severidade {s.finding.severity} · confiança {s.finding.confidence}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-medium">Arquivo:</dt>
                  <dd className="font-mono break-all text-muted-foreground">{s.file}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className={cn('rounded', feito && 'border-primary text-primary')}>
                  {feito ? (
                    <>
                      <CheckCircle2 aria-hidden="true" /> {statusText[status]}
                    </>
                  ) : (
                    statusText[status]
                  )}
                </Badge>
                {/* O veredito só aparece depois de concluída: antes disso, ele é a resposta do exercício. */}
                {feito ? (
                  <Badge variant="outline" className="rounded">
                    Veredito: {verdictLabel(s.verdict)}
                  </Badge>
                ) : null}
              </div>
              <div className="mt-4">
                <Link
                  to={`/analise/${s.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {feito ? 'Rever a triagem' : 'Analisar o achado'} <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-8 flex items-start gap-2 text-xs text-muted-foreground">
        <ScanSearch className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          Procurando marcar as linhas vulneráveis e escolher a correção? Isso fica nas{' '}
          <Link to="/desafios" className="text-primary underline underline-offset-2">
            Provações
          </Link>
          . Aqui o exercício é outro: decidir se o achado procede e o que fazer com ele.
        </span>
      </p>
    </div>
  )
}
