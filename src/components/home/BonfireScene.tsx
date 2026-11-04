import type React from 'react'
import { HeroArt } from '@/components/hero/HeroArt'
import { inscricaoDoDia } from '@/data/inscricoes'
import { heroOf, trajeOf } from '@/lib/hero'
import { useProgress } from '@/state/ProgressProvider'
import './bonfire-scene.css'

/** Altura do personagem na cena, em telas largas. A arte vem com 320 px e é reduzida aqui;
 *  nas telas estreitas o CSS encolhe a cena inteira (`--altura-heroi`). */
const ALTURA_HEROI = 264

/** A fogueira: a arte tem 73 × 144 px, recortada rente ao conteúdo, então a base da lenha
 *  encosta no mesmo chão dos pés do personagem. Fica mais baixa do que ele: a lenha bate no
 *  tornozelo e a espada fincada chega à altura do ombro, como quem a deixou ali ao sentar. */
const PROPORCAO_LENHA = 0.8
const LENHA = {
  largura: Math.round((73 / 144) * ALTURA_HEROI * PROPORCAO_LENHA),
  altura: Math.round(ALTURA_HEROI * PROPORCAO_LENHA),
}

/** As faíscas: cada uma sobe num tempo e numa inclinação próprios, para o fogo não piscar
 *  em bloco. Os números são fixos (nada de sorteio a cada render, que faria a cena saltar a
 *  cada atualização do progresso). */
const FAISCAS = [
  { x: 28, atraso: 0, tempo: 3.4, lado: -18, tamanho: 5 },
  { x: 46, atraso: 0.5, tempo: 4.2, lado: 12, tamanho: 4 },
  { x: 62, atraso: 1.1, tempo: 3.8, lado: 22, tamanho: 6 },
  { x: 38, atraso: 1.7, tempo: 4.6, lado: -10, tamanho: 4 },
  { x: 54, atraso: 2.2, tempo: 3.2, lado: 8, tamanho: 7 },
  { x: 70, atraso: 2.8, tempo: 4.0, lado: 26, tamanho: 4 },
  { x: 33, atraso: 3.3, tempo: 3.6, lado: -24, tamanho: 5 },
  { x: 58, atraso: 3.8, tempo: 4.4, lado: 14, tamanho: 4 },
  { x: 44, atraso: 4.4, tempo: 3.9, lado: -6, tamanho: 6 },
  { x: 66, atraso: 5.0, tempo: 4.3, lado: 18, tamanho: 4 },
]

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
        <span className="bonfire-scene-lenha">
          <img className="bonfire-scene-fogo" src={`${import.meta.env.BASE_URL}assets/fogueira.png`} alt="" width={LENHA.largura} height={LENHA.altura} />
          <span className="bonfire-scene-faiscas" aria-hidden="true">
            {FAISCAS.map((f) => (
              <span
                key={f.x + '-' + f.atraso}
                className="bonfire-scene-faisca"
                style={{ '--x': `${f.x}%`, '--atraso': `${f.atraso}s`, '--tempo': `${f.tempo}s`, '--lado': `${f.lado}px`, '--tamanho': `${f.tamanho}px` } as React.CSSProperties}
              />
            ))}
          </span>
        </span>
      </div>
      <figcaption>{inscricaoDoDia('fogueira', today)}</figcaption>
    </figure>
  )
}
