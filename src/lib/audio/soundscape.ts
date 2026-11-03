import type { ApplyResult } from '@/lib/progress'
import { cueVoices, REVERB, type Cue } from './cues'
import { buildReverb, playVoice } from './render'
export { CUES, cueLength, cuePeak, cueVoices, menuCue, REVERB, type Cue, type Voice } from './cues'
export { reverbSamples } from './render'

/** Compras que entregam um objeto na mão soam como item; as demais, como moeda. */
const ITEMS = ['relic', 'room']

export function cueFor(result: ApplyResult): Cue | null {
  const events = result.events
  if (events.some(e => e.kind === 'challenge-miss' || e.kind === 'boss-miss')) return 'retry'
  if (!result.changed) return null
  // O chefe derrotado vem antes da medalha: é o acontecimento maior, e a medalha ainda aparece no aviso.
  if (events.some(e => e.kind === 'boss' && e.first)) return 'boss'
  if (events.some(e => e.kind === 'medal')) return 'medal'
  if (events.some(e => e.kind === 'purchase' && ITEMS.includes(e.item))) return 'item'
  if (events.some(e => e.kind === 'purchase' || e.kind === 'redeem')) return 'purchase'
  if (events.some(e => e.kind === 'xp' && e.amount > 0)) {
    if (events.some(e => e.kind === 'boss' || e.kind === 'mission' || e.kind === 'architect' || (e.kind === 'challenge' && e.phase === 'done'))) return 'victory'
    return 'xp'
  }
  return null
}

/** Procedural, offline ambience. Each layer has an independent volume and fade envelope. */
export type AmbienceKind = 'fire' | 'sea' | 'forest' | 'ice' | 'volcano' | 'spider'
const AMBIENCES: readonly AmbienceKind[] = ['fire', 'sea', 'forest', 'ice', 'volcano', 'spider']
type Layer = { source: AudioBufferSourceNode; envelope: GainNode; nodes: AudioNode[]; wave?: OscillatorNode }
export const audioLevel = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback

/** Noise beds are synthesized locally; no recordings or game soundtrack assets are included. */
export function ambienceSamples(kind: AmbienceKind, rate: number, seconds: number, random = Math.random) {
  const data = new Float32Array(Math.round(rate * seconds))
  let low = 0, crackle = 0, chirp = 0, chirpPhase = 0
  const edge = Math.max(1, Math.round(rate * 0.04))
  for (let i = 0; i < data.length; i++) {
    const white = random() * 2 - 1
    low = (low + white * 0.025) / 1.025
    if ((kind === 'fire' && random() < 1.8 / rate) || (kind === 'volcano' && random() < 2.8 / rate)) {
      crackle = (kind === 'volcano' ? 0.12 : 0.08) + random() * 0.12
    }
    crackle *= Math.exp(-1 / (rate * (kind === 'volcano' ? 0.045 : 0.018)))
    if (kind === 'forest' && random() < 1.2 / rate) { chirp = 0.018 + random() * 0.02; chirpPhase = 0 }
    const secondsIn = i / rate
    const taper = Math.min(1, i / edge, (data.length - 1 - i) / edge)
    let value: number
    if (kind === 'sea') value = low * 1.8
    else if (kind === 'fire') value = low * 1.05 + white * crackle
    else if (kind === 'forest') {
      chirpPhase += 2 * Math.PI * (1800 + Math.sin(secondsIn * 0.7) * 2200) / rate
      chirp *= Math.exp(-1 / (rate * 0.06))
      const leaves = white * 0.18 * (0.35 + Math.sin(secondsIn * 0.19) ** 2)
      value = low * 1.7 + leaves + Math.sin(chirpPhase) * chirp
    } else if (kind === 'ice') value = low * 2.2 + white * 0.12
    else if (kind === 'volcano') value = low * 2.6 + white * crackle
    else value = low * 1.6 + white * (random() < 0.0008 ? 0.08 : 0.025)
    data[i] = value * taper
  }
  return data
}

