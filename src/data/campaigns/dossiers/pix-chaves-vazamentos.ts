import type { DossierContent } from '../types'

/* Dossiê: comunicados do Banco Central sobre vazamento de dados cadastrais de chaves Pix (2022 e 2026). */

export const pixChavesVazamentos: DossierContent = {
  id: 'pix-chaves-vazamentos',
  title: 'Chaves Pix (Brasil, 2022 e 2026): o mesmo comunicado, quatro anos depois',
  subtitle: 'Dois comunicados do Banco Central, separados por quatro anos, descrevem o mesmo tipo de incidente: falhas em sistemas de uma instituição expõem os dados cadastrais ligados a chaves Pix.',
  incidentDate: '2021-12-03 (primeiro caso); 2025-08-30 a 2026-02-27 (segundo caso)',
  publishedDate: '2022-01-21 (primeiro comunicado); 2026-03-21 (cobertura do segundo)',
  reviewed: '2026-10-19',
  summary: [
    'No primeiro caso, o Banco Central comunicou o vazamento de dados cadastrais vinculados a chaves Pix sob responsabilidade da **Acesso Soluções de Pagamento S.A.**, atribuído a "falhas pontuais em sistemas dessa instituição", já corrigidas. [1]',
    'Os dados expostos nesse caso foram **CPF completo vinculado à chave, nome da instituição em que a pessoa tem conta, número da agência, número e tipo da conta**. [1]',
    'Segundo a imprensa especializada, foram **160.147 chaves**, com vazamento ocorrido **entre 3 e 5 de dezembro**, e o comunicado do Banco Central saiu em uma sexta-feira, dia 21. [3]',
    'No segundo caso, o comunicado se refere à **Pefisa S.A. Crédito, Financiamento e Investimento** e a um incidente ocorrido **entre 30 de agosto de 2025 e 27 de fevereiro de 2026**, também atribuído a "falhas pontuais em sistemas dessa instituição". [2]',
    'Nesse segundo caso, os dados cadastrais expostos foram **nome do usuário, CPF, instituição de relacionamento, número da agência, número e tipo da conta, data de abertura da conta e data de criação e de posse da chave Pix**; a cobertura noticiou **28.203 chaves** afetadas. [2][4]',
    'Nos dois comunicados, o Banco Central afirma que **não foram acessados dados sigilosos**, como senhas, informações de movimentações ou saldos, nem outras informações bancárias, fiscais ou patrimoniais. [1][2]',
    'A orientação ao usuário é a mesma nos dois: atenção a golpes que usem esses dados e desconfiança de mensagens de terceiros pedindo dados adicionais, porque o Banco Central e os participantes do Pix não fazem contato por aplicativos de mensagem, telefone, SMS ou e-mail. [1]',
  ],
  timeline: [
    { when: '2021-12-03 a 2021-12-05', what: 'Período do vazamento no primeiro caso, segundo a cobertura especializada.', source: 3 },
    { when: '2022-01-21', what: 'O Banco Central comunica o vazamento de dados cadastrais vinculados a 160.147 chaves Pix.', source: 3 },
    { when: '2025-08-30 a 2026-02-27', what: 'Período do incidente no segundo caso, conforme o comunicado do Banco Central.', source: 2 },
    { when: '2026-03-21', what: 'A cobertura noticia o comunicado sobre 28.203 chaves Pix afetadas na segunda instituição.', source: 4 },
  ],
  component: {
    name: 'Dados cadastrais vinculados a chaves Pix sob custódia de instituições participantes',
    trust:
      'Quem cadastra uma chave confia que ela funcione como apelido: um atalho para receber dinheiro, sem revelar o conjunto que identifica a pessoa e a conta dela. A chave só cumpre esse papel enquanto a instituição que a guarda limita quem pode transformar o apelido em cadastro completo.',
  },
  impact: [
    '160.147 chaves no primeiro caso e 28.203 no segundo, segundo a cobertura dos comunicados. [3][4]',
    'Exposição de conjuntos que ligam pessoa, documento, instituição e conta, úteis para abordagem fraudulenta direcionada. [1][2]',
    'Períodos de exposição muito diferentes: três dias no primeiro caso e cerca de seis meses no segundo. [2][3]',
    'Segundo o Banco Central, nenhum acesso a senhas, saldos ou movimentações, e os dados não permitem movimentar recursos. [1][2]',
  ],
  uncertainties: [
    'Nenhum dos dois comunicados descreve a falha técnica: ambos usam a expressão "falhas pontuais em sistemas dessa instituição". [1][2]',
    'O comunicado do primeiro caso, na versão consultada, não traz data nem o número de chaves; esses dados vêm da cobertura de imprensa. [1][3]',
    'Não consta, nas fontes consultadas, se houve fraude efetiva decorrente de algum dos dois vazamentos. [1][2]',
    'Não há informação sobre sanção aplicada a essas duas instituições por esses incidentes específicos nas fontes consultadas.',
  ],
  analysis: [
    'O que se repete não é a falha, é a categoria: dado cadastral ligado a chave, exposto por quem tem o direito de consultá-lo.',
    'A diferença entre três dias e seis meses de exposição é toda sobre detecção. Nos dois casos, o controle que faltou é o mesmo: alguém olhando o padrão de consulta.',
    'O comunicado padronizado tem um efeito colateral: ele descreve o dano ao usuário, mas não ensina nada à comunidade técnica, porque omite o mecanismo.',
    'Chamar os dados de "apenas cadastrais" é correto do ponto de vista bancário e enganoso do ponto de vista do golpe: nome, documento, instituição e conta são a matéria-prima da fraude por mensagem.',
    'A orientação de que o Banco Central e as instituições não entram em contato por mensagem é a defesa real que sobra ao usuário: quando o dado já saiu, o que resta é não validar o golpe.',
  ],
  lessons: [
    'Monitore consulta de chave por volume e por proporção entre consulta e pagamento, porque é esse padrão que delata extração.',
    'Reduza o retorno de cada consulta ao mínimo necessário à conferência: quanto menos campos, menor o valor do abuso.',
    'Defina um prazo de detecção aceitável para esse tipo de consulta e teste se o seu monitoramento o cumpre.',
    'Ao comunicar, diga também o que o usuário deve esperar como golpe decorrente, com exemplos concretos de abordagem.',
    'Registre consultas com retenção suficiente para reconstruir seis meses: o segundo caso só pôde ser delimitado porque havia registro.',
  ],
  exercise: {
    title: 'Simulação: o apelido que virou cadastro na Aurora Pay',
    context: [
      'Esta é uma **simulação fictícia** inspirada nos dois casos. A **Aurora Pay** é uma instituição inventada que guarda os dados cadastrais ligados aos apelidos de recebimento dos seus clientes. Nomes, números e endereços são inventados.',
      'Uma varredura interna revela que um parceiro integrado consultou, em cinco meses, o cadastro de 31 mil apelidos, com 42 pagamentos concluídos. A diretoria pergunta o que comunicar e em quanto tempo isso teria sido detectado.',
    ],
    objective: 'Delimitar a exposição com os registros disponíveis, estimar o tempo de detecção e escrever uma comunicação útil para quem foi afetado.',
    criteria: [
      'Você usa os registros para delimitar período e volume, sem arredondar para mais nem para menos.',
      'Você identifica o controle que teria reduzido o tempo de exposição.',
      'Você escreve uma comunicação que descreve o risco concreto e o que fazer.',
    ],
    evidence: [
      {
        id: 'consultas-do-parceiro',
        title: 'Consultas do parceiro integrado, por mês (fictício)',
        kind: 'table',
        from: 0,
        head: ['Mês', 'Consultas', 'Apelidos distintos', 'Pagamentos concluídos', 'Alerta gerado?'],
        rows: [
          ['mês 1', '320', '318', '14', 'não'],
          ['mês 2', '1.900', '1.880', '11', 'não'],
          ['mês 3', '6.400', '6.350', '9', 'não'],
          ['mês 4', '11.200', '11.150', '5', 'não'],
          ['mês 5', '11.400', '11.302', '3', 'não'],
        ],
        note: 'Repare na direção das duas colunas ao longo dos meses: elas vão para lados opostos.',
      },
      {
        id: 'retencao',
        title: 'Registros disponíveis e retenção (fictício)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'O registro de consultas ao cadastro guarda 180 dias e inclui identificação do parceiro, apelido consultado e horário. O registro de pagamentos guarda cinco anos.',
          'A resposta da consulta devolve nome completo, documento, instituição, agência, conta e tipo de conta. A tela do parceiro exibe apenas o nome e a instituição.',
          'Não existe limite de consultas por parceiro, nem indicador que compare consultas e pagamentos. O time de risco recebe relatório mensal com o total de consultas da plataforma.',
        ],
        note: 'Verifique se a retenção cobre o período do abuso e o que a tela realmente usa.',
      },
    ],
    activities: [
      {
        id: 'delimitar',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que os registros permitem afirmar',
        prompt: 'Marque **todas** as afirmações que os registros sustentam.',
        options: [
          { text: 'O abuso cresceu mês a mês: as consultas subiram de 320 para mais de 11 mil, enquanto os pagamentos caíram de 14 para 3.', feedback: 'Sim: o movimento oposto das duas colunas é a assinatura da coleta disfarçada de uso do serviço.' },
          { text: 'A retenção de 180 dias cobre todo o período apurado, de cinco meses.', feedback: 'Sim: por isso é possível delimitar o volume e o conjunto de apelidos consultados com precisão.' },
          { text: 'A resposta da consulta devolve mais campos do que a tela do parceiro exibe.', feedback: 'Sim: documento, agência, conta e tipo de conta saem do servidor sem serem usados na tela.' },
          { text: 'O relatório mensal de total de consultas era suficiente para detectar o caso.', feedback: 'Não: o total agregado da plataforma esconde o parceiro específico, e nenhum alerta foi gerado em cinco meses.' },
          { text: 'Os dados consultados permitem movimentar recursos nas contas afetadas.', feedback: 'Não: são dados cadastrais; o risco principal é a abordagem fraudulenta, não a movimentação direta.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Compare a primeira e a última linha da tabela.',
          'Confira se a retenção alcança cinco meses.',
          'Duas afirmações contrariam as evidências.',
        ],
        explain:
          'Os registros mostram crescimento do abuso com queda dos pagamentos, cobrem todo o período e revelam resposta com campos além do necessário. O relatório agregado não detectava nada, e os dados não permitem movimentação direta.',
      },
      {
        id: 'controle-que-faltou',
        kind: 'decide',
        title: 'O controle que faltou',
        prompt: 'Qual controle teria reduzido os cinco meses de exposição para dias?',
        options: [
          {
            text: 'Indicador por parceiro que compare consultas e pagamentos concluídos contra a linha de base, com alerta automático no desvio e limite diário por parceiro que cai sozinho quando o desvio persiste.',
            quality: 'best',
            flags: ['indicador', 'limite', 'automatico'],
            feedback: 'Age sobre o padrão que o caso apresenta e não depende de alguém ler relatório: o alerta e o limite reagem ao desvio.',
            consequence: 'No mês 2, o desvio dispara alerta e o limite cai; a exposição fica em cerca de dois mil apelidos, não em 31 mil.',
          },
          {
            text: 'Aumentar a frequência do relatório de total de consultas da plataforma, passando de mensal para semanal.',
            quality: 'poor',
            feedback: 'O problema não é a frequência, é a agregação: o total da plataforma continua escondendo o parceiro específico.',
            consequence: 'O relatório chega mais vezes e o desvio continua invisível, porque ninguém olha por parceiro.',
          },
          {
            text: 'Exigir contrato com cláusula de uso adequado e auditoria anual dos parceiros integrados.',
            quality: 'partial',
            feedback: 'Cláusula e auditoria ajudam na responsabilização, mas detectam depois: a auditoria anual não encurta cinco meses.',
            consequence: 'O abuso aparece na auditoria do ano seguinte, com os dados já extraídos.',
          },
          {
            text: 'Bloquear consultas fora do horário comercial, concentrando o controle no horário de uso.',
            quality: 'poor',
            feedback: 'O abuso deste caso acontece em volume, não em horário incomum, e o bloqueio por horário atinge usuários legítimos.',
            consequence: 'O parceiro distribui as consultas no horário comercial e o volume total permanece o mesmo.',
          },
        ],
        hints: [
          'Pergunte qual número, na tabela, denunciava o abuso desde o mês 2.',
          'Agregação esconde; a comparação por parceiro revela.',
          'Detecção que depende de leitura humana atrasa.',
        ],
        explain:
          'O controle eficaz é o indicador por parceiro comparando consultas e pagamentos, com alerta e limite automáticos. Relatórios agregados, cláusulas contratuais e regras de horário não reagem ao padrão deste abuso.',
      },
      {
        id: 'comunicacao',
        kind: 'order',
        title: 'A comunicação aos afetados',
        prompt: 'Ordene os quatro elementos da comunicação, do que situa a pessoa ao que ela deve fazer.',
        items: [
          { text: 'Dizer o que aconteceu e em que período, com o número de apelidos afetados.', why: 'Sem período e volume, a pessoa não sabe se está entre os afetados nem desde quando.' },
          { text: 'Listar exatamente quais dados dela foram expostos e quais não foram.', why: 'A lista evita pânico sobre senha e saldo e deixa claro o que o golpista pode saber.' },
          { text: 'Descrever a abordagem fraudulenta provável, com exemplo concreto de mensagem que usa esses dados.', why: 'Risco abstrato não muda comportamento; o exemplo concreto é o que permite reconhecer o golpe.' },
          { text: 'Informar que a instituição não pede dados por mensagem e indicar o canal oficial para checar qualquer contato.', why: 'É a ação prática que resta ao usuário quando o dado já saiu: não validar o contato recebido.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Comece situando a pessoa no tempo.',
          'A lista do que não foi exposto é parte da informação.',
          'A ação prática vem no fim, depois do exemplo.',
        ],
        explain:
          'A comunicação útil situa o período, delimita os dados, mostra o golpe provável e termina com a ação concreta. É a diferença entre um aviso formal e um aviso que protege alguém.',
      },
    ],
    closing:
      'A Aurora Pay delimitou cinco meses e 31 mil apelidos, criou indicador e limite por parceiro, reduziu a resposta ao que a tela usa e comunicou com exemplo de golpe. O ponto central: quando o dado exposto é "apenas cadastral", o dano aparece depois, na mensagem que o usa.',
    review: {
      solution: [
        'Os registros sustentam o crescimento do abuso com queda de pagamentos, a cobertura completa do período pela retenção de 180 dias e a resposta com campos além do necessário.',
        'O controle que faltou é o indicador por parceiro comparando consultas e pagamentos, com alerta e limite automáticos; relatório agregado, cláusula contratual e regra de horário não detectariam.',
        'A comunicação segue a ordem: o que aconteceu e quando, quais dados saíram e quais não, qual golpe esperar e o que fazer diante de um contato.',
      ],
      residual:
        'Os dados já extraídos continuam disponíveis para fraude por tempo indeterminado, e nenhuma medida interna impede o uso deles. O que resta é reduzir a eficácia do golpe com informação e canais verificáveis.',
      validation:
        'Reproduza o padrão em homologação, com um parceiro de teste aumentando consultas e reduzindo pagamentos, e meça em quantos dias o alerta dispara e o limite cai; confirme na resposta de produção quais campos ainda são devolvidos sem uso na tela.',
    },
  },
  sources: [
    {
      label: 'Banco Central do Brasil, "BC comunica ocorrência em instituição" (vazamento de dados cadastrais de chaves Pix sob responsabilidade da Acesso Soluções de Pagamento)',
      url: 'https://www.bcb.gov.br/content/estabilidadefinanceira/pix/BC_comunica_ocorrencia_Pix-2.pdf',
      kind: 'primária',
    },
    {
      label: 'Banco Central do Brasil, "Banco Central do Brasil comunica ocorrência em instituição" (incidente na Pefisa, de 2025-08-30 a 2026-02-27)',
      url: 'https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Incidentes%20DICT/BC_comunica_ocorrencia_Pix-21.pdf',
      kind: 'primária',
    },
    {
      label: 'Tecnoblog, "Pix: BC comunica vazamento de dados vinculados a 160 mil chaves" (2022-01-21)',
      url: 'https://tecnoblog.net/noticias/pix-bc-comunica-vazamento-de-dados-vinculados-a-160-mil-chaves/',
      kind: 'secundária',
    },
    {
      label: 'Olhar Digital, "Banco Central comunica vazamento de mais de 28 mil chaves Pix da Pefisa" (2026-03-21)',
      url: 'https://olhardigital.com.br/2026/03/21/seguranca/banco-central-comunica-vazamento-de-mais-de-28-mil-chaves-pix-da-pefisa/',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API3' },
    { framework: 'owasp-api-top10', id: 'API6' },
  ],
  country: 'Brasil',
  tags: ['api', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de exposição de dados cadastrais, detecção de abuso e comunicação a titulares.',
}
