import type { ReviewSample } from './types'

export const variaveisNoLog: ReviewSample = {
  id: 'variaveis-no-log',
  title: 'Passo de depuração que imprime o ambiente no log',
  subtitle: 'Treinar o achado em configuração de pipeline: onde o segredo aparece quando o log é público.',
  area: 'supply',
  level: 'Básico',
  minutes: 9,
  finding: {
    tool: 'Varredura de configuração (ferramenta fictícia)',
    rule: 'CI-012 · impressão de variáveis de ambiente em passo de fluxo',
    severity: 'alta',
    line: 14,
    message: 'O passo imprime todas as variáveis de ambiente disponíveis para o trabalho.',
    confidence: 'alta',
  },
  context: [
    'O fluxo publica a documentação a cada mudança na branch principal. Alguém acrescentou um passo de depuração na semana passada, para investigar uma falha de autenticação, e ele ficou.',
    'O repositório é público, e os registros de execução dos fluxos também são.',
  ],
  file: '.github/workflows/publicar-docs.yml',
  language: 'yaml',
  code: [
    'name: publicar documentação',
    'on:',
    '  push:',
    '    branches: [principal]',
    '',
    'jobs:',
    '  publicar:',
    '    runs-on: ubuntu-latest',
    '    env:',
    '      TOKEN_PUBLICACAO: ${{ secrets.TOKEN_PUBLICACAO }}',
    '      CHAVE_CDN: ${{ secrets.CHAVE_CDN }}',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - run: env | sort        # depuração: ver o que o trabalho recebe',
    '      - run: npm ci && npm run docs:build',
    '      - run: node scripts/publicar.js "$TOKEN_PUBLICACAO" "$CHAVE_CDN"',
  ],
  extra: {
    title: 'Trecho do registro da última execução (público)',
    language: 'text',
    lines: [
      'Run env | sort',
      '  CHAVE_CDN=***',
      '  GITHUB_ACTOR=...',
      '  GITHUB_TOKEN=***',
      '  TOKEN_PUBLICACAO_B64=dG9rZW4tZGUtcHVibGljYWNhby1maWN0aWNpbw==',
      '  TOKEN_PUBLICACAO=***',
      '',
      'nota: o passo anterior do fluxo exporta TOKEN_PUBLICACAO_B64=$(echo -n "$TOKEN_PUBLICACAO" | base64)',
    ],
    note: 'Compare as linhas mascaradas com a que não foi mascarada.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. O mascaramento vale para o valor exato registrado como segredo; a variável derivada, codificada em base64, escapa dele e aparece legível no registro público.',
    'Não é falso positivo: ver `***` na maioria das linhas não garante que todas as formas do segredo estejam cobertas, e o registro mostra uma que não está.',
    'Não falta contexto: a configuração do passo, o registro e a transformação que gera a variável derivada estão à vista.',
  ],
  verdictHints: [
    'Compare, no registro, as linhas que saíram mascaradas com a que não saiu.',
    'Pergunte sobre qual valor exato o mascaramento funciona.',
    'Leia a nota sobre o passo anterior do fluxo.',
  ],
  verdictExplain:
    'Plataformas de integração contínua escondem o valor literal do segredo. Qualquer transformação — base64, recorte, hash parcial, concatenação — produz um valor novo que a plataforma não reconhece, e ele sai inteiro no registro. É por isso que imprimir o ambiente continua perigoso mesmo com mascaramento ativo.',
  signals: [
    { text: 'O passo imprime todas as variáveis do trabalho, inclusive as derivadas de segredos.', feedback: 'Sim: é a causa direta, e nenhum segredo precisa estar escrito no arquivo para vazar.' },
    { text: 'A variável em base64 aparece legível no registro, enquanto as demais saem mascaradas.', feedback: 'Sim: é a demonstração de que o mascaramento não alcança valores derivados.' },
    { text: 'O repositório e os registros de execução são públicos.', feedback: 'Sim: define quem pode ler o valor exposto, sem precisar de acesso nenhum.' },
    { text: 'O fluxo usa `actions/checkout` na versão 4.', feedback: 'Não: a versão da ação não tem relação com a impressão do ambiente.' },
    { text: 'Os segredos são declarados no bloco `env` do trabalho.', feedback: 'Não por si: declarar no trabalho é prática comum; o problema é imprimir o ambiente inteiro.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Um sinal está na configuração, um no registro e um no contexto.',
    'Pergunte quem consegue ler esse registro.',
    'Dois itens descrevem escolhas normais de fluxo.',
  ],
  signalExplain:
    'O veredito se sustenta na impressão do ambiente, na variável derivada que escapou do mascaramento e no fato de o registro ser público. Versão da ação e declaração no bloco `env` são detalhes normais.',
  next: {
    prompt: 'O registro é público e a variável saiu legível. Qual é a ordem das ações?',
    options: [
      {
        text: 'Revogar e trocar o token de publicação agora; apagar o registro de execução afetado, sabendo que ele pode ter sido copiado; remover o passo de depuração e proibir a impressão do ambiente por política do fluxo; e reduzir o escopo do token, para que a próxima exposição valha menos.',
        quality: 'best',
        flags: ['revoga', 'remove-passo', 'escopo'],
        feedback: 'Começa pelo que encerra o acesso, trata o registro como já lido e ataca a causa e o alcance ao mesmo tempo.',
        consequence: 'O valor exposto deixa de funcionar, o passo some do fluxo e um vazamento futuro atinge menos coisas.',
      },
      {
        text: 'Remover o passo de depuração e seguir, já que a maioria das variáveis aparecia mascarada.',
        quality: 'poor',
        feedback: 'Remover o passo impede repetir o vazamento e não faz nada quanto ao valor que já saiu em um registro público.',
        consequence: 'O token exposto continua válido e disponível para quem leu o registro antes.',
      },
      {
        text: 'Tornar privados os registros de execução do repositório, mantendo o passo e o token.',
        quality: 'poor',
        feedback: 'Fecha a porta depois que o valor já saiu, e mantém a impressão do ambiente para quem tiver acesso aos registros.',
        consequence: 'A exposição anterior permanece e a prática continua, agora visível só para parte das pessoas.',
      },
      {
        text: 'Trocar o token agora e deixar o passo de depuração até o fim da investigação da falha de autenticação.',
        quality: 'partial',
        feedback: 'A rotação resolve o valor exposto, mas manter o passo garante que o token novo apareça no próximo registro.',
        consequence: 'O segredo é trocado e vaza de novo na execução seguinte, com o mesmo mecanismo.',
      },
    ],
    hints: [
      'Pergunte o que encerra o acesso de quem leu o registro.',
      'Apagar o registro resolve sozinho?',
      'Uma das opções troca o segredo e mantém a torneira aberta.',
    ],
    explain:
      'A ordem é revogar, tratar o registro como já lido, remover a causa e reduzir o escopo. Apagar registro ou fechar a visibilidade não desfaz a leitura; manter o passo de depuração reexpõe o valor novo na execução seguinte.',
  },
  closing:
    'O token foi revogado e trocado, o registro afetado apagado, o passo de depuração removido e o novo token passou a ter escopo restrito à publicação da documentação.',
  review: {
    solution: [
      'O veredito é "procede": o passo imprime o ambiente e a variável derivada em base64 escapa do mascaramento, em um registro público.',
      'Os sinais são a impressão do ambiente, a linha legível no registro e a visibilidade pública da execução.',
      'A conduta correta revoga o token, apaga o registro sabendo que ele pode ter sido lido, remove o passo e reduz o escopo da credencial.',
    ],
    residual:
      'O valor pode ter sido copiado enquanto o registro esteve público, e qualquer transformação de segredo em passo futuro escapa do mascaramento do mesmo jeito: a proteção é não imprimir, não confiar na máscara.',
    validation:
      'Confirme no provedor que o token antigo foi revogado; rode o fluxo e verifique que nenhum valor derivado aparece no registro; e acrescente à revisão de fluxos a recusa de passos que imprimam o ambiente.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A09' },
    { framework: 'cwe', id: 'CWE-532' },
    { framework: 'nist-ssdf', id: 'PO.5' },
  ],
  inspiredBy: {
    label: 'GitHub Advisory Database, GHSA-mrrh-fwg8-r2c3 (CVE-2025-30066), "tj-actions/changed-files allows remote attackers to discover secrets by reading actions logs" (2025-03-15)',
    url: 'https://github.com/advisories/ghsa-mrrh-fwg8-r2c3',
    note: 'No caso real, uma ação de terceiro usada por mais de 23 mil repositórios foi comprometida entre 14 e 15 de março de 2025: o código malicioso varria a memória do processo do executor em busca de segredos, codificava os valores em base64 e os gravava no registro de execução, o que os tornava públicos onde os registros eram públicos. A recomendação foi revisar as execuções da janela e revogar e trocar os segredos expostos. O fluxo desta amostra é inventado, e o vazamento aqui vem de um passo de depuração, não de uma ação comprometida.',
  },
  tags: ['supply', 'segredos', 'procede'],
}
