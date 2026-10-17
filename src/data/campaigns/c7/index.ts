import type { CampaignContent } from '../types'
import { assistenteQuePulavaEtapas } from './m3-assistente-que-pulava-etapas'
import { controleSoNoSite } from './m2-controle-so-no-site'
import { limitesDeCadaCanal } from './m5-limites-de-cada-canal'
import { loginPorTodosOsLados } from './m4-login-por-todos-os-lados'
import { mapaDosCanais } from './m1-mapa-dos-canais'
import { umPadraoParaTodos } from './m6-um-padrao-para-todos'

export const campaign7: CampaignContent = {
  id: 'uma-conta-muitos-caminhos',
  title: 'Uma conta, muitos caminhos',
  company: 'Faro Energia',
  tagline: 'Site, aplicativo, parceiros e um assistente de IA: o mesmo controle em um canal, ausente nos outros.',
  summary: 'Arquitetura multicanal: mapa de entradas e fronteiras, controles que moravam só no site, um assistente que pulava etapas, autenticação consistente com um provedor de identidade, limites por identidade somando canais e um padrão de camadas registrado em um ADR.',
  area: 'arq',
  requires: [],
  missions: [mapaDosCanais, controleSoNoSite, assistenteQuePulavaEtapas, loginPorTodosOsLados, limitesDeCadaCanal, umPadraoParaTodos],
}
