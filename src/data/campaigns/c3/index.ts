import type { CampaignContent } from '../types'
import { agenteQueNaoParava } from './m5-agente-que-nao-parava'
import { aprovacaoQueNinguemLe } from './m3-aprovacao-que-ninguem-le'
import { assistenteDeOperacoes } from './m1-assistente-de-operacoes'
import { chaveQueOAgenteCarregava } from './m4-chave-que-o-agente-carregava'
import { desenhoDoAgenteSeguro } from './m6-desenho-do-agente-seguro'
import { emailComOrdens } from './m2-email-com-ordens'

export const campaign3: CampaignContent = {
  id: 'agente-poder-demais',
  title: 'O agente com poder demais',
  company: 'Vértice Logística',
  tagline: 'Um assistente que consulta, escreve, cancela e apaga, com a chave de todo mundo.',
  summary: 'Segurança de agentes com ferramentas: inventário e privilégio mínimo, instruções escondidas em conteúdo de terceiros, aprovação humana que realmente protege, credenciais curtas e delegadas, limites de consumo com interruptor de emergência e a política de autonomia registrada em um ADR.',
  area: 'ia',
  requires: [],
  missions: [assistenteDeOperacoes, emailComOrdens, aprovacaoQueNinguemLe, chaveQueOAgenteCarregava, agenteQueNaoParava, desenhoDoAgenteSeguro],
}
