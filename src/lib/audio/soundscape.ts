import type { ApplyResult } from '@/lib/progress'
export type Cue = 'select' | 'xp' | 'victory' | 'medal' | 'purchase' | 'retry'
export function cueFor(result: ApplyResult): Cue | null {
  const events = result.events
  if (events.some(e => e.kind === 'challenge-miss' || e.kind === 'boss-miss')) return 'retry'
  if (!result.changed) return null
  if (events.some(e => e.kind === 'medal')) return 'medal'
  if (events.some(e => e.kind === 'purchase' || e.kind === 'redeem')) return 'purchase'
  if (events.some(e => e.kind === 'xp' && e.amount > 0)) {
    if (events.some(e => e.kind === 'boss' || e.kind === 'mission' || e.kind === 'architect' || (e.kind === 'challenge' && e.phase === 'done'))) return 'victory'
    return 'xp'
  }
  return null
}

/** Procedural, offline ambience. Each layer has an independent volume and fade envelope. */
type Layer = { source: AudioBufferSourceNode; envelope: GainNode; nodes: AudioNode[]; wave?: OscillatorNode }
export const audioLevel = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback

/** Low-pass noise with a short edge taper avoids clicks at buffer wrap. No tonal crackle. */
export function ambienceSamples(kind: 'fire' | 'sea', rate: number, seconds: number, random = Math.random) {
  const data = new Float32Array(Math.round(rate * seconds))
  let low = 0, crackle = 0
  const edge = Math.max(1, Math.round(rate * 0.03))
  for (let i = 0; i < data.length; i++) {
    const white = random() * 2 - 1
    low = (low + white * 0.025) / 1.025
    if (kind === 'fire') {
      if (random() < 1.8 / rate) crackle = 0.08 + random() * 0.12
      crackle *= Math.exp(-1 / (rate * 0.018))
    }
    const taper = Math.min(1, i / edge, (data.length - 1 - i) / edge)
    data[i] = (low * (kind === 'sea' ? 1.8 : 1.1) + white * crackle) * taper
  }
  return data
}

export class Soundscape {
  private ctx?: AudioContext
  private effects?: GainNode
  private fireVolume?: GainNode
  private seaVolume?: GainNode
  private layers: Partial<Record<'fire' | 'sea', Layer>> = {}
  private fading = new Set<Layer>()
  private disposed = false
  private lastCue = 0
  async unlock() {
    if (this.disposed) return
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.effects = this.ctx.createGain(); this.effects.gain.value = 0.25; this.effects.connect(this.ctx.destination)
      this.fireVolume = this.ctx.createGain(); this.fireVolume.gain.value = 0.3; this.fireVolume.connect(this.ctx.destination)
      this.seaVolume = this.ctx.createGain(); this.seaVolume.gain.value = 0.22; this.seaVolume.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
  }
  volumes(effects: number, fire: number, sea = 0.22) {
    const at = this.ctx?.currentTime ?? 0
    for (const [node, level] of [[this.effects, effects], [this.fireVolume, fire], [this.seaVolume, sea]] as const) {
      if (node) node.gain.setTargetAtTime(audioLevel(level), at, 0.12)
    }
  }
  private tone(hz: number, at: number, length: number, volume: number, destination: AudioNode, type: OscillatorType = 'sine') {
    const ctx = this.ctx!
    const osc = ctx.createOscillator(), gain = ctx.createGain()
    osc.type = type; osc.frequency.setValueAtTime(hz, at)
    gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(volume, at + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, at + length)
    osc.connect(gain); gain.connect(destination); osc.start(at); osc.stop(at + length + 0.02)
    osc.onended = () => { osc.disconnect(); gain.disconnect() }
  }
  cue(cue: Cue) {
    if (!this.ctx || this.ctx.state !== 'running' || !this.effects) return
    const now = this.ctx.currentTime
    if (now - this.lastCue < 0.09) return
    this.lastCue = now
    const notes: Record<Cue, number[]> = { select: [230], xp: [440, 660], victory: [196, 294, 392], medal: [220, 330, 440, 660], purchase: [880, 1100], retry: [130, 110] }
    notes[cue].forEach((hz, i) => this.tone(hz, now + i * 0.1, cue === 'select' ? 0.09 : cue === 'medal' || cue === 'victory' ? 1.3 : 0.35, 0.13, this.effects!, cue === 'select' ? 'triangle' : 'sine'))
  }
  private start(kind: 'fire' | 'sea') {
    const ctx = this.ctx, destination = kind === 'fire' ? this.fireVolume : this.seaVolume
    if (!ctx || !destination || this.layers[kind] || this.disposed) return
    const samples = ambienceSamples(kind, ctx.sampleRate, kind === 'fire' ? 13 : 23)
    const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate)
    buffer.getChannelData(0).set(samples)
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), envelope = ctx.createGain(), swell = ctx.createGain()
    source.buffer = buffer; source.loop = true
    filter.type = 'lowpass'; filter.frequency.value = kind === 'fire' ? 1400 : 1100; filter.Q.value = 0.5
    envelope.gain.value = 0
    source.connect(filter); filter.connect(swell); swell.connect(envelope); envelope.connect(destination)
    const layer: Layer = { source, envelope, nodes: [source, filter, swell, envelope] }
    if (kind === 'sea') {
      const wave = ctx.createOscillator(), depth = ctx.createGain()
      wave.frequency.value = 0.075; depth.gain.value = 0.28; swell.gain.value = 0.65
      wave.connect(depth); depth.connect(swell.gain); wave.start()
      layer.wave = wave; layer.nodes.push(wave, depth)
    }
    source.onended = () => { layer.nodes.forEach(node => node.disconnect()); this.fading.delete(layer) }
    source.start()
    envelope.gain.setTargetAtTime(1, ctx.currentTime, 0.8)
    this.layers[kind] = layer
  }
  startFire() { this.start('fire') }
  startSea() { this.start('sea') }
  private stop(kind: 'fire' | 'sea', immediately = false) {
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
  private stopAll() {
    this.stop('fire', true); this.stop('sea', true)
    for (const layer of this.fading) { layer.source.stop(); layer.wave?.stop(); layer.nodes.forEach(node => node.disconnect()) }
    this.fading.clear()
  }
  suspend() { this.stopAll(); void this.ctx?.suspend().catch(() => {}) }
  dispose() { this.disposed = true; this.stopAll(); void this.ctx?.close().catch(() => {}); this.ctx = undefined }
}