export class Soundscape {
  private ctx?: AudioContext
  private effects?: GainNode
  private tail?: GainNode
  private fireVolume?: GainNode
  private seaVolume?: GainNode
  private landscapeVolume?: GainNode
  private layers: Partial<Record<AmbienceKind, Layer>> = {}
  private fading = new Set<Layer>()
  private disposed = false
  private lastCue = 0
  async unlock() {
    if (this.disposed) return
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.effects = this.ctx.createGain(); this.effects.gain.value = 0.25; this.effects.connect(this.ctx.destination)
      this.tail = buildReverb(this.ctx, this.effects)
      this.fireVolume = this.ctx.createGain(); this.fireVolume.gain.value = 0.3; this.fireVolume.connect(this.ctx.destination)
      this.seaVolume = this.ctx.createGain(); this.seaVolume.gain.value = 0.22; this.seaVolume.connect(this.ctx.destination)
      this.landscapeVolume = this.ctx.createGain(); this.landscapeVolume.gain.value = 0.2; this.landscapeVolume.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
  }
  volumes(effects: number, fire: number, sea = 0.22, landscape = 0.2) {
    const at = this.ctx?.currentTime ?? 0
    for (const [node, level] of [[this.effects, effects], [this.fireVolume, fire], [this.seaVolume, sea], [this.landscapeVolume, landscape]] as const) {
      if (node) node.gain.setTargetAtTime(audioLevel(level), at, 0.12)
    }
  }
  cue(cue: Cue) {
    if (!this.ctx || this.ctx.state !== 'running' || !this.effects) return
    const now = this.ctx.currentTime
    if (now - this.lastCue < 0.09) return
    this.lastCue = now
    try {
      for (const v of cueVoices(cue)) playVoice(this.ctx, v, now + 0.01, this.effects, REVERB[cue] > 0 ? this.tail : undefined, REVERB[cue])
    } catch {
      // Sem áudio no aparelho: o progresso continua valendo, só não toca.
    }
  }
  private start(kind: AmbienceKind) {
    const ctx = this.ctx
    const destination = kind === 'fire' ? this.fireVolume : kind === 'sea' ? this.seaVolume : this.landscapeVolume
    if (!ctx || !destination || this.layers[kind] || this.disposed) return
    const seconds = kind === 'sea' ? 23 : kind === 'forest' ? 19 : 15
    const samples = ambienceSamples(kind, ctx.sampleRate, seconds)
    const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate)
    buffer.getChannelData(0).set(samples)
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), envelope = ctx.createGain(), swell = ctx.createGain()
    source.buffer = buffer; source.loop = true
    const cutoff: Record<AmbienceKind, number> = { fire: 1400, sea: 900, forest: 2800, ice: 620, volcano: 420, spider: 760 }
    filter.type = 'lowpass'; filter.frequency.value = cutoff[kind]; filter.Q.value = kind === 'forest' ? 0.3 : 0.5
    envelope.gain.value = 0
    source.connect(filter); filter.connect(swell); swell.connect(envelope); envelope.connect(destination)
    const layer: Layer = { source, envelope, nodes: [source, filter, swell, envelope] }
    if (kind !== 'fire') {
      const wave = ctx.createOscillator(), depth = ctx.createGain()
      const frequency: Record<Exclude<AmbienceKind, 'fire'>, number> = { sea: 0.075, forest: 0.11, ice: 0.035, volcano: 0.055, spider: 0.045 }
      const amount: Record<Exclude<AmbienceKind, 'fire'>, number> = { sea: 0.28, forest: 0.13, ice: 0.34, volcano: 0.2, spider: 0.18 }
      wave.frequency.value = frequency[kind]; depth.gain.value = amount[kind]; swell.gain.value = kind === 'sea' ? 0.65 : 0.8
      wave.connect(depth); depth.connect(swell.gain); wave.start()
      layer.wave = wave; layer.nodes.push(wave, depth)
    } else {
      swell.gain.value = 1
    }
    source.onended = () => { layer.nodes.forEach(node => node.disconnect()); this.fading.delete(layer) }
    source.start()
    envelope.gain.setTargetAtTime(1, ctx.currentTime, 0.8)
    this.layers[kind] = layer
  }
  startFire() { this.start('fire') }
  startSea() { this.start('sea') }
  startForest() { this.start('forest') }
  startIceMountain() { this.start('ice') }
  startVolcano() { this.start('volcano') }
  startSpiderDen() { this.start('spider') }
  private stop(kind: AmbienceKind, immediately = false) {
    const layer = this.layers[kind]
    if (!layer || !this.ctx) return
    delete this.layers[kind]
    const now = this.ctx.currentTime
    layer.envelope.gain.cancelScheduledValues(now)
    layer.envelope.gain.setTargetAtTime(0, now, 0.15)
    const end = immediately ? now : now + 0.8
    this.fading.add(layer)
    layer.source.stop(end); layer.wave?.stop(end)
    if (immediately) { layer.nodes.forEach(node => node.disconnect()); this.fading.delete(layer) }
  }
  stopFire() { this.stop('fire') }
  stopSea() { this.stop('sea') }
  stopForest() { this.stop('forest') }
  stopIceMountain() { this.stop('ice') }
  stopVolcano() { this.stop('volcano') }
  stopSpiderDen() { this.stop('spider') }
  private stopAll() {
    for (const kind of AMBIENCES) this.stop(kind, true)
    for (const layer of this.fading) { layer.source.stop(); layer.wave?.stop(); layer.nodes.forEach(node => node.disconnect()) }
    this.fading.clear()
  }
  suspend() { this.stopAll(); void this.ctx?.suspend().catch(() => {}) }
  dispose() { this.disposed = true; this.stopAll(); void this.ctx?.close().catch(() => {}); this.ctx = undefined }
}
