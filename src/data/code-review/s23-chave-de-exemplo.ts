import type { ReviewSample } from './types'

export const chaveDeExemplo: ReviewSample = {
  id: 'chave-de-exemplo',
  title: 'Chave de teste no guia de integração',
  subtitle: 'Treinar a separação entre credencial de verdade e valor de exemplo, sem depender do nome do arquivo.',
  area: 'config',
  level: 'Básico',
  minutes: 8,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-011 · credencial de provedor em arquivo versionado',
    severity: 'alta',
    line: 8,
    message: 'Valor com formato de chave de provedor de pagamentos em arquivo versionado.',
    confidence: 'alta',
  },
  context: [
    'O guia mostra como integrar o pagamento em ambiente de testes. O provedor usa prefixos distintos para cada ambiente e publica as chaves de teste na própria documentação, para que qualquer pessoa consiga rodar os exemplos.',
    'A varredura marcou três valores no repositório; este é o primeiro, no guia de integração.',
  ],
  file: 'docs/integracao-pagamentos.md',
  language: 'text',
  code: [
    '# Integração de pagamentos (ambiente de testes)',
    '',
    'Use a chave de teste publicada pelo provedor. Ela só funciona no ambiente',
    'de testes, com cartões fictícios, e não movimenta dinheiro de verdade.',
    '',
    '```sh',
    'export PAGAMENTOS_CHAVE="pk_test_00000000000000000000"',
    'npm run exemplo:pagamento',
    '```',
    '',
    'Em produção, a chave vem do cofre (`PAGAMENTOS_CHAVE` injetada no contêiner).',
    'Nunca escreva a chave de produção em arquivo, nem em exemplo comentado.',
  ],
  extra: {
    title: 'Os três achados da varredura e o que o provedor documenta',
    language: 'text',
    lines: [
      'SEC-011  docs/integracao-pagamentos.md:8   pk_test_0000...  (guia de integração)',
      'SEC-011  src/checkout/cliente.ts:22        sk_live_9c41...  (código do checkout)',
      'SEC-011  .env.exemplo:3                    PAGAMENTOS_CHAVE=coloque-a-chave-aqui',
      '',
      'documentação do provedor:',
      '  pk_test_  chave pública de testes      publicada na documentação',
      '  sk_live_  chave secreta de produção    nunca deve sair do cofre',
    ],
    note: 'Compare os prefixos com a tabela do provedor.',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'Para a linha analisada, o valor é uma chave pública de ambiente de testes, publicada pelo próprio provedor: ela não autoriza nada em produção nem movimenta dinheiro.',
    'Correto. A regra reconhece o formato e não o prefixo que separa teste de produção. O mesmo alerta, no segundo achado da lista, aponta uma chave secreta de produção — e lá ele procede.',
    'Não falta contexto: o prefixo, a documentação do provedor e o próprio texto do guia dizem o que é esse valor.',
  ],
  verdictHints: [
    'Compare o prefixo do valor com a tabela do provedor.',
    'Pergunte o que alguém consegue fazer com essa chave.',
    'Os três achados da lista não precisam ter o mesmo veredito.',
  ],
  verdictExplain:
    'Triagem de segredo é sobre o que o valor abre. Chave pública de ambiente de testes é feita para ser publicada; chave secreta de produção não pode sair do cofre. O prefixo do provedor é o que separa as duas, e ele está documentado.',
  signals: [
    { text: 'O prefixo `pk_test_` identifica chave pública de ambiente de testes na documentação do provedor.', feedback: 'Sim: é o argumento central, e ele é verificável fora do repositório.' },
    { text: 'O ambiente de testes não movimenta dinheiro real nem aceita cartões reais.', feedback: 'Sim: delimita o impacto possível em praticamente nada.' },
    { text: 'O próprio guia instrui a nunca escrever a chave de produção em arquivo.', feedback: 'Sim: mostra que a prática documentada no repositório está correta.' },
    { text: 'O arquivo é um documento, e não código.', feedback: 'Não: o tipo do arquivo não decide nada; o segundo achado da lista está em código e também precisa ser julgado pelo valor.' },
    { text: 'A varredura marcou três achados com a mesma regra.', feedback: 'Não: a quantidade de achados não diz nada sobre este; cada um tem veredito próprio.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito para **a linha 8 deste arquivo**.',
  signalHints: [
    'O prefixo é o sinal mais forte.',
    'Pergunte o que a chave permite fazer.',
    'Cuidado para não julgar pelo tipo de arquivo.',
  ],
  signalExplain:
    'O veredito se apoia no prefixo documentado, no alcance nulo do ambiente de testes e na orientação correta registrada no guia. Tipo de arquivo e quantidade de achados não entram.',
  next: {
    prompt: 'Os três achados estão na mesma fila. Qual é a conduta?',
    options: [
      {
        text: 'Fechar este com justificativa que cite o prefixo do provedor; tratar o `sk_live_` do checkout como vazamento, com revogação e troca imediatas; deixar o `.env.exemplo` como está, por ser um marcador sem valor; e ensinar a regra a distinguir prefixos de teste dos de produção.',
        quality: 'best',
        flags: ['justifica', 'revoga', 'ajusta-regra'],
        feedback: 'Dá a cada achado o veredito que ele merece, trata o vazamento real com urgência e reduz o ruído futuro sem perder cobertura.',
        consequence: 'A chave de produção é revogada no mesmo dia, o guia continua funcionando e a próxima varredura separa teste de produção sozinha.',
      },
      {
        text: 'Fechar os três como falso positivo, já que a equipe sabe o que está fazendo.',
        quality: 'poor',
        feedback: 'Um dos três é uma chave secreta de produção no código do checkout: fechá-la assim transforma um vazamento em aprovação registrada.',
        consequence: 'A chave de produção permanece no repositório e pode movimentar pagamentos de verdade.',
      },
      {
        text: 'Substituir a chave de teste do guia por um texto genérico, para a regra parar de disparar.',
        quality: 'partial',
        feedback: 'Elimina o alerta e deixa o exemplo sem funcionar de imediato, que é a razão de o provedor publicar a chave de teste.',
        consequence: 'Quem seguir o guia precisa procurar a chave na documentação do provedor, e alguém acaba colando a de produção.',
      },
      {
        text: 'Adicionar `docs/` à lista de exceções da varredura de segredos.',
        quality: 'poor',
        feedback: 'Documentação é um lugar comum para colar segredo de verdade; cegar a pasta inteira troca ruído por ponto cego.',
        consequence: 'Um token de produção colado em um tutorial no mês que vem não gera alerta nenhum.',
      },
    ],
    hints: [
      'Cada achado da lista tem um veredito próprio.',
      'Um deles não é discussão de triagem, é resposta a incidente.',
      'Pense no que a regra deveria aprender com este caso.',
    ],
    explain:
      'Triagem de segredos separa pelo que o valor abre: a chave de teste fecha com justificativa, a de produção vira revogação imediata e o marcador do `.env.exemplo` não é nada. E a regra melhora quando aprende os prefixos do provedor.',
  },
  closing:
    'O guia ficou como estava, com a justificativa registrada; a chave de produção do checkout foi revogada e trocada; e a regra passou a distinguir os prefixos de teste e de produção.',
  review: {
    solution: [
      'Para a linha analisada o veredito é falso positivo: é chave pública de ambiente de testes, publicada pelo provedor.',
      'Os sinais são o prefixo documentado, o alcance nulo do ambiente de testes e a orientação correta no próprio guia.',
      'A conduta separa os três achados: justificar este, revogar a chave de produção e manter o marcador, ajustando a regra para os prefixos.',
    ],
    residual:
      'O veredito depende de o provedor manter o significado dos prefixos e de ninguém trocar o valor do guia por uma chave de produção numa edição futura — é isso que a regra ajustada passa a vigiar.',
    validation:
      'Tente uma cobrança com a chave do guia e confirme que ela só funciona no ambiente de testes; confirme no painel do provedor que a chave de produção antiga foi revogada; e rode a regra ajustada para ver se ela ainda aponta o guia.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A08' },
    { framework: 'cwe', id: 'CWE-798' },
  ],
  tags: ['config', 'segredos', 'falso-positivo'],
}
