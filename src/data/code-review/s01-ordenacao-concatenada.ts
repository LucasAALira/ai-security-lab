import type { ReviewSample } from './types'

export const ordenacaoConcatenada: ReviewSample = {
  id: 'ordenacao-concatenada',
  title: 'Concatenação em SQL no parâmetro de ordenação',
  subtitle: 'Treinar a diferença entre concatenar texto e aceitar texto do usuário: a regra olha a string, você olha de onde vem o valor.',
  area: 'web',
  level: 'Básico',
  minutes: 8,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'SQL-001 · consulta montada por concatenação',
    severity: 'alta',
    line: 14,
    message: 'Consulta SQL construída com concatenação de string. Use parâmetros vinculados.',
    confidence: 'alta',
  },
  context: [
    'A listagem de pedidos do painel interno aceita paginação e ordenação. O filtro de busca já usa parâmetros vinculados; a ordenação é montada à parte, porque `ORDER BY` não aceita parâmetro vinculado na maioria dos bancos.',
    'O método é chamado pelo controlador da rota `GET /pedidos`, com `ordenarPor` e `direcao` vindos da consulta da URL.',
  ],
  file: 'src/main/java/loja/pedidos/PedidoRepositorio.java',
  language: 'ts',
  code: [
    'private static final Map<String, String> COLUNAS = Map.of(',
    '    "data", "p.criado_em",',
    '    "valor", "p.valor_total",',
    '    "cliente", "c.nome"',
    ');',
    'private static final Set<String> DIRECOES = Set.of("ASC", "DESC");',
    '',
    'public List<Pedido> listar(String ordenarPor, String direcao, int pagina) {',
    '    String coluna = COLUNAS.get(ordenarPor);',
    '    if (coluna == null) coluna = "p.criado_em";',
    '    String ordem = DIRECOES.contains(direcao.toUpperCase()) ? direcao.toUpperCase() : "DESC";',
    '',
    '    // ORDER BY não aceita parâmetro vinculado: a coluna vem do mapa acima, nunca do pedido',
    '    String sql = "SELECT p.*, c.nome FROM pedidos p JOIN clientes c ON c.id = p.cliente_id"',
    '               + " WHERE p.loja_id = ? ORDER BY " + coluna + " " + ordem + " LIMIT ? OFFSET ?";',
    '',
    '    return jdbc.query(sql, new PedidoMapper(), lojaAtual(), TAMANHO_PAGINA, pagina * TAMANHO_PAGINA);',
    '}',
  ],
  extra: {
    title: 'Teste que acompanha o método',
    language: 'ts',
    lines: [
      '@Test',
      'void ordenacaoDesconhecidaCaiNoPadrao() {',
      '    List<Pedido> r = repositorio.listar("p.valor_total; DROP TABLE pedidos--", "ASC", 0);',
      '    assertThat(r).isNotNull(); // o valor não está no mapa: vira "p.criado_em"',
      '}',
    ],
    note: 'O teste descreve o comportamento com um valor fora do mapa.',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'A concatenação existe, mas nenhum pedaço dela vem do usuário: a coluna sai de um mapa fixo e a direção de um conjunto fixo. Sem valor controlado por quem chama, não há injeção aqui.',
    'Correto. A regra detecta a forma (concatenação) e não a origem do valor. Como `coluna` e `ordem` só podem assumir valores escritos no próprio código, o alerta não se sustenta neste trecho.',
    'O trecho traz o que é preciso para decidir: o mapa, o conjunto e o caminho do valor estão todos à vista. Declarar indeterminado aqui adia uma decisão que já é possível.',
  ],
  verdictHints: [
    'Pergunte que valores `coluna` e `ordem` podem ter quando a linha 14 executa.',
    'Siga o caminho do parâmetro `ordenarPor`: ele chega a entrar na string?',
    'Concatenar não é a falha; a falha é concatenar algo que o usuário escolhe.',
  ],
  verdictExplain:
    'Injeção depende de o atacante controlar parte da consulta. Aqui ele controla a chave de busca no mapa, não o valor usado: qualquer coisa fora do mapa vira `p.criado_em`. O achado descreve um padrão de risco real, mas neste trecho ele já está contido.',
  signals: [
    { text: 'A coluna sai de `COLUNAS.get(...)`, um mapa fixo escrito no código, com padrão quando a chave não existe.', feedback: 'Sim: o conjunto de valores possíveis é fechado e conhecido em tempo de compilação.' },
    { text: 'A direção é comparada com um conjunto fixo e só passa `ASC` ou `DESC`.', feedback: 'Sim: a segunda parte concatenada também tem valores possíveis fechados.' },
    { text: 'O `WHERE` e os limites usam parâmetros vinculados (`?`).', feedback: 'Sim: a parte que recebe dado do usuário está parametrizada, como deveria.' },
    { text: 'A consulta usa `JOIN` com a tabela de clientes.', feedback: 'Não: a junção não tem relação com a injeção; é só a forma da consulta.' },
    { text: 'O método é público e pode ser chamado de qualquer lugar da aplicação.', feedback: 'Não por si: visibilidade de método não cria injeção, e o mapa continua filtrando qualquer chamada.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais do trecho que sustentam o seu veredito.',
  signalHints: [
    'Procure onde cada pedaço da string é decidido.',
    'Separe o que vem de fora do que está escrito no código.',
    'Dois itens descrevem a consulta, mas não dizem nada sobre a origem dos valores.',
  ],
  signalExplain:
    'Os três sinais que importam descrevem a mesma coisa por ângulos diferentes: todo valor que entra na string tem conjunto fechado, e o que vem do usuário está parametrizado. Forma da consulta e visibilidade do método não mudam o veredito.',
  next: {
    prompt: 'Você fechou o alerta como falso positivo. O que fazer em seguida?',
    options: [
      {
        text: 'Fechar o achado com justificativa escrita no próprio sistema de varredura, apontando o mapa e o conjunto; acrescentar um teste que garanta o padrão para entrada fora do mapa; e marcar a regra como "exige revisão manual" neste arquivo, sem silenciá-la no projeto inteiro.',
        quality: 'best',
        flags: ['justifica', 'teste', 'escopo'],
        feedback: 'Fecha o alerta onde ele apareceu, deixa a razão registrada para a próxima pessoa e prende o comportamento com um teste, sem cegar a regra no resto do código.',
        consequence: 'A próxima varredura não reabre a discussão do zero, e uma futura mudança que tire a coluna do mapa quebra o teste antes de virar incidente.',
      },
      {
        text: 'Desativar a regra SQL-001 no projeto, já que ela gerou um alerta errado.',
        quality: 'poor',
        feedback: 'Uma regra que acertou o padrão e errou o contexto continua útil: desligá-la no projeto inteiro apaga os achados verdadeiros que virão.',
        consequence: 'A próxima concatenação com valor vindo do usuário passa sem alerta e chega à produção silenciosa.',
      },
      {
        text: 'Reescrever a consulta com parâmetros vinculados também no `ORDER BY`, para a regra parar de disparar.',
        quality: 'poor',
        feedback: 'A maioria dos bancos não aceita parâmetro vinculado em `ORDER BY`: a mudança não compila ou vira ordenação por constante, quebrando a funcionalidade.',
        consequence: 'A ordenação deixa de funcionar e o problema volta como defeito de produto, sem ganho de segurança.',
      },
      {
        text: 'Fechar o alerta como falso positivo, sem comentário, e seguir para o próximo.',
        quality: 'partial',
        feedback: 'O veredito está certo, mas sem justificativa registrada a próxima pessoa refaz a análise inteira, e ninguém percebe se o mapa mudar.',
        consequence: 'O mesmo alerta volta na próxima varredura e consome de novo o tempo de quem triar.',
      },
    ],
    hints: [
      'Pense em quem vai ler este achado daqui a seis meses.',
      'Fechar um alerta não é só mudar o estado dele.',
      'Uma das opções protege o veredito contra mudanças futuras no código.',
    ],
    explain:
      'Falso positivo bem fechado tem três partes: a justificativa no lugar onde o alerta aparece, um teste que prende a condição que o torna falso e o cuidado de não desligar a regra além do necessário. Sem o teste, o veredito vale só para a versão de hoje.',
  },
  closing:
    'O alerta foi fechado com justificativa e um teste que segura a condição. A regra continua ativa no resto do projeto, onde ainda vai encontrar concatenações de verdade.',
  review: {
    solution: [
      'O veredito é falso positivo: a concatenação só recebe valores de um mapa e de um conjunto fixos, e a parte que vem do usuário usa parâmetros vinculados.',
      'Os sinais que sustentam isso são o mapa com padrão, o conjunto de direções e o uso de `?` no `WHERE` e nos limites.',
      'A conduta adequada é fechar com justificativa registrada, acrescentar um teste para a entrada fora do mapa e manter a regra ativa no projeto.',
    ],
    residual:
      'O veredito vale para o código de hoje: se alguém passar a montar a coluna a partir do pedido, ou acrescentar uma chave perigosa ao mapa, a mesma linha volta a ser explorável. É isso que o teste tenta segurar.',
    validation:
      'Rode a consulta com `ordenarPor` fora do mapa e confirme a ordenação padrão; procure no projeto outras montagens de `ORDER BY` que não passem por mapa; e confirme que a justificativa do achado aparece na próxima varredura.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A05' },
    { framework: 'cwe', id: 'CWE-89' },
  ],
  tags: ['web', 'falso-positivo', 'sql'],
}
