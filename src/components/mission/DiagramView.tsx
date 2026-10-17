import { useId } from 'react'
import { Cloud, Cpu, Database, KeyRound, Package, Server, ShieldHalf, Smartphone, Sparkles, type LucideIcon } from 'lucide-react'
import type { DiagramEdge, DiagramNode } from '@/data/campaigns/types'
import { cn } from '@/lib/utils'
import { RichText } from '@/components/rich/RichText'

const icons: Record<DiagramNode['kind'], LucideIcon> = {
  cliente: Smartphone,
  borda: ShieldHalf,
  servico: Server,
  dados: Database,
  terceiro: Cloud,
  pipeline: Package,
  ia: Sparkles,
  identidade: KeyRound,
}
const kindNames: Record<DiagramNode['kind'], string> = {
  cliente: 'Cliente',
  borda: 'Borda',
  servico: 'Serviço',
  dados: 'Dados',
  terceiro: 'Terceiro',
  pipeline: 'Pipeline',
  ia: 'IA',
  identidade: 'Identidade',
}

export type NodeMark = 'selected' | 'risk' | 'ok' | 'review'

interface Props {
  title: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  /** Componente em foco (controlado de fora quando o modo Arquiteto quer marcar riscos). */
  selected: string | null
  onSelect: (id: string | null) => void
  /** Marcas extras por componente (por exemplo, ameaça marcada pelo aluno). */
  marks?: Record<string, NodeMark | undefined>
  /** Conteúdo extra no painel do componente selecionado. */
  renderDetail?: (node: DiagramNode) => React.ReactNode
}

/** Diagrama de componentes. Cada componente é um botão (teclado e toque); as ligações aparecem
 *  desenhadas em telas largas e sempre como lista de texto, que é a alternativa acessível. */
export function DiagramView({ title, nodes, edges, selected, onSelect, marks = {}, renderDetail }: Props) {
  const uid = useId()
  const rows = Math.max(...nodes.map((n) => n.y)) + 1
  const cols = Math.max(...nodes.map((n) => n.x)) + 1
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const current = selected ? byId.get(selected) : undefined
  const zones = [...new Set(nodes.map((n) => n.zone).filter((z): z is string => Boolean(z)))]

  return (
    <section aria-label={title} className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <div className="relative">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full text-muted-foreground sm:block">
          <defs>
            <marker id={`${uid}-seta`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="currentColor" />
            </marker>
          </defs>
          {edges.map((e) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            const pos = (n: DiagramNode) => ({ x: ((n.x + 0.5) / cols) * 100, y: ((n.y + 0.5) / rows) * 100 })
            const p = pos(a)
            const q = pos(b)
            return <line key={`${e.from}-${e.to}-${e.label}`} x1={`${p.x}%`} y1={`${p.y}%`} x2={`${q.x}%`} y2={`${q.y}%`} stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" markerEnd={`url(#${uid}-seta)`} />
          })}
        </svg>
        <ul
          className="relative m-0 grid list-none gap-2 p-0 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] sm:gap-x-3 sm:gap-y-8"
          style={{ ['--cols' as string]: cols }}
        >
          {[...nodes].sort((a, b) => a.y - b.y || a.x - b.x).map((n) => {
            const Icon = icons[n.kind] ?? Cpu
            const mark = selected === n.id ? 'selected' : marks[n.id]
            return (
              <li key={n.id} className="sm:[grid-column:var(--c)] sm:[grid-row:var(--r)]" style={{ ['--c' as string]: n.x + 1, ['--r' as string]: n.y + 1 }}>
                <button
                  type="button"
                  aria-pressed={selected === n.id}
                  onClick={() => onSelect(selected === n.id ? null : n.id)}
                  className={cn(
                    'flex w-full flex-col items-start gap-1 rounded-lg border bg-card px-3 py-2.5 text-left text-xs leading-snug hover:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    mark === 'selected' ? 'border-primary bg-tint-strong' : mark === 'risk' ? 'border-destructive' : mark === 'ok' ? 'border-tint-line' : 'border-border',
                  )}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {n.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {kindNames[n.kind]}
                    {n.zone ? ` · ${n.zone}` : ''}
                  </span>
                  {mark === 'risk' ? <span className="text-[10px] font-medium text-destructive">Ameaça marcada</span> : mark === 'ok' ? <span className="text-[10px] font-medium text-primary">Controle aplicado</span> : mark === 'review' ? <span className="text-[10px] font-medium text-primary">A revisar</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div aria-live="polite" className="min-h-10 rounded-lg border border-border bg-card p-3 text-[13px] leading-relaxed">
        {current ? (
          <>
            <p className="font-medium">
              {current.label} <span className="text-xs font-normal text-muted-foreground">({kindNames[current.kind]}{current.zone ? ` · zona: ${current.zone}` : ''})</span>
            </p>
            <RichText text={current.detail} className="mt-1 text-muted-foreground" />
            {renderDetail ? <div className="mt-2">{renderDetail(current)}</div> : null}
          </>
        ) : (
          <p className="text-muted-foreground">Selecione um componente para ver os detalhes.</p>
        )}
      </div>

      <div>
        <h4 className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Ligações{zones.length ? ` e zonas (${zones.join(', ')})` : ''}</h4>
        <ul className="mt-1.5 grid gap-1 pl-0 text-xs text-muted-foreground">
          {edges.map((e) => (
            <li key={`${e.from}-${e.to}-${e.label}`} className="list-none">
              <strong className="font-medium text-foreground">{byId.get(e.from)?.label}</strong> → <strong className="font-medium text-foreground">{byId.get(e.to)?.label}</strong>: {e.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
