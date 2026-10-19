import type { DossierContent } from '../types'

/* Dossiê: apuração da ANPD sobre compartilhamento de dados entre operadora e bureau de crédito (Brasil, 2026). */

export const claroSerasa2026: DossierContent = {
  id: 'claro-serasa-2026',
  title: 'Operadora e bureau de crédito (Brasil, 2026): o contrato que compartilhava mais do que precisava',
  subtitle: 'A ANPD abriu processo sancionador contra a Claro por possível compartilhamento excessivo de dados de clientes com a Serasa, falta de transparência e dificuldade de acesso ao encarregado.',
  incidentDate: '2022 (apuração iniciada no processo nº 00261.000227/2022-06)',
  publishedDate: '2026-06-08 (anúncio da ANPD)',
  reviewed: '2026-10-19',
  summary: [
    'Em **8 de junho de 2026**, a ANPD anunciou a instauração de processo administrativo sancionador contra a **Claro**, a partir da apuração de um contrato de **fornecimento de dados dos clientes da operadora à Serasa**. [1]',
    'Segundo a autoridade, os dados seriam usados "para o desenvolvimento de metodologias de análise de crédito e avaliação de outras condições de mercado". [1]',
    'As possíveis infrações apontadas à operadora são **compartilhamento excessivo de dados**, **falta de transparência** em relação aos titulares e **dificuldade de acesso ao encarregado**. [1]',
    'A operadora também recebeu uma **orientação com determinações** sobre os seus contratos de compartilhamento atuais e futuros. [1]',
    'Em relação à **Serasa**, a ANPD determinou nova fiscalização sobre transparência e direitos dos titulares, para verificar se a política de privacidade informa adequadamente quem compartilha dados com a empresa e com quem ela os compartilha. [1]',
    'As duas empresas tinham **dez dias úteis** a contar da intimação para responder; a ausência de resposta pode configurar obstrução à fiscalização, o que constitui sanção adicional. [1]',
    'Os documentos públicos estão nos processos nº **00261.000227/2022-06**, **00261.003285/2026-15** e **00261.003351/2026-49**; as sanções possíveis seguem o art. 52 da LGPD, com multa de até R$ 50 milhões por infração ou até 2% do faturamento. [1][2]',
  ],
  timeline: [
    { when: '2022', what: 'A ANPD inicia a apuração sobre o contrato de compartilhamento de dados entre a operadora e o bureau de crédito.', source: 1 },
    { when: '2026-06-08', what: 'A autoridade anuncia a instauração do processo sancionador contra a operadora e a orientação sobre contratos de compartilhamento.', source: 1 },
    { when: '2026-06-08', what: 'A autoridade determina nova fiscalização sobre o bureau de crédito, voltada a transparência e direitos dos titulares.', source: 1 },
    { when: '2026-06', what: 'Veículos de imprensa noticiam a abertura do processo e o alcance da apuração.', source: 2 },
    { when: '2026-07-03', what: 'A página oficial da ANPD registra atualização do conteúdo sobre o caso.', source: 1 },
  ],
  component: {
    name: 'Contrato de compartilhamento de dados de clientes entre uma operadora de telecomunicações e um bureau de crédito',
    trust:
      'Quem contrata um plano de telefonia confia que os seus dados servem para prestar aquele serviço, e não para alimentar a metodologia de análise de crédito de uma terceira empresa. A pessoa não participa desse contrato e, em geral, não sabe que ele existe.',
  },
  impact: [
    'Processo administrativo sancionador contra a operadora, com possibilidade de multa de até R$ 50 milhões por infração ou até 2% do faturamento. [1]',
    'Determinações sobre os contratos de compartilhamento atuais e futuros da operadora. [1]',
    'Nova fiscalização sobre o bureau de crédito, com foco em transparência e direitos dos titulares. [1]',
    'Prazo de dez dias úteis para resposta, sob risco de sanção adicional por obstrução. [1]',
  ],
  uncertainties: [
    'A fonte oficial não lista quais categorias de dados foram compartilhadas nem o volume de titulares alcançados. [1]',
    'A base legal invocada pelas empresas para o compartilhamento não é informada na página consultada. [1]',
    'O caso está em apuração: as infrações são possíveis, e não confirmadas, e as empresas ainda apresentarão defesa. [1][2]',
    'Esta revisão não verificou o resultado do processo nem eventual acordo ou recurso posterior. [1]',
  ],
  analysis: [
    'O caso não trata de invasão nem de vazamento: trata de um fluxo autorizado por contrato entre duas empresas, em que o titular não é parte.',
    'Compartilhamento excessivo é um problema de engenharia, não só de jurídico: a integração costuma enviar o registro inteiro porque é mais simples do que selecionar campos.',
    'Transparência, aqui, significa poder responder a uma pergunta concreta: "quem recebeu os meus dados e para quê?". Se a resposta não existe no produto, ela não existe.',
    'A dificuldade de acesso ao encarregado agrava qualquer caso: sem canal que funcione, o titular não exerce direito e a empresa perde a chance de corrigir antes da autoridade.',
    'A fiscalização atingir as duas pontas mostra que receber dado também gera dever: quem recebe precisa informar de onde vem e para onde vai.',
  ],
  lessons: [
    'Defina o contrato de compartilhamento campo a campo, e implemente a integração com uma lista explícita de campos permitidos, recusando o que não estiver nela.',
    'Registre cada compartilhamento com finalidade, base legal e destinatário, de modo que seja possível responder ao titular em minutos.',
    'Publique quem é o encarregado e um canal que responda no prazo, com registro das solicitações recebidas.',
    'Informe na política de privacidade quem envia e quem recebe os dados, com nome dos destinatários, e não apenas categorias genéricas.',
    'Revise contratos antigos: um fluxo iniciado anos atrás continua produzindo tratamento hoje, e é por ele que a fiscalização começa.',
  ],
  exercise: {
    title: 'Simulação: a Aurora Móvel e o bureau Farol',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Aurora Móvel** é uma operadora inventada que assinou contrato com o bureau de crédito fictício **Farol** para "aprimoramento de metodologias de análise de crédito". A integração existe há três anos e envia um arquivo diário. Nomes, números e endereços são inventados.',
      'Um cliente pede, pelo canal de atendimento, a lista de quem recebeu os dados dele. A equipe descobre que ninguém sabe exatamente quais campos o arquivo diário contém.',
    ],
    objective: 'Delimitar o que pode ser compartilhado para a finalidade declarada, descobrir o que a integração realmente envia e organizar a resposta ao titular e ao contrato.',
    criteria: [
      'Você separa os campos necessários à finalidade declarada dos que não têm relação com ela.',
      'Você reconhece as falhas de transparência que impedem responder ao titular.',
      'Você escolhe uma correção que vale para o contrato antigo e para os próximos.',
    ],
    evidence: [
      {
        id: 'arquivo-diario',
        title: 'Campos do arquivo diário enviado ao bureau (fictício)',
        kind: 'table',
        from: 0,
        head: ['Campo', 'Relação com análise de crédito', 'Previsto no contrato?', 'Informado na política de privacidade?'],
        rows: [
          ['CPF e nome', 'identificação do titular da análise', 'sim', 'sim, como "dados cadastrais"'],
          ['Situação de pagamento das faturas', 'histórico de adimplência', 'sim', 'sim, como "dados cadastrais"'],
          ['Valor do plano contratado', 'capacidade de pagamento declarada', 'sim', 'não'],
          ['Modelo do aparelho e sistema', 'nenhuma relação declarada', 'não', 'não'],
          ['Localização aproximada das últimas conexões', 'nenhuma relação declarada', 'não', 'não'],
          ['Lista de números mais chamados', 'nenhuma relação declarada', 'não', 'não'],
        ],
        note: 'Compare a coluna da finalidade com a do contrato: elas não coincidem em três linhas.',
      },
      {
        id: 'pedido-do-titular',
        title: 'O pedido do cliente e o que a empresa consegue responder (fictício)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'O cliente pede: com quem a Aurora Móvel compartilhou os dados dele nos últimos 12 meses, quais dados e para qual finalidade.',
          'O atendimento localiza o contrato com o bureau, mas não existe registro por titular de que dados foram enviados em cada arquivo. Os arquivos diários são apagados após 30 dias.',
          'A política de privacidade menciona "parceiros de análise de crédito", sem nomear o bureau. O canal do encarregado é um formulário no site que não gera protocolo e cuja caixa de entrada é compartilhada com o setor de cobrança.',
        ],
        note: 'Repare no que falta para transformar o pedido em uma resposta verificável.',
      },
    ],
    activities: [
      {
        id: 'campos-permitidos',
        kind: 'assign',
        variant: 'classify',
        title: 'O que pode ser compartilhado',
        prompt: 'Classifique cada grupo de campos do arquivo diário conforme a finalidade declarada no contrato.',
        rows: [
          { text: 'CPF, nome e situação de pagamento das faturas.', why: 'Identificam o titular e descrevem adimplência, que é o núcleo de uma análise de crédito.' },
          { text: 'Valor do plano contratado.', why: 'Tem relação com capacidade de pagamento e está previsto no contrato, mas não aparece na política de privacidade.' },
          { text: 'Modelo do aparelho e sistema instalado.', why: 'Não tem relação declarada com análise de crédito e não está previsto no contrato.' },
          { text: 'Localização das últimas conexões e lista de números mais chamados.', why: 'São dados de uso do serviço, sem relação com a finalidade e fora do contrato; revelam comportamento e relações pessoais.' },
        ],
        choices: ['Compartilhamento compatível com a finalidade', 'Previsto no contrato, mas falta transparência ao titular', 'Excessivo: deve parar de ser enviado'],
        accept: [[0], [1], [2], [2]],
        hints: [
          'Leia a finalidade declarada e pergunte o que ela exige de fato.',
          'Uma linha está no contrato, mas não na política de privacidade.',
          'Duas linhas não têm relação alguma com a finalidade.',
        ],
        explain:
          'A finalidade declarada delimita o compartilhamento. Identificação e adimplência cabem; valor do plano cabe, mas precisa ser informado ao titular; aparelho, localização e chamadas não cabem de jeito nenhum e devem sair da integração.',
      },
      {
        id: 'falhas-de-transparencia',
        kind: 'multi',
        variant: 'inspect',
        title: 'Por que o pedido do titular não pode ser respondido',
        prompt: 'Marque **todos** os problemas que impedem a Aurora Móvel de responder ao pedido do cliente com precisão.',
        options: [
          { text: 'Não existe registro, por titular, de quais dados foram enviados em cada arquivo.', feedback: 'Sim: sem esse registro, a empresa só pode descrever o contrato, não o que de fato saiu sobre aquela pessoa.' },
          { text: 'Os arquivos diários são apagados após 30 dias, o que inviabiliza reconstruir 12 meses.', feedback: 'Sim: a retenção curta do que foi enviado impede reconstruir o histórico pedido pelo titular.' },
          { text: 'A política de privacidade não nomeia o destinatário, falando apenas em "parceiros de análise de crédito".', feedback: 'Sim: categoria genérica não permite ao titular saber quem recebeu os seus dados.' },
          { text: 'O canal do encarregado não gera protocolo e compartilha caixa de entrada com a cobrança.', feedback: 'Sim: sem protocolo não há prazo verificável, e a caixa compartilhada mistura o pedido com a operação comercial.' },
          { text: 'O contrato com o bureau tem três anos de vigência.', feedback: 'Não: a duração do contrato não é, por si, um problema de transparência; o problema é o que ele permite e o que não se registra.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Pergunte o que seria necessário para montar a resposta exata.',
          'Transparência envolve nomear destinatário e manter registro.',
          'Uma das alternativas descreve apenas um fato do contrato.',
        ],
        explain:
          'Responder a um pedido de titular exige registro por pessoa, retenção compatível com o prazo pedido, destinatário nomeado e canal com protocolo. Faltando qualquer um, a resposta vira descrição do contrato, e não informação sobre aquela pessoa.',
      },
      {
        id: 'correcao-do-fluxo',
        kind: 'decide',
        title: 'Como corrigir o fluxo',
        prompt: 'O que a Aurora Móvel deve implementar nas próximas semanas?',
        options: [
          {
            text: 'Reescrever a integração com lista explícita de campos permitidos, recusando qualquer campo fora dela; registrar por titular o que foi enviado, com finalidade e data, mantendo esse registro por prazo compatível com os direitos; nomear o destinatário na política de privacidade; e criar canal de encarregado com protocolo e prazo, revisando também os demais contratos de compartilhamento.',
            quality: 'best',
            flags: ['lista', 'registro', 'transparencia'],
            feedback: 'Corrige a causa (envio de tudo), cria a prova por titular, torna o destinatário conhecido e organiza o canal que sustenta os direitos.',
            consequence: 'O arquivo diário passa a conter só o necessário, o pedido do cliente é respondido com dados verificáveis e os contratos antigos entram em revisão.',
          },
          {
            text: 'Encerrar o contrato com o bureau e apagar os registros da integração, para eliminar o risco de uma vez.',
            quality: 'partial',
            feedback: 'Encerrar interrompe o fluxo, mas apagar os registros destrói justamente o que permitiria responder aos titulares sobre o passado.',
            consequence: 'O envio para, e a empresa continua sem poder responder ao pedido do cliente nem demonstrar o que compartilhou.',
          },
          {
            text: 'Manter a integração como está e acrescentar à política de privacidade uma cláusula autorizando o compartilhamento de dados para finalidades comerciais em geral.',
            quality: 'poor',
            feedback: 'Cláusula genérica não legitima compartilhamento excessivo, e alargar a finalidade na política é o oposto da minimização.',
            consequence: 'A apuração passa a ter também a política como prova de que o excesso era intencional.',
          },
          {
            text: 'Transferir a responsabilidade ao bureau por contrato, exigindo que ele descarte os campos que não usar.',
            quality: 'poor',
            feedback: 'Quem envia responde pelo que envia; delegar o descarte não reduz o compartilhamento nem resolve a transparência.',
            consequence: 'O dado continua saindo da operadora, e a responsabilidade pela remessa excessiva permanece com ela.',
          },
        ],
        hints: [
          'Pergunte onde a decisão sobre cada campo é tomada hoje.',
          'A resposta precisa servir ao titular que pergunta pelo passado.',
          'Uma opção parece radical, mas destrói a evidência.',
        ],
        explain:
          'A correção está na integração (lista de campos permitidos), no registro por titular, no nome do destinatário e no canal de direitos. Encerrar o contrato sem registro, alargar a política ou delegar o descarte não resolvem nenhuma das três acusações do caso.',
      },
    ],
    closing:
      'A Aurora Móvel passou a enviar apenas identificação e adimplência, registrou por titular o que sai, nomeou o bureau na política e criou um canal com protocolo. O ponto central: compartilhamento autorizado por contrato ainda precisa caber na finalidade declarada e ser explicável ao titular.',
    review: {
      solution: [
        'Cabem na finalidade CPF, nome e adimplência; valor do plano está no contrato mas falta informar ao titular; aparelho, localização e chamadas são excessivos e devem sair da integração.',
        'O pedido do titular não pode ser respondido porque faltam registro por pessoa, retenção compatível, destinatário nomeado e canal com protocolo.',
        'A correção combina lista explícita de campos permitidos, registro por titular, transparência com nome do destinatário e canal de encarregado com prazo, além da revisão dos contratos antigos.',
      ],
      residual:
        'Os dados já enviados nos últimos três anos continuam no destinatário, e a reconstrução do histórico anterior ao novo registro permanece impossível. A correção resolve o futuro, não o passado.',
      validation:
        'Gere um arquivo de teste e confirme que campos fora da lista permitida são recusados com erro registrado; abra um pedido pelo canal do encarregado e meça o tempo até a resposta com a lista de destinatários.',
    },
  },
  sources: [
    {
      label: 'ANPD, "ANPD inicia processo para sancionar Claro por irregularidades no compartilhamento de dados pessoais de clientes com a Serasa" (2026-06-08)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/copy_of_anpd-inicia-processo-para-sancionar-claro-por-irregularidades-no-compartilhamento-de-dados-pessoais-de-clientes-com-a-serasa',
      kind: 'primária',
    },
    {
      label: 'TecMundo, "ANPD processa Claro e Serasa por compartilhamento de dados" (2026-06)',
      url: 'https://www.tecmundo.com.br/mercado/413721-anpd-processa-claro-e-serasa-por-compartilhamento-de-dados.htm',
      kind: 'secundária',
    },
    {
      label: 'Olhar Digital, "Uso de dados de clientes leva Claro a processo da ANPD" (2026-06-08)',
      url: 'https://olhardigital.com.br/2026/06/08/pro/uso-de-dados-de-clientes-leva-claro-a-processo-da-anpd/',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API3' },
    { framework: 'owasp-top10', id: 'A01' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de minimização, finalidade, transparência e direitos do titular em compartilhamento entre empresas.',
}
