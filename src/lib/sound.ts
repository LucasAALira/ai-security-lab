/** Som opcional de conquista, gerado na hora com a Web Audio API (nenhum arquivo de áudio).
 *  Só toca quando a pessoa liga a opção, é curto e baixo, e nunca deve quebrar a página. */

type AudioCtor = typeof AudioContext

let context: AudioContext | null = null

function audioContext(): AudioContext | null {
  try {
    const Ctor: AudioCtor | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext
    if (!Ctor) return null
    context ??= new Ctor()
    return context
  } catch {
    return null
  }
}

/** Duas notas curtas e suaves (lá e mi agudos). Volume baixo de propósito. */
export function playUnlockChime(): void {
  const ctx = audioContext()
  if (!ctx) return
  try {
    if (ctx.state === 'suspended') void ctx.resume()
    const start = ctx.currentTime + 0.02
    ;[880, 1318.5].forEach((frequency, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const at = start + i * 0.13
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, at)
      gain.gain.exponentialRampToValueAtTime(0.05, at + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.32)
      osc.connect(gain).connect(ctx.destination)
      osc.start(at)
      osc.stop(at + 0.34)
    })
  } catch {
    // sem áudio disponível: a conquista continua valendo, só não toca
  }
}
