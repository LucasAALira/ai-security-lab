import { Overlay } from '@/components/onboarding/Overlay'
import { PathChooser } from './PathChooser'
import { heroEscolhido } from '@/lib/hero'
import { useProgress } from '@/state/ProgressProvider'

/** Primeira visita: antes de entrar no santuário, escolha um caminho.
 *  Aparece só enquanto ninguém escolheu; depois a troca fica na loja. */
export function FirstChoice() {
  const { state } = useProgress()
  if (heroEscolhido(state)) return null

  return (
    <Overlay labelledBy="escolha-titulo" describedBy="escolha-texto">
      <p className="gx-inscription">Antes de entrar</p>
      <h1 id="escolha-titulo" className="gx-display mt-2 text-[26px] leading-tight sm:text-[34px]">
        Escolha o seu caminho
      </h1>
      <p id="escolha-texto" className="mt-2 max-w-prose text-sm text-muted-foreground">
        Seis arquétipos entram no santuário pela mesma porta. O caminho muda a sua figura ao lado da fogueira e nada mais: o estudo, o XP e as
        conquistas são os mesmos para todos, e dá para trocar quando quiser, de graça, na loja.
      </p>
      <div className="mt-6">
        <PathChooser confirmLabel="Entrar no santuário" />
      </div>
    </Overlay>
  )
}
