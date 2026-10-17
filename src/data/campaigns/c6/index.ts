import type { CampaignContent } from '../types'
import { biometriaEOServidor } from './m6-biometria-e-o-servidor'
import { linkQueAbriaTudo } from './m2-link-que-abria-tudo'
import { rastrosPeloCaminho } from './m5-rastros-pelo-caminho'
import { redeQueConfiavaEmTudo } from './m4-rede-que-confiava-em-tudo'
import { tokenNoLugarErrado } from './m1-token-no-lugar-errado'
import { webviewDoPagamento } from './m3-webview-do-pagamento'

export const campaign6: CampaignContent = {
  id: 'app-deixou-rastros',
  title: 'O aplicativo que deixou rastros',
  company: 'Pulso',
  tagline: 'Tokens em arquivos comuns, links que abrem tudo e resultados de exame onde ninguém devia ver.',
  summary: 'Segurança Mobile no Android e no iOS: armazenamento local e backups, deep links e links verificados, WebViews e componentes exportados, validação de TLS, dados sensíveis em registros, notificações e SDKs, e uma linha de base de segurança mobile registrada em um ADR.',
  area: 'mobile',
  requires: [],
  missions: [tokenNoLugarErrado, linkQueAbriaTudo, webviewDoPagamento, redeQueConfiavaEmTudo, rastrosPeloCaminho, biometriaEOServidor],
}
