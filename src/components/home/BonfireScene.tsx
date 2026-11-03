import { HeroSprite } from '@/components/hero/HeroSprite'
import { inscricaoDoDia } from '@/data/inscricoes'
import { heroOf, trajeOf } from '@/lib/hero'
import { useProgress } from '@/state/ProgressProvider'
import './bonfire-scene.css'

/** A fogueira do santuário, com o seu personagem ao lado, na mesma escala.
 *  A fogueira é um desenho em pixel art trazido pelo autor do projeto (crédito em
 *  `public/assets/CREDITS.md`); o personagem é montado aqui, em `src/components/pixel`. */
export function BonfireScene() {
  const { state, today } = useProgress()
  const heroi = heroOf(state)
  const traje = trajeOf(state)
  return (
    <figure className="bonfire-scene" data-testid="fogueira">
      <div className="bonfire-scene-palco">
        <span className="bonfire-scene-halo" aria-hidden="true" />
        <HeroSprite heroi={heroi} traje={traje} scale={3} title={`${heroi.nome} diante da fogueira do santuário`} />
        <img className="bonfire-scene-fogo" src={`${import.meta.env.BASE_URL}assets/fogueira.png`} alt="" width={140} height={176} />
      </div>
      <figcaption>{inscricaoDoDia('fogueira', today)}</figcaption>
    </figure>
  )
}
