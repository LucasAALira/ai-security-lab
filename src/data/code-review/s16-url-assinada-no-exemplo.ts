import type { ReviewSample } from './types'

export const urlAssinadaNoExemplo: ReviewSample = {
  id: 'url-assinada-no-exemplo',
  title: 'Link de download no repositório de exemplos',
  subtitle: 'Treinar o segredo que não parece segredo: a URL assinada que carrega a credencial na própria consulta.',
  area: 'config',
  level: 'Intermediário',
  minutes: 10,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-034 · URL com token de acesso em parâmetro de consulta',
    severity: 'média',
    line: 9,
    message: 'Endereço com parâmetros de assinatura encontrado em arquivo versionado.',
    confidence: 'baixa',
  },
  context: [
    'O repositório público de exemplos mostra como baixar o conjunto de dados usado nos tutoriais. A pessoa autora publicou o link assinado para que ninguém precisasse pedir acesso.',
    'A equipe considera o achado pouco relevante: "é só um link de download, não tem senha nenhuma ali".',
  ],
  file: 'exemplos/baixar-conjunto.md',
  language: 'text',
  code: [
    '# Como baixar o conjunto de dados',
    '',
    'O conjunto usado nos tutoriais está no armazenamento da equipe.',
    'Baixe com o comando abaixo e descompacte na pasta `dados/`.',
    '',
    '```sh',
    'curl -L -o conjunto.tar.gz \\',
    '  "https://arquivos.equipe.example/conjuntos/tutorial.tar.gz\\',
    '?sig=5f3c91ad&se=2031-12-31T23%3A59%3A59Z&sp=rwdl&sr=c&sv=2024-11-04"',
    '```',
    '',
    'Depois: `tar xzf conjunto.tar.gz`',
  ],
  extra: {
    title: 'O que significam os parâmetros, segundo a documentação do armazenamento',
    language: 'text',
    lines: [
      'sig  assinatura que autoriza a requisição (é o segredo em si)',
      'se   expiração: 2031-12-31  -> pouco mais de cinco anos a contar de hoje',
      'sp   permissões concedidas: r=ler  w=escrever  d=apagar  l=listar',
      'sr   recurso: c=contêiner inteiro (não é um arquivo só)',
      '',
      'o contêiner "conjuntos" guarda também exportações internas de clientes',
    ],
    note: 'Leia `sp` e `sr` juntos: eles dizem o que o link permite fazer e sobre o quê.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. A assinatura na URL é a credencial, e esta concede leitura, escrita, exclusão e listagem do contêiner inteiro, por mais de cinco anos. Quem tem o link tem tudo isso.',
    'Não é falso positivo: a confiança baixa da ferramenta reflete a dificuldade de distinguir link de credencial, e não a ausência de risco.',
    'Não falta contexto: os parâmetros estão no próprio link e a documentação explica cada um.',
  ],
  verdictHints: [
    'Procure, entre os parâmetros, qual deles autoriza a requisição.',
    'Leia o que `sp` concede e sobre qual recurso `sr` se aplica.',
    'Compare a data de expiração com a data de hoje.',
  ],
  verdictExplain:
    'Em URL assinada, a credencial viaja na própria consulta: qualquer pessoa com o endereço faz o que a assinatura permite. Aqui a permissão inclui escrever e apagar, o recurso é o contêiner inteiro (que guarda exportações internas) e a validade passa de cinco anos — três escolhas que, somadas, transformam um link de tutorial em acesso amplo e duradouro.',
  signals: [
    { text: 'O parâmetro de assinatura é o que autoriza a requisição: ele é a credencial.', feedback: 'Sim: é o ponto que o argumento "é só um link" ignora.' },
    { text: 'As permissões incluem escrever, apagar e listar, não apenas ler.', feedback: 'Sim: com elas, quem achar o link pode alterar e remover conteúdo, não só baixar.' },
    { text: 'O recurso é o contêiner inteiro, que guarda também exportações internas.', feedback: 'Sim: o alcance vai muito além do arquivo do tutorial.' },
    { text: 'A validade vai até o fim de 2031.', feedback: 'Sim: a janela longa elimina a principal defesa das URLs assinadas, que é durar pouco.' },
    { text: 'O arquivo é um documento em Markdown, e não código.', feedback: 'Não: o formato do arquivo não muda o que o link concede; segredo vale pelo que abre.' },
  ],
  correctSignals: [0, 1, 2, 3],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Quatro sinais estão no próprio link e na documentação dos parâmetros.',
    'Pergunte o que alguém faria de posse desse endereço.',
    'O tipo de arquivo não diz nada sobre a credencial.',
  ],
  signalExplain:
    'Assinatura, permissões, recurso e validade formam o quadro: é credencial, permite escrever e apagar, alcança o contêiner inteiro e dura anos. O formato do arquivo onde ela está é irrelevante.',
  next: {
    prompt: 'Você confirmou o achado. O que fazer em seguida?',
    options: [
      {
        text: 'Revogar a assinatura agora, pela política de acesso do armazenamento; publicar o conjunto de tutorial em um contêiner separado, sem dado interno, com link somente de leitura e validade curta; e ajustar a regra para tratar URLs assinadas como credencial, com alerta quando a validade for longa ou a permissão incluir escrita.',
        quality: 'best',
        flags: ['revoga', 'separa', 'ajusta-regra'],
        feedback: 'Encerra o acesso, separa o dado público do interno e melhora a detecção para o próximo link de validade longa.',
        consequence: 'O link antigo para de funcionar, o tutorial continua baixável e a próxima URL assinada com permissão ampla é apontada antes de ser publicada.',
      },
      {
        text: 'Apagar o link do arquivo e fazer um commit removendo a linha.',
        quality: 'poor',
        feedback: 'O endereço continua no histórico e continua válido: remover a linha não revoga assinatura nenhuma.',
        consequence: 'Quem já copiou o repositório mantém acesso de escrita ao contêiner até 2031.',
      },
      {
        text: 'Gerar um link novo com validade de um ano e substituir no documento.',
        quality: 'partial',
        feedback: 'Encurta a janela e mantém dois problemas: o link antigo segue válido se não for revogado, e as permissões de escrita continuam.',
        consequence: 'A exposição anterior permanece aberta e o novo link ainda permite apagar o conteúdo do contêiner.',
      },
      {
        text: 'Marcar o achado como informativo, porque a ferramenta declarou confiança baixa e o arquivo é de documentação.',
        quality: 'poor',
        feedback: 'Confiança baixa descreve a incerteza da detecção, não o impacto; e o formato do arquivo não altera o que a assinatura concede.',
        consequence: 'O link sai da fila de correção e segue publicado, com permissão de escrita no contêiner.',
      },
    ],
    hints: [
      'Pergunte o que revoga uma assinatura: apagar a linha, ou outra coisa?',
      'O conjunto do tutorial precisa estar junto do dado interno?',
      'Vale corrigir também a regra que quase deixou isso passar.',
    ],
    explain:
      'URL assinada se revoga no armazenamento, não no repositório. Depois vem a separação entre o conteúdo público e o interno, e o ajuste da detecção: tratar esses endereços como credencial e alertar quando a validade for longa ou a permissão incluir escrita.',
  },
  closing:
    'A assinatura foi revogada pela política de acesso, o conjunto do tutorial mudou para um contêiner público somente de leitura e a regra passou a sinalizar validade longa e permissão de escrita.',
  review: {
    solution: [
      'O veredito é "procede": a assinatura na URL é a credencial, e ela concede leitura, escrita, exclusão e listagem do contêiner inteiro até 2031.',
      'Os sinais são a assinatura, as permissões, o recurso alcançado e a validade longa.',
      'A conduta correta revoga a assinatura, separa o conteúdo do tutorial em contêiner próprio e ajusta a regra para tratar esses endereços como segredo.',
    ],
    residual:
      'O endereço permanece no histórico do repositório e em cópias feitas antes da revogação; e qualquer link assinado novo continua sendo uma credencial que circula por mensagem, documento e histórico de comandos.',
    validation:
      'Tente usar o link antigo e confirme a recusa; confira que o novo endereço só permite leitura e expira em dias; e rode a regra ajustada contra o repositório para ver se outros links assinados aparecem.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A01' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'owasp-api-top10', id: 'API2' },
  ],
  inspiredBy: {
    label: 'Microsoft MSRC, "Microsoft mitigated exposure of internal information in a storage account due to overly-permissive SAS token" (2023-09-18)',
    url: 'https://www.microsoft.com/en-us/msrc/blog/2023/09/microsoft-mitigated-exposure-of-internal-information-in-a-storage-account-due-to-overly-permissive-sas-token',
    note: 'No caso real, um pesquisador incluiu um token SAS excessivamente permissivo na URL publicada em um repositório público de modelos; o token foi comunicado por pesquisadores externos em 22 de junho de 2023 e revogado em 24 de junho. Entre as medidas listadas estão escopo mínimo, validade curta (a recomendação citada é de uma hora ou menos), tratar a URL assinada como segredo da aplicação e manter plano de revogação. Os valores e o conteúdo desta amostra são inventados.',
  },
  tags: ['config', 'segredos', 'procede'],
}
