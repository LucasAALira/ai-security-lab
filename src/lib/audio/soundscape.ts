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

/** Original procedural sounds: no external media, samples, network or game assets. */
export class Soundscape {
  private ctx?: AudioContext
  private effects?: GainNode
  private ambience?: GainNode
  private fire?: AudioBufferSourceNode
  private timer?: ReturnType<typeof setInterval>
  private lastCue = 0
  async unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.effects = this.ctx.createGain(); this.effects.gain.value = 0.25; this.effects.connect(this.ctx.destination)
      this.ambience = this.ctx.createGain(); this.ambience.gain.value = 0.15; this.ambience.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
  }
  volumes(effects: number, ambience: number) {
    if (this.effects) this.effects.gain.value = effects
    if (this.ambience) this.ambience.gain.value = ambience
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
  startFire() {
    if (!this.ctx || !this.ambience || this.fire) return
    const ctx = this.ctx, buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), data = buffer.getChannelData(0)
    let brown = 0
    for (let i = 0; i < data.length; i++) { brown = (brown + (Math.random() * 2 - 1) * 0.02) / 1.02; data[i] = brown * 0.45 }
    const source = ctx.createBufferSource(); source.buffer = buffer; source.loop = true; source.connect(this.ambience); source.start(); this.fire = source
    this.timer = setInterval(() => {
      if (ctx.state === 'running') this.tone(250 + Math.random() * 950, ctx.currentTime, 0.04 + Math.random() * 0.07, 0.04, this.ambience!, 'triangle')
    }, 650)
  }
  stopFire() { if (this.timer) clearInterval(this.timer); this.timer = undefined; this.fire?.stop(); this.fire?.disconnect(); this.fire = undefined }
  suspend() { this.stopFire(); void this.ctx?.suspend() }
  dispose() { this.stopFire(); void this.ctx?.close(); this.ctx = undefined }
}
