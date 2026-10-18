import { useId } from 'react'
import { cn } from '@/lib/utils'

/* Cena original do Santuário do Conhecimento, versão "catedral digital": uma nave gótica desenhada
   só com linhas de circuito de 1 px. Arcos ogivais, colunas que são trilhas de placa, piso em grade,
   um friso de escamas de dragão e o vitral central, cuja rosácea é um circuito com nós de solda.
   A fogueira digital (Bonfire) é desenhada no mesmo sistema de coordenadas, na base do vitral.
   Tudo em SVG gerado aqui, nas cores do tema ativo: nenhuma imagem externa, sem animação contínua.
   É decorativa: os controles ficam por cima, sobre um véu escuro que garante o contraste. */

/** Centro e largura do vitral, no sistema 1200 × 420 (a fogueira usa os mesmos números). */
export const SCENE = { width: 1200, height: 420, windowX: 840, rosetteY: 150, altarY: 336 } as const

const line = { stroke: 'currentColor', fill: 'none', vectorEffect: 'non-scaling-stroke' } as const

/** Arco ogival (pontiagudo) de largura w com o pé em y0 e o ápice em top. */
function ogive(cx: number, w: number, top: number, y0 = 420) {
  const h = w / 2
  const spring = top + w * 0.62
  return `M${cx - h} ${y0} V${spring} Q${cx - h} ${top + w * 0.12} ${cx} ${top} Q${cx + h} ${top + w * 0.12} ${cx + h} ${spring} V${y0}`
}

