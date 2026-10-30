import type { ReviewSample } from './types'

export const tokenNoTeste: ReviewSample = {
  id: 'token-no-teste',
  title: 'Token de integração dentro de um teste',
  subtitle: 'Treinar o argumento mais comum da triagem de segredos: "é só um teste" — e por que ele quase nunca se sustenta.',
  area: 'supply',
  level: 'Básico',
  minutes: 8,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-011 · credencial de provedor em arquivo versionado',
    severity: 'alta',
    line: 6,
    message: 'Token com formato de credencial de produção encontrado em arquivo de teste.',
    confidence: 'alta',
  },
  context: [
    'O teste de integração chama o provedor de mensagens de verdade, para conferir o envio ponta a ponta. Ele roda na integração contínua a cada pedido de mudança.',
    'A pessoa autora responde na revisão: "é um token de teste, da conta de sandbox; pode fechar".',
  ],
  file: 'tests/integracao/mensagens.test.ts',
  language: 'ts',
  code: [
    'import { describe, expect, it } from "vitest"',
    'import { Mensageiro } from "@/integracoes/mensageiro"',
    '',
    'describe("envio de mensagens", () => {',
    '  it("envia para o destinatário informado", async () => {',
    '    const mensageiro = new Mensageiro({ token: "msg_live_9f2c41d8e7b04a5c" })',
    '    const r = await mensageiro.enviar({ para: "+5500000000000", texto: "teste de integração" })',
    '    expect(r.status).toBe("aceito")',
    '  })',
    '})',
  ],
  extra: {
    title: 'O que o histórico e o painel do provedor mostram',
    language: 'text',
    lines: [
      '$ git log --oneline -S"msg_live_" -- tests/',
      'a91c3f0  adiciona teste de integração do mensageiro   (há 7 meses)',
      '',
      'painel do provedor > tokens:',
      '  msg_live_9f2c41d8e7b04a5c   ambiente: produção   envios no mês: 18.402   criado há 9 meses',
      '  msg_test_0a1b2c3d4e5f6071   ambiente: sandbox    envios no mês: 24       criado há 9 meses',
      '',
      'o repositório é público desde a migração, há 4 meses',
    ],
    note: 'Compare o prefixo do token do teste com os tokens do painel.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. O prefixo `msg_live_` corresponde ao token de produção do painel, que enviou mais de dezoito mil mensagens no mês. O token está versionado há sete meses em um repositório público desde o quarto mês.',
    'A explicação de que seria um token de sandbox não se sustenta: o painel mostra prefixos diferentes para sandbox e produção, e o do teste é o de produção.',
    'Não falta contexto: o histórico mostra desde quando, o painel mostra qual conta e o repositório é público. A decisão pode ser tomada agora, e com urgência.',
  ],
  verdictHints: [
    'Compare caractere por caractere o token do teste com os do painel.',
    'Veja há quanto tempo o valor está no histórico e desde quando o repositório é público.',
    'A explicação da pessoa autora é uma hipótese: confirme com evidência.',
  ],
  verdictExplain:
    'Segredo versionado vale pelo que ele abre, não por onde está escrito. Aqui o valor abre a conta de produção do provedor, está no histórico há meses e ficou público quando o repositório abriu. Remover a linha no próximo commit não resolve: o histórico guarda o valor.',
  signals: [
    { text: 'O prefixo `msg_live_` identifica a conta de produção no painel do provedor.', feedback: 'Sim: é a evidência que derruba a explicação de que seria um token de sandbox.' },
    { text: 'O token está no histórico do repositório há sete meses.', feedback: 'Sim: apagar a linha agora não remove o valor do histórico, que continua acessível.' },
    { text: 'O repositório é público há quatro meses.', feedback: 'Sim: muda o cálculo de exposição de interno para qualquer pessoa na internet.' },
    { text: 'O teste roda na integração contínua a cada pedido de mudança.', feedback: 'Não como sinal do vazamento: isso explica por que existe um token aqui, não se ele é de produção.' },
    { text: 'O número de telefone do teste é claramente fictício.', feedback: 'Não: o destinatário fictício é bom cuidado e não diz nada sobre a credencial usada.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Três sinais respondem: qual conta, desde quando e visível para quem.',
    'Dois itens descrevem o teste, não o segredo.',
    'O painel do provedor é a fonte que confirma o ambiente.',
  ],
  signalExplain:
    'Os sinais respondem às três perguntas da triagem de segredo: o que ele abre, há quanto tempo está exposto e quem pôde ver. O resto descreve o teste e não altera o veredito.',
  next: {
    prompt: 'O segredo é de produção e está exposto. Qual é a primeira sequência de ações?',
    options: [
      {
        text: 'Revogar o token no provedor agora, emitir outro e guardá-lo no cofre da integração contínua; levantar no painel o uso recente em busca de envios que a equipe não reconheça; e só então reescrever o teste para usar a variável de ambiente, registrando que o valor exposto permanece no histórico.',
        quality: 'best',
        flags: ['revoga', 'investiga', 'corrige'],
        feedback: 'Coloca a revogação antes de tudo, porque é ela que encerra a exposição, e trata o histórico como fato consumado em vez de tentar apagá-lo.',
        consequence: 'O token antigo deixa de funcionar em minutos; o uso indevido, se houve, aparece no levantamento; e o teste passa a ler a credencial do cofre.',
      },
      {
        text: 'Remover a linha do teste e fazer um commit com a mensagem "remove token", mantendo o token ativo.',
        quality: 'poor',
        feedback: 'O valor continua no histórico e continua válido: o commit só anuncia onde procurar, sem fechar nada.',
        consequence: 'Quem acompanha o repositório encontra o token no histórico com um ponteiro claro, e ele segue funcionando.',
      },
      {
        text: 'Reescrever o histórico do repositório para apagar o token e seguir com o mesmo valor em uso.',
        quality: 'poor',
        feedback: 'Reescrever o histórico de um repositório público não apaga clones, bifurcações nem caches; e deixa a credencial ativa.',
        consequence: 'O esforço é grande, o valor continua circulando em cópias e a conta permanece aberta para quem já o copiou.',
      },
      {
        text: 'Trocar o token do teste pelo de sandbox e deixar a revogação do de produção para a próxima janela de manutenção.',
        quality: 'partial',
        feedback: 'Arrumar o teste é correto, mas adiar a revogação mantém aberta exatamente a conta que importa.',
        consequence: 'O repositório fica limpo daqui para frente e a conta de produção segue acessível a quem já tem o valor.',
      },
    ],
    hints: [
      'Pergunte qual ação encerra a exposição, e não apenas a presença no código.',
      'O histórico de um repositório público não volta atrás.',
      'Há uma pergunta sobre o passado que precisa de resposta.',
    ],
    explain:
      'Em vazamento de credencial, a ordem é revogar, investigar o uso e depois corrigir o código. Remover a linha, reescrever o histórico ou adiar a revogação deixam a conta aberta, que é o que de fato importa.',
  },
  closing:
    'O token foi revogado em minutos, o painel não mostrou envios estranhos no período e o teste passou a ler a credencial de sandbox do cofre da integração contínua.',
  review: {
    solution: [
      'O veredito é "procede": o prefixo identifica a conta de produção, o valor está no histórico há sete meses e o repositório é público há quatro.',
      'Os sinais são o prefixo de produção, o tempo no histórico e a visibilidade pública do repositório.',
      'A conduta correta começa pela revogação, segue pelo levantamento de uso e termina na correção do teste, registrando que o valor permanece no histórico.',
    ],
    residual:
      'O valor exposto continua em clones e cópias do histórico, e o levantamento de uso alcança apenas o período que o provedor retém. Revogar encerra o acesso, não a cópia.',
    validation:
      'Tente enviar uma mensagem com o token antigo e confirme a recusa; confira no painel que o token novo só é usado pela integração contínua; e rode o teste em um ambiente limpo para confirmar que ele lê a credencial do cofre.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A08' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'nist-ssdf', id: 'PS.1' },
  ],
  tags: ['supply', 'segredos', 'procede'],
}
