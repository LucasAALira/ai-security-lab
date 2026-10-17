import { ExternalLink } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { formatDay } from '@/components/mission/dossier-layers'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { coverageRows, type SourceKind } from '@/data/coverage'
import { areaById, areas } from '@/data/curriculum'
import { frameworks } from '@/data/frameworks'
import { useDocumentTitle } from '@/lib/use-document-title'

const ALL = 'todos'
const kinds: { id: SourceKind; label: string }[] = [
  { id: 'desafio', label: 'Desafios' },
  { id: 'missão', label: 'Missões' },
  { id: 'dossiê', label: 'Casos reais' },
]

/** Matriz de cobertura: onde cada item de cada framework registrado é trabalhado pelo conteúdo do site. */
export function CoveragePage() {
  useDocumentTitle('Cobertura de frameworks')
  const [params, setParams] = useSearchParams()

  const framework = frameworks.find((f) => f.id === params.get('framework'))?.id ?? ALL
  const area = areas.find((a) => a.id === params.get('area'))?.id ?? ALL
  const kind = kinds.find((k) => k.id === params.get('tipo'))?.id ?? ALL
  const onlyGaps = params.get('lacunas') === '1'

  const setParam = (key: string, value: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === ALL || value === '') next.delete(key)
      else next.set(key, value)
      return next
    })

  const all = useMemo(() => coverageRows(), [])
  const filtersOnSources = area !== ALL || kind !== ALL

  // Os filtros de área e tipo restringem as fontes de cada item. Um item sem fonte sobrando é mostrado como lacuna
  // naquele recorte (não é afirmado nada além do que o filtro mostra).
  const rows = useMemo(
    () =>
      all
        .filter((r) => framework === ALL || r.framework.id === framework)
        .map((r) => ({ ...r, sources: r.sources.filter((s) => (area === ALL || s.area === area) && (kind === ALL || s.kind === kind)) }))
        .filter((r) => !onlyGaps || r.sources.length === 0),
    [all, framework, area, kind, onlyGaps],
  )
  const shownFrameworks = frameworks.filter((f) => rows.some((r) => r.framework.id === f.id))
  const filtered = framework !== ALL || filtersOnSources || onlyGaps

  const select = (id: string, label: string, value: string, set: (v: string) => void, options: { id: string; label: string }[]) => (
    <div className="min-w-0">
      <Label htmlFor={id} className="mb-1 text-[11px] text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={set}>
        <SelectTrigger id={id} className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="BIBLIOTECA"
        level="h1"
        title="Cobertura de frameworks"
        description="Onde o conteúdo do site trabalha cada item de OWASP, CWE, NIST SSDF, SLSA e outros. Só aparecem correspondências declaradas no próprio conteúdo; o que ainda não tem exercício aparece como lacuna."
      />

      <section aria-labelledby="registro-titulo" className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 id="registro-titulo" className="text-lg font-medium">
          Fontes registradas
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Cada entrada tem a edição citada, o endereço oficial e a data em que os títulos foram conferidos. Os links precisam de internet; o resto da página funciona offline.</p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label="Fontes registradas (rolável)">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[13px]">
            <caption className="sr-only">Frameworks e normas registrados, com edição, itens e data de revisão</caption>
            <thead className="bg-muted/40 text-xs">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Fonte</th>
                <th scope="col" className="px-3 py-2 font-medium">Edição</th>
                <th scope="col" className="px-3 py-2 font-medium">Itens no registro</th>
                <th scope="col" className="px-3 py-2 font-medium">Revisada em</th>
                <th scope="col" className="px-3 py-2 font-medium">Como foi conferida</th>
              </tr>
            </thead>
            <tbody>
              {frameworks.map((f) => (
                <tr key={f.id} className="border-t border-border align-top">
                  <th scope="row" className="px-3 py-2 font-normal">
                    <a href={f.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-primary underline underline-offset-2">
                      {f.name} <ExternalLink className="size-3" aria-hidden="true" />
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    <div className="text-xs text-muted-foreground">{f.publisher}</div>
                  </th>
                  <td className="px-3 py-2">{f.edition}</td>
                  <td className="px-3 py-2">{f.items.length === 0 ? 'Só referência (sem itens listados)' : f.complete ? `${f.items.length} (lista completa)` : `${f.items.length} (só os citados)`}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDay(f.reviewed)}</td>
                  <td className="px-3 py-2 leading-relaxed text-muted-foreground">{f.verification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="matriz-titulo" className="mt-6">
        <h2 id="matriz-titulo" className="text-lg font-medium">
          Matriz de cobertura
        </h2>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)] items-end gap-3 sm:grid-cols-2 min-[1000px]:grid-cols-4">
          {select('cov-framework', 'Framework', framework, (v) => setParam('framework', v), frameworks.filter((f) => f.items.length > 0).map((f) => ({ id: f.id, label: f.short })))}
          {select('cov-area', 'Área do currículo', area, (v) => setParam('area', v), areas.map((a) => ({ id: a.id, label: a.title })))}
          {select('cov-tipo', 'Tipo de conteúdo', kind, (v) => setParam('tipo', v), kinds)}
          <div className="flex items-center gap-2 pb-1">
            <Checkbox id="cov-lacunas" checked={onlyGaps} onCheckedChange={(v) => setParam('lacunas', v === true ? '1' : '')} />
            <Label htmlFor="cov-lacunas" className="text-xs font-normal">
              Mostrar só as lacunas
            </Label>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground" role="status" aria-live="polite">
          {rows.length} {rows.length === 1 ? 'item' : 'itens'}
          {filtered ? ' neste recorte' : ''}: {rows.filter((r) => r.sources.length > 0).length} com conteúdo e {rows.filter((r) => r.sources.length === 0).length} sem.
          {filtersOnSources ? ' Com filtro de área ou tipo, “sem conteúdo” significa “sem conteúdo deste recorte”.' : ''}
        </p>

        {shownFrameworks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Nada neste recorte. Limpe algum filtro para ver mais itens.</p>
        ) : (
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5">
            {shownFrameworks.map((f) => {
              const list = rows.filter((r) => r.framework.id === f.id)
              const covered = list.filter((r) => r.sources.length > 0).length
              return (
                <section key={f.id} aria-labelledby={`cov-${f.id}`} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <h3 id={`cov-${f.id}`} className="text-base font-medium">
                    {f.short}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {f.complete ? `${covered} de ${list.length} itens com conteúdo neste recorte.` : `Lista parcial: só os ${f.items.length} itens citados pelo conteúdo. Não é uma medida de cobertura da norma.`}
                  </p>
                  <div className="mt-3 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label={`${f.short} (rolável)`}>
                    <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
                      <caption className="sr-only">Itens de {f.short} e o conteúdo que os trabalha</caption>
                      <thead className="bg-muted/40 text-xs">
                        <tr>
                          <th scope="col" className="px-3 py-2 font-medium">Item</th>
                          <th scope="col" className="px-3 py-2 font-medium">Trabalhado em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((r) => (
                          <tr key={r.item.id} className="border-t border-border align-top">
                            <th scope="row" className="w-[40%] px-3 py-2 font-normal">
                              <span className="font-mono text-xs text-primary">{r.item.id}</span> {r.item.title}
                            </th>
                            <td className="px-3 py-2">
                              {r.sources.length === 0 ? (
                                <span className="text-muted-foreground">Sem conteúdo ainda{filtersOnSources ? ' neste recorte' : ''}</span>
                              ) : (
                                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                                  {r.sources.map((s) => (
                                    <li key={`${s.kind}:${s.id}`}>
                                      <Link
                                        to={s.href}
                                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                      >
                                        <Badge variant="outline" className="rounded px-1 text-[9px] uppercase">
                                          {s.kind}
                                        </Badge>
                                        {s.title}
                                        {s.area ? <span className="sr-only"> ({areaById(s.area)?.title})</span> : null}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
