/** Síntese das vozes na Web Audio API. Fica separada da composição (`cues.ts`) e do motor
 *  (`soundscape.ts`) porque só precisa de um contexto de áudio qualquer: o do navegador, quando a
 *  pessoa liga os efeitos, ou um contexto offline, quando se quer gerar os sons em arquivo para
 *  conferir. Nenhuma gravação é usada: tudo nasce de osciladores e ruído gerados aqui. */

import type { Voice } from './cues'

/** Qualquer contexto de áudio que saiba criar os nós usados aqui (online ou offline). */
export type AudioLike = Pick<
  BaseAudioContext,
  'sampleRate' | 'createGain' | 'createOscillator' | 'createBiquadFilter' | 'createBufferSource' | 'createBuffer' | 'currentTime'
> & { createConvolver?: BaseAudioContext['createConvolver'] }

/** Resposta de uma nave de pedra: ruído que decai em exponencial, gerado uma vez por sessão.
 *  Nenhuma sala gravada — é a mesma ideia da ambiência, com decaimento mais curto. */
export function reverbSamples(rate: number, seconds: number, random = Math.random) {
  const tamanho = Math.max(1, Math.round(rate * seconds))
  const data = new Float32Array(tamanho)
  for (let i = 0; i < tamanho; i++) {
    const t = i / tamanho
    // O começo é mais escuro: as primeiras reflexões entram pouco depois do som direto.
    const entrada = Math.min(1, i / (rate * 0.012))
    data[i] = (random() * 2 - 1) * Math.pow(1 - t, 2.6) * entrada
  }
  return data
}

/** Envio para a cauda de reverberação. Sem suporte a convolução, as vozes seguem secas. */
export function buildReverb(ctx: AudioLike, destination: AudioNode, seconds = 2.2): GainNode | undefined {
  try {
    if (typeof ctx.createConvolver !== 'function') return undefined
    const esquerda = reverbSamples(ctx.sampleRate, seconds)
    const direita = reverbSamples(ctx.sampleRate, seconds)
    const buffer = ctx.createBuffer(2, esquerda.length, ctx.sampleRate)
    buffer.getChannelData(0).set(esquerda)
    // O segundo canal é outro sorteio: a cauda abre em estéreo em vez de ficar colada no centro.
    buffer.getChannelData(1).set(direita)
    const convolver = ctx.createConvolver()
    convolver.buffer = buffer
    const envio = ctx.createGain()
    envio.gain.value = 1
    envio.connect(convolver)
    convolver.connect(destination)
    return envio
  } catch {
    return undefined
  }
}

/** Parciais do sino: razão, peso e quanto da duração cada um ocupa. São inarmônicos de propósito,
 *  que é o que faz o metal percutido soar como sino e não como flauta. */
const PARCIAIS = [
  [1, 1, 1],
  [2.76, 0.5, 0.7],
  [5.4, 0.25, 0.45],
] as const

/** Toca uma voz. `now` é o instante do disparo; `wet` é quanto vai para a cauda. */
export function playVoice(ctx: AudioLike, v: Voice, now: number, dry: AudioNode, tail?: AudioNode, wet = 0): void {
  const at = now + v.at
  const saida = ctx.createGain()
  const ataque = Math.min(0.02, v.length / 3)
  saida.gain.setValueAtTime(0, at)
  saida.gain.linearRampToValueAtTime(v.volume, at + ataque)
  /* Queda em dois estágios. Uma exponencial única até o silêncio some na metade da nota: o sino
     fica inaudível muito antes de acabar. Caindo primeiro a um quinto do volume e só depois ao
     silêncio, a nota longa continua soando até o fim, como um sino de verdade. */
  saida.gain.exponentialRampToValueAtTime(Math.max(0.0002, v.volume * 0.2), at + ataque + (v.length - ataque) * 0.5)
  saida.gain.exponentialRampToValueAtTime(0.0001, at + v.length)
  saida.connect(dry)
  if (tail && wet > 0) {
    const envio = ctx.createGain()
    envio.gain.value = wet
    saida.connect(envio)
    envio.connect(tail)
  }

  const fontes: AudioScheduledSourceNode[] = []
  if (v.kind === 'noise') {
    const amostras = Math.max(1, Math.round(ctx.sampleRate * v.length))
    const buffer = ctx.createBuffer(1, amostras, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < amostras; i++) data[i] = Math.random() * 2 - 1
    const fonte = ctx.createBufferSource()
    fonte.buffer = buffer
    const filtro = ctx.createBiquadFilter()
    filtro.type = v.filter
    filtro.frequency.value = v.hz
    filtro.Q.value = v.q
    fonte.connect(filtro)
    filtro.connect(saida)
    fontes.push(fonte)
  } else if (v.kind === 'bell') {
    for (const [razao, peso, cauda] of PARCIAIS) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = v.hz * razao
      const parcial = ctx.createGain()
      parcial.gain.setValueAtTime(peso, at)
      /* O parcial só perde peso em relação à fundamental (os agudos somem antes); quem leva a
         nota ao silêncio é o envelope da saída. Levar os dois a zero junto mata o sino cedo. */
      parcial.gain.exponentialRampToValueAtTime(peso * 0.05, at + v.length * cauda)
      osc.connect(parcial)
      parcial.connect(saida)
      fontes.push(osc)
    }
  } else {
    const osc = ctx.createOscillator()
    osc.type = v.wave
    osc.frequency.setValueAtTime(v.hz, at)
    if (v.glide !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, v.glide), at + v.length)
    if (v.detune !== undefined) osc.detune.setValueAtTime(v.detune, at)
    osc.connect(saida)
    fontes.push(osc)
  }

  const fim = at + v.length + 0.05
  for (const fonte of fontes) {
    fonte.start(at)
    fonte.stop(fim)
  }
  const ultima = fontes.at(-1)
  if (ultima) ultima.onended = () => saida.disconnect()
}
