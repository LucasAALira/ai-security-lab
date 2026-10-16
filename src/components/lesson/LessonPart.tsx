import { ArrowRight, BookOpen, Check, Code2 } from 'lucide-react'
import { Link } from 'react-router'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { challengesOfModule } from '@/data/challenges'
import { modules } from '@/data/modules'
import { isModuleComplete, XP } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
import { SaibaMais } from './SaibaMais'

export const PART_TABS = [
  { tab: 'conceito', title: 'Conceito', section: 'compreender' },
  { tab: 'exemplo', title: 'Exemplo', section: 'conectar' },
  { tab: 'corrigir', title: 'Como corrigir', section: 'aplicar' },
] as const

interface Props {
  module: number
  part: 0 | 1 | 2
  locked: boolean
  /** Registra a etapa (se ainda não estava) e segue para a próxima aba. */
  onContinue: () => void
  /** Quem chama dispara a ação `read` e o aviso; aqui só decidimos quando. */
  onRead: () => void
}

/** Uma etapa da aula: uma ideia só, o resumo primeiro, o texto completo em "Saiba mais". */
export function LessonPart({ module, part, locked, onContinue, onRead }: Props) {
  const { state } = useProgress()
  const m = modules[module]
  const s = state.modules[module]
  const meta = PART_TABS[part]
  const done = s.reads[part]
  const challenges = challengesOfModule(module)

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Etapa {part + 1} de 3</p>
      <h3 id={`aba-titulo-${meta.tab}`} tabIndex={-1} className="mt-1 text-xl font-medium outline-none">
        {meta.title}
      </h3>
      <p className="mt-3 text-base leading-[1.75] text-foreground/90">{m.parts[part]}</p>

      <Accordion type="multiple" className="mt-4 rounded-lg border border-border px-3.5">
        <AccordionItem value="saiba-mais">
          <AccordionTrigger className="py-3 text-[13px] text-primary hover:no-underline">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="size-4" aria-hidden="true" /> Saiba mais
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <SaibaMais slug={m.slug} section={part} />
            <Link to={`/materias/${m.slug}?secao=${meta.section}`} className="mt-1 inline-block text-xs text-primary hover:underline">
              Abrir esta parte na matéria completa
            </Link>
          </AccordionContent>
        </AccordionItem>
        {part === 0 ? (
          <AccordionItem value="antes">
            <AccordionTrigger className="py-3 text-[13px] hover:no-underline">Antes de começar e objetivos</AccordionTrigger>
            <AccordionContent>
              <p className="text-[13px] text-foreground/80">
                <strong>Nível:</strong> {m.level}. Sem exigência de formação formal.
              </p>
              <ul className="mt-1.5 list-disc pl-5 text-[13px] text-foreground/75">
                {m.requires.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] font-medium text-foreground/90">Ao concluir você será capaz de:</p>
              <ul className="mt-1 list-disc pl-5 text-[13px] text-foreground/75">
                {m.objectives.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-foreground/80">
                <strong>Módulos recomendados antes:</strong>{' '}
                {m.prereqs.length ? m.prereqs.map((j) => `${modules[j].title} ${isModuleComplete(state.modules[j]) ? '(fogueira acesa)' : '(a estudar)'}`).join('; ') : 'nenhum; você pode começar por aqui.'}
              </p>
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>

      {part === 2 && challenges.length ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tint-line bg-tint-strong p-3.5">
          <p className="text-[13px] leading-snug">
            <strong>Pratique a correção.</strong> {challenges.length} {challenges.length === 1 ? 'desafio de código' : 'desafios de código'} deste módulo: ache a falha e escolha o conserto.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to={`/desafios?modulo=${module}`}>
              <Code2 aria-hidden="true" /> Praticar
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => {
            if (!done && !locked) onRead()
            onContinue()
          }}
        >
          Continuar <ArrowRight aria-hidden="true" />
        </Button>
        {done ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-primary">
            <Check className="size-3.5" aria-hidden="true" /> Etapa concluída · {XP.read} XP já recebidos
          </span>
        ) : locked ? (
          <span className="text-xs text-muted-foreground">Módulo bloqueado: você pode ler, mas o XP só conta depois da liberação.</span>
        ) : (
          <span className="text-xs text-muted-foreground">Ao continuar, a etapa conta como lida · +{XP.read} XP, uma vez.</span>
        )}
      </div>
    </div>
  )
}
