import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FILTER_ALL, FilterSelect } from '@/components/common/FilterSelect'
import { SectionHeading } from '@/components/common/SectionHeading'
import { platformLabel } from '@/components/curriculum/curriculum-ui'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { areas, type Platform } from '@/data/curriculum'
import { search, searchKinds } from '@/data/search-index'
import type { Level } from '@/data/types'
import { plural } from '@/lib/format'
import { useDocumentTitle } from '@/lib/use-document-title'

const levels: Level[] = ['Básico', 'Intermediário', 'Avançado']
const platforms = Object.keys(platformLabel) as Platform[]
const PAGE = 40

/** Busca global e filtros sobre áreas, módulos, submódulos, aulas, desafios, missões e casos reais. Funciona offline. */
export function ExplorePage() {
  useDocumentTitle('Explorar o conteúdo')
  const [params, setParams] = useSearchParams()
  const [limit, setLimit] = useState(PAGE)

  const query = params.get('q') ?? ''
  const kind = searchKinds.find((k) => k === params.get('tipo'))
  const area = areas.find((a) => a.id === params.get('area'))?.id
  const level = levels.find((l) => l === params.get('nivel'))
  const platform = platforms.find((p) => p === params.get('plataforma'))

  const setParam = (key: string, value: string) => {
    setLimit(PAGE)
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === FILTER_ALL || value === '') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: key === 'q' },
    )
  }

  const results = search({ query, kind, area, level, platform })
  const filtered = Boolean(query.trim() || kind || area || level || platform)
  const shown = results.slice(0, limit)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <SectionHeading eyebrow="BIBLIOTECA" level="h1" title="Explorar o conteúdo" description="Procure por assunto em áreas, módulos, submódulos, aulas, desafios, missões e casos reais. A busca roda neste navegador, sem internet." />

      <form role="search" aria-label="Buscar no conteúdo" onSubmit={(e) => e.preventDefault()} className="grid grid-cols-[minmax(0,1fr)] gap-3">
        <div>
          <Label htmlFor="explorar-q" className="mb-1 text-[11px] text-muted-foreground">
            O que você quer estudar?
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="explorar-q" type="search" value={query} onChange={(e) => setParam('q', e.target.value)} placeholder="Ex.: token, IDOR, pipeline, WebView…" className="pl-8" autoComplete="off" />
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 min-[1000px]:grid-cols-4">
          <FilterSelect id="explorar-tipo" label="Tipo" value={kind ?? FILTER_ALL} onChange={(v) => setParam('tipo', v)} options={searchKinds.map((k) => ({ id: k, label: k[0].toUpperCase() + k.slice(1) }))} />
          <FilterSelect id="explorar-area" label="Área" value={area ?? FILTER_ALL} onChange={(v) => setParam('area', v)} options={areas.map((a) => ({ id: a.id, label: a.title }))} />
          <FilterSelect id="explorar-nivel" label="Nível" value={level ?? FILTER_ALL} onChange={(v) => setParam('nivel', v)} options={levels.map((l) => ({ id: l, label: l }))} />
          <FilterSelect id="explorar-plataforma" label="Plataforma" value={platform ?? FILTER_ALL} onChange={(v) => setParam('plataforma', v)} options={platforms.map((p) => ({ id: p, label: platformLabel[p] }))} />
        </div>
      </form>

      <p role="status" aria-live="polite" className="text-xs text-muted-foreground">
        {results.length} {plural(results.length, 'resultado', 'resultados')}
        {filtered ? ' para esta busca' : ' no total'}
        {results.length > shown.length ? ` · mostrando ${shown.length}` : ''}
      </p>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-5 text-sm">
          <p className="font-medium">Nada encontrado.</p>
          <p className="mt-1 text-muted-foreground">Tente uma palavra mais curta, sem os filtros, ou um termo em português (a busca ignora acentos).</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => { setLimit(PAGE); setParams(new URLSearchParams()) }}>
            Limpar a busca e os filtros
          </Button>
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-2 p-0">
          {shown.map((r) => (
            <li key={`${r.kind}:${r.id}`} className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded text-[10px] uppercase">
                  {r.kind}
                </Badge>
                <Link to={r.href} className="min-w-0 text-[15px] font-medium text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [overflow-wrap:anywhere]">
                  {r.title}
                </Link>
              </div>
              <p className="mt-1 text-xs text-muted-foreground [overflow-wrap:anywhere]">
                {r.where}
                {r.level ? ` · ${r.level}` : ''}
                {r.platforms.length ? ` · ${r.platforms.map((p) => platformLabel[p]).join(', ')}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}

      {results.length > shown.length ? (
        <div>
          <Button type="button" variant="outline" onClick={() => setLimit((n) => n + PAGE)}>
            Mostrar mais {Math.min(PAGE, results.length - shown.length)}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
