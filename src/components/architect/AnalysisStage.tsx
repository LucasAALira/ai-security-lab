import { useId, useState } from 'react'
import { DiagramView, type NodeMark } from '@/components/mission/DiagramView'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { ArchitectProject } from '@/data/architect'
import type { ArchitectState } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
import { STRIDE_NAMES } from './architect-ui'
import { SolutionMeter } from './SolutionMeter'

/** Etapa 2: o diagrama clicável. Em cada componente, marcar as ameaças que se aplicam e aplicar controles do catálogo. */
export function AnalysisStage({ project: p, st }: { project: ArchitectProject; st: ArchitectState | undefined }) {
  const { dispatch } = useProgress()
  const uid = useId()
  const [selected, setSelected] = useState<string | null>(p.components[0]?.id ?? null)

  const marks: Record<string, NodeMark | undefined> = {}
  for (const c of p.components) {
    if (st?.applied[c.id]?.length) marks[c.id] = 'ok'
    else if (st?.found[c.id]?.length) marks[c.id] = 'risk'
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Selecione um componente. Marque só as ameaças que de fato se aplicam a ele (algumas não se aplicam) e aplique os controles do catálogo no componente onde cada um precisa existir. O custo e a complexidade aparecem abaixo enquanto você monta a solução.
      </p>
      <SolutionMeter project={p} st={st} />
      <DiagramView
        title={`Componentes de ${p.title}`}
        nodes={p.components}
        edges={p.edges}
        selected={selected}
        onSelect={setSelected}
        marks={marks}
        renderDetail={(node) => {
          const comp = p.components.find((c) => c.id === node.id)
          if (!comp) return null
          const found = new Set(st?.found[comp.id] ?? [])
          const applied = new Set(st?.applied[comp.id] ?? [])
          return (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="text-xs font-semibold">Ameaças candidatas: marque as que se aplicam</legend>
                <ul className="mt-1.5 grid gap-1.5 pl-0">
                  {comp.threats.map((t, i) => {
                    const id = `${uid}-${comp.id}-t${i}`
                    return (
                      <li key={t.id} className="flex list-none items-start gap-2">
                        <Checkbox
                          id={id}
                          checked={found.has(i)}
                          onCheckedChange={(v) => dispatch({ type: 'architectFind', project: p.id, component: comp.id, threat: i, on: v === true })}
                          className="mt-0.5"
                        />
                        <Label htmlFor={id} className="block text-[13px] leading-snug font-normal">
                          {t.title}{' '}
                          <span className="ml-1 inline-flex flex-wrap gap-1 align-middle">
                            {t.stride.map((s) => (
                              <abbr key={s} title={STRIDE_NAMES[s]} className="rounded border border-border px-1 font-mono text-[10px] no-underline">
                                {s}
                                <span className="sr-only"> ({STRIDE_NAMES[s]})</span>
                              </abbr>
                            ))}
                          </span>
                        </Label>
                      </li>
                    )
                  })}
                </ul>
              </fieldset>

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="text-xs font-semibold">Controles aplicados neste componente</legend>
                <div className="mt-1.5 max-h-72 overflow-y-auto rounded-md border border-border p-2" tabIndex={0} role="region" aria-label={`Catálogo de controles para ${comp.label} (rolável)`}>
                  <ul className="grid gap-1.5 pl-0">
                    {p.controls.map((c, i) => {
                      const id = `${uid}-${comp.id}-c${i}`
                      return (
                        <li key={c.id} className="flex list-none items-start gap-2">
                          <Checkbox
                            id={id}
                            checked={applied.has(i)}
                            onCheckedChange={(v) => dispatch({ type: 'architectApply', project: p.id, component: comp.id, control: i, on: v === true })}
                            className="mt-0.5"
                          />
                          <Label htmlFor={id} className="block text-[13px] leading-snug font-normal">
                            {c.title}
                            <span className="ml-1 text-[11px] text-muted-foreground">
                              (custo {c.cost}, complexidade {c.complexity})
                            </span>
                          </Label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </fieldset>
            </div>
          )
        }}
      />
    </div>
  )
}