export function SanctuaryScene({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const { windowX: wx, rosetteY: ry, altarY } = SCENE
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={cn('block size-full', className)}>
      <defs>
        <linearGradient id={`${id}void`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 70%, var(--background))' }} />
          <stop offset="1" style={{ stopColor: 'var(--background)' }} />
        </linearGradient>
        <radialGradient id={`${id}halo`} cx="0.7" cy="0.36" r="0.5">
          <stop offset="0" style={{ stopColor: 'var(--primary)', stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={`${id}glass`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" style={{ stopColor: 'var(--primary)', stopOpacity: 0.12 }} />
          <stop offset="1" style={{ stopColor: 'var(--primary)', stopOpacity: 0.02 }} />
        </radialGradient>
        {/* escamas de dragão em trilha de circuito */}
        <pattern id={`${id}scales`} width="40" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 22a20 20 0 0 1 40 0M-20 11a20 20 0 0 1 40 0M20 11a20 20 0 0 1 40 0" {...line} strokeWidth="1" />
        </pattern>
        <linearGradient id={`${id}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}floor`}>
          <rect x="0" y="330" width="1200" height="90" fill={`url(#${id}fade)`} />
        </mask>
      </defs>

      {/* vazio da nave */}
      <rect width="1200" height="420" fill={`url(#${id}void)`} />
      <rect width="1200" height="420" fill={`url(#${id}halo)`} />

      {/* arcada lateral: arcos ogivais em linha fina, cada vez mais apagados para os lados */}
      <g style={{ color: 'var(--foreground)' }}>
        {[
          [120, 200, 70, 0.1],
          [330, 170, 96, 0.08],
          [520, 150, 118, 0.07],
          [1110, 170, 96, 0.1],
        ].map(([cx, w, top, o]) => (
          <g key={cx} strokeOpacity={o}>
            <path d={ogive(cx, w, top)} {...line} strokeWidth="1" />
            <path d={ogive(cx, w - 26, top + 22)} {...line} strokeWidth="1" strokeOpacity={0.6} />
          </g>
        ))}
        {/* colunas: trilhas verticais com derivações e nós de solda */}
        {[230, 425, 980, 1010].map((x, i) => (
          <g key={x} strokeOpacity={0.12}>
            <path d={`M${x} 420 V${120 + i * 14}`} {...line} strokeWidth="1" />
            <path d={`M${x} ${240 + i * 9} h${i % 2 ? -14 : 14} v-26`} {...line} strokeWidth="1" />
            <circle cx={x + (i % 2 ? -14 : 14)} cy={214 + i * 9} r="2" fill="currentColor" fillOpacity={0.18} stroke="none" />
          </g>
        ))}
      </g>

      {/* friso de escamas de dragão, sob a cornija */}
      <g style={{ color: 'var(--primary)' }} opacity="0.12">
        <rect x="0" y="262" width="1200" height="44" fill={`url(#${id}scales)`} />
      </g>
      <path d="M0 262 H1200 M0 306 H1200" style={{ color: 'var(--foreground)' }} {...line} strokeOpacity="0.1" strokeWidth="1" />

      {/* piso em grade, em perspectiva para o vitral */}
      <g style={{ color: 'var(--foreground)' }} strokeOpacity="0.1" mask={`url(#${id}floor)`}>
        {Array.from({ length: 15 }, (_, i) => -360 + i * 140).map((x) => (
          <path key={x} d={`M${wx} ${altarY} L${x} 420`} {...line} strokeWidth="1" />
        ))}
        {[352, 372, 396].map((y) => (
          <path key={y} d={`M0 ${y} H1200`} {...line} strokeWidth="1" />
        ))}
      </g>

      {/* vitral central: dupla ogiva, mainéis de circuito e a rosácea */}
      <g style={{ color: 'var(--primary)' }}>
        <path d={`${ogive(wx, 232, 30, altarY)} Z`} fill={`url(#${id}glass)`} stroke="none" />
        <path d={ogive(wx, 232, 30, altarY)} {...line} strokeOpacity="0.75" strokeWidth="1" />
        <path d={ogive(wx, 206, 52, altarY)} {...line} strokeOpacity="0.4" strokeWidth="1" />
        {/* mainéis: trilhas com nós e derivações em 45° */}
        <g strokeOpacity="0.4">
          <path d={`M${wx} ${ry + 60} V${altarY} M${wx - 52} ${ry + 92} V${altarY} M${wx + 52} ${ry + 92} V${altarY}`} {...line} strokeWidth="1" />
          <path d={`M${wx - 52} ${ry + 92} l52 -32 l52 32`} {...line} strokeWidth="1" />
          <path d={`M${wx - 103} 268 H${wx + 103}`} {...line} strokeWidth="1" />
          <path d={`M${wx - 26} 268 v18 l-10 10 v20 M${wx + 26} 268 v18 l10 10 v20`} {...line} strokeWidth="1" />
        </g>
        <g fill="currentColor" fillOpacity="0.7" stroke="none">
          {[
            [wx - 52, ry + 92],
            [wx + 52, ry + 92],
            [wx, 268],
            [wx - 36, 316],
            [wx + 36, 316],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" transform={`rotate(45 ${x} ${y})`} />
          ))}
        </g>

        {/* rosácea: o circuito do vitral */}
        <g transform={`translate(${wx} ${ry})`}>
          <circle r="58" {...line} strokeOpacity="0.85" strokeWidth="1" />
          <circle r="50" {...line} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />
          <circle r="20" {...line} strokeOpacity="0.8" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0 -20 V-32 L9 -41 V-50" {...line} strokeOpacity="0.7" strokeWidth="1" />
              <circle cx="9" cy="-50" r="2.6" fill="currentColor" fillOpacity="0.9" stroke="none" />
            </g>
          ))}
          <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="currentColor" fillOpacity="0.55" stroke="none" />
          <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="#fff" fillOpacity="0.85" stroke="none" />
        </g>

        {/* feixes de luz do vitral, estáticos */}
        <path d={`M${wx - 30} 90 L${wx - 160} 420 H${wx - 90} Z`} fill="currentColor" opacity="0.03" />
        <path d={`M${wx + 30} 90 L${wx + 150} 420 H${wx + 230} Z`} fill="currentColor" opacity="0.025" />
      </g>

      {/* altar: plataforma de dados na base do vitral, onde fica a fogueira */}
      <g style={{ color: 'var(--foreground)' }}>
        <path d={`M${wx - 120} ${altarY} H${wx + 120} M${wx - 96} ${altarY + 10} H${wx + 96}`} {...line} strokeOpacity="0.22" strokeWidth="1" />
      </g>
    </svg>
  )
}
