/** Composição dos efeitos do santuário: cada toque é descrito aqui como uma lista de vozes, e o
 *  `Soundscape` apenas realiza essa descrição na Web Audio API. Separar as duas coisas deixa a
 *  composição testável sem áudio de verdade e mantém o motor pequeno.
 *
 *  Tudo é sintetizado na hora, nota por nota: não há nenhum arquivo de áudio no projeto e nada
 *  foi extraído, amostrado ou imitado de trilhas de jogos. A atmosfera (sino grave, impacto e
 *  vozes em acorde menor) é do gênero soulslike; a composição é original e feita para este site. */

export type Cue = 'select' | 'back' | 'xp' | 'victory' | 'boss' | 'medal' | 'item' | 'purchase' | 'retry'

export const CUES: readonly Cue[] = ['select', 'back', 'xp', 'victory', 'boss', 'medal', 'item', 'purchase', 'retry']

/** Uma voz do toque. `at` é o atraso em segundos a partir do disparo. */
export type Voice =
  /** Oscilador simples; `glide` leva a frequência até esse valor ao longo da nota. */
  | { kind: 'tone'; hz: number; at: number; length: number; volume: number; wave: OscillatorType; glide?: number; detune?: number }
  /** Sino: parciais inarmônicos (1, 2.76 e 5.40 vezes a fundamental), como em metal percutido. */
  | { kind: 'bell'; hz: number; at: number; length: number; volume: number }
  /** Ruído filtrado: impacto, sopro de brasa ou tinido de metal. */
  | { kind: 'noise'; at: number; length: number; volume: number; filter: BiquadFilterType; hz: number; q: number }

/** Quanto de cada toque vai para a cauda de reverberação (0 a 1). A nave de pedra responde mais
 *  ao que é grave e solene e quase nada ao clique de menu, que precisa soar seco e imediato. */
export const REVERB: Record<Cue, number> = {
  select: 0.05,
  back: 0.08,
  xp: 0.18,
  victory: 0.4,
  boss: 0.6,
  medal: 0.5,
  item: 0.25,
  purchase: 0.22,
  retry: 0.12,
}

const tone = (hz: number, at: number, length: number, volume: number, wave: OscillatorType = 'sine', extra: { glide?: number; detune?: number } = {}): Voice => ({
  kind: 'tone',
  hz,
  at,
  length,
  volume,
  wave,
  ...extra,
})
const bell = (hz: number, at: number, length: number, volume: number): Voice => ({ kind: 'bell', hz, at, length, volume })
const noise = (at: number, length: number, volume: number, filter: BiquadFilterType, hz: number, q: number): Voice => ({ kind: 'noise', at, length, volume, filter, hz, q })

/** Acorde de lá menor em três oitavas, com as vozes levemente desafinadas entre si: é o que dá o
 *  peso de coral sem nenhuma voz gravada. */
const CHOIR = [110, 130.81, 164.81, 220, 261.63, 329.63]

