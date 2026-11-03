/* Os dez caminhos do santuário: arquétipos clássicos de RPG, com nome, história, equipamento e
 * paleta escritos para este projeto. Nenhum personagem, armadura, símbolo ou nome de obra alguma
 * foi copiado — a arte é a de `src/components/pixel`, desenhada aqui.
 *
 * Escolher um caminho é só aparência: não muda XP, moeda, preço nem regra de progresso. */

import type { Palette } from '@/components/pixel/sprite'
import type { Pecas } from '@/components/pixel/montar'

export interface Traje {
  nome: string
  pecas: Pecas
  palette: Palette
}

export interface HeroiSpec {
  id: string
  nome: string
  /** O que ele faz, em uma frase. */
  desc: string
  /** Frase do próprio personagem, no tom do santuário. */
  lema: string
  /** Como o equipamento se chama na ficha. */
  ficha: [string, string][]
  /** Três trajes: mesma função, roupa diferente. */
  trajes: Traje[]
}

export const HEROIS: readonly HeroiSpec[] = [
  {
    id: 'cavaleiro-errante',
    nome: 'Cavaleiro errante',
    desc: 'Armadura média e gasta, espada e escudo que já serviram a outro dono.',
    lema: 'Servi a um portão que já não existe. Sirvo ao próximo.',
    ficha: [['Cabeça', 'elmo fechado'], ['Corpo', 'peitoral de placas'], ['Pernas', 'botas'], ['Capa', 'capa curta'], ['Arma', 'espada e escudo']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'elmo', torso: 'placas', pernas: 'botas', capa: 'curta', arma: 'espada-escudo' },
        palette: { 'k': '#090b10', '1': '#2d333f', '2': '#434c5c', '3': '#5d6a7d', '4': '#4a5464', '5': '#6c7788', '6': '#9aa6b6', '7': '#8a7340', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'elmo-aberto', torso: 'placas', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'espada-escudo' },
        palette: { 'k': '#090b10', '1': '#232831', '2': '#343b48', '3': '#495362', '4': '#576376', '5': '#7f8ca0', '6': '#b6c4d7', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'elmo-chifres', torso: 'placas', pernas: 'botas', capa: 'longa', arma: 'espada-escudo' },
        palette: { 'k': '#090b10', '1': '#373e4d', '2': '#525d70', '3': '#718198', '4': '#3b4350', '5': '#565f6d', '6': '#7b8592', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'duelista',
    nome: 'Duelista',
    desc: 'Roupa leve, duas lâminas curtas e peso na ponta dos pés.',
    lema: 'Quem erra o primeiro golpe não erra o segundo: não há segundo.',
    ficha: [['Cabeça', 'cabeça descoberta'], ['Corpo', 'couro pesado'], ['Pernas', 'botas'], ['Capa', 'sem capa'], ['Arma', 'duas lâminas']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'nua', torso: 'couro', pernas: 'botas', capa: 'nenhuma', arma: 'duas-laminas' },
        palette: { 'k': '#090b10', '1': '#2a2230', '2': '#3d3348', '3': '#564766', '4': '#5b4a33', '5': '#7d6545', '6': '#a98a5e', '7': '#b8562f', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'capuz', torso: 'couro', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'duas-laminas' },
        palette: { 'k': '#090b10', '1': '#211b25', '2': '#302838', '3': '#433750', '4': '#6b573c', '5': '#947751', '6': '#c7a36f', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'elmo-aberto', torso: 'couro', pernas: 'botas', capa: 'longa', arma: 'duas-laminas' },
        palette: { 'k': '#090b10', '1': '#33293b', '2': '#4a3e58', '3': '#69577c', '4': '#493b29', '5': '#645137', '6': '#876e4b', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'barbaro',
    nome: 'Bárbaro',
    desc: 'Couro pesado, ombros largos e um machado que pede as duas mãos.',
    lema: 'Muro é só pedra que ainda não foi convencida.',
    ficha: [['Cabeça', 'elmo com pontas'], ['Corpo', 'couro pesado'], ['Pernas', 'pernas enfaixadas'], ['Capa', 'capa esfarrapada'], ['Arma', 'machado grande']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'elmo-chifres', torso: 'couro', pernas: 'enfaixadas', capa: 'esfarrapada', arma: 'machado' },
        palette: { 'k': '#090b10', '1': '#3a2a1e', '2': '#51392a', '3': '#6d4e39', '4': '#4e4336', '5': '#6e6050', '6': '#968471', '7': '#9a3b2a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'elmo', torso: 'couro', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'machado' },
        palette: { 'k': '#090b10', '1': '#2d2117', '2': '#3f2c21', '3': '#553d2c', '4': '#5c4f40', '5': '#82715e', '6': '#b19c85', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'mascara', torso: 'couro', pernas: 'botas', capa: 'longa', arma: 'machado' },
        palette: { 'k': '#090b10', '1': '#473325', '2': '#634633', '3': '#855f46', '4': '#3e362b', '5': '#584d40', '6': '#786a5a', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'ladrao',
    nome: 'Ladrão',
    desc: 'Capuz baixo, proteção leve, duas adagas e bolsa de ferramentas no cinto.',
    lema: 'A porta mais segura é a que ninguém se lembra de trancar.',
    ficha: [['Cabeça', 'capuz'], ['Corpo', 'túnica longa'], ['Pernas', 'botas'], ['Capa', 'capa curta'], ['Arma', 'duas adagas']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'capuz', torso: 'tunica', pernas: 'botas', capa: 'curta', arma: 'adagas' },
        palette: { 'k': '#090b10', '1': '#1f2a24', '2': '#2d3b32', '3': '#3f5245', '4': '#4a3c2a', '5': '#66543c', '6': '#8b7352', '7': '#6f8f5a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'mascara', torso: 'tunica', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'adagas' },
        palette: { 'k': '#090b10', '1': '#18211c', '2': '#232e27', '3': '#314036', '4': '#574732', '5': '#786347', '6': '#a48861', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'chapeu', torso: 'tunica', pernas: 'botas', capa: 'longa', arma: 'adagas' },
        palette: { 'k': '#090b10', '1': '#26332c', '2': '#37483d', '3': '#4d6454', '4': '#3b3022', '5': '#524330', '6': '#6f5c42', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'astrologo',
    nome: 'Astrólogo',
    desc: 'Manto com pontos de luz discretos e um cajado que não se apaga.',
    lema: 'As estrelas não respondem. Só confirmam o que eu já temia.',
    ficha: [['Cabeça', 'chapéu de abas'], ['Corpo', 'manto fechado'], ['Pernas', 'botas'], ['Capa', 'capa longa'], ['Arma', 'cajado arcano']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'chapeu', torso: 'manto', pernas: 'botas', capa: 'longa', arma: 'cajado' },
        palette: { 'k': '#090b10', '1': '#1b2440', '2': '#27345c', '3': '#36487c', '4': '#3b4258', '5': '#555f7a', '6': '#7d87a4', '7': '#7fc8e8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'capuz', torso: 'manto', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'cajado' },
        palette: { 'k': '#090b10', '1': '#151c32', '2': '#1e2948', '3': '#2a3861', '4': '#464e68', '5': '#647090', '6': '#949fc2', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'mascara', torso: 'manto', pernas: 'botas', capa: 'longa', arma: 'cajado' },
        palette: { 'k': '#090b10', '1': '#212c4e', '2': '#303f70', '3': '#425897', '4': '#2f3546', '5': '#444c62', '6': '#646c83', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'clerigo',
    nome: 'Clérigo',
    desc: 'Túnica reforçada, maça de cerimônia e um símbolo próprio no peito.',
    lema: 'Registro o que vi. Quem vier depois que decida o nome disso.',
    ficha: [['Cabeça', 'elmo aberto'], ['Corpo', 'túnica longa'], ['Pernas', 'botas'], ['Capa', 'capa curta'], ['Arma', 'maça e símbolo']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'elmo-aberto', torso: 'tunica', pernas: 'botas', capa: 'curta', arma: 'maca' },
        palette: { 'k': '#090b10', '1': '#49433a', '2': '#645c50', '3': '#847a6a', '4': '#5c5244', '5': '#7e7161', '6': '#a89883', '7': '#c7a94e', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'elmo', torso: 'tunica', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'maca' },
        palette: { 'k': '#090b10', '1': '#39342d', '2': '#4e483e', '3': '#675f53', '4': '#6d6150', '5': '#958572', '6': '#c6b39b', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'elmo', torso: 'tunica', pernas: 'botas', capa: 'longa', arma: 'maca' },
        palette: { 'k': '#090b10', '1': '#595247', '2': '#7a7062', '3': '#a19581', '4': '#4a4236', '5': '#655a4e', '6': '#867a69', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'espadachim',
    nome: 'Espadachim',
    desc: 'Armadura leve, espada longa e economia de movimento.',
    lema: 'Um golpe, bem posto, poupa dez.',
    ficha: [['Cabeça', 'elmo aberto'], ['Corpo', 'peitoral de placas'], ['Pernas', 'botas'], ['Capa', 'sem capa'], ['Arma', 'espada longa']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'elmo-aberto', torso: 'placas', pernas: 'botas', capa: 'nenhuma', arma: 'espada-longa' },
        palette: { 'k': '#090b10', '1': '#22303a', '2': '#2f4350', '3': '#415c6d', '4': '#54606a', '5': '#78858f', '6': '#a3b0ba', '7': '#b0bcc6', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'elmo', torso: 'placas', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'espada-longa' },
        palette: { 'k': '#090b10', '1': '#1b252d', '2': '#25343e', '3': '#334855', '4': '#63717d', '5': '#8e9da9', '6': '#c0d0db', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'elmo', torso: 'placas', pernas: 'botas', capa: 'longa', arma: 'espada-longa' },
        palette: { 'k': '#090b10', '1': '#293b47', '2': '#395262', '3': '#4f7085', '4': '#434d55', '5': '#606a72', '6': '#828d95', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'prisioneiro',
    nome: 'Prisioneiro arcano',
    desc: 'Roupa simples, grilhões que não saíram e uma magia que ainda não obedece.',
    lema: 'Tiraram minhas correntes das mãos, não dos pulsos.',
    ficha: [['Cabeça', 'cabeça descoberta'], ['Corpo', 'túnica longa'], ['Pernas', 'pernas enfaixadas'], ['Capa', 'sem capa'], ['Arma', 'grilhões']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'nua', torso: 'tunica', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'correntes' },
        palette: { 'k': '#090b10', '1': '#3b3a36', '2': '#50504a', '3': '#6b6a62', '4': '#49535c', '5': '#67737d', '6': '#8f9ba5', '7': '#7a5bd0', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'capuz', torso: 'tunica', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'correntes' },
        palette: { 'k': '#090b10', '1': '#2e2d2a', '2': '#3e3e3a', '3': '#53534c', '4': '#56626d', '5': '#7a8894', '6': '#a9b7c3', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'elmo-aberto', torso: 'tunica', pernas: 'botas', capa: 'longa', arma: 'correntes' },
        palette: { 'k': '#090b10', '1': '#484742', '2': '#62625a', '3': '#838178', '4': '#3a424a', '5': '#525c64', '6': '#727c84', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'penitente',
    nome: 'Penitente',
    desc: 'Manto escuro, máscara lisa e equipamento sem excesso.',
    lema: 'Carrego a máscara porque o rosto não bastava.',
    ficha: [['Cabeça', 'máscara lisa'], ['Corpo', 'manto fechado'], ['Pernas', 'botas'], ['Capa', 'capa longa'], ['Arma', 'lâmina simples']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'mascara', torso: 'manto', pernas: 'botas', capa: 'longa', arma: 'lamina-simples' },
        palette: { 'k': '#090b10', '1': '#16161c', '2': '#24242e', '3': '#343442', '4': '#3c3a46', '5': '#58555f', '6': '#7a7682', '7': '#8d2f3a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'capuz', torso: 'manto', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'lamina-simples' },
        palette: { 'k': '#090b10', '1': '#111116', '2': '#1c1c24', '3': '#292933', '4': '#474453', '5': '#686470', '6': '#908b99', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'elmo', torso: 'manto', pernas: 'botas', capa: 'longa', arma: 'lamina-simples' },
        palette: { 'k': '#090b10', '1': '#1b1b22', '2': '#2c2c38', '3': '#3f3f51', '4': '#302e38', '5': '#46444c', '6': '#625e68', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
  {
    id: 'sobrevivente',
    nome: 'Sobrevivente',
    desc: 'Roupas improvisadas, remendos por cima de remendos e um bordão de estrada.',
    lema: 'Não venci nada. Só continuei de pé mais tempo que o resto.',
    ficha: [['Cabeça', 'capuz'], ['Corpo', 'túnica longa'], ['Pernas', 'pernas enfaixadas'], ['Capa', 'capa esfarrapada'], ['Arma', 'bordão']],
    trajes: [
      {
        nome: 'Traje I',
        pecas: { cabeca: 'capuz', torso: 'tunica', pernas: 'enfaixadas', capa: 'esfarrapada', arma: 'bordao' },
        palette: { 'k': '#090b10', '1': '#2e2a24', '2': '#403a31', '3': '#574e42', '4': '#4c4034', '5': '#6a5a4a', '6': '#8f7c67', '7': '#8a6a3a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje II',
        pecas: { cabeca: 'mascara', torso: 'tunica', pernas: 'enfaixadas', capa: 'nenhuma', arma: 'bordao' },
        palette: { 'k': '#090b10', '1': '#24211c', '2': '#322d26', '3': '#443d33', '4': '#5a4c3d', '5': '#7d6a57', '6': '#a9927a', '7': '#b8a06a', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
      {
        nome: 'Traje III',
        pecas: { cabeca: 'chapeu', torso: 'tunica', pernas: 'botas', capa: 'longa', arma: 'bordao' },
        palette: { 'k': '#090b10', '1': '#38332c', '2': '#4e473c', '3': '#6a5f51', '4': '#3d332a', '5': '#55483b', '6': '#726352', '7': '#6f8fa8', 'S': '#c99a73', 's': '#05070b', 'E': '#cfe4ef', 'w': '#9fb0c2', 'W': '#dfe9f2', 'm': '#4a3a2c' },
      },
    ],
  },
]

export const HEROI_IDS: readonly string[] = HEROIS.map((h) => h.id)
export const heroiById = (id: string): HeroiSpec | undefined => HEROIS.find((h) => h.id === id)
