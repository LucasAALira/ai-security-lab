import { useState } from 'react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProgress } from '@/state/ProgressProvider'
import { ImprovementsCard } from './ImprovementsCard'
import { MedalsSection } from './MedalsSection'
import { TaskList, type TaskFilter } from './TaskList'
import { TracksCard } from './TracksCard'
import { XpPanel } from './XpPanel'

interface Props {
  onPickTrack: (track: string) => void
  onOpenCase: (index: number) => void
}

export function TasksSection({ onPickTrack, onOpenCase }: Props) {
  const { derived, storageOk } = useProgress()
  const [filter, setFilter] = useState<TaskFilter>('pending')
  return (
    <section id="tarefas" aria-labelledby="tasktitle" className="mb-14 border-t border-tint-line pt-6">
      <SectionHeading
        eyebrow="PLANO DE APRENDIZADO"
        id="tasktitle"
        title="Suas tarefas e conquistas"
        aside={
          <span className="font-sans text-foreground/80">
            {derived.summary.steps}/{derived.summary.total} tarefas concluídas
          </span>
        }
      />
      <XpPanel />
      <div className="my-5 grid gap-4 min-[901px]:grid-cols-2">
        <TracksCard onPickTrack={onPickTrack} />
        <ImprovementsCard />
      </div>
      <div className="mt-5 mb-3 flex items-center gap-3 text-xs">
        <Label htmlFor="task-filter" className="text-xs">
          Mostrar tarefas:
        </Label>
        <Select value={filter} onValueChange={(v) => setFilter(v as TaskFilter)}>
          <SelectTrigger id="task-filter" size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TaskList filter={filter} onOpenCase={onOpenCase} />
      <MedalsSection />
      <p role="status" className={storageOk ? 'mt-4 text-xs text-muted-foreground' : 'mt-4 rounded-md border border-warning/50 bg-warning/10 px-3 py-2.5 text-xs text-warning'}>
        {storageOk
          ? 'Progresso, XP e anotações ficam neste navegador. Limpar os dados do navegador remove esse histórico.'
          : 'Armazenamento indisponível: o progresso atual será mantido apenas enquanto esta página estiver aberta.'}
      </p>
    </section>
  )
}
