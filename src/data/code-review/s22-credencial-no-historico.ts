import type { ReviewSample } from './types'

export const credencialNoHistorico: ReviewSample = {
  id: 'credencial-no-historico',
  title: 'Credencial encontrada no histórico, não no código atual',
  subtitle: 'Treinar o achado que vem do passado: o valor saiu do arquivo, mas ninguém disse se saiu de circulação.',
  area: 'supply',
  level: 'Intermediário',
  minutes: 10,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-044 · credencial presente em revisão anterior do arquivo',
    severity: 'alta',
    line: 4,
    message: 'Valor com formato de token encontrado no histórico do arquivo; ausente na versão atual.',
    confidence: 'alta',
  },
  context: [
    'A varredura passou a analisar também o histórico do repositório. O token aparece em uma revisão de catorze meses atrás e foi removido do arquivo duas semanas depois.',
    'Quem fez a remoção não está mais na equipe, e a mensagem do commit diz apenas "limpeza".',
  ],
  file: 'infra/publicar.sh',
  language: 'text',
  code: [
    '# versão atual do arquivo (sem o valor)',
    'set -eu',
    'TOKEN_REGISTRO="${TOKEN_REGISTRO:?defina a variável}"',
    'curl -sS -H "Authorization: Bearer $TOKEN_REGISTRO" https://registro.interno.example/publicar -d @pacote.json',
    '',
    '# revisão de 14 meses atrás, apontada pela varredura:',
    '# TOKEN_REGISTRO="reg_live_a71f33b90c2e"',
    '# curl -sS -H "Authorization: Bearer $TOKEN_REGISTRO" ...',
  ],
  extra: {
    title: 'O que a revisão apurou em meia hora',
    language: 'text',
    lines: [
      'o token aparece no histórico e em pelo menos dois espelhos do repositório',
      'o registro interno tem painel de tokens? sim',
      'o token reg_live_a71f33b90c2e ainda consta no painel? não foi possível verificar: acesso ao painel pendente',
      'há registro de uso recente desse token? idem, depende do painel',
      'a variável de ambiente usada hoje aponta para outro token, criado há 14 meses',
    ],
    note: 'Duas perguntas em aberto, e as duas dependem do mesmo painel.',
  },
  verdict: 'falta-contexto',
  verdictFeedback: [
    'Dizer que procede exigiria saber que o token ainda é válido, e isso não foi verificado; o valor pode ter sido revogado junto com a remoção.',
    'Fechar como falso positivo porque "não está mais no arquivo" ignora que remover a linha não revoga nada, e o valor segue no histórico e nos espelhos.',
    'Correto. A pergunta que decide é uma só: esse token ainda existe e funciona? Ela se responde no painel do registro interno, em minutos, e o acesso já foi pedido.',
  ],
  verdictHints: [
    'Pergunte o que a remoção do arquivo muda para o provedor do token.',
    'Procure, na apuração, o que foi confirmado e o que ficou pendente.',
    'A criação de um token novo prova que o antigo foi revogado?',
  ],
  verdictExplain:
    'Segredo em histórico é um caso de duas etapas: primeiro descobrir se o valor ainda vale, depois decidir o que fazer. A troca da variável mostra que alguém criou outro token, não que revogou este. Sem o painel, qualquer veredito é chute.',
  signals: [
    { text: 'Não foi possível verificar se o token ainda consta no painel do registro.', feedback: 'Sim: é a pergunta que decide o veredito, e ela está em aberto.' },
    { text: 'Não há informação sobre uso recente desse token.', feedback: 'Sim: o uso recente separaria "revogado e esquecido" de "ativo e exposto".' },
    { text: 'O valor permanece no histórico e em pelo menos dois espelhos.', feedback: 'Sim: é o que impede fechar como resolvido pela simples remoção da linha.' },
    { text: 'A variável de ambiente aponta hoje para outro token.', feedback: 'Não resolve: criar um token novo não implica ter revogado o anterior.' },
    { text: 'A mensagem do commit de remoção diz apenas "limpeza".', feedback: 'Não decide nada: a mensagem é pobre, e a resposta está no provedor, não no commit.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de indeterminado.',
  signalHints: [
    'Dois sinais são perguntas sem resposta; um é um fato que impede o fechamento.',
    'Pergunte onde está a resposta: no repositório ou no provedor?',
    'Dois itens parecem resolver e não resolvem.',
  ],
  signalExplain:
    'O indeterminado se apoia nas duas perguntas pendentes sobre o token e na permanência do valor no histórico e nos espelhos. O token novo e a mensagem do commit não respondem se o antigo ainda funciona.',
  next: {
    prompt: 'Você registrou como indeterminado. Qual é a conduta enquanto a resposta não vem?',
    options: [
      {
        text: 'Tratar como exposto até prova em contrário: pedir a revogação do token antigo no painel, com responsável e prazo curto; se o painel confirmar que ele já não existe, fechar o achado com a evidência anexada; e, em qualquer caso, passar a varrer o histórico nas próximas análises.',
        quality: 'best',
        flags: ['revoga', 'prazo', 'historico'],
        feedback: 'Age pelo pior caso, que custa pouco (revogar um token sem uso), e transforma a dúvida em evidência anexada ao achado.',
        consequence: 'Em um dia o achado fecha com prova, e não com suposição; se o token ainda valia, ele deixa de valer antes do fim da semana.',
      },
      {
        text: 'Fechar como falso positivo, porque o valor não está na versão atual do arquivo.',
        quality: 'poor',
        feedback: 'A ausência na versão atual não diz nada sobre a validade do token, que é o que importa.',
        consequence: 'Um token possivelmente ativo continua no histórico e nos espelhos, agora com um fechamento registrado.',
      },
      {
        text: 'Reescrever o histórico do repositório para remover o valor e fechar o achado.',
        quality: 'poor',
        feedback: 'Reescrever histórico não alcança espelhos e clones, não revoga o token e consome mais esforço do que a revogação.',
        consequence: 'O valor some do repositório principal, continua nos espelhos e possivelmente continua funcionando.',
      },
      {
        text: 'Deixar o achado aberto até alguém conseguir acesso ao painel, sem prazo definido.',
        quality: 'partial',
        feedback: 'Manter aberto é melhor que fechar errado, mas sem dono e sem prazo a pendência costuma atravessar vários ciclos.',
        consequence: 'O achado fica no limbo, e a pergunta continua sem resposta no próximo relatório.',
      },
    ],
    hints: [
      'Compare o custo de revogar com o custo de descobrir se precisa revogar.',
      'Indeterminado funciona melhor com prazo.',
      'Reescrever histórico resolve o quê, exatamente?',
    ],
    explain:
      'Quando revogar é barato e a dúvida é sobre validade, trate como exposto e revogue: a confirmação vira evidência anexada ao achado. Fechar pela ausência na versão atual e reescrever histórico são respostas que não tocam o que importa.',
  },
  closing:
    'O token antigo foi revogado no painel do registro, a confirmação ficou anexada ao achado e a varredura do histórico passou a fazer parte da análise padrão.',
  review: {
    solution: [
      'O veredito é indeterminado: falta saber se o token do histórico ainda é válido, e isso se responde no painel do provedor.',
      'Os sinais são as duas perguntas pendentes sobre validade e uso e a permanência do valor no histórico e nos espelhos.',
      'A conduta trata como exposto até prova em contrário, pede a revogação com prazo e anexa a confirmação ao achado.',
    ],
    residual:
      'O valor continua no histórico e nos espelhos para sempre; a revogação encerra o uso, não a circulação. E outros segredos podem estar no histórico sem ninguém ter varrido ainda.',
    validation:
      'Tente autenticar no registro com o token antigo e confirme a recusa; confira no painel a data de revogação; e rode a varredura de histórico no repositório inteiro, não só no arquivo apontado.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A08' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'nist-ssdf', id: 'RV.1' },
  ],
  inspiredBy: {
    label: 'CISA, "Codecov Releases New Detections for Supply Chain Compromise" (2021-04-30)',
    url: 'https://www.cisa.gov/news-events/alerts/2021/04/30/codecov-releases-new-detections-supply-chain-compromise',
    note: 'O alerta real recomenda atenção especial à troca ("re-rolling") de credenciais, tokens e chaves possivelmente afetados, além da reemissão de certificados — ou seja, tratar como comprometido o que pode ter sido exposto, em vez de esperar a confirmação. Esta amostra aplica o mesmo raciocínio a um token achado no histórico de um repositório; o arquivo, o token e o registro interno são inventados.',
  },
  tags: ['supply', 'segredos', 'indeterminado'],
}
