import type { DossierContent } from '../types'

/* Dossiê: primeira sanção com multa aplicada pela ANPD (Brasil, 2023). Fatos com fonte numerada. */

export const telekall2023: DossierContent = {
  id: 'telekall-2023',
  title: 'Primeira multa da ANPD (Brasil, 2023): a microempresa que não conseguiu provar nada',
  subtitle: 'A primeira sanção com multa da autoridade brasileira não puniu um vazamento: puniu a ausência de base legal, de registro das operações, de relatório de impacto, de encarregado e de resposta à própria autoridade.',
  incidentDate: '2022-03-10 (instauração do processo sancionador)',
  publishedDate: '2023-07-06 (decisão publicada no Diário Oficial)',
  reviewed: '2026-10-19',
  summary: [
    'Em **6 de julho de 2023**, a ANPD publicou no Diário Oficial a sua **primeira sanção com multa** por descumprimento da LGPD, aplicada à **Telekall Infoservice**, uma microempresa. [1][3]',
    'As sanções foram uma **advertência** e **duas multas simples de R$ 7,2 mil cada**, totalizando **R$ 14,4 mil**; com pagamento em até 20 dias úteis e sem recurso, o total cairia 25%, para R$ 10,8 mil. [3]',
    'As imputações envolveram o **art. 7º da LGPD** (hipóteses de tratamento de dados pessoais) e o **art. 5º do Regulamento de Fiscalização** da ANPD. [3]',
    'Segundo o relato da decisão, a empresa **não comprovou base legal** para o tratamento que realizava, **não mantinha registro das operações**, **não apresentou relatório de impacto**, **não havia encarregado designado** e **não respondeu a um pedido da ANPD**. [3]',
    'O processo sancionador foi instaurado em **10 de março de 2022**; em março de 2023 a ANPD publicou a sua primeira lista de processos sancionadores, na qual a empresa constava. [3]',
    'A decisão está disponível na página da ANPD, em documento próprio do processo nº 00261.000489/2022-62. [1][2]',
  ],
  timeline: [
    { when: '2022-03-10', what: 'A ANPD instaura o processo administrativo sancionador contra a empresa.', source: 3 },
    { when: '2023-03', what: 'A ANPD publica a primeira lista de processos sancionadores, com a empresa entre os investigados.', source: 3 },
    { when: '2023-07-06', what: 'A decisão é publicada no Diário Oficial: advertência e duas multas simples de R$ 7,2 mil.', source: 1 },
    { when: '2023-07-06', what: 'A ANPD divulga o comunicado à imprensa sobre a primeira multa aplicada por descumprimento da LGPD.', source: 2 },
  ],
  component: {
    name: 'Programa de proteção de dados de uma microempresa que trata dados pessoais de terceiros',
    trust:
      'Quem fornece o próprio dado a uma empresa pequena confia que existe alguma razão legítima para a coleta e alguém responsável por responder sobre ela. Essa confiança não depende do tamanho da empresa: depende de haver base legal, registro e um canal que funcione.',
  },
  impact: [
    'Advertência e duas multas simples de R$ 7,2 mil, totalizando R$ 14,4 mil, com desconto de 25% em caso de pagamento sem recurso. [3]',
    'O caso fixou o primeiro precedente de multa da autoridade brasileira, aplicado a uma microempresa e não a uma grande plataforma. [1][3]',
    'A falta de resposta ao pedido da autoridade entrou no conjunto das imputações, somando-se às falhas de documentação. [3]',
  ],
  uncertainties: [
    'A decisão e o comunicado oficial não puderam ser lidos na íntegra nesta revisão: os fatos citados vêm da cobertura especializada, e as fontes oficiais estão listadas pelos endereços e títulos. [1][2][3]',
    'A fonte consultada não descreve o que motivou a abertura do processo (denúncia, fiscalização de ofício ou incidente). [3]',
    'Não consta quantos titulares foram afetados nem qual tratamento específico a empresa realizava. [3]',
    'Não foi verificado, nesta revisão, se houve recurso posterior e qual o valor efetivamente pago. [3]',
  ],
  analysis: [
    'A primeira multa do país não decorreu de um vazamento espetacular, e sim de ausência de documentação básica. Isso diz muito sobre o que a autoridade cobra primeiro.',
    'Cada imputação corresponde a um artefato que uma equipe pequena consegue produzir: base legal escrita, registro das operações, avaliação de impacto quando exigida e nome do encarregado publicado.',
    'Não responder à autoridade agravou o caso. Em fiscalização, silêncio não é neutro: ele próprio é infração.',
    'O valor baixo da multa não é o ponto. O precedente mostra que o porte reduz a dosimetria, mas não dispensa a obrigação.',
    'Para quem desenvolve software, a lição prática é que o inventário de tratamento é alimentado por decisões técnicas: cada campo coletado, cada integração e cada retenção precisa estar registrada em algum lugar.',
  ],
  lessons: [
    'Escreva a base legal de cada tratamento no mesmo lugar em que o campo é definido, e revise quando o produto mudar.',
    'Mantenha o registro das operações de tratamento atualizado a partir do código e das integrações, e não de memória.',
    'Publique quem é o encarregado e um canal que alguém de fato acompanhe, inclusive para pedidos da autoridade.',
    'Responda a ofício de fiscalização dentro do prazo, mesmo que a resposta seja parcial, e registre o envio.',
    'Faça a avaliação de impacto quando houver tratamento de risco, e guarde a versão que embasou a decisão.',
  ],
  exercise: {
    title: 'Simulação: a loja de celulares Aurora Telecom',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Aurora Telecom** é uma empresa inventada, com oito funcionários, que vende celulares e ativa linhas. Ela guarda documentos de clientes, histórico de compras e contatos para divulgação. Nomes, números e endereços são inventados.',
      'A empresa recebe um ofício da autoridade pedindo, em dez dias úteis, a lista dos tratamentos de dados, a base legal de cada um e a identificação do encarregado. Ninguém na empresa sabe por onde começar.',
    ],
    objective: 'Montar o mínimo exigível de documentação de proteção de dados em uma empresa pequena e responder a um ofício de fiscalização no prazo.',
    criteria: [
      'Você identifica quais tratamentos existem de fato, a partir do que a empresa faz.',
      'Você associa cada tratamento a uma base legal plausível, sem forçar consentimento para tudo.',
      'Você organiza uma resposta que cumpre o prazo mesmo com informação incompleta.',
    ],
    evidence: [
      {
        id: 'o-que-a-empresa-faz',
        title: 'Dados que a Aurora Telecom guarda hoje (fictício)',
        kind: 'table',
        from: 0,
        head: ['O que é guardado', 'Para que serve', 'Onde fica', 'Por quanto tempo'],
        rows: [
          ['Cópia de documento e comprovante de endereço', 'ativação de linha exigida pela operadora', 'pasta compartilhada na nuvem', 'indefinido'],
          ['Nome, telefone e histórico de compras', 'garantia e atendimento pós-venda', 'sistema de vendas', '5 anos'],
          ['Telefones de clientes antigos', 'envio de promoções por mensagem', 'planilha no computador da gerência', 'indefinido'],
          ['Currículos recebidos por e-mail', 'processos de contratação eventuais', 'caixa de e-mail da gerência', 'indefinido'],
        ],
        note: 'Para cada linha, pergunte se a finalidade ainda existe e se o prazo faz sentido.',
      },
      {
        id: 'oficio',
        title: 'Trecho do ofício recebido (fictício)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'A autoridade pede: (i) relação das operações de tratamento de dados pessoais, com finalidade e base legal; (ii) identificação do encarregado e canal de contato; (iii) descrição das medidas de segurança adotadas.',
          'O prazo é de dez dias úteis, prorrogável mediante pedido justificado apresentado antes do vencimento. O não atendimento pode configurar obstrução à fiscalização.',
          'A empresa não tem encarregado designado, não publicou canal de contato e nunca registrou as operações de tratamento.',
        ],
        note: 'Repare que existem três pedidos distintos e um prazo com possibilidade de prorrogação.',
      },
    ],
    activities: [
      {
        id: 'tratamentos-e-bases',
        kind: 'assign',
        variant: 'match',
        title: 'Base legal de cada tratamento',
        prompt: 'Associe cada tratamento da Aurora Telecom à base legal mais adequada, sem recorrer ao consentimento quando houver fundamento melhor.',
        rows: [
          { text: 'Guardar cópia de documento para ativar a linha, como a operadora exige.', why: 'A guarda decorre de obrigação imposta por norma do setor, e não de uma escolha comercial da loja.' },
          { text: 'Guardar nome, telefone e histórico de compras para garantia e pós-venda.', why: 'O tratamento é necessário para executar o contrato de compra e venda e a garantia dele.' },
          { text: 'Enviar promoções por mensagem para telefones de clientes antigos.', why: 'Divulgação por mensagem a quem não pediu depende de manifestação da pessoa, porque não é necessária ao contrato.' },
          { text: 'Guardar currículos recebidos por e-mail para contratações eventuais.', why: 'Sem processo seletivo aberto, a guarda indefinida não se sustenta: é preciso prazo e aviso ao candidato.' },
        ],
        choices: ['Cumprimento de obrigação legal ou regulatória', 'Execução de contrato', 'Consentimento do titular', 'Sem base adequada hoje: precisa de prazo e aviso'],
        accept: [[0], [1], [2], [3]],
        hints: [
          'Pergunte, em cada linha, se a empresa poderia deixar de fazer aquilo sem descumprir norma ou contrato.',
          'Consentimento é a resposta certa em um caso só.',
          'Um dos tratamentos não tem base adequada no estado atual.',
        ],
        explain:
          'Associar base legal obriga a explicitar a finalidade. Documento de ativação decorre de norma; histórico de compras executa o contrato; promoção não solicitada depende de consentimento; currículo guardado sem prazo nem aviso não tem base adequada.',
      },
      {
        id: 'resposta-ao-oficio',
        kind: 'decide',
        title: 'Como responder ao ofício',
        prompt: 'Faltam dez dias úteis e a empresa não tem documentação. Como responder?',
        options: [
          {
            text: 'Designar e publicar o encarregado com canal de contato; montar a relação de tratamentos a partir do que a empresa faz hoje, com finalidade, base legal e prazo de guarda; descrever as medidas de segurança existentes com honestidade; enviar no prazo o que estiver pronto, apontando o que será complementado e em quanto tempo.',
            quality: 'best',
            flags: ['encarregado', 'inventario', 'resposta'],
            feedback: 'Cumpre os três pedidos no nível possível, não omite lacunas e cria o compromisso de prazo que a autoridade pode acompanhar.',
            consequence: 'A empresa responde dentro do prazo, deixa de acumular a imputação por obstrução e passa a ter inventário e encarregado.',
          },
          {
            text: 'Não responder, porque a empresa é pequena e a LGPD não se aplicaria a microempresas.',
            quality: 'poor',
            feedback: 'A lei se aplica independentemente do porte, e o silêncio foi justamente uma das imputações no caso real.',
            consequence: 'A falta de resposta soma uma infração às demais e piora a dosimetria da sanção.',
          },
          {
            text: 'Responder dizendo que a empresa obtém consentimento de todos os clientes para tudo, e anexar um modelo de termo que será adotado.',
            quality: 'poor',
            feedback: 'Afirmar o que não existe é declaração falsa, e consentimento para tudo é a escolha errada de base legal em vários tratamentos.',
            consequence: 'A inconsistência aparece na primeira verificação e a empresa perde credibilidade no processo.',
          },
          {
            text: 'Pedir prorrogação do prazo sem apresentar nada, para montar a documentação completa antes de qualquer envio.',
            quality: 'partial',
            feedback: 'O pedido de prorrogação é legítimo, mas enviar nada no prazo desperdiça a chance de demonstrar boa-fé com o que já existe.',
            consequence: 'Se a prorrogação não for concedida, a empresa fica sem resposta protocolada na data limite.',
          },
        ],
        hints: [
          'Separe o que pode ser feito em dez dias do que leva mais tempo.',
          'Há um item que se resolve com uma decisão e uma publicação.',
          'Resposta parcial protocolada vale mais que resposta completa fora do prazo.',
        ],
        explain:
          'A resposta certa entrega o que é possível no prazo (encarregado publicado, inventário inicial, medidas reais) e declara o que falta, com compromisso de data. Isso afasta a imputação por não atendimento e inicia o programa.',
      },
      {
        id: 'minimo-exigivel',
        kind: 'multi',
        variant: 'multi',
        title: 'O mínimo exigível',
        prompt: 'Marque **todos** os itens que compõem o mínimo exigível de uma empresa pequena que trata dados pessoais.',
        options: [
          { text: 'Registro das operações de tratamento, com finalidade, base legal e prazo de guarda.', feedback: 'Sim: é a base de tudo, e foi a ausência dele que apareceu entre as imputações do caso real.' },
          { text: 'Encarregado designado, com nome e canal de contato publicados.', feedback: 'Sim: é obrigação simples de cumprir e a primeira coisa que a autoridade verifica na página da empresa.' },
          { text: 'Prazo de guarda definido para cada conjunto de dados, com descarte quando a finalidade termina.', feedback: 'Sim: guarda indefinida mantém risco sem contrapartida, e é o que a tabela da simulação mostra em três linhas.' },
          { text: 'Certificação internacional de segurança da informação auditada por terceiro.', feedback: 'Não: certificação pode ajudar, mas não é exigência da lei nem está ao alcance de uma empresa de oito pessoas.' },
          { text: 'Criptografia de ponta a ponta em toda comunicação interna por mensagem.', feedback: 'Não: é uma medida possível, mas não integra o mínimo exigível, e não substitui registro, base legal e encarregado.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Pense no que a autoridade pediu no ofício.',
          'O mínimo é documental e organizacional antes de ser técnico.',
          'Duas opções descrevem boas práticas que não são exigência.',
        ],
        explain:
          'O mínimo exigível é registro das operações, encarregado publicado e prazos de guarda com descarte. Medidas técnicas avançadas são desejáveis, mas não substituem o que a lei cobra primeiro.',
      },
    ],
    closing:
      'A Aurora Telecom designou o encarregado, montou o inventário com base legal e prazo, descreveu suas medidas com honestidade e protocolou a resposta no prazo, apontando o que faltava. O ponto central: a primeira multa do país foi por ausência de documentação, e documentação é o que uma empresa pequena consegue produzir.',
    review: {
      solution: [
        'As bases legais são: obrigação legal ou regulatória para o documento de ativação, execução de contrato para histórico de compras, consentimento para promoções por mensagem, e nenhuma base adequada hoje para currículos guardados sem prazo nem aviso.',
        'A resposta ao ofício designa e publica o encarregado, entrega o inventário inicial e as medidas reais no prazo, e declara o que será complementado e quando.',
        'O mínimo exigível é registro das operações, encarregado publicado e prazo de guarda com descarte; certificação e criptografia interna não integram esse mínimo.',
      ],
      residual:
        'Mesmo com o mínimo cumprido, continuam pendentes a avaliação de impacto nos tratamentos de maior risco e a adequação dos contratos com fornecedores, que exigem tempo e, às vezes, apoio externo.',
      validation:
        'Confira na página da empresa se o encarregado e o canal estão publicados e se alguém responde; e teste o inventário escolhendo três campos do sistema de vendas e verificando se cada um aparece no registro com finalidade e prazo.',
    },
  },
  sources: [
    {
      label: 'ANPD, "ANPD aplica a primeira multa por descumprimento à LGPD" (2023-07-06)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aplica-a-primeira-multa-por-descumprimento-a-lgpd',
      kind: 'primária',
    },
    {
      label: 'ANPD, decisão no processo nº 00261.000489/2022-62 (documento publicado pela autoridade)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/sei_00261-000489_2022_62_decisao_telekall_inforservice.pdf',
      kind: 'primária',
    },
    {
      label: 'MobileTime, "ANPD aplica sua primeira sanção com multa, a Telekall" (2023-07-06)',
      url: 'https://www.mobiletime.com.br/noticias/06/07/2023/anpd-aplica-sua-primeira-sancao-com-multa-a-telekall/',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A06' },
    { framework: 'nist-ssdf', id: 'PO.5' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de base legal, registro de tratamento, encarregado e resposta à fiscalização.',
}
