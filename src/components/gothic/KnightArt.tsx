import { useEffect, useId, useState } from 'react'
import type { KnightGear } from '@/lib/knight'
import { DEFAULT_HERO, type HeroId } from '@/lib/hero'
import { giro, PIVOS, POSES, type PoseId } from './knight-pose'
import './knight.css'

/* O cavaleiro do santuário: arte original em SVG, desenhada para este projeto.
   Começa andarilho, de túnica puída e faca de sílex, e ganha peças com o estudo e com as compras
   na loja (`src/lib/knight.ts`). A classe escolhida (`src/lib/hero.ts`) troca a arma e o traje.
   Nenhum personagem, peça, brasão ou arte de terceiros foi copiado.

   Sistema próprio de 120 × 200, chão em y = 196, eixo do corpo em x = 60. A figura é desenhada em
   repouso e cada membro gira em torno do próprio pivô (`knight-pose.ts`), o que permite poses
   diferentes sem redesenhar nada. A luz vem da direita, de onde fica a fogueira. */

export const KNIGHT_VIEWBOX = { width: 120, height: 200 } as const

const linha = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const
/** Contorno quase preto: quem dá brilho é o gradiente das placas, não a borda. */
const TRACO = 'color-mix(in oklab, var(--foreground) 22%, #000)'

interface Props {
  gear: KnightGear
  hero?: HeroId
  pose?: PoseId
  /** Desliga o movimento onde ele não cabe; quem pede menos movimento já fica sem ele pelo CSS. */
  animated?: boolean
}

