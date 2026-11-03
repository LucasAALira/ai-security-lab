import type { ReactNode } from 'react'

/* Os guardiões do santuário, em contraluz: arte original, sem rosto e sem detalhe miúdo, como
   vultos vistos do outro lado de uma sala escura. Cada módulo usa um arquétipo (`BOSS_SHAPES`),
   escolhido pelo que o chefe representa no site. Nenhuma criatura, personagem ou arte de
   terceiros foi copiada.

   Sistema de 160 × 200, com o chão em y = 196. O vulto encara quem avança, à esquerda. */

export type BossShape = 'guardia' | 'sombra' | 'cavaleiro' | 'juiza' | 'maquina'

const olho = (cx: number, cy: number, r = 3) => <circle key={`${cx}-${cy}`} className="boss-eye" cx={cx} cy={cy} r={r} fill="var(--primary)" />

/** Cada arquétipo é um corpo grande em silhueta e dois (ou mais) olhos acesos. */
const FORMAS: Record<BossShape, ReactNode> = {
  // Torre viva: ombros de pedra, elmo de fenda única e uma lança fincada.
  guardia: (
    <g>
      <path d="M40 196 L46 96 Q52 58 80 50 Q108 58 114 96 L120 196 Z" />
      <path d="M44 92 Q80 78 116 92 L118 118 Q80 104 42 118 Z" opacity="0.75" />
      <path d="M62 54 Q80 26 98 54 Q98 74 80 80 Q62 74 62 54 Z" />
      <rect x="128" y="22" width="5" height="174" rx="2" />
      <path d="M130.5 10 l9 16 -9 10 -9 -10 Z" />
    </g>
  ),
  // Vulto encapuzado: muitos braços finos, como sussurros saindo do manto.
  sombra: (
    <g>
      <path d="M48 196 Q44 130 56 86 Q64 44 86 36 Q110 44 118 86 Q130 130 126 196 Z" />
      <path d="M66 46 Q86 16 106 46 Q106 72 86 82 Q66 72 66 46 Z" />
      <path d="M58 96 Q30 112 24 150 M60 110 Q34 134 34 170 M112 96 Q140 112 146 150 M110 110 Q136 134 136 170" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  // Cavaleiro inimigo: capa aberta e uma lâmina grande apoiada no chão.
  cavaleiro: (
    <g>
      <path d="M34 196 Q42 140 50 100 Q56 62 82 52 Q108 62 114 100 Q122 140 130 196 Z" opacity="0.6" />
      <path d="M58 196 L60 108 Q64 72 82 64 Q100 72 104 108 L106 196 Z" />
      <path d="M64 56 Q82 30 100 56 L98 76 Q82 86 66 76 Z" />
      <path d="M118 196 L124 92 L130 92 L136 196 Z" opacity="0.9" />
      <rect x="112" y="84" width="30" height="7" rx="3" />
    </g>
  ),
  // Figura de coroa e balança: julga quem passa.
  juiza: (
    <g>
      <path d="M44 196 Q48 128 60 88 Q68 50 84 44 Q100 50 108 88 Q120 128 124 196 Z" />
      <path d="M68 46 Q84 20 100 46 Q100 68 84 76 Q68 68 68 46 Z" />
      <path d="M66 30 l6 -14 6 10 6 -16 6 16 6 -10 6 14 Z" />
      <path d="M126 70 h34 M143 70 v34 M130 104 q13 14 26 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  // Máquina de decifrar: um olho grande entre anéis que giram.
  maquina: (
    <g>
      <path d="M52 196 Q50 140 62 104 L104 104 Q116 140 114 196 Z" />
      <circle cx="83" cy="64" r="40" />
      <circle cx="83" cy="64" r="28" fill="var(--background)" opacity="0.55" />
      <path d="M83 10 v12 M83 106 v12 M29 64 h12 M125 64 h12 M45 26 l9 9 M112 93 l9 9 M121 26 l-9 9 M54 93 l-9 9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
}

/** Os olhos acesos de cada arquétipo. */
const OLHOS: Record<BossShape, ReactNode> = {
  guardia: olho(80, 62, 3.4),
  sombra: (
    <g>
      {olho(79, 52)}
      {olho(93, 52)}
    </g>
  ),
  cavaleiro: (
    <g>
      {olho(76, 58, 2.6)}
      {olho(90, 58, 2.6)}
    </g>
  ),
  juiza: (
    <g>
      {olho(78, 54, 2.6)}
      {olho(91, 54, 2.6)}
    </g>
  ),
  maquina: olho(83, 64, 10),
}

export const BOSS_VIEWBOX = { width: 160, height: 200 } as const

/** O vulto. `vencido` acende os olhos e deixa a silhueta um pouco mais clara. */
export function BossArt({ shape, vencido = false }: { shape: BossShape; vencido?: boolean }) {
  return (
    <g className="boss" data-vencido={vencido ? 'true' : undefined}>
      <g
        fill={vencido ? 'color-mix(in oklab, var(--card) 30%, #000)' : 'color-mix(in oklab, var(--card) 42%, #000)'}
        stroke="color-mix(in oklab, var(--foreground) 42%, #000)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ color: 'color-mix(in oklab, var(--foreground) 42%, #000)' }}
        opacity={vencido ? 0.7 : 1}
      >
        {FORMAS[shape]}
      </g>
      <g opacity={vencido ? 0.35 : 1}>{OLHOS[shape]}</g>
    </g>
  )
}
