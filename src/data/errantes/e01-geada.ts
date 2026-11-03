import type { ErranteSpec } from './types'

/* A Geada: exaustão de recursos. Todos os dados são sintéticos — host `.example` e IPs das faixas
   reservadas para documentação. Nenhum CVE, vítima ou prejuízo inventado. */

export const geada: ErranteSpec = {
  id: 'errante-geada',
  nome: 'A Geada',
  epiteto: 'que para o serviço sem derrubá-lo',
  elemento: 'gelo',
  forma: 'gelo',
  resumo: 'Exaustão de recursos: uma entrada pequena que custa caro demais para processar, e nenhum limite para contê-la.',
  fala: 'Não derrubei portão nenhum. Apenas pedi, muitas vezes, aquilo que vocês nunca mediram quanto custa.',
  missao: {
    id: 'errante-geada',
    campaign: '',
    order: 1,
    title: 'A Geada',
    level: 'Intermediário',
    minutes: 12,
    prereqs: 'Ajuda ter visto limites de uso e tempo em APIs. O resto vem das evidências.',
    objective: 'Descobrir o que congela a busca, escolher a medida que devolve o serviço hoje e selar a falha para que a Geada não volte pela mesma fresta.',
    context: [
      'A busca de produtos da **Nortia** (loja fictícia) começou a responder em 30 segundos às terças à tarde. Nenhum alerta de queda: o serviço está de pé, só não responde.',
      'O time já reiniciou duas vezes. Volta ao normal por vinte minutos e congela de novo.',
    ],
    criteria: [
      'Você identifica o custo escondido de uma entrada pequena, em vez de culpar o volume de acessos.',
      'Você escolhe uma medida imediata que devolve o serviço sem desligar a busca.',
      'Você sela a falha com limite, tempo máximo e teste, não com mais máquina.',
    ],
    evidence: [
      {
        id: 'log',
        title: 'Amostra do log da borda',
        kind: 'table',
        from: 0,
        head: ['Horário', 'Origem', 'Rota', 'Tamanho do termo', 'Tempo'],
        rows: [
          ['14:02:11', '198.51.100.24', '/busca', '12', '120 ms'],
          ['14:02:12', '198.51.100.24', '/busca', '2 048', '28 400 ms'],
          ['14:02:13', '198.51.100.24', '/busca', '2 048', '29 100 ms'],
          ['14:02:15', '203.0.113.9', '/busca', '18', 'tempo esgotado'],
          ['14:02:16', '203.0.113.9', '/carrinho', '—', 'tempo esgotado'],
        ],
        note: 'Repare quem está lento e quem só ficou esperando a vez.',
      },
      {
        id: 'codigo',
        title: 'busca/termo.ts',
        kind: 'code',
        from: 0,
        language: 'ts',
        lines: [
          'const PADRAO = /^(\\s*[\\w-]+\\s*)+$/',
          '',
          'export function normalizar(termo: string) {',
          '  // valida o termo inteiro antes de consultar o índice',
          '  if (!PADRAO.test(termo)) throw new Error("termo inválido")',
          '  return termo.trim().toLowerCase()',
          '}',
        ],
        note: 'O grupo repetido dentro de outra repetição é o detalhe que importa.',
      },
      {
        id: 'config',
        title: 'Configuração do serviço de busca',
        kind: 'text',
        from: 0,
        paragraphs: [
          'Pool de 8 conexões por instância, 2 instâncias. Sem limite de tamanho para o termo. Sem tempo máximo por requisição.',
          'O cliente da loja repete a chamada 3 vezes quando não recebe resposta, sem espera entre as tentativas.',
        ],
      },
    ],
    activities: [
      {
        id: 'reconhecer',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que congela a busca',
        prompt: 'Marque **tudo o que ajuda a Geada** a parar o serviço. Há mais de um sinal.',
        options: [
          { text: 'A expressão regular tem repetição dentro de repetição, e o tempo de verificação explode com termos longos.', feedback: 'Isso. Um termo de 2 KB sem casamento faz o verificador tentar um número absurdo de combinações — é o que o log mostra em 28 segundos.' },
          { text: 'Não há limite de tamanho para o termo da busca.', feedback: 'Isso. Sem limite, o atacante escolhe o tamanho da conta que você vai pagar.' },
          { text: 'Não há tempo máximo por requisição: a chamada lenta segura a conexão até o fim.', feedback: 'Isso. Sem prazo, cada requisição cara ocupa um lugar do pool indefinidamente.' },
          { text: 'O cliente repete três vezes sem espera, multiplicando a carga justo quando o serviço está pior.', feedback: 'Isso. A repetição sem espera transforma um tropeço em queda.' },
          { text: 'O atacante usa dois endereços diferentes, então é um ataque distribuído.', feedback: 'Não. O segundo endereço é um cliente comum esperando a vez — ele é vítima, não origem.' },
          { text: 'Faltam máquinas: duas instâncias são pouco para uma loja.', feedback: 'Não. Com custo ilimitado por requisição, qualquer número de instâncias é pouco; mais máquina só adia a próxima terça-feira.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Compare a linha de 12 caracteres com a de 2 048: o que muda não é a quantidade de acessos.',
          'Olhe o que falta na configuração, não só o que está no código.',
          'Pergunte-se quem ocupa o pool e por quanto tempo.',
        ],
        explain:
          'A Geada não precisa de volume: precisa de uma entrada barata para ela e cara para você. A repetição aninhada na expressão regular faz o custo crescer de forma explosiva com o tamanho do termo; sem limite de tamanho nem tempo máximo, cada requisição dessas ocupa uma conexão do pool até terminar. Com 8 conexões por instância, bastam algumas para que os clientes comuns só vejam espera. A repetição do cliente sem intervalo fecha o ciclo.',
      },
      {
        id: 'aparar',
        kind: 'decide',
        title: 'A medida de hoje',
        prompt: 'São 14 h de uma terça. O que você faz **agora** para devolver a busca aos clientes?',
        options: [
          {
            text: 'Impor limite de tamanho ao termo (por exemplo, 64 caracteres) e tempo máximo por requisição, já na borda.',
            quality: 'best',
            flags: ['contido'],
            feedback: 'Corta a entrada cara e libera o pool, sem desligar a busca para ninguém. É o que devolve o serviço na hora.',
            consequence: 'A latência volta ao normal em minutos; os termos longos passam a ser recusados com mensagem clara.',
          },
          {
            text: 'Bloquear o endereço 198.51.100.24 no firewall.',
            quality: 'partial',
            feedback: 'Alivia por alguns minutos, mas o endereço é barato de trocar e a fresta continua aberta. Serve como medida acessória, não como resposta.',
            consequence: 'O serviço melhora até a próxima origem aparecer, meia hora depois.',
          },
          {
            text: 'Dobrar o número de instâncias e o tamanho do pool.',
            quality: 'poor',
            feedback: 'Paga mais caro pela mesma falha: o custo por requisição continua ilimitado, então a Geada só precisa pedir mais um pouco.',
            consequence: 'A conta sobe, o congelamento volta no mesmo dia com mais requisições.',
          },
          {
            text: 'Desligar a busca até a correção sair.',
            quality: 'poor',
            feedback: 'Entrega à Geada exatamente o que ela queria, e sem precisar continuar pedindo.',
            consequence: 'A loja perde a busca por dois dias; o incidente vira caso de negócio.',
          },
        ],
        hints: [
          'A melhor medida de hoje é a que não depende de adivinhar quem é o atacante.',
          'Pense no que limita o custo de uma requisição, não no que aumenta a sua capacidade.',
          'Uma boa contenção não tira a funcionalidade dos clientes legítimos.',
        ],
        explain:
          'Limite de tamanho e tempo máximo atacam a causa — o custo ilimitado por requisição — e funcionam contra qualquer origem. Bloquear endereço é remendo; aumentar capacidade é pagar pela falha; desligar a busca é conceder a vitória.',
      },
      {
        id: 'selar',
        kind: 'multi',
        variant: 'multi',
        title: 'Selar a fresta',
        prompt: 'Escolha o que entra na correção definitiva, a que impede a Geada de voltar pela mesma porta.',
        options: [
          { text: 'Reescrever a validação sem repetição aninhada, ou trocá-la por uma verificação simples de caracteres permitidos.', feedback: 'Sim. Sem a ambiguidade, o custo volta a ser proporcional ao tamanho.' },
          { text: 'Validar o tamanho antes de qualquer processamento, no servidor.', feedback: 'Sim. A primeira coisa a fazer com uma entrada é descobrir se ela cabe.' },
          { text: 'Definir tempo máximo por requisição e por consulta ao índice.', feedback: 'Sim. Um prazo transforma uma falha silenciosa em erro visível e devolve a conexão.' },
          { text: 'Repetição do cliente com espera crescente e um limite de tentativas.', feedback: 'Sim. Evita que a repetição empurre o serviço ladeira abaixo.' },
          { text: 'Um teste que mede o tempo da validação com um termo longo e falha se passar do limite.', feedback: 'Sim. É o que impede a volta silenciosa da falha num refatoramento futuro.' },
          { text: 'Mostrar um desafio visual (captcha) antes de toda busca.', feedback: 'Não. Pesa para todo cliente legítimo e não muda o custo da requisição que passar.' },
          { text: 'Guardar o termo completo no log para investigar depois.', feedback: 'Não. Além de não conter nada, guardar entrada bruta sem limite cria outro problema.' },
        ],
        correct: [0, 1, 2, 3, 4],
        hints: [
          'A correção definitiva mexe no custo da operação e no prazo dela.',
          'Pense no que impede a falha de voltar sem ninguém perceber.',
          'Duas opções resolvem sintoma e criam outro problema.',
        ],
        explain:
          'A fresta se fecha com três camadas: a validação deixa de ter custo explosivo, a entrada passa a ter tamanho máximo e a operação passa a ter prazo. A repetição com espera evita o efeito dominó, e o teste de tempo é o que garante que a correção sobreviva ao próximo refatoramento.',
      },
    ],
    clean: { require: ['contido'], forbid: [] },
    closing: [
      { when: ['contido'], text: 'A busca voltou antes do fim da tarde, e a Geada se desfez sem derrubar nada — como sempre fez. O que mudou foi o preço de pedir.' },
      { text: 'O serviço voltou, mas pela porta que a Geada conhece. Ela costuma lembrar o caminho.' },
    ],
    review: {
      solution: [
        'O custo de processar uma entrada precisa ser conhecido e limitado: tamanho máximo, prazo máximo e uma validação que não exploda com o tamanho.',
        'Limites na borda protegem todo mundo atrás dela, inclusive os serviços que você não lembrou de proteger.',
        'Repetição de cliente sem espera é um amplificador: toda política de repetição precisa de intervalo crescente e teto.',
      ],
      residual: 'Mesmo com os limites, uma entrada válida e grande ainda custa mais que uma pequena: vale acompanhar a latência por tamanho de termo e manter um teto de uso por cliente.',
      validation: 'Repita o termo longo do log em ambiente de teste e confirme três coisas: a validação recusa em milissegundos, a requisição morre no prazo e o pool nunca passa de metade ocupado.',
    },
    refs: [
      { label: 'OWASP API Security Top 10:2023 — API4', framework: { framework: 'owasp-api-top10', id: 'API4' }, note: 'Consumo de recursos sem restrição.' },
      { label: 'CWE-770', framework: { framework: 'cwe', id: 'CWE-770' }, note: 'Alocação de recursos sem limite nem controle de vazão.' },
    ],
    medals: [],
    tags: ['disponibilidade', 'api', 'limites'],
  },
}
