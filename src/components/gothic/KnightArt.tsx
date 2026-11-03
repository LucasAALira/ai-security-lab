import { useEffect, useId, useState } from 'react'
import type { KnightGear } from '@/lib/knight'
import './knight.css'

/* Cavaleiro do santuário: arte original em SVG, desenhada para este projeto. Começa como um
   andarilho descalço, de faca de sílex na mão, e vai ganhando peças conforme o estudo e as
   compras na loja (as regras estão em `src/lib/knight.ts`). Nenhum personagem, peça ou arte de
   terceiros foi copiado.

   Sistema próprio de 120 × 200, com o chão em y = 196 e o eixo do corpo em x = 60. As placas são
   polígonos fechados com gradiente: a luz vem da direita, de onde fica a fogueira, e o lado
   esquerdo some na sombra. Quem usa a figura escolhe tamanho e posição com um `transform`. */

export const KNIGHT_VIEWBOX = { width: 120, height: 200 } as const

const linha = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const
/** Contorno: quase preto. Quem dá brilho é o gradiente das placas, não a borda. */
const TRACO = 'color-mix(in oklab, var(--foreground) 22%, #000)'

/** A figura, para colocar dentro de um `<svg>` já existente.
 *  `animated` desliga o movimento onde ele não cabe (numa captura de tela, por exemplo); quem
 *  pede menos movimento no sistema já fica sem ele pelo CSS. */
