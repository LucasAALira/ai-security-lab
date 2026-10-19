import type { DossierContent } from '../types'

/* Dossiê: ataque cibernético ao STJ (Brasil, 2020). Fatos com fonte numerada; análise e simulação rotuladas à parte. */

export const stj2020: DossierContent = {
  id: 'stj-2020',
  title: 'STJ (Brasil, 2020): o tribunal que parou e voltou pelo backup',
  subtitle: 'Um ataque cifrou dados do Superior Tribunal de Justiça, interrompeu sessões de julgamento e deixou o tribunal em regime de plantão por quase uma semana.',
  incidentDate: '2020-11-03',
  publishedDate: '2020-11-04 (comunicado do próprio tribunal)',
  reviewed: '2026-10-19',
  summary: [
    'Em **3 de novembro de 2020**, o Superior Tribunal de Justiça (STJ) sofreu um ataque cibernético. No dia seguinte, o tribunal comunicou que funcionaria em **regime de plantão até o dia 9**. [1]',
    'Segundo a Agência Brasil, o tribunal confirmou que o invasor "conseguiu criptografar e bloquear o acesso aos dados do tribunal". [3]',
    'A transmissão das sessões de **seis colegiados** foi interrompida, e prazos processuais e julgamentos virtuais foram suspensos. [3]',
    'O tribunal afirmou que as informações "permanecem íntegras e estão preservadas em um backup". [3]',
    'A Polícia Federal abriu inquérito para investigar o caso, a pedido do presidente do STJ e do ministro da Justiça. A equipe de tecnologia do tribunal contou com apoio do Centro de Defesa Cibernética do Exército. [3]',
    'Em **8 de novembro de 2020**, o tribunal informou que os dados estavam sendo recuperados a partir do backup e que o restabelecimento começaria de forma gradual na segunda-feira, dia 9, a partir do Sistema Justiça. [4]',
    'Em **19 de novembro de 2020**, a Presidência do STJ publicou novo comunicado sobre a situação do tribunal depois do ataque. [2]',
  ],
  timeline: [
    { when: '2020-11-03', what: 'O ataque atinge a rede do STJ; o acesso aos dados é bloqueado por cifragem, segundo o relato do tribunal à imprensa.', source: 3 },
    { when: '2020-11-04', what: 'O STJ comunica que funcionará em regime de plantão até o dia 9 em razão do ataque cibernético.', source: 1 },
    { when: '2020-11-05', what: 'A Agência Brasil publica a matéria com a confirmação da cifragem, a suspensão de prazos e a abertura de inquérito pela Polícia Federal.', source: 3 },
    { when: '2020-11-08', what: 'O tribunal informa que os dados estão sendo recuperados do backup e que a retomada será gradual, a partir do Sistema Justiça.', source: 4 },
    { when: '2020-11-19', what: 'A Presidência do STJ publica um comunicado sobre a retomada dos trabalhos.', source: 2 },
  ],
  component: {
    name: 'Ambiente de tecnologia do STJ: sistemas processuais, sessões de julgamento e cópias de segurança',
    trust:
      'Quem protocola uma petição confia que o tribunal vai guardar o processo, cumprir prazos e julgar na data marcada. Essa confiança não está em um servidor específico: está na disponibilidade do conjunto e na existência de uma cópia que ninguém mais consiga alcançar.',
  },
  impact: [
    'O tribunal passou a funcionar em regime de plantão, com prazos processuais e julgamentos virtuais suspensos. [1][3]',
    'A transmissão das sessões de seis colegiados foi interrompida. [3]',
    'O tribunal declarou que processos, contas de e-mail e contratos administrativos permaneciam íntegros em backup, o que colocou a recuperação, e não o pagamento, no centro da resposta. [3]',
    'A retomada foi gradual e começou seis dias depois do ataque, pelo sistema principal do tribunal. [4]',
  ],
  uncertainties: [
    'A matéria consultada não usa a palavra "ransomware" nem nomeia um grupo responsável; descreve apenas a cifragem e o bloqueio de acesso. [3]',
    'As fontes consultadas não informam o caminho de entrada (phishing, serviço exposto, credencial válida ou terceiro).',
    'Não há, nas fontes consultadas, número de processos afetados nem o tempo total de recuperação de cada sistema. [4]',
    'Os comunicados do tribunal não puderam ser lidos na íntegra durante esta revisão: o endereço e o título de cada um sustentam as datas e o regime de plantão, não o detalhe técnico. [1][2]',
  ],
  analysis: [
    'Esta é uma falha de disponibilidade e de integridade, não de confidencialidade: o problema central não foi alguém ler os dados, foi ninguém poder usá-los.',
    'O backup transformou uma crise existencial em uma interrupção administrável. Um backup só cumpre esse papel quando está fora do alcance das mesmas credenciais que administram a rede e quando a restauração já foi testada.',
    'Serviço público essencial tem um custo de indisponibilidade que não aparece em planilha: prazo processual perdido, audiência remarcada, direito que espera. Esse custo pertence ao desenho do sistema, e não ao time de resposta a incidentes.',
    'Comunicar cedo, com o que se sabe e o que não se sabe, reduziu a especulação e deu previsibilidade a quem dependia do tribunal.',
  ],
  lessons: [
    'Mantenha pelo menos uma cópia isolada, com credenciais próprias, e teste a restauração em intervalos definidos: um backup que nunca foi restaurado é uma hipótese, não um controle.',
    'Escreva antes o plano de degradação: o que continua funcionando, quem decide suspender prazos e como a decisão chega ao público.',
    'Separe as redes administrativas das que operam serviços essenciais, para que uma conta comprometida não alcance tudo.',
    'Guarde registros em local que o invasor não administre: sem eles, a investigação começa sem material.',
    'Comunique por canais que não dependam da infraestrutura atingida, e diga o que ainda não se sabe.',
  ],
  exercise: {
    title: 'Simulação: o plantão do Tribunal de Vila Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. O **Tribunal de Vila Aurora** é um órgão inventado. Numa terça-feira, às 4h12, o monitoramento aponta arquivos renomeados em massa no servidor de arquivos e no banco do sistema de petições. Os nomes, horários e números são inventados.',
      'Às 7h00 o tribunal precisa decidir o que anunciar e por onde começar. O inventário diz que existem três conjuntos de cópias: uma no mesmo domínio administrativo, uma em nuvem com a mesma conta de administrador e uma em mídia desconectada, cuja última restauração de teste foi há onze meses.',
    ],
    objective: 'Reconhecer, nas evidências, o que indica cifragem em andamento, escolher um plano de resposta que preserve evidências e restaure o serviço, e ordenar as etapas de retomada.',
    criteria: [
      'Você separa os sinais de cifragem em andamento dos eventos rotineiros da madrugada.',
      'Você escolhe um plano que contém o incidente sem destruir o que a investigação vai precisar.',
      'Você ordena a retomada de modo que o serviço só volte depois de o acesso do invasor ter sido cortado.',
    ],
    evidence: [
      {
        id: 'inventario-copias',
        title: 'Inventário das cópias de segurança (fictício)',
        kind: 'table',
        from: 0,
        head: ['Conjunto', 'Onde fica', 'Credencial de acesso', 'Última restauração de teste'],
        rows: [
          ['Diário em disco', 'mesmo domínio administrativo', 'conta de administrador do domínio', 'há 3 semanas'],
          ['Semanal em nuvem', 'armazenamento na nuvem do tribunal', 'mesma conta de administrador', 'há 2 meses'],
          ['Mensal em mídia removível', 'cofre físico, desconectado', 'credencial própria, guardada em envelope', 'há 11 meses'],
        ],
        note: 'Compare a coluna da credencial com a do teste de restauração: as duas contam coisas diferentes sobre a confiabilidade da cópia.',
      },
      {
        id: 'alertas',
        title: 'Trecho do painel de alertas (fictício)',
        kind: 'code',
        from: 1,
        language: 'text',
        lines: [
          '[03:58] conta de serviço svc-backup autentica a partir de 198.51.100.44 (estação administrativa)',
          '[04:01] 12.400 arquivos renomeados em \\\\arquivos\\peticoes em 90 segundos',
          '[04:03] serviço de cópia de sombra (shadow copy) desativado no servidor de arquivos',
          '[04:07] tarefa agendada nova: "manutencao-noturna" executa script de rede',
          '[04:12] alerta de antivírus em 3 estações; 2 ficaram sem resposta desde então',
          '[05:30] backup diário conclui com sucesso (gravando sobre a cópia da noite anterior)',
        ],
        note: 'Olhe a ordem dos eventos e repare no que o backup das 5h30 pode ter feito com a cópia boa.',
      },
    ],
    activities: [
      {
        id: 'sinais-de-cifragem',
        kind: 'multi',
        variant: 'inspect',
        title: 'Sinais de cifragem em andamento',
        prompt: 'Marque **todos** os sinais que indicam cifragem em andamento ou perda da capacidade de recuperação, e não apenas atividade normal de madrugada.',
        options: [
          { text: 'Renomeação de 12.400 arquivos em 90 segundos na pasta de petições.', feedback: 'Sim: volume e velocidade incompatíveis com uso humano, e a renomeação em massa é o rastro típico da cifragem.' },
          { text: 'Desativação do serviço de cópia de sombra no servidor de arquivos.', feedback: 'Sim: desligar a cópia de sombra serve para impedir a recuperação local, e é um passo deliberado do atacante.' },
          { text: 'A conta de serviço de backup autenticando a partir de uma estação administrativa.', feedback: 'Sim: uma conta de serviço que aparece numa estação de trabalho indica uso indevido de credencial.' },
          { text: 'O backup diário concluir com sucesso às 5h30.', feedback: 'Sim, e é o pior dos sinais: concluir com sucesso significa gravar os arquivos já cifrados sobre a cópia boa.' },
          { text: 'A existência de uma tarefa agendada chamada "manutencao-noturna".', feedback: 'Não por si só: o nome é comum e precisa ser verificado; o que importa é o script que ela executa, ainda desconhecido.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Procure eventos cuja velocidade ou volume nenhuma pessoa produziria.',
          'Pergunte, em cada linha, se ela aproxima ou afasta a possibilidade de restaurar.',
          'Um dos itens é apenas suspeito e precisa de verificação antes de contar como sinal.',
        ],
        explain:
          'A cifragem deixa dois rastros: a mudança em massa nos arquivos e a remoção das formas de voltar atrás. O backup que "funciona" durante o ataque é o detalhe mais perigoso, porque destrói a última cópia boa sem que ninguém perceba.',
      },
      {
        id: 'plano-de-resposta',
        kind: 'decide',
        title: 'O plano das primeiras horas',
        prompt: 'São 7h00. O serviço está parado, há uma cópia em mídia desconectada e a investigação ainda não começou. Qual plano o tribunal deve adotar?',
        options: [
          {
            text: 'Interromper as rotinas de backup para não sobrescrever a cópia boa, isolar a rede atingida, preservar imagens e registros das máquinas afetadas, suspender prazos por ato formal, trocar as credenciais administrativas e só então restaurar a partir da mídia desconectada em ambiente limpo.',
            quality: 'best',
            flags: ['preserva', 'isola', 'restaura'],
            feedback: 'Cobre as quatro necessidades na ordem certa: parar a destruição da cópia, cortar o acesso, guardar a evidência e restaurar sem levar o invasor junto.',
            consequence: 'A cópia mensal sobrevive, a investigação tem material e o serviço volta em ambiente novo, sem as credenciais comprometidas.',
          },
          {
            text: 'Restaurar imediatamente tudo a partir da cópia diária em disco, para encurtar a interrupção, e investigar depois com o sistema já em produção.',
            quality: 'poor',
            feedback: 'A cópia diária está no mesmo domínio administrativo e já recebeu uma gravação durante o ataque, então provavelmente contém os arquivos cifrados.',
            consequence: 'A restauração falha ou devolve dados cifrados, e o acesso do invasor continua ativo na rede restaurada.',
          },
          {
            text: 'Desligar todos os equipamentos na tomada e contratar uma consultoria antes de qualquer outra medida.',
            quality: 'partial',
            feedback: 'Desligar corta o avanço, mas apaga memória volátil e registros não gravados, e esperar a consultoria para tudo atrasa decisões que já têm dono.',
            consequence: 'O avanço para, a investigação perde dados de memória e a suspensão de prazos sai tarde, aumentando o prejuízo processual.',
          },
          {
            text: 'Isolar a rede e procurar o grupo responsável para negociar a chave, mantendo o incidente em sigilo até ter uma resposta.',
            quality: 'poor',
            feedback: 'Negociar não devolve a disponibilidade com garantia, e o sigilo impede que quem depende do serviço se organize para a interrupção.',
            consequence: 'A interrupção se prolonga sem previsão, os prazos continuam correndo e a confiança no tribunal cai mais que o necessário.',
          },
        ],
        hints: [
          'Pergunte o que, agora, ainda está piorando sozinho.',
          'Separe três objetivos distintos: parar o dano, guardar a prova e voltar a operar.',
          'A melhor resposta não escolhe entre restaurar e investigar: ela ordena as duas coisas.',
        ],
        explain:
          'Nas primeiras horas, o que decide o resultado é a ordem. Parar a rotina de backup impede a destruição da única cópia boa; isolar e trocar credenciais corta o acesso; preservar imagens mantém a investigação possível; restaurar em ambiente limpo evita voltar com o invasor dentro.',
      },
      {
        id: 'ordem-da-retomada',
        kind: 'order',
        title: 'A ordem da retomada',
        prompt: 'Coloque as quatro etapas da retomada na ordem que evita devolver o serviço com o invasor dentro.',
        items: [
          { text: 'Cortar o acesso: trocar credenciais administrativas, revogar sessões e remover as tarefas agendadas criadas no período.', why: 'Enquanto a credencial do atacante vale, qualquer sistema restaurado volta a ser atingido em poucas horas.' },
          { text: 'Preparar um ambiente limpo e restaurar a partir da mídia desconectada, conferindo a integridade dos dados restaurados.', why: 'Restaurar em máquinas possivelmente comprometidas repete o incidente; conferir integridade evita reabrir com dados corrompidos.' },
          { text: 'Validar com as áreas de negócio uma lista curta de serviços essenciais antes de reabrir ao público.', why: 'A reabertura precisa priorizar o que tem prazo e impacto externo, e isso quem decide é a área, não a tecnologia.' },
          { text: 'Reabrir o acesso externo em etapas, com monitoramento reforçado e um ponto de parada definido.', why: 'Abrir em etapas permite perceber o retorno do atacante antes de o sistema inteiro estar exposto outra vez.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Comece pelo que torna inútil a chave que o invasor já tem.',
          'A conversa com o negócio vem depois de existir algo restaurado para priorizar.',
          'A abertura ao público é sempre a última etapa, e em partes.',
        ],
        explain:
          'A retomada é uma sequência: sem corte de acesso, a restauração é temporária; sem ambiente limpo, a restauração reintroduz o problema; sem priorização do negócio, volta o que é fácil e não o que é urgente; e a abertura em etapas é o que permite voltar atrás sem nova crise.',
      },
    ],
    closing:
      'O Tribunal de Vila Aurora parou a rotina que destruía a cópia boa, cortou o acesso, preservou o material da investigação e voltou em etapas. O ponto central: num serviço essencial, a capacidade de restaurar é um controle de segurança, e precisa ser testada como tal.',
    review: {
      solution: [
        'Os sinais de cifragem são a renomeação em massa, a desativação da cópia de sombra, a conta de serviço usada de uma estação e, sobretudo, o backup que concluiu "com sucesso" gravando sobre a cópia boa.',
        'O plano correto para as primeiras horas interrompe as rotinas de backup, isola a rede, preserva imagens e registros, suspende prazos por ato formal, troca credenciais e só então restaura de mídia desconectada em ambiente limpo.',
        'A retomada segue a ordem: cortar acesso, restaurar em ambiente limpo, priorizar com o negócio e reabrir em etapas com monitoramento.',
      ],
      residual:
        'Mesmo com cópia isolada e retomada ordenada, resta o tempo de indisponibilidade, que em serviço essencial tem custo próprio, e a possibilidade de o invasor ter copiado dados antes da cifragem, o que a restauração não desfaz.',
      validation:
        'Faça um teste de restauração completa da mídia desconectada em ambiente separado, cronometrando quanto tempo leva até o primeiro serviço essencial responder, e confirme que a rotina de backup pode ser interrompida por decisão de plantão em menos de dez minutos.',
    },
  },
  sources: [
    {
      label: 'STJ, "Em razão de ataque cibernético, STJ funcionará em regime de plantão até o dia 9" (2020-11-04)',
      url: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/04112020-Em-razao-de-ataque-cibernetico--STJ-funcionara-em-regime-de-plantao-ate-o-dia-9.aspx',
      kind: 'primária',
    },
    {
      label: 'STJ, "Comunicado da Presidência do STJ" (2020-11-19)',
      url: 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/19112020-Comunicado-da-Presidencia-do-STJ.aspx',
      kind: 'primária',
    },
    {
      label: 'Agência Brasil, "STJ confirma que hacker bloqueou acesso a dados do tribunal" (2020-11-05)',
      url: 'https://agenciabrasil.ebc.com.br/justica/noticia/2020-11/stj-confirma-que-hacker-bloqueou-acesso-dados-do-tribunal',
      kind: 'secundária',
    },
    {
      label: 'Agência Brasil, "Após ataque hacker, sistemas do STJ começam a ser restabelecidos" (2020-11-08)',
      url: 'https://agenciabrasil.ebc.com.br/justica/noticia/2020-11/apos-ataque-hacker-sistemas-do-stj-comecam-ser-restabelecidos',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A09' },
    { framework: 'nist-ssdf', id: 'RV.1' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de disponibilidade, recuperação e resposta a incidente em serviço público.',
}
