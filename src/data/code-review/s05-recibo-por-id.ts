import type { ReviewSample } from './types'

export const reciboPorId: ReviewSample = {
  id: 'recibo-por-id',
  title: 'Recibo buscado só pelo identificador',
  subtitle: 'Treinar o achado que a ferramenta não encontra: autenticado não é o mesmo que autorizado.',
  area: 'api',
  level: 'Básico',
  minutes: 9,
  finding: {
    tool: 'Revisão de pedido de mudança (colega de equipe)',
    rule: 'Revisão manual · "confere se o recibo é da pessoa?"',
    severity: 'alta',
    line: 7,
    message: 'A rota busca o recibo apenas pelo identificador recebido na URL.',
    confidence: 'média',
  },
  context: [
    'A API de recibos é usada pelo aplicativo e pelo painel web. O identificador do recibo é sequencial e aparece na URL que a pessoa vê depois de uma compra.',
    'A rota está atrás do middleware de autenticação: sem token válido, a requisição nem chega aqui.',
  ],
  file: 'src/recibos/rotas.ts',
  language: 'ts',
  code: [
    'router.use(exigirAutenticacao) // popula req.user com id, loja e papel',
    '',
    'router.get("/recibos/:id", async (req, res) => {',
    '  const id = Number(req.params.id)',
    '  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" })',
    '',
    '  const recibo = await db.recibo.findUnique({ where: { id } })',
    '  if (!recibo) return res.status(404).json({ erro: "não encontrado" })',
    '',
    '  res.json({',
    '    id: recibo.id,',
    '    valor: recibo.valor,',
    '    comprador: recibo.compradorNome,',
    '    documento: recibo.compradorDocumento,',
    '    itens: recibo.itens,',
    '  })',
    '})',
  ],
  extra: {
    title: 'Rota vizinha, no mesmo arquivo',
    language: 'ts',
    lines: [
      'router.get("/recibos", async (req, res) => {',
      '  const lista = await db.recibo.findMany({ where: { compradorId: req.user.id } })',
      '  res.json(lista)',
      '})',
      '',
      '// registro de acesso: 1.284 chamadas a /recibos/:id por dia, 3 origens distintas',
    ],
    note: 'A listagem filtra por dono; a busca por identificador, não.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. Qualquer conta autenticada pode trocar o número na URL e receber o recibo de outra pessoa, com nome e documento do comprador. A rota vizinha mostra que o filtro por dono existe e foi esquecido aqui.',
    'A autenticação impede quem não tem conta, e é só isso: ela não decide de quem é o recibo. A falha continua aberta para qualquer pessoa cadastrada.',
    'O trecho tem o que importa: a consulta sem filtro de dono, os campos devolvidos e a rota vizinha com o filtro correto.',
  ],
  verdictHints: [
    'Compare a consulta da linha 7 com a da rota vizinha.',
    'Pergunte o que acontece se outra pessoa trocar o número na URL.',
    'Validar o formato do identificador não diz nada sobre quem pode vê-lo.',
  ],
  verdictExplain:
    'Essa é a falha que varreduras automáticas raramente encontram: o código está correto do ponto de vista de sintaxe e de tipos, e a verificação que falta é uma regra de negócio. O identificador é sequencial, então percorrer os recibos alheios é trivial.',
  signals: [
    { text: 'A consulta usa apenas `where: { id }`, sem nenhuma condição ligada a quem pediu.', feedback: 'Sim: é a ausência que define a falha de autorização em objeto.' },
    { text: 'A resposta inclui nome e documento do comprador.', feedback: 'Sim: define a gravidade, porque o vazamento alcança dado pessoal e não só valores.' },
    { text: 'A rota vizinha filtra por `compradorId`, o que mostra que o padrão existe no projeto.', feedback: 'Sim: a comparação interna é o argumento mais forte na revisão, porque não depende de teoria.' },
    { text: 'O identificador é validado como inteiro positivo.', feedback: 'Não: validar formato evita erro de consulta, e nada impede pedir o inteiro de outra pessoa.' },
    { text: 'A rota está atrás do middleware de autenticação.', feedback: 'Não: autenticação diz quem é, autorização diz o que essa pessoa pode ver; falta a segunda.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Procure a condição que deveria existir na consulta.',
    'A rota vizinha serve de comparação.',
    'Dois itens tratam de formato e identidade, não de permissão.',
  ],
  signalExplain:
    'O que sustenta o veredito é a consulta sem vínculo com quem pede, a sensibilidade do que é devolvido e a existência do padrão correto a poucas linhas dali. Validação de formato e autenticação resolvem outras perguntas.',
  next: {
    prompt: 'A falha é de autorização e a rota está em produção há meses. Qual conduta?',
    options: [
      {
        text: 'Incluir o vínculo com quem pede na própria consulta (`compradorId` do token, ou papel autorizado da loja), devolver 404 em vez de 403 para não revelar existência, procurar no projeto outras rotas que busquem por identificador sem vínculo e levantar nos registros se houve acesso a recibos de terceiros.',
        quality: 'best',
        flags: ['autorizacao', 'varredura', 'investiga'],
        feedback: 'Corrige na consulta, evita vazar a existência do recurso, procura as irmãs da mesma falha e trata a pergunta que toda falha antiga levanta: isso já foi explorado?',
        consequence: 'A rota passa a responder só ao dono, as rotas parecidas entram na fila e a equipe sabe dizer se houve acesso indevido no período.',
      },
      {
        text: 'Trocar o identificador sequencial por um identificador aleatório longo, mantendo a consulta como está.',
        quality: 'poor',
        feedback: 'Identificador difícil de adivinhar esconde o problema sem resolvê-lo: quem recebeu um link, um recibo encaminhado ou um registro antigo continua acessando o de outra pessoa.',
        consequence: 'A exploração em massa fica mais difícil, o acesso indevido pontual continua possível e a falha some do radar.',
      },
      {
        text: 'Verificar a permissão no aplicativo e no painel, antes de chamar a API.',
        quality: 'poor',
        feedback: 'A verificação no cliente não vale: a API responde a qualquer chamada direta com um token válido, sem passar por tela nenhuma.',
        consequence: 'As telas ficam coerentes e a API continua entregando recibos alheios a quem chamar direto.',
      },
      {
        text: 'Incluir o vínculo na consulta e seguir para o próximo achado.',
        quality: 'good',
        flags: ['autorizacao'],
        feedback: 'A correção central está certa. Faltam duas coisas que esse tipo de falha sempre pede: procurar rotas irmãs e verificar o histórico de acesso.',
        consequence: 'Esta rota fica correta; outra rota com o mesmo descuido permanece aberta, e ninguém sabe se houve acesso indevido.',
      },
    ],
    hints: [
      'A correção pertence à consulta, e não à tela.',
      'Pense no que mais existe no projeto com o mesmo formato de rota.',
      'Falha antiga levanta uma pergunta sobre o passado.',
    ],
    explain:
      'Em falha de autorização em objeto, a correção é sempre no servidor e dentro da consulta. Depois vêm as duas perguntas que a correção não responde: onde mais isso acontece e o que já aconteceu. Identificador aleatório e verificação no cliente deixam a porta aberta.',
  },
  closing:
    'A consulta passou a exigir o vínculo com quem pede, duas rotas irmãs entraram na fila e os registros dos últimos noventa dias foram revisados em busca de acesso cruzado.',
  review: {
    solution: [
      'O veredito é "procede": a consulta busca o recibo só pelo identificador, e qualquer conta autenticada alcança o recibo alheio.',
      'Os sinais são a consulta sem vínculo, o dado pessoal na resposta e a rota vizinha que já filtra por dono.',
      'A conduta completa corrige na consulta, responde 404 para não revelar existência, procura rotas irmãs e investiga o histórico de acesso.',
    ],
    residual:
      'A correção não desfaz o que já foi acessado, e a revisão dos registros depende da retenção disponível: fora dessa janela, não há como afirmar que nada aconteceu.',
    validation:
      'Com duas contas de teste, peça o recibo da outra e confirme 404; repita com papel administrativo e confirme o acesso permitido; e verifique nos registros se o número de chamadas com resposta 200 por conta mudou depois da correção.',
  },
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API1' },
    { framework: 'owasp-top10', id: 'A01' },
    { framework: 'cwe', id: 'CWE-639' },
  ],
  tags: ['api', 'autorizacao', 'procede'],
}
