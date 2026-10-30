import type { ReviewSample } from './types'

export const scriptBaixadoNoPipeline: ReviewSample = {
  id: 'script-baixado-no-pipeline',
  title: 'Script de terceiro baixado e executado no pipeline',
  subtitle: 'Treinar o achado de integridade: o que o pipeline executa sem conferir, e com quais segredos no ambiente.',
  area: 'supply',
  level: 'Intermediário',
  minutes: 11,
  finding: {
    tool: 'Varredura de configuração (ferramenta fictícia)',
    rule: 'CI-031 · execução de conteúdo remoto sem verificação de integridade',
    severity: 'alta',
    line: 11,
    message: 'O passo baixa um script por HTTPS e o executa diretamente, sem conferir resumo nem assinatura.',
    confidence: 'alta',
  },
  context: [
    'O pipeline de testes envia o relatório de cobertura para um serviço externo. O comando recomendado pela documentação do serviço é baixar o enviador e executá-lo.',
    'O trabalho tem no ambiente o token de publicação de pacotes e as credenciais de implantação, porque a mesma definição serve a três etapas.',
  ],
  file: '.gitlab-ci.yml',
  language: 'yaml',
  code: [
    'testes:',
    '  image: node:22',
    '  variables:',
    '    NPM_TOKEN: $NPM_TOKEN',
    '    DEPLOY_KEY: $DEPLOY_KEY',
    '    COBERTURA_TOKEN: $COBERTURA_TOKEN',
    '  script:',
    '    - npm ci',
    '    - npm test -- --coverage',
    '    # enviador de cobertura, conforme a documentação do serviço',
    '    - curl -s https://enviador.cobertura.example/bash | bash',
    '    - npm run build',
    '    - node scripts/implantar.js',
  ],
  extra: {
    title: 'O que o enviador faz, segundo a própria documentação',
    language: 'text',
    lines: [
      '1. procura os arquivos de cobertura na pasta do projeto',
      '2. coleta variáveis de ambiente do trabalho para identificar o commit e o build',
      '3. envia os arquivos e as variáveis coletadas ao serviço',
      '',
      'a lista de variáveis coletadas varia conforme o provedor de integração contínua detectado',
      'o script é servido por HTTPS; a documentação não publica resumo nem assinatura da versão',
    ],
    note: 'Repare no passo 2 e no que ele significa quando o ambiente tem outros segredos.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. O pipeline executa, a cada rodada, um script que pode mudar a qualquer momento, sem conferência de integridade, em um ambiente que carrega token de pacotes e chave de implantação.',
    'Não é falso positivo: o HTTPS garante de quem veio o arquivo naquele instante, não que o conteúdo seja o mesmo de ontem nem que seja confiável.',
    'Não falta contexto: o conteúdo do ambiente, o comando e o comportamento declarado do enviador estão descritos.',
  ],
  verdictHints: [
    'Pergunte o que mudaria se o arquivo servido fosse alterado hoje à noite.',
    'Liste os segredos presentes no ambiente quando esse comando roda.',
    'HTTPS responde "de quem veio", não "o que mudou".',
  ],
  verdictExplain:
    'Executar conteúdo remoto sem verificação junta dois riscos: o conteúdo pode mudar sem aviso e o processo herda tudo o que está no ambiente. Como o enviador coleta variáveis por desenho, a diferença entre uso normal e exfiltração é apenas a lista do que ele resolve coletar.',
  signals: [
    { text: 'O script é executado direto do endereço remoto, sem resumo nem assinatura conferidos.', feedback: 'Sim: qualquer alteração na origem entra na próxima execução sem aviso.' },
    { text: 'O ambiente do trabalho carrega token de pacotes e chave de implantação, além do token de cobertura.', feedback: 'Sim: define o que um script hostil alcançaria, bem além da função dele.' },
    { text: 'O próprio enviador coleta variáveis de ambiente por desenho.', feedback: 'Sim: o comportamento legítimo já é parecido com o malicioso, o que torna a diferença difícil de perceber.' },
    { text: 'A imagem usada é `node:22`.', feedback: 'Não: a imagem base não tem relação com a verificação do script remoto.' },
    { text: 'O download usa HTTPS.', feedback: 'Não sustenta o veredito: HTTPS protege o transporte, e o problema é a ausência de verificação do conteúdo.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Separe o que protege o transporte do que verifica o conteúdo.',
    'Olhe a lista de variáveis do trabalho.',
    'Um dos sinais é sobre o comportamento normal do enviador.',
  ],
  signalExplain:
    'O veredito se apoia na execução sem verificação, no conjunto de segredos presentes e no fato de o enviador já coletar variáveis por desenho. HTTPS e imagem base não mudam nada disso.',
  next: {
    prompt: 'O pipeline precisa continuar enviando a cobertura. Qual desenho resolve o achado?',
    options: [
      {
        text: 'Fixar uma versão do enviador por resumo criptográfico (ou usar o pacote publicado e verificado), conferindo antes de executar; separar o envio de cobertura em um trabalho próprio, que recebe só o token de cobertura; e deixar token de pacotes e chave de implantação apenas nas etapas que de fato publicam.',
        quality: 'best',
        flags: ['integridade', 'separa', 'minimo'],
        feedback: 'Trata a integridade do que é executado e reduz o que está disponível para ser roubado, que são os dois lados do problema.',
        consequence: 'Uma alteração na origem passa a quebrar a verificação, e um comprometimento do enviador alcança apenas o token de cobertura.',
      },
      {
        text: 'Hospedar uma cópia do script em um repositório interno e executá-la de lá, sem fixar versão.',
        quality: 'good',
        flags: ['integridade'],
        feedback: 'Tira a dependência da origem externa a cada execução, que é um bom ganho. Sem fixar versão e sem conferir o conteúdo na atualização, o problema volta na próxima sincronização.',
        consequence: 'O pipeline deixa de buscar o arquivo externo, e a cópia interna vira o novo ponto a vigiar.',
      },
      {
        text: 'Manter o comando e revisar o conteúdo do script manualmente uma vez por mês.',
        quality: 'poor',
        feedback: 'A revisão mensal olha uma versão qualquer; o pipeline executa a versão do momento, que pode mudar no dia seguinte.',
        consequence: 'A revisão dá conforto sem reduzir a janela: a execução continua usando o que estiver no ar.',
      },
      {
        text: 'Remover o envio de cobertura do pipeline.',
        quality: 'partial',
        feedback: 'Elimina o risco e junto a informação que a equipe usa; é uma saída quando não há alternativa, não a primeira escolha.',
        consequence: 'O risco some, a cobertura deixa de ser acompanhada e alguém reintroduz o comando meses depois.',
      },
    ],
    hints: [
      'Pense nas duas perguntas: o que é executado e o que está ao alcance.',
      'Fixar versão só ajuda se a verificação acontecer antes de executar.',
      'Separar trabalhos é a forma mais simples de reduzir o alcance.',
    ],
    explain:
      'A resposta completa tem dois lados: garantir a integridade do que roda (versão fixada e conferida) e reduzir o que o processo alcança (segredos só na etapa que precisa deles). Revisão periódica não cobre a janela entre revisões.',
  },
  closing:
    'O enviador passou a ser executado a partir de uma versão fixada por resumo, e o envio de cobertura virou um trabalho próprio, com acesso apenas ao token de cobertura.',
  review: {
    solution: [
      'O veredito é "procede": o pipeline executa conteúdo remoto sem verificação, em um ambiente com token de pacotes e chave de implantação.',
      'Os sinais são a execução sem conferência, o conjunto de segredos no ambiente e a coleta de variáveis que o próprio enviador faz.',
      'A conduta correta fixa e confere a versão executada e separa o envio de cobertura, com o mínimo de segredos.',
    ],
    residual:
      'Mesmo com versão fixada, a atualização seguinte precisa ser conferida por alguém; e o trabalho de implantação continua sendo um alvo, agora isolado dos demais.',
    validation:
      'Altere um byte da cópia verificada e confirme que o pipeline falha; liste as variáveis disponíveis no trabalho de cobertura e confirme que só o token de cobertura aparece; e confira que a publicação de pacotes continua funcionando no trabalho próprio.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A03' },
    { framework: 'cwe', id: 'CWE-829' },
    { framework: 'slsa', id: 'build' },
  ],
  inspiredBy: {
    label: 'CISA, "Codecov Releases New Detections for Supply Chain Compromise" (2021-04-30)',
    url: 'https://www.cisa.gov/news-events/alerts/2021/04/30/codecov-releases-new-detections-supply-chain-compromise',
    note: 'No caso real, o Bash Uploader do Codecov foi alterado sem autorização a partir de 31 de janeiro de 2021; a empresa descobriu em 1º de abril, avisou os clientes em 15 de abril e publicou, em 29 de abril, um conjunto não exaustivo de variáveis de ambiente provavelmente comprometidas. A recomendação da CISA incluía atenção especial à troca de credenciais, tokens e chaves possivelmente afetados e à reemissão de certificados. O pipeline e o serviço desta amostra são inventados.',
  },
  tags: ['supply', 'segredos', 'procede'],
}
