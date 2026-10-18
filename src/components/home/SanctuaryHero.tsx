import { Bonfire } from '@/components/audio/Bonfire'
import { ArrowRight, Hourglass, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { SanctuaryScene } from '@/components/gothic/SanctuaryScene'
import { RiveSlot } from '@/components/rive/RiveSlot'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/format'
import { journeyOf } from '@/lib/journey'
import { useProgress } from '@/state/ProgressProvider'

/** Topo da página inicial: o Santuário do Conhecimento e a missão atual, com uma única ação principal.
 *  A cena fica atrás de um véu escuro e encolhe no celular para a ação aparecer logo. */
export function SanctuaryHero() {
  const { state, ctx, derived } = useProgress()
  const j = journeyOf(state, ctx, derived.objective, derived.summary.xp)
  return (
    <section id="inicio" aria-labelledby="santuario-titulo" className="relative mt-4 mb-12 overflow-hidden border border-[var(--line)] md:mt-6">
      <div className="relative h-[112px] sm:h-[150px] md:absolute md:inset-0 md:h-auto" aria-hidden="true">
        {/* Um `hero.riv` em src/assets/rive substitui a cena; sem ele, a cena em SVG, com a fogueira digital no altar. */}
        <RiveSlot src="hero.riv" stateMachine="Hero" className="size-full" fallback={<SanctuaryScene />} />
        <Bonfire />
      </div>
      {/* véu: escurece a cena atrás do texto (contraste garantido) e a deixa respirar à direita */}
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_oklab,var(--background)_96%,transparent)_0%,color-mix(in_oklab,var(--background)_88%,transparent)_46%,transparent_78%)] md:block" aria-hidden="true" />
      <div className="relative grid gap-4 bg-[var(--background)] p-4 sm:p-6 md:max-w-[620px] md:bg-transparent md:p-9 md:pr-0 lg:py-12 [@media(max-height:520px)]:gap-2 [@media(max-height:520px)]:py-4">
        <h1 id="santuario-titulo" className="gx-display text-[24px] sm:text-[32px] [@media(max-height:520px)]:text-[21px]">
          Santuário do Conhecimento
        </h1>
        <div className="gx-frame grid gap-3 p-5 sm:p-6 [@media(max-height:520px)]:gap-2 [@media(max-height:520px)]:p-4" data-testid="jornada">
          <p className="gx-inscription">{j.label}</p>
          <h2 className="text-[19px] leading-snug sm:text-[23px] [@media(max-height:520px)]:text-[17px]">{j.title}</h2>
          {j.context ? <p className="text-[13px] text-primary">{j.context}</p> : null}
          <p className="text-[15px] leading-relaxed text-[color-mix(in_oklab,var(--foreground)_88%,transparent)]">{j.description}</p>
          {j.minutes || j.xp ? (
            <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-[13px] text-muted-foreground">
              {j.minutes ? (
                <li className="inline-flex items-center gap-1.5">
                  <Hourglass className="size-4 text-primary" aria-hidden="true" />
                  Cerca de {j.minutes} min
                </li>
              ) : null}
              {j.xp ? (
                <li className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-4 text-[var(--gold-anodized)]" aria-hidden="true" />
                  Recompensa: até {formatNumber(j.xp)} XP
                </li>
              ) : null}
            </ul>
          ) : null}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Button asChild size="lg">
              <Link to={j.to}>
                {j.cta} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Link to="/?secao=areas" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Escolher outra área
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
