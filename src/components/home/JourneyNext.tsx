import { ArrowRight, GraduationCap, SkipForward } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { NextOpponents } from '@/components/trail/NextOpponents'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { modules } from '@/data/modules'
import { caminhoById, MODULO_TUTORIAL } from '@/lib/caminhos'
import { useProgress } from '@/state/ProgressProvider'

/** O passo seguinte da jornada, logo abaixo do santuário.
 *
 *  Enquanto nada foi concluído, não aparece: a página inicial já tem a missão do dia em destaque.
 *  Quando a primeira fogueira acende, a escolha passa para quem estuda — quais guardiões enfrentar
 *  agora, e os demais temas num submenu, sem empurrar uma ordem. */
export function JourneyNext() {
  const { state, derived } = useProgress()
  const pulou = state.prefs.tutorial === 'pulado'
  const tutorialFeito = derived.trail[MODULO_TUTORIAL]?.complete ?? false
  const comecou = derived.trail.some((t) => t.complete)
  const caminho = state.prefs.caminho ? caminhoById(state.prefs.caminho) : undefined

  if (!pulou && !comecou) return null

  return (
    <section id="proximo" aria-labelledby="proximo-titulo" className="mt-9 mb-3">
      <SectionHeading
        level="h2"
        eyebrow="JORNADA"
        id="proximo-titulo"
        title="O próximo passo é seu"
        description={caminho ? `Você começou pela trilha de ${caminho.categoria}. Nada aqui tranca o resto: todos os temas continuam na trilha de módulos.` : undefined}
      />

      {/* Quem pulou o tutorial continua convidado, sem insistência e sem bloqueio. */}
      {pulou && !tutorialFeito ? (
        <Card className="mt-4 gap-2 p-5">
          <p className="flex items-center gap-2 text-[15px] font-semibold">
            <GraduationCap className="size-5 shrink-0 text-primary" aria-hidden="true" />
            O tutorial continua aberto
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Você pulou a apresentação do módulo {modules[MODULO_TUTORIAL].number} ({modules[MODULO_TUTORIAL].title}). Ele é a base dos outros temas e as etapas
            continuam valendo XP.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to={`/modulo/${MODULO_TUTORIAL}`}>
                Estudar o módulo {modules[MODULO_TUTORIAL].number} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/trilha">
                <SkipForward aria-hidden="true" /> Ver a trilha inteira
              </Link>
            </Button>
          </div>
        </Card>
      ) : null}

      {comecou ? <NextOpponents className="mt-6" /> : null}
    </section>
  )
}
