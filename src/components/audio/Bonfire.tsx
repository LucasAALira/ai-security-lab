import { useEffect, useState } from 'react'
import './bonfire.css'
/** Original vector illustration; no copyrighted game artwork. */
export function Bonfire() {
  const [paused, setPaused] = useState(false)
  useEffect(() => { const update = () => setPaused(document.hidden); update(); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update) }, [])
  return <figure className="bonfire" data-paused={paused} aria-label="Fogueira do santuário">
    <svg viewBox="0 0 300 240" role="img" aria-label="Chamas douradas sobre lenha e pedras">
      <ellipse className="bonfire-glow" cx="150" cy="170" rx="110" ry="50" fill="#b65c1e" opacity=".18" />
      <ellipse cx="150" cy="197" rx="90" ry="18" fill="#100d0b" />
      <g fill="#514235" stroke="#a18a65" strokeWidth="2"><path d="M64 185l25-12 25 14-15 16-32-3zM188 184l21-12 26 16-8 15-30-2zM109 203l22-12 29 10-4 14-36 2zM159 201l20-12 23 14-8 13-30-1z" /></g>
      <g stroke="#866044" strokeWidth="13" strokeLinecap="round"><path d="M110 186l80-22M111 165l78 24" /></g>
      <path className="bonfire-flame outer" fill="#b94e1c" d="M150 191C81 177 117 130 119 111c18 19 13 25 18 29-13-39 33-66 21-104 55 42 4 83 30 98l9-30c22 47 15 80-47 87Z" />
      <path className="bonfire-flame inner" fill="#eea73e" d="M149 188c-32-16-21-36-13-57l9 17c-3-24 19-40 16-60 26 42-9 52 11 70l9-12c6 25-9 40-32 42Z" />
      <path className="bonfire-flame core" fill="#ffe5a1" d="M151 185c-17-12-10-22-4-38l8 9 8-24c12 26 9 40-12 53Z" />
      <g fill="#efbc67"><circle className="ember e1" cx="135" cy="118" r="2"/><circle className="ember e2" cx="176" cy="108" r="2"/><circle className="ember e3" cx="151" cy="94" r="1.5"/></g>
    </svg><figcaption>O conhecimento mantém a chama acesa.</figcaption>
  </figure>
}
