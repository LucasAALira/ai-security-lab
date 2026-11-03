import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@/state/ProgressProvider'
import { audioLevel, cueFor, menuCue, Soundscape } from '@/lib/audio/soundscape'
const KEY = 'asl-soundscape'
type Landscape = 'forest' | 'ice' | 'volcano' | 'spider'
function initial() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return {
      effects: p?.effects === true,
      effectVolume: audioLevel(p?.effectVolume, 0.25),
      fireVolume: audioLevel(p?.fireVolume, 0.3),
      seaVolume: audioLevel(p?.seaVolume, 0.22),
      landscapeVolume: audioLevel(p?.landscapeVolume, 0.2),
    }
  } catch {
    return { effects: false, effectVolume: 0.25, fireVolume: 0.3, seaVolume: 0.22, landscapeVolume: 0.2 }
  }
}
const sceneMethods = {
  forest: { start: (s: Soundscape) => s.startForest(), stop: (s: Soundscape) => s.stopForest() },
  ice: { start: (s: Soundscape) => s.startIceMountain(), stop: (s: Soundscape) => s.stopIceMountain() },
  volcano: { start: (s: Soundscape) => s.startVolcano(), stop: (s: Soundscape) => s.stopVolcano() },
  spider: { start: (s: Soundscape) => s.startSpiderDen(), stop: (s: Soundscape) => s.stopSpiderDen() },
} satisfies Record<Landscape, { start: (s: Soundscape) => void; stop: (s: Soundscape) => void }>

