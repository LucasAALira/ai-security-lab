import type { ReviewSample } from './types'

export const corsDoPainel: ReviewSample = {
  id: 'cors-do-painel',
  title: 'CORS que devolve a origem recebida',
  subtitle: 'Treinar a leitura de configuração: a diferença entre refletir a origem e permitir uma lista dela.',
  area: 'api',
  level: 'Intermediário',
  minutes: 10,
  finding: {
    tool: 'Varredura de configuração (ferramenta fictícia)',
    rule: 'CFG-009 · política de origem cruzada permissiva',
    severity: 'alta',
    line: 6,
    message: 'Cabeçalho de origem permitida refletido a partir da requisição, com credenciais habilitadas.',
    confidence: 'alta',
  },
  context: [
    'O painel administrativo roda em um domínio próprio e consome a API com cookie de sessão. Durante o desenvolvimento, várias pessoas usam endereços diferentes, e a configuração foi afrouxada para evitar ajustes a cada ambiente.',
    'A sessão usa cookie com `SameSite=None; Secure`, porque o painel e a API ficam em domínios diferentes.',
  ],
  file: 'src/servidor/cors.ts',
  language: 'ts',
  code: [
    'app.use((req, res, next) => {',
    '  const origem = req.headers.origin',
    '',
    '  if (origem) {',
    '    // devolve a origem recebida para funcionar em qualquer ambiente',
    '    res.setHeader("access-control-allow-origin", origem)',
    '    res.setHeader("access-control-allow-credentials", "true")',
    '    res.setHeader("access-control-allow-headers", "content-type, x-requisicao")',
    '    res.setHeader("vary", "origin")',
    '  }',
    '',
    '  if (req.method === "OPTIONS") return res.status(204).end()',
    '  next()',
    '})',
  ],
  extra: {
    title: 'Como a sessão é transportada e o que a API expõe',
    language: 'text',
    lines: [
      'Set-Cookie: sessao=...; HttpOnly; Secure; SameSite=None; Path=/',
      '',
      'rotas sensíveis sob o mesmo middleware:',
      '  GET  /api/admin/usuarios        lista com nome, documento e papel',
      '  POST /api/admin/usuarios/:id    altera papel',
      '',
      'proteção contra requisição forjada entre sítios: cabeçalho x-requisicao exigido nas rotas POST',
    ],
    note: 'O cookie viaja entre domínios e o cabeçalho exigido no POST está na lista de cabeçalhos permitidos.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. Refletir a origem com credenciais habilitadas equivale a permitir qualquer sítio: uma página hostil aberta na mesma sessão lê respostas autenticadas, e o cabeçalho exigido nos POST está liberado na própria política.',
    'Não é falso positivo: o `vary: origin` apenas instrui o cache; ele não restringe quem é aceito.',
    'O contexto necessário está descrito: cookie entre domínios, rotas sensíveis sob o mesmo middleware e a lista de cabeçalhos permitidos.',
  ],
  verdictHints: [
    'Pergunte qual conjunto de origens essa configuração aceita na prática.',
    'Veja o que o cookie faz quando a requisição vem de outro domínio.',
    'A proteção do POST depende de um cabeçalho. Ele está permitido?',
  ],
  verdictExplain:
    'Refletir a origem recebida é o mesmo que aceitar todas, com a diferença de que credenciais passam a ser permitidas — o que o valor `*` não permitiria. Com cookie `SameSite=None`, qualquer página pode ler respostas autenticadas da API, inclusive as rotas administrativas.',
  signals: [
    { text: 'A origem permitida é copiada da requisição, sem comparação com uma lista.', feedback: 'Sim: é o ponto central, porque qualquer origem recebe permissão.' },
    { text: 'As credenciais são permitidas junto com a origem refletida.', feedback: 'Sim: é a combinação que transforma a política permissiva em leitura de dados autenticados.' },
    { text: 'O cabeçalho exigido nas rotas POST está na lista de cabeçalhos permitidos.', feedback: 'Sim: a proteção contra requisição forjada deixa de valer, porque o navegador passa a poder enviá-lo.' },
    { text: 'O cabeçalho `vary: origin` está presente.', feedback: 'Não: ele evita que um cache sirva a resposta para outra origem, sem restringir quem é aceito.' },
    { text: 'A resposta ao método `OPTIONS` é 204.', feedback: 'Não: é o comportamento esperado da requisição de verificação prévia.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Dois sinais estão na configuração e um está na lista de cabeçalhos.',
    'Pergunte o que cada cabeçalho faz de fato.',
    'Um item é só instrução para cache.',
  ],
  signalExplain:
    'Origem refletida mais credenciais permitidas equivale a abrir a API autenticada para qualquer sítio, e liberar o cabeçalho de proteção derruba a defesa que restava nas rotas de escrita. `vary` e a resposta 204 descrevem o funcionamento normal do mecanismo.',
  next: {
    prompt: 'A configuração está em produção. Qual conduta?',
    options: [
      {
        text: 'Responder a origem permitida somente quando ela constar de uma lista por ambiente; manter credenciais apenas para essas origens; retirar o cabeçalho de proteção da lista de permitidos ou trocar a defesa das rotas de escrita por token por sessão; e separar a configuração de desenvolvimento da de produção.',
        quality: 'best',
        flags: ['lista', 'defesa-escrita', 'ambientes'],
        feedback: 'Fecha a política, devolve a proteção das rotas de escrita e resolve a causa que levou ao afrouxamento: a mesma configuração servindo a todos os ambientes.',
        consequence: 'O painel continua funcionando nos domínios conhecidos, páginas de terceiros param de ler respostas autenticadas e o desenvolvimento deixa de empurrar a produção.',
      },
      {
        text: 'Trocar a origem refletida por `*`, mantendo as credenciais habilitadas.',
        quality: 'poor',
        feedback: 'Navegadores recusam `*` quando as credenciais são permitidas: o painel para de funcionar e a configuração continua errada.',
        consequence: 'O painel quebra em produção e alguém reverte para a reflexão da origem na mesma tarde.',
      },
      {
        text: 'Manter a reflexão e aceitar apenas origens cujo domínio termine com o sufixo da empresa.',
        quality: 'partial',
        feedback: 'Reduz o conjunto, mas comparação por sufixo aceita domínios parecidos registrados por terceiros, e subdomínios comprometidos continuam dentro.',
        consequence: 'O ataque genérico para; um domínio com o sufixo certo, registrado por outra pessoa, continua passando.',
      },
      {
        text: 'Desligar as credenciais, mantendo a origem refletida, e passar a sessão por cabeçalho de autorização.',
        quality: 'good',
        flags: ['defesa-escrita'],
        feedback: 'Resolve o ponto principal, porque sem credenciais automáticas a página de terceiro não herda a sessão. Exige mudar o painel inteiro e guardar o token no cliente, com os riscos próprios disso.',
        consequence: 'A leitura por páginas hostis deixa de funcionar e a equipe assume a migração do painel para outro modelo de sessão.',
      },
    ],
    hints: [
      'Pergunte por que a configuração foi afrouxada, e resolva isso também.',
      'Uma das opções quebra o painel por regra do próprio navegador.',
      'Comparar sufixo de domínio é mais frágil do que parece.',
    ],
    explain:
      'A correção é lista de origens por ambiente, com credenciais restritas a elas, e a recuperação da defesa das rotas de escrita. Sem separar as configurações por ambiente, a pressão do desenvolvimento reabre o problema na próxima vez.',
  },
  closing:
    'A política passou a comparar a origem com uma lista por ambiente, o cabeçalho de proteção saiu da lista de permitidos e o desenvolvimento ganhou configuração própria.',
  review: {
    solution: [
      'O veredito é "procede": a origem é refletida com credenciais permitidas, o que equivale a aceitar qualquer sítio com a sessão da vítima.',
      'Os sinais são a reflexão sem lista, as credenciais permitidas e o cabeçalho de proteção liberado.',
      'A conduta completa usa lista por ambiente, restabelece a defesa das rotas de escrita e separa as configurações.',
    ],
    residual:
      'Um subdomínio legítimo comprometido continua dentro da lista, e o cookie entre domínios segue exigindo cuidado com o tempo de sessão e com a renovação.',
    validation:
      'Faça uma requisição com origem desconhecida e confirme a ausência do cabeçalho de permissão; repita com a origem do painel e confirme a resposta; e tente uma escrita sem o token por sessão e confirme a recusa.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A02' },
    { framework: 'owasp-api-top10', id: 'API8' },
    { framework: 'cwe', id: 'CWE-942' },
  ],
  tags: ['api', 'config', 'procede'],
}
