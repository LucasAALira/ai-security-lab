import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@/state/ProgressProvider'
import { cueFor, Soundscape } from '@/lib/audio/soundscape'
const KEY = 'asl-soundscape'
function initial() {
  try { const p = JSON.parse(localStorage.getItem(KEY) ?? '{}'); return { effects: p.effects === true, effectVolume: typeof p.effectVolume === 'number' ? Math.max(0, Math.min(1, p.effectVolume)) : 0.25, fireVolume: typeof p.fireVolume === 'number' ? Math.max(0, Math.min(1, p.fireVolume)) : 0.15 } }
  catch { return { effects: false, effectVolume: 0.25, fireVolume: 0.15 } }
}
export function SanctuarySounds() {
  const { store } = useProgress()
  const [prefs, setPrefs] = useState(initial)
  const [fire, setFire] = useState(false)
  const [error, setError] = useState('')
  const engine = useRef<Soundscape | null>(null)
  const current = useRef(prefs); current.current = prefs
  useEffect(() => {
    const sound = new Soundscape(); engine.current = sound
    let clickTimer: ReturnType<typeof setTimeout> | undefined
    const click = (event: MouseEvent) => {
      if (!current.current.effects || document.hidden) return
      const target = event.target instanceof Element ? event.target.closest('button,a,summary') : null
      if (!target || target.closest('[data-sound-controls]') || target.matches(':disabled,[aria-disabled=true]')) return
      void sound.unlock().then(() => sound.volumes(current.current.effectVolume, current.current.fireVolume)).catch(() => setError('Áudio indisponível neste dispositivo.'))
      clearTimeout(clickTimer); clickTimer = setTimeout(() => sound.cue('select'), 50)
    }
    const unsubscribe = store.onResult(result => {
      const cue = cueFor(result)
      if (cue && current.current.effects && !document.hidden) { clearTimeout(clickTimer); sound.cue(cue) }
    })
    const hide = () => { if (document.hidden) { clearTimeout(clickTimer); sound.suspend(); setFire(false) } }
    document.addEventListener('click', click, true); document.addEventListener('visibilitychange', hide)
    return () => { clearTimeout(clickTimer); unsubscribe(); document.removeEventListener('click', click, true); document.removeEventListener('visibilitychange', hide); sound.dispose(); engine.current = null }
  }, [store])
  useEffect(() => { engine.current?.volumes(prefs.effectVolume, prefs.fireVolume); try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* session preferences */ } }, [prefs])
  async function enable(kind: 'effects' | 'fire') {
    try {
      await engine.current?.unlock(); engine.current?.volumes(prefs.effectVolume, prefs.fireVolume); setError('')
      if (kind === 'effects') { setPrefs(p => ({ ...p, effects: !p.effects })); if (!prefs.effects) engine.current?.cue('select') }
      else { if (fire) engine.current?.stopFire(); else engine.current?.startFire(); setFire(!fire) }
    } catch { setError('Não foi possível ativar o áudio neste dispositivo.') }
  }
  return <fieldset className="sanctuary-body" data-sound-controls>
    <legend className="sanctuary-track">Ambiente e efeitos</legend>
    <div className="sanctuary-controls">
      <button type="button" aria-pressed={prefs.effects} onClick={() => void enable('effects')}>{prefs.effects ? 'Desativar efeitos' : 'Ativar efeitos'}</button>
      <button type="button" aria-pressed={fire} onClick={() => void enable('fire')}>{fire ? 'Apagar som da fogueira' : 'Ouvir fogueira'}</button>
    </div>
    <label className="sanctuary-volume">Efeitos<input aria-label="Volume dos efeitos" type="range" min="0" max="1" step="0.01" value={prefs.effectVolume} onChange={e => setPrefs(p => ({ ...p, effectVolume: +e.target.value }))} /></label>
    <label className="sanctuary-volume">Ambiente<input aria-label="Volume da fogueira" type="range" min="0" max="1" step="0.01" value={prefs.fireVolume} onChange={e => setPrefs(p => ({ ...p, fireVolume: +e.target.value }))} /></label>
    <p className="sanctuary-note">Sons originais de menus, XP, compras e conquistas. A fogueira precisa ser ativada a cada visita e pausa ao sair do app.</p>
    <p role="status" className="sanctuary-note">{error}</p>
  </fieldset>
}
