import type { DossierContent } from '../types'

/* Dossiê: 3CX (2023). Fatos com fonte numerada; análise e simulação rotuladas à parte. */

export const tresCx: DossierContent = {
  id: '3cx-desktopapp-2023',
  title: '3CX (2023): um ataque à cadeia de suprimentos que começou em outro',
  subtitle: 'O aplicativo de desktop de um sistema de telefonia foi distribuído com código malicioso. A investigação apontou que a invasão da empresa partiu de um software de outro fornecedor.',
  incidentDate: '2023-03 (versões afetadas distribuídas no fim de março de 2023)',
  publishedDate: '2023-03-30 (comunicado da 3CX); análise da Mandiant em 2023-04-20',
  reviewed: '2026-10-17',
  summary: [
    'Em **2023-03-30**, a 3CX comunicou que o seu aplicativo de desktop (construído com Electron) estava afetado no **Windows** (Update 7, versões 18.12.407 e 18.12.416) e no **macOS** (18.11.1213, do Update 6, e 18.12.402, 18.12.407 e 18.12.416, do Update 7). Antivírus sinalizaram e bloquearam o executável. [1]',
    'A 3CX orientou os clientes a desinstalar o aplicativo e usar o cliente web (PWA) até a publicação de uma versão corrigida. Quem hospeda o próprio servidor foi orientado a atualizar para a versão 18.12.422 do aplicativo. A empresa contratou a Mandiant para investigar. [1]',
    'O centro nacional de cibersegurança do Reino Unido (NCSC) publicou em **2023-04-05** um alerta com as mesmas versões e recomendou seguir o aviso do fornecedor e procurar indicadores de comprometimento. [2]',
    'A Mandiant concluiu que o vetor inicial de comprometimento da rede da 3CX foi um software malicioso baixado do site da **Trading Technologies**: um instalador adulterado do programa **X_TRADER**. Segundo a Mandiant, foi a primeira vez que viu um ataque à cadeia de suprimentos de software levar a outro. [3]',
    'O X_TRADER teria sido descontinuado em 2020, mas ainda estava disponível para download em 2022, e o certificado usado para assinar o instalador adulterado expiraria em outubro de 2022. [3]',
    'A Mandiant avaliou, com **confiança moderada**, que o grupo por trás do ataque (que acompanhava como UNC4736, "suspeito de ligação com a Coreia do Norte") está relacionado a atividade norte-coreana financeiramente motivada. [3]',
  ],
  timeline: [
    { when: '2020', what: 'O X_TRADER, programa da Trading Technologies, teria sido descontinuado.', source: 3 },
    { when: '2022-10', what: 'Mês de expiração do certificado de assinatura usado no instalador adulterado do X_TRADER.', source: 3 },
    { when: '2023-03', what: 'Fim de março: versões do aplicativo de desktop da 3CX com código malicioso circulam entre os clientes.', source: 3 },
    { when: '2023-03-30', what: 'A 3CX publica o comunicado com as versões afetadas, a orientação de desinstalação e a alternativa por navegador.', source: 1 },
    { when: '2023-04-05', what: 'O NCSC do Reino Unido publica o alerta.', source: 2 },
    { when: '2023-04-20', what: 'A Mandiant publica a análise que liga o comprometimento da 3CX ao X_TRADER.', source: 3 },
  ],
  component: {
    name: 'Aplicativo de desktop da 3CX (Electron) para Windows e macOS, nas versões listadas pela empresa',
    trust:
      'Os clientes confiam que o aplicativo distribuído pelo fornecedor, assinado por ele, vem do processo normal de build. A investigação indicou que a rede da 3CX foi alcançada por meio de um software de outro fornecedor, o que mostra uma segunda relação de confiança: a do fornecedor com os programas de terceiros instalados nos ambientes dele.',
  },
  impact: [
    'As versões do aplicativo de desktop listadas pela 3CX, para Windows e macOS, continham o código malicioso. [1][2]',
    'Antivírus de vários fabricantes sinalizaram e bloquearam o executável. [1]',
    'A Mandiant nomeou várias famílias de código malicioso (por exemplo, SUDDENICON, VEILEDSIGNAL e POOLRAT) e descreveu a intrusão como iniciada por um instalador adulterado do X_TRADER. [3]',
  ],
  uncertainties: [
    'A atribuição é descrita como "suspeita", com "confiança moderada"; ela não é uma conclusão definitiva. [3]',
    'As fontes consultadas não informam o número de organizações afetadas.',
    'As fontes não informam a data exata em que as primeiras versões afetadas passaram a ser distribuídas, apenas o fim de março de 2023. [1][3]',
    'O relatório da Mandiant não informa a data da entrega do X_TRADER adulterado ao ambiente da 3CX, de modo que a ordem exata entre os dois comprometimentos não é afirmada aqui. [3]',
    'O comunicado da 3CX consultado não informa um identificador de vulnerabilidade (CVE). [1]',
  ],
  analysis: [
    'Dois fornecedores, duas relações de confiança. O cliente confia na 3CX; a 3CX, ao que a investigação indica, confiou em um programa de terceiros que continuava disponível para download depois de descontinuado.',
    'Software descontinuado que ainda pode ser baixado do site do fornecedor é uma superfície de risco: ninguém o atualiza, mas alguém ainda o instala.',
    'A rápida detecção por produtos de segurança nos clientes foi o que tornou o problema visível. Para quem distribui software, vale ter um canal de comunicação pronto e um plano para orientar a remoção.',
    'Neste caso, a assinatura do código não garantiu a integridade do processo: a pergunta útil é de onde vem cada coisa que entra no ambiente que produz e assina o software.',
  ],
  lessons: [
    'Mantenha um inventário do software instalado nos ambientes de desenvolvimento e de build e remova o que está descontinuado ou sem dono.',
    'Separe as estações de trabalho de engenharia do que assina e publica: quem desenvolve não precisa de acesso direto à chave de assinatura.',
    'Tenha um comunicado pronto para incidentes: versões afetadas exatas, o que fazer agora, uma alternativa funcional e o que ainda não se sabe.',
    'Publique atualizações em fases e acompanhe sinais (alertas de antivírus, telemetria) para interromper a distribuição.',
    'Trate a cadeia do fornecedor como parte da sua: pergunte que programas de terceiros rodam onde o seu software é construído.',
  ],
  exercise: {
    title: 'Simulação: o cliente da Aurora Voz',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A empresa **Aurora Voz** vende um sistema de telefonia e distribui um aplicativo de desktop assinado aos clientes. Todos os nomes, versões e números abaixo são inventados.',
      'Produtos de segurança de clientes começam a bloquear o executável da versão **9.4.2**. A investigação preliminar encontra, em uma estação de engenharia com acesso ao pipeline, um programa antigo de terceiros, o **CotaFácil 4.2**, descontinuado em 2020 e baixado do site do fornecedor em 2022.',
    ],
    objective: 'Mapear onde a confiança entra na cadeia, associar cada ponto ao controle adequado e decidir o que fazer com a chave de assinatura e com o comunicado aos clientes.',
    criteria: [
      'Você associa cada ponto da cadeia ao controle que reduz o risco ali.',
      'Você escolhe o conteúdo certo do comunicado, sem minimizar nem especular.',
      'Você trata a chave de assinatura como potencialmente comprometida, conforme a evidência.',
    ],
    evidence: [
      {
        id: 'estacao',
        title: 'Programas na estação de engenharia ENG-07',
        kind: 'table',
        from: 0,
        head: ['Programa', 'Origem', 'Situação do fornecedor', 'Última atualização'],
        rows: [
          ['Editor de código', 'loja oficial', 'ativo', 'recente'],
          ['Cliente do repositório', 'site do fornecedor', 'ativo', 'recente'],
          ['CotaFácil 4.2', 'site do fornecedor, baixado em 2022', 'descontinuado em 2020', 'nunca'],
          ['Ferramenta de compactação', 'gerenciador de pacotes', 'ativo', 'recente'],
        ],
        note: 'Procure o programa que ninguém mantém. De onde ele veio e o que ele pode alcançar?',
      },
      {
        id: 'cadeia',
        title: 'Da estação aos clientes',
        kind: 'diagram',
        from: 1,
        nodes: [
          { id: 'estacao', label: 'Estação ENG-07', x: 0, y: 1, kind: 'cliente', zone: 'Aurora Voz', detail: 'Estação de uma pessoa de engenharia. Tem acesso direto ao repositório e ao servidor de build.' },
          { id: 'build', label: 'Servidor de build', x: 1, y: 1, kind: 'pipeline', zone: 'Aurora Voz', detail: 'Compila o aplicativo e chama a etapa de assinatura.' },
          { id: 'assina', label: 'Assinatura do pacote', x: 2, y: 1, kind: 'identidade', zone: 'Aurora Voz', detail: 'A chave fica em um arquivo no servidor de build, acessível pelo usuário do pipeline.' },
          { id: 'canal', label: 'Canal de atualização', x: 3, y: 1, kind: 'borda', zone: 'Aurora Voz', detail: 'Publica a nova versão para todos os clientes ao mesmo tempo.' },
          { id: 'clientes', label: 'Clientes instalados', x: 4, y: 1, kind: 'cliente', zone: 'Clientes', detail: 'Milhares de instalações do aplicativo de desktop.' },
        ],
        edges: [
          { from: 'estacao', to: 'build', label: 'envia código e aciona o build' },
          { from: 'build', to: 'assina', label: 'solicita assinatura' },
          { from: 'assina', to: 'canal', label: 'pacote assinado' },
          { from: 'canal', to: 'clientes', label: 'atualização automática' },
        ],
        note: 'Em cada seta, pergunte: o que impediria uma alteração indevida de seguir adiante?',
      },
      {
        id: 'alertas',
        title: 'Alertas recebidos dos clientes (resumo)',
        kind: 'table',
        from: 2,
        head: ['Origem do alerta', 'Versão do aplicativo', 'Quantidade de clientes'],
        rows: [
          ['Antivírus de fornecedor A', '9.4.2', '37'],
          ['Antivírus de fornecedor B', '9.4.2', '12'],
          ['Telemetria da própria Aurora Voz', '9.4.1', '0 (sem sinal)'],
          ['Suporte (chamados)', '9.4.2', '8'],
        ],
        note: 'Quais versões aparecem nos alertas? Quais não aparecem?',
      },
    ],
    activities: [
      {
        id: 'controle-por-ponto',
        kind: 'assign',
        variant: 'match',
        title: 'Um controle para cada ponto da cadeia',
        prompt: 'Associe cada ponto da cadeia ao controle que **mais reduz o risco naquele ponto**.',
        choices: [
          'Inventário e remoção de software descontinuado; estações sem acesso direto à assinatura',
          'Chave de assinatura em módulo protegido, usada só pelo pipeline e com aprovação para versões novas',
          'Publicação em fases, com monitoramento de sinais e capacidade de interromper',
          'Plano de comunicação com versões afetadas, remoção e alternativa',
        ],
        rows: [
          { text: 'A estação de engenharia que ainda tem um programa descontinuado.', why: 'O risco nasce no que entra em um ambiente com acesso privilegiado. Inventariar e remover reduz a entrada, e separar o acesso reduz o alcance.' },
          { text: 'A etapa que assina o pacote.', why: 'Se a chave está acessível ao usuário do pipeline em um arquivo, qualquer um que alcance o pipeline assina. Um módulo protegido com aprovação limita isso.' },
          { text: 'O canal que entrega a atualização a todos os clientes ao mesmo tempo.', why: 'A distribuição em fases limita quantos clientes recebem uma versão ruim antes de alguém perceber e interromper.' },
          { text: 'Os clientes que já instalaram a versão afetada.', why: 'Depois da instalação, a proteção vem de comunicar com clareza o que fazer e oferecer uma alternativa.' },
        ],
        accept: [[0], [1], [2], [3]],
        hints: [
          'Pergunte: neste ponto, o risco é de entrada, de uso da chave, de alcance da distribuição ou de resposta?',
          'Cada ponto tem um controle que cabe melhor do que os outros três.',
          'O ponto das estações trata do que entra; o da assinatura, de quem usa a chave; o do canal, do alcance; o dos clientes, da resposta.',
        ],
        explain: 'Os controles se encaixam em pontos diferentes: reduzir o que entra, limitar quem usa a chave, limitar o alcance de uma distribuição e orientar quem já instalou. Um controle bom no lugar errado não ajuda.',
      },
      {
        id: 'conteudo-do-comunicado',
        kind: 'multi',
        variant: 'multi',
        title: 'O que o comunicado deve conter',
        prompt: 'A Aurora Voz vai publicar um comunicado aos clientes. Marque **todos** os itens que **devem** constar.',
        options: [
          { text: 'As versões afetadas, escritas exatamente (9.4.2 em Windows e macOS).', feedback: 'Sim: o cliente precisa saber, sem ambiguidade, se a versão dele é a afetada.' },
          { text: 'O que fazer agora: desinstalar a versão afetada e usar a alternativa por navegador até haver uma versão corrigida.', feedback: 'Sim: uma instrução concreta, com uma alternativa funcional.' },
          { text: 'Como verificar se a instalação foi afetada (sinais ou indicadores publicados).', feedback: 'Sim: permite que o cliente investigue o próprio ambiente.' },
          { text: 'O que a empresa ainda não sabe e quando atualizará o comunicado.', feedback: 'Sim: admitir o que é incerto e prometer atualização evita especulação e dá previsibilidade.' },
          { text: 'Uma afirmação de quem foi o responsável pelo ataque.', feedback: 'Não: a atribuição não é necessária para o cliente agir e, sem evidência firme, é especulação que pode ser desmentida.' },
          { text: 'Uma garantia de que a nova versão está livre de qualquer problema.', feedback: 'Não: nenhuma empresa responsável promete isso. O comunicado deve dizer o que foi feito, e não garantir o impossível.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Pense em uma pessoa administradora de TI de um cliente: o que ela precisa para agir hoje?',
          'Informação concreta e acionável entra; especulação e promessas absolutas ficam de fora.',
          'São quatro itens que ajudam a agir e dois que prometem ou especulam.',
        ],
        explain: 'Um bom comunicado é preciso sobre o que é afetado, concreto sobre o que fazer, honesto sobre o que ainda não se sabe e comedido sobre o que não se pode garantir.',
      },
      {
        id: 'chave-de-assinatura',
        kind: 'decide',
        title: 'A chave de assinatura',
        prompt: 'A evidência indica que a estação ENG-07 tinha acesso ao pipeline que usa a chave de assinatura. O que a Aurora Voz deve fazer com a chave?',
        options: [
          {
            text: 'Tratar a chave e o certificado como comprometidos: substituí-los por novos gerados em módulo protegido, reconstruir o ambiente de build a partir de uma base limpa, assinar de novo as versões que forem mantidas e revogar o certificado antigo.',
            quality: 'best',
            flags: ['trocouChave', 'reconstruiuBuild'],
            feedback: 'A estação teve acesso ao caminho da assinatura; sem prova de que a chave não foi usada ou copiada, a decisão prudente é substituí-la e reconstruir o ambiente que a usava.',
            consequence: 'Versões novas saem com uma chave nova e um ambiente limpo. O certificado antigo é revogado e os clientes são orientados a só confiar nas versões novas.',
          },
          {
            text: 'Manter a chave atual, mas restringir o acesso a ela dali em diante e acompanhar o uso.',
            quality: 'good',
            feedback: 'Restringir é um bom passo e acompanhar o uso ajuda. Mas, se a chave já foi acessada, restringir o acesso depois não desfaz a exposição.',
            consequence: 'O acesso futuro fica mais controlado. Uma eventual cópia da chave feita antes continua válida.',
          },
          {
            text: 'Manter a chave e remover apenas o programa descontinuado da estação.',
            quality: 'partial',
            feedback: 'Remover a origem provável é necessário, mas a chave e o ambiente de build continuam sem garantia de integridade.',
            consequence: 'A origem provável some, e o que já foi alcançado permanece sem verificação.',
          },
          {
            text: 'Não alterar nada até a análise completa terminar, para não atrapalhar a investigação.',
            quality: 'poor',
            feedback: 'A investigação pode prosseguir com cópias forenses; deixar uma chave potencialmente exposta em uso mantém o risco aberto para todos os clientes.',
            consequence: 'Enquanto a análise dura, novas versões continuam saindo assinadas com uma chave que talvez não seja mais confiável.',
          },
        ],
        hints: [
          'Pergunte: o que se perde se a chave estiver comprometida e você a mantiver?',
          'A investigação não precisa parar a rotação da chave: o que for preciso preservar pode ser copiado antes.',
          'A resposta mais completa troca a chave, reconstrói o ambiente e revoga o certificado.',
        ],
        explain: 'Sem prova de que a chave não foi alcançada, o custo de trocá-la é menor do que o de manter uma chave possivelmente exposta. A investigação e a troca podem andar juntas.',
      },
    ],
    closing:
      'A Aurora Voz tratou a cadeia como um conjunto de pontos de confiança, escreveu um comunicado que ajuda a agir e substituiu a chave sem esperar uma prova que talvez nunca chegue. O ponto central: o seu ambiente de build faz parte da cadeia dos seus clientes, e o que roda nele precisa ser conhecido e mantido.',
    review: {
      solution: [
        'A cadeia tem pontos de naturezas diferentes. Na estação, o problema é o que entra; na assinatura, quem usa a chave; no canal, o alcance de uma distribuição; nos clientes, a orientação para agir. Cada controle serve a um desses pontos.',
        'O comunicado deve trazer as versões exatas, o que fazer agora, como verificar, o que ainda é incerto e quando haverá nova atualização. Não deve especular sobre autoria nem prometer ausência total de problemas.',
        'Com a estação tendo acesso ao caminho de assinatura, a chave deve ser tratada como possivelmente comprometida: troca, reconstrução do ambiente e revogação do certificado antigo.',
      ],
      residual:
        'Mesmo depois da troca, clientes que não leram o comunicado continuam com a versão afetada, e outros programas de terceiros podem estar em outros ambientes. O risco residual está na velocidade de adoção do aviso e na completude do inventário.',
      validation:
        'Rode um inventário em todas as estações com acesso ao pipeline e compare com uma lista aprovada. Verifique que a chave nova só é usável pelo pipeline com aprovação, e simule uma publicação em fases, interrompida por um sinal de teste.',
    },
  },
  sources: [
    { label: '3CX, comunicado de segurança sobre o DesktopApp (atualização), 2023-03-30', url: 'https://www.3cx.com/blog/news/desktopapp-security-alert-update/', kind: 'primária' },
    { label: 'NCSC (Reino Unido), "3CX DesktopApp security issue", 2023-04-05', url: 'https://www.ncsc.gov.uk/news/3cx-desktopapp-security-issue', kind: 'primária' },
    { label: 'Mandiant, "3CX Software Supply Chain Compromise Initiated by a Prior Software Supply Chain Compromise", 2023-04-20', url: 'https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise', kind: 'primária' },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A03' },
    { framework: 'nist-ssdf', id: 'PO.5' },
    { framework: 'nist-ssdf', id: 'PS.1' },
    { framework: 'slsa', id: 'build' },
  ],
  tags: ['supply', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de cadeia de suprimentos de software.',
}
