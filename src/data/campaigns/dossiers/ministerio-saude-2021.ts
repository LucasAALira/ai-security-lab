import type { DossierContent } from '../types'

/* Dossiê: ataque aos sistemas do Ministério da Saúde e ao ConecteSUS (Brasil, 2021). Fatos com fonte numerada. */

export const ministerioSaude2021: DossierContent = {
  id: 'ministerio-saude-2021',
  title: 'ConecteSUS (Brasil, 2021): o certificado de vacinação que ficou treze dias fora do ar',
  subtitle: 'Um ataque aos sistemas do Ministério da Saúde derrubou o aplicativo do ConecteSUS e sistemas de notificação e de imunização em plena campanha de vacinação.',
  incidentDate: '2021-12-10',
  publishedDate: '2021-12-10 (nota oficial do ministério e cobertura no mesmo dia)',
  reviewed: '2026-10-19',
  summary: [
    'Em **10 de dezembro de 2021**, o site do Ministério da Saúde, o **ConecteSUS**, o **e-SUS Notifica** e o sistema do Programa Nacional de Imunizações (**SI-PNI**) ficaram indisponíveis após um ataque cibernético. O ministério publicou nota oficial no mesmo dia. [1][3]',
    'Uma mensagem deixada no site reivindicava o ataque em nome do grupo autodenominado **"Lapsus$ Group"** e dizia "Nos contatem caso queiram o retorno dos dados". [3]',
    'A alegação de que os dados teriam sido copiados e excluídos **não foi confirmada** pelo ministério na ocasião. O Gabinete de Segurança Institucional e a Polícia Federal foram acionados. [3]',
    'O aplicativo do ConecteSUS só foi restabelecido em **23 de dezembro de 2021**, cerca de **13 dias** depois do ataque; a emissão de certificados seguiu instável por causa do volume de acessos. [4]',
    'Em **janeiro de 2022**, o ministério anunciou o restabelecimento total dos sistemas afetados. [2]',
    'Em **16 de agosto de 2022**, a Polícia Federal deflagrou a Operação Dark Cloud e cumpriu mandados de busca em quatro estados; segundo a corporação, os ataques atingiram diversos sites do governo, principalmente sistemas do Ministério da Saúde. [5]',
  ],
  timeline: [
    { when: '2021-12-10', what: 'Site do ministério, ConecteSUS, e-SUS Notifica e SI-PNI ficam fora do ar; mensagem atribui o ataque ao grupo Lapsus$ e menciona o "retorno dos dados".', source: 3 },
    { when: '2021-12-10', what: 'O ministério publica nota oficial sobre o ataque; o GSI e a Polícia Federal são acionados.', source: 1 },
    { when: '2021-12-23', what: 'O aplicativo do ConecteSUS volta a funcionar, ainda com instabilidade na emissão de certificados.', source: 4 },
    { when: '2022-01', what: 'O ministério anuncia o restabelecimento total dos sistemas afetados.', source: 2 },
    { when: '2022-08-16', what: 'A Polícia Federal deflagra a Operação Dark Cloud, com buscas em Minas Gerais, Paraíba, Paraná e Santa Catarina.', source: 5 },
  ],
  component: {
    name: 'Plataforma de saúde digital do Ministério da Saúde: ConecteSUS, e-SUS Notifica e SI-PNI',
    trust:
      'O cidadão confia que o comprovante de vacinação estará disponível quando for exigido, e o gestor confia que a notificação de casos chegará para alimentar o boletim. Essa confiança recai sobre um único conjunto de serviços centralizados, usado ao mesmo tempo por pessoas, municípios e estados.',
  },
  impact: [
    'Quatro serviços públicos de saúde ficaram indisponíveis ao mesmo tempo, incluindo o acesso ao comprovante de vacinação. [3]',
    'Treze dias até o aplicativo voltar, e instabilidade na emissão de certificados mesmo depois do retorno. [4]',
    'O restabelecimento total dos sistemas só foi anunciado no mês seguinte. [2][5]',
    'Estados e municípios ficaram sem a base federal para consolidar dados de vacinação e de notificação durante o período. [3]',
  ],
  uncertainties: [
    'Não há confirmação, nas fontes consultadas, de que dados tenham sido copiados ou excluídos: a alegação partiu de quem reivindicou o ataque. [3]',
    'As fontes consultadas não descrevem o caminho técnico de entrada nem a vulnerabilidade explorada.',
    'Não consta o número de pessoas afetadas na emissão de certificados, nem o volume de notificações atrasadas.',
    'A nota oficial do ministério e o anúncio de restabelecimento total não puderam ser lidos na íntegra nesta revisão; as datas e os títulos sustentam o que está citado. [1][2]',
  ],
  analysis: [
    'A falha visível é de disponibilidade, e o dano se espalhou porque vários serviços dependiam do mesmo ambiente: derrubar um alcançou quatro.',
    'A mensagem que reivindica o ataque e fala em "retorno dos dados" cria incerteza deliberada. Sem registro suficiente, a instituição não consegue nem confirmar nem negar a cópia, e a dúvida vira parte do dano.',
    'Em serviço de uso diário e obrigatório, o tempo de recuperação tem efeito prático imediato: treze dias sem comprovante alcança viagem, trabalho e atendimento.',
    'A existência de um caminho alternativo, mesmo manual, é o que diferencia uma interrupção incômoda de uma interrupção que impede o direito.',
  ],
  lessons: [
    'Garanta um caminho alternativo para o serviço essencial, mesmo degradado: comprovante em outro canal, fila de notificação que acumula localmente e reenvia depois.',
    'Isole os ambientes por serviço, para que a queda de um não leve os outros embora.',
    'Mantenha registros suficientes para responder "houve cópia de dados?" com evidência, e não com suposição.',
    'Combine antes o fluxo de comunicação com estados e municípios, que precisam operar durante a interrupção.',
    'Publique a cronologia e o estado de cada sistema em página fora da infraestrutura afetada, atualizada enquanto durar o incidente.',
  ],
  exercise: {
    title: 'Simulação: a carteira digital de Vila Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Secretaria de Saúde de Vila Aurora** é um órgão inventado que mantém a carteira digital de vacinação, o registro de notificações e o painel público no mesmo ambiente. Nomes, números e horários são inventados.',
      'Às 2h40 de uma sexta-feira, os três serviços param. Uma página alterada diz que os dados foram copiados e oferece contato. Às 8h, 40 mil pessoas tentam emitir o comprovante e as unidades de saúde não conseguem registrar notificações.',
    ],
    objective: 'Decidir o que restabelecer primeiro em um serviço essencial, reconhecer o que a evidência permite afirmar sobre cópia de dados e organizar a degradação do serviço durante a interrupção.',
    criteria: [
      'Você prioriza o restabelecimento pelo impacto no direito do cidadão, e não pela facilidade técnica.',
      'Você distingue o que a evidência sustenta sobre cópia de dados da alegação de quem atacou.',
      'Você define um caminho alternativo que mantém o serviço mínimo funcionando.',
    ],
    evidence: [
      {
        id: 'servicos',
        title: 'Serviços afetados e dependências (fictício)',
        kind: 'table',
        from: 0,
        head: ['Serviço', 'Quem depende', 'Caminho alternativo existente', 'Tempo estimado para restaurar'],
        rows: [
          ['Carteira digital de vacinação', 'cidadãos, escolas, empregadores', 'nenhum', '3 dias'],
          ['Registro de notificações', '58 unidades de saúde', 'planilha local, sem envio', '1 dia'],
          ['Painel público de indicadores', 'imprensa e pesquisadores', 'última versão publicada em arquivo', '5 dias'],
          ['Emissão de segunda via em papel', 'cidadãos sem celular', 'atendimento presencial, 4 postos', 'disponível'],
        ],
        note: 'Compare quem depende de cada serviço com o caminho alternativo que existe hoje.',
      },
      {
        id: 'registros',
        title: 'O que os registros mostram (fictício)',
        kind: 'code',
        from: 1,
        language: 'text',
        lines: [
          '[02:38] autenticação bem-sucedida da conta adm-plataforma a partir de 203.0.113.19 (fora do horário e da faixa habitual)',
          '[02:41] serviço de aplicação reiniciado com arquivo de página inicial modificado',
          '[02:44] três bancos de dados ficam sem resposta; o processo de exportação não aparece nos registros',
          '[02:50] registro de consultas ao banco: retenção configurada em 24 horas',
          '[03:10] cópia de segurança noturna conclui antes do reinício; integridade verificada às 03:30',
          '[08:00] 11.900 tentativas de emissão de comprovante retornando erro',
        ],
        note: 'Repare no que existe e no que falta: a ausência de um registro não é prova de que nada aconteceu.',
      },
    ],
    activities: [
      {
        id: 'o-que-se-sabe',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que a evidência sustenta',
        prompt: 'Marque **todas** as afirmações que os registros sustentam neste momento.',
        options: [
          { text: 'Uma conta administrativa foi usada fora do horário e de uma faixa de rede incomum.', feedback: 'Sim: está no registro de autenticação e é o indício mais concreto de uso indevido de credencial.' },
          { text: 'A página inicial foi substituída por outra, com a mensagem do atacante.', feedback: 'Sim: o reinício com arquivo modificado aparece no registro e explica a página exibida.' },
          { text: 'A cópia de segurança da noite foi concluída antes do reinício e teve a integridade verificada.', feedback: 'Sim: isso torna a restauração viável e deve orientar o plano das próximas horas.' },
          { text: 'Nenhum dado foi copiado, porque não há registro de exportação.', feedback: 'Não: a retenção de consultas é de 24 horas e não há registro suficiente; ausência de registro não prova ausência de cópia.' },
          { text: 'A indisponibilidade começou por falha de hardware nos bancos de dados.', feedback: 'Não: nada indica falha física, e os bancos pararam de responder logo depois do acesso administrativo.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Leia linha por linha e pergunte o que cada uma prova.',
          'Uma das alternativas transforma falta de registro em prova de inocência.',
          'Duas afirmações vão além do que os registros mostram.',
        ],
        explain:
          'Os registros sustentam o uso indevido da conta administrativa, a troca da página e a existência de uma cópia íntegra. Sobre a cópia dos dados, a retenção curta impede conclusão: o correto é tratar como não determinado e dizer isso.',
      },
      {
        id: 'ordem-dos-servicos',
        kind: 'order',
        title: 'A ordem do restabelecimento',
        prompt: 'Com equipe limitada, ordene as quatro frentes das primeiras 24 horas pelo impacto no direito do cidadão e pela dependência entre elas.',
        items: [
          { text: 'Trocar as credenciais administrativas e cortar o acesso usado no ataque.', why: 'Qualquer serviço restabelecido antes disso volta a cair, e a conta comprometida administra todo o ambiente.' },
          { text: 'Abrir o caminho alternativo imediato: ampliar a emissão presencial de segunda via e orientar as unidades a registrar notificações em planilha local.', why: 'É o que devolve serviço mínimo no mesmo dia, sem depender da restauração dos sistemas.' },
          { text: 'Restaurar o registro de notificações, que tem o menor tempo estimado e 58 unidades dependentes.', why: 'Devolve a operação das unidades e permite que o acúmulo local seja enviado antes de virar perda de dados.' },
          { text: 'Restaurar a carteira digital e, por último, o painel público de indicadores.', why: 'A carteira afeta o cidadão diretamente, mas leva mais tempo; o painel tem alternativa publicada e pode esperar.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Pergunte o que precisa existir antes para que o resto não se perca.',
          'Serviço mínimo no mesmo dia vale mais que restauração completa em três.',
          'O painel público é o único com alternativa já publicada.',
        ],
        explain:
          'Cortar o acesso vem primeiro, porque sem isso todo o resto é temporário. Depois vem o caminho alternativo, que devolve serviço mínimo em horas. Em seguida o serviço rápido e com muitos dependentes, e por último o que tem alternativa.',
      },
      {
        id: 'comunicado',
        kind: 'decide',
        title: 'O que dizer ao público',
        prompt: 'Às 10h, a secretaria precisa publicar o primeiro comunicado. O que ele deve conter?',
        options: [
          {
            text: 'Quais serviços estão fora, onde obter a segunda via em papel hoje, a orientação às unidades para registro local, a informação de que há cópia íntegra para restauração e que a hipótese de cópia de dados está sob investigação e ainda não pode ser confirmada nem descartada, com próxima atualização em horário definido.',
            quality: 'best',
            flags: ['alternativa', 'limites', 'previsibilidade'],
            feedback: 'Resolve o problema prático de quem precisa do serviço hoje e trata a incerteza sobre os dados sem esconder nem exagerar.',
            consequence: 'A fila presencial absorve a demanda, as unidades continuam registrando e a imprensa cobre a cronologia com números do próprio órgão.',
          },
          {
            text: 'Informar apenas que há "instabilidade temporária" e que as equipes trabalham na solução, sem detalhar serviços nem alternativas.',
            quality: 'poor',
            feedback: 'Não ajuda quem precisa do comprovante hoje e, quando a duração real aparecer, a palavra "temporária" vira um problema a mais.',
            consequence: 'As unidades param de registrar, o acúmulo se perde e a secretaria passa a responder sobre a própria comunicação.',
          },
          {
            text: 'Negar que exista qualquer possibilidade de cópia de dados, para evitar pânico, e tratar o caso só como indisponibilidade.',
            quality: 'poor',
            feedback: 'Afirma o que a evidência não permite: a retenção de 24 horas não sustenta a negativa, e um desmentido posterior custa mais.',
            consequence: 'Se surgir indício de cópia, a secretaria perde credibilidade e a notificação aos titulares sai tarde.',
          },
          {
            text: 'Publicar a cronologia técnica detalhada do ataque, com os registros e as contas envolvidas, para demonstrar transparência.',
            quality: 'partial',
            feedback: 'Transparência não exige expor detalhe que atrapalha a investigação, e o comunicado deixa de responder o que o cidadão precisa agora.',
            consequence: 'A investigação fica prejudicada e o público continua sem saber onde conseguir o comprovante hoje.',
          },
        ],
        hints: [
          'Pergunte o que a pessoa que precisa do comprovante às 10h quer ler.',
          'A incerteza sobre cópia de dados precisa aparecer como incerteza.',
          'Comunicado de incidente tem hora da próxima atualização.',
        ],
        explain:
          'O primeiro comunicado de um serviço essencial é operacional: diz o que não funciona, o que fazer no lugar e quando haverá novidade. A questão dos dados entra pelo que se sabe e pelo que ainda está indeterminado.',
      },
    ],
    closing:
      'Vila Aurora cortou o acesso, abriu o caminho alternativo no mesmo dia, restaurou primeiro o serviço de que as unidades dependiam e comunicou com números e limites. O ponto central: em serviço essencial, ter um caminho degradado pronto vale mais do que restaurar rápido.',
    review: {
      solution: [
        'A evidência sustenta o uso indevido da conta administrativa, a troca da página inicial e a existência de cópia íntegra; não sustenta nem afasta a cópia de dados, por causa da retenção de 24 horas.',
        'A ordem das primeiras 24 horas é cortar o acesso, abrir o caminho alternativo, restaurar o registro de notificações e, depois, a carteira digital e o painel.',
        'O comunicado precisa dizer o que está fora, o que fazer no lugar, o estado da investigação e quando haverá nova atualização.',
      ],
      residual:
        'Mesmo com tudo isso, parte das notificações registradas em planilha pode não ser enviada, e a dúvida sobre cópia de dados permanece até que a retenção de registros seja ampliada para períodos maiores.',
      validation:
        'Teste o caminho alternativo antes do incidente: meça quantas segundas vias em papel os postos emitem por hora e confirme, em exercício, que o registro local das unidades volta para a base central sem perda quando o sistema retorna.',
    },
  },
  sources: [
    {
      label: 'Ministério da Saúde, "Nota Oficial" sobre o ataque hacker (dezembro de 2021)',
      url: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2021/dezembro/nota-oficial',
      kind: 'primária',
    },
    {
      label: 'Ministério da Saúde, "Ministério da Saúde anuncia restabelecimento total dos sistemas afetados por ataque hacker" (janeiro de 2022)',
      url: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2022/janeiro/ministerio-da-saude-anuncia-restabelecimento-total-dos-sistemas-afetados-por-ataque-hacker',
      kind: 'primária',
    },
    {
      label: 'Agência Brasil, "Sites e aplicativo do Ministério da Saúde sofrem ataque cibernético" (2021-12-10)',
      url: 'https://agenciabrasil.ebc.com.br/saude/noticia/2021-12/sites-e-aplicativo-do-ministerio-da-saude-sofrem-ataque-cibernetico',
      kind: 'secundária',
    },
    {
      label: 'Agência Brasil, "Aplicativo ConecteSUS é restabelecido, diz Ministério da Saúde" (2021-12-23)',
      url: 'https://agenciabrasil.ebc.com.br/saude/noticia/2021-12/aplicativo-conectesus-e-restabelecido-diz-ministerio-da-saude',
      kind: 'secundária',
    },
    {
      label: 'Agência Brasil, "PF faz buscas em operação sobre ataque hacker a órgãos públicos" (2022-08-16)',
      url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2022-08/pf-faz-buscas-em-operacao-sobre-ataque-hacker-orgaos-publicos',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A09' },
    { framework: 'nist-ssdf', id: 'RV.1' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de disponibilidade de serviço público, recuperação e comunicação de incidente.',
}