export function SanctuarySounds() {
  const { store } = useProgress()
  const [prefs, setPrefs] = useState(initial)
  const [fire, setFire] = useState(false)
  const [sea, setSea] = useState(false)
  const [landscape, setLandscape] = useState<Landscape | null>(null)
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
        sound.volumes(current.current.effectVolume, current.current.fireVolume, current.current.seaVolume, current.current.landscapeVolume)
        clearTimeout(clickTimer); clickTimer = setTimeout(() => sound.cue(menuCue(target)), 50)
      }).catch(() => setError('Áudio indisponível neste dispositivo.'))
    }
    const unsubscribe = store.onResult(result => {
      const cue = cueFor(result)
      if (cue && current.current.effects && !document.hidden) { clearTimeout(clickTimer); sound.cue(cue) }
    })
    const hide = () => {
      if (document.hidden) {
        request.current++; clearTimeout(clickTimer); sound.suspend(); setFire(false); setSea(false); setLandscape(null); setBusy(false)
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
    engine.current?.volumes(prefs.effects ? prefs.effectVolume : 0, prefs.fireVolume, prefs.seaVolume, prefs.landscapeVolume)
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
      sound.volumes(prefs.effectVolume, prefs.fireVolume, prefs.seaVolume, prefs.landscapeVolume); setError('')
      if (kind === 'effects') {
        sound.volumes(prefs.effects ? 0 : prefs.effectVolume, prefs.fireVolume, prefs.seaVolume, prefs.landscapeVolume)
        setPrefs(p => ({ ...p, effects: !p.effects }))
        if (!prefs.effects) sound.cue('select')
      } else if (kind === 'fire') {
        if (fire) sound.stopFire(); else sound.startFire()
        setFire(!fire)
      } else if (kind === 'sea') {
        if (sea) sound.stopSea(); else sound.startSea()
        setSea(!sea)
      } else {
        if (landscape) sceneMethods[landscape].stop(sound)
        setLandscape(null)
        setPrefs(p => ({ ...p, effects: false, fireVolume: 0.3, seaVolume: 0.22 }))
        sound.volumes(0, 0.3, 0.22, prefs.landscapeVolume)
        sound.startFire(); sound.startSea(); setFire(true); setSea(true)
      }
    } catch { if (token === request.current) setError('Não foi possível ativar o áudio neste dispositivo.') }
    finally { if (token === request.current) setBusy(false) }
  }
  async function toggleLandscape(next: Landscape) {
    const sound = engine.current
    if (!sound || busy) return
    const token = ++request.current
    setBusy(true)
    try {
      await sound.unlock()
      if (token !== request.current || document.hidden || engine.current !== sound) return
      sound.volumes(prefs.effectVolume, prefs.fireVolume, prefs.seaVolume, prefs.landscapeVolume)
      setError('')
      if (landscape === next) {
        sceneMethods[next].stop(sound)
        setLandscape(null)
      } else {
        if (landscape) sceneMethods[landscape].stop(sound)
        sceneMethods[next].start(sound)
        setLandscape(next)
      }
    } catch { if (token === request.current) setError('Não foi possível ativar o áudio neste dispositivo.') }
    finally { if (token === request.current) setBusy(false) }
  }
  function stop() {
    request.current++; engine.current?.stopFire(); engine.current?.stopSea()
    if (landscape && engine.current) sceneMethods[landscape].stop(engine.current)
    setFire(false); setSea(false); setLandscape(null); setBusy(false)
  }
  const landscapeName = landscape === 'forest' ? 'floresta' : landscape === 'ice' ? 'montanha gelada' : landscape === 'volcano' ? 'vulcão' : landscape === 'spider' ? 'toca da aranha' : null
  return <fieldset className="sanctuary-body" data-sound-controls>
    <legend className="sanctuary-track">Refúgio à beira-mar</legend>
    <p className="sanctuary-note">Fogueira baixa e ondas lentas, inspiradas na atmosfera de um refúgio costeiro. Ajuste a mistura para acompanhar seu estudo.</p>
    <div className="sanctuary-controls">
      <button type="button" disabled={busy} onClick={() => void enable('focus')}>Foco: fogueira + mar</button>
      <button type="button" disabled={!fire && !sea && !landscape && !busy} onClick={stop}>Pausar ambiente</button>
    </div>
    <div className="sanctuary-controls">
      <button type="button" disabled={busy} aria-pressed={fire} onClick={() => void enable('fire')}>{fire ? 'Apagar som da fogueira' : 'Ouvir fogueira'}</button>
      <button type="button" disabled={busy} aria-pressed={sea} onClick={() => void enable('sea')}>{sea ? 'Pausar mar' : 'Ouvir mar'}</button>
    </div>
    <label className="sanctuary-volume">Fogueira<input aria-label="Volume da fogueira" type="range" min="0" max="1" step="0.01" value={prefs.fireVolume} onChange={e => setPrefs(p => ({ ...p, fireVolume: +e.target.value }))} /></label>
    <label className="sanctuary-volume">Mar<input aria-label="Volume do mar" type="range" min="0" max="1" step="0.01" value={prefs.seaVolume} onChange={e => setPrefs(p => ({ ...p, seaVolume: +e.target.value }))} /></label>
    <h3 className="mt-6 mb-2 text-sm font-semibold">Outras paisagens sonoras</h3>
    <p className="sanctuary-note">Sons ambientes originais, gerados no aparelho: vento entre árvores, rajadas de altitude, atividade vulcânica e uma caverna tomada por aranhas.</p>
    <div className="sanctuary-controls">
      <button type="button" disabled={busy} aria-pressed={landscape === 'forest'} onClick={() => void toggleLandscape('forest')}>{landscape === 'forest' ? 'Pausar floresta' : 'Ouvir floresta'}</button>
      <button type="button" disabled={busy} aria-pressed={landscape === 'ice'} onClick={() => void toggleLandscape('ice')}>{landscape === 'ice' ? 'Pausar montanha gelada' : 'Ouvir montanha gelada'}</button>
      <button type="button" disabled={busy} aria-pressed={landscape === 'volcano'} onClick={() => void toggleLandscape('volcano')}>{landscape === 'volcano' ? 'Pausar vulcão' : 'Ouvir vulcão'}</button>
      <button type="button" disabled={busy} aria-pressed={landscape === 'spider'} onClick={() => void toggleLandscape('spider')}>{landscape === 'spider' ? 'Pausar toca da aranha' : 'Ouvir toca da aranha'}</button>
    </div>
    <label className="sanctuary-volume">Volume das paisagens<input aria-label="Volume das paisagens" type="range" min="0" max="1" step="0.01" value={prefs.landscapeVolume} onChange={e => setPrefs(p => ({ ...p, landscapeVolume: +e.target.value }))} /></label>
    <div className="sanctuary-controls"><button type="button" disabled={busy} aria-pressed={prefs.effects} onClick={() => void enable('effects')}>{prefs.effects ? 'Desativar efeitos' : 'Ativar efeitos'}</button></div>
    <label className="sanctuary-volume">Efeitos<input aria-label="Volume dos efeitos" type="range" min="0" max="1" step="0.01" value={prefs.effectVolume} onChange={e => setPrefs(p => ({ ...p, effectVolume: +e.target.value }))} /></label>
    <p className="sanctuary-note">Com os efeitos ligados, cada ação tem seu toque: menus e botões de voltar, item guardado, compra, conquista e a fanfarra de chefe derrotado. O preset Foco desativa esses efeitos. Os ambientes são sintetizados pelo próprio site, sem arquivos de trilha de terceiros. Funcionam offline, pausam ao ocultar a página e só começam quando você ativa.</p>
    <p role="status" className="sanctuary-note">{error || (fire || sea || landscapeName ? `Ambiente ativo: ${[fire && 'fogueira', sea && 'mar', landscapeName].filter(Boolean).join(' e ')}.` : 'Ambiente pausado.')}</p>
  </fieldset>
}
