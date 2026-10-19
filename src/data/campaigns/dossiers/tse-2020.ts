import type { DossierContent } from '../types'

/* Dossiê: tentativas de ataque ao TSE nas Eleições Municipais de 2020 (Brasil). Fatos com fonte numerada. */

export const tse2020: DossierContent = {
  id: 'tse-2020',
  title: 'TSE (Brasil, 2020): o ataque de volume e o vazamento antigo apresentado como novo',
  subtitle: 'No dia da votação, o sistema de totalização recebeu centenas de milhares de conexões por segundo, e um conjunto de dados antigos de servidores foi divulgado como se fosse prova de invasão.',
  incidentDate: '2020-11-15',
  publishedDate: '2020-11-15 (declarações no mesmo dia); matéria do TSE em 2020-11-16',
  reviewed: '2026-10-19',
  summary: [
    'Em **15 de novembro de 2020**, dia do primeiro turno das Eleições Municipais, o TSE registrou um ataque ao sistema de totalização. A equipe de tecnologia do tribunal identificou **486 mil conexões por segundo** dirigidas a derrubar o sistema. [1]',
    'O tráfego vinha dos **Estados Unidos, da Nova Zelândia e do próprio Brasil**, e o ataque, segundo o presidente do tribunal, "não obteve nenhum êxito" e não interferiu nos resultados produzidos pelas urnas. [1]',
    'O único impacto confirmado foi o **atraso de pouco mais de duas horas** na divulgação dos resultados, atribuído à lentidão de um supercomputador no processamento dos dados e a uma falha em um dos núcleos do equipamento. [1]',
    'No mesmo dia, dados administrativos de servidores e de ex-ministros do tribunal foram divulgados. O presidente do TSE afirmou que se referiam aos **anos de 2001 a 2010** e que a divulgação buscava criar a impressão de fragilidade do sistema. [1]',
    'Segundo a Agência Brasil, o presidente do TSE disse que o vazamento "não é produto de um ataque atual", e o ministro da Justiça afirmou que o acesso aos dados ocorreu antes de **23 de outubro de 2020** e que não havia indicação de prejuízo à lisura do processo eleitoral. [3]',
    'A Polícia Federal foi acionada para investigar a origem do vazamento, e não foi identificado vínculo com o ataque ao STJ ocorrido duas semanas antes. [1][3]',
    'Em **junho de 2021**, o TSE publicou um esclarecimento no formato "Fato ou Boato" afirmando que os ataques não afetaram a segurança das Eleições Municipais de 2020. [2]',
  ],
  timeline: [
    { when: '2020-10-23 (antes de)', what: 'O acesso aos dados administrativos que seriam divulgados depois ocorreu antes desta data, segundo o ministro da Justiça.', source: 3 },
    { when: '2020-11-15', what: 'Dia da votação: o sistema de totalização recebe 486 mil conexões por segundo, sem êxito do ataque; a divulgação dos resultados atrasa pouco mais de duas horas.', source: 1 },
    { when: '2020-11-15', what: 'Dados administrativos de servidores e ex-ministros, referentes a 2001-2010, são divulgados; a Polícia Federal é acionada.', source: 1 },
    { when: '2020-11-15', what: 'O ministro da Justiça afirma que o vazamento não afetou a lisura do processo eleitoral e que a PF busca o autor do acesso.', source: 3 },
    { when: '2021-06', what: 'O TSE publica esclarecimento afirmando que os ataques não afetaram a segurança das eleições municipais.', source: 2 },
  ],
  component: {
    name: 'Sistema de totalização de votos e a base administrativa de pessoal do TSE',
    trust:
      'O eleitor confia que o resultado divulgado corresponde ao que as urnas registraram e que uma instabilidade na divulgação não significa alteração de voto. Essa confiança depende tanto de o sistema resistir ao volume quanto de a instituição conseguir explicar, com evidência, o que aconteceu.',
  },
  impact: [
    'Atraso de pouco mais de duas horas na divulgação dos resultados, atribuído ao processamento, e não ao ataque. [1]',
    'Divulgação de dados administrativos de servidores e ex-ministros referentes a 2001-2010. [1]',
    'Nenhuma alteração nos resultados produzidos pelas urnas, segundo o tribunal. [1][2]',
  ],
  uncertainties: [
    'O número de pessoas cujos dados administrativos foram divulgados não consta nas fontes consultadas. [1][3]',
    'A idade exata do acesso que originou o vazamento não foi determinada na época: o presidente do tribunal falou em algo entre dez dias e cinco anos antes. [3]',
    'As fontes consultadas não detalham o caminho técnico do acesso original aos dados administrativos.',
    'O esclarecimento do TSE de junho de 2021 não pôde ser lido na íntegra nesta revisão; o título e a data sustentam a afirmação citada. [2]',
  ],
  analysis: [
    'São dois eventos distintos no mesmo dia, e tratá-los como um só é o erro que o atacante procura: um ataque de volume contra a divulgação e a publicação de dados obtidos antes, em outro lugar.',
    'Volume não é invasão. Um ataque de negação de serviço disputa capacidade; ele não altera registro, não lê dado e não muda resultado. Confundir indisponibilidade com adulteração é o que produz pânico infundado.',
    'A coincidência de datas é barata para quem ataca e caríssima para quem defende: basta publicar dados velhos no dia certo para que a sequência pareça causal.',
    'Quando a instituição consegue datar o acesso ("antes de 23 de outubro") e delimitar o conteúdo ("2001 a 2010"), ela recupera o controle da narrativa com evidência, e não com adjetivos.',
  ],
  lessons: [
    'Separe, na comunicação e na investigação, disponibilidade de integridade: diga o que ficou lento, o que ficou fora e o que permaneceu inalterado.',
    'Dimensione capacidade e proteção contra volume antes do dia crítico, com teste de carga no caminho inteiro, e não só na borda.',
    'Mantenha registros que permitam datar um acesso antigo: sem eles, não há como responder "esse dado é de quando?".',
    'Trate base administrativa com o mesmo cuidado da base principal: ela é o alvo mais fácil e serve de prova falsa sobre o resto.',
    'Prepare antes o material de esclarecimento, com números e limites, para publicar em horas, não em semanas.',
  ],
  exercise: {
    title: 'Simulação: a noite da apuração em Vila Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. O **Instituto de Apuração de Vila Aurora** é um órgão inventado que divulga resultados de uma consulta pública. Todos os números, horários e endereços são inventados; os endereços usam o domínio reservado `.example`.',
      'Às 18h05 o painel público fica lento. Às 18h40, uma conta em rede social publica um arquivo com nomes e matrículas de servidores do instituto e afirma que "a apuração foi invadida". A imprensa liga às 18h50.',
    ],
    objective: 'Distinguir, com base nas evidências, um ataque de volume de uma alteração de dados, e classificar cada afirmação que circula como sustentada, não sustentada ou ainda indeterminada.',
    criteria: [
      'Você identifica nas evidências o que caracteriza ataque de volume.',
      'Você classifica corretamente as afirmações que circulam, sem afirmar mais do que a evidência permite.',
      'Você escolhe uma resposta que protege a divulgação e esclarece o público no mesmo movimento.',
    ],
    evidence: [
      {
        id: 'metricas',
        title: 'Métricas do painel público (fictícias)',
        kind: 'table',
        from: 0,
        head: ['Horário', 'Conexões por segundo', 'Erros 5xx', 'Registros de resultado alterados', 'Origem principal do tráfego'],
        rows: [
          ['17:50', '4.100', '0', '0', 'Brasil'],
          ['18:05', '390.000', '18%', '0', '203.0.113.0/24 e 198.51.100.0/24'],
          ['18:20', '412.000', '31%', '0', '203.0.113.0/24 e 198.51.100.0/24'],
          ['18:55', '9.800', '0', '0', 'Brasil'],
        ],
        note: 'Compare a coluna de conexões com a de registros alterados: elas respondem a perguntas diferentes.',
      },
      {
        id: 'arquivo-divulgado',
        title: 'Metadados do arquivo divulgado na rede social (fictícios)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'O arquivo tem 1.248 linhas, com nome, matrícula e lotação de servidores. A matrícula mais recente foi emitida em 2014, e 97% dos registros têm data de atualização entre 2009 e 2013.',
          'Dez pessoas na lista deixaram o instituto antes de 2015. Nenhum campo corresponde ao sistema de apuração atual, que passou a usar outro formato de identificação em 2016.',
          'O registro de acesso do sistema administrativo antigo foi arquivado em mídia e cobre apenas os últimos 18 meses; os registros anteriores não estão disponíveis.',
        ],
        note: 'Pergunte de qual sistema esses campos vêm e de que época.',
      },
    ],
    activities: [
      {
        id: 'volume-ou-invasao',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que as métricas sustentam',
        prompt: 'Marque **todas** as conclusões que as métricas do painel sustentam, sem acrescentar suposições.',
        options: [
          { text: 'Houve um aumento de quase cem vezes nas conexões por segundo entre 17h50 e 18h05.', feedback: 'Sim: é leitura direta da tabela e caracteriza um ataque de volume contra a divulgação.' },
          { text: 'Uma parte das requisições passou a falhar durante o pico, com 18% e 31% de erros.', feedback: 'Sim: a indisponibilidade parcial é exatamente o efeito que esse tipo de ataque busca produzir.' },
          { text: 'Nenhum registro de resultado foi alterado no período medido.', feedback: 'Sim: a coluna correspondente permanece em zero nos quatro horários, o que separa lentidão de adulteração.' },
          { text: 'O atacante obteve acesso ao banco de dados da apuração.', feedback: 'Não: nada nas métricas indica leitura ou escrita no banco; volume de conexões não é evidência de acesso.' },
          { text: 'O tráfego de pico veio majoritariamente de dentro do país.', feedback: 'Não: as faixas de origem no pico são outras, e a origem do tráfego pode ser falsificada ou intermediada.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Leia cada conclusão e procure a coluna que a sustentaria.',
          'Duas afirmações vão além do que a tabela mede.',
          'A coluna de registros alterados é a que separa indisponibilidade de adulteração.',
        ],
        explain:
          'As métricas sustentam três coisas: houve pico, houve falha parcial e não houve alteração de registro. Afirmar acesso ao banco ou origem do tráfego exige outra evidência, que aqui não existe.',
      },
      {
        id: 'classificar-afirmacoes',
        kind: 'assign',
        variant: 'classify',
        title: 'As afirmações que circulam',
        prompt: 'Classifique cada afirmação que circula na imprensa e nas redes conforme o que as evidências permitem dizer agora.',
        rows: [
          { text: '"O resultado divulgado foi alterado durante o ataque."', why: 'A coluna de registros alterados está em zero nos quatro horários medidos, o que contraria a afirmação.' },
          { text: '"O painel público ficou instável por um pico de requisições."', why: 'As métricas mostram o pico e os erros 5xx no mesmo intervalo, o que sustenta a afirmação.' },
          { text: '"Os dados divulgados vêm do sistema de apuração atual."', why: 'Os campos não correspondem ao formato usado desde 2016, o que contraria a afirmação.' },
          { text: '"O arquivo divulgado veio de um acesso ocorrido nesta noite."', why: 'Os registros do sistema antigo cobrem apenas 18 meses, então não há como afirmar nem negar a data do acesso.' },
        ],
        choices: ['Sustentada pelas evidências', 'Contrariada pelas evidências', 'Indeterminada: falta evidência'],
        accept: [[1], [0], [1], [2]],
        hints: [
          'Para cada linha, pergunte qual evidência você citaria.',
          'Duas afirmações são contrariadas por uma coluna ou por um campo específico.',
          'Uma delas não pode ser resolvida porque os registros antigos não existem mais.',
        ],
        explain:
          'Classificar antes de responder evita dois erros opostos: negar o que não se pode negar e confirmar o que não se pode confirmar. A afirmação sobre a data do acesso fica indeterminada porque a retenção de registros não alcança o período.',
      },
      {
        id: 'resposta-da-noite',
        kind: 'decide',
        title: 'A resposta da noite',
        prompt: 'São 19h00. O painel voltou ao normal, a imprensa espera e o arquivo continua circulando. Qual resposta o instituto deve dar?',
        options: [
          {
            text: 'Publicar uma nota que separa os dois fatos: o pico de requisições com a janela exata de instabilidade e a ausência de alteração em registros de resultado; e, sobre o arquivo, dizer o que já se sabe (campos de um sistema administrativo antigo, dados até 2014), o que está sob investigação e que a retenção de registros não permite datar o acesso.',
            quality: 'best',
            flags: ['separa', 'transparente', 'limites'],
            feedback: 'Separa indisponibilidade de adulteração, apresenta números verificáveis e declara o limite da investigação em vez de fingir certeza.',
            consequence: 'A cobertura passa a tratar os dois fatos separadamente e a nota resiste à checagem posterior, porque não afirmou nada que a evidência não sustentava.',
          },
          {
            text: 'Afirmar que não houve nenhum ataque e que a lentidão foi apenas excesso de interesse do público.',
            quality: 'poor',
            feedback: 'É falso diante das próprias métricas, e uma negativa que a evidência derruba destrói a credibilidade do resto da comunicação.',
            consequence: 'Quando as métricas aparecem, a instituição perde a credibilidade e passa a ser questionada também sobre o que estava correto.',
          },
          {
            text: 'Confirmar que houve uma invasão e que o arquivo divulgado prova o acesso aos sistemas desta noite.',
            quality: 'poor',
            feedback: 'Afirma mais do que a evidência sustenta, e os campos do arquivo apontam para um sistema antigo, não para o de apuração.',
            consequence: 'A instituição valida a versão do atacante e cria uma crise de confiança sobre um resultado que não foi alterado.',
          },
          {
            text: 'Divulgar apenas que o painel está normalizado e tratar o arquivo em outro momento, depois da investigação.',
            quality: 'partial',
            feedback: 'Normalizar o painel é verdade, mas o silêncio sobre o arquivo deixa a interpretação por conta de quem o publicou.',
            consequence: 'O vácuo é preenchido pela versão do atacante e a instituição responde depois, em desvantagem.',
          },
        ],
        hints: [
          'Pergunte quais perguntas o público tem hoje e quais você pode responder com número.',
          'Uma boa nota diz também o que não se sabe, e por quê.',
          'Separar os dois fatos é mais importante do que parecer seguro.',
        ],
        explain:
          'A melhor resposta usa a evidência disponível para separar os eventos e declara o limite do que se pode afirmar. Isso reduz o espaço para a interpretação do atacante sem comprometer a instituição com uma certeza que ela não tem.',
      },
    ],
    closing:
      'O Instituto de Vila Aurora mostrou o pico e os erros, mostrou que nenhum registro de resultado mudou e disse o que ainda não sabia sobre o arquivo antigo. O ponto central: indisponibilidade e adulteração são falhas diferentes, e misturá-las é o que transforma um incidente em crise de confiança.',
    review: {
      solution: [
        'As métricas sustentam o pico de requisições, a falha parcial e a ausência de alteração em registros de resultado; não sustentam acesso ao banco nem conclusão sobre a origem real do tráfego.',
        'Entre as afirmações que circulam, uma é sustentada (a instabilidade por pico), duas são contrariadas (alteração de resultado e origem no sistema atual) e uma é indeterminada (a data do acesso), porque a retenção de registros não alcança o período.',
        'A resposta adequada separa os dois fatos, apresenta números verificáveis e declara o limite da investigação.',
      ],
      residual:
        'Mesmo com a nota correta, resta o dano de reputação já causado pela circulação do arquivo e a impossibilidade de datar o acesso antigo, que só se resolve com retenção de registros feita antes do incidente.',
      validation:
        'Faça um teste de carga no caminho completo da divulgação, meça em que volume os erros começam e verifique quanto tempo leva para produzir, a partir dos registros, uma resposta datada sobre um acesso de dois anos atrás.',
    },
  },
  sources: [
    {
      label: 'TSE, "Tentativas de ataques de hackers ao sistema do TSE não afetaram resultados das Eleições, afirma Barroso" (2020-11-16)',
      url: 'https://www.tse.jus.br/comunicacao/noticias/2020/Novembro/tentativas-de-ataques-de-hackers-ao-sistema-do-tse-nao-afetaram-resultados-das-eleicoes-afirma-barroso',
      kind: 'primária',
    },
    {
      label: 'TSE, "Fato ou Boato: ataques hackers não afetaram a segurança das Eleições Municipais de 2020" (2021-06)',
      url: 'https://www.tse.jus.br/comunicacao/noticias/2021/Junho/fato-ou-boato-ataques-hackers-nao-afetaram-a-seguranca-das-eleicoes-municipais-de-2020',
      kind: 'primária',
    },
    {
      label: 'Agência Brasil, "Polícia Federal apura vazamento de dados de servidores do TSE" (2020-11-15)',
      url: 'https://agenciabrasil.ebc.com.br/eleicoes-2020/noticia/2020-11/policia-federal-apura-vazamento-de-dados-de-servidores-do-tse',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API4' },
    { framework: 'cwe', id: 'CWE-770' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de disponibilidade, resposta a ataque de volume e comunicação de incidente.',
}
