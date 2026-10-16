import { useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ThemedShinyText } from '@/components/common/ThemedShinyText'
import DecryptedText from '@/components/reactbits/DecryptedText'
import { RiveSlot } from '@/components/rive/RiveSlot'
import { Button } from '@/components/ui/button'

export function Hero() {
  const reduced = useReducedMotion()
  return (
    <section id="inicio" className="relative mb-4 min-h-[340px] overflow-hidden pt-10 pb-12 md:min-h-[390px] md:pt-[62px] min-[1450px]:min-h-[440px]" aria-labelledby="hero-title">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">
        {reduced ? 'CONHECER. TESTAR. PROTEGER.' : <DecryptedText text="CONHECER. TESTAR. PROTEGER." animateOn="view" sequential revealDirection="start" speed={45} characters="01<>/{}#$%" />}
      </div>
      <h1 id="hero-title" className="my-6 text-[44px] leading-[1.09] font-semibold tracking-[-2px] md:text-[clamp(38px,4.3vw,66px)] md:tracking-[-2.8px]">
        A próxima fronteira
        <br />
        do seu{' '}
        <em className="text-primary not-italic">
          <ThemedShinyText text="AppSec." speed={3} delay={2} disabled={!!reduced} />
        </em>
      </h1>
      <p className="relative z-10 mb-7 max-w-xl text-[15px] text-muted-foreground">
        Entenda as ameaças, pratique a defesa e conecte <br className="hidden md:inline" />
        segurança de IA à governança e à regulação.
      </p>
      <Button asChild size="lg" className="relative z-10 gap-8 font-bold">
        <Link to="/?secao=trilhas">
          Explorar trilhas <ArrowUpRight aria-hidden="true" />
        </Link>
      </Button>
      <Orbit />
    </section>
  )
}

/** Ilustração decorativa: um núcleo "AI SECURITY" com órbitas e etiquetas de conceitos. */
function Orbit() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[10%] hidden size-[330px] bg-[radial-gradient(ellipse,color-mix(in_oklab,var(--primary)_9%,transparent),transparent_65%)] opacity-55 md:-right-[70px] md:block md:scale-[.8] min-[1151px]:right-[3%] min-[1151px]:scale-100 min-[1151px]:opacity-100 min-[1450px]:right-[8%]"
    >
      <RiveSlot src="hero.riv" stateMachine="Hero" className="absolute inset-0" fallback={<OrbitArt />} />
    </div>
  )
}

function OrbitArt() {
  return (
    <>
      <div className="absolute inset-[5%] -rotate-[25deg] rounded-full border border-dashed border-primary/25 motion-safe:animate-[spin_90s_linear_infinite]" />
      <div className="absolute inset-x-[-2%] top-[20%] h-[60%] -rotate-[35deg] rounded-full border border-primary/20" />
      <div className="absolute inset-x-[28%] inset-y-[10%] rotate-[35deg] rounded-full border border-primary/20" />
      <span className="absolute inset-[33%] flex flex-col items-center justify-center rounded-[22px] border border-primary/60 bg-tint-strong font-mono text-[38px] text-primary shadow-[0_0_70px_color-mix(in_oklab,var(--primary)_14%,transparent)]">
        AI
        <span className="text-[9px] tracking-[2px]">SECURITY</span>
      </span>
      <b className="absolute top-[14%] right-0 border border-tint-line bg-tint px-2.5 py-2 font-mono text-[9px] font-bold tracking-[1px] text-foreground/75">{'< trust_boundary />'}</b>
      <b className="absolute bottom-[13%] left-0 border border-tint-line bg-tint px-2.5 py-2 font-mono text-[9px] font-bold tracking-[1px] text-foreground/75">DEFENSE IN DEPTH</b>
      <span className="absolute top-[26%] left-[20%] size-[7px] rounded-full bg-primary shadow-[0_0_16px_var(--primary)]" />
    </>
  )
}
