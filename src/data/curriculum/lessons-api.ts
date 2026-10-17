import type { Lesson } from './types'

/* Aulas da área Segurança de APIs. Texto próprio; requisições e contratos sintéticos. */

export const apiLessons: Record<string, Lesson> = {
  'api-rest-graphql': {
    context: 'A equipe publicou o contrato da nova API e um parceiro perguntou: "o contrato garante que eu só vejo os meus dados?".',
    concept: [
      'Um **contrato** (OpenAPI para REST, esquema para GraphQL) descreve rotas, operações, formatos e, quando bem escrito, o esquema de autenticação e os escopos exigidos. Ele é documentação e base para testes, e não um controle por si só.',
      'O contrato promete formato, e não autorização por objeto: "só os seus dados" é uma regra que o servidor aplica a cada requisição. Em GraphQL, uma única consulta pode buscar muitos objetos relacionados, e a autorização precisa valer em cada campo e objeto resolvido.',
    ],
    example: {
      title: 'Segurança declarada no contrato (OpenAPI)',
      language: 'yaml',
      code: ['paths:', '  /faturas/{id}:', '    get:', '      security: [{ oauth: ["faturas:ler"] }]', '      responses:', '        "200": { description: fatura do cliente autenticado }', '        "404": { description: inexistente ou de outro cliente }'],
      caption: 'O contrato declara autenticação e escopo; a verificação do dono continua no servidor.',
    },
    validation: 'Compare cada rota do contrato com a implementação: as que declaram segurança devem recusar chamadas sem token. Para cada objeto, teste o acesso por outro cliente, que o contrato não tem como impedir.',
    review: [
      { front: 'Um contrato OpenAPI garante autorização por objeto?', back: 'Não. Ele descreve formato e autenticação; o servidor decide quem pode ver cada objeto.' },
      { front: 'Por que GraphQL exige atenção especial à autorização?', back: 'Porque uma consulta pode resolver muitos objetos relacionados, e cada um precisa da verificação.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API1' }],
  },
  'api-metodos-codigos': {
    context: 'A API responde `403` para faturas de outros clientes e `404` para faturas inexistentes. Um atacante usa essa diferença para descobrir quais números existem.',
    concept: [
      'Métodos HTTP têm significado: `GET` não muda estado, `PUT` e `DELETE` são idempotentes, `POST` cria ou executa. Usar `GET` para ações com efeito expõe a ação a links, prefetch e caches.',
      'Códigos de resposta também comunicam. Diferenciar "não existe" de "não é seu" revela a existência do objeto; para recursos de outra pessoa, responder igual ao inexistente evita enumeração. Mensagens de erro não mostram detalhes internos.',
    ],
    validation: 'Peça um objeto inexistente e um objeto de outro cliente: códigos, corpo e tempo devem ser equivalentes. Confirme que nenhuma rota `GET` altera estado e que erros não mostram rastros de pilha.',
    review: [
      { front: 'Por que uma ação com efeito não deve usar GET?', back: 'Porque GET é disparado por links, prefetch e caches, e se presume seguro de repetir.' },
      { front: 'Como evitar enumeração pelos códigos de resposta?', back: 'Respondendo igual para objeto inexistente e para objeto de outra pessoa.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API8' }],
  },
  'api-inventario': {
    context: 'Depois de migrar para a versão 2, ninguém lembrou que a versão 1, sem autenticação, continuava publicada no gateway.',
    concept: [
      'Um **inventário** lista cada API, versão, ambiente, dono, dados que expõe e consumidores. Sem ele, versões antigas, rotas de teste e ambientes esquecidos ficam no ar sem os controles atuais.',
      'Cada versão publicada recebe os mesmos controles da atual ou é retirada com data. Documentação e gateway são fontes do inventário, e uma varredura periódica compara o que está publicado com o que está documentado.',
    ],
    validation: 'Compare a lista de rotas publicadas no gateway com o inventário e com o contrato: toda rota publicada deve ter dono, versão e controles. Chame versões antigas sem autenticação: devem estar retiradas ou protegidas.',
    review: [
      { front: 'O que um inventário de APIs deve registrar?', back: 'API, versão, ambiente, dono, dados expostos e consumidores.' },
      { front: 'O que fazer com uma versão antiga ainda publicada?', back: 'Aplicar os mesmos controles da atual ou retirá-la com data marcada.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API9' }],
  },
  'api-jwt': {
    context: 'A API lê o token do cabeçalho, decodifica e usa o campo `papel` para decidir o acesso. Ninguém confere a assinatura.',
    concept: [
      'Um JWT tem cabeçalho, conteúdo e assinatura. **Decodificar** só lê o conteúdo; qualquer pessoa pode escrever um token com o conteúdo que quiser. **Verificar** confere a assinatura com a chave esperada e com um algoritmo fixado.',
      'Além da assinatura, a validação confere emissor, audiência, validade e, quando houver, o momento da autenticação. Tokens de longa duração e chaves fracas ampliam o dano de um vazamento.',
    ],
    example: {
      title: 'Verificação completa (TypeScript, pseudocódigo de biblioteca)',
      language: 'ts',
      code: ['const claims = await verificarJwt(token, {', '  chavesPublicas: chavesDoEmissor,', '  algoritmos: ["RS256"],', '  emissor: "https://id.loja.example",', '  audiencia: "api-faturas",', '})'],
      caption: 'Algoritmo fixado, emissor e audiência conferidos; validade checada pela biblioteca.',
    },
    validation: 'Envie tokens com assinatura inválida, com algoritmo trocado, com emissor ou audiência de outro serviço e expirados: todos devem ser recusados.',
    review: [
      { front: 'Qual a diferença entre decodificar e verificar um JWT?', back: 'Decodificar só lê o conteúdo; verificar confere a assinatura e as alegações esperadas.' },
      { front: 'Além da assinatura, o que validar?', back: 'Algoritmo, emissor, audiência e validade.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API2' }, { framework: 'cwe', id: 'CWE-347' }],
  },
  'api-bola': {
    context: 'A rota `GET /v2/faturas/{id}` confere o dono, mas `POST /v2/faturas/{id}/cancelar` não. Qualquer cliente cancela faturas alheias.',
    concept: [
      '**BOLA** (autorização quebrada em nível de objeto) é a ausência de verificação de que o objeto pertence a quem pede. Em APIs, é o risco mais comum, porque cada rota recebe identificadores e basta uma esquecer a verificação.',
      'A verificação acontece em cada rota, idealmente em um ponto central (camada de dados ou de autorização), com testes de duas contas para cada operação: ler, alterar, excluir e listar.',
    ],
    validation: 'Para cada rota com identificador, chame com o token de outro cliente: deve responder como se o objeto não existisse. Inclua listas e exportações, que também precisam filtrar pelo dono.',
    review: [
      { front: 'Por que BOLA é tão comum em APIs?', back: 'Porque toda rota recebe identificadores, e basta uma esquecer a verificação do dono.' },
      { front: 'Como evitar que uma rota nova nasça com BOLA?', back: 'Com a verificação em um ponto central e testes de duas contas para cada operação.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API1' }, { framework: 'cwe', id: 'CWE-639' }],
  },
  'api-bopla': {
    context: 'A rota `PATCH /usuarios/me` grava todo o corpo recebido. Um cliente envia `"papel": "admin"` e vira administrador. A resposta da mesma rota devolve o hash da senha.',
    concept: [
      '**BOPLA** (autorização quebrada em nível de propriedade) trata de **quais campos** cada perfil pode ler e alterar. Ela junta dois problemas: atribuição em massa (gravar campos que não deviam ser aceitos) e exposição excessiva (devolver campos que não deviam sair).',
      'A defesa é uma lista explícita de campos permitidos para escrita e para leitura, por perfil e por rota, em vez de aceitar ou devolver o objeto inteiro.',
    ],
    example: {
      title: 'Campos permitidos (TypeScript)',
      language: 'ts',
      code: ['const PODE_ALTERAR = ["nome", "telefone"] as const', 'const dados = Object.fromEntries(PODE_ALTERAR.filter((c) => c in corpo).map((c) => [c, corpo[c]]))', 'return paraPerfilPublico(await salvarUsuario(usuario.id, dados))'],
      caption: 'Só os campos da lista são gravados, e a resposta passa por um formato público.',
    },
    validation: 'Envie campos extras (papel, saldo, identificador de outro usuário) em cada rota de escrita: devem ser ignorados ou recusados. Confira se as respostas não trazem campos internos.',
    review: [
      { front: 'Quais dois problemas a BOPLA reúne?', back: 'Atribuição em massa de campos indevidos e exposição excessiva de campos na resposta.' },
      { front: 'Qual a defesa contra BOPLA?', back: 'Listas explícitas de campos permitidos para escrita e leitura, por perfil e rota.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API3' }, { framework: 'cwe', id: 'CWE-915' }],
  },
  'api-bfla': {
    context: 'Todas as rotas da API de relatórios exigem login. A rota `DELETE /relatorios/{id}`, que só gerentes deviam usar, aceita qualquer usuário logado.',
    concept: [
      '**BFLA** (autorização quebrada em nível de função) é a ausência de verificação da permissão exigida por uma **função** (rota e método). Funções administrativas e métodos menos usados são os mais esquecidos.',
      'Cada rota e método declara o papel ou escopo exigido, e o servidor aplica essa exigência de forma central. Exigir login em todas as rotas resolve a autenticação, e não a autorização da função.',
    ],
    validation: 'Para cada rota e método, chame com um usuário de cada papel: só os papéis previstos devem conseguir. Inclua métodos menos usados (`PUT`, `DELETE`, `PATCH`) e rotas administrativas.',
    review: [
      { front: 'Qual a diferença entre BOLA e BFLA?', back: 'BOLA é sobre o objeto (de quem é); BFLA é sobre a função (quem pode executar aquela operação).' },
      { front: 'Exigir login em todas as rotas resolve BFLA?', back: 'Não. Cada função precisa exigir o papel ou o escopo correspondente.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API5' }, { framework: 'cwe', id: 'CWE-862' }],
  },
  'api-escopos': {
    context: 'Um parceiro de entregas recebeu um token com escopo `*` "para não dar erro". Ele só precisava consultar o status de remessas.',
    concept: [
      '**Escopos** limitam o que um token permite (por exemplo, `remessas:ler`). Clientes e serviços recebem só os escopos de que precisam, e a API confere o escopo exigido em cada operação.',
      'Identidades de serviço têm o mesmo cuidado: uma por serviço, com permissões mínimas e credenciais curtas. Um token com escopo curinga transforma qualquer vazamento em acesso total.',
    ],
    validation: 'Use um token com só `remessas:ler` para chamar operações de escrita e de outras áreas: devem ser recusadas. Confira se não há tokens com escopo curinga em uso e se cada serviço tem identidade própria.',
    review: [
      { front: 'Por que evitar o escopo curinga?', back: 'Porque transforma o vazamento de um token em acesso a tudo.' },
      { front: 'Onde o escopo é conferido?', back: 'Na API, para cada operação, contra o escopo exigido por ela.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API5' }, { framework: 'cwe', id: 'CWE-250' }],
  },
  'api-limites': {
    context: 'Um parceiro passou a pedir `?limite=1000000` na rota de produtos, e o banco ficou lento para todos.',
    concept: [
      'Limites protegem disponibilidade e custo: tamanho máximo de página, quantidade de requisições por identidade e janela de tempo, tamanho de entrada e tempo de execução. O valor que o cliente envia é uma sugestão; o teto é do servidor.',
      'Limites por identidade (token, cliente, conta) são mais justos e eficazes do que um limite geral. Respostas `429` com informação de quando tentar de novo ajudam clientes legítimos a se adaptar.',
    ],
    example: {
      title: 'Teto de paginação no servidor (TypeScript)',
      language: 'ts',
      code: ['const MAX = 100', 'const limite = Math.min(Math.max(Number(req.query.limite) || 20, 1), MAX)'],
      caption: 'O cliente pode pedir menos, nunca mais do que o teto.',
    },
    validation: 'Peça páginas acima do teto e valores inválidos: o servidor deve limitar. Dispare requisições acima do limite por identidade: deve responder `429` sem afetar outras identidades.',
    review: [
      { front: 'Quem define o tamanho máximo de página?', back: 'O servidor. O valor enviado pelo cliente só vale até o teto.' },
      { front: 'Por que limites por identidade são melhores que um limite geral?', back: 'Porque contêm o abuso de um cliente sem derrubar os demais.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API4' }, { framework: 'cwe', id: 'CWE-770' }],
  },
  'api-fluxos-sensiveis': {
    context: 'No lançamento de um tênis com estoque limitado, robôs compraram tudo em segundos. Cada requisição era legítima; o volume e a velocidade não eram.',
    concept: [
      'Alguns fluxos de negócio não toleram automação em escala: compra de itens escassos, criação de contas, reservas, envio de mensagens, consultas de dados pessoais por documento. O risco não está em uma requisição, e sim no fluxo usado em massa.',
      'As defesas combinam limites por identidade e por fluxo, sinais de automação, verificação adicional nos pontos críticos e regras de negócio (por exemplo, uma unidade por cliente). Cada fluxo sensível precisa ser identificado e ter dono.',
    ],
    validation: 'Automatize o fluxo sensível a partir de uma conta de teste e de várias contas: os limites e as regras devem conter o volume sem bloquear o uso normal. Confira se o fluxo está protegido também na API, e não só na tela.',
    review: [
      { front: 'O que torna um fluxo de negócio "sensível"?', back: 'O dano causado pelo uso automatizado em escala, mesmo com requisições legítimas.' },
      { front: 'Por que proteger o fluxo também na API?', back: 'Porque robôs chamam a API diretamente, sem passar pela tela.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API6' }],
  },
  'api-consumo-recursos': {
    context: 'Uma consulta GraphQL pediu objetos relacionados em trinta níveis, e a API ficou lenta por duas horas.',
    concept: [
      'Consumo excessivo não depende de volume de requisições: uma só pode custar muito. Profundidade e complexidade de consultas, tamanho de arquivos, quantidade de itens em lote e operações caras precisam de tetos.',
      'O servidor calcula o custo antes de executar e recusa o que passar do limite, com tempo máximo de execução. Em operações que chamam serviços pagos, o custo financeiro também precisa de teto por cliente.',
    ],
    validation: 'Envie consultas com profundidade e complexidade acima do teto, arquivos grandes e lotes enormes: devem ser recusados antes de executar. Confira o tempo máximo de execução em cada operação cara.',
    review: [
      { front: 'Por que uma única requisição pode ser um problema?', back: 'Porque consultas profundas, arquivos grandes e lotes enormes custam muito ao servidor.' },
      { front: 'Quando o servidor deve recusar uma consulta cara?', back: 'Antes de executar, a partir do cálculo de profundidade e complexidade.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API4' }, { framework: 'cwe', id: 'CWE-770' }],
  },
  'api-idempotencia': {
    context: 'O aplicativo reenviou um pagamento depois de a conexão cair. O primeiro pedido já tinha sido processado, e o cliente foi cobrado duas vezes.',
    concept: [
      'Uma operação **idempotente** produz o mesmo efeito quando repetida. Para operações que criam ou cobram, o cliente envia uma **chave de idempotência**; o servidor guarda o resultado associado à chave e devolve o mesmo resultado em uma repetição.',
      'Repetições acontecem por rede, filas, novos envios do usuário e agentes. Somadas à concorrência, exigem também que a operação seja atômica: verificar e gravar em uma só etapa.',
    ],
    example: {
      title: 'Pedido com chave de idempotência',
      language: 'http',
      code: ['POST /pagamentos', 'Idempotency-Key: 6f1c2a9e-8f40-4b2a-9d6b-2f1e7c3a5b10', '', '{ "valor": 1850, "fatura": "F-2026-0042" }'],
      caption: 'A mesma chave, repetida, devolve o resultado do primeiro pedido sem cobrar de novo.',
    },
    validation: 'Envie o mesmo pagamento duas vezes com a mesma chave: só um deve ser processado. Envie dez vezes ao mesmo tempo: só um deve ser processado. Confirme a validade das chaves guardadas.',
    review: [
      { front: 'O que é uma chave de idempotência?', back: 'Um identificador do pedido que permite ao servidor reconhecer e não repetir uma operação já feita.' },
      { front: 'Por que concorrência também importa?', back: 'Porque dois pedidos simultâneos podem passar pela verificação antes de qualquer gravação.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-362' }],
  },
  'api-resp-terceiros': {
    context: 'A API usa a resposta de um serviço de endereços para montar uma consulta ao banco. O serviço foi comprometido e passou a devolver textos com comandos SQL.',
    concept: [
      'A resposta de uma API de terceiros é **entrada não confiável**, como a de um usuário. Ela pode estar errada, adulterada ou ser maliciosa. Valide formato, tamanho e valores esperados, e use consultas parametrizadas com ela.',
      'Integrações também precisam de tempo máximo, limites de tamanho, tratamento de falha (o que fazer quando o terceiro não responde) e verificação da origem (por exemplo, assinatura de webhooks).',
    ],
    validation: 'Simule respostas do terceiro com campos a mais, valores fora de faixa, textos enormes e caracteres especiais: a API deve recusar ou tratar com segurança. Simule o terceiro fora do ar: a API deve responder de forma controlada.',
    review: [
      { front: 'Por que tratar a resposta de um terceiro como entrada não confiável?', back: 'Porque ela pode estar errada, adulterada ou ser maliciosa, como qualquer entrada externa.' },
      { front: 'O que mais uma integração precisa ter?', back: 'Tempo máximo, limite de tamanho, tratamento de falha e verificação da origem.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API10' }],
  },
  'api-ssrf': {
    context: 'Cada cliente cadastra um endereço de webhook. Um cliente cadastra o endereço de um serviço interno, e o servidor passa a enviar eventos para dentro da rede.',
    concept: [
      'Webhooks, importação por URL e prévias de links fazem o servidor buscar destinos informados por clientes. Sem validação, o cliente usa o servidor para alcançar a rede interna: é **SSRF**.',
      'A defesa valida o destino no momento do envio (nome resolvido para IP público e permitido), não segue redirecionamentos sem revalidar, limita esquemas, portas, tempo e tamanho, e envia a partir de um serviço sem acesso à rede interna.',
    ],
    validation: 'Cadastre webhooks com nomes que resolvem para IPs internos, com IPs em formatos alternativos e com redirecionamento para destinos internos: os envios devem ser recusados.',
    review: [
      { front: 'Por que validar o destino no momento do envio, e não só no cadastro?', back: 'Porque o nome pode passar a apontar para outro IP entre o cadastro e o envio.' },
      { front: 'Que medida de arquitetura reduz o risco de SSRF?', back: 'Enviar a partir de um serviço isolado, sem rota para a rede interna.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API7' }, { framework: 'cwe', id: 'CWE-918' }],
  },
  'api-config-insegura': {
    context: 'A API devolve rastros de pilha em erros, aceita o método `TRACE`, reflete qualquer origem no CORS e não usa HTTPS em um ambiente de homologação exposto.',
    concept: [
      'Configuração insegura é um conjunto de pequenas escolhas: erros detalhados, métodos desnecessários habilitados, CORS permissivo, cabeçalhos de segurança ausentes, ambientes de teste expostos, contas e chaves padrão.',
      'A configuração segura é declarada como código, igual em todos os ambientes, revisada e testada automaticamente. Ambientes que não deviam estar expostos não estão.',
    ],
    validation: 'Provoque erros e confira que não há detalhes internos. Liste os métodos aceitos por cada rota. Teste o CORS com uma origem de fora. Varra os ambientes publicados e confira que todos usam HTTPS e não têm contas padrão.',
    review: [
      { front: 'Dê três exemplos de configuração insegura em APIs.', back: 'Erros detalhados, CORS permissivo e métodos desnecessários habilitados (há outros: ambientes expostos, contas padrão).' },
      { front: 'Como manter a configuração segura igual entre ambientes?', back: 'Declarando-a como código, revisada e verificada automaticamente.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API8' }, { framework: 'owasp-top10', id: 'A02' }],
  },
  'api-endpoints-antigos': {
    context: 'Uma rota de exportação criada para um cliente que saiu há dois anos continua no ar, sem limite e com dados de todos os clientes.',
    concept: [
      'Rotas antigas, de teste ou criadas para um caso específico ficam esquecidas e envelhecem sem os controles atuais. Elas costumam ser o caminho mais fraco de toda a API.',
      'O inventário diz o que existe; o processo de retirada diz quando cada rota sai. Até sair, a rota recebe os mesmos controles das atuais e fica sob monitoramento.',
    ],
    validation: 'Varra o gateway em busca de rotas sem dono ou sem uso recente. Chame cada uma sem autenticação e com um usuário comum: devem estar retiradas ou protegidas como as atuais.',
    review: [
      { front: 'Por que rotas antigas são perigosas?', back: 'Porque ficam sem os controles atuais e sem ninguém olhando por elas.' },
      { front: 'O que fazer até uma rota antiga ser retirada?', back: 'Aplicar os mesmos controles das atuais e monitorá-la.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API9' }],
  },
  'api-top10': {
    context: 'Depois de um teste, a equipe tem trinta achados e quer saber por onde começar.',
    concept: [
      'O **OWASP API Security Top 10** (edição 2023) lista os riscos mais relevantes em APIs: autorização por objeto, autenticação, autorização por propriedade, consumo de recursos, autorização por função, fluxos sensíveis, SSRF, configuração, inventário e consumo de APIs de terceiros.',
      'Classificar os achados nas categorias ajuda a ver padrões (por exemplo, muitas falhas de autorização indicam falta de uma camada central) e a priorizar. Como todo Top 10, não é checklist completo nem certificação.',
    ],
    validation: 'Classifique os achados da última revisão nas categorias da edição 2023, citando a edição. Procure padrões (várias falhas da mesma categoria) e transforme cada padrão em uma correção estrutural.',
    review: [
      { front: 'Qual é o primeiro risco do OWASP API Security Top 10:2023?', back: 'API1, autorização quebrada em nível de objeto (BOLA).' },
      { front: 'Para que serve classificar achados por categoria?', back: 'Para ver padrões e priorizar correções estruturais, e não só pontuais.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API1' }, { framework: 'owasp-api-top10', id: 'API10' }],
  },
  'api-openapi': {
    context: 'Uma revisão de contrato encontrou uma rota de exportação sem bloco de segurança e um esquema com escopo curinga.',
    concept: [
      'Ler um contrato procurando segurança significa conferir: toda rota declara autenticação? Os escopos são mínimos? Os esquemas de entrada têm limites (tamanho, formato, valores)? As respostas não expõem campos internos?',
      'Cada achado vira um critério verificável e, de preferência, uma regra automatizada (por exemplo, um linter que falha quando uma rota não declara segurança). O contrato também alimenta testes de autorização.',
    ],
    validation: 'Rode um linter de contrato que acuse rotas sem segurança, escopos curinga e campos sem limite. Compare o contrato com o comportamento real: rotas que declaram segurança devem recusar chamadas sem token.',
    review: [
      { front: 'O que procurar em um contrato OpenAPI?', back: 'Rotas sem autenticação, escopos amplos, entradas sem limite e respostas com campos internos.' },
      { front: 'Como impedir que um contrato esqueça a segurança de novo?', back: 'Com uma regra automática que falha quando uma rota não declara segurança.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API9' }, { framework: 'owasp-api-top10', id: 'API8' }],
  },
  'api-testes-autz': {
    context: 'A API tem 40 rotas, três papéis e dados de vários clientes. Ninguém sabe quais combinações foram testadas.',
    concept: [
      'Uma **matriz de autorização** cruza rotas e métodos com papéis e com a relação com o objeto (dono, outro cliente, sem login). Para cada célula, diz o resultado esperado: permitido ou negado.',
      'A matriz vira testes automatizados, executados a cada mudança. Rotas novas sem linha na matriz fazem o teste falhar, e isso força a decisão de autorização a ser explícita.',
    ],
    example: {
      title: 'Trecho de uma matriz de autorização',
      language: 'text',
      code: ['rota                         | dono | outro cliente | atendente | sem login', 'GET /faturas/{id}            | 200  | 404           | 200       | 401', 'POST /faturas/{id}/cancelar  | 200  | 404           | 403       | 401', 'DELETE /faturas/{id}         | 403  | 404           | 403       | 401'],
      caption: 'Cada célula é um teste. Uma rota sem linha é uma decisão que ainda não foi tomada.',
    },
    validation: 'Gere a matriz a partir do inventário de rotas e rode os testes na pipeline. Confirme que uma rota nova sem linha faz a pipeline falhar.',
    review: [
      { front: 'O que uma matriz de autorização cruza?', back: 'Rotas e métodos com papéis e com a relação com o objeto (dono, outro cliente, sem login).' },
      { front: 'Por que uma rota sem linha na matriz deve falhar o teste?', back: 'Para forçar a decisão de autorização a ser tomada de forma explícita.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API1' }, { framework: 'owasp-api-top10', id: 'API5' }],
  },
  'api-projeto-final': {
    context: 'Uma API multi-tenant de gestão escolar vai abrir para parceiros. Você precisa revisá-la e propor controles antes da abertura.',
    concept: [
      'Uma revisão de API multi-tenant percorre: identidade (tokens, escopos, identidades de serviço), autorização (objeto, propriedade, função e tenant), abuso (limites, fluxos sensíveis, consumo), integrações (webhooks, terceiros) e inventário.',
      'Cada proposta de controle diz onde fica (gateway, serviço, camada de dados), qual risco trata e como verificar. O tenant vem sempre da identidade, e o isolamento vale também para caches, filas, buscas e registros.',
    ],
    validation: 'Entregue a matriz de autorização com tenants, a lista de rotas do inventário e um teste para cada controle proposto. Rode os testes com dois tenants de teste e confirme que nenhum dado atravessa.',
    review: [
      { front: 'De onde deve vir o tenant em uma API multi-tenant?', back: 'Da identidade autenticada, e nunca de um parâmetro enviado pelo cliente.' },
      { front: 'Onde o isolamento entre tenants precisa valer?', back: 'Em consultas, buscas, caches, filas, arquivos e registros.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API1' }, { framework: 'owasp-api-top10', id: 'API4' }],
  },
}
