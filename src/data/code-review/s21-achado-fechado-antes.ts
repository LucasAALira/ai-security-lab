import type { ReviewSample } from './types'

export const achadoFechadoAntes: ReviewSample = {
  id: 'achado-fechado-antes',
  title: 'Achado que já tinha sido fechado como falso positivo',
  subtitle: 'Treinar a revisão de um veredito anterior: o fechamento de ontem vale para o código de hoje?',
  area: 'config',
  level: 'Avançado',
  minutes: 11,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-034 · URL com token de acesso em parâmetro de consulta',
    severity: 'alta',
    line: 7,
    message: 'Endereço com parâmetros de assinatura em arquivo versionado. Achado reaberto por nova varredura do histórico.',
    confidence: 'média',
  },
  context: [
    'A varredura voltou a apontar um endereço que já havia sido fechado como falso positivo há oito meses, com a justificativa: "link de leitura do conjunto público, sem segredo".',
    'O arquivo mudou desde então: o repositório de exemplos passou a publicar também os relatórios internos de avaliação, no mesmo contêiner.',
  ],
  file: 'exemplos/README.md',
  language: 'text',
  code: [
    '# Exemplos do projeto',
    '',
    'Conjunto público do tutorial e, desde março, os relatórios de avaliação',
    'usados pela equipe (pasta `avaliacoes/`, mesmo contêiner).',
    '',
    'Baixar tudo de uma vez:',
    '  https://arquivos.equipe.example/pacote.zip?sig=9a1b44cd&se=2029-06-30T00%3A00%3A00Z&sp=rl&sr=c',
    '',
    'Histórico do achado:',
    '  - há 8 meses: fechado como falso positivo ("link de leitura do conjunto público")',
    '  - hoje: reaberto pela varredura do histórico, após mudança no conteúdo do contêiner',
  ],
  extra: {
    title: 'O que mudou no contêiner desde o fechamento anterior',
    language: 'text',
    lines: [
      'março: pasta avaliacoes/ passa a receber os relatórios internos (notas por fornecedor)',
      'abril: pasta clientes-piloto/ criada para a troca de arquivos com três clientes',
      '',
      'permissões do link: r=ler  l=listar     recurso: c=contêiner inteiro',
      'validade: 2029-06-30',
      '',
      'o link continua exatamente o mesmo de oito meses atrás',
    ],
    note: 'O link não mudou; o que está do outro lado dele, sim.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. O endereço é o mesmo, mas o contêiner que ele lista e lê passou a guardar relatórios internos e uma pasta de troca com clientes. O fechamento anterior valia para o conteúdo daquela época.',
    'Repetir o veredito anterior é o erro que a amostra treina: a justificativa de oito meses atrás descrevia um contêiner que não existe mais assim.',
    'Não falta contexto: a mudança de conteúdo está registrada, e as permissões e a validade do link estão à vista.',
  ],
  verdictHints: [
    'Compare a justificativa antiga com o conteúdo atual do contêiner.',
    'Veja o que as permissões de listar e ler alcançam hoje.',
    'Pergunte o que precisaria continuar verdadeiro para o fechamento anterior valer.',
  ],
  verdictExplain:
    'Todo fechamento de falso positivo tem uma condição implícita. Aqui ela era "o contêiner só tem o conjunto público". Quando a condição deixa de valer, o veredito cai junto, mesmo sem nenhuma linha de código mudar — e é por isso que um fechamento sem condição escrita envelhece mal.',
  signals: [
    { text: 'O conteúdo do contêiner mudou: relatórios internos e pasta de clientes entraram depois do fechamento.', feedback: 'Sim: é o fato que derruba a justificativa anterior.' },
    { text: 'As permissões incluem listar o contêiner inteiro, e não apenas baixar um arquivo.', feedback: 'Sim: listar é o que permite descobrir as pastas novas a partir do mesmo link.' },
    { text: 'A validade do link vai até 2029, bem além da mudança de conteúdo.', feedback: 'Sim: a janela longa fez o link sobreviver às mudanças que invalidaram o veredito.' },
    { text: 'O endereço é idêntico ao analisado há oito meses.', feedback: 'Não como sinal do risco: a igualdade do link é justamente o que engana; o que mudou está do outro lado.' },
    { text: 'A ferramenta reabriu o achado com confiança média.', feedback: 'Não: a confiança da ferramenta não é argumento a favor nem contra o veredito.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam a reabertura do achado.',
  signalHints: [
    'Procure o que mudou fora do arquivo.',
    'Entre as permissões, uma delas revela as pastas novas.',
    'Dois itens falam da ferramenta e da aparência do link.',
  ],
  signalExplain:
    'A reabertura se sustenta na mudança de conteúdo, na permissão de listar o contêiner e na validade longa que fez o link atravessar essa mudança. O link ser idêntico e a confiança da ferramenta não entram no argumento.',
  next: {
    prompt: 'Além de tratar este link, o que fazer para o problema não se repetir?',
    options: [
      {
        text: 'Revogar a assinatura e publicar o conjunto público em contêiner separado; e passar a registrar, em todo fechamento de falso positivo, a condição que o sustenta e o gatilho de revisão (mudança de escopo, de permissão ou de conteúdo), para que a varredura reabra o achado quando a condição mudar.',
        quality: 'best',
        flags: ['revoga', 'separa', 'condicao'],
        feedback: 'Resolve o caso e ataca a causa do erro: fechamentos sem condição escrita não sobrevivem às mudanças que os invalidam.',
        consequence: 'O link antigo morre, o conteúdo público fica isolado e os fechamentos futuros passam a carregar a própria data de validade.',
      },
      {
        text: 'Revogar a assinatura e fechar o achado de novo, com a mesma justificativa de antes.',
        quality: 'poor',
        feedback: 'Revogar é correto; repetir a justificativa antiga reintroduz o erro, porque ela descreve um contêiner que não existe mais.',
        consequence: 'O próximo link assinado é fechado pelo mesmo caminho, e a terceira reabertura chega em alguns meses.',
      },
      {
        text: 'Manter o link e remover as pastas internas do contêiner, voltando à situação de oito meses atrás.',
        quality: 'partial',
        feedback: 'Restaura a condição do fechamento anterior, mas mantém um link de leitura e listagem válido até 2029, com permissão ampla.',
        consequence: 'O conteúdo interno sai do alcance, e qualquer pasta criada por engano no futuro volta a ficar exposta pelo mesmo link.',
      },
      {
        text: 'Configurar a varredura para não reabrir achados já fechados, evitando retrabalho.',
        quality: 'poor',
        feedback: 'A reabertura foi o que salvou o caso: desligá-la transforma todo fechamento em permanente, mesmo quando a premissa cai.',
        consequence: 'Mudanças futuras de escopo deixam de gerar alerta, e os fechamentos antigos viram pontos cegos definitivos.',
      },
    ],
    hints: [
      'Pergunte por que o fechamento anterior deixou de valer.',
      'A correção do caso e a correção do processo são coisas diferentes.',
      'Uma das opções desliga justamente o que funcionou.',
    ],
    explain:
      'Além de revogar e separar o conteúdo, o aprendizado é de processo: todo falso positivo fechado precisa dizer sob qual condição ele vale e quando deve ser revisto. Sem isso, a reabertura automática vira ruído, e desligá-la vira tentação.',
  },
  closing:
    'A assinatura foi revogada, o conjunto público ganhou contêiner próprio e os fechamentos de falso positivo passaram a registrar a condição que os sustenta e o gatilho de revisão.',
  review: {
    solution: [
      'O veredito é "procede": o conteúdo do contêiner mudou depois do fechamento anterior, e o link lê e lista tudo até 2029.',
      'Os sinais são a mudança de conteúdo, a permissão de listar o contêiner e a validade longa.',
      'A conduta revoga o link, separa o conteúdo público e passa a registrar a condição de cada fechamento de falso positivo.',
    ],
    residual:
      'Fechamentos antigos, feitos sem condição escrita, continuam no sistema de varredura: eles precisam ser revisitados aos poucos, e não há como saber quais envelheceram sem olhar.',
    validation:
      'Confirme que o link antigo não lista mais o contêiner; verifique que o conjunto público está em contêiner próprio; e revise uma amostra dos falsos positivos fechados no último ano, procurando condições que já não valem.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A01' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'nist-ssdf', id: 'RV.1' },
  ],
  inspiredBy: {
    label: 'Microsoft MSRC, "Microsoft mitigated exposure of internal information in a storage account due to overly-permissive SAS token" (2023-09-18)',
    url: 'https://www.microsoft.com/en-us/msrc/blog/2023/09/microsoft-mitigated-exposure-of-internal-information-in-a-storage-account-due-to-overly-permissive-sas-token',
    note: 'No caso real, a varredura de segredos do GitHub chegou a sinalizar a URL com o token durante uma revarredura do histórico, mas o achado foi marcado incorretamente como falso positivo; entre as correções, a empresa relata ter tratado a causa desse marcação indevida e passado a sinalizar tokens com validade ou privilégios excessivos. O repositório, o contêiner e o histórico desta amostra são inventados.',
  },
  tags: ['config', 'segredos', 'procede'],
}
