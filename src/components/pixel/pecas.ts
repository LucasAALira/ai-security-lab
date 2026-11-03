/* Peças dos personagens em pixel art, 40 × 56. ARQUIVO GERADO — não edite à mão:
 * o desenho vive em `scripts/sprites/` e é convertido para cá, para a prévia e o site
 * mostrarem exatamente o mesmo sprite. Veja docs/COMO-ADICIONAR-CONTEUDO.md.
 *
 * Índices de cor: k contorno | 1 2 3 traje | 4 5 6 metal ou couro | 7 acento
 * S s pele | E olhos | w W lâmina | m haste | s sombra | . transparente
 * Tudo desenhado para este projeto: nenhum sprite, paleta ou personagem de jogo foi copiado. */

export const SPRITE = { width: 40, height: 56 } as const

/** Onde cada mão fica, para as armas nascerem presas a elas. */
export const MAO_ESQ = [26, 10] as const
export const MAO_DIR = [26, 27] as const

export const TORSOS: Record<string, string[]> = {
  'placas': [
    '..kkkkkkkkkk..',
    '.k6655556655k.',
    'k66kk2222kk66k',
    'k6k2222222 k6k',
    'k6k22333322k6k',
    'k6k22333322k6k',
    'k6k2233332 k6k',
    '.k22222222 2k.',
    '.k2222222222k.',
    '.k2266662222k.',
    '.k2222222222k.',
    '..k22222222k..',
    '..k77777777k..',
    '..k76666667k..',
    '..k77777777k..',
  ],
  'tunica': [
    '...kkkkkkkk...',
    '..k11111111k..',
    '.k1122222211k.',
    '.k1222222221k.',
    '.k1223333221k.',
    'k11223333221 k',
    'k12222222222 k',
    'k12222222222 k',
    'k1222222222 1k',
    'k7777777777 7k',
    'k12222222222 k',
    'k122222222221k',
    'k1222222222 1k',
    'k12222222222 k',
    'kk1222222221kk',
  ],
  'couro': [
    '.kkkkkkkkkkkk.',
    'k444455554444k',
    'k44k222222k44k',
    'k4k22SSSS22k4k',
    'k4k2SSSSSS2k4k',
    'k4k2SSSSSS2k4k',
    'k4k22SSSS22k4k',
    '.k2222222222k.',
    '.k2244442222k.',
    '.k2222222222k.',
    '.k2222222222k.',
    '..k22222222k..',
    '..k44444444k..',
    '..k47777774k..',
    '..k44444444k..',
  ],
  'manto': [
    '...kkkkkkkk...',
    '..k11111111k..',
    '.k1111111111k.',
    '.k1111111111k.',
    'k111112211111k',
    'k111122221111k',
    'k111122221111k',
    'k111112211111k',
    'k111111111111k',
    'k117777777711k',
    'k111111111111k',
    'k111111111111k',
    'k111111111111k',
    'k111111111111k',
    'kk1111111111kk',
  ],
}

export const PERNAS: Record<string, string[]> = {
  'botas': [
    '..k222kk222k..',
    '..k122kk221k..',
    '..k122kk221k..',
    '.kk122kk221kk.',
    '.k4222kk2224k.',
    '.k4122kk2214k.',
    '.k4122kk2214k.',
    '..k122kk221k..',
    '..k122kk221k..',
    '.kk122kk221kk.',
    '.k44445k4444k.',
    '.k46665k6664k.',
    'kk44445k44444k',
    'kkkkkkkkkkkkkk',
  ],
  'enfaixadas': [
    '..k222kk222k..',
    '..k122kk221k..',
    '..k525kk525k..',
    '..k122kk221k..',
    '..k525kk525k..',
    '..k122kk221k..',
    '..k525kk525k..',
    '..k122kk221k..',
    '..k525kk525k..',
    '..k122kk221k..',
    '.kk5555k555kk.',
    '.k55555k5555k.',
    'kk55555k55555k',
    'kkkkkkkkkkkkkk',
  ],
}

export const CABECAS: Record<string, string[]> = {
  'elmo': [
    '..kkkkk..',
    '.k66666k.',
    'k6666666k',
    'k6444446k',
    'k6kEEEk6k',
    'k6644446k',
    '.k66666k.',
    '..k555k..',
  ],
  'elmo-aberto': [
    '..kkkkk..',
    '.k66666k.',
    'k6666666k',
    'k6SSkSS6k',
    'k6EkkkE6k',
    'k66SSS66k',
    '.k6SSS6k.',
    '..k555k..',
  ],
  'elmo-chifres': [
    'k6kkkkk6k',
    'k6k666k6k',
    'k6666666k',
    'k6444446k',
    'k6kEEEk6k',
    'k6644446k',
    '.k66666k.',
    '..k555k..',
  ],
  'capuz': [
    '..kkkkk..',
    '.k11111k.',
    'k1111111k',
    'k11kkk11k',
    'k1kEsEk1k',
    'k11sss11k',
    '.k11111k.',
    '..k111k..',
  ],
  'chapeu': [
    '.kkkkkkk.',
    'k1111111k',
    'kkkkkkkkk',
    '.k1kkk1k.',
    '.kksEskk.',
    '..ksssk..',
    '..kSSSk..',
    '...k5k...',
  ],
  'mascara': [
    '..kkkkk..',
    '.k11111k.',
    'k1166611k',
    'k1666661k',
    'k16k6k61k',
    'k1166611k',
    '.k11111k.',
    '..k111k..',
  ],
  'nua': [
    '..kkkkk..',
    '.k11111k.',
    'k1111111k',
    'kSSSSSSSk',
    'kSEksEsSk',
    'kSSsssSSk',
    '.kSSSSSk.',
    '..k555k..',
  ],
}

