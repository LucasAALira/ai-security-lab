import { FlaskConical } from 'lucide-react'
import { useState } from 'react'
import type { Evidence } from '@/data/campaigns/types'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichParagraphs, RichText } from '@/components/rich/RichText'
import { CodeBlock } from './CodeBlock'
import { DiagramView } from './DiagramView'

interface Props {
  items: Evidence[]
  /** Atividade atual: evidências com `from` igual a ela são marcadas como novas. */
  step?: number
  /** Texto para leitores de tela e legenda (ex.: "Evidências da missão"). */
  label?: string
}

/** Evidências examináveis, liberadas por etapas. Nenhuma é escondida atrás de dica ou de pontuação:
 *  quem libera cada uma é o avanço na missão e as decisões já tomadas. */
export function EvidencePanel({ items, step = 0, label = 'Evidências' }: Props) {
  const [selected, setSelected] = useState<Record<string, string | null>>({})
  const [tab, setTab] = useState<string>('')
  if (items.length === 0) return null
  const active = items.some((i) => i.id === tab) ? tab : items[0].id

  return (
    <section aria-label={label} className="rounded-xl border border-border bg-card p-3.5 sm:p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <FlaskConical className="size-3.5" aria-hidden="true" /> Dados sintéticos: empresas, pacotes, nomes e endereços são fictícios.
        </p>
      </header>
      <Tabs value={active} onValueChange={setTab} className="mt-3">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 group-data-[orientation=horizontal]/tabs:h-auto" aria-label="Itens de evidência">
          {items.map((e) => (
            <TabsTrigger key={e.id} value={e.id} className="h-auto max-w-full flex-none px-2.5 py-1.5 text-left text-xs whitespace-normal">
              {e.title}
              {e.from > 0 && e.from === step ? (
                <Badge variant="outline" className="ml-1.5 rounded px-1 text-[9px]">
                  nova
                </Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((e) => (
          <TabsContent key={e.id} value={e.id} className="mt-2 grid gap-2.5">
            {e.kind === 'code' && e.lines ? <CodeBlock lines={e.lines} language={e.language ?? 'text'} title={e.title} /> : null}
            {e.kind === 'table' && e.head && e.rows ? (
              <div className="overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label={`${e.title}, tabela rolável`}>
                <table className="w-full min-w-max border-collapse text-left text-xs">
                  <caption className="sr-only">{e.title}</caption>
                  <thead className="bg-tint">
                    <tr>
                      {e.head.map((h) => (
                        <th key={h} scope="col" className="border-b border-border px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {e.rows.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 align-top">
                            <RichText as="span" text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {e.kind === 'text' && e.paragraphs ? <RichParagraphs texts={e.paragraphs} className="text-[13px] leading-relaxed" /> : null}
            {e.kind === 'diagram' && e.nodes && e.edges ? (
              <DiagramView title={e.title} nodes={e.nodes} edges={e.edges} selected={selected[e.id] ?? null} onSelect={(id) => setSelected((prev) => ({ ...prev, [e.id]: id }))} />
            ) : null}
            {e.note ? <RichText text={e.note} className="rounded-md border border-tint-line bg-tint px-3 py-2 text-xs leading-relaxed text-muted-foreground" /> : null}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
