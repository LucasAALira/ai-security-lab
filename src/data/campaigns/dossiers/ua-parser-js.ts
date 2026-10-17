import type { DossierContent } from '../types'

/* Dossiê: ua-parser-js (npm, 2021). Fatos com fonte numerada; análise e simulação rotuladas à parte. */

export const uaParserJs: DossierContent = {
  id: 'ua-parser-js-2021',
  title: 'ua-parser-js (npm, 2021): a conta sequestrada e o script de instalação',
  subtitle: 'Três versões de uma biblioteca com milhões de downloads semanais foram publicadas com um script que instalava programas maliciosos.',
  incidentDate: '2021-10-22',
  publishedDate: '2021-10-22 (alerta da CISA); aviso do CERT-EU em 2021-10-26',
  reviewed: '2026-10-17',
  summary: [
    'Em **2021-10-22**, três versões do pacote npm **ua-parser-js** foram publicadas com código malicioso: **0.7.29**, **0.8.0** e **1.0.0**. As versões corrigidas são **0.7.30**, **0.8.1** e **1.0.1**. [1][2][3]',
    'O autor da biblioteca, Faisal Salman, disse acreditar que alguém sequestrou a sua conta no npm e publicou as versões. O CERT-EU descreve o caso como comprometimento da conta do desenvolvedor em 22 de outubro. [2][3]',
    'As versões maliciosas incluíam um script `preinstall.js`, executado quando o pacote era instalado: ele identificava o sistema operacional e iniciava um script de shell (Linux) ou um arquivo batch (Windows). [2]',
    'Segundo o CERT-EU, os scripts baixavam um minerador de criptomoeda e, no Windows, também um trojan que roubava senhas de programas e do navegador. [2]',
    'Segundo o veículo The Record, a biblioteca costumava ter entre 6 e 7 milhões de downloads semanais, e o autor descobriu o problema e retirou as versões em poucas horas. [3]',
    'A CISA recomendou atualizar para as versões corrigidas; o CERT-EU recomendou também procurar os indicadores de comprometimento, apagar os arquivos encontrados e trocar senhas, chaves e tokens. [1][2]',
  ],
  timeline: [
    { when: '2021-10-22', what: 'Três versões maliciosas do ua-parser-js são publicadas depois do sequestro da conta do autor, segundo o CERT-EU.', source: 2 },
    { when: '2021-10-22', what: 'O problema é detectado e as versões são retiradas em poucas horas, segundo o autor, citado pela imprensa; a CISA publica o alerta.', source: 3 },
    { when: '2021-10-23', what: 'O veículo The Record publica a matéria com a declaração do autor.', source: 3 },
    { when: '2021-10-26', what: 'O CERT-EU publica o aviso de segurança 2021-057.', source: 2 },
  ],
  component: {
    name: 'Pacote npm ua-parser-js, versões 0.7.29, 0.8.0 e 1.0.0',
    trust:
      'Quem instala dependências confia que uma nova versão publicada na conta do mantenedor foi feita pelo mantenedor. A conta é, na prática, a identidade do pacote: quem a controla controla o que milhões de projetos instalam.',
  },
  impact: [
    'Três versões publicadas continham o script malicioso de instalação. [1][2]',
    'Quem instalou uma dessas versões executou o script na própria máquina, no momento da instalação, o que inclui servidores de build. [2]',
    'A biblioteca tinha entre 6 e 7 milhões de downloads semanais, segundo o The Record. [3]',
  ],
  uncertainties: [
    'O modo como a conta foi sequestrada não é confirmado: o autor diz acreditar que foi sequestrada. [3]',
    'As fontes consultadas não informam quantas máquinas executaram o script.',
    'A janela de tempo em que as versões ficaram disponíveis é descrita como "poucas horas" pelo veículo citado; não consta um horário preciso nas fontes consultadas. [3]',
    'A página do alerta da CISA consultada não mostra a data no texto; a data de 2021-10-22 vem do endereço da publicação e do aviso do CERT-EU. [1][2]',
  ],
  analysis: [
    'O ataque não precisou explorar uma falha de código: usou o caminho previsto de publicação. A identidade do mantenedor foi o ponto de entrada.',
    'O script de instalação (`preinstall`) executa código na máquina de quem instala, antes de qualquer teste ou revisão. Em um servidor de build, isso significa executar código desconhecido ao lado dos segredos do pipeline.',
    'Intervalos de versão flexíveis e atualização automática aumentam a chance de uma versão nova e maliciosa ser instalada em poucos minutos, antes de alguém notar.',
    'A resposta rápida do autor limitou o tempo de exposição; para os consumidores, o que reduz o risco é não depender dela.',
  ],
  lessons: [
    'Fixe versões com lockfile e revise as mudanças de dependências antes de aceitá-las, em vez de atualizar automaticamente.',
    'Desative ou restrinja scripts de ciclo de vida (`preinstall`, `postinstall`) onde não são necessários, em especial em máquinas com segredos.',
    'Se publica pacotes: use autenticação em dois fatores, tokens com escopo e vida curta, e publicação a partir de um pipeline com identidade verificável.',
    'Crie uma regra de espera para versões novíssimas: um intervalo curto entre a publicação e a adoção dá tempo para a comunidade perceber problemas.',
    'Tenha um procedimento para a pergunta "essa versão passou pelos meus servidores?", com inventário de dependências por build.',
  ],
  exercise: {
    title: 'Simulação: o pacote ua-leitor',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A empresa **Aurora** usa a biblioteca **ua-leitor**, que identifica o navegador a partir do cabeçalho de cada requisição. O pipeline instala as dependências com versão flexível (`^3.4.0`) e roda em um servidor de build com tokens de publicação. Todos os nomes, versões e horários são inventados.',
      'Às 10h12, o monitor de dependências avisa que três versões novas do ua-leitor apareceram em poucos minutos. O pipeline da Aurora roda três vezes por dia.',
    ],
    objective: 'Reconhecer sinais de uma publicação suspeita, decidir uma política de adoção de versões novas e identificar um script de instalação perigoso.',
    criteria: [
      'Você separa os sinais de publicação suspeita dos que são normais.',
      'Você escolhe uma política que equilibra segurança e velocidade, sem confiar em apenas um sinal.',
      'Você identifica o script de instalação que baixa e executa algo.',
    ],
    evidence: [
      {
        id: 'registro',
        title: 'Metadados do registro para ua-leitor',
        kind: 'table',
        from: 0,
        head: ['Versão', 'Publicada', 'Publicado por', 'Script de instalação', 'Dependências novas'],
        rows: [
          ['3.3.9', '2026-03-02 14:20', 'conta do mantenedor', 'nenhum', 'nenhuma'],
          ['3.4.0', '2026-05-18 09:05', 'conta do mantenedor', 'nenhum', 'nenhuma'],
          ['3.4.1', '2026-07-22 10:01', 'conta do mantenedor', 'preinstall', 'nenhuma'],
          ['3.5.0', '2026-07-22 10:04', 'conta do mantenedor', 'preinstall', 'nenhuma'],
          ['4.0.0', '2026-07-22 10:07', 'conta do mantenedor', 'preinstall', 'nenhuma'],
        ],
        note: 'Leia as colunas "Publicada" e "Script de instalação" juntas e compare com o histórico anterior.',
      },
      {
        id: 'ci',
        title: 'Trecho do log do pipeline (fictício)',
        kind: 'code',
        from: 1,
        language: 'text',
        lines: [
          '[10:13:02] npm install',
          '[10:13:04] ua-leitor@^3.4.0 resolvido para 3.5.0 (o lockfile não fixava esta dependência)',
          '[10:13:06] executando script preinstall de ua-leitor@3.5.0',
          '[10:13:07] processo filho: sh preinstall.sh',
          '[10:13:09] conexão de saída para host-de-download.example (primeira vez neste servidor)',
          '[10:13:12] build concluído',
        ],
        note: 'Observe qual versão foi resolvida e o que o script de instalação fez durante o build.',
      },
    ],
    activities: [
      {
        id: 'sinais',
        kind: 'multi',
        variant: 'inspect',
        title: 'Sinais de publicação suspeita',
        prompt: 'Marque **todos** os sinais, nas evidências, que **sustentam a suspeita** de que as versões novas não foram publicadas pelo processo normal do mantenedor.',
        options: [
          { text: 'Três versões, de séries diferentes (3.4, 3.5 e 4.0), publicadas em poucos minutos.', feedback: 'Sim: um ritmo incomum para um projeto que antes publicava a cada algumas semanas ou meses.' },
          { text: 'As três versões passam a ter um script `preinstall`, que nenhuma versão anterior tinha.', feedback: 'Sim: uma mudança brusca e sem explicação no que executa na instalação.' },
          { text: 'A versão 3.4.0 foi publicada pela conta do mantenedor.', feedback: 'Não: isso é normal e não distingue a publicação suspeita da legítima.' },
          { text: 'O log mostra uma conexão de saída para um destino nunca visto nesse servidor durante a instalação.', feedback: 'Sim: um script de instalação que contata um destino novo é um sinal direto de comportamento inesperado.' },
          { text: 'O pacote não adicionou dependências novas.', feedback: 'Não: isso é neutro e não sustenta nem afasta a suspeita.' },
        ],
        correct: [0, 1, 3],
        hints: [
          'Compare cada versão nova com o histórico anterior do projeto.',
          'Procure mudanças no que executa na instalação e no destino de rede.',
          'São três sinais; os outros dois são neutros ou normais.',
        ],
        explain: 'Nenhum sinal, sozinho, prova o sequestro. Juntos, ritmo anormal de publicação, um script de instalação que nunca existiu e uma conexão nova durante a instalação formam um quadro consistente.',
      },
      {
        id: 'politica-de-adocao',
        kind: 'decide',
        title: 'Política para versões novas',
        prompt: 'O log mostra que o pipeline resolveu `^3.4.0` para a versão `3.5.0` no servidor de build, sem que ninguém tenha revisado a mudança. Qual política a Aurora deve adotar daqui para frente?',
        options: [
          {
            text: 'Instalar sempre a partir do lockfile (`npm ci`), com versões fixas; revisar as mudanças de dependências em pedido de mudança; desativar scripts de ciclo de vida por padrão (com exceções revisadas) e esperar alguns dias antes de adotar uma versão recém-publicada.',
            quality: 'best',
            flags: ['lockfile', 'semScripts', 'espera'],
            feedback: 'Combina quatro camadas: o conteúdo é fixado, a mudança é revisada, o script não roda sem exceção e a adoção espera. Cada uma cobre uma falha das outras.',
            consequence: 'No próximo caso semelhante, o pipeline não instala a versão nova sem revisão, o script não roda e a espera dá tempo para a comunidade avisar.',
          },
          {
            text: 'Manter os intervalos flexíveis, mas rodar um scanner de vulnerabilidades antes do build.',
            quality: 'partial',
            feedback: 'O scanner ajuda com vulnerabilidades conhecidas, mas uma versão maliciosa recém-publicada normalmente ainda não está em nenhuma base.',
            consequence: 'O scanner não acusa nada, o script roda e o problema só é percebido depois.',
          },
          {
            text: 'Instalar sempre a partir do lockfile, e nada mais.',
            quality: 'good',
            flags: ['lockfile'],
            feedback: 'É uma boa base: versões fixas impedem a troca silenciosa. Falta revisar quando o lockfile mudar e restringir scripts, ou a primeira atualização aceita pode trazer o problema.',
            consequence: 'O pipeline deixa de adotar versões novas sozinho. Quando alguém atualizar o lockfile sem olhar, o script roda.',
          },
          {
            text: 'Parar de usar bibliotecas externas e escrever tudo internamente.',
            quality: 'poor',
            feedback: 'É inviável e cria um custo de manutenção e de segurança maior do que o risco que ele elimina. O problema é a forma de adotar, e não o uso de bibliotecas.',
            consequence: 'O desenvolvimento desacelera e o código interno, sem revisão externa, acumula as próprias falhas.',
          },
        ],
        hints: [
          'Pergunte: como evitar que uma versão nova entre sem alguém ver, e o que acontece se ela entrar?',
          'Uma camada só costuma deixar uma brecha; combine fixação, revisão, restrição e espera.',
          'A resposta mais completa tem quatro elementos.',
        ],
        explain: 'Nenhuma medida isolada cobre o caso: fixar versões impede a troca silenciosa, a revisão detecta mudanças estranhas, restringir scripts reduz o dano e a espera dá tempo à comunidade.',
      },
      {
        id: 'script-de-instalacao',
        kind: 'spot',
        title: 'O script de instalação',
        prompt: 'Examine o `package.json` de um pacote com um script parecido com o do caso e identifique o problema.',
        challenge: 'postinstall-baixa-script',
        explain: 'O script baixa e executa um arquivo externo durante a instalação. É o padrão visto neste caso: um script de ciclo de vida que roda código escolhido por quem controla o endereço.',
      },
    ],
    closing:
      'A Aurora reconheceu os sinais da publicação suspeita, adotou uma política de várias camadas e localizou o padrão do script de instalação perigoso. O ponto central: a conta do mantenedor é a identidade do pacote, e a sua defesa não pode depender de a conta ficar sempre intacta.',
    review: {
      solution: [
        'Os sinais que sustentam a suspeita são o ritmo incomum de publicação, o script `preinstall` que não existia e a conexão nova durante a instalação. Cada sinal sozinho é fraco; juntos, formam um quadro consistente.',
        'A política que reduz o risco combina instalação pelo lockfile, revisão de mudanças de dependências, scripts de ciclo de vida desativados por padrão e uma espera antes de adotar versões novas.',
        'O desafio de código mostra o padrão: um script de instalação que baixa e executa algo de fora.',
      ],
      residual:
        'Mesmo com essas camadas, uma versão maliciosa pode ser adotada depois do período de espera, antes de ser denunciada, ou um pacote pode executar código ao ser importado, e não na instalação. O risco residual é menor, mas existe.',
      validation:
        'Reproduza o cenário em ambiente de teste: publique uma versão com `preinstall` em um registro local e confirme que o pipeline não a instala sem revisão, que o script não executa e que o alerta chega à equipe. Meça quantas horas o pipeline leva para aceitar uma versão nova.',
    },
  },
  sources: [
    { label: 'CISA, "Malware Discovered in Popular NPM Package, ua-parser-js" (2021-10-22)', url: 'https://cisa.gov/news-events/alerts/2021/10/22/malware-discovered-popular-npm-package-ua-parser-js', kind: 'primária' },
    { label: 'CERT-EU, aviso de segurança 2021-057 (2021-10-26)', url: 'https://www.cert.europa.eu/publications/security-advisories/2021-057/', kind: 'primária' },
    { label: 'The Record, "Malware found in npm package with millions of weekly downloads" (2021-10-23)', url: 'https://therecord.media/malware-found-in-npm-package-with-millions-of-weekly-downloads/', kind: 'secundária' },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A03' },
    { framework: 'nist-ssdf', id: 'PW.4' },
    { framework: 'cwe', id: 'CWE-829' },
  ],
  tags: ['supply', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de cadeia de suprimentos de software.',
}
