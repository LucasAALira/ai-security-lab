import type { CampaignContent } from '../types'
import { perguntaDoEstagiario } from './m1-pergunta-do-estagiario'
import { instrucoesNoAnexo } from './m2-instrucoes-no-anexo'
import { historicoDeOutraCorretora } from './m3-historico-de-outra-corretora'
import { respostaQueVirouPagina } from './m4-resposta-que-virou-pagina'
import { quemColocouIssoNoIndice } from './m5-quem-colocou-isso-no-indice'
import { oQueOSistemaGuarda } from './m6-o-que-o-sistema-guarda'

export const campaign2: CampaignContent = {
  id: 'assistente-sabia-demais',
  title: 'O assistente que sabia demais',
  company: 'Tangará Seguros',
  tagline: 'Uma assistente que responde tudo, inclusive o que ninguém devia perguntar.',
  summary: 'Segurança de assistentes com busca em documentos (RAG): permissão na recuperação, instruções escondidas em anexos, isolamento entre clientes, saída do modelo tratada como entrada de ataque, origem do conteúdo indexado e o que o sistema guarda, expõe e consome.',
  area: 'ia',
  requires: [],
  missions: [perguntaDoEstagiario, instrucoesNoAnexo, historicoDeOutraCorretora, respostaQueVirouPagina, quemColocouIssoNoIndice, oQueOSistemaGuarda],
}
