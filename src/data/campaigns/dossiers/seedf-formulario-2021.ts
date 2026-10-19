import type { DossierContent } from '../types'

/* Dossiê: respostas de formulário on-line expostas na Secretaria de Educação do DF (Brasil, 2021-2022). */

export const seedfFormulario2021: DossierContent = {
  id: 'seedf-formulario-2021',
  title: 'Secretaria de Educação do DF (2021): o link do formulário que mostrava as respostas',
  subtitle: 'Uma letra no endereço de compartilhamento transformou um formulário de lista de espera em um painel público com dados cadastrais e de saúde de 3.030 crianças e adolescentes.',
  incidentDate: '2021-11',
  publishedDate: '2024-01-31 (decisão da ANPD publicada)',
  reviewed: '2026-10-19',
  summary: [
    'As respostas de um formulário on-line de lista de espera do **Programa Educação Precoce**, da Secretaria de Estado de Educação do Distrito Federal (SEEDF), ficaram acessíveis publicamente, "mostrando dados cadastrais e de saúde de **3.030 crianças e adolescentes**", além de dados dos responsáveis. [1]',
    'Os campos incluíam **CPF, nome completo, data de nascimento, diagnóstico, data do encaminhamento médico, responsável, telefones e endereço** — parte deles dados sensíveis, e a maioria dos titulares, menores de idade. [1]',
    'A exposição ocorreu porque o link de compartilhamento foi divulgado com o trecho `viewanalytics` no lugar de `viewform`, o que abria o resumo das respostas em vez do formulário em branco. A secretaria descreveu o caso como **erro humano de configuração da ferramenta**, e não falha da plataforma. [1]',
    'A fiscalização da ANPD notificou a secretaria em **novembro de 2021**. O órgão então restringiu o acesso, baixou e excluiu as respostas e comunicou o incidente à ANPD em **janeiro de 2022**. [1]',
    'A comunicação aos titulares só aconteceu em **21 de julho de 2022**, cerca de oito meses depois do primeiro prazo fixado pela fiscalização. [1]',
    'O relatório de instrução concluiu por violações aos **artigos 37, 38 e 48 da LGPD** e ao art. 5º do Regulamento de Fiscalização, e recomendou **advertência** para cada uma; multa não se aplica a órgão público (art. 52, §3º). [1]',
    'A decisão da ANPD, publicada em **31 de janeiro de 2024**, aplicou **quatro sanções de advertência** à secretaria. [3]',
    'O processo administrativo sancionador correspondente (nº 00261.001192/2022-14) está publicado na página de fiscalização da ANPD. [2]',
  ],
  timeline: [
    { when: '2021-11', what: 'A fiscalização da ANPD notifica a SEEDF sobre as respostas do formulário acessíveis publicamente.', source: 1 },
    { when: '2021-11 (depois da notificação)', what: 'A secretaria restringe o acesso, baixa e exclui as respostas do formulário.', source: 1 },
    { when: '2022-01', what: 'A secretaria comunica o incidente à ANPD.', source: 1 },
    { when: '2022-07-21', what: 'A secretaria comunica os titulares, cerca de oito meses depois do primeiro prazo fixado.', source: 1 },
    { when: '2024-01-31', what: 'A ANPD publica a decisão com quatro sanções de advertência.', source: 3 },
  ],
  component: {
    name: 'Formulário on-line de lista de espera do Programa Educação Precoce (ferramenta de formulários de terceiro)',
    trust:
      'A família que preenche um formulário da secretaria confia que a informação de saúde da criança vai para a fila de atendimento, e não para uma página aberta. Essa confiança depende de uma configuração de compartilhamento que ninguém revisa, feita por quem precisa divulgar o link rápido.',
  },
  impact: [
    'Dados cadastrais e de saúde de 3.030 crianças e adolescentes, e de seus responsáveis, ficaram acessíveis publicamente. [1]',
    'Parte dos dados é sensível (diagnóstico e encaminhamento médico), e a maioria dos titulares são menores de idade. [1]',
    'A comunicação aos titulares atrasou cerca de oito meses em relação ao prazo fixado pela fiscalização. [1]',
    'O órgão recebeu quatro sanções de advertência da autoridade nacional. [3]',
  ],
  uncertainties: [
    'Não consta nas fontes consultadas quantas pessoas de fato acessaram as respostas, nem por quanto tempo exatamente o link ficou disponível. [1]',
    'O relatório descreve o art. 5º do Regulamento de Fiscalização como obstrução à fiscalização (falta de apresentação do plano de gestão de incidentes); a cobertura secundária o descreve como falta de sistemas que atendam a requisitos de segurança. As duas descrições não coincidem. [1][3]',
    'A imputação inicial relativa à segurança dos sistemas foi reclassificada no curso do processo e não foi mantida, de modo que a decisão não firma conclusão sobre controles técnicos. [1]',
    'As fontes consultadas não informam quem divulgou o link com o trecho incorreto nem por qual canal.',
  ],
  analysis: [
    'Não houve invasão: o dado saiu por um recurso previsto da ferramenta, usado sem revisão. É o tipo de falha que nenhum teste de intrusão encontra, porque não existe nada a ser invadido.',
    'Serviço montado em ferramenta de terceiro herda o modelo de compartilhamento dela. Quem publica o link precisa saber o que cada variação do endereço faz.',
    'A sensibilidade do dado deveria ter mudado a escolha da ferramenta: diagnóstico de criança não cabe em formulário genérico de coleta, sem controle de acesso por perfil.',
    'O atraso de oito meses na comunicação pesou mais na sanção do que o próprio erro de configuração: a obrigação de informar é independente da correção técnica.',
    'Quatro advertências a um órgão público mostram o limite da LGPD nesse cenário: sem multa, o efeito prático é a exposição pública da falha e as medidas de governança.',
  ],
  lessons: [
    'Trate o link de compartilhamento como controle de acesso: revise, antes de divulgar, o que ele abre para quem não está autenticado.',
    'Não colete dado sensível em ferramenta genérica de formulário sem perfil de acesso, registro de consulta e responsável definido.',
    'Mantenha o registro das operações de tratamento e a avaliação de impacto antes da coleta, e não depois da notificação da autoridade.',
    'Separe os prazos: corrigir a exposição é urgente, comunicar os titulares também é, e um não substitui o outro.',
    'Ao fechar a exposição, registre data, hora e evidência do fechamento: é o que sustenta a sua versão depois.',
  ],
  exercise: {
    title: 'Simulação: a lista de espera de Vila Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Secretaria de Educação de Vila Aurora** é um órgão inventado. Para abrir a lista de espera de um programa de atendimento especializado, a equipe publicou um formulário em uma ferramenta de coleta on-line e divulgou o link no mural e no grupo de mensagens das escolas. Nomes e números são inventados.',
      'Uma mãe avisa que, ao abrir o link, viu uma tabela com os nomes e os diagnósticos das outras crianças. O formulário recebeu 812 respostas em nove dias.',
    ],
    objective: 'Reconhecer que a exposição veio da configuração de compartilhamento, dimensionar o que precisa ser comunicado e escolher a ordem das providências.',
    criteria: [
      'Você identifica qual elemento do endereço divulgado expôs as respostas.',
      'Você separa o que é correção técnica do que é dever de informar.',
      'Você define uma coleta adequada ao grau de sensibilidade dos dados.',
    ],
    evidence: [
      {
        id: 'enderecos',
        title: 'Endereços envolvidos (fictícios)',
        kind: 'table',
        from: 0,
        head: ['Onde foi divulgado', 'Final do endereço', 'O que abre', 'Precisa de login?'],
        rows: [
          ['Mural das escolas', '/formulario/lista-espera/viewform', 'formulário em branco', 'não'],
          ['Grupo de mensagens', '/formulario/lista-espera/viewanalytics', 'resumo das respostas enviadas', 'não'],
          ['Painel da equipe', '/formulario/lista-espera/edit', 'edição do formulário', 'sim'],
          ['Planilha de respostas', '/planilhas/lista-espera-respostas', 'tabela completa das respostas', 'sim'],
        ],
        note: 'Compare o final de cada endereço com a coluna "o que abre": a diferença entre eles é uma palavra.',
      },
      {
        id: 'campos',
        title: 'Campos coletados no formulário (fictício)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'O formulário pede: nome da criança, data de nascimento, CPF do responsável, telefone, endereço, escola de origem, diagnóstico informado no encaminhamento e data do encaminhamento médico.',
          'A fila é organizada apenas por data de encaminhamento e escola de origem. O diagnóstico é usado somente na triagem presencial, feita depois, por uma equipe de três profissionais.',
          'A ferramenta de coleta não registra quem abriu o resumo de respostas e mantém histórico de acesso por sete dias.',
        ],
        note: 'Pergunte, para cada campo, se ele é necessário no momento da inscrição.',
      },
    ],
    activities: [
      {
        id: 'o-que-expos',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que expôs as respostas',
        prompt: 'Marque **todas** as afirmações corretas sobre a causa e o alcance da exposição.',
        options: [
          { text: 'O endereço divulgado no grupo de mensagens terminava em `viewanalytics`, que abre o resumo das respostas.', feedback: 'Sim: é a causa direta, e nada além de uma palavra no endereço separa o formulário em branco do resumo.' },
          { text: 'O resumo das respostas abria sem exigir login.', feedback: 'Sim: por isso qualquer pessoa com o link, inclusive quem o recebesse encaminhado, via os dados.' },
          { text: 'A ferramenta não registra quem abriu o resumo, o que impede saber o alcance real.', feedback: 'Sim: sem registro, o dimensionamento fica limitado ao número de respostas expostas, e não de acessos.' },
          { text: 'Houve invasão da conta da equipe que criou o formulário.', feedback: 'Não: nada indica acesso indevido à conta; o endereço público bastava para ver as respostas.' },
          { text: 'A planilha de respostas foi tornada pública junto com o formulário.', feedback: 'Não: a planilha exige login, segundo a tabela de endereços.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Compare os quatro endereços da tabela e veja qual foi divulgado onde.',
          'Verifique a coluna que diz se é preciso login.',
          'Duas alternativas descrevem coisas que a evidência não mostra.',
        ],
        explain:
          'A exposição vem de um recurso previsto da ferramenta: o endereço do resumo de respostas, aberto sem login, foi divulgado por engano. Sem registro de acesso, o alcance real não pode ser medido, e isso precisa aparecer na comunicação.',
      },
      {
        id: 'coleta-minima',
        kind: 'assign',
        variant: 'classify',
        title: 'Quais campos pertencem à inscrição',
        prompt: 'Classifique cada campo do formulário conforme o momento em que ele é realmente necessário.',
        rows: [
          { text: 'Nome da criança e data de nascimento.', why: 'Sem identificação não há fila, e a data de nascimento define o público do programa.' },
          { text: 'Telefone do responsável e escola de origem.', why: 'São necessários para convocar a família e localizar o atendimento na rede.' },
          { text: 'Diagnóstico informado no encaminhamento.', why: 'A fila é ordenada por data e escola; o diagnóstico só é usado na triagem presencial posterior.' },
          { text: 'CPF do responsável e endereço completo.', why: 'Servem para a matrícula efetiva, e não para entrar na fila, então podem ser pedidos depois.' },
        ],
        choices: ['Necessário na inscrição', 'Só na triagem ou na matrícula, em canal controlado'],
        accept: [[0], [0], [1], [1]],
        hints: [
          'Pergunte o que a fila usa para ordenar as inscrições.',
          'Dado sensível pedido cedo fica exposto por mais tempo.',
          'Dois campos só são usados em etapas posteriores.',
        ],
        explain:
          'Pedir menos no início reduz o tamanho do incidente quando ele acontece. Diagnóstico e documentos pertencem à etapa de triagem e matrícula, em canal com controle de acesso e registro, não ao formulário aberto de inscrição.',
      },
      {
        id: 'providencias',
        kind: 'decide',
        title: 'As providências da semana',
        prompt: 'Você soube da exposição hoje, às 9h. O que a secretaria faz?',
        options: [
          {
            text: 'Interromper o compartilhamento do resumo e registrar data, hora e evidência do fechamento; reabrir a inscrição apenas com os campos necessários; comunicar os titulares e a autoridade com o período, os campos expostos e a limitação do registro de acesso; e migrar a coleta de dado sensível para canal com perfil de acesso e registro.',
            quality: 'best',
            flags: ['fecha', 'comunica', 'minimiza'],
            feedback: 'Fecha a exposição com prova, reduz o que será coletado daqui para frente e cumpre o dever de informar declarando o que não é possível medir.',
            consequence: 'A exposição termina com evidência documentada, as famílias são avisadas no prazo e a nova inscrição coleta menos dados.',
          },
          {
            text: 'Apagar o formulário e as respostas imediatamente e não comunicar nada, já que o problema deixou de existir.',
            quality: 'poor',
            feedback: 'Apagar sem registrar destrói a evidência do que ocorreu e o dever de comunicar não desaparece com a correção.',
            consequence: 'A secretaria fica sem como demonstrar o que expôs e por quanto tempo, e responde pela falta de comunicação.',
          },
          {
            text: 'Trocar o link divulgado por um novo endereço do mesmo formulário e seguir com a inscrição como está.',
            quality: 'partial',
            feedback: 'Trocar o link interrompe o acesso pelo endereço antigo, mas mantém a coleta de dado sensível em canal aberto e ignora a comunicação.',
            consequence: 'A inscrição continua, o risco se repete na próxima divulgação e os titulares seguem sem saber.',
          },
          {
            text: 'Suspender todo o programa de atendimento até concluir a apuração interna, antes de qualquer comunicação.',
            quality: 'poor',
            feedback: 'Suspender o atendimento pune as famílias por um erro de configuração e não é necessário para corrigir o problema.',
            consequence: 'A fila para, as crianças deixam de ser chamadas e o incidente continua sem comunicação aos titulares.',
          },
        ],
        hints: [
          'Pergunte o que precisa ser preservado antes de apagar.',
          'A correção e a comunicação correm juntas.',
          'Repare se a opção resolve também a próxima inscrição.',
        ],
        explain:
          'A resposta completa tem três frentes: encerrar a exposição com evidência, reduzir a coleta futura e comunicar com o que se sabe, inclusive a impossibilidade de medir os acessos. Apagar tudo sem registro é o erro mais comum e o que mais prejudica a própria defesa.',
      },
    ],
    closing:
      'Vila Aurora fechou o resumo com evidência do fechamento, reabriu a inscrição pedindo menos, moveu o dado sensível para canal controlado e avisou as famílias dizendo o que não podia medir. O ponto central: em ferramenta de terceiro, o endereço de compartilhamento é o controle de acesso.',
    review: {
      solution: [
        'A exposição veio do endereço com `viewanalytics` divulgado por engano, aberto sem login, e o alcance real não pode ser medido porque a ferramenta não registra quem abriu o resumo.',
        'Na inscrição bastam nome, data de nascimento, telefone e escola; diagnóstico, CPF e endereço pertencem à triagem e à matrícula, em canal com controle de acesso.',
        'As providências são encerrar a exposição com registro, reabrir a coleta minimizada, comunicar titulares e autoridade com os limites do que se sabe e migrar o dado sensível.',
      ],
      residual:
        'Resta o que já foi copiado por quem acessou o resumo, que nenhuma correção desfaz, e a impossibilidade de dimensionar os acessos, que depende de uma ferramenta com registro para não se repetir.',
      validation:
        'Antes de divulgar qualquer link novo, abra-o em uma sessão anônima e confirme o que aparece; e verifique, na ferramenta escolhida, se existe registro de quem acessa e por quanto tempo ele é mantido.',
    },
  },
  sources: [
    {
      label: 'ANPD, Relatório de Instrução nº 2/2024/FIS/CGF (processo nº 00261.001192/2022-14, versão pública)',
      url: 'https://www.gov.br/anpd/pt-br/centrais-de-conteudo/relatorio-instrucao-2-2024_sec-educacao-gdf.pdf/@@display-file/file',
      kind: 'primária',
    },
    {
      label: 'ANPD, processo administrativo sancionador nº 00261.001192/2022-14 (versão pública, parte 1)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/fiscalizacao-2/saiba-como_fiscalizamos/arquivos/pas_gdf_processo_publico-processo-00261001192_2022_14-parte-1.pdf',
      kind: 'primária',
    },
    {
      label: 'LegisMap, "ANPD sanciona INSS e Secretaria de Educação do DF por violações à LGPD" (2024-02-01)',
      url: 'https://legismap.com.br/conteudos/artigos-e-noticias/anpd-sanciona-inss-e-secretaria-de-educacao-do-df-por-violacoes-a-lgpd',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A01' },
    { framework: 'owasp-top10', id: 'A02' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de configuração de compartilhamento, minimização de dados e comunicação de incidente.',
}
