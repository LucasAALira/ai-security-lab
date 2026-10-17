import type { Lesson } from './types'

/* Aulas da área Segurança Web. Texto próprio; exemplos inertes e com dados sintéticos. */

export const webLessons: Record<string, Lesson> = {
  'web-http': {
    context: 'Uma loja recebe uma reclamação: um cliente comprou um produto pelo preço errado. O registro mostra uma requisição normal, vinda do navegador, com um campo de preço que ninguém esperava que fosse alterado.',
    concept: [
      'Toda conversa na web é uma **requisição** (método, caminho, cabeçalhos e corpo) e uma **resposta** (código, cabeçalhos e corpo). O navegador monta a requisição, mas quem a controla é a pessoa que está no navegador: ela pode alterar qualquer campo com as ferramentas do próprio navegador ou com um proxy.',
      'Por isso, o servidor precisa separar o que o cliente **pede** do que o servidor **decide**. O cliente escolhe o produto e a quantidade; o preço, o desconto e a permissão para comprar são decisões do servidor, tomadas com dados que ele já tem.',
    ],
    example: {
      title: 'Uma requisição de compra (sintética)',
      language: 'http',
      code: ['POST /carrinho/finalizar HTTP/1.1', 'Host: loja.example', 'Cookie: sessao=<cookie>', 'Content-Type: application/json', '', '{ "produto": 5521, "quantidade": 1, "preco": 0.01 }'],
      caption: 'O campo `preco` foi enviado pelo cliente. O servidor deve ignorá-lo e buscar o preço no catálogo.',
    },
    validation: 'Repita uma requisição real com um proxy, alterando cada campo (preço, quantidade, identificadores). Para cada um, confirme que o servidor recusa ou recalcula, e nunca usa o valor enviado para decidir dinheiro ou permissão.',
    review: [
      { front: 'Quem controla uma requisição HTTP enviada pelo navegador?', back: 'A pessoa que usa o navegador. Qualquer campo pode ser alterado antes de chegar ao servidor.' },
      { front: 'O que o servidor deve decidir, mesmo que o cliente envie o valor?', back: 'Preço, desconto, total, permissões e tudo o que tem efeito de segurança ou financeiro.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'web-origem': {
    context: 'Uma equipe quer que o painel, em outro subdomínio, leia dados da API usando o cookie do cliente. Alguém propõe "liberar todas as origens" para resolver o erro do navegador.',
    concept: [
      'Uma **origem** é a combinação de esquema, host e porta (por exemplo, `https://loja.example:443`). A **política de mesma origem** impede que uma página leia respostas de outra origem. Ela não impede que a página **envie** requisições, só que **leia** o resultado.',
      'O CORS é a forma de o servidor dizer ao navegador quais outras origens podem ler as respostas. Configurar o CORS para aceitar qualquer origem com credenciais desfaz a proteção: qualquer site passa a ler dados com a sessão do cliente.',
    ],
    example: {
      title: 'Cabeçalhos de uma resposta com CORS',
      language: 'http',
      code: ['Origin: https://painel.loja.example', '', 'HTTP/1.1 200', 'Access-Control-Allow-Origin: https://painel.loja.example', 'Access-Control-Allow-Credentials: true', 'Vary: Origin'],
      caption: 'A origem permitida é comparada com uma lista exata, e não refletida a partir do pedido.',
    },
    validation: 'Envie uma requisição com `Origin: https://outro.example` e credenciais: a resposta não deve incluir essa origem em `Access-Control-Allow-Origin`. Repita com a origem do painel: deve ser aceita.',
    review: [
      { front: 'O que a política de mesma origem bloqueia?', back: 'A leitura, por uma página, das respostas de outra origem. O envio de requisições continua possível.' },
      { front: 'Por que refletir qualquer origem com credenciais é perigoso?', back: 'Porque qualquer site passa a ler respostas autenticadas com o cookie do cliente.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-942' }],
  },
  'web-cookies-sessao': {
    context: 'Um aplicativo web guarda o token de sessão no armazenamento local do navegador porque "é mais fácil de ler no JavaScript". Uma falha de XSS em uma página de avaliações passa a ser muito mais grave.',
    concept: [
      'A **sessão** é o vínculo entre o navegador e a identidade da pessoa no servidor. Ela costuma ser representada por um cookie. O **armazenamento do navegador** (localStorage, sessionStorage) é legível por qualquer script da página, inclusive um script injetado.',
      'Um cookie de sessão com `HttpOnly` não pode ser lido por scripts, com `Secure` só viaja por HTTPS, e com `SameSite` deixa de ser enviado em boa parte das requisições iniciadas por outros sites. Para dados de sessão, o cookie bem configurado é o lugar certo; o armazenamento do navegador serve para preferências.',
    ],
    example: {
      title: 'Cookie de sessão configurado',
      language: 'http',
      code: ['Set-Cookie: sessao=<valor aleatório>; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=1800'],
      caption: 'Sem `HttpOnly`, um XSS lê o cookie; sem `Secure`, ele pode trafegar sem criptografia.',
    },
    validation: 'No console do navegador, tente ler `document.cookie`: o cookie de sessão não deve aparecer. Confira os atributos na aba de rede e que não há token de sessão no armazenamento local.',
    review: [
      { front: 'Por que não guardar o token de sessão no localStorage?', back: 'Qualquer script da página pode lê-lo, inclusive um injetado por XSS.' },
      { front: 'O que fazem HttpOnly, Secure e SameSite?', back: 'HttpOnly bloqueia leitura por scripts, Secure exige HTTPS e SameSite limita o envio em requisições de outros sites.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A07' }],
  },
  'web-fronteiras': {
    context: 'Uma tela esconde o botão "Excluir" para quem não é administrador. Um usuário comum descobre a rota pelo código da página e a chama diretamente.',
    concept: [
      'O frontend roda no aparelho da pessoa: tudo o que ele envia, esconde ou valida pode ser contornado. A {{fronteira-de-confianca|fronteira de confiança}} fica entre o navegador e o servidor, e é no servidor que as decisões precisam acontecer.',
      'Validar no frontend melhora a experiência (avisa antes de enviar), mas não protege nada. Esconder um botão não é autorização. O servidor revalida formato, tamanho, permissão e regra de negócio de cada requisição.',
    ],
    validation: 'Para cada ação escondida ou bloqueada na interface, chame a rota diretamente com um usuário sem permissão: o servidor deve recusar. Envie valores fora das regras que o formulário impede: o servidor deve recusar também.',
    review: [
      { front: 'Esconder um botão para quem não tem permissão protege a ação?', back: 'Não. A rota continua existindo e pode ser chamada diretamente; a permissão precisa ser checada no servidor.' },
      { front: 'Para que serve a validação no frontend?', back: 'Para a experiência da pessoa. A segurança depende da validação no servidor.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-602' }, { framework: 'owasp-top10', id: 'A01' }],
  },
  'web-mfa': {
    context: 'Uma empresa ativou um segundo fator por notificação no celular. Mesmo assim, uma conta foi tomada: o atacante tinha a senha e disparou dezenas de notificações até a pessoa aprovar uma por cansaço.',
    concept: [
      'A **autenticação multifator** combina fatores diferentes: algo que você sabe (senha), algo que você tem (aparelho, chave física) e algo que você é (biometria, liberando um segredo local). Ela reduz muito o efeito de uma senha vazada.',
      'A MFA falha quando: a pessoa aprova notificações por cansaço; existe um fluxo alternativo sem MFA (recuperação de conta, API antiga, outro canal); ou o fator pode ser interceptado. Fatores resistentes a phishing, limites de notificações e a mesma exigência em todos os caminhos fecham essas brechas.',
    ],
    validation: 'Liste todos os caminhos que levam a uma sessão (login, recuperação, aplicativo, API, suporte) e confirme que cada um exige o fator. Teste o limite de notificações seguidas e confirme que a pessoa vê de onde vem o pedido.',
    review: [
      { front: 'O que é fadiga de MFA?', back: 'Quando a pessoa aprova uma notificação indevida porque recebeu muitas seguidas.' },
      { front: 'Por que a recuperação de conta importa para a MFA?', back: 'Se ela não exige o fator, vira o caminho para contorná-lo.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A07' }],
  },
  'web-sessao-cookies': {
    context: 'Depois de trocar a senha, uma pessoa descobre que a sessão aberta em um computador público continuava ativa e foi usada por outra pessoa.',
    concept: [
      'Gerenciar a sessão é decidir quando ela começa, quanto dura, quando é renovada e quando acaba. O identificador da sessão é aleatório, novo a cada login (para evitar fixação) e invalidado no servidor ao sair.',
      'Eventos de segurança, como troca de senha, troca de e-mail ou suspeita de comprometimento, devem encerrar as outras sessões. Tempo de inatividade e duração máxima limitam o dano de uma sessão esquecida ou roubada.',
    ],
    example: {
      title: 'Política de sessão (sintética)',
      language: 'yaml',
      code: ['sessao:', '  regenerar_no_login: true', '  inatividade_maxima: 30m', '  duracao_maxima: 12h', '  encerrar_outras_ao_trocar_senha: true', '  invalidar_no_servidor_ao_sair: true'],
      caption: 'Cada linha corresponde a um teste que pode ser automatizado.',
    },
    validation: 'Faça login, copie o identificador, saia e tente reutilizá-lo: deve ser recusado. Troque a senha em um navegador e confirme que a sessão de outro navegador deixa de valer. Confirme que o identificador muda a cada login.',
    review: [
      { front: 'Por que regenerar o identificador de sessão no login?', back: 'Para evitar fixação de sessão, em que um identificador conhecido pelo atacante passa a valer depois do login da vítima.' },
      { front: 'Que eventos devem encerrar as outras sessões?', back: 'Troca de senha, troca de e-mail ou contato e suspeita de comprometimento.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A07' }],
  },
  'web-authn-authz': {
    context: 'A rota de detalhes de um pedido exige login. Um cliente logado troca o número do pedido na URL e vê o pedido de outra pessoa.',
    concept: [
      '**Autenticação** responde "quem é você?". **Autorização** responde "você pode fazer isto, neste objeto?". Uma rota que só exige login resolve a primeira pergunta e ignora a segunda.',
      'A autorização é decidida no servidor, a cada requisição, a partir da identidade da sessão e do objeto pedido. Identificadores difíceis de adivinhar dificultam a exploração, mas não substituem a verificação.',
    ],
    example: {
      title: 'Antes e depois (pseudocódigo)',
      language: 'text',
      code: ['# antes', 'pedido = buscar_pedido(id)', '', '# depois', 'pedido = buscar_pedido(id, dono = usuario_da_sessao)', 'se não encontrado: responder 404'],
      caption: 'A consulta já filtra pelo dono, e a resposta não diz se o pedido existe para outra pessoa.',
    },
    validation: 'Com duas contas de teste, tente ler, alterar e excluir o objeto da outra em cada rota que recebe um identificador. Todas as tentativas devem falhar.',
    review: [
      { front: 'Estar logado garante acesso a um objeto?', back: 'Não. É preciso verificar se aquela identidade tem direito àquele objeto.' },
      { front: 'Identificadores aleatórios corrigem falhas de autorização?', back: 'Não. Dificultam adivinhar, mas um identificador vazado continua dando acesso sem a verificação.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'cwe', id: 'CWE-862' }],
  },
  'web-escalacao': {
    context: 'O painel administrativo de uma loja tem um menu que só aparece para administradores. A rota que muda o papel de uma conta, porém, aceita qualquer usuário logado.',
    concept: [
      '**Escalação vertical** acontece quando alguém consegue executar uma função reservada a um papel mais alto, como administrador. Costuma surgir em rotas administrativas que exigem só login, ou em parâmetros como `papel` aceitos no cadastro.',
      'Cada função administrativa exige o papel correspondente no servidor. Campos que definem papel ou permissão nunca são aceitos de quem não pode alterá-los, e mudanças de papel deixam registro.',
    ],
    validation: 'Com uma conta comum, chame cada rota administrativa diretamente: todas devem responder 403. Tente enviar `papel` ou `admin` em cadastros e atualizações de perfil: o campo deve ser ignorado ou recusado.',
    review: [
      { front: 'O que é escalação vertical de privilégios?', back: 'Executar funções de um papel mais alto do que o seu, como as de administrador.' },
      { front: 'Onde a exigência do papel deve estar?', back: 'No servidor, em cada rota e método da função, e não no menu da interface.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'owasp-api-top10', id: 'API5' }],
  },
  'web-rbac-abac-tenant': {
    context: 'Uma plataforma usada por várias escolas permite que um coordenador veja as notas "de todos os alunos". Ele vê também os alunos de outra escola.',
    concept: [
      '**RBAC** decide por papel (coordenador, professor). **ABAC** decide por atributos (escola do usuário, escola do aluno, horário). Em sistemas com vários clientes, o papel sozinho não basta: o {{tenant|tenant}} também é um atributo obrigatório da decisão.',
      'O isolamento entre tenants vale para tudo: consultas, buscas, caches, arquivos, filas e registros. O tenant vem da sessão, nunca de um parâmetro que o cliente envia.',
    ],
    example: {
      title: 'Regra combinando papel e tenant (pseudocódigo)',
      language: 'text',
      code: ['pode_ver_nota(usuario, aluno) =', '  usuario.papel em [coordenador, professor]', '  e usuario.escola == aluno.escola', '  e (usuario.papel == coordenador ou aluno.turma em usuario.turmas)'],
      caption: 'O papel define o que se pode fazer; o tenant e a turma definem sobre quem.',
    },
    validation: 'Crie dois tenants de teste com papéis iguais e confirme, rota a rota, que nenhum dado de um aparece para o outro, inclusive em buscas, exportações e caches.',
    review: [
      { front: 'Por que o papel sozinho não basta em um sistema multi-tenant?', back: 'Porque um coordenador de um cliente não pode ver dados de outro, mesmo com o mesmo papel.' },
      { front: 'De onde deve vir o tenant em uma requisição?', back: 'Da sessão autenticada, e não de um parâmetro enviado pelo cliente.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }],
  },
  'web-permissao-servidor': {
    context: 'Uma aplicação tem regras de acesso espalhadas por dezenas de rotas. Uma rota nova de exportação nasceu sem nenhuma verificação.',
    concept: [
      'Quando cada rota decide sozinha, uma rota esquecida fica aberta. Uma camada central de autorização, chamada por todas as rotas, **nega por padrão** e só permite o que uma regra explícita permite.',
      'Uma matriz de permissões (papéis, ações e objetos) torna a regra revisável, e testes que tentam o acesso indevido em cada rota impedem regressões.',
    ],
    validation: 'Crie uma rota de teste sem regra e confirme que ela nega. Rode, na pipeline, testes com dois usuários e com cada papel para cada rota sensível.',
    review: [
      { front: 'O que significa "negar por padrão"?', back: 'Uma ação só é permitida se uma regra explícita a permitir; o esquecimento vira recusa, e não brecha.' },
      { front: 'Como impedir que a falha volte em rotas novas?', back: 'Com a camada central de autorização e testes de acesso indevido executados a cada mudança.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'cwe', id: 'CWE-862' }],
  },
  'web-top10': {
    context: 'Um gestor pede um "certificado OWASP Top 10" para o sistema antes de um contrato.',
    concept: [
      'O OWASP Top 10 é uma lista de **categorias de risco** mais relevantes em aplicações web, revista periodicamente. A edição usada aqui é a de 2025. Ela ajuda a priorizar e a conversar sobre risco, mas não é checklist completo nem certificação.',
      'Para verificar uma aplicação, use padrões de verificação (como o ASVS) e guias de teste (como o WSTG). O Top 10 indica onde olhar primeiro; não diz que o que não está nele é seguro.',
    ],
    validation: 'Pegue os achados da última revisão e classifique cada um em uma categoria do Top 10:2025, informando a edição. Confira se há achados que não cabem em nenhuma: eles continuam importantes.',
    review: [
      { front: 'O OWASP Top 10 é um checklist de segurança?', back: 'Não. É uma lista de categorias de risco para priorizar; a verificação usa padrões como o ASVS.' },
      { front: 'Por que informar a edição ao citar uma categoria?', back: 'Porque nomes e posições mudam entre edições; misturar edições gera confusão.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'owasp-top10', id: 'A06' }],
    links: [{ label: 'OWASP Top 10:2025', url: 'https://owasp.org/Top10/2025/' }],
  },
  'web-asvs': {
    context: 'Uma história de usuário diz apenas: "o login deve ser seguro". Ninguém consegue dizer quando ela está pronta.',
    concept: [
      'O **ASVS** (Application Security Verification Standard) é um padrão de **requisitos verificáveis**, organizado por áreas e por níveis de rigor. Ele transforma "seguro" em critérios que podem ser testados.',
      'Use o ASVS para escolher os requisitos que se aplicam ao sistema e escrevê-los como critérios de aceite, cada um com um teste. Não é preciso adotar tudo: escolha o nível conforme o risco.',
    ],
    validation: 'Para uma funcionalidade, liste os requisitos do ASVS escolhidos e, para cada um, o teste que o comprova. Uma história só está pronta quando todos os testes passam.',
    review: [
      { front: 'Qual a diferença entre o Top 10 e o ASVS?', back: 'O Top 10 lista riscos para priorizar; o ASVS traz requisitos verificáveis para usar como critério de aceite.' },
      { front: 'Como transformar "o login deve ser seguro" em algo testável?', back: 'Escolhendo requisitos do ASVS e escrevendo um teste para cada um.' },
    ],
    links: [{ label: 'OWASP ASVS', url: 'https://owasp.org/www-project-application-security-verification-standard/' }],
  },
  'web-wstg': {
    context: 'Antes de lançar a recuperação de senha, a equipe quer um plano de testes, e não uma varredura automática genérica.',
    concept: [
      'O **WSTG** (Web Security Testing Guide) é um guia de **procedimentos de teste**, organizado por tema: identidade, autenticação, autorização, sessão, validação de entrada, regras de negócio e outros.',
      'Para planejar, escolha os cenários do guia que se aplicam à funcionalidade, adapte-os aos dados de teste e registre o resultado de cada um. O guia descreve como testar; quem decide o que é aceitável é o requisito.',
    ],
    validation: 'Monte uma tabela com os cenários escolhidos, o passo a passo, o resultado esperado e o observado. Repita os cenários que falharam depois da correção.',
    review: [
      { front: 'Para que serve o WSTG?', back: 'Para planejar e executar testes de segurança com procedimentos por tema.' },
      { front: 'O que liga o teste ao que é aceitável?', back: 'O requisito (por exemplo, do ASVS); o guia diz como testar.' },
    ],
    links: [{ label: 'OWASP WSTG', url: 'https://owasp.org/www-project-web-security-testing-guide/' }],
  },
  'web-revisao-projeto': {
    context: 'Uma funcionalidade de "convidar colegas" está pronta para revisão: formulário, rota, e-mail com link e aceite do convite.',
    concept: [
      'Uma revisão de ponta a ponta percorre o fluxo inteiro: o que o cliente envia, o que o servidor decide, que objetos são criados, quem pode agir sobre eles, o que é registrado e o que sai para terceiros (e-mail, fila, armazenamento).',
      'Cada apontamento precisa de evidência (linha, requisição, configuração), impacto, correção proposta e como verificar. Apontamentos sem evidência ou sem correção viram ruído.',
    ],
    validation: 'Para cada apontamento, confira que há evidência, impacto, correção e teste. Depois da correção, repita o teste e registre o resultado.',
    review: [
      { front: 'O que um apontamento de revisão precisa ter?', back: 'Evidência, impacto, correção proposta e como verificar.' },
      { front: 'O que percorrer em uma revisão de ponta a ponta?', back: 'Entradas, decisões do servidor, objetos criados, autorização, registros e saídas para terceiros.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
}
