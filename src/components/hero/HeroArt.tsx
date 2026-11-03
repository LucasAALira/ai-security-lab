import { heroiById, type HeroiSpec } from '@/data/herois'

/** O personagem do caminho escolhido, no traje em uso.
 *  A arte é ilustração em pixel art: desenhada em tamanho fixo e mostrada sem suavização,
 *  para os pixels ficarem nítidos em qualquer escala. */
export function HeroArt({
  heroi,
  traje = 0,
  altura = 160,
  className,
  alt,
}: {
  heroi: HeroiSpec | string
  traje?: number
  /** Altura em pixels; a largura acompanha a proporção da arte. */
  altura?: number
  className?: string
  /** Sem `alt`, a figura é tratada como decorativa. */
  alt?: string
}) {
  const spec = typeof heroi === 'string' ? heroiById(heroi) : heroi
  if (!spec) return null
  const t = spec.trajes[Math.min(Math.max(traje, 0), spec.trajes.length - 1)]
  const largura = Math.round((t.largura / t.altura) * altura)
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/herois/${t.arte}`}
      alt={alt ?? ''}
      width={largura}
      height={altura}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ imageRendering: 'pixelated', width: largura, height: altura }}
    />
  )
}
