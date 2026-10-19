import type { DossierContent } from '../types'

/* Dossiê: incidente de confidencialidade em consultas ao DICT e sanção do Banco Central (Brasil, 2023-2025). */

export const pixSumupDict2024: DossierContent = {
  id: 'pix-sumup-dict-2024',
  title: 'Consultas ao DICT (Brasil, 2024): a API que devolvia mais do que a tela precisava',
  subtitle: 'Um grupo de 34 contas consultou chaves Pix em volume atípico durante quase seis meses. O Banco Central multou a instituição por três falhas: resposta com dados além do necessário, limite de consultas frouxo e ausência de detecção.',
  incidentDate: '2023-09-28',
  publishedDate: '2024-03-22 (comunicação pública do vazamento); decisão sancionadora em 2025-12-17',
  reviewed: '2026-10-19',
  summary: [
    'Entre **28 de setembro de 2023 e 16 de março de 2024**, um grupo de **34 usuários** apresentou comportamento atípico de consultas a chaves Pix na **Sumup Sociedade de Crédito Direto S.A.**; a decisão do Banco Central identifica **140.943 chaves potencialmente comprometidas**. [1]',
    'Em **22 de março de 2024**, o Banco Central comunicou publicamente o vazamento de dados cadastrais vinculados a **87.368 chaves Pix** sob responsabilidade da instituição, atribuindo-o a falhas de segurança dela. [3]',
    'As informações expostas incluíam **nome do titular, agência e conta, instituição recebedora e CPF mascarado** no caso de pessoa física; o Banco Central afirmou que não foram acessadas senhas, movimentações ou saldos. [1][3]',
    'A decisão aponta **três deficiências**: as respostas da API expunham mais dados do que o necessário; o limite interno de consultas não era mais restritivo do que o controle de requisições do próprio DICT; e não havia mecanismo adequado para detectar consultas excessivas que não resultavam em pagamento. [1]',
    'O Manual Operacional do DICT trata exatamente desses pontos: além dos mecanismos adotados pelo DICT, prevê os que **devem ser adotados pelos participantes** — política interna de limitação de consultas, monitoramento qualitativo e permanente, plano de ação para casos suspeitos e restrição dos dados da chave exibidos a quem consulta. [2]',
    'A infração imputada foi "deixar de atender requisitos técnicos de segurança do Pix". A multa final foi de **R$ 252 mil**: base de R$ 300 mil, acrescida de 20% pelo risco à imagem do Pix e reduzida em 30% pelo atendimento integral à intimação. [1]',
    'A instituição alegou ter sanado as deficiências e que apenas cerca de 0,02% das chaves cadastradas foram potencialmente afetadas. O Banco Central rejeitou a redução por saneamento, registrando que "a adoção de medidas saneadoras... não elidem o descumprimento já consumado". [1]',
    'Uma decisão anterior (1415/2025, de 12 de novembro de 2025) com o mesmo valor foi **anulada** porque a defesa apresentada em 14 de junho de 2024 não havia sido considerada; o caso foi rejulgado em **17 de dezembro de 2025**, sem suspensão nem exclusão do Pix. [1]',
  ],
  timeline: [
    { when: '2023-09-28 a 2024-03-16', what: 'Período do incidente: 34 usuários consultam chaves Pix em volume atípico; 140.943 chaves são consideradas potencialmente comprometidas.', source: 1 },
    { when: '2024-03-22', what: 'O Banco Central comunica publicamente o vazamento de dados cadastrais vinculados a 87.368 chaves Pix.', source: 3 },
    { when: '2024-06-14', what: 'A instituição apresenta defesa no processo administrativo.', source: 1 },
    { when: '2025-11-12', what: 'Primeira decisão sancionadora é proferida e depois anulada por não ter considerado a defesa.', source: 1 },
    { when: '2025-12-17', what: 'Nova decisão aplica multa de R$ 252 mil pelo descumprimento dos requisitos técnicos de segurança do Pix.', source: 1 },
  ],
  component: {
    name: 'Consulta de chaves Pix ao DICT feita por uma instituição participante, em nome dos seus usuários',
    trust:
      'Quem cadastra uma chave Pix confia que ela só revela o necessário para alguém pagar: um nome parcial para conferência. A instituição que consulta o diretório age em nome do usuário, e esse direito de perguntar vale para pagar, não para montar lista de nomes, contas e documentos.',
  },
  impact: [
    '140.943 chaves consideradas potencialmente comprometidas na decisão, e 87.368 na comunicação pública do Banco Central. [1][3]',
    'Dados cadastrais de titulares de conta expostos: nome, agência, conta, instituição e CPF mascarado. [1]',
    'Multa de R$ 252 mil à instituição, com agravante por risco à imagem do Pix. [1]',
    'Segundo o Banco Central, não houve acesso a senhas, saldos ou movimentações, e os dados obtidos não permitem movimentar recursos. [3]',
  ],
  uncertainties: [
    'Os números divulgados não coincidem: a comunicação pública fala em 87.368 chaves e a decisão sancionadora em 140.943 potencialmente comprometidas. As fontes não explicam a diferença. [1][3]',
    'Não consta nas fontes consultadas o que foi feito com os dados consultados nem se houve fraude decorrente. [1][3]',
    'A identidade e a motivação dos 34 usuários com comportamento atípico não são descritas na versão consultada. [1]',
    'Não foi verificado, nesta revisão, se houve recurso contra a decisão de dezembro de 2025. [1]',
  ],
  analysis: [
    'As três deficiências formam o roteiro clássico de abuso de API: a resposta entrega campo demais, o limite por identidade é frouxo e ninguém observa o padrão de uso.',
    'O detalhe mais instrutivo é o limite interno não ser mais restritivo que o do diretório. Confiar no limite da plataforma central significa permitir, para cada usuário, o teto pensado para a instituição inteira.',
    'Consulta que não resulta em pagamento é o sinal que importa. O indicador não é "quantas consultas", é "quantas consultas sem transação", que separa uso legítimo de coleta.',
    'Mascarar o CPF ajudou, mas o conjunto nome, agência, conta e instituição já basta para montar uma lista de alvos de fraude por mensagem.',
    'A autoridade recusou abater a pena por saneamento posterior: corrigir depois não apaga o período em que o controle faltou. Isso muda o cálculo de prioridade de quem desenvolve.',
  ],
  lessons: [
    'Devolva o mínimo em consulta de identificação: nome parcial e o necessário para conferência, nunca o registro completo.',
    'Defina limite por usuário mais restritivo que o limite da plataforma, e considere limites por janela curta e por dia.',
    'Meça a razão entre consultas e pagamentos efetivados por conta, e alerte quando ela se afastar da linha de base.',
    'Trate o conjunto das 34 contas como cenário de teste: simule abuso distribuído por várias contas pequenas, não só por uma.',
    'Documente a política interna de limitação e o monitoramento: nesse setor, a ausência do documento já é descumprimento.',
  ],
  exercise: {
    title: 'Simulação: o diretório de chaves da Aurora Pagamentos',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Aurora Pagamentos** é uma instituição inventada que consulta um diretório central de chaves em nome dos seus usuários, para preencher a tela de confirmação de pagamento. Nomes, números e endereços são inventados.',
      'O time de risco nota que algumas contas consultam muito e pagam pouco. A plataforma central permite, por instituição, até 2.000 consultas por minuto; internamente, não existe limite por usuário.',
    ],
    objective: 'Reduzir a resposta da consulta ao necessário, definir limites por usuário e criar o indicador que detecta coleta disfarçada de uso legítimo.',
    criteria: [
      'Você identifica quais campos da resposta devem ser cortados.',
      'Você escolhe um conjunto de limites que impede abuso distribuído em várias contas.',
      'Você define um indicador que separa consulta para pagar de consulta para coletar.',
    ],
    evidence: [
      {
        id: 'resposta-da-consulta',
        title: 'Resposta atual da consulta de chave (fictícia)',
        kind: 'code',
        from: 0,
        language: 'json',
        lines: [
          '{',
          '  "chave": "contato@exemplo.example",',
          '  "nomeCompleto": "...",',
          '  "documento": "000.000.000-00",',
          '  "instituicao": "Banco Aurora",',
          '  "agencia": "0001",',
          '  "conta": "123456-7",',
          '  "tipoConta": "corrente",',
          '  "dataAberturaConta": "2019-04-02",',
          '  "dataPosseDaChave": "2021-08-15"',
          '}',
        ],
        note: 'Compare com o que a tela de confirmação precisa mostrar para a pessoa reconhecer quem vai receber.',
      },
      {
        id: 'uso-por-conta',
        title: 'Consultas e pagamentos por conta em 30 dias (fictício)',
        kind: 'table',
        from: 1,
        head: ['Conta', 'Consultas', 'Pagamentos concluídos', 'Consultas por pagamento', 'Chaves distintas'],
        rows: [
          ['conta comum (mediana)', '34', '21', '1,6', '19'],
          ['lojista com alto volume', '2.900', '2.480', '1,2', '2.310'],
          ['conta A', '18.400', '3', '6.133', '18.390'],
          ['conta B', '9.700', '1', '9.700', '9.690'],
          ['conta C', '4.100', '0', 'sem pagamento', '4.095'],
        ],
        note: 'Olhe a coluna de consultas por pagamento: ela distingue volume legítimo de coleta.',
      },
    ],
    activities: [
      {
        id: 'campos-da-resposta',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que cortar da resposta',
        prompt: 'Marque **todos** os campos que devem sair da resposta da consulta, porque a tela de confirmação de pagamento não precisa deles.',
        options: [
          { text: '`documento` com o CPF completo.', feedback: 'Sim: para conferência basta uma parte mascarada; o documento completo transforma a consulta em fonte de cadastro.' },
          { text: '`agencia` e `conta`.', feedback: 'Sim: o pagamento por chave não exige agência e conta na tela; devolvê-las expande o que o abuso coleta.' },
          { text: '`dataAberturaConta` e `dataPosseDaChave`.', feedback: 'Sim: não ajudam a pessoa a reconhecer o destinatário e ainda servem para medir maturidade de conta em golpes.' },
          { text: '`nomeCompleto` reduzido a nome parcial.', feedback: 'Não é remoção: o nome parcial é justamente o que permite a conferência; o que deve sair é o nome completo.' },
          { text: '`instituicao` do recebedor.', feedback: 'Não: saber a instituição que vai receber ajuda a pessoa a confirmar o destino do pagamento.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Pergunte o que a pessoa precisa ver para reconhecer quem vai receber.',
          'Campos de data e de conta não ajudam na conferência.',
          'Dois itens pertencem à tela e não devem ser removidos.',
        ],
        explain:
          'A tela de confirmação precisa de nome parcial e instituição. Documento completo, agência, conta e datas não servem à conferência e são exatamente o que dá valor a uma consulta em massa.',
      },
      {
        id: 'limites',
        kind: 'decide',
        title: 'Os limites por usuário',
        prompt: 'A plataforma central permite 2.000 consultas por minuto por instituição. Qual política de limites a Aurora Pagamentos deve adotar?',
        options: [
          {
            text: 'Limite por usuário bem abaixo do limite da instituição, em duas janelas (por minuto e por dia), mais limite por aparelho e por faixa de rede; e bloqueio temporário com revisão humana quando o limite diário for atingido.',
            quality: 'best',
            flags: ['limite-usuario', 'janelas', 'revisao'],
            feedback: 'Impede que uma conta consuma a cota da instituição e cobre o abuso distribuído por várias contas no mesmo aparelho ou rede.',
            consequence: 'As contas de coleta batem no limite diário em minutos e caem para revisão, enquanto o lojista de alto volume segue operando.',
          },
          {
            text: 'Adotar internamente o mesmo limite da plataforma central: 2.000 consultas por minuto por usuário.',
            quality: 'poor',
            feedback: 'É exatamente a falha apontada no caso real: o limite por usuário igual ao da instituição não limita nada na prática.',
            consequence: 'Uma única conta pode consumir toda a cota da instituição e extrair dados por meses sem violar nenhum limite.',
          },
          {
            text: 'Não aplicar limite por usuário e bloquear manualmente as contas denunciadas pelo time de risco.',
            quality: 'poor',
            feedback: 'Depende de alguém notar depois, e a coleta acontece em dias; sem limite automático, o dano já ocorreu quando o bloqueio chega.',
            consequence: 'A extração continua até a denúncia e o período de exposição fica igual ao do caso real: quase seis meses.',
          },
          {
            text: 'Aplicar um limite único diário por usuário, sem janela curta nem limite por aparelho.',
            quality: 'partial',
            feedback: 'Melhora bastante, mas permite rajadas rápidas dentro do dia e não cobre a divisão do abuso entre várias contas.',
            consequence: 'A coleta passa a ser feita em rajadas distribuídas entre contas novas, abaixo do limite diário de cada uma.',
          },
        ],
        hints: [
          'Pergunte quanto um usuário comum consulta por dia, segundo a tabela.',
          'Pense em como alguém dividiria o abuso para passar sob o limite.',
          'Uma janela só costuma deixar brecha.',
        ],
        explain:
          'O limite precisa ser por usuário e bem menor que o da instituição, em mais de uma janela, somado a limites por aparelho e rede para cobrir abuso distribuído, com revisão humana no bloqueio.',
      },
      {
        id: 'indicador',
        kind: 'order',
        title: 'Como detectar a coleta',
        prompt: 'Ordene as quatro etapas da detecção, começando pela que identifica o comportamento e terminando na que o interrompe.',
        items: [
          { text: 'Calcular, por conta, a razão entre consultas e pagamentos concluídos, com linha de base por perfil (pessoa, lojista, alto volume).', why: 'É o indicador que separa quem consulta para pagar de quem consulta para coletar, sem punir volume legítimo.' },
          { text: 'Alertar quando a razão e o número de chaves distintas se afastarem da linha de base do perfil.', why: 'O desvio em duas dimensões ao mesmo tempo reduz alarme falso e aponta a conta certa.' },
          { text: 'Reduzir automaticamente o limite da conta sob suspeita e exigir nova confirmação de identidade.', why: 'Diminui o dano enquanto a análise acontece, sem bloquear quem talvez seja legítimo.' },
          { text: 'Encerrar o acesso e comunicar o incidente ao regulador e aos titulares quando o abuso se confirmar.', why: 'É o passo final, e nos serviços regulados ele tem prazo e conteúdo definidos.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Primeiro é preciso medir para poder alertar.',
          'Entre alertar e encerrar existe um passo que reduz o dano sem decidir nada.',
          'A comunicação ao regulador vem por último, com o abuso confirmado.',
        ],
        explain:
          'Medir, alertar, conter e comunicar. A ordem importa porque cada etapa depende da anterior: sem linha de base não há alerta confiável, e sem contenção intermediária a escolha fica entre ignorar e bloquear.',
      },
    ],
    closing:
      'A Aurora Pagamentos cortou documento, conta e datas da resposta, impôs limite por usuário muito abaixo do limite da instituição, passou a medir consultas por pagamento e preparou a contenção gradual. O ponto central: direito de consultar em nome do usuário não é direito de consultar sem limite, e a resposta deve caber na tela.',
    review: {
      solution: [
        'Saem da resposta o documento completo, agência, conta e as datas de abertura e de posse da chave; ficam nome parcial e instituição, que sustentam a conferência.',
        'A política de limites é por usuário, bem abaixo do limite da instituição, em janelas curta e diária, com limites por aparelho e rede e revisão humana no bloqueio.',
        'A detecção segue quatro etapas: medir consultas por pagamento com linha de base, alertar no desvio, reduzir limite e exigir confirmação, e encerrar e comunicar quando confirmado.',
      ],
      residual:
        'Mesmo com limites e indicadores, um abuso lento distribuído por muitas contas pode passar por baixo da linha de base, e os dados já coletados continuam úteis para fraude por mensagem.',
      validation:
        'Faça um teste de abuso em ambiente de homologação com dez contas consultando abaixo do limite individual e confirme se o indicador agregado por aparelho e rede dispara; e verifique na resposta de produção que nenhum campo removido voltou em versão nova da API.',
    },
  },
  sources: [
    {
      label: 'Banco Central do Brasil, Decisão 1593/2025-BCB/DERAD, de 17 de dezembro de 2025 (processo PE 269778)',
      url: 'https://www.bcb.gov.br/conteudo/decap/DecisoesPix/DECISAO_1593_2025-BCB_DERAD.pdf',
      kind: 'primária',
    },
    {
      label: 'Banco Central do Brasil, Manual Operacional do DICT (seções de prevenção a ataques de leitura e de limitação de requisições à API)',
      url: 'https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/X_ManualOperacionaldoDICT.pdf',
      kind: 'primária',
    },
    {
      label: 'Mercado&Consumo, "BC informa vazamento de dados de 87.368 chaves Pix ligadas à Sumup" (2024-03-22)',
      url: 'https://mercadoeconsumo.com.br/22/03/2024/meios-de-pagamento/bc-informa-vazamento-de-dados-de-87-368-chaves-pix-ligadas-a-sumup/',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API4' },
    { framework: 'owasp-api-top10', id: 'API3' },
    { framework: 'cwe', id: 'CWE-770' },
  ],
  country: 'Brasil',
  tags: ['api', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de limitação de requisições, minimização de resposta e detecção de abuso em API.',
}
