import type { ReviewSample } from './types'

export const filtroDeRelatorio: ReviewSample = {
  id: 'filtro-de-relatorio',
  title: 'Filtro de relatório montado com o que vem da URL',
  subtitle: 'Treinar o caminho do dado: a mesma função usa parâmetro vinculado em um lugar e concatenação em outro.',
  area: 'api',
  level: 'Básico',
  minutes: 10,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'SQL-001 · consulta montada por concatenação',
    severity: 'alta',
    line: 12,
    message: 'Consulta SQL construída com concatenação de string. Use parâmetros vinculados.',
    confidence: 'média',
  },
  context: [
    'O relatório de vendas aceita filtros opcionais pela consulta da URL: `status`, `uf` e `vendedor`. O endpoint é autenticado, mas qualquer pessoa com conta pode chamá-lo.',
    'A equipe argumenta que a regra já disparou antes em um caso parecido e foi fechada como falso positivo, então talvez seja o mesmo.',
  ],
  file: 'src/relatorios/vendas.ts',
  language: 'ts',
  code: [
    'const CAMPOS: Record<string, string> = { status: "v.status", uf: "c.uf" }',
    '',
    'export async function vendas(req: Request) {',
    '  const { status, uf, vendedor, de, ate } = req.query as Record<string, string>',
    '  const condicoes: string[] = ["v.loja_id = $1", "v.data BETWEEN $2 AND $3"]',
    '  const valores: unknown[] = [req.user.lojaId, de, ate]',
    '',
    '  for (const [chave, valor] of Object.entries({ status, uf })) {',
    '    if (!valor) continue',
    '    valores.push(valor)',
    '    condicoes.push(`${CAMPOS[chave]} = $${valores.length}`)',
    '  }',
    '  if (vendedor) condicoes.push("v.vendedor_id = " + vendedor)',
    '',
    '  const sql = `SELECT v.* FROM vendas v JOIN clientes c ON c.id = v.cliente_id',
    '               WHERE ${condicoes.join(" AND ")} ORDER BY v.data DESC LIMIT 500`',
    '  return db.query(sql, valores)',
    '}',
  ],
  extra: {
    title: 'Registro de uma chamada em produção (fictício)',
    language: 'text',
    lines: [
      'GET /api/relatorios/vendas?de=2026-01-01&ate=2026-03-31&vendedor=42 HTTP/1.1',
      'Host: api.loja.example',
      '',
      'GET /api/relatorios/vendas?de=2026-01-01&ate=2026-03-31&vendedor=0%20OR%201%3D1 HTTP/1.1',
      'Host: api.loja.example',
      '  -> 200 OK, 500 linhas (o filtro por vendedor deixou de restringir)',
    ],
    note: 'Compare as duas chamadas e o número de linhas devolvido.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. A linha 13 concatena `vendedor` direto na condição, e esse valor vem da consulta da URL sem passar por mapa, conversão ou lista fechada. O registro mostra o efeito: o filtro deixa de restringir.',
    'O caso parecido de antes tinha valores de um mapa fixo; aqui o valor vem do pedido e entra inteiro na consulta. A semelhança entre os dois alertas é só a forma.',
    'Não falta contexto: o trecho mostra a origem do valor (`req.query`), o caminho até a consulta e um registro com o efeito. Já dá para decidir.',
  ],
  verdictHints: [
    'Compare a linha 11 com a linha 13: as duas montam condição, mas de jeitos diferentes.',
    'Procure de onde vem cada valor que entra na string final.',
    'O registro de produção mostra o que acontece quando o filtro recebe uma expressão.',
  ],
  verdictExplain:
    'Dentro da mesma função convivem o jeito certo e o errado: o laço empurra o valor para `valores` e usa posição (`$n`), enquanto a linha do vendedor concatena texto cru. Como o valor vem da URL, qualquer expressão SQL válida entra na condição.',
  signals: [
    { text: '`vendedor` vem de `req.query` e é concatenado direto na condição, sem virar parâmetro.', feedback: 'Sim: é o ponto exato da falha, e o contraste com o laço acima deixa evidente que foi um esquecimento.' },
    { text: 'Não há conversão para número nem validação do formato antes de usar o valor.', feedback: 'Sim: uma conversão para inteiro já quebraria a injeção, e ela não existe.' },
    { text: 'O registro mostra a chamada com `0 OR 1=1` devolvendo o limite inteiro de linhas.', feedback: 'Sim: é a confirmação prática de que a condição foi alterada por quem chamou.' },
    { text: 'O endpoint exige autenticação.', feedback: 'Não muda o veredito: exigir conta reduz quem alcança a falha, mas não impede quem tem conta de explorá-la.' },
    { text: 'A consulta tem `LIMIT 500`.', feedback: 'Não: o limite reduz o volume por chamada, e nada impede repetir a chamada ou alterar outras condições.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de que o achado procede.',
  signalHints: [
    'Dois sinais estão no código e um está no registro.',
    'Pergunte o que impediria a expressão de chegar ao banco.',
    'Autenticação e limite mudam o alcance, não a existência da falha.',
  ],
  signalExplain:
    'O que sustenta o veredito é a origem do valor, a ausência de conversão e a evidência de efeito. Autenticação e `LIMIT` são controles de alcance: eles tornam a exploração menos barulhenta, não impossível.',
  next: {
    prompt: 'O achado procede e o endpoint está em produção. Qual é a conduta?',
    options: [
      {
        text: 'Corrigir agora passando `vendedor` como parâmetro posicional, como o laço já faz; procurar no projeto outras concatenações no mesmo padrão; e registrar no achado o commit da correção, com um teste que envie uma expressão SQL e espere resultado vazio.',
        quality: 'best',
        flags: ['corrige', 'procura', 'teste'],
        feedback: 'Corrige a causa com o padrão que já existe no arquivo, procura as irmãs da mesma falha e deixa um teste que impede a volta dela.',
        consequence: 'A consulta volta a filtrar, o relatório continua funcionando e uma regressão futura falha no teste antes de chegar à produção.',
      },
      {
        text: 'Bloquear no firewall de aplicação as requisições cujo parâmetro `vendedor` contenha palavras de SQL.',
        quality: 'partial',
        feedback: 'A barreira ajuda enquanto a correção não sai, mas filtro por palavra é contornável e deixa a falha no código.',
        consequence: 'O ataque evidente para de passar, variações continuam, e o achado segue aberto no código por tempo indeterminado.',
      },
      {
        text: 'Converter `vendedor` para número antes de concatenar, mantendo a montagem da consulta como está.',
        quality: 'good',
        flags: ['corrige'],
        feedback: 'Resolve este caso, porque um inteiro não carrega expressão. Mas mantém o padrão perigoso no arquivo, pronto para o próximo campo que não for numérico.',
        consequence: 'A falha atual fecha; a próxima pessoa copia a linha para um campo de texto e reabre o mesmo problema.',
      },
      {
        text: 'Fechar o achado como falso positivo, porque um caso parecido já foi fechado assim.',
        quality: 'poor',
        feedback: 'O caso anterior tinha valores de um mapa fixo. Repetir o veredito pela semelhança do alerta ignora a diferença que importa: a origem do valor.',
        consequence: 'A falha continua explorável por qualquer pessoa com conta, agora com um registro dizendo que foi analisada e aprovada.',
      },
    ],
    hints: [
      'A correção certa já está escrita algumas linhas acima.',
      'Pergunte o que acontece com o próximo campo adicionado ao filtro.',
      'Mitigar na borda não é o mesmo que corrigir.',
    ],
    explain:
      'A melhor conduta usa o padrão que o próprio arquivo já aplica, procura as outras ocorrências e prende o comportamento com teste. Converter para número funciona aqui e falha na próxima; bloquear na borda compra tempo; repetir um veredito anterior por semelhança é o erro que a triagem deveria evitar.',
  },
  closing:
    'O filtro voltou a usar parâmetro posicional, a varredura por padrões iguais encontrou mais duas ocorrências e o teste de regressão entrou junto com a correção.',
  review: {
    solution: [
      'O veredito é "procede": `vendedor` vem da URL e é concatenado direto na condição, sem conversão nem lista fechada.',
      'Os sinais são a concatenação do valor externo, a ausência de conversão e o registro mostrando o filtro deixando de restringir.',
      'A conduta adequada é corrigir com parâmetro posicional, procurar ocorrências iguais e registrar a correção com teste de regressão.',
    ],
    residual:
      'Mesmo corrigido, o relatório continua devolvendo dados de toda a loja para qualquer conta autenticada: o escopo por usuário é outra discussão, que o achado de injeção não cobre.',
    validation:
      'Repita a chamada com uma expressão no lugar do identificador e confirme resultado vazio; rode o teste de regressão na integração contínua; e verifique no banco, pelos registros de consulta, que a condição chega com parâmetro e não com texto embutido.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A05' },
    { framework: 'owasp-api-top10', id: 'API8' },
    { framework: 'cwe', id: 'CWE-89' },
  ],
  tags: ['api', 'sql', 'procede'],
}
