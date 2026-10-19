import type { CampaignContent } from '../types'
import { chaveNoPacote } from './m2-chave-no-pacote'
import { clienteQueDecidia } from './m4-cliente-que-decidia'
import { habilidadeQuePediaDemais } from './m5-habilidade-que-pedia-demais'
import { pacoteQueChegou } from './m1-pacote-que-chegou'
import { rastroNoHistorico } from './m3-rastro-no-historico'
import { relatorioQueCorrige } from './m6-relatorio-que-corrige'

export const campaign8: CampaignContent = {
  id: 'a-chave-no-pacote',
  title: 'A chave que saiu no pacote',
  company: 'Vértice',
  tagline: 'Um SDK de terceiro, um aplicativo publicado e quatro segredos que ninguém sabia que tinham saído.',
  summary: 'Engenharia reversa defensiva de ponta a ponta: triagem de um artefato recebido, segredo encontrado em um pacote publicado, rastro que fica em histórico e imagens, decisões que moravam no cliente, artefatos de IA analisados antes da adoção e o relatório que faz alguém corrigir.',
  area: 'rev',
  requires: [],
  missions: [pacoteQueChegou, chaveNoPacote, rastroNoHistorico, clienteQueDecidia, habilidadeQuePediaDemais, relatorioQueCorrige],
}
