import { HeroArt } from '@/components/hero/HeroArt'
import { inscricaoDoDia } from '@/data/inscricoes'
import { heroOf, trajeOf } from '@/lib/hero'
import { useProgress } from '@/state/ProgressProvider'
import './bonfire-scene.css'

/** Altura do personagem na cena. A arte vem com 320 px e é reduzida aqui. */
const ALTURA_HEROI = 176

/** A fogueira: a arte tem 73 × 144 px, recortada rente ao conteúdo, então a base da lenha
 *  encosta no mesmo chão dos pés do personagem. Fica mais baixa do que ele: a lenha bate no
 *  tornozelo e a espada fincada chega à altura do ombro, como quem a deixou ali ao sentar. */
const PROPORCAO_LENHA = 0.8
const LENHA = {
  largura: Math.round((73 / 144) * ALTURA_HEROI * PROPORCAO_LENHA),
  altura: Math.round(ALTURA_HEROI * PROPORCAO_LENHA),
}

/** A fogueira do santuário, com o seu personagem ao lado, na mesma escala.
 *  A fogueira e os personagens são ilustrações em pixel art trazidas pelo autor do projeto;
 *  a origem está registrada em `public/assets/CREDITS.md`. */
export function BonfireScene() {
  const { state, today } = useProgress()
  const heroi = heroOf(state)
  const traje = trajeOf(state)
  return (
    <figure className="bonfire-scene" data-testid="fogueira">
      <div className="bonfire-scene-palco">
        <span className="bonfire-scene-halo" aria-hidden="true" />
        <HeroArt heroi={heroi} traje={traje} altura={ALTURA_HEROI} respira alt={`${heroi.nome} diante da fogueira do santuário`} />
        <img className="bonfire-scene-fogo" src={`${import.meta.env.BASE_URL}assets/fogueira.png`} alt="" width={LENHA.largura} height={LENHA.altura} />
      </div>
      <figcaption>{inscricaoDoDia('fogueira', today)}</figcaption>
    </figure>
  )
}
