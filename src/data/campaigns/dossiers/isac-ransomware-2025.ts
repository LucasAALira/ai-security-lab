import type { DossierContent } from '../types'

/* Dossiê: ransomware em organização social de saúde e processo sancionador da ANPD (Brasil, 2025-2026). */

export const isacRansomware2025: DossierContent = {
  id: 'isac-ransomware-2025',
  title: 'Organização social de saúde (Brasil, 2025): 500 mil pacientes e um aviso no site',
  subtitle: 'Um ataque de ransomware atingiu os registros de uma organização social que administra unidades públicas de saúde em seis estados. A ANPD abriu processo sancionador, apontando falhas de segurança e de comunicação.',
  incidentDate: '2025',
  publishedDate: '2026-07-08 (anúncio do processo sancionador pela ANPD)',
  reviewed: '2026-10-19',
  summary: [
    'O **Instituto Saúde e Cidadania (Isac)**, organização social com sede administrativa em Brasília que administra unidades públicas de saúde em **Goiás, Rio Grande do Sul, Bahia, Alagoas, Piauí e Tocantins**, sofreu um ataque de **ransomware em 2025**. [1][2]',
    'Em **8 de julho de 2026**, a ANPD anunciou a instauração de processo administrativo sancionador para apurar falhas na proteção de dados pessoais relacionadas ao incidente. [1]',
    'Foram afetados cerca de **500 mil registros**, dos quais aproximadamente **78.772 de crianças e adolescentes** e **47.921 de idosos**. [1][2]',
    'Os dados incluem identificação (nome e data de nascimento) e **dados sensíveis de saúde**: histórico de exames, prontuários, prescrições, atendimentos ambulatoriais, internações, diagnósticos e procedimentos. [1][2]',
    'Segundo a ANPD, os pacientes **não foram comunicados individualmente**: a organização apenas publicou um aviso no próprio site, considerado insuficiente por não informar a data do incidente, a natureza dos dados comprometidos nem quem foi afetado. [1][3]',
    'A ANPD registrou que a organização alegou risco mínimo aos titulares, mas **não apresentou evidência técnica** que sustentasse a alegação, mesmo após pedidos repetidos, e que o site não traz as informações obrigatórias sobre o encarregado. [1][2]',
    'O processo investiga a falta de medidas de segurança adequadas, a comunicação deficiente, a ausência de informação sobre o encarregado e a violação dos princípios de prevenção e responsabilização. As sanções possíveis vão de advertência a multa de até 2% do faturamento e suspensão do tratamento (art. 52 da LGPD). A defesa tem dez dias úteis. [1][3]',
  ],
  timeline: [
    { when: '2025', what: 'O ataque de ransomware torna inacessíveis dados de pacientes das unidades administradas pela organização.', source: 1 },
    { when: '2025 (após o ataque)', what: 'A organização comunica o incidente à ANPD e publica um aviso no próprio site, sem comunicar os titulares individualmente.', source: 1 },
    { when: '2026 (durante a apuração)', what: 'A ANPD pede evidência técnica sobre o risco aos titulares e não a recebe.', source: 2 },
    { when: '2026-07-08', what: 'A ANPD anuncia a instauração do processo administrativo sancionador (nº 00261.003381/2026-55) e abre prazo de dez dias úteis para defesa.', source: 1 },
  ],
  component: {
    name: 'Base de prontuários e atendimentos de unidades públicas de saúde administradas por organização social',
    trust:
      'O paciente de uma unidade pública confia que o prontuário vai ficar guardado por quem administra a unidade, sem precisar saber se isso é o Estado ou uma organização contratada. A responsabilidade pelo dado acompanha quem opera o serviço, mesmo quando o serviço é público e a operação é terceirizada.',
  },
  impact: [
    'Cerca de 500 mil registros de pacientes afetados, incluindo dados sensíveis de saúde. [1][2]',
    'Mais de 126 mil registros pertencem a crianças, adolescentes e idosos, grupos com proteção reforçada. [1]',
    'Os titulares não receberam comunicação individual; o aviso publicado foi considerado insuficiente pela autoridade. [1][3]',
    'A organização responde a processo sancionador com risco de multa de até 2% do faturamento e de suspensão do tratamento de dados. [1]',
  ],
  uncertainties: [
    'O caso está em apuração: as conclusões da ANPD são preliminares e a organização ainda apresentará defesa. [1]',
    'As fontes consultadas não informam o caminho de entrada do ataque, o grupo responsável nem a data exata do incidente em 2025. [1][2]',
    'Não há confirmação pública sobre cópia ou publicação dos dados: o que consta é que os dados foram sequestrados e tornados inacessíveis. [1]',
    'Não consta o tempo de indisponibilidade dos sistemas nem o efeito sobre o atendimento nas unidades. [2]',
  ],
  analysis: [
    'Em saúde, o ransomware produz dois danos somados: o atendimento para e o dado sensível fica sob controle de terceiros. Os dois precisam de resposta própria.',
    'A alegação de "risco mínimo" é a parte mais instrutiva do caso. Sem evidência técnica (o que foi acessado, por quem, por quanto tempo), a alegação não se sustenta diante da autoridade.',
    'O aviso no site resolve o problema de quem já procura a organização; não alcança quem nunca vai olhar. É por isso que a comunicação individual é a regra, e o aviso público uma alternativa limitada.',
    'A terceirização da operação não transfere o dever de proteger: quem trata os dados responde, independentemente do vínculo com o poder público.',
    'A proporção de crianças, adolescentes e idosos no conjunto afetado muda a gravidade, porque são grupos cuja exposição é mais difícil de remediar.',
  ],
  lessons: [
    'Guarde, desde o primeiro dia da resposta, a evidência que vai sustentar a sua avaliação de risco: sem ela, a sua conclusão é só uma opinião.',
    'Comunique os titulares individualmente quando houver como identificá-los, e use o aviso público como complemento, não como substituto.',
    'Publique com clareza quem é o encarregado e como falar com ele: é obrigação simples e é a primeira coisa que a autoridade verifica.',
    'Em dado sensível de saúde, trate a cópia isolada e testada como requisito de operação, não como melhoria futura.',
    'Em contrato de operação de serviço público, defina quem comunica, em quanto tempo e com qual conteúdo, antes de o incidente acontecer.',
  ],
  exercise: {
    title: 'Simulação: a rede de unidades de Vila Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. O **Instituto Aurora de Atenção à Saúde** é uma organização inventada que administra sete unidades públicas e mantém o prontuário eletrônico em um ambiente próprio. Nomes, números e endereços são inventados.',
      'Numa quinta-feira, o prontuário fica inacessível e aparece um arquivo de resgate em três servidores. O atendimento continua em papel. Passados nove dias, a organização precisa decidir o que dizer e a quem.',
    ],
    objective: 'Avaliar o risco com a evidência disponível, escolher a forma de comunicar os titulares e definir o que precisa estar pronto antes do próximo incidente.',
    criteria: [
      'Você distingue o que a evidência sustenta sobre acesso aos dados do que é apenas suposição.',
      'Você escolhe uma comunicação proporcional ao tipo de dado e ao público afetado.',
      'Você identifica os controles que mudariam o resultado em um próximo ataque.',
    ],
    evidence: [
      {
        id: 'o-que-foi-atingido',
        title: 'Sistemas atingidos e cópias disponíveis (fictício)',
        kind: 'table',
        from: 0,
        head: ['Sistema', 'Registros', 'Tipo de dado', 'Cópia isolada', 'Último teste de restauração'],
        rows: [
          ['Prontuário eletrônico', '212.000', 'saúde (sensível)', 'sim, semanal', 'há 7 meses'],
          ['Agendamento', '180.000', 'cadastral', 'sim, diária', 'há 1 mês'],
          ['Exames de imagem', '64.000', 'saúde (sensível)', 'não', 'nunca'],
          ['Folha de pessoal', '3.100', 'cadastral e financeiro', 'sim, diária', 'há 2 meses'],
        ],
        note: 'Compare o tipo de dado com a existência e o teste da cópia: as duas colunas definem o que pode ser recuperado.',
      },
      {
        id: 'evidencia-de-acesso',
        title: 'O que a investigação encontrou em nove dias (fictício)',
        kind: 'text',
        from: 1,
        paragraphs: [
          'O acesso inicial foi por uma conta de administração remota sem segundo fator, usada a partir de 203.0.113.8. A conta pertencia a um fornecedor de manutenção.',
          'O registro de rede mostra 240 GB de tráfego de saída para um destino externo nas 36 horas anteriores à cifragem. O conteúdo desse tráfego não pôde ser identificado.',
          'O registro de consultas do prontuário tem retenção de 15 dias e cobre todo o período. Ele mostra 11 mil consultas feitas pela conta do fornecedor em 36 horas, contra uma média de 40 por dia nos meses anteriores.',
          'Os exames de imagem não têm cópia isolada e seguem cifrados. As demais bases foram restauradas, com perda de até sete dias no prontuário.',
        ],
        note: 'Repare na diferença entre "não sabemos o conteúdo" e "não houve acesso".',
      },
    ],
    activities: [
      {
        id: 'avaliar-risco',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que a evidência sustenta',
        prompt: 'Marque **todas** as conclusões que a evidência sustenta sobre o risco aos titulares.',
        options: [
          { text: 'Houve acesso em volume anormal ao prontuário pela conta do fornecedor: 11 mil consultas em 36 horas contra média de 40 por dia.', feedback: 'Sim: a comparação com a linha de base torna o acesso anormal um fato, e não uma hipótese.' },
          { text: 'Houve transferência de 240 GB para um destino externo antes da cifragem.', feedback: 'Sim: o volume e a janela estão registrados, mesmo sem identificação do conteúdo transferido.' },
          { text: 'O risco aos titulares do prontuário deve ser tratado como relevante, dado o acesso anormal somado à saída de dados.', feedback: 'Sim: os dois indícios juntos sustentam risco relevante, que é o critério para comunicar os titulares.' },
          { text: 'Como o conteúdo do tráfego não foi identificado, pode-se afirmar que nenhum dado de saúde saiu.', feedback: 'Não: não identificar o conteúdo é desconhecimento, e desconhecimento não é prova de que nada saiu.' },
          { text: 'Os exames de imagem foram recuperados, porque as demais bases voltaram.', feedback: 'Não: a tabela mostra que os exames não têm cópia isolada e seguem cifrados.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Procure, em cada afirmação, qual registro a sustentaria.',
          'Uma das alternativas troca "não sabemos" por "não houve".',
          'Confira a tabela antes de afirmar o que foi recuperado.',
        ],
        explain:
          'Acesso anormal registrado mais saída de 240 GB sustentam risco relevante, mesmo sem saber o conteúdo exato. É esse raciocínio, documentado, que a autoridade espera ver quando a organização avalia o risco.',
      },
      {
        id: 'como-comunicar',
        kind: 'decide',
        title: 'Como comunicar os titulares',
        prompt: 'Com risco relevante caracterizado e cadastro com telefone e endereço de 94% dos pacientes, como a organização comunica?',
        options: [
          {
            text: 'Comunicar individualmente quem é identificável, pelos canais do cadastro, informando data do incidente, dados envolvidos, riscos prováveis, medidas tomadas e canal do encarregado; publicar aviso equivalente no site e nas unidades para os 6% restantes; e comunicar a autoridade com o mesmo conteúdo.',
            quality: 'best',
            flags: ['individual', 'conteudo', 'autoridade'],
            feedback: 'Alcança quem pode ser alcançado, cobre o restante por aviso público e entrega o conteúdo mínimo que permite ao paciente se proteger.',
            consequence: 'A maior parte dos pacientes recebe o aviso diretamente, as unidades sabem o que responder e a autoridade recebe a mesma versão.',
          },
          {
            text: 'Publicar um aviso curto no site dizendo que houve um incidente de segurança e que as equipes estão apurando, sem detalhar dados nem datas.',
            quality: 'poor',
            feedback: 'É exatamente o que a autoridade considerou insuficiente no caso real: não informa data, dados envolvidos nem quem foi afetado.',
            consequence: 'Os pacientes não sabem se foram afetados nem do que se proteger, e a comunicação precisa ser refeita por determinação da autoridade.',
          },
          {
            text: 'Esperar o fim da perícia para comunicar, para não divulgar informação que possa mudar.',
            quality: 'poor',
            feedback: 'A comunicação se faz com o que já se sabe, e a espera é o atraso que mais pesa nas sanções desse tipo de caso.',
            consequence: 'O prazo é perdido, e a organização responde pela demora além do próprio incidente.',
          },
          {
            text: 'Comunicar individualmente apenas os pacientes com dados sensíveis de exames de imagem, por serem o grupo cujos dados seguem cifrados.',
            quality: 'partial',
            feedback: 'Reduz o grupo pelo critério errado: o acesso anormal e a saída de dados atingiram o prontuário, que é a base com mais titulares.',
            consequence: 'A maior parte dos afetados não é avisada e a comunicação precisa ser ampliada depois, com credibilidade menor.',
          },
        ],
        hints: [
          'Pergunte quem a organização consegue identificar e por qual canal.',
          'Lembre do conteúdo mínimo que o aviso precisa trazer.',
          'O critério para comunicar é o risco relevante, não a dificuldade de restaurar.',
        ],
        explain:
          'Comunicação individual para quem é identificável, aviso público para o resto e mesmo conteúdo para a autoridade. O conteúdo mínimo (data, dados, riscos, medidas e canal do encarregado) é o que diferencia um aviso útil de um aviso formal.',
      },
      {
        id: 'o-que-mudaria',
        kind: 'order',
        title: 'O que preparar para o próximo',
        prompt: 'Ordene as quatro providências pelo efeito que teriam em um próximo ataque, começando pela que impediria o acesso inicial.',
        items: [
          { text: 'Exigir segundo fator e acesso temporário nas contas de fornecedor, com aprovação por chamado.', why: 'O acesso inicial veio de uma conta de manutenção sem segundo fator; sem ela, o ataque não começa.' },
          { text: 'Criar alerta de volume de consultas por conta, comparando com a linha de base de cada perfil.', why: 'Onze mil consultas contra média de 40 por dia seriam detectadas em minutos, antes da saída dos dados.' },
          { text: 'Garantir cópia isolada para todas as bases, incluindo exames de imagem, com teste de restauração periódico.', why: 'A base sem cópia isolada foi a única que não voltou; o teste é o que confirma que a cópia serve.' },
          { text: 'Deixar pronto o conteúdo da comunicação a titulares e autoridade, com responsável e canais definidos.', why: 'Com o modelo pronto, a comunicação sai dentro do prazo mesmo com a equipe ocupada na recuperação.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Comece pelo controle que atua antes de o atacante entrar.',
          'Depois vem a detecção, que encurta a janela de dano.',
          'A comunicação pronta é a última, porque atua depois do incidente.',
        ],
        explain:
          'A ordem segue o caminho do ataque: impedir o acesso, detectar o abuso, poder recuperar e saber comunicar. Cada etapa reduz um dano diferente, e nenhuma substitui as outras.',
      },
    ],
    closing:
      'O Instituto Aurora documentou o acesso anormal e a saída de dados, concluiu que o risco era relevante, comunicou individualmente quem podia identificar e preparou o que faltava: segundo fator para fornecedor, alerta de volume, cópia isolada de todas as bases e modelo de comunicação. O ponto central: avaliação de risco sem evidência não convence ninguém, e aviso no site não alcança quem precisa saber.',
    review: {
      solution: [
        'A evidência sustenta acesso anormal pela conta do fornecedor, saída de 240 GB e, por consequência, risco relevante aos titulares do prontuário.',
        'A comunicação adequada é individual para quem é identificável, com data, dados envolvidos, riscos, medidas e canal do encarregado, complementada por aviso público e pela comunicação à autoridade.',
        'Para o próximo incidente, a ordem de preparação é segundo fator no acesso de fornecedor, alerta de volume de consultas, cópia isolada testada de todas as bases e modelo de comunicação pronto.',
      ],
      residual:
        'Mesmo com tudo isso, os dados que saíram continuam fora, os exames sem cópia isolada podem não voltar e parte dos pacientes não será alcançada por falta de contato atualizado.',
      validation:
        'Confirme em exercício que o acesso de fornecedor expira sozinho, que uma consulta em volume anormal gera alerta em minutos e que a restauração dos exames de imagem funciona; e cronometre quanto tempo leva para emitir a comunicação a partir do modelo pronto.',
    },
  },
  sources: [
    {
      label: 'ANPD, "ANPD instaura processo de sanção contra OS por falha na proteção de dados de 500 mil pacientes" (2026-07-08)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-instaura-processo-de-sancao-contra-organizacao-social-por-falha-na-protecao-de-dados-de-500-mil-pacientes-de-unidades-publicas-de-saude',
      kind: 'primária',
    },
    {
      label: 'IT Forum, "ANPD abre processo contra Isac por vazamento de dados de 500 mil pacientes" (2026-07-14)',
      url: 'https://itforum.com.br/noticias/anpd-vazamento-de-dados-500-mil-pacientes/',
      kind: 'secundária',
    },
    {
      label: 'Bahia Notícias, "ANPD instaura processo contra organização social por falhas na proteção de dados de 500 mil pacientes" (2026-07-08)',
      url: 'https://www.bahianoticias.com.br/noticia/318735-anpd-instaura-processo-contra-organizacao-social-por-falhas-na-protecao-de-dados-de-500-mil-pacientes',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A07' },
    { framework: 'owasp-top10', id: 'A09' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de ransomware, avaliação de risco e comunicação de incidente com dados de saúde.',
}
