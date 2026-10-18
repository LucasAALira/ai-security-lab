import { cn } from '@/lib/utils'

/* Fogueira digital: um prisma (octaedro em linhas de 1 px) flutuando sobre um nó de servidor.
   Acesa, guarda uma chama geométrica de facetas; apagada, só a armação tracejada e uma brasa fria.
   Desenho original. As cores vêm do tema (classes gx-prism-* em gothic.css) e o movimento some
   com prefers-reduced-motion. Use `PrismFlameArt` dentro de outro SVG, ou `PrismFlame` sozinho. */

const P = {
  top: [32, 6],
  bottom: [32, 54],
  left: [13, 30],
  right: [51, 30],
  front: [32, 37],
  back: [32, 23],
} as const
type V = keyof typeof P
const seg = (a: V, b: V) => `M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}`

/** Arestas da frente (sempre visíveis) e de trás (mais apagadas). */
const FRONT = [seg('top', 'left'), seg('top', 'right'), seg('top', 'front'), seg('bottom', 'left'), seg('bottom', 'right'), seg('bottom', 'front'), seg('left', 'front'), seg('front', 'right')].join(' ')
const BACK = [seg('top', 'back'), seg('bottom', 'back'), seg('left', 'back'), seg('back', 'right')].join(' ')

/** O desenho, em coordenadas 0 0 64 80, para usar dentro de outro <svg>. */
export function PrismFlameArt({ lit }: { lit: boolean }) {
  return (
    <g className="gx-prism-art" data-lit={lit}>
      {lit ? <ellipse className="gx-prism-halo" cx="32" cy="34" rx="30" ry="26" /> : null}
      {/* nó de servidor: duas lâminas com luzes de atividade */}
      <g className="gx-prism-node">
        <path d="M14 62 h36 v6 h-36 Z M18 70 h28 v5 h-28 Z" />
        <path d="M32 58 V62" />
      </g>
      <g className="gx-prism-leds">
        <rect x="18" y="64" width="2.4" height="2" />
        <rect x="22" y="64" width="2.4" height="2" />
        <rect x="40" y="64" width="6" height="2" />
      </g>
      {/* prisma flutuante com a chama */}
      <g className="gx-prism-float">
        <path className="gx-prism-back" d={BACK} />
        {lit ? (
          <g className="gx-prism-fire">
            <polygon className="gx-prism-flame-outer" points="32,13 40,29 38,42 32,49 26,42 24,29" />
            <polygon className="gx-prism-flame-inner" points="32,23 36.5,33 34.5,43 32,46 29.5,43 27.5,33" />
            <polygon className="gx-prism-flame-core" points="32,32 34,38 32,44 30,38" />
            <path className="gx-prism-facet" d="M32 13 L32 49 M24 29 L32 36 L40 29" />
          </g>
        ) : (
          <rect className="gx-prism-ember" x="29.5" y="27.5" width="5" height="5" transform="rotate(45 32 30)" />
        )}
        <path className="gx-prism-edge" d={FRONT} />
        {lit ? (
          <g className="gx-prism-sparks">
            <rect className="s1" x="30" y="8" width="2" height="2" />
            <rect className="s2" x="38" y="16" width="1.6" height="1.6" />
            <rect className="s3" x="24" y="18" width="1.6" height="1.6" />
          </g>
        ) : null}
      </g>
    </g>
  )
}

/** Ícone da fogueira digital (marcador da trilha, pontos de conclusão). Decorativo. */
export function PrismFlame({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 64 80" aria-hidden="true" focusable="false" className={cn('gx-prism', className)} data-lit={lit}>
      <PrismFlameArt lit={lit} />
    </svg>
  )
}
