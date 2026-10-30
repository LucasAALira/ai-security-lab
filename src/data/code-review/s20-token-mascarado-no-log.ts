import type { ReviewSample } from './types'

export const tokenMascaradoNoLog: ReviewSample = {
  id: 'token-mascarado-no-log',
  title: 'Segredo que aparece mascarado no registro do pipeline',
  subtitle: 'Treinar o contraponto do vazamento em log: quando o mascaramento basta, e qual é a condição que o sustenta.',
  area: 'supply',
  level: 'Intermediário',
  minutes: 9,
  finding: {
    tool: 'Varredura de registros (ferramenta fictícia)',
    rule: 'CI-012 · variável de ambiente sensível referenciada em passo de execução',
    severity: 'alta',
    line: 9,
    message: 'O passo referencia uma variável marcada como sensível em um comando que escreve na saída padrão.',
    confidence: 'baixa',
  },
  context: [
    'O fluxo publica o pacote interno. Alguém acrescentou uma linha que confirma, antes de publicar, se o token chegou ao trabalho — ela imprime apenas o tamanho do valor e o resultado da checagem.',
    'O repositório é privado e os registros de execução são visíveis para a equipe.',
  ],
  file: '.github/workflows/publicar-pacote.yml',
  language: 'yaml',
  code: [
    'jobs:',
    '  publicar:',
    '    runs-on: ubuntu-latest',
    '    env:',
    '      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - name: conferir se o token chegou',
    '        run: |',
    '          if [ -z "$NPM_TOKEN" ]; then echo "token ausente"; exit 1; fi',
    '          echo "token presente (${#NPM_TOKEN} caracteres)"',
    '      - run: npm ci && npm publish --access restricted',
  ],
  extra: {
    title: 'Registro da última execução e a política da plataforma',
    language: 'text',
    lines: [
      'Run conferir se o token chegou',
      '  token presente (41 caracteres)',
      '',
      'política de mascaramento da plataforma:',
      '  o valor exato de um segredo é substituído por *** na saída',
      '  valores derivados (recortes, base64, hash) NÃO são reconhecidos',
      '  o comprimento do valor não é mascarado',
    ],
    note: 'Compare o que o passo imprime com o que a política cobre.',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'Nada do valor é impresso: o passo imprime o comprimento e uma palavra. A regra marcou a referência à variável, não uma exposição do segredo.',
    'Correto. A referência existe, e o que vai para a saída é o tamanho do valor — informação de baixo proveito, que não permite reconstruir o token.',
    'O trecho, o registro e a política de mascaramento estão todos disponíveis; a decisão não depende de nada que falte.',
  ],
  verdictHints: [
    'Leia com atenção o que cada `echo` coloca na saída.',
    'Compare o que a política mascara com o que o passo imprime.',
    'Confiança baixa aqui reflete uma regra que olha a referência, não o conteúdo impresso.',
  ],
  verdictExplain:
    'O passo testa se a variável está vazia e imprime o comprimento. O valor em si nunca vai para a saída, e nenhuma transformação dele é impressa — que é o caminho pelo qual o mascaramento costuma falhar. Fica a informação do tamanho, que reduz pouco o espaço de busca de um token aleatório de 41 caracteres.',
  signals: [
    { text: 'A única coisa impressa é o comprimento do valor e uma palavra de estado.', feedback: 'Sim: nenhum pedaço do segredo vai para a saída.' },
    { text: 'Não há transformação do segredo (recorte, base64 ou hash) impressa no passo.', feedback: 'Sim: é justamente a transformação que escapa do mascaramento, e ela não existe aqui.' },
    { text: 'O uso do token na publicação acontece dentro do comando, sem eco.', feedback: 'Sim: o valor é consumido pelo processo, e não exibido.' },
    { text: 'O repositório é privado.', feedback: 'Não sustenta o veredito: ajuda a limitar quem lê, e o veredito se apoia em não haver valor impresso.' },
    { text: 'A plataforma mascara o valor exato dos segredos.', feedback: 'Não como sinal principal: confiar só na máscara seria frágil, e aqui nem é preciso, porque nada do valor é impresso.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de falso positivo.',
  signalHints: [
    'Pergunte o que exatamente vai para a saída padrão.',
    'Procure a ausência de transformações do valor.',
    'Dois itens são controles de contexto, não a razão do veredito.',
  ],
  signalExplain:
    'O veredito se sustenta no que é impresso (comprimento e estado), na ausência de valores derivados e no consumo do token sem eco. Repositório privado e mascaramento da plataforma são camadas extras, não o argumento.',
  next: {
    prompt: 'Você vai fechar como falso positivo. O que acompanha o fechamento?',
    options: [
      {
        text: 'Fechar com justificativa apontando o que o passo imprime; trocar a conferência por uma que não revele nem o comprimento (apenas presente ou ausente); e acrescentar à revisão de fluxos a recusa de passos que imprimam segredo transformado, que é o caso que o mascaramento não cobre.',
        quality: 'best',
        flags: ['justifica', 'reduz', 'regra'],
        feedback: 'Fecha com argumento verificável, elimina a informação desnecessária que ainda sobrava e transforma o aprendizado em regra para o caso realmente perigoso.',
        consequence: 'O alerta fecha, o passo passa a dizer apenas se o token chegou e a revisão passa a barrar o padrão que vaza de verdade.',
      },
      {
        text: 'Fechar como falso positivo e silenciar a regra CI-012 em todos os fluxos.',
        quality: 'poor',
        feedback: 'É a mesma regra que apontaria um passo imprimindo o ambiente inteiro ou um valor em base64, que vazam de verdade.',
        consequence: 'O próximo passo de depuração que imprimir variáveis derivadas não gera alerta nenhum.',
      },
      {
        text: 'Remover a conferência do token, porque qualquer referência à variável é risco.',
        quality: 'partial',
        feedback: 'Elimina a mensagem de erro mais útil do fluxo para evitar um risco que não existe nesse formato.',
        consequence: 'Quando o segredo faltar, a falha aparece como erro obscuro da publicação, e não como "token ausente".',
      },
      {
        text: 'Trocar o `echo` por um que imprima os quatro primeiros caracteres, para facilitar a depuração.',
        quality: 'poor',
        feedback: 'Cria exatamente o vazamento que não existia: um recorte do valor é derivado e não é mascarado pela plataforma.',
        consequence: 'O registro passa a conter parte do token, e o fechamento do achado vira a causa de um incidente.',
      },
    ],
    hints: [
      'Pergunte o que ainda sobra de informação na saída.',
      'A regra erra aqui, mas acerta em outro formato.',
      'Uma das opções transforma o falso positivo em positivo.',
    ],
    explain:
      'Fechar bem um falso positivo também é melhorar: tirar o comprimento, que não serve para nada, e guardar a regra para o caso que vaza de verdade — a impressão de valores derivados, que o mascaramento não alcança.',
  },
  closing:
    'O alerta foi fechado com justificativa, a conferência passou a dizer apenas se o token chegou e a revisão de fluxos ganhou a regra contra impressão de segredo transformado.',
  review: {
    solution: [
      'O veredito é falso positivo: o passo imprime o comprimento e o estado, nunca o valor nem uma transformação dele.',
      'Os sinais são o conteúdo impresso, a ausência de valores derivados e o consumo do token sem eco.',
      'O fechamento vem com justificativa, com a retirada do comprimento e com uma regra de revisão para o caso que vaza de verdade.',
    ],
    residual:
      'O comprimento é uma informação pequena, mas real; e o veredito vale enquanto ninguém acrescentar ao passo um recorte, um hash ou uma codificação do valor, que a plataforma não mascara.',
    validation:
      'Rode o fluxo com e sem o segredo configurado e confirme as duas mensagens; e procure nos fluxos do projeto qualquer impressão de valor derivado de segredo, que é o padrão perigoso.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A09' },
    { framework: 'cwe', id: 'CWE-532' },
  ],
  inspiredBy: {
    label: 'GitHub Advisory Database, GHSA-mrrh-fwg8-r2c3 (CVE-2025-30066) (2025-03-15)',
    url: 'https://github.com/advisories/ghsa-mrrh-fwg8-r2c3',
    note: 'O caso real é o contraponto desta amostra: na ação comprometida, os segredos foram codificados em base64 e gravados no registro de execução, ficando legíveis onde os registros eram públicos — o mascaramento da plataforma não reconhece valores derivados. Aqui o passo não imprime valor nem transformação, e por isso o mesmo tipo de alerta não procede. O fluxo é inventado.',
  },
  tags: ['supply', 'segredos', 'falso-positivo'],
}
