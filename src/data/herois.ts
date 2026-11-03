/* Os seis caminhos do santuário: arquétipos clássicos de RPG, com nome, história, equipamento e
 * três trajes cada. A arte é ilustração em pixel art trazida pelo autor do projeto — a origem
 * está registrada em `public/assets/CREDITS.md`, junto com o que foi feito aqui (recorte, fundo
 * transparente e redução para 320 px de altura).
 *
 * Escolher um caminho é só aparência: não muda XP, moeda, preço nem regra de progresso. */

export interface Traje {
  nome: string
  /** Arquivo em `public/assets/herois`, sem o caminho. */
  arte: string
  largura: number
  altura: number
  /** O que muda neste traje, em poucas palavras, para quem não vê a imagem. */
  descreve: string
}

export interface HeroiSpec {
  id: string
  nome: string
  /** O que ele faz, em uma frase. */
  desc: string
  /** Frase do próprio personagem, no tom do santuário. */
  lema: string
  /** Trilha do site com que o caminho mais combina. */
  trilha: string
  /** Como o equipamento se chama na ficha. */
  ficha: [string, string][]
  trajes: Traje[]
}

export const HEROIS: readonly HeroiSpec[] = [
  {
    id: 'cavaleiro',
    nome: 'Cavaleiro',
    desc: 'Armadura completa, espada e escudo: aguenta o primeiro golpe e protege quem está atrás.',
    lema: 'Servi a um portão que já não existe. Sirvo ao próximo.',
    trilha: 'Ataques e defesa',
    ficha: [
      ['Cabeça', 'cabelos soltos ou elmo fechado'],
      ['Corpo', 'placas de aço sobre malha'],
      ['Capa', 'manto de brasa'],
      ['Arma', 'espada longa'],
      ['Defesa', 'escudo com brasão'],
    ],
    trajes: [
      { nome: 'Guarda', arte: 'cavaleiro-a.png', largura: 169, altura: 320, descreve: 'armadura completa e manto de brasa' },
      { nome: 'Patrulha', arte: 'cavaleiro-b.png', largura: 204, altura: 320, descreve: 'elmo fechado e sobreveste de campanha' },
      { nome: 'Recruta', arte: 'cavaleiro-c.png', largura: 210, altura: 320, descreve: 'cota de malha simples, sem placas' },
    ],
  },
  {
    id: 'ladrao',
    nome: 'Ladrão',
    desc: 'Capuz baixo, proteção leve e lâmina curta: entra primeiro, sem fazer barulho, e volta com o mapa.',
    lema: 'A porta mais segura é a que ninguém se lembra de trancar.',
    trilha: 'Fundamentos',
    ficha: [
      ['Cabeça', 'capuz'],
      ['Corpo', 'couro leve e correias'],
      ['Capa', 'manto curto ou esfarrapado'],
      ['Arma', 'adaga'],
      ['Bolsa', 'ferramentas no cinto'],
    ],
    trajes: [
      { nome: 'Sombra', arte: 'ladrao-a.png', largura: 174, altura: 320, descreve: 'capuz carmim e adaga em punho' },
      { nome: 'Estrada', arte: 'ladrao-b.png', largura: 173, altura: 320, descreve: 'manto verde de viagem e bolsa' },
      { nome: 'Cidade', arte: 'ladrao-c.png', largura: 141, altura: 320, descreve: 'couro escuro, sem capa' },
    ],
  },
  {
    id: 'clerigo',
    nome: 'Clérigo',
    desc: 'Túnica reforçada, maça de cerimônia e um registro do que foi visto: audita, anota e impõe a regra.',
    lema: 'Registro o que vi. Quem vier depois que decida o nome disso.',
    trilha: 'Governança e Regulação',
    ficha: [
      ['Cabeça', 'descoberta, capuz ou mitra'],
      ['Corpo', 'túnica clara sobre placas'],
      ['Capa', 'estola comprida'],
      ['Arma', 'maça de cerimônia'],
      ['Registro', 'códice preso ao cinto'],
    ],
    trajes: [
      { nome: 'Cerimônia', arte: 'clerigo-a.png', largura: 163, altura: 320, descreve: 'túnica clara, maça e códice' },
      { nome: 'Peregrino', arte: 'clerigo-b.png', largura: 199, altura: 320, descreve: 'hábito de viagem e capuz' },
      { nome: 'Prelado', arte: 'clerigo-c.png', largura: 179, altura: 320, descreve: 'paramento completo e mitra' },
    ],
  },
  {
    id: 'mago',
    nome: 'Mago',
    desc: 'Cajado e foco de cristal: lida com o que fala, alucina e obedece a quem não devia.',
    lema: 'Toda instrução vinda de fora é suspeita até provar o contrário.',
    trilha: 'Fundamentos',
    ficha: [
      ['Cabeça', 'chapéu de abas ou capuz'],
      ['Corpo', 'manto comprido'],
      ['Capa', 'sobrecapa'],
      ['Arma', 'cajado com foco'],
      ['Bolsa', 'frascos no cinto'],
    ],
    trajes: [
      { nome: 'Arcano', arte: 'mago-a.png', largura: 159, altura: 320, descreve: 'manto roxo e chapéu de abas' },
      { nome: 'Andarilho', arte: 'mago-b.png', largura: 207, altura: 320, descreve: 'capuz e peças de armadura leve' },
      { nome: 'Conclave', arte: 'mago-c.png', largura: 228, altura: 320, descreve: 'veste carmim com estandarte' },
    ],
  },
  {
    id: 'sabio',
    nome: 'Sábio',
    desc: 'Bordão e livro aberto: já viu esse erro antes e sabe onde ele costuma voltar.',
    lema: 'O que se aprende depressa, esquece-se depressa.',
    trilha: 'Governança e Regulação',
    ficha: [
      ['Cabeça', 'descoberta, de barba longa'],
      ['Corpo', 'manto de estudo'],
      ['Capa', 'xale ou capa de viagem'],
      ['Arma', 'bordão'],
      ['Registro', 'livro sempre aberto'],
    ],
    trajes: [
      { nome: 'Biblioteca', arte: 'sabio-a.png', largura: 169, altura: 320, descreve: 'manto verde e livro aberto' },
      { nome: 'Estrada', arte: 'sabio-b.png', largura: 207, altura: 320, descreve: 'capa de viagem e trouxa nas costas' },
      { nome: 'Observatório', arte: 'sabio-c.png', largura: 243, altura: 320, descreve: 'manto estrelado e esfera armilar' },
    ],
  },
  {
    id: 'anao',
    nome: 'Anão',
    desc: 'Machado pesado e armadura de oficina: constrói, conserta e aguenta pancada.',
    lema: 'Muro é só pedra que ainda não foi convencida.',
    trilha: 'Ataques e defesa',
    ficha: [
      ['Cabeça', 'descoberta ou elmo de aba'],
      ['Corpo', 'placas sobre pele e couro'],
      ['Capa', 'manto curto'],
      ['Arma', 'machado de duas mãos'],
      ['Ofício', 'martelo e ferramentas'],
    ],
    trajes: [
      { nome: 'Vanguarda', arte: 'anao-a.png', largura: 172, altura: 320, descreve: 'placas, peles e machado grande' },
      { nome: 'Baluarte', arte: 'anao-b.png', largura: 253, altura: 320, descreve: 'armadura pesada e escudo de bigorna' },
      { nome: 'Forja', arte: 'anao-c.png', largura: 243, altura: 320, descreve: 'avental de oficina e martelo' },
    ],
  },
]

export const HEROI_IDS: readonly string[] = HEROIS.map((h) => h.id)
export const heroiById = (id: string): HeroiSpec | undefined => HEROIS.find((h) => h.id === id)

/** Caminhos de versões anteriores: cada um cai no mais próximo, para ninguém perder a escolha. */
export const HEROIS_ANTIGOS: Record<string, string> = {
  espadachim: 'cavaleiro',
  penitente: 'clerigo',
  duelista: 'ladrao',
  batedor: 'ladrao',
  barbaro: 'anao',
  sobrevivente: 'sabio',
  arcanista: 'mago',
  prisioneiro: 'mago',
  'cavaleiro-errante': 'cavaleiro',
  astrologo: 'mago',
}
