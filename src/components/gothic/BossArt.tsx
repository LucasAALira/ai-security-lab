import { useId } from 'react'
import { cn } from '@/lib/utils'
import './boss-art.css'

/* Os guardiões do santuário, em pixel art: um sprite por arquétipo (`BossShape`), escolhido pelo que o
   chefe representa no site. Os desenhos vêm da folha de chefes fornecida pelo autor do projeto e
   foram só recortados por `scripts/cursemark-assets.py`; a origem está em `public/assets/CREDITS.md`.

   Sistema de 200 × 200, com o chão na base: o sprite se ajusta ao quadro sem distorcer e fica
   encostado no chão (`xMidYMax`). O guardião encara quem avança, à esquerda. */

export type BossShape = 'guardia' | 'sombra' | 'cavaleiro' | 'juiza' | 'maquina' | 'gelo' | 'peconha'

export const BOSS_VIEWBOX = { width: 200, height: 200 } as const

/** Que figura cabe a cada guardião de módulo, pelo que ele representa no site. */
export const FORMA_DO_MODULO: BossShape[] = ['guardia', 'sombra', 'sombra', 'cavaleiro', 'juiza', 'juiza', 'guardia', 'juiza', 'maquina']

export const formaDoModulo = (modulo: number): BossShape => FORMA_DO_MODULO[modulo] ?? 'guardia'

/** Endereço do sprite. O prefixo vem do `base` do Vite, para o site funcionar de qualquer pasta. */
export const bossSpriteUrl = (shape: BossShape) => `${import.meta.env.BASE_URL}assets/cursemark/chefes/${shape}.png`

/** O sprite dentro de um SVG. `vencido` apaga as cores e escurece a figura: quem já caiu fica como pedra. */
export function BossArt({ shape, vencido = false }: { shape: BossShape; vencido?: boolean }) {
  const filtro = useId()
  return (
    <g className="boss" data-vencido={vencido ? 'true' : undefined}>
      {vencido ? (
        <defs>
          <filter id={filtro} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0.12" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.6" />
              <feFuncG type="linear" slope="0.6" />
              <feFuncB type="linear" slope="0.6" />
            </feComponentTransfer>
          </filter>
        </defs>
      ) : null}
      <image
        className="boss-sprite"
        href={bossSpriteUrl(shape)}
        x={0}
        y={0}
        width={BOSS_VIEWBOX.width}
        height={BOSS_VIEWBOX.height}
        preserveAspectRatio="xMidYMax meet"
        filter={vencido ? `url(#${filtro})` : undefined}
        opacity={vencido ? 0.85 : 1}
      />
    </g>
  )
}

/** O mesmo sprite como imagem comum, para quando não há um SVG em volta (diálogo do chefe, trilha). */
export function BossPortrait({ shape, vencido = false, className }: { shape: BossShape; vencido?: boolean; className?: string }) {
  return <img className={cn('boss-portrait', className)} data-vencido={vencido ? 'true' : undefined} src={bossSpriteUrl(shape)} alt="" aria-hidden="true" draggable={false} />
}
