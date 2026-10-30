import type { ReviewSample } from './types'

export const chaveNoCodigoPublicado: ReviewSample = {
  id: 'chave-no-codigo-publicado',
  title: 'Chave de acesso ao servidor de dados no código do site',
  subtitle: 'Treinar o achado de segredo mais caro: a credencial que acompanha o código quando ele sai de casa.',
  area: 'config',
  level: 'Básico',
  minutes: 9,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-021 · credencial de serviço em arquivo de código',
    severity: 'crítica',
    line: 6,
    message: 'Valor com formato de chave de acesso atribuído a constante em arquivo versionado.',
    confidence: 'alta',
  },
  context: [
    'O site de usuários consulta um serviço interno de dados para montar a área logada. A constante abaixo está no repositório desde a primeira versão do site.',
    'Na semana passada, parte deste repositório foi espelhada em uma conta pessoal para uma apresentação, e a cópia ficou pública por três dias.',
  ],
  file: 'src/servicos/dados.ts',
  language: 'ts',
  code: [
    '// cliente do serviço de dados do portal',
    'const BASE = "https://dados.interno.example/v2"',
    '',
    '// chave usada desde a primeira versão; o time de dados pediu para não trocar',
    '// porque outros serviços usam a mesma.',
    'const CHAVE_DE_ACESSO = "svc_dados_live_4f8c21a9e07b5d63"',
    '',
    'export async function buscarCliente(id: string) {',
    '  const r = await fetch(`${BASE}/clientes/${id}`, { headers: { "x-api-key": CHAVE_DE_ACESSO } })',
    '  if (!r.ok) throw new Error("falha ao consultar o serviço de dados")',
    '  return r.json() as Promise<Cliente>',
    '}',
  ],
  extra: {
    title: 'O que a chave abre, segundo o painel do serviço de dados',
    language: 'text',
    lines: [
      'chave svc_dados_live_4f8c21a9e07b5d63',
      '  escopo: leitura de /clientes, /enderecos e /pedidos  (toda a base, sem filtro por loja)',
      '  criada: há 5 anos    última rotação: nunca',
      '  usada por: portal (este código), relatórios, aplicativo de campo',
      '',
      'registro de uso: 4 origens distintas nos últimos 30 dias, duas não identificadas',
    ],
    note: 'Escopo, idade e quem usa a mesma chave.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. É uma credencial de produção em texto claro, com leitura de toda a base, no código que já saiu do perímetro em uma cópia pública. A chave vale pelo que abre, não pelo arquivo onde está escrita.',
    'Não é falso positivo: o valor não é de exemplo nem de ambiente de teste, e o painel mostra uso real por três sistemas.',
    'Não falta contexto: o escopo da chave, a idade, os sistemas que a usam e a exposição recente estão todos descritos.',
  ],
  verdictHints: [
    'Pergunte o que essa chave abre e para quem ela já esteve visível.',
    'Repare na observação sobre a cópia do repositório.',
    'Chave compartilhada entre sistemas é mais difícil de trocar, não menos perigosa.',
  ],
  verdictExplain:
    'Uma credencial no código acompanha cada cópia do repositório: espelho, clone de quem saiu da empresa, imagem de contêiner, bundle enviado ao navegador. Aqui ela dá leitura da base inteira, nunca foi trocada e é compartilhada por três sistemas — o que torna a rotação mais trabalhosa e mais urgente.',
  signals: [
    { text: 'O valor é uma credencial de produção em texto claro, atribuída a uma constante do código.', feedback: 'Sim: está no código versionado, então acompanha qualquer cópia do repositório.' },
    { text: 'O escopo da chave é leitura de toda a base, sem filtro por loja.', feedback: 'Sim: define a gravidade; não é uma chave de função limitada.' },
    { text: 'O repositório esteve público por três dias em uma cópia espelhada.', feedback: 'Sim: transforma risco potencial em exposição com janela conhecida.' },
    { text: 'O comentário pede para não trocar a chave porque outros serviços a usam.', feedback: 'Não sustenta o veredito: é um complicador da correção, e não uma evidência da falha.' },
    { text: 'O endereço do serviço aponta para um domínio interno.', feedback: 'Não: a rede interna não impede o uso da chave por quem alcança o serviço, inclusive de dentro.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Separe o que descreve a credencial do que descreve a dificuldade de trocá-la.',
    'Procure a frase que define a janela de exposição.',
    'Domínio interno não é um controle de acesso.',
  ],
  signalExplain:
    'O veredito se apoia na credencial em texto claro, no escopo amplo e na exposição pública recente. O comentário sobre não trocar a chave e o domínio interno descrevem o contexto da correção, não a existência da falha.',
  next: {
    prompt: 'A chave é compartilhada por três sistemas e nunca foi trocada. Qual é a conduta?',
    options: [
      {
        text: 'Emitir uma chave nova por sistema, com escopo reduzido ao que cada um usa; migrar os três consumidores e só então revogar a antiga; passar a ler a credencial de um cofre em tempo de execução; e registrar que o valor continua no histórico do repositório e nas cópias já feitas.',
        quality: 'best',
        flags: ['por-sistema', 'escopo', 'cofre'],
        feedback: 'Resolve a dependência que trava a rotação, reduz o alcance de cada credencial e trata a exposição passada como fato, em vez de tentar apagá-la.',
        consequence: 'A chave antiga deixa de valer depois da migração, e um vazamento futuro atinge um sistema só, com permissões menores.',
      },
      {
        text: 'Revogar a chave imediatamente e avisar os times depois, porque a exposição é crítica.',
        quality: 'partial',
        feedback: 'A urgência está certa, mas revogar antes de migrar derruba três sistemas de produção ao mesmo tempo.',
        consequence: 'O portal, os relatórios e o aplicativo de campo param juntos, e a pressa provavelmente termina em uma chave nova igualmente compartilhada.',
      },
      {
        text: 'Mover o valor para uma variável de ambiente lida na inicialização, mantendo a mesma chave.',
        quality: 'poor',
        feedback: 'Tirar do código ajuda daqui para frente e não muda nada sobre a chave já exposta, que continua válida e com o mesmo escopo.',
        consequence: 'A varredura para de apontar o arquivo e quem copiou o repositório continua com uma credencial que funciona.',
      },
      {
        text: 'Restringir o serviço de dados a aceitar chamadas apenas da faixa de rede interna, mantendo a chave.',
        quality: 'good',
        flags: ['rede'],
        feedback: 'Reduz bastante o alcance de quem está fora, e é uma boa medida enquanto a rotação acontece. Não resolve o uso por quem já tem acesso à rede nem o escopo amplo da chave.',
        consequence: 'O acesso externo com a chave vazada deixa de funcionar; a credencial continua compartilhada e com leitura total por dentro.',
      },
    ],
    hints: [
      'Pergunte o que acontece com os três sistemas no momento da revogação.',
      'Tirar do código não revoga nada.',
      'Uma das opções serve bem como medida temporária.',
    ],
    explain:
      'Credencial compartilhada se troca por partes: uma chave por consumidor, com escopo menor, migração e só então revogação. Tirar do código sem rotacionar é o erro mais comum; restringir a rede é boa contenção enquanto a troca não termina.',
  },
  closing:
    'Cada sistema ganhou a própria chave, com escopo reduzido; a antiga foi revogada depois da migração e o portal passou a ler a credencial de um cofre em tempo de execução.',
  review: {
    solution: [
      'O veredito é "procede": credencial de produção em texto claro, com leitura de toda a base, em código que esteve público por três dias.',
      'Os sinais são o valor em texto claro, o escopo amplo e a janela de exposição conhecida.',
      'A conduta correta emite uma chave por sistema com escopo menor, migra, revoga a antiga e passa a ler do cofre, registrando que o valor segue no histórico.',
    ],
    residual:
      'A chave antiga continua no histórico do repositório e em qualquer cópia feita durante a exposição; a rotação encerra o acesso, não a circulação do valor.',
    validation:
      'Tente usar a chave antiga depois da revogação e confirme a recusa; confira no painel que cada sistema aparece com a própria credencial; e verifique que o código não traz mais nenhum valor com formato de chave.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A08' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'nist-ssdf', id: 'PS.1' },
  ],
  inspiredBy: {
    label: 'Toyota, "お客様のメールアドレス等の漏洩可能性に関するお詫びとお知らせについて" (2022-10-07)',
    url: 'https://global.toyota/jp/newsroom/corporate/38095972.html',
    note: 'No caso real, parte do código-fonte do site de usuários do T-Connect ficou publicada no GitHub de dezembro de 2017 a 15 de setembro de 2022, e continha uma chave de acesso ao servidor de dados: até 296.019 endereços de e-mail e números de gestão de clientes podiam ser alcançados. A empresa tornou o código privado no mesmo dia e trocou a chave dois dias depois; o acesso de terceiros não foi confirmado, nem pôde ser descartado. O código desta amostra é inventado.',
  },
  tags: ['config', 'segredos', 'procede'],
}
