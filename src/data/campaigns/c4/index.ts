import type { CampaignContent } from '../types'
import { fornecedorDeAntifraude } from './m2-fornecedor-de-antifraude'
import { lancarComCondicoes } from './m6-lancar-com-condicoes'
import { listaDePendencias } from './m4-lista-de-pendencias'
import { pedidoDeExcecao } from './m3-pedido-de-excecao'
import { portaoDeLiberacao } from './m5-portao-de-liberacao'
import { reuniaoDeQuinta } from './m1-reuniao-de-quinta'

export const campaign4: CampaignContent = {
  id: 'lancamento-sob-pressao',
  title: 'O lançamento sob pressão',
  company: 'Brisa Pagamentos',
  tagline: 'Uma data fixa, oito achados e uma diretora que quer saber qual risco está aceitando.',
  summary: 'Arquitetura de segurança na prática: modelagem de ameaças em 30 minutos, avaliação de fornecedor, exceções bem formadas, priorização com capacidade limitada, portão de liberação que bloqueia de verdade e a decisão final registrada em um ADR.',
  area: 'arq',
  requires: [],
  missions: [reuniaoDeQuinta, fornecedorDeAntifraude, pedidoDeExcecao, listaDePendencias, portaoDeLiberacao, lancarComCondicoes],
}
