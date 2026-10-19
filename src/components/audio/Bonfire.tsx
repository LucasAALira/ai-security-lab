import { useEffect, useState } from 'react'
import { PrismFlameArt } from '@/components/gothic/PrismFlame'
import { SCENE } from '@/components/gothic/SanctuaryScene'
import './bonfire.css'

/** Fogueira digital do santuário: o prisma com a chama geométrica, no altar da base do vitral.
 *  Usa o mesmo sistema de coordenadas da cena (1200 × 420, recorte central), então fica sempre
 *  abaixo da rosácea, sem cobri-la. Desenho original; pausa quando a página não está visível. */
export function Bonfire() {
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const update = () => setPaused(document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const w = 84
  const h = (w * 80) / 64
  return (
    <figure className="bonfire" data-paused={paused} aria-label="Fogueira digital do santuário">
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Prisma flutuante com uma chama geométrica, sobre um nó de servidor">
        <svg x={SCENE.windowX - w / 2} y={SCENE.altarY - h + 6} width={w} height={h} viewBox="0 0 64 80" overflow="visible">
          <PrismFlameArt lit />
        </svg>
      </svg>
      <figcaption>O conhecimento mantém a chama acesa.</figcaption>
    </figure>
  )
}
