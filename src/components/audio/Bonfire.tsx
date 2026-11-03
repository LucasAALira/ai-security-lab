import { useEffect, useId, useState } from 'react'
import { KnightArt } from '@/components/gothic/KnightArt'
import type { KnightGear } from '@/lib/knight'
import './bonfire.css'

/** Original vector illustration: no remote assets; CSS motion pauses in hidden tabs. */
export function Bonfire({ knight }: { knight?: KnightGear }) {
  const id = useId().replace(/:/g, '')
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const update = () => setPaused(document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const rotulo = knight
    ? `${knight.titulo} de pé ao lado da fogueira do santuário, com ${knight.completo} de ${knight.total} peças de equipamento.`
    : 'Fogueira do santuário, com a espada fincada no anel de cinzas.'
  return (
    <figure className="bonfire" data-paused={paused}>
      <svg viewBox="0 0 360 250" role="img" aria-label={rotulo}>
        <defs>
          <radialGradient id={`${id}-glow`}><stop stopColor="#f69c48" stopOpacity=".36" /><stop offset="1" stopColor="#d85c23" stopOpacity="0" /></radialGradient>
          <linearGradient id={`${id}-fire`} x1="0" y1="1" x2="0.3" y2="0"><stop stopColor="#e55b24" stopOpacity=".8" /><stop offset=".55" stopColor="#ffb35c" stopOpacity=".65" /><stop offset="1" stopColor="#f9dca5" stopOpacity=".06" /></linearGradient>
          <linearGradient id={`${id}-steel`}><stop stopColor="#242c36" /><stop offset=".5" stopColor="#66717b" /><stop offset="1" stopColor="#ad9270" /></linearGradient>
          <linearGradient id={`${id}-cloak`}><stop stopColor="#171c26" /><stop offset=".7" stopColor="#35313a" /><stop offset="1" stopColor="#784b3d" /></linearGradient>
          <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
          <linearGradient id={`${id}-emerald`}><stop stopColor="#132e2b" /><stop offset=".5" stopColor="#356251" /><stop offset="1" stopColor="#193d34" /></linearGradient>
          <linearGradient id={`${id}-linen`}><stop stopColor="#8c816c" /><stop offset=".5" stopColor="#c6b998" /><stop offset="1" stopColor="#756b5d" /></linearGradient>
        </defs>
        <ellipse cx="199" cy="203" rx="145" ry="30" fill="#080a10" opacity=".45" />
        <ellipse className="bonfire-halo" cx="228" cy="153" rx="109" ry="90" fill={`url(#${id}-glow)`} />
        {/* Pedra do descanso, original: só rocha e sombra. Quem senta aqui é o cavaleiro do
            santuário, desenhado em `KnightArt` e montado abaixo, com o equipamento de quem estuda. */}
        <path d="M59 199l12-35 35-12 33 22-1 33-64 5z" fill="#252831" stroke="#47454b" />
        <path d="M70 180l28-9 24 15" fill="none" stroke="#5e6570" strokeOpacity=".5" />

        {/* Ash ring, charred wood and sword. */}
        <g fill="#393235" stroke="#655147"><ellipse cx="234" cy="212" rx="47" ry="10" /><path d="M196 210l58-12 8 7-62 13zm10-16 53 17-6 7-53-17z" /></g>
        <g stroke="#9f7352" strokeWidth="1.5" fill="#b7aaa0"><path d="M237 97l8 1-6 108-7 9-1-11z" /><path d="M223 103l34 2-1 5-34-2z" /><path d="M237 77l9 1-2 25-8-1z" fill="#3d3030" /><circle cx="242" cy="74" r="5" /></g>
        <g className="bonfire-flames" fill={`url(#${id}-fire)`}>
          <path className="bonfire-flame" d="M212 210C185 187 217 171 210 143c21 17 6 29 18 38 0-27 28-40 19-67 38 40-6 53 13 71 10-9 14-21 11-31 29 35 8 62-25 64z" />
          <path className="bonfire-flame bonfire-flame-inner" d="M224 213c-15-20 7-30 5-48 18 13-2 24 10 32 10-11 15-17 13-29 24 24 5 49-12 48z" fill="#ffd69b" opacity=".6" />
        </g>
        <g fill="none" stroke="#b9afa5" strokeWidth="4" strokeLinecap="round" filter={`url(#${id}-soft)`}>
          <path className="bonfire-smoke" d="M240 151c-32-24 27-34 6-60s-4-35 8-50" />
          <path className="bonfire-smoke bonfire-smoke-late" d="M251 150c25-22-9-38 4-57s27-32 9-55" />
        </g>
        {/* O cavaleiro do santuário: arte original, com o equipamento que o progresso rendeu. */}
        {knight ? (
          <g style={{ color: 'var(--foreground)' }}>
            <ellipse cx="84" cy="215" rx="35" ry="8" fill="#080a10" opacity=".55" />
            <g transform="translate(34 46) scale(0.84)">
              <KnightArt gear={knight} />
            </g>
          </g>
        ) : null}
        <g fill="#ffbd71">{[0, 1, 2, 3, 4, 5, 6].map(i => <circle className="bonfire-ember" key={i} cx={215 + i * 7} cy={192 - i % 3 * 9} r={i % 2 ? 1.4 : 2} style={{ animationDelay: `${-i * .7}s`, animationDuration: `${3 + i * .35}s` }} />)}</g>
      </svg>
      <figcaption>Descanse. A chama do conhecimento permanece.</figcaption>
    </figure>
  )
}