export const BRACOS: string[] = [
  'k44k..........k44k',
  'k442k........k244k',
  'k442k........k244k',
  'k442k........k244k',
  '.k44k........k44k.',
  '.k442k......k244k.',
  '.k442k......k244k.',
  '.k442k......k244k.',
  '.k44k........k44k.',
  'k5555k......k5555k',
  'k5665k......k5665k',
  'k5555k......k5555k',
  '.kkkk........kkkk.',
]

export const SOMBRA: string[] = [
  '...ssssssssss...',
  '.ssssssssssssss.',
  '...ssssssssss...',
]

/** Capa: posição e desenho, ou `null` quando o arquétipo não usa capa. */
export const CAPAS: Record<string, { y: number; x: number; rows: string[] } | null> = {
  'nenhuma': null,
  'curta': { y: 11, x: 9, rows: [
      'kk11111111111111kk',
      'k1111111111111111k',
      'k1111111111111111k',
      'k1111111111111111k',
      'k1111111111111111k',
      'k1111111111111111k',
      '.k11111111111111k.',
      '.k11111111111111k.',
      '..k111111111111k..',
      '...kkkkkkkkkkkk...',
  ] },
  'longa': { y: 11, x: 8, rows: [
      'kk1111111111111111kk',
      'k111111111111111111k',
      'k111111111111111111k',
      'k111111111111111111k',
      'k111111111111111111k',
      'k111111111111111111k',
      'k111111111111111111k',
      'k111111111111111111k',
      '.k1111111111111111k.',
      '.k1111111111111111k.',
      '.k1111111111111111k.',
      '..k11111111111111k..',
      '..k11111111111111k..',
      '...k111111111111k...',
      '....kkkkkkkkkkkk....',
  ] },
  'esfarrapada': { y: 11, x: 9, rows: [
      'kk11111111111111kk',
      'k1111111111111111k',
      'k1111111111111111k',
      'k1111111111111111k',
      '.k11111111111111k.',
      '.k1k1111111111k1k.',
      '.k1.k11111111k.1k.',
      '.kk..k1k..k1k..kk.',
      '.....k.k..k.k.....',
  ] },
}

/** Cada arma é uma lista de blocos já ancorados nas mãos. */
export const ARMAS: Record<string, { y: number; x: number; rows: string[] }[]> = {
  'espada-escudo': [
    { y: 10, x: 26, rows: ['..k..', '.kwk.', '.kWk.', '.kwk.', '.kwk.', '.kwk.', '.kwk.', '.kwk.', '.kwk.', '.kwk.', '.kwk.', 'k777k', '.kmk.', '.kmk.', '.k7k.'] },
    { y: 14, x: 5, rows: ['.kkkkkk.', 'k444444k', 'k466664k', 'k467764k', 'k467764k', 'k466664k', 'k455554k', '.k4554k.', '.k4444k.', '..k44k..', '...kk...'] },
  ],
  'duas-laminas': [
    { y: 17, x: 26, rows: ['kwk', 'kWk', 'kwk', 'kwk', 'kwk', 'kwk', 'k7k', 'kmk', 'k7k'] },
    { y: 17, x: 11, rows: ['kwk', 'kWk', 'kwk', 'kwk', 'kwk', 'kwk', 'k7k', 'kmk', 'k7k'] },
  ],
  'machado': [
    { y: 8, x: 24, rows: ['.kkkk..', 'k666wk.', 'k66wWk.', 'k6wwWk.', 'k66wWk.', 'k666wk.', '.kkkk..', '..kmk..', '..kmk..', '..kmk..', '..kmk..', '..kmk..', '..kmk..', '..k7k..', '..kmk..', '..kmk..', '..kmk..', '..kkk..'] },
  ],
  'adagas': [
    { y: 20, x: 26, rows: ['kwk', 'kWk', 'kwk', 'k7k', 'kmk', 'k7k'] },
    { y: 20, x: 11, rows: ['kwk', 'kWk', 'kwk', 'k7k', 'kmk', 'k7k'] },
  ],
  'cajado': [
    { y: 6, x: 25, rows: ['.k7k.', 'k7W7k', '.k7k.', '.kmk.', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk'] },
  ],
  'maca': [
    { y: 14, x: 25, rows: ['.kkk.', 'k777k', 'k7W7k', 'k777k', '.kkk.', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk'] },
    { y: 22, x: 8, rows: ['kk7kk', 'k7k7k', 'k777k', 'kk7kk'] },
  ],
  'espada-longa': [
    { y: 6, x: 26, rows: ['kwk', 'kWk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'kwk', 'k7k'] },
    { y: 22, x: 25, rows: ['k777k', '.kmk.', '.kmk.', '.k7k.'] },
  ],
  'correntes': [
    { y: 18, x: 26, rows: ['k7k', 'kmk', 'k7k', 'kmk', 'k7k', 'kmk', 'k7k', 'kmk'] },
    { y: 24, x: 9, rows: ['k7k', 'k7k', 'k7k'] },
  ],
  'bordao': [
    { y: 9, x: 26, rows: ['kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk', 'kmk'] },
  ],
  'lamina-simples': [
    { y: 18, x: 26, rows: ['kwk', 'kWk', 'kwk', 'kwk', 'kwk', 'k7k', 'kmk', 'k7k'] },
  ],
}
