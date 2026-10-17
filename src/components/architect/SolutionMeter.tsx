import type { ArchitectProject } from '@/data/architect'
import type { ArchitectState } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { appliedControls, CRITERIA, profile, signed } from './architect-ui'

/** Custo e complexidade da solução atual contra os limites, e o perfil nos outros quatro critérios. */
export function SolutionMeter({ project: p, st }: { project: ArchitectProject; st: ArchitectState | undefined }) {
  const applied = appliedControls(p, st)
  const cost = applied.reduce((n, a) => n + a.control.cost, 0)
  const complexity = applied.reduce((n, a) => n + a.control.complexity, 0)
  const prof = profile(p, st)
  const threats = Object.values(st?.found ?? {}).reduce((n, l) => n + l.length, 0)

  return (
    <section aria-label="Situação da solução" className="rounded-xl border border-border bg-card p-3 text-[13px]">
      <div role="status" aria-live="polite" className="flex flex-wrap gap-x-5 gap-y-1">
        <span>
          Ameaças marcadas: <strong>{threats}</strong>
        </span>
        <span>
          Controles aplicados: <strong>{applied.length}</strong>
        </span>
        <span className={cn(cost > p.budget && 'font-semibold text-destructive')}>
          Custo: <strong>{cost}</strong> de {p.budget}
        </span>
        <span className={cn(complexity > p.complexity && 'font-semibold text-destructive')}>
          Complexidade: <strong>{complexity}</strong> de {p.complexity}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Perfil (soma dos efeitos dos controles, não é nota):{' '}
        {CRITERIA.map((c) => `${c.label} ${signed(prof[c.id])}`).join(' · ')}
      </p>
    </section>
  )
}
