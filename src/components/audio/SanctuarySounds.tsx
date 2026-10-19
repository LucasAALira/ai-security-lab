import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@/state/ProgressProvider'
import { audioLevel, cueFor, Soundscape } from '@/lib/audio/soundscape'
const KEY = 'asl-soundscape'
function initial() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return { effects: p?.effects === true, effectVolume: audioLevel(p?.effectVolume, 0.25), fireVolume: audioLevel(p?.fireVolume, 0.3), seaVolume: audioLevel(p?.seaVolume, 0.22) }
  } catch { return { effects: false, effectVolume: 0.25, fireVolume: 0.3, seaVolume: 0.22 } }
}
export function SanctuarySounds() {
  const { store } = useProgress()
  const [prefs, setPrefs] = useState(initial)
  const [fire, setFire] = useState(false)
  const [sea, setSea] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const engine = useRef<Soundscape | null>(null)
  const request = useRef(0)
  const current = useRef(prefs); current.current = prefs
  useEffect(() => {
    const sound = new Soundscape(); engine.current = sound
    let clickTimer: ReturnType<typeof setTimeout> | undefined
    const click = (event: MouseEvent) => {
      if (!current.current.effects || document.hidden) return
      const target = event.target instanceof Element ? event.target.closest('button,a,summary') : null
      if (!target || target.closest('[data-sound-controls]') || target.matches(':disabled,[aria-disabled=true]')) return
      void sound.unlock().then(() => {
        if (document.hidden || engine.current !== sound) return
        sound.volumes(current.current.effectVolume, current.current.fireVolume, current.current.seaVolume)
        clearTimeout(clickTimer); clickTimer = setTimeout(() => sound.cue('select'), 50)
      }).catch(() => setError('Áudio indisponível neste dispositivo.'))
    }
    const unsubscribe = store.onResult(result => {
      const cue = cueFor(result)
      if (cue && current.current.effects && !document.hidden) { clearTimeout(clickTimer); sound.cue(cue) }
    })
    const hide = () => {
      if (document.hidden) {
        request.current++; clearTimeout(clickTimer); sound.suspend(); setFire(false); setSea(false); setBusy(false)
      }
    }
    document.addEventListener('click', click, true); document.addEventListener('visibilitychange', hide)
    return () => {
      request.current++; clearTimeout(clickTimer); unsubscribe()
      document.removeEventListener('click', click, true); document.removeEventListener('visibilitychange', hide)
      sound.dispose(); engine.current = null
    }
  }, [store])
  useEffect(() => {
    engine.current?.volumes(prefs.effects ? prefs.effectVolume : 0, prefs.fireVolume, prefs.seaVolume)
    try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* session preferences */ }
  }, [prefs])
  async function enable(kind: 'effects' | 'fire' | 'sea' | 'focus') {
    const sound = engine.current
    if (!sound || busy) return
    const token = ++request.current
    setBusy(true)
    try {
      await sound.unlock()
      if (token !== request.current || document.hidden || engine.current !== sound) return
      sound.volumes(prefs.effectVolume, prefs.fireVolume, prefs.seaVolume); setError('')
      if (kind === 'effects') { sound.volumes(prefs.effects ? 0 : prefs.effectVolume, prefs.fireVolume, prefs.seaVolume); setPrefs(p => ({ ...p, effects: !p.effects })); if (!prefs.effects) sound.cue('select') }
      else if (kind === 'fire') { if (fire) sound.stopFire(); else sound.startFire(); setFire(!fire) }
      else if (kind === 'sea') { if (sea) sound.stopSea(); else sound.startSea(); setSea(!sea) }
      else {
        setPrefs(p => ({ ...p, effects: false, fireVolume: 0.3, seaVolume: 0.22 }))
        sound.volumes(0, 0.3, 0.22); sound.startFire(); sound.startSea(); setFire(true); setSea(true)
      }
    } catch { if (token === request.current) setError('Não foi possível ativar o áudio neste dispositivo.') }
    finally { if (token === request.current) setBusy(false) }
  }
  function stop() {
    request.current++; engine.current?.stopFire(); engine.current?.stopSea(); setFire(false); setSea(false); setBusy(false)
  }
  return <fieldset className="sanctuary-body" data-sound-controls>
    <legend className="sanctuary-track">Refúgio à beira-mar</legend>
    <p className="sanctuary-note">Fogueira baixa e ondas lentas, inspiradas na atmosfera de Majula. Ajuste a mistura para acompanhar seu estudo.</p>
    <div className="sanctuary-controls">
      <button type="button" disabled={busy} onClick={() => void enable('focus')}>Foco: fogueira + mar</button>
      <button type="button" disabled={!fire && !sea && !busy} onClick={stop}>Pausar ambiente</button>
    </div>
    <div className="sanctuary-controls">
      <button type="button" disabled={busy} aria-pressed={fire} onClick={() => void enable('fire')}>{fire ? 'Apagar som da fogueira' : 'Ouvir fogueira'}</button>
      <button type="button" disabled={busy} aria-pressed={sea} onClick={() => void enable('sea')}>{sea ? 'Pausar mar' : 'Ouvir mar'}</button>
    </div>
    <label className="sanctuary-volume">Fogueira<input aria-label="Volume da fogueira" type="range" min="0" max="1" step="0.01" value={prefs.fireVolume} onChange={e => setPrefs(p => ({ ...p, fireVolume: +e.target.value }))} /></label>
    <label className="sanctuary-volume">Mar<input aria-label="Volume do mar" type="range" min="0" max="1" step="0.01" value={prefs.seaVolume} onChange={e => setPrefs(p => ({ ...p, seaVolume: +e.target.value }))} /></label>
    <div className="sanctuary-controls"><button type="button" disabled={busy} aria-pressed={prefs.effects} onClick={() => void enable('effects')}>{prefs.effects ? 'Desativar efeitos' : 'Ativar efeitos'}</button></div>
    <label className="sanctuary-volume">Efeitos<input aria-label="Volume dos efeitos" type="range" min="0" max="1" step="0.01" value={prefs.effectVolume} onChange={e => setPrefs(p => ({ ...p, effectVolume: +e.target.value }))} /></label>
    <p className="sanctuary-note">O preset Foco desativa os efeitos de menus e conquistas. Sons ambientes originais, sem música, com entrada e saída suaves. Funcionam offline e pausam ao ocultar a página. Seus volumes ficam salvos; a reprodução só começa ao ativar.</p>
    <p role="status" className="sanctuary-note">{error || (fire || sea ? `Ambiente ativo: ${[fire && 'fogueira', sea && 'mar'].filter(Boolean).join(' e ')}.` : 'Ambiente pausado.')}</p>
  </fieldset>
}
