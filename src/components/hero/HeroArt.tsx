import { heroiById, type HeroiSpec, type Traje } from '@/data/herois'
import { cn } from '@/lib/utils'
import './hero-art.css'

/** Caminho do arquivo da arte, já com a base do site. */
export const arteDoTraje = (t: Traje) => `${import.meta.env.BASE_URL}assets/herois/${t.arte}`

/** O traje em uso de um caminho, com o índice preso à faixa que existe. */
export function trajeDoHeroi(spec: HeroiSpec, traje: number): Traje {
  return spec.trajes[Math.min(Math.max(traje, 0), spec.trajes.length - 1)]
}

/** O personagem do caminho escolhido, no traje em uso.
 *
 *  A arte é ilustração em pixel art desenhada em 320 px de altura. Como aqui ela quase sempre
 *  aparece menor do que isso, a redução fica com o filtro suave do navegador: `pixelated` só
 *  ajuda quando se amplia, e em redução ele come detalhe e serrilha a silhueta.
 *
 *  `respira` dá o vaivém lento do peito, com origem nos pés, para o personagem não parecer
 *  congelado ao lado da fogueira. Quem pediu menos movimento no sistema não vê animação alguma. */
export function HeroArt({
  heroi,
  traje = 0,
  altura = 160,
  respira = false,
  className,
  alt,
}: {
  heroi: HeroiSpec | string
  traje?: number
  /** Altura em pixels; a largura acompanha a proporção da arte. */
  altura?: number
  respira?: boolean
  className?: string
  /** Sem `alt`, a figura é tratada como decorativa. */
  alt?: string
}) {
  const spec = typeof heroi === 'string' ? heroiById(heroi) : heroi
  if (!spec) return null
  const t = trajeDoHeroi(spec, traje)
  const largura = Math.round((t.largura / t.altura) * altura)
  return (
    <img
      src={arteDoTraje(t)}
      alt={alt ?? ''}
      width={largura}
      height={altura}
      loading="lazy"
      decoding="async"
      className={cn('hero-art', respira && 'hero-art-respira', className)}
      style={{ width: largura, height: altura }}
    />
  )
}
