import { useEffect, useId, useState } from 'react'
import './bonfire.css'

/** Original vector illustration: no remote assets; CSS motion pauses in hidden tabs. */
export function Bonfire() {
  const id = useId().replace(/:/g, '')
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const update = () => setPaused(document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return (
    <figure className="bonfire" data-paused={paused}>
      <svg viewBox="0 0 360 250" role="img" aria-label="Arauto Esmeralda de Dark Souls II ao lado do cavaleiro e da fogueira; o brasão de dragões do site aparece na veste verde e no escudo">
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
        {/* Rock, weathered cloak, seated legs and articulated armour. */}
        <path d="M59 199l12-35 35-12 33 22-1 33-64 5z" fill="#252831" stroke="#47454b" />
        <path d="M119 87Q89 86 79 121L65 193l32 8 20-18 33 17-8-61z" fill={`url(#${id}-cloak)`} stroke="#53404a" strokeWidth="1.5" />
        <path d="M89 127l-12 66m22-57-9 57m17-49-5 42" fill="none" stroke="#817071" strokeOpacity=".24" />
        <g fill={`url(#${id}-steel)`} stroke="#1c222b" strokeWidth="2" strokeLinejoin="round">
          <path d="M111 143l27 8 26 32-16 13-36-23-16-15z" />
          <path d="M151 182l16 2 15 25-8 8-28-21z" />
          <path d="M173 207l15 3 14 11-6 7-29-7-4-9z" />
          <path d="M114 153l36-6 24 12-8 18-28-12-25 13-16-13z" />
          <path d="M164 163l14 5-8 37-17 2 1-17z" />
          <path d="M152 201l19 1 10 13-3 6-32-5z" />
          <path d="M110 96l24-5 15 22-11 34-25 12-14-27z" />
          <path d="M104 98l-13 9 1 17 17 4 10-17z" />
          <path d="M128 96l15 1 12 16-11 11-18-13z" />
          <path d="M143 116l15 25 16 10-9 12-23-13-14-26z" />
          <path d="M164 150l15 2 6 8-5 6-17-4z" />
          <path d="M101 123l6 19 28 9 5 12-36-7-14-26z" />
          <path d="M132 151l14-2 7 8-8 8-11-3z" />
          {/* Helmet inclined toward the fire. */}
          <path d="M114 61l21-5 15 15 1 22-13 11-23-11-7-18z" />
        </g>
        <path d="M118 62l14-2 4 15 15 5-2 11-13 6-3-17z" fill="#9d9b90" opacity=".4" />
        <path d="M129 78l22 4-1 5-21-3z" fill="#10151d" />
        <path d="M140 89l1 7m4-6v4M115 112l18 6m-24 8 23 6m-18 6 16 5M151 185l9 9" stroke="#e0b47a" strokeOpacity=".38" fill="none" />
        {/* Shield leaning on the stone. */}
        <path d="M60 145l26-8 20 14-5 42-20 18-18-22z" fill="#262c34" stroke="#8b7b63" strokeWidth="2" />
        <path d="M68 152l16-6 14 10-5 32-11 12-11-15z" fill="none" stroke="#5e6570" />
        <image href={`${import.meta.env.BASE_URL}assets/dragon-lock.png`} x="71" y="161" width="25" height="25" opacity=".92" />
        {/* Shanalotte / Emerald Herald: green hood and cloak, auburn hair, linen dress,
            crimson sash and leather gloves. A vector interpretation beside the resting knight. */}
        <g aria-hidden="true" strokeLinejoin="round">
          <ellipse cx="310" cy="217" rx="38" ry="8" fill="#080b10" opacity=".4" />
          <path d="M300 203l-5 16 18 1 3-16m10-2 1 16 15 2-7-18" fill="#342d2b" stroke="#665342" />
          <path d="M299 84Q282 92 281 118l-11 83 22 15 45-2 13-15-14-94-15-23z" fill={`url(#${id}-emerald)`} stroke="#426354" strokeWidth="1.5" />
          <path d="M303 101l20-1 5 53 10 61-49-1 12-62z" fill={`url(#${id}-linen)`} stroke="#6c6854" />
          <path d="M307 145l-7 59m15-56-1 57m6-55 7 54" fill="none" stroke="#e4d8b5" strokeOpacity=".3" />
          <path d="M298 111l22-6 9 23-4 25-25 2-6-24z" fill="#554b3f" stroke="#968061" />
          <path d="M307 111l11 32m-16-23 20 12m-21-3 21-6" fill="none" stroke="#bda480" strokeWidth="1" />
          <path d="M296 145l33-5 2 9-35 6z" fill="#8e3736" stroke="#ba6550" />
          <path d="M323 148l6 39-9-6-3-31z" fill="#803537" />
          {/* Hood framing a left-facing, quietly lowered face. */}
          <path d="M293 82l-6-17 3-24 14-16 20 5 13 20-2 30-16 20z" fill={`url(#${id}-emerald)`} stroke="#55715b" strokeWidth="1.5" />
          <path d="M300 42l16-4 10 13-2 26-12 13-15-9-4-23z" fill="#302c29" />
          <path d="M303 46l14 1 6 12-4 19-10 8-9-10-5-8 4-8z" fill="#c4a48a" />
          <path d="M299 48q15-18 26 6l-2 26-5 9-3-11 5-18-9-8-11 10-5 15-3-10z" fill="#6c3f2f" />
          <path d="M300 62l6 1m-6 8 4 2m0 5 5 1" fill="none" stroke="#624b43" strokeWidth="1.2" />
          <path d="M294 42l-5 31 12 21-12 13-8 71-9 21 17 13 12-47-1-61 9-14-13-16z" fill="#234d3f" stroke="#627558" />
          <path d="M329 44l7 33-10 19 10 47 14 56-13 15-14-43-6-71 11-22z" fill="#294d40" stroke="#667b59" />
          {/* Sleeves and gloved hands held in front of the waist. */}
          <path d="M293 102l-12 10 2 22 17 15 9-8-15-17 7-14z" fill="#3f6351" stroke="#77846a" />
          <path d="M329 102l10 18-13 25-14 3-2-10 12-8-2-19z" fill="#355a49" stroke="#758365" />
          <path d="M301 138l10 2 10-3 5 6-10 10-13-4-7-5z" fill="#665044" stroke="#ac8969" />
          <path d="M306 142l12 3m-9 1 8 3" stroke="#b49a7a" strokeWidth=".8" fill="none" />
          {/* Gold trim and the exact site crest on the lower green mantle. */}
          <path d="M277 196l13 10m42-10 8 13M295 207q17 5 37 0" stroke="#b09b6e" strokeWidth="1.5" fill="none" />
          <image href={`${import.meta.env.BASE_URL}assets/dragon-lock.png`} x="274" y="159" width="26" height="26" opacity=".9" />
          <path d="M294 87l12 9 17-3" stroke="#bda77a" fill="none" />
          <circle cx="306" cy="96" r="2.5" fill="#c6ab72" />
        </g>
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
        <g fill="#ffbd71">{[0, 1, 2, 3, 4, 5, 6].map(i => <circle className="bonfire-ember" key={i} cx={215 + i * 7} cy={192 - i % 3 * 9} r={i % 2 ? 1.4 : 2} style={{ animationDelay: `${-i * .7}s`, animationDuration: `${3 + i * .35}s` }} />)}</g>
      </svg>
      <figcaption>Descanse. A chama do conhecimento permanece.</figcaption>
    </figure>
  )
}