export function KnightArt({ gear, animated = true }: { gear: KnightGear; animated?: boolean }) {
  const tem = gear.tem
  const id = useId().replace(/:/g, '')
  const oculta = usePageHidden()
  const u = (nome: string) => `url(#${id}${nome})`

  /** Placa de metal, com a luz da fogueira na direita. */
  const aco = { fill: u('aco'), stroke: TRACO, strokeWidth: 1.1, strokeLinejoin: 'round' } as const
  /** Tecido e pele: mais escuros, sem brilho de metal. */
  const pano = { fill: u('pano'), stroke: TRACO, strokeWidth: 1.2, strokeLinejoin: 'round' } as const
  /** Rebite: o ponto de luz que faz a placa parecer placa. */
  const Rebite = ({ x, y, r = 1.1 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill="currentColor" fillOpacity="0.55" stroke="none" />

  return (
    <g className={animated ? 'knight' : undefined} data-paused={oculta ? 'true' : undefined}>
      <defs>
        <linearGradient id={`${id}aco`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 86%, #000)' }} />
          <stop offset="0.55" style={{ stopColor: 'color-mix(in oklab, var(--card) 55%, var(--foreground))' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--foreground) 80%, var(--primary))' }} />
        </linearGradient>
        {/* A luz vem da fogueira, à direita: o lado esquerdo cai na sombra. */}
        <linearGradient id={`${id}pano`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 88%, #000)' }} />
          <stop offset="0.6" style={{ stopColor: 'color-mix(in oklab, var(--card) 40%, var(--foreground))' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--foreground) 72%, var(--primary))' }} />
        </linearGradient>
        <linearGradient id={`${id}manto`} x1="0.1" y1="0" x2="1" y2="0.4">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--primary) 30%, #000)' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--primary) 62%, var(--card))' }} />
        </linearGradient>
        <linearGradient id={`${id}lamina`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 70%, #000)' }} />
          <stop offset="0.45" style={{ stopColor: 'color-mix(in oklab, var(--foreground) 85%, var(--card))' }} />
          <stop offset="0.55" style={{ stopColor: 'color-mix(in oklab, var(--card) 60%, var(--foreground))' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--card) 80%, #000)' }} />
        </linearGradient>
        {/* cota de malha: arcos miúdos, como as escamas da catedral */}
        <pattern id={`${id}malha`} width="4" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 3a2 2 0 0 1 4 0M-2 1.5a2 2 0 0 1 4 0M2 1.5a2 2 0 0 1 4 0" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* ---- manto, atrás de tudo ---- */}
      {tem('manto') ? (
        <g className="knight-cloak" style={{ color: 'var(--primary)' }}>
          <path
            d="M43 46 Q27 92 26 140 Q25 164 30 176 L40 170 L47 177 L54 169 L60 176 L66 169 L73 177 L80 170 L90 176 Q95 164 94 140 Q93 92 77 46 Q60 56 43 46 Z"
            fill={u('manto')}
            stroke={TRACO}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M46 58 Q34 112 33 170 M74 58 Q86 112 87 170 M54 56 Q48 116 47 174 M66 56 Q72 116 73 174" {...linha} strokeWidth="0.9" strokeOpacity="0.4" />
          {/* broches no ombro */}
          <circle cx="44" cy="48" r="2.6" fill="currentColor" fillOpacity="0.8" stroke="none" />
          <circle cx="76" cy="48" r="2.6" fill="currentColor" fillOpacity="0.8" stroke="none" />
        </g>
      ) : null}

      <g style={{ color: 'var(--foreground)' }}>
        {/* ---- pernas ---- */}
        <g>
          {/* coxa e canela, com o joelho marcado */}
          <path d="M48 100 Q45 122 46 140 L45 176 Q45 182 49 183 L55 183 Q57 176 56 162 L57 134 Q58 116 58 100 Z" {...pano} />
          <path d="M72 100 Q75 122 74 140 L75 176 Q75 182 71 183 L65 183 Q63 176 64 162 L63 134 Q62 116 62 100 Z" {...pano} />
          <path d="M45 100 Q50 104 58 102 M75 100 Q70 104 62 102" {...linha} strokeWidth="0.9" strokeOpacity="0.35" />
          {tem('grevas') ? (
            <g>
              {/* joelheira e greva */}
              <path d="M43 134 Q50 130 57 134 Q58 142 56 146 Q50 149 44 146 Q42 141 43 134 Z" {...aco} />
              <path d="M44 148 L56 148 L55 178 Q50 181 45 178 Z" {...aco} />
              <path d="M77 134 Q70 130 63 134 Q62 142 64 146 Q70 149 76 146 Q78 141 77 134 Z" {...aco} />
              <path d="M76 148 L64 148 L65 178 Q70 181 75 178 Z" {...aco} />
              <path d="M50 150 V176 M70 150 V176" {...linha} strokeWidth="0.9" strokeOpacity="0.45" />
              <Rebite x={46} y={152} />
              <Rebite x={54} y={152} />
              <Rebite x={66} y={152} />
              <Rebite x={74} y={152} />
            </g>
          ) : (
            <path d="M46 136 Q50 133 56 136 M64 136 Q70 133 74 136" {...linha} strokeWidth="0.9" strokeOpacity="0.3" />
          )}
          {/* pés */}
          {tem('botas') ? (
            <g>
              <path d="M42 178 L57 178 L57 188 Q57 192 52 192 L36 192 Q33 186 42 184 Z" {...aco} />
              <path d="M78 178 L63 178 L63 188 Q63 192 68 192 L84 192 Q87 186 78 184 Z" {...aco} />
              <path d="M36 192 h21 M63 192 h21" {...linha} strokeWidth="1.4" strokeOpacity="0.7" />
              <path d="M44 182 h12 M64 182 h12" {...linha} strokeWidth="0.9" strokeOpacity="0.4" />
            </g>
          ) : (
            <g>
              <path d="M45 180 L56 180 L56 188 Q56 192 51 192 L40 192 Q38 186 45 184 Z" {...pano} strokeWidth="1.1" />
              <path d="M75 180 L64 180 L64 188 Q64 192 69 192 L80 192 Q82 186 75 184 Z" {...pano} strokeWidth="1.1" />
              <path d="M41 190 h13 M66 190 h13" {...linha} strokeWidth="0.8" strokeOpacity="0.45" />
            </g>
          )}
        </g>

        {/* ---- tronco, braços e cabeça: é o conjunto que respira ---- */}
        <g className="knight-breathe">
          {/* malha por baixo da armadura */}
          <path d="M36 50 Q38 78 46 102 H74 Q82 78 84 50 Q60 40 36 50 Z" fill={u('pano')} stroke={TRACO} strokeWidth="1.2" strokeLinejoin="round" />
          {/* a cota de malha só aparece depois da primeira peça de metal; antes é pano remendado */}
          {tem('bracadeiras') || tem('peitoral') || tem('grevas') ? (
            <path d="M36 50 Q38 78 46 102 H74 Q82 78 84 50 Q60 40 36 50 Z" fill={u('malha')} stroke="none" />
          ) : (
            <g>
              <path d="M44 58 l6 5 -6 5 M70 66 l6 5 -6 5" {...linha} strokeWidth="0.8" strokeOpacity="0.4" />
              <path d="M50 76 q6 3 12 0 M46 90 q8 3 16 0" {...linha} strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 3" />
            </g>
          )}

          {tem('peitoral') ? (
            <g>
              {/* plastrão, faixas abdominais e gorjal */}
              <path d="M36 48 Q34 72 44 88 Q60 94 76 88 Q86 72 84 48 Q60 38 36 48 Z" {...aco} />
              <path d="M60 44 V90" {...linha} strokeWidth="1" strokeOpacity="0.5" />
              <path d="M42 56 Q60 66 78 56 M43 70 Q60 80 77 70" {...linha} strokeWidth="1" strokeOpacity="0.45" />
              {/* quilha central: a aresta que divide o plastrão */}
              <path d="M60 42 Q63 64 60 90" {...linha} strokeWidth="1.4" strokeOpacity="0.55" />
              <path d="M45 88 Q60 95 75 88 L74 97 Q60 103 46 97 Z" {...aco} />
              {/* tassetes: as abas que caem sobre as coxas */}
              <path d="M44 97 Q50 101 55 100 L54 112 Q48 114 44 110 Z" {...aco} />
              <path d="M76 97 Q70 101 65 100 L66 112 Q72 114 76 110 Z" {...aco} />
              <path d="M50 40 Q60 46 70 40 Q70 46 60 49 Q50 46 50 40 Z" {...aco} />
              <Rebite x={45} y={50} />
              <Rebite x={75} y={50} />
              <Rebite x={47} y={84} />
              <Rebite x={73} y={84} />
              {/* ombreiras em duas lâminas */}
              <path d="M26 58 Q27 42 44 42 Q49 48 48 60 Q37 64 26 58 Z" {...aco} />
              <path d="M27 62 Q38 68 48 64 Q48 70 45 75 Q33 75 27 62 Z" {...aco} />
              <path d="M94 58 Q93 42 76 42 Q71 48 72 60 Q83 64 94 58 Z" {...aco} />
              <path d="M93 62 Q82 68 72 64 Q72 70 75 75 Q87 75 93 62 Z" {...aco} />
            </g>
          ) : (
            <g>
              {/* sem peitoral: túnica puída, corda na cintura e a barra rasgada */}
              <path d="M46 60 Q60 66 74 60" {...linha} strokeWidth="1" strokeOpacity="0.35" />
              <path d="M45 84 Q60 90 75 84 L74 90 Q60 96 46 90 Z" fill="color-mix(in oklab, var(--card) 70%, #000)" stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
              <path d="M47 87 Q60 92 73 87" {...linha} strokeWidth="0.8" strokeOpacity="0.35" />
              <circle cx="60" cy="88" r="1.8" fill="currentColor" fillOpacity="0.45" stroke="none" />
              <path d="M46 96 l4 5 4 -4 3 6 4 -6 4 5 4 -5" {...linha} strokeWidth="1" strokeOpacity="0.5" />
            </g>
          )}

          {/* braço do escudo */}
          <path d="M40 50 Q31 66 29 82 Q28 94 33 102 L41 100 Q38 88 38 80 Q40 66 47 54 Z" {...pano} />
          {/* braço da arma */}
          <path className="knight-arm" d="M80 50 Q90 66 92 82 Q93 94 88 104 L80 102 Q83 90 83 80 Q81 66 73 54 Z" {...pano} />
          {tem('bracadeiras') ? (
            <g>
              <path d="M28 78 Q34 74 40 78 L39 94 Q34 98 29 94 Z" {...aco} />
              <path d="M29 86 Q34 89 39 86" {...linha} strokeWidth="0.9" strokeOpacity="0.45" />
              <path d="M92 78 Q86 74 80 78 L81 94 Q86 98 91 94 Z" {...aco} />
              <path d="M91 86 Q86 89 81 86" {...linha} strokeWidth="0.9" strokeOpacity="0.45" />
              {/* manoplas */}
              <path d="M30 100 Q36 97 41 101 Q41 108 36 109 Q30 108 30 100 Z" {...aco} />
              <path d="M90 102 Q84 99 79 103 Q79 110 84 111 Q90 110 90 102 Z" {...aco} />
            </g>
          ) : (
            <g>
              <circle cx="35" cy="104" r="4.4" {...pano} strokeWidth="1.1" />
              <circle cx="85" cy="106" r="4.4" {...pano} strokeWidth="1.1" />
            </g>
          )}

          {/* pescoço, cabeça e elmo */}
          {tem('elmo') ? (
            <g>
              {/* bacinete: calota, crista, viseira com fenda e respiradouros, protetor de nuca */}
              <path d="M48 30 Q48 10 60 10 Q72 10 72 30 L71 37 Q60 44 49 37 Z" {...aco} />
              <path d="M60 8 Q63 18 62 30" {...linha} strokeWidth="1.6" strokeOpacity="0.5" />
              <path d="M48 24 Q60 20 72 24" {...linha} strokeWidth="1" strokeOpacity="0.5" />
              <path d="M46 34 Q60 42 74 34 L73 40 Q60 47 47 40 Z" {...aco} />
              <path className="knight-visor" d="M50 27 h8 M62 27 h8" {...linha} strokeWidth="2.2" style={{ color: 'var(--primary)' }} />
              <path d="M57 32 v3 M60 33 v3 M63 32 v3" {...linha} strokeWidth="0.9" strokeOpacity="0.5" />
              <Rebite x={49} y={31} />
              <Rebite x={71} y={31} />
            </g>
          ) : (
            <g>
              <path d="M55 34 q5 4 10 0 l1 10 h-12 Z" {...pano} strokeWidth="1.1" />
              {/* capuz solto, com o rosto na sombra: só os olhos pegam a luz da fogueira */}
              <path d="M50 24 Q50 12 60 12 Q70 12 70 24 Q70 32 60 36 Q50 32 50 24 Z" {...pano} />
              {/* rosto: pele na penumbra, cabelo revolto e olhos fundos */}
              <path d="M53 22 Q60 16 67 22 Q66 31 60 34 Q54 31 53 22 Z" fill="color-mix(in oklab, var(--foreground) 46%, var(--card))" stroke="none" />
              <path d="M51 20 Q56 11 60 14 Q64 11 69 20 Q64 17 60 19 Q56 17 51 20 Z" fill="color-mix(in oklab, var(--card) 88%, #000)" stroke="none" />
              <path d="M56 24 h2.6 M61.4 24 h2.6" {...linha} strokeWidth="1.5" strokeOpacity="0.75" style={{ color: 'color-mix(in oklab, var(--card) 80%, #000)' }} />
            </g>
          )}
        </g>
      </g>

      {/* ---- escudo, no braço esquerdo ---- */}
      {tem('escudo') ? (
        <g style={{ color: 'var(--primary)' }} transform="translate(14 60)">
          <path d="M1 6 Q15 -2 29 6 L28 28 Q27 44 15 52 Q3 44 2 28 Z" fill={u('manto')} stroke={TRACO} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M5 9 Q15 3 25 9 L24 27 Q23 39 15 45 Q7 39 6 27 Z" {...linha} strokeWidth="0.9" strokeOpacity="0.6" />
          {/* brasão geométrico do santuário: losango com asas */}
          <path d="M15 16 l6 7 -6 7 -6 -7 Z" fill="currentColor" fillOpacity="0.85" stroke="none" />
          <path d="M8 20 l-4 -4 M22 20 l4 -4 M15 32 v6" {...linha} strokeWidth="1.2" strokeOpacity="0.75" />
          <circle cx="4" cy="10" r="1.2" fill="currentColor" fillOpacity="0.7" stroke="none" />
          <circle cx="26" cy="10" r="1.2" fill="currentColor" fillOpacity="0.7" stroke="none" />
        </g>
      ) : null}

      {/* ---- arma: a faca do começo dá lugar à espada longa ---- */}
      <g style={{ color: 'var(--gold-anodized, var(--foreground))' }}>
        {tem('espada') ? (
          <g>
            <clipPath id={`${id}corte`}>
              <path d="M80 122 L84 192 L88 122 Z" />
            </clipPath>
            <path d="M80 122 L84 192 L88 122 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M84 126 V184" {...linha} strokeWidth="0.9" strokeOpacity="0.5" />
            <g clipPath={`url(#${id}corte)`}>
              <rect className="knight-glint" x="76" y="150" width="16" height="9" fill="#fff" opacity="0" />
            </g>
            {/* quilhões curvos, punho enrolado e pomo */}
            <path d="M72 122 Q84 116 96 122 Q84 118 72 122 Z" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M84 104 V120" {...linha} strokeWidth="3.4" />
            <path d="M81 108 h6 M81 112 h6 M81 116 h6" {...linha} strokeWidth="0.9" strokeOpacity="0.6" />
            <circle cx="84" cy="101" r="3.4" fill="currentColor" stroke="currentColor" strokeWidth="0.8" />
          </g>
        ) : tem('faca') ? (
          <g>
            <path d="M81 118 Q83 140 85 156 Q88 140 89 118 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M85 122 V150" {...linha} strokeWidth="0.8" strokeOpacity="0.45" />
            <path d="M78 118 q7 -3 14 0" {...linha} strokeWidth="2.2" />
            <path d="M85 104 V117" {...linha} strokeWidth="3.2" />
            <path d="M82.6 107 h5 M82.6 110.5 h5 M82.6 114 h5" {...linha} strokeWidth="0.9" strokeOpacity="0.55" />
          </g>
        ) : null}
      </g>
    </g>
  )
}

/** A aba está escondida? Serve para parar a animação quando ninguém está olhando. */
function usePageHidden(): boolean {
  const [oculta, setOculta] = useState(false)
  useEffect(() => {
    const ver = () => setOculta(document.hidden)
    ver()
    document.addEventListener('visibilitychange', ver)
    return () => document.removeEventListener('visibilitychange', ver)
  }, [])
  return oculta
}
