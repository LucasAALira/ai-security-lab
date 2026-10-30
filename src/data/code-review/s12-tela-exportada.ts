import type { ReviewSample } from './types'

export const telaExportada: ReviewSample = {
  id: 'tela-exportada',
  title: 'Tela exportada no manifesto do aplicativo',
  subtitle: 'Treinar a diferença entre alcançável e perigoso: o que a tela exportada faz quando alguém a abre?',
  area: 'mobile',
  level: 'Intermediário',
  minutes: 9,
  finding: {
    tool: 'Varredura de aplicativo (ferramenta fictícia)',
    rule: 'AND-006 · componente exportado sem permissão',
    severity: 'média',
    line: 4,
    message: 'Activity exportada pode ser iniciada por qualquer aplicativo instalado no aparelho.',
    confidence: 'alta',
  },
  context: [
    'O aplicativo tem uma tela de ajuda que responde a links do tipo `ajuda://` usados nos materiais de suporte e nas campanhas. Ela mostra artigos de uma lista fixa, embutida no aplicativo.',
    'A varredura marcou duas telas exportadas; esta é a primeira, e a outra é a tela de pagamento.',
  ],
  file: 'android/app/src/main/AndroidManifest.xml',
  language: 'xml',
  code: [
    '<activity',
    '    android:name=".ajuda.AjudaActivity"',
    '    android:exported="true"',
    '    android:launchMode="singleTask">',
    '    <intent-filter android:autoVerify="false">',
    '        <action android:name="android.intent.action.VIEW" />',
    '        <category android:name="android.intent.category.DEFAULT" />',
    '        <category android:name="android.intent.category.BROWSABLE" />',
    '        <data android:scheme="ajuda" />',
    '    </intent-filter>',
    '</activity>',
  ],
  extra: {
    title: 'O que a tela faz com o que recebe',
    language: 'kt',
    lines: [
      'class AjudaActivity : AppCompatActivity() {',
      '  override fun onCreate(estado: Bundle?) {',
      '    super.onCreate(estado)',
      '    val slug = intent?.data?.host.orEmpty()',
      '    val artigo = ARTIGOS[slug] ?: ARTIGOS["inicio"]!!   // mapa fixo, 24 artigos embutidos',
      '    setContentView(R.layout.ajuda)',
      '    findViewById<TextView>(R.id.titulo).text = artigo.titulo',
      '    findViewById<TextView>(R.id.corpo).text = artigo.corpo   // texto puro, sem HTML',
      '  }',
      '}',
      '',
      '// a tela não lê arquivos, não chama a rede e não usa WebView',
    ],
    note: 'O código da tela apontada pelo achado.',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'A tela é alcançável por qualquer aplicativo, mas o que ela faz com a entrada é procurar uma chave em um mapa fixo e desenhar texto puro. Sem ação sensível e sem dado do usuário, o alerta não descreve risco neste componente.',
    'Correto. A regra avalia a exposição, não o que o componente faz. Aqui a entrada só escolhe entre 24 artigos embutidos, com padrão quando a chave não existe.',
    'O manifesto e o código da tela estão disponíveis, e os dois juntos bastam para decidir sobre este componente.',
  ],
  verdictHints: [
    'Pergunte o que a tela faz com o valor recebido no link.',
    'Procure ações sensíveis: rede, arquivo, sessão, WebView.',
    'Exportado é a porta; o risco depende do que está do outro lado dela.',
  ],
  verdictExplain:
    'Componente exportado vira problema quando executa ação sensível com o que recebe: abrir conteúdo arbitrário, confirmar operação, carregar WebView, ler arquivo. Esta tela mapeia a entrada para um artigo embutido e exibe texto puro; o pior caso é alguém abrir a ajuda no artigo errado.',
  signals: [
    { text: 'A entrada só é usada como chave em um mapa fixo, com artigo padrão quando não existe.', feedback: 'Sim: o conjunto de resultados possíveis é fechado e conhecido.' },
    { text: 'O conteúdo é exibido como texto puro, sem HTML e sem WebView.', feedback: 'Sim: fecha o vetor mais comum em telas de conteúdo alcançáveis por link.' },
    { text: 'A tela não executa ação sensível: não lê arquivos, não chama a rede e não altera sessão.', feedback: 'Sim: é o que diferencia exposição de risco neste componente.' },
    { text: 'O filtro declara a categoria `BROWSABLE`.', feedback: 'Não altera o veredito: ela amplia quem pode abrir, e o que a tela faz continua inofensivo.' },
    { text: 'O modo de inicialização é `singleTask`.', feedback: 'Não: o modo afeta a pilha de telas e pode merecer atenção em outros casos, não neste alerta.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de falso positivo para **esta** tela.',
  signalHints: [
    'Olhe o que acontece com `slug` depois de recebido.',
    'Procure as ações que uma tela perigosa teria.',
    'Dois itens descrevem a exposição, não o efeito.',
  ],
  signalExplain:
    'O veredito se apoia no destino da entrada (mapa fixo com padrão), na forma de exibição (texto puro) e na ausência de ação sensível. Categoria e modo de inicialização descrevem como a tela é alcançada, o que já está admitido.',
  next: {
    prompt: 'Você fechou este achado. E o segundo componente exportado, a tela de pagamento?',
    options: [
      {
        text: 'Fechar esta tela com justificativa que cite o mapa fixo e a ausência de ação sensível; analisar a tela de pagamento separadamente, porque exportação com ação sensível muda o veredito; e acrescentar um teste que falhe se a tela de ajuda passar a abrir URL arbitrária ou WebView.',
        quality: 'best',
        flags: ['justifica', 'separa', 'teste'],
        feedback: 'Trata cada componente pelo que ele faz e deixa uma trava para o dia em que a tela de ajuda ganhar funcionalidade nova.',
        consequence: 'O ruído do manifesto diminui, a tela de pagamento entra em análise própria e uma mudança futura na ajuda reabre a discussão automaticamente.',
      },
      {
        text: 'Fechar os dois achados, já que ambos são telas do mesmo aplicativo e a primeira é inofensiva.',
        quality: 'poor',
        feedback: 'Vereditos não se herdam entre componentes: uma tela de pagamento alcançável por outro aplicativo pode confirmar operação sem o fluxo normal.',
        consequence: 'A tela de pagamento fica sem análise, com um registro dizendo que foi avaliada.',
      },
      {
        text: 'Marcar `exported="false"` na tela de ajuda para limpar o achado.',
        quality: 'poor',
        feedback: 'Os links `ajuda://` dos materiais de suporte deixam de abrir: a mudança quebra o que a tela existe para fazer.',
        consequence: 'As campanhas e os materiais de suporte param de funcionar e o problema volta como defeito de produto.',
      },
      {
        text: 'Exigir uma permissão própria para iniciar a tela de ajuda, mantendo o filtro de link.',
        quality: 'partial',
        feedback: 'Permissão própria não combina com link aberto pelo navegador: ou o link deixa de funcionar, ou a permissão não protege nada.',
        consequence: 'A configuração fica contraditória e alguém a remove no próximo ajuste do manifesto.',
      },
    ],
    hints: [
      'Cada componente exportado tem um veredito próprio.',
      'Pense no que a tela existe para fazer antes de fechá-la.',
      'Uma trava para o futuro vale mais do que a análise de hoje.',
    ],
    explain:
      'Em achados de manifesto, a triagem é por componente: a exposição é a mesma, o efeito é que muda. Fechar o inofensivo com justificativa, analisar o sensível à parte e deixar um teste que vigia mudanças é o que mantém o veredito válido.',
  },
  closing:
    'A tela de ajuda ficou exportada, com a justificativa registrada e um teste que falha se ela passar a abrir conteúdo externo; a tela de pagamento entrou em análise própria.',
  review: {
    solution: [
      'Para a tela de ajuda o veredito é falso positivo: a entrada vira chave em um mapa fixo e o conteúdo é texto puro.',
      'Os sinais são o mapa fixo com padrão, a exibição sem HTML nem WebView e a ausência de ação sensível.',
      'A conduta fecha esta tela com justificativa e teste, e manda a tela de pagamento para análise separada.',
    ],
    residual:
      'O veredito vale para o comportamento atual: basta a tela de ajuda passar a aceitar uma URL de artigo remoto, ou a abrir em WebView, para o mesmo manifesto virar problema.',
    validation:
      'Abra a tela por um link `ajuda://` com chave inexistente e confirme o artigo padrão; confirme que nenhuma requisição de rede parte dessa tela; e rode o teste que recusa WebView ou abertura de URL no fluxo da ajuda.',
  },
  frameworks: [
    { framework: 'owasp-mobile-top10', id: 'M8' },
    { framework: 'cwe', id: 'CWE-926' },
    { framework: 'masvs', id: 'MASVS-PLATFORM' },
  ],
  tags: ['mobile', 'android', 'falso-positivo'],
}
