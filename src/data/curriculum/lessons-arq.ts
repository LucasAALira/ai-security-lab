import type { Lesson } from './types'

/* Aulas da área Arquitetura de Segurança. Texto próprio; exemplos sintéticos. O modo Arquiteto
   (/arquiteto) é a prática integrada destas aulas. */

export const arqLessons: Record<string, Lesson> = {
  'arq-diagramas': {
    context: 'Na revisão de um sistema, cada pessoa da sala desenhava uma arquitetura diferente no quadro.',
    concept: [
      'Um **diagrama de contexto** mostra o sistema como uma caixa e tudo com que ele conversa: pessoas, sistemas externos, fornecedores. Um **diagrama de componentes** abre a caixa: aplicações, serviços, bancos, filas, provedores de identidade.',
      'Para a análise de segurança, o diagrama precisa mostrar quem controla cada componente, por onde os dados passam e onde a confiança muda. Um desenho bonito que esconde um fornecedor ou um fluxo é pior do que um desenho simples e completo.',
    ],
    validation: 'Mostre o diagrama a alguém que não participou do projeto e peça que aponte de onde vêm os dados e quem controla cada caixa. Se a pessoa não conseguir, o diagrama ainda não serve à análise.',
    review: [
      { front: 'Qual a diferença entre diagrama de contexto e de componentes?', back: 'O de contexto mostra o sistema e o que conversa com ele; o de componentes mostra as partes internas.' },
      { front: 'O que um diagrama precisa mostrar para a análise de segurança?', back: 'Quem controla cada componente, por onde os dados passam e onde a confiança muda.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-fluxos-dados': {
    context: 'Uma equipe garantiu que "o CPF nunca sai da empresa". O fluxo desenhado mostrou que ele ia para o fornecedor de antifraude e para o CRM.',
    concept: [
      'Um **fluxo de dados** liga origem e destino e diz o que passa entre eles. Classificar cada fluxo (dados pessoais, dados de saúde, credenciais, dados públicos) mostra onde estão as obrigações e os riscos.',
      'Os fluxos mais importantes são os que cruzam fronteiras: do cliente para o servidor, do servidor para fornecedores, de sistemas internos para registros e análises. Cada um pede uma pergunta: este dado precisa ir para lá?',
    ],
    validation: 'Liste os fluxos do sistema com origem, destino, dados e classificação. Marque os que cruzam fronteiras e, para cada um, justifique a necessidade de cada dado.',
    review: [
      { front: 'O que um fluxo de dados descreve?', back: 'A origem, o destino e o que passa entre eles, com a classificação dos dados.' },
      { front: 'Que pergunta fazer a cada fluxo que cruza uma fronteira?', back: 'Se este dado precisa mesmo ir para lá.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-ativos-fronteiras': {
    context: 'Um modelo de ameaças listava "o servidor" como ativo. Ninguém tinha pensado nas chaves de assinatura nem nos dados de saúde.',
    concept: [
      '**Ativos** são o que vale proteger: dados (pessoais, financeiros, de saúde), credenciais e chaves, a disponibilidade de um serviço, a integridade de um artefato publicado. Componentes são onde os ativos estão.',
      'As {{fronteira-de-confianca|fronteiras de confiança}} são os pontos onde o controle muda de mãos. É nelas que ficam a validação, a autenticação e a autorização. Listar ativos e fronteiras juntos mostra onde o ataque vale a pena e onde ele pode entrar.',
    ],
    validation: 'Liste os ativos críticos e, para cada um, onde está e por quais fronteiras alguém poderia alcançá-lo. Confira se há um controle em cada fronteira desse caminho.',
    review: [
      { front: 'Dê exemplos de ativos além de "o servidor".', back: 'Dados pessoais e de saúde, credenciais, chaves de assinatura, disponibilidade e integridade de artefatos.' },
      { front: 'Por que listar ativos e fronteiras juntos?', back: 'Para ver onde o ataque compensa e por onde ele pode entrar.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-stride-arvores': {
    context: 'A sessão de modelagem de ameaças virou uma lista solta de "e se...". Ninguém sabia se faltava algo.',
    concept: [
      'O {{stride|STRIDE}} é um roteiro de seis tipos de ameaça para examinar cada componente e fluxo: falsificação de identidade, adulteração, repúdio, vazamento de informação, negação de serviço e elevação de privilégio. Ele ajuda a não esquecer categorias inteiras.',
      'Uma **árvore de ataque** organiza um objetivo do atacante (por exemplo, "marcar um pedido como pago sem pagar") em caminhos alternativos e passos necessários. Ela mostra quais controles cortam mais caminhos.',
    ],
    example: {
      title: 'Árvore de ataque (resumida)',
      language: 'text',
      code: ['Marcar pedido como pago sem pagar', '├─ Forjar o retorno do provedor de pagamento', '│  └─ Retorno aceito sem verificar a assinatura', '├─ Alterar o valor antes da cobrança', '│  └─ Valor aceito do que o navegador envia', '└─ Reaproveitar uma cobrança aprovada', '   └─ Sem idempotência por evento'],
      caption: 'Cada folha aponta um controle: verificar a assinatura, recalcular no servidor, idempotência.',
    },
    figure: 'stride',
    validation: 'Aplique as seis categorias a cada componente e fluxo do diagrama e registre ao menos uma pergunta por categoria. Para o objetivo mais grave, monte a árvore e confira qual controle corta cada folha.',
    review: [
      { front: 'Quais são as seis categorias do STRIDE?', back: 'Falsificação, adulteração, repúdio, vazamento, negação de serviço e elevação de privilégio.' },
      { front: 'Para que serve uma árvore de ataque?', back: 'Para organizar os caminhos até um objetivo do atacante e ver quais controles cortam mais caminhos.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-identidade': {
    context: 'Um assistente de IA usava a conta de serviço para buscar documentos "em nome do usuário". Qualquer pessoa conseguia ver tudo.',
    concept: [
      'Há duas identidades em jogo: a de **quem pede** (a pessoa ou o cliente) e a do **serviço que executa**. Quando o serviço age com uma conta própria e ampla, as regras de quem pede deixam de valer.',
      'Em operações iniciadas por uma pessoa, o serviço propaga a identidade dela ({{delegacao|delegação}}), com escopo restrito, e o sistema de destino aplica as regras dela. Contas de serviço próprias ficam para tarefas sem pessoa (rotinas agendadas), com permissões mínimas.',
    ],
    validation: 'Para cada chamada entre serviços, identifique com qual identidade ela é feita. Peça, como um usuário sem acesso, algo que só outro pode ver: a chamada deve ser recusada no destino.',
    review: [
      { front: 'Quais duas identidades existem em uma chamada feita por um serviço?', back: 'A de quem pede e a do serviço que executa.' },
      { front: 'Quando usar uma conta de serviço própria?', back: 'Em tarefas sem uma pessoa por trás, como rotinas agendadas, com permissões mínimas.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-250' }, { framework: 'owasp-api-top10', id: 'API5' }],
  },
  'arq-privilegio-minimo': {
    context: 'A política de acesso do build permitia "tudo em todos os recursos". Ninguém sabia quais permissões o build realmente usava.',
    concept: [
      'O {{privilegio-minimo|privilégio mínimo}} dá a cada identidade só o que a função usa, e só pelo tempo necessário. Começar pelo que é usado (registros de acesso, testes) é mais eficaz do que tentar adivinhar.',
      'Permissões amplas costumam nascer "para não dar erro". Revisões periódicas, credenciais temporárias e separação por função (um papel para ler, outro para publicar) evitam que elas se acumulem.',
    ],
    figure: 'privilegio',
    validation: 'Para uma identidade com permissões amplas, levante pelos registros o que ela usou nos últimos 30 dias e crie uma política só com isso. Rode o processo com a nova política e confirme que funciona.',
    review: [
      { front: 'Como descobrir o mínimo necessário para uma identidade?', back: 'Pelo que ela de fato usa, a partir dos registros de acesso e de testes.' },
      { front: 'Por que permissões amplas se acumulam?', back: 'Porque são dadas "para não dar erro" e nunca revistas.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-250' }],
  },
  'arq-segredos': {
    context: 'A mesma chave de API estava no repositório, em três arquivos de configuração e em um chamado de suporte. Ninguém sabia quantos sistemas parariam se ela fosse trocada.',
    concept: [
      'Segredos têm **ciclo de vida**: criação, armazenamento (em cofre), distribuição (só para quem precisa, no momento em que precisa), rotação, revogação e auditoria de uso. Sem esse ciclo, eles se espalham e ninguém consegue trocá-los.',
      'Prefira {{credencial-efemera|credenciais temporárias}} emitidas a partir de identidades. Para os segredos que restarem, automatize a rotação, mascare em registros e saiba quem usa cada um.',
    ],
    validation: 'Para cada segredo, registre onde está guardado, quem usa, a data da última rotação e quanto tempo leva para trocá-lo. Faça uma rotação de teste e meça o tempo.',
    review: [
      { front: 'Quais são as etapas do ciclo de vida de um segredo?', back: 'Criação, armazenamento, distribuição, rotação, revogação e auditoria.' },
      { front: 'Por que automatizar a rotação?', back: 'Porque segredos difíceis de trocar acabam vivendo por anos.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'cwe', id: 'CWE-532' }],
  },
  'arq-cripto-kms': {
    context: 'Um time decidiu "cifrar o banco" e guardou a chave em um arquivo no mesmo servidor do banco.',
    concept: [
      'Cifrar protege contra quem obtém os dados sem a chave. A pergunta central é **onde fica a chave** e quem pode usá-la. Se ela fica junto dos dados, a proteção é pequena.',
      'Um **KMS** gerencia chaves fora dos sistemas que as usam, com permissões, registro de uso e rotação. Um **HSM** guarda chaves em hardware dedicado, de onde não podem ser extraídas. Use algoritmos e bibliotecas consolidados, e não implementações próprias.',
    ],
    validation: 'Para cada dado cifrado, registre onde está a chave, quem pode usá-la e se o uso fica registrado. Confira que nenhuma chave fica no mesmo lugar dos dados que protege.',
    review: [
      { front: 'Qual é a pergunta central ao cifrar dados?', back: 'Onde fica a chave e quem pode usá-la.' },
      { front: 'O que um KMS acrescenta?', back: 'Gestão de chaves fora dos sistemas, com permissões, registro de uso e rotação.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A04' }, { framework: 'cwe', id: 'CWE-327' }],
  },
  'arq-retencao-classificacao': {
    context: 'Os registros de depuração guardavam conversas completas, com CPF e dados de saúde, por tempo indeterminado.',
    concept: [
      '**Classificar** dados (público, interno, pessoal, sensível) define o tratamento de cada um: quem acessa, onde pode ficar, se pode sair para fornecedores. **Retenção** define por quanto tempo cada dado é guardado e como é descartado.',
      'O que não é guardado não vaza. Cada categoria tem um prazo justificado pela finalidade, e o descarte é automático. Registros, cópias de segurança e ambientes de teste entram na conta.',
    ],
    validation: 'Para cada base, registro e cópia de segurança, confira a classificação dos dados e o prazo de retenção. Procure dados com prazo vencido: devem ter sido descartados automaticamente.',
    review: [
      { front: 'Para que serve classificar dados?', back: 'Para definir o tratamento de cada categoria: acesso, local e compartilhamento.' },
      { front: 'Onde a retenção costuma ser esquecida?', back: 'Em registros, cópias de segurança e ambientes de teste.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-532' }],
  },
  'arq-web-apis': {
    context: 'As regras de segurança de uma loja ficavam no servidor do site. O aplicativo e os parceiros chamavam a API direto e as contornavam.',
    concept: [
      'Entre o navegador, o gateway e os serviços, cada camada tem um papel: o **navegador** apresenta (e não é confiável); o **gateway** autentica, valida tokens e aplica tetos por chave e origem; os **serviços** decidem a autorização por objeto e as regras de negócio.',
      'Regras de segurança colocadas na camada de apresentação protegem só quem passa por ela. O lugar delas é onde a ação acontece, para todos os chamadores.',
    ],
    validation: 'Para cada regra de segurança, aponte em que camada ela mora. Chame o serviço por um caminho que não passe pelo site: as regras devem continuar valendo.',
    review: [
      { front: 'Qual o papel do gateway?', back: 'Autenticar, validar tokens e aplicar tetos por chave e origem.' },
      { front: 'Onde ficam autorização por objeto e regras de negócio?', back: 'Nos serviços, onde a ação acontece.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'owasp-api-top10', id: 'API5' }],
  },
  'arq-mobile-backend': {
    context: 'O aplicativo pedia biometria para confirmar pagamentos e enviava ao servidor um campo dizendo que a biometria foi feita.',
    concept: [
      'No aplicativo ficam os controles do aparelho: armazenamento protegido, validação de TLS, links sem credencial, dados fora de notificações e registros. No servidor ficam as decisões: autorização, regras de negócio, limites e a verificação de provas (como assinaturas).',
      'Nenhum controle no aparelho substitui uma decisão no servidor, porque o aparelho é controlado por quem o usa. Provas como assinaturas exigem as duas partes: o aparelho assina, o servidor confere.',
    ],
    validation: 'Para cada controle, diga se fica no aplicativo, no servidor ou nos dois. Para cada um do servidor, envie uma requisição forjada que finge o que o aplicativo enviaria: o servidor deve decidir sozinho.',
    review: [
      { front: 'O que fica no aplicativo?', back: 'Armazenamento protegido, validação de TLS, links sem credencial e dados fora de notificações e registros.' },
      { front: 'O que fica no servidor?', back: 'Autorização, regras de negócio, limites e a verificação de provas.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-602' }, { framework: 'owasp-mobile-top10', id: 'M3' }],
  },
  'arq-microsservicos': {
    context: 'Dentro da rede, qualquer serviço chamava qualquer outro sem autenticação, "porque é tudo interno".',
    concept: [
      'Em microsserviços, a rede interna não é uma fronteira de confiança suficiente: um serviço comprometido alcança todos os outros. Cada chamada entre serviços é autenticada (identidade de serviço) e autorizada (este serviço pode chamar esta operação).',
      'Com terceiros, as integrações tratam respostas como entrada não confiável, verificam a origem de webhooks e limitam o que é enviado. Mensagens em filas também carregam identidade e são validadas por quem consome.',
    ],
    validation: 'A partir de um serviço de teste, tente chamar operações de outros serviços que ele não deveria usar: as chamadas devem ser recusadas. Confira que webhooks de terceiros têm a origem verificada.',
    review: [
      { front: 'Por que "é tudo interno" não basta em microsserviços?', back: 'Porque um serviço comprometido alcançaria todos os outros.' },
      { front: 'O que cada chamada entre serviços precisa ter?', back: 'Autenticação da identidade do serviço e autorização para a operação.' },
    ],
    refs: [{ framework: 'owasp-api-top10', id: 'API10' }, { framework: 'cwe', id: 'CWE-862' }],
  },
  'arq-rag-agentes': {
    context: 'Um assistente com RAG e ferramentas foi aprovado com base em "o prompt manda o modelo seguir as regras".',
    concept: [
      'Arquitetar assistentes com RAG e agentes é colocar os controles **fora do modelo**: busca filtrada pela permissão do usuário, conteúdo recuperado tratado como dado, identidade delegada nas ferramentas, validação de argumentos, confirmação para ações com efeito, limites de uso e interruptor de emergência.',
      'O prompt orienta o comportamento esperado, mas a segurança não depende de o modelo obedecer. A pergunta de revisão é: se o modelo for enganado, o que impede o dano?',
    ],
    validation: 'Para cada capacidade do assistente, responda "se o modelo for enganado, o que impede o dano?". Capacidades sem resposta precisam de um controle fora do modelo.',
    review: [
      { front: 'Onde ficam os controles de um assistente com RAG e agentes?', back: 'Fora do modelo: busca filtrada, identidade delegada, validação, confirmação e limites.' },
      { front: 'Qual a pergunta de revisão para cada capacidade?', back: 'Se o modelo for enganado, o que impede o dano?' },
    ],
    refs: [{ framework: 'owasp-llm-top10', id: 'LLM06' }, { framework: 'owasp-llm-top10', id: 'LLM08' }],
  },
  'arq-multitenant': {
    context: 'Uma plataforma usada por trinta empresas guardava o cache de respostas por pergunta, sem separar as empresas.',
    concept: [
      'Em sistemas {{tenant|multi-tenant}}, o isolamento vale em todas as camadas: identidade (o tenant vem do token), dados (filtro obrigatório ou bases separadas), cache (chave com o tenant), arquivos (caminhos por tenant), filas, buscas, registros e limites de uso.',
      'O nível de separação (lógica, por esquema, por banco, por infraestrutura) depende do risco e do custo; o que não pode faltar é o tenant em cada decisão e testes que tentam atravessar a fronteira.',
    ],
    validation: 'Com dois tenants de teste, tente atravessar a fronteira em cada camada (API, busca, cache, arquivos, exportação, registros). Confira que os limites de uso de um tenant não afetam o outro.',
    review: [
      { front: 'Onde o isolamento entre tenants precisa valer?', back: 'Em identidade, dados, cache, arquivos, filas, buscas, registros e limites.' },
      { front: 'De onde vem o tenant em cada decisão?', back: 'Da identidade autenticada.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'owasp-api-top10', id: 'API1' }],
  },
  'arq-requisitos': {
    context: 'A equipe discutiu por uma hora qual controle adotar, até perceber que ninguém sabia quanto tempo o sistema podia ficar fora do ar.',
    concept: [
      '**Requisitos funcionais** dizem o que o sistema faz. **Requisitos não funcionais** dizem como (disponibilidade, desempenho, privacidade, retenção). **Restrições** limitam as soluções (prazo, orçamento, equipe, tecnologia, contrato).',
      'Separar os três antes de decidir evita discussões sem critério: uma solução elegante que não cabe na equipe ou no prazo não é uma solução. Requisitos de segurança também são escritos de forma testável.',
    ],
    validation: 'Para uma decisão em aberto, liste requisitos funcionais, não funcionais e restrições. Elimine as alternativas que violam alguma restrição antes de compará-las.',
    review: [
      { front: 'Qual a diferença entre requisito não funcional e restrição?', back: 'O requisito diz como o sistema deve se comportar; a restrição limita as soluções possíveis.' },
      { front: 'Por que separar requisitos e restrições antes de decidir?', back: 'Para eliminar alternativas inviáveis e comparar as restantes com critério.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-alternativas': {
    context: 'Para proteger o checkout contra robôs, havia duas propostas: limite por identidade no gateway ou desafio anti-automação na tela.',
    concept: [
      'Comparar alternativas é olhar cada uma pelos mesmos critérios: **segurança** (que ameaças trata e quais deixa), **privacidade**, **disponibilidade**, **custo**, **complexidade operacional** e **experiência do usuário**.',
      'Raramente uma alternativa vence em tudo. A escolha depende do contexto e dos requisitos, e o que se perde precisa ser declarado. Mais de uma solução pode ser defensável.',
    ],
    example: {
      title: 'Comparação resumida',
      language: 'text',
      code: ['critério                | limite no gateway | desafio na tela', 'protege a API pública   | sim               | não', 'atrito para a pessoa    | nenhum            | uma etapa a mais', 'custo de operação       | calibrar limites  | manter o fornecedor do desafio'],
      caption: 'As duas são defensáveis; a escolha depende de a API pública estar exposta a robôs.',
    },
    validation: 'Monte uma tabela com duas ou três alternativas e os seis critérios, registre a escolha e o que se perde com ela.',
    review: [
      { front: 'Quais critérios usar para comparar alternativas?', back: 'Segurança, privacidade, disponibilidade, custo, complexidade operacional e experiência.' },
      { front: 'Pode haver mais de uma solução defensável?', back: 'Sim. A escolha depende do contexto, e o que se perde é declarado.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-adr': {
    context: 'Um ano depois de uma decisão de arquitetura, ninguém lembrava por que o assistente não podia executar ações sozinho, e alguém propôs liberar.',
    concept: [
      'Um {{adr|ADR}} registra uma decisão em poucos campos: **contexto**, **decisão**, **alternativas** consideradas, **justificativa**, **consequências**, **risco residual** e **plano de validação**. Ele serve a quem chega depois e não estava na sala.',
      'Um bom ADR é específico: cita o problema concreto, as restrições, o que foi descartado e por quê, e diz quando rever. Princípios genéricos não ajudam a decidir de novo.',
    ],
    validation: 'Releia um ADR seu com os olhos de quem não participou: dá para entender o problema, as alternativas, o que se perdeu e como saber se a decisão continua valendo?',
    review: [
      { front: 'Quais campos um ADR simplificado tem?', back: 'Contexto, decisão, alternativas, justificativa, consequências, risco residual e plano de validação.' },
      { front: 'Para quem o ADR é escrito?', back: 'Para quem chega depois e não estava na decisão.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-custo-disp': {
    context: 'A proposta de segurança tinha dezesseis controles novos. A equipe de operação tinha duas pessoas.',
    concept: [
      'Todo controle tem custo: de implantação, de operação (alguém precisa acompanhar alertas, renovar certificados, calibrar limites) e de disponibilidade (um controle mal configurado pode derrubar o serviço). Fixação de certificado sem plano de rotação é um exemplo clássico.',
      'Equilibrar significa escolher os controles que tratam os riscos críticos dentro da capacidade real, e não adicionar ferramentas. Um controle que ninguém opera vira uma falsa sensação de segurança.',
    ],
    validation: 'Para cada controle proposto, registre o custo de operação (quem, quanto tempo por semana) e o risco de indisponibilidade. Some e compare com a capacidade da equipe.',
    review: [
      { front: 'Que custos um controle tem além da implantação?', back: 'Custo de operação e risco de indisponibilidade.' },
      { front: 'Por que mais controles nem sempre é melhor?', back: 'Porque controles que ninguém opera viram falsa sensação de segurança.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-risco-residual': {
    context: 'Depois de aplicar os controles, o relatório dizia "risco eliminado". Seis meses depois, um caso não coberto aconteceu.',
    concept: [
      'O {{risco-residual|risco residual}} é o que sobra depois dos controles. Ele sempre existe e precisa ser declarado, com dono, prazo de revisão e um sinal de que ele está se materializando.',
      'O **plano de validação** diz como saber que o controle funciona: um teste repetível, executado a cada mudança, e um indicador em produção. Sem validação, um controle é uma intenção.',
    ],
    validation: 'Para cada decisão de arquitetura recente, confira se há risco residual declarado com dono e data de revisão, e um teste que comprove o controle.',
    review: [
      { front: 'O que declarar sobre o risco residual?', back: 'O que sobra, quem aceita, quando rever e que sinal indica que ele está acontecendo.' },
      { front: 'O que torna um controle verificável?', back: 'Um teste repetível e um indicador em produção.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-revisar-projeto': {
    context: 'Você recebe um projeto para revisar com dois meses até o lançamento: requisitos, diagrama, fornecedores e restrições.',
    concept: [
      'Uma revisão de arquitetura segue uma ordem: entender o que se constrói (requisitos, diagrama, fluxos, perfis), levantar o que pode dar errado (ativos, fronteiras, STRIDE), decidir o que fazer (controles obrigatórios e escolhas de contexto, dentro das restrições) e conferir (validação e risco residual).',
      'O resultado é uma decisão registrada (ADR) e uma lista de controles com lugar, dono e teste. O modo Arquiteto deste site pratica exatamente esse ciclo.',
    ],
    validation: 'Ao fim da revisão, confira se cada ameaça crítica tem um controle no componente certo, se os obrigatórios estão presentes e se a solução cabe no orçamento e na equipe.',
    review: [
      { front: 'Qual a ordem de uma revisão de arquitetura?', back: 'Entender, levantar ameaças, decidir controles e conferir.' },
      { front: 'Qual o resultado esperado da revisão?', back: 'Uma decisão registrada e uma lista de controles com lugar, dono e teste.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-riscos-diagrama': {
    context: 'No diagrama, o webhook do provedor de pagamento chegava direto ao serviço de pedidos, sem nenhuma anotação.',
    concept: [
      'Encontrar riscos no diagrama é percorrer cada componente e cada ligação com perguntas: quem controla isto? O que acontece se mentir? O que passa aqui? Quem pode chamar isto? Distratores também aparecem: nem toda ameaça se aplica a todo componente.',
      'Riscos costumam se concentrar nas ligações que cruzam fronteiras (cliente, terceiros, retornos de fornecedores) e nos componentes que concentram poder (identidade, pipeline, agentes).',
    ],
    validation: 'Para cada ligação que cruza uma fronteira, registre ao menos uma ameaça e o controle correspondente. Para cada ameaça marcada, justifique por que ela se aplica àquele componente.',
    review: [
      { front: 'Onde os riscos costumam se concentrar em um diagrama?', back: 'Nas ligações que cruzam fronteiras e nos componentes que concentram poder.' },
      { front: 'Toda ameaça se aplica a todo componente?', back: 'Não. Parte da análise é descartar as que não se aplicam, com justificativa.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-escolher-controles': {
    context: 'Com vinte pontos de esforço, a equipe precisava escolher entre dezessete controles possíveis.',
    concept: [
      'Escolher controles começa pelos **obrigatórios** (os que valem em qualquer contexto, como autorização por objeto no servidor) e segue pelas **escolhas de contexto**, comparando alternativas que tratam a mesma ameaça com custos diferentes.',
      'Cada controle precisa estar no componente onde funciona. Controles redundantes consomem orçamento sem reduzir risco, e a solução precisa caber na capacidade de operar.',
    ],
    validation: 'Confira que cada ameaça crítica tem um controle bem posicionado, que os obrigatórios estão presentes, que não há controles redundantes e que custo e complexidade cabem nos limites.',
    review: [
      { front: 'Por onde começar a escolha de controles?', back: 'Pelos obrigatórios, que valem em qualquer contexto.' },
      { front: 'O que é um controle redundante?', back: 'Um controle que não trata nada que outro controle escolhido já não trate.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-defender': {
    context: 'Na reunião de aprovação, a diretora perguntou: "por que não fazemos só o mais barato?".',
    concept: [
      'Defender uma decisão é mostrar a ligação entre cada controle, a ameaça que ele trata e o critério que motivou a escolha, junto das alternativas descartadas e do que elas deixariam aberto.',
      'Uma boa defesa também declara o que a decisão não resolve e o que custa. Esconder o risco residual tira de quem decide a chance de aceitar ou recusar com informação.',
    ],
    validation: 'Prepare a defesa em uma página: controles, ameaças, alternativas descartadas, risco residual e custo. Peça a alguém que faça as perguntas difíceis e confira se a página as responde.',
    review: [
      { front: 'O que mostrar ao defender uma decisão?', back: 'A ligação entre controle, ameaça e critério, as alternativas descartadas e o risco residual.' },
      { front: 'Por que declarar o que a decisão não resolve?', back: 'Para que quem decide possa aceitar ou recusar o risco com informação.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }],
  },
  'arq-pos-incidente': {
    context: 'Depois de um incidente em que o assistente enviou uma planilha confidencial, a equipe corrigiu o prompt e encerrou o caso.',
    concept: [
      'Reavaliar a arquitetura depois de um incidente é perguntar o que ele revelou sobre o desenho, e não só sobre o código: qual fronteira não tinha controle, que suposição se mostrou falsa, que controle dependia de algo que falhou.',
      'O resultado é uma decisão nova (ADR), testes que reproduzem o incidente e, muitas vezes, controles em outro lugar. Corrigir só o sintoma (o prompt, a linha de código) deixa a causa pronta para o próximo.',
    ],
    validation: 'Para o último incidente, liste a suposição que falhou e o controle de arquitetura que passou a existir. Confira que há um teste que reproduz o incidente e falha se a causa voltar.',
    review: [
      { front: 'Que pergunta fazer depois de um incidente?', back: 'O que ele revelou sobre o desenho: que fronteira ou suposição falhou.' },
      { front: 'Por que corrigir só o sintoma é insuficiente?', back: 'Porque a causa continua pronta para o próximo incidente.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A06' }, { framework: 'nist-ssdf', id: 'RV.1' }],
  },
}
