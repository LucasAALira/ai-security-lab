/** Poses do cavaleiro do santuário.
 *
 *  A figura é desenhada uma vez só, em posição de repouso, e cada membro fica num grupo que gira
 *  em torno do próprio pivô (ombro, cotovelo, quadril, joelho, pescoço). Assim dá para mudar a
 *  pose sem redesenhar nada — e o equipamento, que é desenhado junto do membro, acompanha.
 *
 *  Nenhuma pose é de frente para quem olha: o tronco e a cabeça ficam voltados para o lado da
 *  fogueira, em três quartos. */

export type PoseId = 'guarda' | 'descanso' | 'ataque'

/** Ângulos em graus. Positivo gira no sentido horário, como o SVG faz. */
export interface Pose {
  /** Deslocamento do corpo inteiro, para sentar ou avançar. */
  deslocaX: number
  deslocaY: number
  /** O quanto o corpo se estreita de frente: 1 é de frente, 0,8 é três quartos. */
  largura: number
  tronco: number
  cabeca: number
  /** Braço do escudo (à esquerda de quem olha) e braço da arma. */
  bracoEsq: number
  anteEsq: number
  bracoDir: number
  anteDir: number
  coxaEsq: number
  canelaEsq: number
  coxaDir: number
  canelaDir: number
  /** Giro da arma na mão, para apontá-la. */
  arma: number
  /** Giro do escudo, para erguê-lo. */
  escudo: number
  /** Ajuste do manto quando a pose o amassa (sentar, avançar). */
  manto?: { escala: number; giro: number }
}

export const PIVOS = {
  pescoco: [60, 42],
  ombroEsq: [40, 50],
  ombroDir: [80, 50],
  cotoveloEsq: [31, 80],
  cotoveloDir: [89, 80],
  quadril: [60, 102],
  joelhoEsq: [50, 140],
  joelhoDir: [70, 140],
  maoDir: [85, 106],
  maoEsq: [35, 104],
} as const

export const POSES: Record<PoseId, Pose> = {
  /** De guarda: peso na perna de trás, escudo à frente, arma recuada. Olha para a fogueira. */
  guarda: {
    deslocaX: 0,
    deslocaY: 0,
    largura: 0.86,
    tronco: -5,
    cabeca: 9,
    bracoEsq: 16,
    anteEsq: -58,
    bracoDir: -16,
    anteDir: 22,
    coxaEsq: 12,
    canelaEsq: -10,
    coxaDir: -14,
    canelaDir: 12,
    arma: 10,
    escudo: -14,
  },
  /** Sentado junto à fogueira, de lado, cabeça baixa: a pose de quem voltou, não de quem venceu. */
  descanso: {
    deslocaX: -6,
    deslocaY: 16,
    largura: 0.72,
    tronco: 12,
    cabeca: 18,
    bracoEsq: 34,
    anteEsq: -62,
    bracoDir: 30,
    anteDir: -58,
    /* Sentado de lado: a coxa vai para a frente (giro anti-horário, para o lado da fogueira) e a
       canela desce de volta ao chão. */
    coxaEsq: -74,
    canelaEsq: 84,
    coxaDir: -60,
    canelaDir: 66,
    arma: 86,
    escudo: 34,
    /** Sentado, a capa escorre pela pedra em vez de pender até o chão. */
    manto: { escala: 0.5, giro: 8 },
  },
  /** Avançando: tronco à frente, arma erguida para o golpe. Usada nas crônicas de batalha. */
  ataque: {
    deslocaX: 4,
    deslocaY: 2,
    largura: 0.8,
    tronco: -14,
    cabeca: 12,
    bracoEsq: 34,
    anteEsq: -64,
    bracoDir: -104,
    anteDir: -34,
    coxaEsq: 30,
    canelaEsq: -24,
    coxaDir: -26,
    canelaDir: 30,
    arma: -18,
    escudo: -24,
    manto: { escala: 0.92, giro: -10 },
  },
}

/** `rotate(ângulo pivô)` pronto para o atributo `transform`. */
export const giro = (angulo: number, pivo: readonly [number, number] | readonly number[]) => `rotate(${angulo} ${pivo[0]} ${pivo[1]})`