export function KnightArt({ gear, hero = DEFAULT_HERO, pose = 'guarda', animated = true }: Props) {
  const tem = gear.tem
  const id = useId().replace(/:/g, '')
  const oculta = usePageHidden()
  const u = (nome: string) => `url(#${id}${nome})`
  const p = POSES[pose]

  const aco = { fill: u('aco'), stroke: TRACO, strokeWidth: 1.1, strokeLinejoin: 'round' } as const
  const pano = { fill: u('pano'), stroke: TRACO, strokeWidth: 1.2, strokeLinejoin: 'round' } as const
  const Rebite = ({ x, y, r = 1.1 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill="currentColor" fillOpacity="0.55" stroke="none" />

  /* ---------- membros ---------- */

  const perna = (lado: 'esq' | 'dir') => {
    const e = lado === 'esq'
    const coxa = e ? p.coxaEsq : p.coxaDir
    const canela = e ? p.canelaEsq : p.canelaDir
    return (
      <g transform={giro(coxa, e ? PIVOS.quadril : PIVOS.quadril)}>
        <path d={e ? 'M48 100 Q45 120 46 142 L56 142 Q57 120 58 100 Z' : 'M72 100 Q75 120 74 142 L64 142 Q63 120 62 100 Z'} {...pano} />
        {tem('peitoral') ? (
          <path d={e ? 'M44 97 Q50 101 55 100 L54 112 Q48 114 44 110 Z' : 'M76 97 Q70 101 65 100 L66 112 Q72 114 76 110 Z'} {...aco} />
        ) : null}
        <g transform={giro(canela, e ? PIVOS.joelhoEsq : PIVOS.joelhoDir)}>
          <path d={e ? 'M46 138 L56 138 L56 162 L55 182 Q50 185 45 182 L45 162 Z' : 'M74 138 L64 138 L64 162 L65 182 Q70 185 75 182 L75 162 Z'} {...pano} />
          {tem('grevas') ? (
            <g>
              <path d={e ? 'M43 134 Q50 130 57 134 Q58 142 56 146 Q50 149 44 146 Q42 141 43 134 Z' : 'M77 134 Q70 130 63 134 Q62 142 64 146 Q70 149 76 146 Q78 141 77 134 Z'} {...aco} />
              <path d={e ? 'M44 148 L56 148 L55 178 Q50 181 45 178 Z' : 'M76 148 L64 148 L65 178 Q70 181 75 178 Z'} {...aco} />
              <path d={e ? 'M50 152 V176' : 'M70 152 V176'} {...linha} strokeWidth="0.9" strokeOpacity="0.45" />
              <Rebite x={e ? 46 : 66} y={152} />
              <Rebite x={e ? 54 : 74} y={152} />
            </g>
          ) : null}
          {tem('botas') ? (
            <g>
              <path d={e ? 'M42 178 L57 178 L57 188 Q57 192 52 192 L36 192 Q33 186 42 184 Z' : 'M78 178 L63 178 L63 188 Q63 192 68 192 L84 192 Q87 186 78 184 Z'} {...aco} />
              <path d={e ? 'M36 192 h21' : 'M63 192 h21'} {...linha} strokeWidth="1.4" strokeOpacity="0.7" />
              <path d={e ? 'M44 182 h12' : 'M64 182 h12'} {...linha} strokeWidth="0.9" strokeOpacity="0.4" />
            </g>
          ) : (
            <g>
              <path d={e ? 'M45 180 L56 180 L56 188 Q56 192 51 192 L40 192 Q38 186 45 184 Z' : 'M75 180 L64 180 L64 188 Q64 192 69 192 L80 192 Q82 186 75 184 Z'} {...pano} strokeWidth="1.1" />
              <path d={e ? 'M41 190 h13' : 'M66 190 h13'} {...linha} strokeWidth="0.8" strokeOpacity="0.45" />
            </g>
          )}
        </g>
      </g>
    )
  }

  const braco = (lado: 'esq' | 'dir') => {
    const e = lado === 'esq'
    return (
      <g transform={giro(e ? p.bracoEsq : p.bracoDir, e ? PIVOS.ombroEsq : PIVOS.ombroDir)}>
        <path d={e ? 'M40 50 Q33 64 31 80 L40 80 Q42 66 47 54 Z' : 'M80 50 Q87 64 89 80 L80 80 Q78 66 73 54 Z'} {...pano} />
        <g transform={giro(e ? p.anteEsq : p.anteDir, e ? PIVOS.cotoveloEsq : PIVOS.cotoveloDir)}>
          <path d={e ? 'M31 78 Q29 92 33 102 L41 100 Q38 90 40 78 Z' : 'M89 78 Q91 92 87 104 L79 102 Q82 92 80 78 Z'} {...pano} />
          {tem('bracadeiras') ? (
            <g>
              <path d={e ? 'M28 78 Q34 74 40 78 L39 94 Q34 98 29 94 Z' : 'M92 78 Q86 74 80 78 L81 94 Q86 98 91 94 Z'} {...aco} />
              <path d={e ? 'M29 86 Q34 89 39 86' : 'M91 86 Q86 89 81 86'} {...linha} strokeWidth="0.9" strokeOpacity="0.45" />
              <path d={e ? 'M30 100 Q36 97 41 101 Q41 108 36 109 Q30 108 30 100 Z' : 'M90 102 Q84 99 79 103 Q79 110 84 111 Q90 110 90 102 Z'} {...aco} />
            </g>
          ) : (
            <circle cx={e ? 35 : 85} cy={e ? 104 : 106} r="4.4" {...pano} strokeWidth="1.1" />
          )}
        </g>
      </g>
    )
  }

  /** A arma muda com a classe e com o quanto já se andou. Fica na mão direita. */
  const arma = () => {
    const transforma = `${giro(p.bracoDir, PIVOS.ombroDir)} ${giro(p.anteDir, PIVOS.cotoveloDir)} ${giro(p.arma, PIVOS.maoDir)}`
    const veterana = tem('espada')
    return (
      <g transform={transforma} style={{ color: 'var(--hero-accent, var(--primary))' }}>
        {hero === 'clerigo' ? (
          <g>
            <path d="M85 104 V176" {...linha} strokeWidth={veterana ? 3.4 : 2.8} />
            <path d="M82 110 h6 M82 115 h6" {...linha} strokeWidth="0.9" strokeOpacity="0.6" />
            <path d="M85 92 l7 7 -7 9 -7 -9 Z" fill={u('aco')} stroke={TRACO} strokeWidth="1.1" strokeLinejoin="round" />
            {veterana ? <path d="M78 99 h14 M85 88 v4" {...linha} strokeWidth="1.6" strokeOpacity="0.8" /> : null}
            <circle cx="85" cy="99" r="2.2" fill="currentColor" fillOpacity="0.8" stroke="none" />
          </g>
        ) : hero === 'arcanista' ? (
          <g>
            <path d="M85 86 V186" {...linha} strokeWidth={veterana ? 3 : 2.4} />
            <path d="M82 112 h6 M82 117 h6" {...linha} strokeWidth="0.9" strokeOpacity="0.55" />
            <path d="M85 68 l6 10 -6 10 -6 -10 Z" fill="color-mix(in oklab, var(--hero-accent, var(--primary)) 55%, var(--card))" stroke={TRACO} strokeWidth="1.1" strokeLinejoin="round" />
            <circle className="knight-visor" cx="85" cy="78" r="2.6" fill="var(--hero-accent, var(--primary))" stroke="none" />
            {veterana ? <path d="M78 84 q7 -5 14 0" {...linha} strokeWidth="1.4" strokeOpacity="0.7" /> : null}
          </g>
        ) : hero === 'batedor' ? (
          <g>
            <path d={veterana ? 'M81 116 Q83 142 85 160 Q88 142 89 116 Z' : 'M82 116 Q84 134 85 148 Q87 134 88 116 Z'} fill={u('lamina')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M78 116 q7 -3 14 0" {...linha} strokeWidth="2" />
            <path d="M85 104 V115" {...linha} strokeWidth="2.8" />
            <path d="M82.6 107 h5 M82.6 111 h5" {...linha} strokeWidth="0.9" strokeOpacity="0.55" />
            {veterana ? <path d="M90 118 Q92 132 93 142 Q95 132 95 118 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="0.9" strokeLinejoin="round" /> : null}
          </g>
        ) : hero === 'barbaro' ? (
          <g>
            <path d="M85 96 V182" {...linha} strokeWidth="4" />
            <path d="M84 98 Q71 92 72 79 Q82 80 85 87 Q88 76 99 76 Q98 93 86 99 Z" fill={u('aco')} stroke={TRACO} strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M85 108 V178" {...linha} strokeWidth="1" strokeOpacity="0.45" />
          </g>
        ) : hero === 'duelista' ? (
          <g>
            <path d="M85 102 L84 190 L87 102 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M77 106 Q85 101 93 106" {...linha} strokeWidth="1.6" />
            <path d="M85 92 V104" {...linha} strokeWidth="2.4" />
            <path d="M82 95 h6 M82 99 h6" {...linha} strokeWidth="0.8" strokeOpacity="0.6" />
            <path d="M90 119 Q94 137 96 151 Q98 137 98 119 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="0.9" strokeLinejoin="round" opacity="0.85" />
          </g>
        ) : hero === 'espadachim' ? (
          <g>
            <path d="M81 120 Q75 140 80 160 Q82 176 85 192 Q89 176 90 160 Q94 140 88 120 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M84 126 Q80 150 85 184" {...linha} strokeWidth="0.9" strokeOpacity="0.5" />
            <path d="M76 121 Q85 116 94 121" {...linha} strokeWidth="1.8" />
            <path d="M85 104 V120" {...linha} strokeWidth="3" />
          </g>
        ) : hero === 'prisioneiro' ? (
          <g>
            <path d="M81 118 Q84 140 85 160 Q88 140 89 118 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M78 118 q7 -3 14 0" {...linha} strokeWidth="2" />
            <path d="M85 104 V117" {...linha} strokeWidth="3" />
            <path d="M81 105 q-5 -7 -2 -11 M89 105 q5 -7 2 -11 M79 94 h4 M87 94 h4" {...linha} strokeWidth="1.4" />
          </g>
        ) : hero === 'penitente' ? (
          <g>
            <path d="M85 104 V130" {...linha} strokeWidth="2.7" />
            <path d="M85 129 Q83 138 80 143 M85 129 Q87 138 90 143" {...linha} strokeWidth="1.1" />
            <circle cx="85" cy="151" r={veterana ? 8 : 6.5} fill={u('aco')} stroke={TRACO} strokeWidth="1.1" />
            <path d="M81 148 l8 6 M89 148 l-8 6" {...linha} strokeWidth="1" strokeOpacity="0.65" />
          </g>
        ) : hero === 'sobrevivente' ? (
          <g>
            <path d="M85 72 V188" {...linha} strokeWidth="2.8" />
            <path d="M85 62 L78 78 L85 76 L92 78 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M81 110 l8 5 M81 116 l8 5 M81 122 l8 5" {...linha} strokeWidth="1.4" strokeOpacity="0.65" />
          </g>
        ) : veterana ? (
          <g>
            <clipPath id={`${id}corte`}>
              <path d="M80 122 L84 192 L88 122 Z" />
            </clipPath>
            <path d="M80 122 L84 192 L88 122 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M84 126 V184" {...linha} strokeWidth="0.9" strokeOpacity="0.5" />
            <g clipPath={`url(#${id}corte)`}>
              <rect className="knight-glint" x="76" y="150" width="16" height="9" fill="#fff" opacity="0" />
            </g>
            <path d="M72 122 Q84 116 96 122 Q84 118 72 122 Z" fill="currentColor" fillOpacity="0.8" stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M84 104 V120" {...linha} strokeWidth="3.4" />
            <path d="M81 108 h6 M81 112 h6 M81 116 h6" {...linha} strokeWidth="0.9" strokeOpacity="0.6" />
            <circle cx="84" cy="101" r="3.4" fill="currentColor" stroke={TRACO} strokeWidth="0.8" />
          </g>
        ) : (
          <g>
            <path d="M81 118 Q83 140 85 156 Q88 140 89 118 Z" fill={u('lamina')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M85 122 V150" {...linha} strokeWidth="0.8" strokeOpacity="0.45" />
            <path d="M78 118 q7 -3 14 0" {...linha} strokeWidth="2.2" />
            <path d="M85 104 V117" {...linha} strokeWidth="3.2" />
            <path d="M82.6 107 h5 M82.6 110.5 h5 M82.6 114 h5" {...linha} strokeWidth="0.9" strokeOpacity="0.55" />
          </g>
        )}
      </g>
    )
  }

  /** O escudo acompanha o braço do escudo; o arcanista o leva às costas, para as mãos ficarem livres. */
  const escudo = () => {
    if (!tem('escudo')) return null
    const nasCostas = hero === 'arcanista'
    const transforma = nasCostas
      ? 'translate(18 2) scale(0.9)'
      : `${giro(p.bracoEsq, PIVOS.ombroEsq)} ${giro(p.anteEsq, PIVOS.cotoveloEsq)} ${giro(p.escudo, PIVOS.maoEsq)}`
    return (
      <g style={{ color: 'var(--hero-accent, var(--primary))' }} transform={transforma} opacity={nasCostas ? 0.75 : 1}>
        <g transform="translate(14 60)">
          <path d="M1 6 Q15 -2 29 6 L28 28 Q27 44 15 52 Q3 44 2 28 Z" fill={u('manto')} stroke={TRACO} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M5 9 Q15 3 25 9 L24 27 Q23 39 15 45 Q7 39 6 27 Z" {...linha} strokeWidth="0.9" strokeOpacity="0.6" />
          <path d="M15 16 l6 7 -6 7 -6 -7 Z" fill="currentColor" fillOpacity="0.85" stroke="none" />
          <path d="M8 20 l-4 -4 M22 20 l4 -4 M15 32 v6" {...linha} strokeWidth="1.2" strokeOpacity="0.75" />
        </g>
      </g>
    )
  }

  const usaCapuz = ['arcanista', 'batedor', 'prisioneiro', 'penitente', 'sobrevivente'].includes(hero)

  const cabeca = () => (
    <g transform={`${giro(p.cabeca, PIVOS.pescoco)} translate(62 0) scale(0.88 1) translate(-62 0)`}>
      {tem('elmo') && !usaCapuz ? (
        <g>
          <path d="M48 30 Q48 10 60 10 Q72 10 72 30 L71 37 Q60 44 49 37 Z" {...aco} />
          <path d="M60 10 Q63 20 62 32" {...linha} strokeWidth="1.6" strokeOpacity="0.5" />
          <path d="M48 24 Q60 20 72 24" {...linha} strokeWidth="1" strokeOpacity="0.5" />
          <path d="M46 34 Q60 42 74 34 L73 40 Q60 47 47 40 Z" {...aco} />
          {/* a viseira olha para o lado da fogueira, nunca para quem está vendo */}
          <path className="knight-visor" d="M58 27 h8 M70 27 h2" {...linha} strokeWidth="2.2" style={{ color: 'var(--hero-accent, var(--primary))' }} />
          <path d="M62 32 v3 M65 33 v3" {...linha} strokeWidth="0.9" strokeOpacity="0.5" />
          <Rebite x={50} y={31} />
          <Rebite x={70} y={31} />
        </g>
      ) : (
        <g>
          <path d="M55 34 q5 4 10 0 l1 10 h-12 Z" {...pano} strokeWidth="1.1" />
          {/* capuz: o rosto fica de perfil, na sombra */}
          <path d={usaCapuz ? 'M48 26 Q48 10 60 10 Q74 10 74 26 Q74 34 64 38 Q50 36 48 26 Z' : 'M50 24 Q50 12 60 12 Q70 12 70 24 Q70 32 60 36 Q50 32 50 24 Z'} {...pano} />
          <path d="M56 22 Q63 16 69 23 Q68 31 62 34 Q57 31 56 22 Z" fill={usaCapuz ? 'color-mix(in oklab, var(--card) 86%, #000)' : 'color-mix(in oklab, var(--foreground) 42%, var(--card))'} stroke="none" />
          <path d="M54 20 Q58 11 62 14 Q66 11 70 20 Q66 17 62 19 Q58 17 54 20 Z" fill="color-mix(in oklab, var(--card) 88%, #000)" stroke="none" />
          {usaCapuz && tem('elmo') ? (
            <path className="knight-visor" d="M62 24 h4" {...linha} strokeWidth="1.8" style={{ color: 'var(--hero-accent, var(--primary))' }} />
          ) : (
            <path d="M62 24 h3" {...linha} strokeWidth="1.5" strokeOpacity="0.75" style={{ color: 'color-mix(in oklab, var(--card) 80%, #000)' }} />
          )}
        </g>
      )}
    </g>
  )

  const tronco = () => (
    <g transform={giro(p.tronco, PIVOS.quadril)}>
      <g className="knight-breathe">
        <path d="M36 50 Q38 78 46 102 H74 Q82 78 84 50 Q60 40 36 50 Z" fill={u('pano')} stroke={TRACO} strokeWidth="1.2" strokeLinejoin="round" />
        {tem('bracadeiras') || tem('peitoral') || tem('grevas') ? (
          <path d="M36 50 Q38 78 46 102 H74 Q82 78 84 50 Q60 40 36 50 Z" fill={u('malha')} stroke="none" />
        ) : (
          <g>
            <path d="M44 58 l6 5 -6 5 M70 66 l6 5 -6 5" {...linha} strokeWidth="0.8" strokeOpacity="0.4" />
            <path d="M50 76 q6 3 12 0" {...linha} strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 3" />
          </g>
        )}

        {tem('peitoral') ? (
          <g>
            <path d="M36 48 Q34 72 44 88 Q60 94 76 88 Q86 72 84 48 Q60 38 36 48 Z" {...aco} />
            <path d="M60 42 Q63 64 60 90" {...linha} strokeWidth="1.4" strokeOpacity="0.55" />
            <path d="M42 56 Q60 66 78 56 M43 70 Q60 80 77 70" {...linha} strokeWidth="1" strokeOpacity="0.45" />
            <path d="M45 88 Q60 95 75 88 L74 97 Q60 103 46 97 Z" {...aco} />
            <path d="M50 40 Q60 46 70 40 Q70 46 60 49 Q50 46 50 40 Z" {...aco} />
            <Rebite x={45} y={50} />
            <Rebite x={75} y={50} />
            <path d="M26 58 Q27 42 44 42 Q49 48 48 60 Q37 64 26 58 Z" {...aco} />
            <path d="M27 62 Q38 68 48 64 Q48 70 45 75 Q33 75 27 62 Z" {...aco} />
            <path d="M94 58 Q93 42 76 42 Q71 48 72 60 Q83 64 94 58 Z" {...aco} />
            <path d="M93 62 Q82 68 72 64 Q72 70 75 75 Q87 75 93 62 Z" {...aco} />
          </g>
        ) : (
          <g>
            <path d="M46 60 Q60 66 74 60" {...linha} strokeWidth="1" strokeOpacity="0.35" />
            <path d="M45 84 Q60 90 75 84 L74 90 Q60 96 46 90 Z" fill="color-mix(in oklab, var(--card) 70%, #000)" stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <circle cx="60" cy="88" r="1.8" fill="currentColor" fillOpacity="0.45" stroke="none" />
            <path d="M46 96 l4 5 4 -4 3 6 4 -6 4 5 4 -5" {...linha} strokeWidth="1" strokeOpacity="0.5" />
          </g>
        )}

        {/* marca da classe: o códice do clérigo, no cinto */}
        {hero === 'clerigo' ? (
          <g>
            <path d="M44 84 h10 l1 12 h-11 Z" fill={u('aco')} stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
            <path d="M49 85 V95 M46 88 h6" {...linha} strokeWidth="0.9" strokeOpacity="0.7" />
          </g>
        ) : null}
        {/* O recorte do traje e os detalhes de cada arquétipo são originais e seguem a paleta fria da referência. */}
        {hero === 'barbaro' ? (
          <path d="M28 48 Q34 39 46 44 L50 52 L46 63 Q35 66 29 59 Z" fill="var(--hero-accent)" stroke={TRACO} strokeWidth="1.2" strokeLinejoin="round" />
        ) : hero === 'duelista' ? (
          <path d="M41 49 Q60 57 79 49 L77 56 Q60 64 43 56 Z" fill="var(--hero-accent)" stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
        ) : hero === 'batedor' ? (
          <path d="M43 54 L72 88 M40 57 L69 91" {...linha} strokeWidth="2" style={{ color: 'var(--hero-accent)' }} />
        ) : hero === 'arcanista' ? (
          <g style={{ color: 'var(--hero-accent)' }}>
            <path d="M60 58 l3 5 6 1 -4 4 1 6 -6 -3 -5 3 1 -6 -4 -4 6 -1 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="60" cy="67" r="1.3" fill="currentColor" stroke="none" />
          </g>
        ) : hero === 'espadachim' ? (
          <path d="M46 88 Q60 94 74 88 L73 96 Q60 102 47 96 Z" fill="var(--hero-accent)" stroke={TRACO} strokeWidth="1" strokeLinejoin="round" />
        ) : hero === 'prisioneiro' ? (
          <g style={{ color: 'var(--hero-accent)' }}>
            <path d="M39 68 Q49 78 59 68 T79 68" {...linha} strokeWidth="1.6" />
            <circle cx="41" cy="68" r="2" fill="currentColor" stroke="none" />
            <circle cx="59" cy="68" r="2" fill="currentColor" stroke="none" />
            <circle cx="78" cy="68" r="2" fill="currentColor" stroke="none" />
          </g>
        ) : hero === 'penitente' ? (
          <g style={{ color: 'var(--hero-accent)' }}>
            <path d="M60 58 l5 6 -5 6 -5 -6 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M60 72 V83" {...linha} strokeWidth="1.4" />
          </g>
        ) : hero === 'sobrevivente' ? (
          <g style={{ color: 'var(--hero-accent)' }}>
            <path d="M46 62 l10 3 -3 9 -10 -3 Z M67 78 l10 3 -3 9 -10 -3 Z" fill="currentColor" fillOpacity="0.55" stroke={TRACO} strokeWidth="1" />
            <path d="M45 63 l8 2 M66 79 l8 2" {...linha} strokeWidth="0.8" />
          </g>
        ) : null}
        {cabeca()}
      </g>
    </g>
  )

  return (
    <g className={animated ? 'knight' : undefined} data-paused={oculta ? 'true' : undefined} data-hero={hero}>
      <defs>
        <linearGradient id={`${id}aco`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 86%, #000)' }} />
          <stop offset="0.55" style={{ stopColor: 'color-mix(in oklab, var(--card) 55%, var(--foreground))' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--foreground) 80%, var(--info))' }} />
        </linearGradient>
        {/* A luz vem da fogueira, à direita: o lado esquerdo cai na sombra. */}
        <linearGradient id={`${id}pano`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 88%, #000)' }} />
          <stop offset="0.6" style={{ stopColor: 'color-mix(in oklab, var(--card) 40%, var(--foreground))' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--foreground) 72%, var(--primary))' }} />
        </linearGradient>
        <linearGradient id={`${id}manto`} x1="0.1" y1="0" x2="1" y2="0.4">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--hero-accent, var(--primary)) 30%, #000)' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--hero-accent, var(--primary)) 62%, var(--card))' }} />
        </linearGradient>
        <linearGradient id={`${id}lamina`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'color-mix(in oklab, var(--card) 70%, #000)' }} />
          <stop offset="0.45" style={{ stopColor: 'color-mix(in oklab, var(--foreground) 85%, var(--card))' }} />
          <stop offset="0.55" style={{ stopColor: 'color-mix(in oklab, var(--card) 60%, var(--foreground))' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in oklab, var(--card) 80%, #000)' }} />
        </linearGradient>
        <pattern id={`${id}malha`} width="4" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 3a2 2 0 0 1 4 0M-2 1.5a2 2 0 0 1 4 0M2 1.5a2 2 0 0 1 4 0" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
        </pattern>
      </defs>

      <g transform={`translate(${p.deslocaX} ${p.deslocaY}) translate(60 0) scale(${p.largura} 1) translate(-60 0)`}>
        {/* manto, atrás de tudo */}
        {tem('manto') ? (
          <g
            className="knight-cloak"
            style={{ color: 'var(--hero-accent, var(--primary))' }}
            transform={`${giro(p.tronco / 2 + (p.manto?.giro ?? 0), PIVOS.quadril)} translate(60 48) scale(1 ${p.manto?.escala ?? 1}) translate(-60 -48)`}
          >
            <path
              d="M43 46 Q27 92 26 140 Q25 164 30 176 L40 170 L47 177 L54 169 L60 176 L66 169 L73 177 L80 170 L90 176 Q95 164 94 140 Q93 92 77 46 Q60 56 43 46 Z"
              fill={u('manto')}
              stroke={TRACO}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M46 58 Q34 112 33 170 M74 58 Q86 112 87 170 M54 56 Q48 116 47 174 M66 56 Q72 116 73 174" {...linha} strokeWidth="0.9" strokeOpacity="0.4" />
            <circle cx="44" cy="48" r="2.6" fill="currentColor" fillOpacity="0.8" stroke="none" />
            <circle cx="76" cy="48" r="2.6" fill="currentColor" fillOpacity="0.8" stroke="none" />
          </g>
        ) : null}

        <g style={{ color: 'var(--foreground)' }}>
          {/* o lado mais longe primeiro: braço da arma, perna de trás */}
          <g className="knight-arm">{braco('dir')}</g>
          {perna('dir')}
          {tronco()}
          {perna('esq')}
          {arma()}
          {braco('esq')}
        </g>
        {escudo()}
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
