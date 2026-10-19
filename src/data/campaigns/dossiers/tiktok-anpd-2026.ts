import type { DossierContent } from '../types'

/* Dossiê: sanção da ANPD à ByteDance/TikTok por dados de crianças e adolescentes (Brasil, 2026). */

export const tiktokAnpd2026: DossierContent = {
  id: 'tiktok-anpd-2026',
  title: 'TikTok (Brasil, 2026): a maior multa da ANPD e o feed sem cadastro',
  subtitle: 'A autoridade brasileira multou a controladora do TikTok em R$ 153,7 milhões por cinco violações ligadas ao tratamento de dados de crianças e adolescentes, inclusive no feed que funcionava sem conta.',
  incidentDate: '2024 (apuração a partir da Nota Técnica nº 50/2024/CGF/ANPD)',
  publishedDate: '2026-08-25 (sanção publicada no Diário Oficial da União)',
  reviewed: '2026-10-19',
  summary: [
    'Em **25 de agosto de 2026**, a ANPD publicou no Diário Oficial a sanção que multa a **ByteDance**, controladora do TikTok, em **R$ 153,7 milhões** por falhas na proteção de dados de crianças e adolescentes. [1]',
    'A sanção reúne **cinco violações** aos artigos **6º (incisos VIII e X) e 7º** da LGPD. [1]',
    'Duas violações se referem ao **feed sem cadastro**: tratar dados de crianças e adolescentes sem hipótese legal válida ao permitir o acesso ao feed sem conta, e deixar de adotar medidas para prevenir esse tratamento. [1]',
    'Outras duas se referem ao **feed com cadastro**: tratar dados desse público para realizar o cadastro sem hipótese legal válida, e deixar de adotar medidas eficazes para prevenir o cadastro desse público. [1]',
    'A quinta violação, aplicável às duas experiências, é **deixar de demonstrar medidas eficazes** e capazes de comprovar a observância e o cumprimento das normas de proteção de dados. [1]',
    'Além da multa, a decisão determina a **exclusão dos dados coletados irregularmente** e a execução de um **plano de conformidade**, que inclui aplicar automaticamente as configurações de privacidade mais restritivas às contas de usuários com menos de 16 anos, alteráveis somente com autorização dos responsáveis, e reforçar a supervisão parental e os filtros de conteúdo. [1]',
    'Para o feed sem cadastro, o plano prevê suspender anúncios no Brasil, limitar a experiência a conteúdo adequado à idade, limitar essa experiência a 12 horas, desativar transmissões ao vivo e mensagens diretas e reduzir a coleta de dados. A verificação de idade segue o cronograma do ECA Digital. [1]',
    'O caso tramitou como Despacho Decisório nº 27/2026/CGS/SFI, com decisão de recurso e voto do Conselho Diretor, e cabia recurso em **dez dias úteis** a partir da notificação, ocorrida em 24 de agosto de 2026. [1][2][3]',
  ],
  timeline: [
    { when: '2024', what: 'A fiscalização da ANPD formaliza a apuração na Nota Técnica nº 50/2024/CGF/ANPD.', source: 1 },
    { when: '2026-08-24', what: 'A empresa é notificada da decisão sancionadora.', source: 1 },
    { when: '2026-08-25', what: 'A sanção de R$ 153,7 milhões é publicada no Diário Oficial da União, com as cinco violações e as medidas corretivas.', source: 1 },
    { when: '2026-08', what: 'Veículos de imprensa noticiam a multa e o conteúdo do plano de conformidade.', source: 2 },
    { when: '2026-09', what: 'A página oficial da ANPD registra atualização sobre a decisão de recurso e o plano aprovado.', source: 1 },
  ],
  component: {
    name: 'Experiências de uso do TikTok no Brasil: feed sem cadastro e feed com cadastro',
    trust:
      'A família confia que uma plataforma com público adolescente vai impedir o uso por quem não tem idade e aplicar, por padrão, as proteções mais fortes a quem é menor. Essa confiança recai sobre decisões de produto, e não sobre o cuidado de cada criança.',
  },
  impact: [
    'Multa de R$ 153,7 milhões, a maior aplicada pela ANPD até a data desta revisão. [1][2]',
    'Determinação de exclusão dos dados coletados irregularmente. [1]',
    'Mudanças obrigatórias de produto: padrão mais restritivo para contas de menores de 16 anos, supervisão parental reforçada e filtros de conteúdo. [1]',
    'Restrições específicas ao feed sem cadastro: sem anúncios no Brasil, sem transmissões ao vivo, sem mensagens diretas, limite de 12 horas e coleta reduzida. [1]',
  ],
  uncertainties: [
    'A página consultada não informa o número do processo administrativo nem o cálculo detalhado da multa, que está em relatório anexo. [1]',
    'Não constam prazos específicos para a exclusão dos dados nem para cada item do plano de conformidade, além da remissão ao cronograma do ECA Digital. [1]',
    'Não há, na fonte consultada, estimativa de quantas crianças e adolescentes foram alcançados pelo tratamento considerado irregular. [1]',
    'Esta revisão não verificou o andamento posterior do recurso nem a execução efetiva das medidas. [1]',
  ],
  analysis: [
    'As cinco violações não descrevem um defeito técnico, e sim escolhas de produto: deixar o conteúdo acessível sem conta, aceitar cadastros sem barreira eficaz e não guardar prova de que as medidas funcionavam.',
    'A quinta violação é a que mais se aplica a qualquer equipe: não basta ter controles, é preciso poder demonstrar que eles funcionam. Sem evidência, a empresa não tem defesa.',
    'O feed sem cadastro é um caso clássico de fronteira esquecida: o fluxo "sem login" costuma ficar fora da análise de privacidade justamente porque não tem usuário identificado, embora colete dados.',
    'A medida de aplicar o padrão mais restritivo a menores de 16 anos e exigir autorização para afrouxá-lo é privacidade por padrão escrita como requisito de produto, com estado inicial seguro.',
    'Sanção com plano de conformidade muda o trabalho de engenharia: o resultado não é um documento, são configurações padrão, limites e registros auditáveis.',
  ],
  lessons: [
    'Inclua o fluxo sem autenticação no modelo de ameaças e no inventário de tratamento: ausência de conta não significa ausência de dados pessoais.',
    'Faça do estado inicial o mais restritivo quando a idade declarada for abaixo do limite, e exija passo deliberado e autorizado para relaxar.',
    'Guarde evidência de eficácia dos controles de idade: taxa de bloqueio, revisões e registro de mudanças, porque é isso que a autoridade pede.',
    'Separe as medidas por experiência de uso: o que vale para o aplicativo com conta não cobre automaticamente o acesso sem conta.',
    'Trate exclusão de dados como função de produto, com rastreabilidade do que foi apagado, e não como tarefa manual de banco de dados.',
  ],
  exercise: {
    title: 'Simulação: o aplicativo Girassol e o acesso sem conta',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. O **Girassol** é um aplicativo inventado de vídeos curtos, com público declarado a partir de 13 anos. Além do aplicativo com conta, existe um modo de visita, sem cadastro, que mostra uma seleção de vídeos. Nomes, números e endereços são inventados.',
      'O jurídico avisa que a autoridade pediu, em 15 dias, a demonstração das medidas que impedem o uso por quem tem menos de 13 anos e a descrição do que é coletado no modo de visita.',
    ],
    objective: 'Mapear o tratamento de dados no fluxo sem conta, escolher um conjunto de medidas eficaz para o público protegido e organizar a demonstração de eficácia pedida pela autoridade.',
    criteria: [
      'Você identifica o que o modo de visita coleta e por que ele entra na análise.',
      'Você escolhe medidas que mudam o estado inicial, e não apenas avisos.',
      'Você define que evidência demonstra eficácia, e não boa intenção.',
    ],
    evidence: [
      {
        id: 'coleta-por-fluxo',
        title: 'O que cada fluxo coleta hoje (fictício)',
        kind: 'table',
        from: 0,
        head: ['Fluxo', 'Pede idade?', 'Identificador do aparelho', 'Histórico de vídeos vistos', 'Anúncios personalizados'],
        rows: [
          ['Conta nova (com cadastro)', 'sim, campo livre', 'sim', 'sim', 'sim'],
          ['Modo de visita (sem cadastro)', 'não', 'sim', 'sim, por identificador do aparelho', 'sim'],
          ['Conta de responsável vinculada', 'sim, verificada', 'sim', 'sim', 'não'],
          ['Site aberto no navegador', 'não', 'sim, por rastreador', 'sim', 'sim'],
        ],
        note: 'Olhe as linhas sem verificação de idade e veja o que elas coletam mesmo assim.',
      },
      {
        id: 'indicadores',
        title: 'Indicadores dos últimos 90 dias (fictícios)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'No cadastro, 2,4% das contas novas declaram idade abaixo de 13 anos e são recusadas. Entre as recusadas, 71% criam outra conta no mesmo aparelho em menos de 10 minutos, declarando idade maior.',
          'O modo de visita responde por 18% das sessões e não tem nenhuma verificação. O tempo médio de sessão nesse modo é de 46 minutos.',
          'Não existe registro consolidado de quantas contas foram bloqueadas por suspeita de idade, nem de revisão posterior dessas decisões. O time de produto mantém as decisões em planilhas separadas por trimestre.',
        ],
        note: 'Repare no que acontece depois da recusa e no que não é registrado.',
      },
    ],
    activities: [
      {
        id: 'mapear-o-fluxo-sem-conta',
        kind: 'multi',
        variant: 'inspect',
        title: 'Por que o modo de visita entra na análise',
        prompt: 'Marque **todas** as afirmações corretas sobre o modo de visita, com base nas evidências.',
        options: [
          { text: 'Ele coleta identificador do aparelho e histórico de vídeos, mesmo sem conta.', feedback: 'Sim: há tratamento de dados pessoais, porque o identificador do aparelho permite acompanhar a mesma pessoa ao longo do tempo.' },
          { text: 'Ele exibe anúncios personalizados sem nenhuma verificação de idade.', feedback: 'Sim: personalizar anúncio para público possivelmente infantil é exatamente o ponto atacado na decisão real.' },
          { text: 'Ele responde por uma parcela significativa das sessões, com tempo médio alto.', feedback: 'Sim: 18% das sessões e 46 minutos de média mostram que não é um caminho marginal do produto.' },
          { text: 'Como não há cadastro, não há dados pessoais tratados nesse fluxo.', feedback: 'Não: identificador de aparelho e histórico de uso são dados pessoais, ainda que o nome não seja coletado.' },
          { text: 'A recusa de 2,4% no cadastro demonstra que o controle de idade é eficaz.', feedback: 'Não: 71% das recusadas voltam em minutos pelo mesmo aparelho, o que mostra o oposto.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Procure, na tabela, o que é coletado mesmo sem idade declarada.',
          'Pergunte se é possível reconhecer a mesma pessoa em duas sessões.',
          'Um dos números diz o que acontece depois da recusa.',
        ],
        explain:
          'Sem conta, o produto continua identificando o aparelho, guardando histórico e personalizando anúncio. É tratamento de dados pessoais, e a falta de verificação torna o público protegido invisível para o controle.',
      },
      {
        id: 'medidas-eficazes',
        kind: 'decide',
        title: 'Quais medidas adotar',
        prompt: 'Com 15 dias para responder, qual conjunto de medidas o Girassol deve implementar e apresentar?',
        options: [
          {
            text: 'Aplicar por padrão o perfil mais restritivo a quem declara menos de 16 anos, alterável só com autorização verificada do responsável; desligar anúncio personalizado e mensagens diretas no modo de visita, reduzindo a coleta ao necessário; impedir nova tentativa imediata de cadastro no mesmo aparelho depois de recusa por idade; e registrar centralmente bloqueios, contestações e revisões, com relatório mensal.',
            quality: 'best',
            flags: ['padrao', 'visita', 'evidencia'],
            feedback: 'Muda o estado inicial, fecha o fluxo sem conta, trata o contorno pelo mesmo aparelho e cria a evidência que a autoridade vai pedir.',
            consequence: 'A resposta à autoridade mostra configuração padrão, coleta reduzida e números de eficácia; a repetição de cadastro no mesmo aparelho cai.',
          },
          {
            text: 'Publicar na política de privacidade que o aplicativo não é destinado a menores de 13 anos e exibir um aviso na primeira abertura.',
            quality: 'poor',
            feedback: 'Aviso e política não impedem o uso nem produzem evidência de eficácia; é a medida que a decisão real considerou insuficiente.',
            consequence: 'O uso continua igual, e a autoridade recebe uma resposta sem nenhum indicador de eficácia.',
          },
          {
            text: 'Remover o modo de visita do aplicativo e exigir cadastro para qualquer acesso, mantendo o campo de idade livre.',
            quality: 'partial',
            feedback: 'Fecha o fluxo sem conta, mas mantém o cadastro sem barreira eficaz e não resolve a nova tentativa imediata no mesmo aparelho.',
            consequence: 'As sessões migram para contas novas declarando idade maior, e o problema reaparece no cadastro.',
          },
          {
            text: 'Pedir documento de identidade de todos os usuários, inclusive adultos, antes de qualquer uso do aplicativo.',
            quality: 'poor',
            feedback: 'Coleta documento de todo mundo para resolver um problema de parte do público, aumentando o dado sensível guardado e o risco em caso de incidente.',
            consequence: 'O produto passa a guardar documentos de milhões de pessoas e cria um alvo novo, sem garantia de precisão na idade.',
          },
        ],
        hints: [
          'Pergunte o que acontece por padrão, sem o usuário fazer nada.',
          'O fluxo sem conta precisa de medida própria.',
          'Separe o que impede o uso do que prova que a medida funciona.',
        ],
        explain:
          'A combinação eficaz tem quatro partes: padrão restritivo para menores, restrição do fluxo sem conta, tratamento do contorno pelo mesmo aparelho e registro central que produz evidência. Nenhuma delas é aviso em política.',
      },
      {
        id: 'evidencia-de-eficacia',
        kind: 'assign',
        variant: 'classify',
        title: 'O que demonstra eficácia',
        prompt: 'Classifique cada item conforme sirva como demonstração de eficácia das medidas ou apenas como declaração de intenção.',
        rows: [
          { text: 'Relatório mensal com taxa de recusa por idade, tentativas repetidas no mesmo aparelho e resultado das revisões.', why: 'Mostra o efeito da medida ao longo do tempo e permite comparar antes e depois.' },
          { text: 'Registro de configuração mostrando que contas de menores de 16 anos nascem no perfil restritivo.', why: 'É prova do estado inicial aplicado automaticamente, e não de uma orientação interna.' },
          { text: 'Trecho da política de privacidade informando a idade mínima do serviço.', why: 'Informa a regra, mas não demonstra nenhum efeito prático sobre o uso real.' },
          { text: 'Ata de reunião em que o time de produto decidiu priorizar o tema no próximo trimestre.', why: 'Registra intenção e prioridade, sem qualquer medida implantada ou resultado medido.' },
        ],
        choices: ['Demonstra eficácia', 'Apenas declaração de intenção'],
        accept: [[0], [0], [1], [1]],
        hints: [
          'Pergunte se o item mostra efeito ou apenas promessa.',
          'Configuração aplicada vale mais que norma escrita.',
          'Dois itens não dizem nada sobre o uso real.',
        ],
        explain:
          'Eficácia se demonstra com estado aplicado e número medido: configuração padrão verificável e indicadores comparáveis no tempo. Política e ata explicam a intenção, mas não substituem a prova.',
      },
    ],
    closing:
      'O Girassol passou a nascer restritivo para menores de 16 anos, cortou anúncio personalizado e mensagens no modo de visita, bloqueou a nova tentativa imediata no mesmo aparelho e passou a produzir relatório mensal. O ponto central: no fluxo sem conta também há dados pessoais, e sem evidência de eficácia não há defesa.',
    review: {
      solution: [
        'O modo de visita trata dados pessoais (identificador do aparelho e histórico), exibe anúncio personalizado e responde por parcela relevante do uso, o que o coloca no centro da análise.',
        'As medidas eficazes combinam padrão restritivo para menores de 16 anos, restrição do fluxo sem conta, bloqueio da nova tentativa imediata no mesmo aparelho e registro central com relatório mensal.',
        'Demonstram eficácia o relatório com indicadores e o registro de configuração; política e ata de reunião são apenas declaração de intenção.',
      ],
      residual:
        'Nenhuma medida elimina a declaração falsa de idade, e o bloqueio por aparelho pode ser contornado em outro dispositivo. O risco cai, mas continua exigindo medição contínua.',
      validation:
        'Crie contas de teste declarando 12, 15 e 17 anos e confirme o perfil inicial aplicado em cada caso; tente repetir o cadastro no mesmo aparelho após recusa; e verifique no modo de visita quais dados saem do aplicativo.',
    },
  },
  sources: [
    {
      label: 'ANPD, "ANPD multa TikTok em R$ 153,7 milhões por falhas na proteção de dados de crianças e adolescentes" (2026-08-25)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-multa-tiktok-em-r-153-7-milhoes-por-falhas-na-protecao-de-dados-de-criancas-e-adolescentes',
      kind: 'primária',
    },
    {
      label: 'Startups, "TikTok é multado em R$ 153,7 milhões por falha na proteção de dados de menores" (2026-08)',
      url: 'https://startups.com.br/negocios/internet/tiktok-e-multado-em-r-1537m-por-falha-na-protecao-de-dados-de-menores/',
      kind: 'secundária',
    },
    {
      label: 'Baguete, "TikTok é multado em R$ 153,7 mi pela ANPD" (2026-08)',
      url: 'https://www.baguete.com.br/noticias/tik-tok-e-multado-em-r-1537-mi-pela-anpd',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-mobile-top10', id: 'M6' },
    { framework: 'masvs', id: 'MASVS-PRIVACY' },
  ],
  country: 'Brasil',
  tags: ['mobile', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de base legal, privacidade por padrão e demonstração de eficácia de controles.',
}
