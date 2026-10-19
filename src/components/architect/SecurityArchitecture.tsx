import { useId, useState } from 'react'
import { Cloud, Database, KeyRound, Package, Server, ShieldHalf, Smartphone, Sparkles } from 'lucide-react'
import type { ArchitectProject } from '@/data/architect'
import { RichText } from '@/components/rich/RichText'

const icons = { cliente: Smartphone, borda: ShieldHalf, servico: Server, dados: Database, terceiro: Cloud, pipeline: Package, ia: Sparkles, identidade: KeyRound }

/** DAS derives its nodes and arrows from the exercise, without exposing its answer key. */
export function SecurityArchitecture({ project: p }: { project: ArchitectProject }) {
  const uid = useId().replace(/:/g, '')
  const [selected, setSelected] = useState<string | null>(null)
  const zones = [...new Set(p.components.map(c => c.zone ?? 'Sem zona definida'))]
  const lanes = zones.map(zone => p.components.filter(c => (c.zone ?? 'Sem zona definida') === zone))
  const height = Math.max(...lanes.map(l => l.length)) * 132 + 100
  const width = zones.length * 252 + 24
  const positions = new Map(lanes.flatMap((lane, column) => lane.map((c, row) => [c.id, { x: 38 + column * 252, y: 76 + row * 132 }] as const)))
  const current = p.components.find(c => c.id === selected)
  const connected = p.edges.filter(e => e.from === selected || e.to === selected)
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5" aria-labelledby={`${uid}-heading`}>
      <p className="text-[10px] tracking-[.2em] text-primary uppercase">Mapa do projeto · DAS</p>
      <h3 id={`${uid}-heading`} className="mt-1 text-lg font-semibold">Desenho de Arquitetura de Segurança</h3>
      <p className="mt-2 text-sm text-muted-foreground">Toque em um componente para investigar seu papel e suas conexões. Este é o cenário recebido para revisão, ainda com riscos a tratar.</p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-background" tabIndex={0} role="region" aria-label="DAS interativo; role horizontalmente para ver todas as zonas">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: Math.max(740, width) }} className="block w-full" role="group" aria-label={`Arquitetura de ${p.company}`}>
          <defs>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor" /></marker>
          </defs>
          {zones.map((zone, i) => <g key={zone}>
            <rect x={16 + i * 252} y="18" width="232" height={height - 34} rx="12" fill="var(--card)" stroke="var(--muted-foreground)" strokeOpacity=".45" strokeDasharray="6 6" />
            <text x={32 + i * 252} y="47" fill="var(--foreground)" fontSize="12" fontFamily="var(--font-mono)">{zone}</text>
          </g>)}
          {p.edges.map((edge, i) => {
            const a = positions.get(edge.from), b = positions.get(edge.to)
            if (!a || !b) return null
            const vertical = a.x === b.x
            const forward = vertical ? a.y < b.y : a.x < b.x
            const ax = vertical ? a.x + 94 : a.x + (forward ? 188 : 0)
            const bx = vertical ? b.x + 94 : b.x + (forward ? 0 : 188)
            const ay = vertical ? a.y + (forward ? 88 : 0) : a.y + 44
            const by = vertical ? b.y + (forward ? 0 : 88) : b.y + 44
            const active = !selected || edge.from === selected || edge.to === selected
            return <g key={`${edge.from}-${edge.to}-${i}`} opacity={active ? 1 : .15} style={{ color: active && selected ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              <title>{edge.label}</title>
              <path d={vertical ? `M${ax} ${ay} L${bx} ${by}` : `M${ax} ${ay} C${(ax + bx) / 2} ${ay},${(ax + bx) / 2} ${by},${bx} ${by}`} fill="none" stroke="currentColor" strokeWidth={selected && active ? 2.5 : 1.5} markerEnd={`url(#${uid}-arrow)`} />
            </g>
          })}
          {p.components.map(c => {
            const pos = positions.get(c.id)!
            const Icon = icons[c.kind]
            const words = c.label.split(' '), lines: string[] = ['']
            for (const word of words) {
              if ((lines[lines.length - 1] + ' ' + word).trim().length > 24) lines.push(word)
              else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + word).trim()
            }
            const toggle = () => setSelected(selected === c.id ? null : c.id)
            return <g key={c.id} transform={`translate(${pos.x} ${pos.y})`} role="button" tabIndex={0} aria-label={`Explorar ${c.label}`} aria-pressed={selected === c.id} onClick={toggle} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }} className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-[var(--ring)] focus-visible:[&>rect]:stroke-[3px]">
              <rect width="188" height="88" rx="8" fill="var(--background)" stroke={selected === c.id ? 'var(--primary)' : 'var(--border)'} strokeWidth={selected === c.id ? 2.5 : 1.5} />
              <Icon x="12" y="10" width="22" height="22" color="var(--primary)" aria-hidden="true" />
              <text x="45" y="25" fontSize="10" fill="var(--muted-foreground)">{c.kind.toUpperCase()}</text>
              {lines.map((line, i) => <text key={i} x="12" y={49 + i * 14} fontSize="11" fill="var(--foreground)">{line}</text>)}
            </g>
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Contorno tracejado: zona de confiança · Setas: direção dos fluxos · Seleção: conexões em destaque. Cruzar uma zona exige reavaliar a confiança; a zona interna não é automaticamente segura.</p>
      <div className="mt-4 rounded-lg border border-border p-3 text-sm" aria-live="polite">
        {current ? <>
          <h4 className="font-semibold">{current.label}</h4>
          <RichText text={current.detail} className="mt-1 text-muted-foreground" />
          <ul className="mt-3 grid list-none gap-2 p-0">{connected.map((e, i) => <li key={i}><strong>{p.components.find(c => c.id === e.from)?.label} → {p.components.find(c => c.id === e.to)?.label}</strong><span className="block text-muted-foreground">{e.label}</span></li>)}</ul>
        </> : <p>Selecione um componente no desenho. No celular, deslize o mapa para os lados; pelo teclado, use Tab e Enter.</p>}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-medium text-primary">Como ler o DAS e pensar nos controles</summary>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>Identifique quem inicia cada fluxo e quais dados atravessam as zonas.</li>
          <li>Verifique identidade e autorização no serviço que executa a ação; autenticar no gateway não basta.</li>
          <li>Examine proteção em trânsito, validação de entradas, acesso aos dados e registros de auditoria.</li>
          <li>Na etapa Análise, escolha controles conforme as ameaças e o orçamento. O desenho não confirma que esses controles já existem.</li>
        </ol>
      </details>
    </section>
  )
}
