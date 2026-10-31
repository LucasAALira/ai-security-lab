import { CalendarCheck, Clock, Hourglass, Timer } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/common/SectionHeading'
import { formatDuration, formatNumber, plural } from '@/lib/format'
import { STUDY_CLOCK } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

/** Horas medidas e dias estudados. O relógio corre na própria aba e o total mora no navegador. */
export function StudyTimeSection() {
  const { state, derived } = useProgress()
  const { minutes, today, days } = derived.studyTime
  const items = [
    { icon: Hourglass, value: formatDuration(minutes), label: 'Tempo de estudo ao todo' },
    { icon: CalendarCheck, value: formatNumber(days), label: plural(days, 'dia com atividade registrada', 'dias com atividade registrada') },
    { icon: Clock, value: formatDuration(today), label: 'Tempo de estudo hoje' },
    { icon: Timer, value: formatNumber(state.study.best), label: 'Recorde de dias seguidos' },
  ]
  return (
    <section id="tempo" aria-labelledby="tempo-titulo" className="mb-14">
      <SectionHeading
        eyebrow="Relógio"
        id="tempo-titulo"
        title="Horas e dias de estudo"
        description={`O relógio soma um minuto por vez, só com esta aba à frente e você interagindo — no máximo ${formatDuration(STUDY_CLOCK.perDay)} por dia, para uma aba esquecida aberta não virar hora de estudo.`}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.label} className="min-w-0 gap-2 border-tint-line bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] p-5">
            <item.icon className="size-6 text-primary" aria-hidden="true" />
            <div className="text-[26px] leading-none font-medium tracking-tight tabular-nums">{item.value}</div>
            <div className="text-[11px] text-muted-foreground">{item.label}</div>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        A contagem fica salva no seu navegador, junto com o resto do progresso: o{' '}
        <Link to="/conquistas" className="text-primary underline underline-offset-2">
          backup do Relicário
        </Link>{' '}
        leva o tempo e os dias também.
      </p>
    </section>
  )
}
