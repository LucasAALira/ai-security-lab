import { useId } from 'react'
import { cn } from '@/lib/utils'

/* Cena original do Santuário do Conhecimento: o salão de uma biblioteca em ruínas, com um vitral
   ogival, estantes, velas e uma rosácea cujo desenho é um circuito (o toque tecnológico).
   Tudo em SVG gerado aqui: nenhuma imagem externa, poucos KB, sem animação contínua.
   É decorativa: os controles ficam por cima, sobre um véu escuro que garante o contraste. */

/** Lombadas de livros determinísticas (sem aleatoriedade: o desenho é sempre o mesmo). */
function books(x0: number, y: number, width: number, seed: number) {
  const out: { x: number; w: number; h: number; c: string }[] = []
  const colors = ['#4a2a22', '#2d3a2b', '#3b2f45', '#5a4426', '#2a3442', '#4b3a2a', '#3a2620']
  let x = x0
  let i = seed
  while (x < x0 + width - 6) {
    const w = 6 + ((i * 7) % 7)
    const h = 34 + ((i * 13) % 20)
    out.push({ x, w, h, c: colors[(i * 5) % colors.length] })
    x += w + 1
    i += 1
  }
  return out.map((b) => ({ ...b, y: y - b.h }))
}

function Shelf({ x, width, seed }: { x: number; width: number; seed: number }) {
  const rows = [150, 222, 294, 366]
  return (
    <g>
      <rect x={x - 8} y={86} width={width + 16} height={300} fill="#120d0a" stroke="#2b2018" strokeWidth="2" />
      {rows.map((y, r) => (
        <g key={y}>
          {books(x, y, width, seed + r * 11).map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} opacity="0.85" />
          ))}
          <rect x={x - 8} y={y} width={width + 16} height={6} fill="#3a2a1d" />
        </g>
      ))}
    </g>
  )
}

function Candle({ x, y, h = 30, glow }: { x: number; y: number; h?: number; glow: string }) {
  return (
    <g>
      <circle cx={x} cy={y - h - 8} r={46} fill={`url(#${glow})`} />
      <rect x={x - 4} y={y - h} width={8} height={h} rx={1.5} fill="#e9dcc0" />
      <path d={`M${x - 4} ${y - h + 3} q2 6 0 10`} stroke="#cdbb98" strokeWidth="1.2" fill="none" />
      <path d={`M${x} ${y - h - 15} c4 5 4 9 0 12 c-4 -3 -4 -7 0 -12z`} fill="#f7c76b" />
      <path d={`M${x} ${y - h - 10} c2 3 2 5 0 7 c-2 -2 -2 -4 0 -7z`} fill="#fff4cf" />
    </g>
  )
}

export function SanctuaryScene({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const glow = `${id}g`
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={cn('block size-full', className)}>
      <defs>
        <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1613" />
          <stop offset="1" stopColor="#0d0a09" />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#f2c46d" stopOpacity="0.32" />
          <stop offset="1" stopColor="#f2c46d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}light`} cx="0.72" cy="0.2" r="0.6">
          <stop offset="0" stopColor="#d9a54e" stopOpacity="0.22" />
          <stop offset="1" stopColor="#d9a54e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2f55" />
          <stop offset="0.5" stopColor="#2a3346" />
          <stop offset="1" stopColor="#4a3320" />
        </linearGradient>
        <pattern id={`${id}stone`} width="80" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40 H80 M40 0 V20 M0 20 H80 M20 20 V40 M60 20 V40" stroke="#000" strokeOpacity="0.25" strokeWidth="1" fill="none" />
        </pattern>
      </defs>

      {/* parede de pedra */}
      <rect width="1200" height="420" fill={`url(#${id}wall)`} />
      <rect width="1200" height="420" fill={`url(#${id}stone)`} />

      {/* arcos laterais da nave */}
      {[120, 1120].map((cx) => (
        <path key={cx} d={`M${cx - 110} 420 V170 Q${cx - 110} 60 ${cx} 40 Q${cx + 110} 60 ${cx + 110} 170 V420`} fill="none" stroke="#2c2119" strokeWidth="14" />
      ))}

      {/* estantes */}
      <Shelf x={40} width={250} seed={3} />
      <Shelf x={548} width={156} seed={9} />
      <Shelf x={1024} width={160} seed={17} />

      {/* vitral ogival, deslocado para a direita: à esquerda ficam os controles */}
      <g transform="translate(262 0)">
        <path d="M470 420 V190 Q470 70 600 28 Q730 70 730 190 V420 Z" fill="#0c0908" stroke="#3a2a1d" strokeWidth="10" />
        <path d="M490 400 V194 Q490 88 600 50 Q710 88 710 194 V400 Z" fill={`url(#${id}glass)`} />
        {/* rosácea em forma de circuito: trilhas e nós */}
        <g transform="translate(600 150)" stroke="#d9a54e" strokeOpacity="0.55" fill="none" strokeWidth="2">
          <circle r="54" stroke="#8a6a3c" strokeWidth="5" strokeOpacity="0.9" />
          <circle r="20" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0 -20 V-34 H10 V-48" />
              <circle cx="10" cy="-48" r="3" fill="#f2c46d" fillOpacity="0.8" stroke="none" />
            </g>
          ))}
          <rect x="-7" y="-7" width="14" height="14" fill="#f2c46d" fillOpacity="0.5" stroke="none" transform="rotate(45)" />
        </g>
        {/* chumbo das vidraças */}
        <path d="M600 204 V400 M545 230 V400 M655 230 V400 M490 300 H710" stroke="#0c0908" strokeWidth="5" />
        {[[520, 250, '#5a3d24'], [570, 330, '#3d2f55'], [628, 250, '#2f4430'], [680, 330, '#5a3d24'], [520, 350, '#2a3346'], [630, 350, '#4a2a3a']].map(([x, y, c], i) => (
          <rect key={i} x={Number(x)} y={Number(y)} width="22" height="34" fill={String(c)} opacity="0.7" />
        ))}
      </g>
      <rect width="1200" height="420" fill={`url(#${id}light)`} />

      {/* parapeito com velas */}
      <rect x="642" y="372" width="440" height="14" fill="#2b2018" />
      <rect x="632" y="384" width="460" height="36" fill="#1a130e" />
      <Candle x={682} y={372} h={34} glow={glow} />
      <Candle x={708} y={372} h={22} glow={glow} />
      <Candle x={1022} y={372} h={28} glow={glow} />
      <Candle x={1046} y={372} h={40} glow={glow} />
      <Candle x={150} y={410} h={26} glow={glow} />

      {/* poeira de luz: três feixes estáticos */}
      <path d="M822 60 L732 420 H782 Z" fill="#f2c46d" opacity="0.035" />
      <path d="M902 60 L962 420 H1022 Z" fill="#f2c46d" opacity="0.03" />
    </svg>
  )
}
