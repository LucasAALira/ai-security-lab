import { useMemo } from 'react'
import { montarPersonagem } from '@/components/pixel/montar'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { heroiById, type HeroiSpec } from '@/data/herois'

/** O personagem em pixel art, no traje escolhido. */
export function HeroSprite({ heroi, traje = 0, scale = 3, title }: { heroi: HeroiSpec | string; traje?: number; scale?: number; title?: string }) {
  const spec = typeof heroi === 'string' ? heroiById(heroi) : heroi
  const indice = Math.min(Math.max(traje, 0), (spec?.trajes.length ?? 1) - 1)
  const sprite = useMemo(() => {
    if (!spec) return null
    const t = spec.trajes[indice]
    return montarPersonagem(`${spec.id}-${indice}`, t.pecas, t.palette)
  }, [spec, indice])
  if (!sprite) return null
  return <PixelSprite sprite={sprite} scale={scale} title={title} className="max-w-full" />
}
