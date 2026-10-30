import type { ReviewSample } from './types'

export const modeloDoBucket: ReviewSample = {
  id: 'modelo-do-bucket',
  title: 'Modelo carregado de um bucket "interno"',
  subtitle: 'Treinar o veredito mais difícil: reconhecer quando a resposta depende de um fato que o código não mostra.',
  area: 'ia',
  level: 'Avançado',
  minutes: 12,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'PY-015 · desserialização de dados não confiáveis',
    severity: 'crítica',
    line: 11,
    message: 'Uso de pickle.load em conteúdo externo. A desserialização executa código arbitrário.',
    confidence: 'alta',
  },
  context: [
    'O serviço de recomendação carrega, na inicialização, um modelo treinado que o time de dados publica em um bucket da própria organização.',
    'A pessoa autora respondeu na revisão: "o bucket é interno, só o time de dados escreve lá".',
  ],
  file: 'servico/recomendacao/carregar.py',
  language: 'py',
  code: [
    'import os',
    'import pickle',
    'import boto3',
    '',
    'BUCKET = os.environ["MODELO_BUCKET"]',
    'CHAVE = os.environ.get("MODELO_CHAVE", "recomendacao/modelo-atual.pkl")',
    '',
    'def carregar_modelo():',
    '    s3 = boto3.client("s3")',
    '    objeto = s3.get_object(Bucket=BUCKET, Key=CHAVE)',
    '    modelo = pickle.load(objeto["Body"])',
    '    return modelo',
    '',
    '# chamado uma vez, na inicialização do processo que atende as requisições',
    'MODELO = carregar_modelo()',
  ],
  extra: {
    title: 'O que a revisão conseguiu apurar até agora',
    language: 'text',
    lines: [
      'bucket: definido por variável de ambiente, valor diferente em cada ambiente',
      'política do bucket em produção: não foi possível consultar na revisão',
      'quem publica: pipeline do time de dados (confirmado) e, segundo o time, "alguns notebooks"',
      'verificação de integridade do arquivo: nenhuma no código',
      'o processo roda com um papel que tem permissão de leitura e escrita no bucket',
    ],
    note: 'Três fatos confirmados, um não confirmado e um ponto cego: a política do bucket.',
  },
  verdict: 'falta-contexto',
  verdictFeedback: [
    'O risco é real se qualquer coisa além do pipeline puder escrever no bucket, mas a revisão não confirmou a política de escrita. Afirmar que procede agora seria adivinhar qual é o alcance.',
    'Fechar como falso positivo seria pior: a desserialização executa código por desenho, não há verificação de integridade e há indício de publicação fora do pipeline.',
    'Correto. A decisão depende de um fato que o trecho não traz: quem pode escrever no bucket em produção. Com a política em mãos, o veredito vira um dos outros dois em minutos.',
  ],
  verdictHints: [
    'Liste o que precisaria ser verdade para o alerta não proceder.',
    'Procure, na apuração, o que está confirmado e o que não está.',
    'Indeterminado não é desistir: é nomear o que falta.',
  ],
  verdictExplain:
    'Desserializar formato que executa código é seguro apenas enquanto a origem for confiável de verdade. Aqui a confiança está declarada ("bucket interno"), não demonstrada: falta a política de escrita do bucket em produção. Esse é o fato que decide o veredito.',
  signals: [
    { text: 'A política de escrita do bucket em produção não pôde ser consultada na revisão.', feedback: 'Sim: é exatamente a informação que separa "procede" de "falso positivo".' },
    { text: 'Há indício de publicação fora do pipeline, mencionado pelo próprio time.', feedback: 'Sim: enfraquece a premissa de que só o pipeline escreve, e precisa ser verificado.' },
    { text: 'Não existe verificação de integridade do arquivo antes de desserializar.', feedback: 'Sim: sem assinatura ou resumo conferido, a confiança depende inteiramente do controle de escrita.' },
    { text: 'O nome do objeto vem de variável de ambiente com valor padrão.', feedback: 'Não decide o veredito: quem controla a variável já controla o processo.' },
    { text: 'O modelo é carregado uma única vez, na inicialização.', feedback: 'Não: carregar uma vez reduz a frequência, e a execução de código aconteceria igual nessa única vez.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de indeterminado.',
  signalHints: [
    'Procure o que está em aberto, e não o que está errado.',
    'Um dos sinais é uma ausência: o que não existe no código.',
    'Dois itens descrevem o fluxo sem mudar a dúvida central.',
  ],
  signalExplain:
    'O veredito se sustenta em uma lacuna (a política do bucket), em um indício que contraria a premissa (publicação fora do pipeline) e em uma ausência no código (nenhuma verificação de integridade). Frequência de carga e origem do nome não resolvem a dúvida.',
  next: {
    prompt: 'Você registrou o achado como indeterminado. O que fazer em seguida?',
    options: [
      {
        text: 'Pedir a política do bucket e a lista de identidades com permissão de escrita, com prazo; enquanto isso, propor a mudança que torna a pergunta menos crítica — publicar o modelo em formato que não executa código, ou assinar o artefato e conferir a assinatura antes de carregar.',
        quality: 'best',
        flags: ['pergunta', 'prazo', 'reduz-dependencia'],
        feedback: 'Busca o fato que falta com prazo e, ao mesmo tempo, encaminha a correção que faz o veredito deixar de depender de quem escreve no bucket.',
        consequence: 'Em poucos dias existe resposta e, com a assinatura ou o formato sem execução, o risco deixa de depender da política de acesso.',
      },
      {
        text: 'Deixar o achado aberto como indeterminado, sem responsável nem prazo, até alguém trazer a informação.',
        quality: 'poor',
        feedback: 'Indeterminado sem dono e sem prazo é um achado esquecido: a lacuna permanece e ninguém volta a olhar.',
        consequence: 'O achado envelhece na fila e a pergunta continua sem resposta no próximo ciclo de revisão.',
      },
      {
        text: 'Aceitar a explicação do time e fechar como falso positivo, registrando a conversa.',
        quality: 'poor',
        feedback: 'A explicação é justamente o que está em dúvida, e o próprio time mencionou publicação fora do pipeline.',
        consequence: 'Um notebook com permissão de escrita passa a ser, na prática, execução remota de código no serviço.',
      },
      {
        text: 'Trocar `pickle` por um formato sem execução agora, sem investigar a política do bucket.',
        quality: 'good',
        flags: ['reduz-dependencia'],
        feedback: 'Resolve o risco principal e é a melhor parte da resposta completa. Fica faltando saber quem escreve no bucket, o que importa para outros usos do mesmo artefato.',
        consequence: 'A desserialização deixa de executar código; um artefato alterado ainda pode envenenar as recomendações.',
      },
    ],
    hints: [
      'Um veredito indeterminado precisa de dono e de prazo.',
      'Dá para reduzir a importância da pergunta enquanto ela não é respondida.',
      'A resposta do time é a hipótese, não a confirmação.',
    ],
    explain:
      'Indeterminado é um estado de trabalho, não um arquivamento: ele vem com a pergunta escrita, o responsável e o prazo. A melhor conduta junta isso com a mudança que torna o sistema menos dependente da resposta.',
  },
  closing:
    'O achado ficou registrado com a pergunta ("quem pode escrever no bucket em produção?"), responsável e prazo, e a equipe encaminhou a assinatura do artefato antes do carregamento.',
  review: {
    solution: [
      'O veredito é indeterminado: falta a política de escrita do bucket em produção, e é ela que decide se a origem é confiável.',
      'Os sinais são a política não consultada, o indício de publicação fora do pipeline e a ausência de verificação de integridade.',
      'A conduta junta a pergunta com prazo e a mudança que reduz a dependência da resposta: formato sem execução ou assinatura conferida.',
    ],
    residual:
      'Mesmo com assinatura, um artefato legítimo pode ter sido treinado com dados manipulados: a assinatura prova a origem, não a qualidade do modelo.',
    validation:
      'Obtenha a política do bucket e liste as identidades com escrita; tente carregar um artefato não assinado e confirme a recusa; e confirme que o processo de publicação assina o arquivo antes de enviar.',
  },
  frameworks: [
    { framework: 'owasp-llm-top10', id: 'LLM03' },
    { framework: 'cwe', id: 'CWE-502' },
    { framework: 'slsa', id: 'build' },
  ],
  tags: ['ia', 'supply', 'indeterminado'],
}
