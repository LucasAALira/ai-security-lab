import type { CampaignContent } from '../types'
import { sexta17h42 } from './m1-sexta-17h42'
import { instalarEExecutar } from './m2-instalar-e-executar'
import { doisNomesUmPacote } from './m3-dois-nomes-um-pacote'
import { pipelineQuePodiaTudo } from './m4-pipeline-que-podia-tudo'
import { assinadoEInventariado } from './m5-assinado-e-inventariado'
import { nuncaMaisNaSexta } from './m6-nunca-mais-na-sexta'

export const campaign1: CampaignContent = {
  id: 'atualizacao-confiavel',
  title: 'A atualização confiável',
  company: 'Aurora',
  tagline: 'Uma atualização automática, um alerta de rede e uma sexta-feira que não acaba.',
  summary: 'Cadeia de suprimentos de software: dependências, scripts de instalação, pipelines, assinatura, inventário e o processo que decide o que entra em produção.',
  area: 'supply',
  requires: [],
  missions: [sexta17h42, instalarEExecutar, doisNomesUmPacote, pipelineQuePodiaTudo, assinadoEInventariado, nuncaMaisNaSexta],
}
