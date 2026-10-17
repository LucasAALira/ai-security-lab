/** Original collectible names and lore. SVG symbols: Game-icons.net, CC BY 3.0. */
export const RELICS = [
  { id: 'ember', name: 'Brasa do Primeiro Passo', icon: 'burning-embers', area: 'Fundamentos', tier: 'bronze', price: 25, lore: 'Uma pequena chama guardada por quem escolheu começar. Nenhuma fortaleza nasce pronta.' },
  { id: 'key', name: 'Chave do Guardião', icon: 'key', area: 'APIs', tier: 'prata', price: 45, lore: 'Abre somente as portas permitidas. Conhecer o nome de uma porta nunca foi suficiente para atravessá-la.' },
  { id: 'orb', name: 'Orbe da Vigilância', icon: 'crystal-ball', area: 'Inteligência artificial', tier: 'prata', price: 55, lore: 'Reflete perguntas e ilusões. Seu guardião aprende a reconhecer instruções escondidas em histórias alheias.' },
  { id: 'chain', name: 'Elo Inquebrável', icon: 'chained-heart', area: 'Supply chain', tier: 'ouro', price: 65, lore: 'Forjado para lembrar que a confiança viaja de mão em mão. Cada elo carrega a responsabilidade do anterior.' },
  { id: 'ring', name: 'Anel das Fronteiras', icon: 'ring', area: 'Mobile', tier: 'prata', price: 45, lore: 'Um círculo de prata protege o viajante. O que fica dentro dele também exige cuidado.' },
  { id: 'book', name: 'Códice do Arquiteto', icon: 'spell-book', area: 'Arquitetura', tier: 'ouro', price: 70, lore: 'Registra caminhos escolhidos e caminhos abandonados. Uma boa decisão deixa razões para quem vier depois.' },
  { id: 'chest', name: 'Cofre das Memórias', icon: 'locked-chest', area: 'Proteção de dados', tier: 'ouro', price: 60, lore: 'Seu valor está no que preserva — e no que nunca deveria ter guardado.' },
  { id: 'dragon', name: 'Relíquia do Dragão', icon: 'dragon-head', area: 'Coleção lendária', tier: 'dragao', price: 120, lore: 'Não concede poder sobre o conhecimento. Apenas acompanha aqueles que continuam a procurá-lo.' },
] as const
export const ROOMS = [
  { id: 'stone', name: 'Salão de Pedra', price: 0 },
  { id: 'ember-hall', name: 'Galeria das Brasas', price: 50 },
  { id: 'moon-hall', name: 'Observatório Lunar', price: 70 },
] as const
export const DISPLAY_LIMIT = 6
export const SWAP_PRICE = 10
export const SWAP_LIMIT = 1
export const roomOwned = (room: string, owned: string[]) => room === 'stone' || owned.includes('room:' + room)
