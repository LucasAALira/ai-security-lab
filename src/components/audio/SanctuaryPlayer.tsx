import { useEffect, useRef, useState } from 'react'
import { Flame, Music2, Pause, Play, Repeat2, Trash2, Upload, Volume2 } from 'lucide-react'
import { checkDecodable, trackStorage, validateTrack, type LocalTrack } from '@/lib/audio/local-track'
import './sanctuary-player.css'

const PREFS = 'ai-security-lab-music-settings'
function preferences() {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS) ?? '{}')
    return { volume: typeof p.volume === 'number' && Number.isFinite(p.volume) ? Math.max(0, Math.min(1, p.volume)) : 0.25, loop: typeof p.loop === 'boolean' ? p.loop : true }
  } catch { return { volume: 0.25, loop: true } }
}

/** Mounted outside keyed page transitions so navigation does not restart the track. */
export function SanctuaryPlayer() {
  const audio = useRef<HTMLAudioElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const alive = useRef(true)
  const [track, setTrack] = useState<LocalTrack>()
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [settings, setSettings] = useState(preferences)
  const [message, setMessage] = useState('Sua música fica somente neste dispositivo. Nenhuma faixa incluída.')

  useEffect(() => {
    alive.current = true
    let cancelled = false
    void trackStorage('read').then(saved => {
      if (!cancelled && saved?.blob instanceof Blob && typeof saved.name === 'string') setTrack(saved)
    }).catch(() => { if (!cancelled) setMessage('Armazenamento indisponível. Você ainda pode ouvir uma música nesta sessão.') })
      .finally(() => { if (!cancelled) setReady(true) })
    return () => { cancelled = true; alive.current = false }
  }, [])

  useEffect(() => {
    const el = audio.current
    if (!el || !track) return
    const url = URL.createObjectURL(track.blob)
    el.src = url
    setPlaying(false)
    return () => { el.pause(); el.removeAttribute('src'); el.load(); URL.revokeObjectURL(url) }
  }, [track])

  useEffect(() => {
    if (audio.current) { audio.current.volume = settings.volume; audio.current.loop = settings.loop }
    try { localStorage.setItem(PREFS, JSON.stringify(settings)) } catch { /* Playback still works in memory. */ }
  }, [settings])

  useEffect(() => {
    const hide = () => { if (document.hidden) audio.current?.pause() }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [])

  async function select(file?: File) {
    if (!file || busy) return
    const error = validateTrack(file)
    if (error) { setMessage(error); return }
    setBusy(true)
    try {
      await checkDecodable(file)
      const next = { name: file.name, blob: file }
      let saved = true
      try { await trackStorage('write', next) } catch { saved = false }
      if (!alive.current) return
      setTrack(next)
      setMessage(saved ? 'Música salva neste dispositivo. Pressione Reproduzir para ouvir.' : 'Música disponível nesta sessão; não foi possível salvá-la. A faixa salva anteriormente pode reaparecer ao reabrir.')
    } catch (error) {
      if (alive.current) setMessage(error instanceof Error ? error.message : 'Não foi possível abrir a música.')
    } finally { if (alive.current) setBusy(false) }
  }

  async function toggle() {
    const el = audio.current
    if (!el || !track) return
    if (!el.paused) { el.pause(); return }
    try { await el.play() } catch { setMessage('A reprodução não iniciou. Toque novamente ou escolha outro arquivo de áudio.'); setPlaying(false) }
  }

  async function remove() {
    setBusy(true)
    audio.current?.pause()
    try {
      await trackStorage('delete')
      if (alive.current) { setTrack(undefined); setPlaying(false); setMessage('Música removida do player e do armazenamento local.') }
    } catch { if (alive.current) setMessage('Não foi possível remover a cópia salva. Tente novamente.') }
    finally { if (alive.current) setBusy(false) }
  }

  return (
    <details className="sanctuary-player" data-playing={playing}>
      <summary><Flame aria-hidden="true" className="sanctuary-flame" /><span>Sons do Santuário</span><span className="sanctuary-state">{playing ? 'Tocando' : 'Em silêncio'}</span></summary>
      <div className="sanctuary-body">
        <p className="sanctuary-track"><Music2 size={18} aria-hidden="true" /><span>{track?.name ?? 'Escolha a música do seu refúgio'}</span></p>
        <div className="sanctuary-controls">
          <button type="button" onClick={() => void toggle()} disabled={!track || busy} aria-label={playing ? 'Pausar música' : 'Reproduzir música'}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}{playing ? 'Pausar' : 'Reproduzir'}</button>
          <button type="button" aria-pressed={settings.loop} onClick={() => setSettings(s => ({ ...s, loop: !s.loop }))}><Repeat2 aria-hidden="true" />Repetir</button>
          <button type="button" disabled={!ready || busy} onClick={() => input.current?.click()}><Upload aria-hidden="true" />{busy ? 'Aguarde…' : 'Carregar minha música'}</button>
          <button type="button" disabled={!track || busy} onClick={() => void remove()}><Trash2 aria-hidden="true" />Remover</button>
        </div>
        <label className="sanctuary-volume"><Volume2 size={18} aria-hidden="true" />Volume <input aria-label="Volume da música" type="range" min="0" max="1" step="0.01" value={settings.volume} onChange={e => setSettings(s => ({ ...s, volume: Number(e.target.value) }))} /><span>{Math.round(settings.volume * 100)}%</span></label>
        <p role="status" className="sanctuary-note">{message}</p>
        <p className="sanctuary-note">MP3, M4A ou outro áudio compatível · até 30 MB. Não entra no backup de estudos. Ao sair do app, a música pausa.</p>
        <input ref={input} type="file" accept="audio/*,.mp3,.m4a,.ogg,.wav,.flac,.aac,.opus" hidden aria-label="Selecionar música local" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; void select(file) }} />
        <audio ref={audio} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { if (track) { setPlaying(false); setMessage('Não foi possível reproduzir este arquivo. Carregue uma versão compatível, como MP3.') } }} />
      </div>
    </details>
  )
}
