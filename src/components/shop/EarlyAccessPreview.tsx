import { BookOpen, Code2, HelpCircle, Layers, Skull } from 'lucide-react'
import { bossOfModule } from '@/data/bosses'
import { challengesOfModule } from '@/data/challenges'
import { flashcardsOfModule } from '@/data/flashcards'
import { modules } from '@/data/modules'
import { QUESTIONS_PER_MODULE, READS_PER_MODULE } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { UnlockModuleCard } from './UnlockModuleCard'

/** Prévia de um módulo de acesso antecipado ainda bloqueado: o que ele ensina e como abri-lo. */
export function EarlyAccessPreview({ module, className, onUnlocked, headingLevel = 3 }: { module: number; className?: string; onUnlocked?: () => void; headingLevel?: 2 | 3 | 4 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  const m = modules[module]
  const challenges = challengesOfModule(module).length
  const cards = flashcardsOfModule(module).length
  const boss = bossOfModule(module)
  const contents = [
    { icon: BookOpen, text: `${READS_PER_MODULE} leituras` },
    { icon: HelpCircle, text: `${QUESTIONS_PER_MODULE} questões` },
    { icon: Code2, text: `${challenges} ${challenges === 1 ? 'desafio de código' : 'desafios de código'}` },
    { icon: Layers, text: `${cards} cartões de revisão` },
    ...(boss ? [{ icon: Skull, text: `1 chefe: ${boss.name}` }] : []),
  ]
  return (
    <div className={cn('grid gap-4', className)}>
      <section aria-labelledby={`previa-${module}`} className="rounded-xl border border-border bg-background/30 p-4 sm:p-5">
        <Heading id={`previa-${module}`} className="text-base font-medium">
          O que você vai estudar
        </Heading>
        <p className="mt-1 text-[13px] text-muted-foreground">{m.summary}</p>
        {m.topics?.length ? (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] text-foreground/85">
            {m.topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
        <ul aria-label="Conteúdo do módulo" className="mt-4 flex flex-wrap gap-2 text-[11px]">
          {contents.map((c) => (
            <li key={c.text} className="inline-flex items-center gap-1.5 rounded-md border border-tint-line bg-tint px-2 py-1 text-foreground/85">
              <c.icon className="size-3.5 text-primary" aria-hidden="true" />
              {c.text}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">Nível: {m.level}. Os textos, o quiz, os cartões e os desafios deste módulo abrem quando ele for liberado.</p>
      </section>
      <UnlockModuleCard module={module} onUnlocked={onUnlocked} />
    </div>
  )
}
