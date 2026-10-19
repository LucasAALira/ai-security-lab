import type { DossierContent } from '../types'

/* Dossiê: vazamento de dados de correntistas do Banco Inter e acordo judicial (Brasil, 2018). */

export const bancoInter2018: DossierContent = {
  id: 'banco-inter-2018',
  title: 'Banco Inter (Brasil, 2018): a negativa, a extorsão e o acordo de R$ 1,5 milhão',
  subtitle: 'O vazamento veio a público quando alguém procurou a imprensa com 40 GB de dados. O banco falou em extorsão e negou comprometimento; meses depois, o Ministério Público concluiu que houve vazamento e o caso terminou em acordo.',
  incidentDate: '2018-05',
  publishedDate: '2018-12-19 (divulgação do acordo homologado)',
  reviewed: '2026-10-19',
  summary: [
    'Em **18 de dezembro de 2018**, a Justiça homologou acordo em que o banco pagaria **R$ 1,5 milhão** como reparação por danos morais coletivos de alcance nacional, após vazamento de dados de **mais de 19 mil correntistas**. [1]',
    'Do total, **R$ 1 milhão** seria destinado a instituições públicas que combatem crimes cibernéticos, indicadas pelo MPDFT, e o restante a instituições de caridade. [1]',
    'Em **julho de 2018**, a unidade especial de proteção de dados do MPDFT havia ajuizado **ação civil pública** por danos morais coletivos contra a instituição financeira. [1][2]',
    'Segundo a cobertura da época, foram **19.961 correntistas** atingidos, dos quais **13.207** tiveram informações sensíveis expostas — número de conta, senhas, endereços, CPF e telefones —, além de **4.840 clientes de outros bancos** que transacionaram com usuários do banco. [3]',
    'O caso veio a público em **maio de 2018**, quando alguém procurou um site de tecnologia com **40 GB** de dados de clientes; o banco negou a invasão, afirmou ser vítima de extorsão e disse não ter encontrado comprometimento da sua infraestrutura. [3]',
    'Ainda segundo a cobertura, o MPDFT concluiu em **agosto de 2018**, após investigação, que o vazamento havia ocorrido; o pedido inicial do Ministério Público era de R$ 10 milhões. [3]',
    'O processo seguiu em sigilo: a Justiça autorizou a divulgação apenas da ata da audiência em que o acordo foi firmado. [1]',
  ],
  timeline: [
    { when: '2018-05', what: 'Alguém procura um site de tecnologia com 40 GB de dados de clientes; o banco nega invasão e afirma ser vítima de extorsão.', source: 3 },
    { when: '2018-07', what: 'O MPDFT ajuíza ação civil pública por danos morais coletivos contra a instituição.', source: 1 },
    { when: '2018-08', what: 'Após investigação, o Ministério Público conclui que o vazamento ocorreu.', source: 3 },
    { when: '2018-12-18', what: 'A Justiça homologa o acordo de R$ 1,5 milhão, com destinação a instituições públicas de combate a crimes cibernéticos e a entidades de caridade.', source: 1 },
    { when: '2018-12-19', what: 'O MPDFT divulga o acordo; o processo permanece em sigilo, com liberação apenas da ata da audiência.', source: 1 },
  ],
  component: {
    name: 'Base de correntistas de um banco digital, incluindo dados de clientes de outras instituições que transacionaram com eles',
    trust:
      'Quem abre conta em um banco digital confia que a instituição guarda documento, endereço e credenciais com um cuidado maior do que o de uma loja. E confia também que, se algo sair, o banco vai dizer, porque é ele quem sabe o que estava lá.',
  },
  impact: [
    'Mais de 19 mil correntistas atingidos, segundo o Ministério Público; a cobertura aponta 19.961, com 13.207 em situação de exposição sensível. [1][3]',
    'Exposição que alcançou também 4.840 clientes de outras instituições que transacionaram com usuários do banco. [3]',
    'Acordo de R$ 1,5 milhão em danos morais coletivos de alcance nacional, abaixo do pedido inicial de R$ 10 milhões. [1][3]',
    'Entre os dados citados pela cobertura estão senhas, o que implica necessidade de troca de credenciais pelos afetados. [3]',
  ],
  uncertainties: [
    'O mecanismo do vazamento não é descrito pelas fontes consultadas: nem a notícia oficial nem a cobertura explicam a causa técnica. [1][3]',
    'O banco negou comprometimento da sua infraestrutura e falou em extorsão; o Ministério Público concluiu que houve vazamento. As duas versões constam das fontes. [3]',
    'O sigilo do processo impede verificar os termos completos do acordo e as obrigações técnicas assumidas. [1]',
    'A expressão "senhas" aparece na cobertura, sem detalhar se eram senhas em texto claro, resumos criptográficos ou outro formato. [3]',
  ],
  analysis: [
    'A sequência negar, ser contrariado e acordar é mais custosa que admitir cedo: a negativa inicial virou parte da história e enfraqueceu a posição do banco.',
    'Chamar o episódio de extorsão não resolve o problema do cliente. Extorsão e vazamento podem coexistir, e a existência de uma não afasta o outro.',
    'A presença de clientes de outros bancos mostra um efeito que se repete em sistemas financeiros: a base de uma instituição guarda dados de quem nunca foi cliente dela.',
    'A destinação de R$ 1 milhão a órgãos públicos de combate a crimes cibernéticos é um desenho interessante de reparação coletiva, mas não repara individualmente nenhum dos 19 mil.',
    'O sigilo processual protege a instituição e, ao mesmo tempo, impede que o mercado aprenda a lição técnica do caso. Isso explica por que casos como este rendem pouco conhecimento público.',
  ],
  lessons: [
    'Antes de negar publicamente, verifique: uma negativa desmentida depois custa mais que um "estamos apurando" com prazo.',
    'Trate credencial exposta como comprometida: forçar troca e revogar sessões é mais barato que decidir caso a caso.',
    'Mapeie os dados de terceiros que a sua base guarda, porque a comunicação precisa alcançar quem não é seu cliente.',
    'Prepare uma linha de comunicação para o cenário de extorsão com amostra verdadeira, em que negar não é opção.',
    'Mantenha registro de acesso em massa à base de clientes, porque sem ele a instituição não pode afirmar o que saiu, e a versão do atacante prevalece.',
  ],
  exercise: {
    title: 'Simulação: o banco digital Aurora e a amostra na redação',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. O **Banco Aurora** é uma instituição inventada. Uma redação de tecnologia informa que recebeu um arquivo com dados de clientes e pede posicionamento em duas horas. Nomes, números e endereços são inventados.',
      'A equipe confirma que 300 registros da amostra correspondem a clientes reais, inclusive 12 que são clientes de outros bancos e apenas receberam transferências. O registro de acesso à base guarda 30 dias.',
    ],
    objective: 'Escolher o posicionamento público, tratar as credenciais expostas e definir quem precisa ser comunicado, inclusive quem não é cliente.',
    criteria: [
      'Você escolhe um posicionamento que não pode ser desmentido depois.',
      'Você decide o tratamento das credenciais com base no risco, e não na confirmação individual.',
      'Você identifica que a comunicação precisa alcançar titulares que não são clientes.',
    ],
    evidence: [
      {
        id: 'amostra-verificada',
        title: 'Verificação da amostra recebida pela redação (fictício)',
        kind: 'table',
        from: 0,
        head: ['Grupo na amostra', 'Registros', 'Confirmados como reais', 'Campos presentes'],
        rows: [
          ['clientes do banco', '288', '288', 'nome, CPF, conta, telefone, endereço'],
          ['clientes com credencial', '96', '96', 'os campos acima e resumo de senha'],
          ['não clientes (recebedores)', '12', '12', 'nome, CPF, banco, conta'],
          ['registros inválidos', '0', '-', '-'],
        ],
        note: 'Repare que existe um grupo que não tem conta no banco e aparece na amostra.',
      },
      {
        id: 'registro-de-acesso',
        title: 'O que o registro de acesso permite dizer (fictício)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'O registro de acesso à base de clientes guarda 30 dias. Nele não há exportação em massa no período, apenas consultas individuais dentro do padrão.',
          'A amostra contém clientes que encerraram a conta há mais de um ano, o que indica que os dados são anteriores à janela de 30 dias registrada.',
          'O sistema de atendimento tem uma consulta que devolve o cadastro completo e é acessível a 240 pessoas, sem limite diário por usuário e sem registro de volume consolidado.',
        ],
        note: 'Pergunte se a ausência de exportação nos últimos 30 dias permite concluir que não houve vazamento.',
      },
    ],
    activities: [
      {
        id: 'posicionamento',
        kind: 'decide',
        title: 'O posicionamento em duas horas',
        prompt: 'A redação pede posicionamento e a amostra foi confirmada como real. O que o Banco Aurora responde?',
        options: [
          {
            text: 'Confirmar que a amostra corresponde a dados reais de clientes, informar que a origem está em apuração e que o registro disponível cobre apenas 30 dias, anunciar troca obrigatória de credenciais dos afetados e comprometer-se com nova atualização em prazo definido.',
            quality: 'best',
            flags: ['confirma', 'apura', 'credenciais'],
            feedback: 'Afirma só o que está verificado, admite o limite do registro e já anuncia a medida que protege o cliente, sem prometer conclusão que ainda não existe.',
            consequence: 'A notícia sai com a versão do banco, os clientes trocam a senha e a apuração continua sem contradizer o que foi dito.',
          },
          {
            text: 'Declarar que não houve invasão nem vazamento, porque o registro dos últimos 30 dias não mostra exportação em massa.',
            quality: 'poor',
            feedback: 'A ausência de registro em uma janela de 30 dias não cobre dados anteriores, e a amostra real desmente a negativa.',
            consequence: 'A negativa é contrariada pela própria amostra e o banco perde credibilidade no resto da comunicação.',
          },
          {
            text: 'Afirmar que o banco é vítima de extorsão e não comentar o conteúdo da amostra.',
            quality: 'partial',
            feedback: 'Pode ser verdade e ainda assim não responde à pergunta do cliente: os dados são reais e estão fora.',
            consequence: 'A cobertura destaca o silêncio sobre o conteúdo e os clientes seguem sem saber o que fazer.',
          },
          {
            text: 'Pedir mais prazo à redação e não publicar nada até a conclusão da perícia.',
            quality: 'poor',
            feedback: 'A matéria sai de todo modo, e a ausência de posicionamento deixa a interpretação por conta de quem forneceu a amostra.',
            consequence: 'A notícia é publicada sem a versão do banco e a comunicação aos clientes chega depois da imprensa.',
          },
        ],
        hints: [
          'Pergunte qual afirmação resiste se a apuração encontrar algo pior.',
          'O limite do registro é informação, não fraqueza.',
          'O cliente quer saber o que fazer agora.',
        ],
        explain:
          'O posicionamento seguro confirma o que está verificado, declara o limite do que se sabe, anuncia a medida de proteção e marca a próxima atualização. Negar com base em registro parcial é o erro que o caso real tornou famoso.',
      },
      {
        id: 'credenciais',
        kind: 'multi',
        variant: 'multi',
        title: 'O tratamento das credenciais',
        prompt: 'Marque **todas** as medidas adequadas para as credenciais, considerando que 96 registros da amostra traziam resumo de senha.',
        options: [
          { text: 'Forçar troca de senha para todos os clientes da base, e não apenas para os 96 identificados.', feedback: 'Sim: a amostra é uma fração do conjunto, e identificar caso a caso atrasa a proteção de quem está exposto.' },
          { text: 'Revogar as sessões ativas e exigir nova autenticação nos aplicativos.', feedback: 'Sim: sessão ativa é acesso já concedido, e trocar a senha sem revogar sessão deixa a porta aberta.' },
          { text: 'Monitorar tentativas de acesso com credenciais conhecidas e bloquear padrões de teste em massa.', feedback: 'Sim: credencial exposta costuma ser testada em lote, e o bloqueio por padrão reduz a conta invadida.' },
          { text: 'Esperar a perícia concluir qual é o formato do resumo antes de qualquer troca de senha.', feedback: 'Não: a espera adia a proteção, e o formato do resumo não muda o fato de a credencial estar exposta.' },
          { text: 'Publicar a lista de clientes afetados para que cada um saiba se precisa trocar a senha.', feedback: 'Não: publicar a lista expõe novamente os titulares; a comunicação deve ser individual e por canal próprio.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Pergunte se a amostra é todo o conjunto exposto.',
          'Trocar senha sem revogar sessão resolve pela metade.',
          'Duas opções pioram a situação.',
        ],
        explain:
          'Credencial exposta é credencial comprometida: troca ampla, revogação de sessões e bloqueio de teste em massa. Esperar a perícia ou publicar a lista de afetados são caminhos que aumentam o dano.',
      },
      {
        id: 'quem-comunicar',
        kind: 'assign',
        variant: 'classify',
        title: 'Quem precisa ser comunicado',
        prompt: 'Classifique cada grupo conforme a forma de comunicação adequada.',
        rows: [
          { text: 'Clientes ativos com dados na amostra, inclusive os 96 com credencial.', why: 'São titulares identificáveis com canal cadastrado, e precisam de aviso individual e de troca de credencial.' },
          { text: 'Clientes que encerraram a conta há mais de um ano e aparecem na amostra.', why: 'Continuam titulares dos dados vazados, mas o canal cadastrado pode estar desatualizado.' },
          { text: 'Pessoas que não são clientes e aparecem por terem recebido transferências.', why: 'O banco não tem relação contratual com elas, então precisa de aviso público e de apoio da instituição de origem.' },
          { text: 'A autoridade competente e a instituição que opera o sistema de pagamentos.', why: 'A comunicação institucional tem conteúdo e prazo próprios, distintos do aviso ao titular.' },
        ],
        choices: ['Comunicação individual pelo canal cadastrado', 'Tentativa individual e aviso público complementar', 'Comunicação institucional'],
        accept: [[0], [1], [1], [2]],
        hints: [
          'Pergunte, para cada grupo, se existe canal confiável.',
          'Dois grupos precisam de aviso público como complemento.',
          'Há um grupo que não é titular e sim instituição.',
        ],
        explain:
          'A comunicação se organiza por capacidade de alcançar: individual para quem tem canal válido, individual mais aviso público para ex-clientes e não clientes, e comunicação institucional para autoridade e operador do sistema.',
      },
    ],
    closing:
      'O Banco Aurora confirmou o que estava verificado, declarou o limite do registro, forçou troca de senha com revogação de sessões e organizou a comunicação até quem não era cliente. O ponto central: negar com base em registro parcial é o caminho mais caro, e a credencial exposta não espera a perícia.',
    review: {
      solution: [
        'O posicionamento adequado confirma que a amostra é real, declara que a origem está em apuração e que o registro cobre 30 dias, anuncia a troca de credenciais e marca a próxima atualização.',
        'As credenciais exigem troca ampla, revogação de sessões e bloqueio de teste em massa; esperar a perícia ou publicar a lista de afetados agrava o caso.',
        'A comunicação é individual para clientes ativos, individual com aviso público para ex-clientes e não clientes, e institucional para autoridade e operador do sistema.',
      ],
      residual:
        'A origem do vazamento pode nunca ser determinada, porque o registro cobre apenas 30 dias e os dados são mais antigos. Sem isso, não há garantia de que a falha foi fechada.',
      validation:
        'Amplie a retenção do registro de acesso e confirme, em teste, que uma consulta de cadastro completo acima de um limite diário por usuário gera alerta; e meça quanto tempo leva para forçar troca de senha em toda a base.',
    },
  },
  sources: [
    {
      label: 'MPDFT, "Banco Inter: acordo destinará R$ 1,5 milhão para caridade e combate a crimes cibernéticos" (2018-12-19)',
      url: 'https://www.mpdft.mp.br/portal/index.php/comunicacao-menu/sala-de-imprensa/noticias/noticias-2018/10524-2018-12-19-10-27-31',
      kind: 'primária',
    },
    {
      label: 'MPDFT, petição da ação civil pública contra o Banco Inter (documento publicado pelo órgão, dezembro de 2018)',
      url: 'https://www.mpdft.mp.br/portal/pdf/noticias/dezembro_2018/ACP_-_Banco_Inter.pdf',
      kind: 'primária',
    },
    {
      label: 'Olhar Digital, "Banco Inter pagará R$ 1,5 milhão por vazar dados de quase 20 mil pessoas" (2018-12-19)',
      url: 'https://olhardigital.com.br/2018/12/19/noticias/banco-inter-pagara-r-1-5-milhao-por-vazar-dados-de-quase-20-mil-pessoas/',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A09' },
    { framework: 'owasp-top10', id: 'A06' },
  ],
  country: 'Brasil',
  tags: ['web', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de vazamento de base bancária, comunicação pública e tratamento de credenciais expostas.',
}
