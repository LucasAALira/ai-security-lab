import type { CampaignContent } from '../types'
import { checkoutPorInteiro } from './m6-checkout-por-inteiro'
import { cupomQueNaoAcabava } from './m2-cupom-que-nao-acabava'
import { linkDeRecuperacao } from './m4-link-de-recuperacao'
import { pedidoDeOutraPessoa } from './m1-pedido-de-outra-pessoa'
import { precoDoNavegador } from './m3-preco-do-navegador'
import { previaQueBuscavaDemais } from './m5-previa-que-buscava-demais'

export const campaign5: CampaignContent = {
  id: 'checkout-outro-cliente',
  title: 'O checkout de outro cliente',
  company: 'Cesta Viva',
  tagline: 'Pedidos alheios à vista, cupons que não acabam e preços decididos pelo navegador.',
  summary: 'Segurança Web e de APIs em um e-commerce: autorização por objeto, condições de corrida em regras de negócio, valores e campos que só o servidor decide, recuperação de conta, requisições do servidor a destinos controlados pelo usuário e uma regra de autorização central registrada em um ADR.',
  area: 'web',
  requires: [],
  missions: [pedidoDeOutraPessoa, cupomQueNaoAcabava, precoDoNavegador, linkDeRecuperacao, previaQueBuscavaDemais, checkoutPorInteiro],
}
