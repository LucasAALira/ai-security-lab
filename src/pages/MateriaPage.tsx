import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { TrustedHtml } from '@/components/common/TrustedHtml'
import { EarlyAccessPreview } from '@/components/shop/EarlyAccessPreview'
import { Button } from '@/components/ui/button'
import { materiaBySlug, materias } from '@/data/materias'
import { modules } from '@/data/modules'
import { XP, countDone, moduleXp, MODULE_XP, READS_PER_MODULE } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { NotFoundPage } from './NotFoundPage'

const SECTION_IDS = ['compreender', 'conectar', 'aplicar', 'resumo', 'glossario', 'pesquisa']

export function MateriaPage() {
  const { slug = '' } = useParams()
  const materia = materiaBySlug(slug)
  return materia ? <Article key={materia.slug} slug={materia.slug} /> : <NotFoundPage />
}

function Article({ slug }: { slug: string }) {
  const materia = materiaBySlug(slug)!
  const { state, dispatch, storageOk, derived } = useProgress()
  const [params] = useSearchParams()
  useDocumentTitle(materia.title)

  // `?secao=aplicar` leva direto à parte pedida (links do diálogo do módulo e das URLs antigas).
  const target = params.get('secao')
  useEffect(() => {
    if (!target || !SECTION_IDS.includes(target)) return
    const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [target])

  const index = materia.moduleIndex
  const m = state.modules[index]
  const position = materias.findIndex((x) => x.slug === slug)
  const prev = materias[position - 1]
  const next = materias[position + 1]

  // Matéria de um módulo de acesso antecipado ainda fechado: só a prévia e as formas de abrir.
  if (modules[index]?.earlyAccess && !derived.trail[index].unlocked) {
    return (
      <div className="mx-auto max-w-[900px] py-8 md:py-10">
        <header>
          <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">MATERIAL DE ESTUDO · ACESSO ANTECIPADO</div>
          <h1 className="my-3.5 text-[31px] leading-tight font-semibold tracking-tight sm:text-[40px] sm:tracking-[-1.5px]">{materia.title}</h1>
          <p className="text-sm leading-[1.8] text-foreground/70 sm:text-base">{materia.summary}</p>
        </header>
        <EarlyAccessPreview module={index} headingLevel={2} className="mt-6" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-[22px] text-xs">
          <Link to="/em-breve" className="text-primary hover:underline">
            Ver tudo o que vem por aí
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[900px] py-8 md:py-10">
      <article>
        <header>
          <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">MATERIAL DE ESTUDO</div>
          <h1 className="my-3.5 text-[31px] leading-tight font-semibold tracking-tight sm:text-[40px] sm:tracking-[-1.5px]">{materia.title}</h1>
          <p className="text-sm leading-[1.8] text-foreground/70 sm:text-base">{materia.summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">{materia.note}</p>
          <p role="status" aria-live="polite" className="mt-4 rounded-md border border-tint-line bg-tint px-3 py-2.5 text-xs">
            {countDone(m.reads)}/{READS_PER_MODULE} partes lidas · {moduleXp(m)}/{MODULE_XP} XP no módulo.{' '}
            {storageOk ? 'Progresso compartilhado com o painel neste navegador.' : 'Armazenamento indisponível; esta leitura fica apenas nesta sessão.'}
          </p>
        </header>

        <nav aria-label="Seções da matéria" className="mt-6 mb-8 flex flex-wrap gap-2 rounded-lg border border-tint-line bg-tint-strong p-2.5 max-sm:gap-0.5 max-sm:p-1.5">
          {materia.sections.map((s, i) => (
            <TocLink key={s.id} to={s.id}>
              {i + 1}. {['Compreender', 'Conectar', 'Aplicar'][i]}
            </TocLink>
          ))}
          {materia.recap?.length ? <TocLink to="resumo">Resumo</TocLink> : null}
          {materia.glossary?.length ? <TocLink to="glossario">Glossário</TocLink> : null}
          <TocLink to="pesquisa">Pesquisa e revisão</TocLink>
        </nav>

        {materia.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="mb-9 scroll-mt-6 border-b border-border pb-8">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-primary">{s.eyebrow}</span>
            <h2 className="mt-2.5 mb-[18px] text-2xl leading-snug font-medium tracking-tight text-foreground/90 sm:text-[29px]">{s.heading}</h2>
            <TrustedHtml html={s.html} className="study-prose" />
            <Button variant="outline" size="sm" className="mt-2.5" disabled={m.reads[i]} onClick={() => dispatch({ type: 'read', module: index, index: i })}>
              {m.reads[i] ? (
                <>
                  <Check aria-hidden="true" /> Leitura registrada · {XP.read} XP
                </>
              ) : (
                `Li esta parte · +${XP.read} XP`
              )}
            </Button>
          </section>
        ))}

        {materia.recap?.length ? (
          <section id="resumo" aria-labelledby="resumo-titulo" className="mb-9 scroll-mt-6 rounded-[9px] border border-tint-line bg-tint p-5 sm:p-[27px]">
            <h2 id="resumo-titulo" className="mb-3 text-xl font-medium tracking-tight text-primary sm:text-[22px]">
              Resumo: o que levar desta matéria
            </h2>
            <ul className="grid list-disc gap-2 pl-5 text-[15px] leading-relaxed text-foreground/85">
              {materia.recap.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {materia.glossary?.length ? (
          <section id="glossario" aria-labelledby="glossario-titulo" className="mb-9 scroll-mt-6">
            <h2 id="glossario-titulo" className="mb-3 text-xl font-medium tracking-tight text-foreground/90 sm:text-[22px]">
              Glossário
            </h2>
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {materia.glossary.map((g) => (
                <div key={g.term} className="rounded-lg border border-border bg-card px-4 py-3">
                  <dt className="text-sm font-semibold text-primary">{g.term}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-foreground/80">{g.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section id="pesquisa" className="mb-9 scroll-mt-6 rounded-[9px] border border-tint-line bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] p-5 sm:p-[27px]">
          <h2 className="mb-3 text-xl font-medium tracking-tight text-primary sm:text-[22px]">{materia.research.heading}</h2>
          <TrustedHtml html={materia.research.html} className="study-prose is-compact" />
          <Button asChild className="mt-2">
            <Link to={`/modulo/${index}`}>Registrar pesquisa e responder questões</Link>
          </Button>
        </section>

        <section className="mb-9">
          <h2 className="mb-2 text-lg font-medium text-foreground/70">{materia.bibliography.heading}</h2>
          <TrustedHtml html={materia.bibliography.html} className="study-prose is-small" />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-[22px] text-xs max-sm:flex-col max-sm:items-stretch">
          {prev ? (
            <Link to={`/materias/${prev.slug}`} className="text-primary hover:underline">
              <ArrowLeft className="mr-1 inline size-3.5" aria-hidden="true" />
              Matéria anterior
            </Link>
          ) : (
            <span />
          )}
          <Button asChild className="max-sm:justify-center">
            <Link to={`/modulo/${index}`}>Voltar às tarefas e questões</Link>
          </Button>
          {next ? (
            <Link to={`/materias/${next.slug}`} className="text-primary hover:underline">
              Próxima matéria
              <ArrowRight className="ml-1 inline size-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </article>

      <details className="mt-7 rounded-lg border border-border bg-tint p-4 sm:p-[18px]">
        <summary className="cursor-pointer text-[13px] text-primary">Índice das matérias</summary>
        <nav aria-label="Índice das matérias" className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {materias.map((x) => (
            <Link key={x.slug} to={`/materias/${x.slug}`} aria-current={x.slug === slug ? 'page' : undefined} className={cn('rounded-md p-[7px] text-xs text-foreground/70 hover:bg-tint-strong hover:text-primary', x.slug === slug && 'bg-tint-strong text-primary')}>
              {x.number}. {x.title}
            </Link>
          ))}
        </nav>
      </details>
    </div>
  )
}

function TocLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a
      href={`#${to}`}
      onClick={(event) => {
        // O `#` pertence ao roteador: a âncora só rola até a seção.
        event.preventDefault()
        document.getElementById(to)?.scrollIntoView()
      }}
      className="rounded-md px-2.5 py-1.5 text-xs text-primary hover:bg-tint hover:underline max-sm:px-1.5 max-sm:text-[11px]"
    >
      {children}
    </a>
  )
}
