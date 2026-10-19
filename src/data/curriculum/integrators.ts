/* Desafio integrador de cada módulo: uma missão, um desafio de código ou um projeto do modo
   Arquiteto que junta o que os submódulos ensinam em um cenário só. O integrador é a prática
   recomendada para fechar o módulo; a conclusão do módulo continua medida pelos submódulos.
   Um módulo sem integrador mostra "integrador planejado". */

export type IntegratorKind = 'challenge' | 'mission' | 'architect'

export interface Integrator {
  kind: IntegratorKind
  id: string
}

export const integrators: Record<string, Integrator> = {
  'web-fundamentos': { kind: 'mission', id: 'preco-do-navegador' },
  'web-autenticacao': { kind: 'mission', id: 'link-de-recuperacao' },
  'web-controle-acesso': { kind: 'mission', id: 'pedido-de-outra-pessoa' },
  'web-entradas-saidas': { kind: 'mission', id: 'resposta-que-virou-pagina' },
  'web-design-config': { kind: 'mission', id: 'previa-que-buscava-demais' },
  'web-verificacao': { kind: 'mission', id: 'checkout-por-inteiro' },

  'api-fundamentos': { kind: 'challenge', id: 'endpoint-v1-esquecido' },
  'api-identidade-autz': { kind: 'mission', id: 'controle-so-no-site' },
  'api-abuso-consumo': { kind: 'mission', id: 'limites-de-cada-canal' },
  'api-integracoes': { kind: 'challenge', id: 'webhook-destino-livre' },
  'api-verificacao': { kind: 'challenge', id: 'openapi-rota-sem-seguranca' },

  'ia-fundamentos': { kind: 'mission', id: 'pergunta-do-estagiario' },
  'ia-prompts-saidas': { kind: 'mission', id: 'instrucoes-no-anexo' },
  'ia-rag-seguranca': { kind: 'mission', id: 'quem-colocou-isso-no-indice' },
  'ia-agentes-seguranca': { kind: 'mission', id: 'desenho-do-agente-seguro' },
  'ia-modelos-dados': { kind: 'challenge', id: 'modelo-sem-verificacao' },
  'ia-verificacao': { kind: 'challenge', id: 'executor-que-executa' },

  'rev-fundamentos': { kind: 'challenge', id: 'triagem-do-pacote' },
  'rev-estatica': { kind: 'challenge', id: 'sourcemap-em-producao' },
  'rev-segredos': { kind: 'mission', id: 'chave-no-pacote' },
  'rev-aplicativos': { kind: 'challenge', id: 'rotas-que-o-app-conhece' },
  'rev-modelos': { kind: 'challenge', id: 'habilidade-de-agente' },
  'rev-dinamica': { kind: 'mission', id: 'relatorio-que-corrige' },

  'mob-fundamentos': { kind: 'mission', id: 'biometria-e-o-servidor' },
  'mob-android': { kind: 'mission', id: 'webview-do-pagamento' },
  'mob-ios': { kind: 'mission', id: 'token-no-lugar-errado' },
  'mob-identidade-comunicacao': { kind: 'mission', id: 'rede-que-confiava-em-tudo' },
  'mob-integridade-distribuicao': { kind: 'challenge', id: 'plano-no-corpo' },
  'mob-verificacao': { kind: 'architect', id: 'app-e-backend' },

  'sc-dependencias': { kind: 'mission', id: 'dois-nomes-um-pacote' },
  'sc-repos-pipelines': { kind: 'mission', id: 'pipeline-que-podia-tudo' },
  'sc-artefatos': { kind: 'mission', id: 'assinado-e-inventariado' },
  'sc-verificacoes': { kind: 'mission', id: 'lista-de-pendencias' },
  'sc-incidentes': { kind: 'mission', id: 'sexta-17h42' },

  'arq-modelagem': { kind: 'mission', id: 'mapa-dos-canais' },
  'arq-identidade-dados': { kind: 'mission', id: 'chave-que-o-agente-carregava' },
  'arq-integradas': { kind: 'architect', id: 'conta-multicanal' },
  'arq-decisoes': { kind: 'mission', id: 'lancar-com-condicoes' },
  'arq-oficina': { kind: 'architect', id: 'loja-web-api' },

  'gov-desenvolvimento': { kind: 'mission', id: 'portao-de-liberacao' },
  'gov-ia': { kind: 'mission', id: 'fornecedor-de-antifraude' },
  'gov-privacidade': { kind: 'mission', id: 'o-que-o-sistema-guarda' },
}
