import { modules } from '@/data/modules'
import { remediationCases } from '@/data/scenarios'
import { pad2 } from '@/lib/format'
import { CORE_MODULE_COUNT } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

export function StatsRow() {
  const { derived } = useProgress()
  const questions = modules.reduce((n, m) => n + m.questions.length, 0)
  const items = [
    { value: pad2(modules.length), label: 'Módulos de estudo' },
    { value: pad2(questions), label: 'Questões de múltipla escolha' },
    { value: `${pad2(derived.summary.complete)} / ${pad2(CORE_MODULE_COUNT)}`, label: 'Módulos concluídos da trilha principal', live: true },
    { value: pad2(remediationCases.length), label: 'Cenários de correção' },
  ]
  return (
    <section aria-label="Resumo do conteúdo" className="mb-14">
      <div className="stats stats-vertical w-full rounded-lg border border-border bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] sm:grid sm:grid-cols-2 min-[1000px]:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="stat place-items-start px-6 py-5">
            <div className="stat-value text-[26px] font-medium tracking-tight" aria-live={item.live ? 'polite' : undefined}>
              {item.value}
            </div>
            <div className="stat-title text-[11px] text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