const VOICES: Record<Cue, Voice[]> = {
  // Menu: um toque curto e seco, de couro e metal, que não cansa em uso repetido.
  select: [tone(196, 0, 0.07, 0.09, 'triangle'), noise(0, 0.03, 0.05, 'bandpass', 1500, 6)],
  // Voltar: a mesma ideia, uma quarta abaixo e descendo.
  back: [tone(147, 0, 0.11, 0.08, 'triangle', { glide: 110 }), noise(0, 0.03, 0.04, 'bandpass', 900, 6)],
  // XP: duas notas claras, discretas, para repetir muitas vezes por sessão.
  xp: [tone(440, 0, 0.3, 0.1), tone(660, 0.1, 0.3, 0.08)],
  // Desafio, missão ou revisão concluída: terça e quinta subindo, sem alarde.
  victory: [tone(196, 0, 1.1, 0.1), tone(294, 0.12, 1.1, 0.09), tone(392, 0.24, 1.3, 0.08), bell(784, 0.3, 1.2, 0.05)],
  /* Chefe derrotado: o momento maior do site. Primeiro o impacto grave (ruído e um seno que
     despenca), depois o coral em lá menor, e por fim o sino que anuncia a queda. Cerca de 4 s. */
  boss: [
    noise(0, 0.45, 0.18, 'lowpass', 190, 0.8),
    tone(90, 0, 0.55, 0.14, 'sine', { glide: 42 }),
    ...CHOIR.map((hz, i) => tone(hz, 0.26 + i * 0.015, 2.3, 0.042, 'triangle', { detune: i % 2 ? 6 : -6 })),
    noise(0.26, 1.6, 0.04, 'bandpass', 520, 1.2),
    bell(220, 0.95, 3, 0.11),
    bell(329.63, 1.15, 2.6, 0.06),
  ],
  // Conquista: sino de ouro e a quinta logo atrás, com cauda longa.
  medal: [bell(523.25, 0, 2.4, 0.11), bell(784, 0.18, 2, 0.07), tone(261.63, 0.05, 1.6, 0.05, 'triangle')],
  // Item: tinido de metal e as duas notas de quem guarda algo no cinto.
  item: [noise(0, 0.05, 0.09, 'bandpass', 2800, 9), bell(1046.5, 0.02, 0.6, 0.08), bell(1568, 0.1, 0.45, 0.05)],
  // Compra: moedas trocando de mão.
  purchase: [noise(0, 0.06, 0.07, 'bandpass', 3400, 10), tone(784, 0.02, 0.35, 0.09), tone(1046.5, 0.12, 0.35, 0.07)],
  // Erro: duas notas graves que descem, sem punir quem errou.
  retry: [tone(130, 0, 0.3, 0.08, 'triangle'), tone(110, 0.12, 0.35, 0.07, 'triangle')],
}

/** As vozes de um toque, já em ordem de entrada. */
export function cueVoices(cue: Cue): Voice[] {
  return [...VOICES[cue]].sort((a, b) => a.at - b.at)
}

/** Quanto tempo o toque ocupa, do disparo ao fim da última voz (sem a cauda do reverb). */
export function cueLength(cue: Cue): number {
  return Math.max(...VOICES[cue].map((v) => v.at + v.length))
}

/** Amplitude aproximada de uma voz em certo instante, seguindo o mesmo envelope do motor:
 *  ataque curto e queda exponencial até o fim da nota. */
function amplitude(v: Voice, t: number): number {
  if (t < v.at || t > v.at + v.length) return 0
  const ataque = Math.min(0.02, v.length / 3)
  const andado = t - v.at
  if (andado < ataque) return (v.volume * andado) / ataque
  // Mesma queda em dois estágios do motor: até um quinto do volume na metade, daí ao silêncio.
  const meio = ataque + (v.length - ataque) / 2
  if (andado <= meio - v.at + v.at) {
    const parte = (andado - ataque) / Math.max(1e-6, meio - ataque)
    return v.volume * Math.pow(0.2, parte)
  }
  const parte = (andado - meio) / Math.max(1e-6, v.length - meio)
  return v.volume * 0.2 * Math.pow(0.0005, parte)
}

/** Maior soma de amplitudes simultâneas do toque. Serve de guarda contra distorção: o ganho dos
 *  efeitos já é baixo, mas nenhuma pilha de vozes deve estourar sozinha. */
export function cuePeak(cue: Cue): number {
  const fim = cueLength(cue)
  let maior = 0
  for (let t = 0; t <= fim; t += 0.005) {
    const soma = VOICES[cue].reduce((total, v) => total + amplitude(v, t), 0)
    if (soma > maior) maior = soma
  }
  return maior
}

/** Que toque cabe ao elemento clicado: um "voltar" soa diferente de um "avançar".
 *  Um `data-sound="back"` (ou "select") no elemento, ou em um ancestral, decide na frente do texto. */
export function menuCue(alvo: Element): Extract<Cue, 'select' | 'back'> {
  const marcado = alvo.closest('[data-sound]')?.getAttribute('data-sound')
  if (marcado === 'back' || marcado === 'select') return marcado
  const texto = (alvo.textContent ?? '').trim().toLowerCase()
  return /^(voltar|volte|cancelar|fechar|sair|descartar)\b/.test(texto) ? 'back' : 'select'
}
