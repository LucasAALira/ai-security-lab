import { useMemo } from 'react'
import { spriteRuns, spriteSize, type Sprite } from './sprite'

/** Desenha um sprite em SVG, pixel por pixel, sem suavização.
 *  `scale` só muda o tamanho do desenho; a nitidez vem do `shapeRendering`. */
export function PixelSprite({ sprite, scale = 4, className, title }: { sprite: Sprite; scale?: number; className?: string; title?: string }) {
  const { width, height } = spriteSize(sprite)
  const runs = useMemo(() => spriteRuns(sprite), [sprite])
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width * scale}
      height={height * scale}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
    >
      {runs.map((r) => (
        <rect key={`${r.x}-${r.y}-${r.w}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
      ))}
    </svg>
  )
}
