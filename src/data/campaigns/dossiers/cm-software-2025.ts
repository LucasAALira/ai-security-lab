import type { DossierContent } from '../types'

/* Dossiê: ataque de 30 de junho de 2025 ao Pix por comprometimento de prestador de tecnologia (Brasil). */

export const cmSoftware2025: DossierContent = {
  id: 'cm-software-2025',
  title: 'Pix (Brasil, 2025): a credencial de um funcionário e as madrugadas de 30 de junho',
  subtitle: 'Credenciais internas de um prestador de tecnologia autorizado pelo Banco Central foram vendidas por um funcionário. Na madrugada de 30 de junho de 2025, ordens de pagamento legítimas aos olhos do sistema desviaram dezenas de milhões de reais.',
  incidentDate: '2025-06-30',
  publishedDate: '2025-09-05 (análise técnica pública); decisões sancionadoras em 2025-09-09 e 2025-11-11',
  reviewed: '2026-10-19',
  summary: [
    'Segundo a análise do CSIRT do LACNIC, em **março de 2025** um desenvolvedor júnior da **C&M Software**, prestadora de infraestrutura financeira autorizada pelo Banco Central, concordou em vender as suas credenciais de acesso por **R$ 5.000**; em **maio de 2025**, o mesmo funcionário executou comandos que habilitaram o acesso remoto dos atacantes. [3]',
    'Com esse acesso, o grupo alcançou **chaves privadas e certificados digitais** necessários para autorizar transações Pix em nome das instituições clientes, o que permitia emitir ordens de aparência legítima dentro do sistema de pagamentos instantâneos, sem disparar alertas. [3]',
    'Na madrugada de **30 de junho de 2025**, centenas de transações fraudulentas foram executadas. O valor total não foi confirmado, com estimativas preliminares entre **US$ 80 milhões e US$ 800 milhões**; os recursos passaram por instituições de pagamento menores e foram convertidos em criptomoedas. [3]',
    'Uma das instituições recebedoras, a **Nuoro Pay**, recebeu nessa madrugada **cinco transferências de mais de R$ 1 milhão cada, somando R$ 45 milhões**, entre 0h01 e 1h57, para um cliente pessoa jurídica cujo CNPJ havia sido registrado em **11 de junho de 2025**. [1]',
    'O Banco Central considerou que a instituição deixou de rejeitar de imediato as transações apesar da suspeita de fraude, por **não realizar a análise das transações em tempo real**; os fatores de suspeita eram os valores, o horário, a janela curta, a data recente do CNPJ e a incompatibilidade com o porte de microempresa do cliente. [1]',
    'A Nuoro Pay foi **suspensa preventivamente do Pix em 3 de julho de 2025**, **excluída em 15 de agosto de 2025** e **multada em R$ 245 mil** em 9 de setembro de 2025. [1]',
    'Outra recebedora, a **Brasil Cash**, recebeu na mesma madrugada uma transferência de **R$ 10 milhões** para um cliente pessoa jurídica; depois do fechamento, o próprio sistema apontou saídas suspeitas, a conta foi bloqueada e **R$ 4.058.432,29 foram retidos**. Ela foi suspensa preventivamente em 4 de julho, teve a suspensão revogada em 31 de outubro e foi **multada em R$ 210 mil**. [2]',
    'Nas duas decisões, o Banco Central registrou que medidas corretivas posteriores "não elidem o descumprimento já consumado", e a **Polícia Federal abriu investigação em 2 de julho de 2025**, com apoio do Banco Central. [1][2][3]',
  ],
  timeline: [
    { when: '2025-03', what: 'Um desenvolvedor da prestadora concorda em vender as próprias credenciais de acesso por R$ 5.000, segundo a análise técnica.', source: 3 },
    { when: '2025-05', what: 'O mesmo funcionário executa comandos que habilitam o acesso remoto dos atacantes aos sistemas da prestadora.', source: 3 },
    { when: '2025-06-11', what: 'É constituída a empresa que receberia R$ 45 milhões em uma das instituições de pagamento.', source: 3 },
    { when: '2025-06-30', what: 'Na madrugada, centenas de transações fraudulentas são emitidas; a Nuoro Pay recebe R$ 45 milhões em cinco transferências e a Brasil Cash, R$ 10 milhões.', source: 1 },
    { when: '2025-07-02', what: 'A Polícia Federal abre investigação com apoio do Banco Central.', source: 3 },
    { when: '2025-07-03 e 2025-07-04', what: 'O Banco Central suspende preventivamente do Pix as duas instituições recebedoras.', source: 2 },
    { when: '2025-09-09 e 2025-11-11', what: 'O Banco Central aplica multas de R$ 245 mil e R$ 210 mil às instituições recebedoras.', source: 1 },
  ],
  component: {
    name: 'Prestador de tecnologia que conecta instituições ao sistema de pagamentos instantâneos, e as chaves que autorizam ordens em nome delas',
    trust:
      'As instituições confiam que uma ordem assinada com a chave delas partiu delas, e o sistema central confia na mesma assinatura. Quando um prestador concentra chaves de muitos clientes, o acesso de um funcionário passa a valer tanto quanto a autorização de todos eles.',
  },
  impact: [
    'Centenas de transações fraudulentas em uma madrugada, com valor total não confirmado e estimativas entre US$ 80 milhões e US$ 800 milhões. [3]',
    'R$ 45 milhões recebidos por um cliente de uma instituição e R$ 10 milhões por um cliente de outra, nas primeiras horas do dia. [1][2]',
    'Recuperação parcial: R$ 4.058.432,29 retidos em uma das instituições após bloqueio da conta. [2]',
    'Duas instituições suspensas preventivamente do Pix, uma delas excluída, e multas de R$ 245 mil e R$ 210 mil. [1][2]',
  ],
  uncertainties: [
    'O valor total desviado não foi confirmado; as estimativas públicas variam em uma ordem de magnitude. [3]',
    'A atribuição do ataque é provisória: a análise consultada afasta atores externos "nesta etapa", o que é uma conclusão preliminar. [3]',
    'As decisões sancionadoras consultadas tratam das instituições recebedoras; não há, entre as fontes consultadas, decisão pública sobre a prestadora de tecnologia.',
    'Não há, nas fontes consultadas, detalhe técnico sobre como as chaves privadas estavam protegidas nem sobre o modelo de acesso interno da prestadora. [3]',
  ],
  analysis: [
    'A autenticação funcionou perfeitamente: as ordens eram assinadas com chaves válidas. O ataque não quebrou a criptografia, comprou o acesso a ela.',
    'Concentração é o risco estrutural do caso. Um prestador que guarda as chaves de muitas instituições transforma um único comprometimento em autorização coletiva.',
    'A camada que ainda podia barrar o dano era a do recebedor, e ela falhou por ausência de análise em tempo real: valores atípicos, madrugada, CNPJ novo e porte incompatível estavam todos visíveis no momento do crédito.',
    'A diferença entre as duas instituições mostra o valor da detecção tardia: uma bloqueou a conta e retiveram parte do dinheiro, a outra foi excluída do sistema.',
    'A recusa em abater a pena por correção posterior é um recado de engenharia: o controle precisa existir antes, porque depois ele só reduz o prejuízo, não a responsabilidade.',
  ],
  lessons: [
    'Trate credencial de pessoa como material de alto valor: acesso de administração temporário, aprovado por chamado, com segundo fator e expiração automática.',
    'Separe quem pode usar a chave de assinatura de quem pode operar o sistema, e exija duas pessoas para operações que assinam em nome de terceiros.',
    'Mantenha as chaves em módulo de segurança que não permite extração, com registro de cada uso e limite por janela de tempo.',
    'Implemente análise de risco no momento do crédito, com regras simples e combinadas: valor atípico, horário, idade do cadastro e porte declarado.',
    'Defina antes o procedimento de bloqueio e retenção, porque a recuperação do dinheiro depende de minutos, não de dias.',
  ],
  exercise: {
    title: 'Simulação: o integrador Aurora Hub e a madrugada de terça',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. O **Aurora Hub** é um integrador inventado que assina ordens de pagamento em nome de doze instituições clientes. A **Aurora Pay** é uma instituição recebedora fictícia. Nomes, números e endereços são inventados.',
      'Às 0h14 de uma terça-feira, a Aurora Pay recebe quatro créditos de R$ 1,2 milhão para a mesma empresa, cadastrada há dez dias. O integrador afirma que as ordens têm assinatura válida.',
    ],
    objective: 'Reconhecer por que a assinatura válida não basta, escolher o controle que barra o crédito suspeito no momento certo e ordenar a resposta que recupera o máximo possível.',
    criteria: [
      'Você identifica os sinais disponíveis no momento do crédito.',
      'Você escolhe controles que separam uso da chave de operação do sistema.',
      'Você ordena a resposta de modo a maximizar a retenção de valores.',
    ],
    evidence: [
      {
        id: 'creditos',
        title: 'Créditos recebidos na madrugada (fictício)',
        kind: 'table',
        from: 0,
        head: ['Horário', 'Valor', 'Destinatário', 'Cadastro do destinatário', 'Porte declarado', 'Saída seguinte'],
        rows: [
          ['00:14', 'R$ 1.200.000', 'empresa X', 'há 10 dias', 'microempresa', 'nenhuma'],
          ['00:21', 'R$ 1.200.000', 'empresa X', 'há 10 dias', 'microempresa', 'nenhuma'],
          ['00:33', 'R$ 1.200.000', 'empresa X', 'há 10 dias', 'microempresa', '3 saídas para contas novas'],
          ['00:52', 'R$ 1.200.000', 'empresa X', 'há 10 dias', 'microempresa', '7 saídas e 2 compras de criptomoeda'],
          ['09:40 (dia anterior)', 'R$ 3.400', 'empresa X', 'há 9 dias', 'microempresa', 'nenhuma'],
        ],
        note: 'Compare o histórico da conta com os valores da madrugada e veja quando as saídas começam.',
      },
      {
        id: 'acessos-no-integrador',
        title: 'Acessos no integrador nas semanas anteriores (fictício)',
        kind: 'code',
        from: 1,
        language: 'text',
        lines: [
          '[-45 dias] usuário dev-2 recebe acesso temporário de administração; expiração não configurada',
          '[-30 dias] dev-2 executa script de manutenção que instala ferramenta de acesso remoto',
          '[-29 dias] conexão de 203.0.113.41 autenticada como dev-2, fora do horário de trabalho',
          '[-02 dias] chave de assinatura da instituição cliente usada 4 vezes em homologação por dev-2',
          '[00:10] chave de assinatura usada para emitir 4 ordens de pagamento de alto valor',
          '[00:55] volume de ordens assinadas na hora: 60 vezes a média da madrugada',
        ],
        note: 'Repare em quanto tempo o acesso temporário continuou valendo e quem usou a chave.',
      },
    ],
    activities: [
      {
        id: 'sinais-no-credito',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que dava para ver às 0h14',
        prompt: 'Marque **todos** os sinais que já estavam disponíveis no momento do primeiro crédito e que sustentavam suspeita de fraude.',
        options: [
          { text: 'Valor de R$ 1,2 milhão incompatível com o histórico da conta, que tinha movimentação de R$ 3.400.', feedback: 'Sim: a comparação com o histórico da própria conta é o sinal mais simples e estava disponível na hora.' },
          { text: 'Cadastro do destinatário aberto há dez dias.', feedback: 'Sim: idade do cadastro combinada com valor alto é um dos fatores citados nas decisões reais.' },
          { text: 'Porte declarado de microempresa, incompatível com o valor recebido.', feedback: 'Sim: a incompatibilidade entre porte e valor é verificável automaticamente no momento do crédito.' },
          { text: 'Horário de madrugada, com quatro créditos em menos de 40 minutos.', feedback: 'Sim: horário e janela curta compõem o padrão, embora nenhum deles baste isoladamente.' },
          { text: 'As saídas para contas novas e as compras de criptomoeda.', feedback: 'Não às 0h14: essas saídas aparecem depois, a partir de 0h33, e não estavam disponíveis no primeiro crédito.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Separe o que já existia às 0h14 do que apareceu depois.',
          'Compare a conta com ela mesma, e não com a média do mercado.',
          'Um dos sinais é posterior ao momento da decisão.',
        ],
        explain:
          'Quatro sinais estavam disponíveis no primeiro crédito: valor fora do histórico, cadastro recente, porte incompatível e horário com janela curta. As saídas suspeitas só aparecem depois, e é por isso que a análise precisa acontecer no momento do crédito.',
      },
      {
        id: 'controles-no-integrador',
        kind: 'decide',
        title: 'O controle no integrador',
        prompt: 'No Aurora Hub, qual conjunto de controles reduz o efeito da venda de uma credencial interna?',
        options: [
          {
            text: 'Acesso de administração temporário com expiração automática e aprovação por chamado; chaves de assinatura em módulo que não permite extração, com registro de cada uso; separação entre quem opera o sistema e quem pode acionar a assinatura, exigindo duas pessoas para alto valor; e limite por janela com alerta quando o volume assinado fugir da média.',
            quality: 'best',
            flags: ['acesso-temporario', 'chave-protegida', 'duas-pessoas'],
            feedback: 'Reduz o valor de uma credencial isolada: ela expira, não extrai chave, não assina sozinha para alto valor e produz alerta de volume.',
            consequence: 'A credencial vendida expira antes do ataque, e a tentativa de assinar em volume dispara alerta na primeira madrugada.',
          },
          {
            text: 'Trocar todas as senhas internas a cada 30 dias e proibir acesso remoto fora do horário comercial.',
            quality: 'partial',
            feedback: 'Troca de senha e janela de horário atrapalham, mas não impedem quem obteve acesso legítimo de um funcionário ativo.',
            consequence: 'O atacante usa a credencial dentro do horário permitido e o acesso remoto instalado continua valendo.',
          },
          {
            text: 'Exigir que cada instituição cliente assine um termo de responsabilidade sobre o uso das chaves que deixa sob custódia do integrador.',
            quality: 'poor',
            feedback: 'Transferir responsabilidade por contrato não reduz o risco técnico da concentração de chaves em um só lugar.',
            consequence: 'O comprometimento ocorre igual, e a discussão passa a ser apenas sobre quem paga a conta.',
          },
          {
            text: 'Monitorar as redes sociais dos funcionários para identificar sinais de aproximação de criminosos.',
            quality: 'poor',
            feedback: 'É invasivo, de eficácia duvidosa e desloca o controle para a vigilância de pessoas em vez da arquitetura de acesso.',
            consequence: 'O integrador cria um problema de privacidade interno e segue vulnerável à mesma venda de credencial.',
          },
        ],
        hints: [
          'Pergunte o que acontece se uma credencial válida cair em mãos erradas amanhã.',
          'Separe usar o sistema de usar a chave.',
          'Alto valor pede mais de uma pessoa.',
        ],
        explain:
          'Contra credencial comprometida, o que funciona é reduzir o alcance dela: acesso que expira, chave que não sai do módulo, assinatura que exige duas pessoas em alto valor e alerta por volume. Termo contratual e vigilância de pessoas não alteram a arquitetura.',
      },
      {
        id: 'resposta-da-madrugada',
        kind: 'order',
        title: 'A resposta da madrugada',
        prompt: 'Na Aurora Pay, ordene as quatro ações a partir do momento em que o alerta soa, para maximizar a retenção de valores.',
        items: [
          { text: 'Bloquear a conta destinatária e suspender as saídas pendentes.', why: 'Cada minuto de atraso converte saldo retido em transferência concluída e depois em criptomoeda.' },
          { text: 'Acionar o mecanismo de devolução e comunicar as instituições pagadoras e o operador do sistema.', why: 'A devolução depende da atuação coordenada entre pagador e recebedor, e tem janela curta.' },
          { text: 'Preservar registros das ordens recebidas, com assinatura, horário e origem.', why: 'São a evidência de que as ordens chegaram assinadas e a base da investigação e da defesa.' },
          { text: 'Revisar as demais contas abertas nos últimos 30 dias com perfil semelhante ao destinatário.', why: 'O mesmo esquema costuma usar várias contas novas, e a revisão evita a segunda onda.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Comece pelo que impede o dinheiro de sair.',
          'A devolução depende de avisar quem pagou.',
          'A revisão das contas semelhantes é importante, mas não é o primeiro passo.',
        ],
        explain:
          'Bloquear, acionar devolução e comunicar, preservar evidência e depois procurar as contas irmãs. A ordem reflete o que ainda é recuperável em cada minuto: dinheiro primeiro, prova depois, prevenção da próxima onda em seguida.',
      },
    ],
    closing:
      'A Aurora Pay bloqueou a conta em minutos e retiveram parte do valor; o Aurora Hub passou a conceder acesso temporário, guardar as chaves em módulo próprio e exigir duas pessoas para alto valor. O ponto central: assinatura válida prova que a chave foi usada, não que a ordem é legítima.',
    review: {
      solution: [
        'Às 0h14 havia quatro sinais disponíveis: valor fora do histórico da conta, cadastro de dez dias, porte incompatível e janela curta de madrugada; as saídas suspeitas só apareceram depois.',
        'No integrador, os controles eficazes são acesso de administração temporário com expiração, chave em módulo sem extração com registro de uso, separação de papéis com duas pessoas para alto valor e alerta por volume assinado.',
        'A resposta da madrugada segue a ordem: bloquear a conta, acionar devolução e comunicar, preservar registros e revisar contas semelhantes.',
      ],
      residual:
        'Parte do valor sai antes de qualquer bloqueio, e a conversão em criptomoeda torna a recuperação improvável. Além disso, um funcionário com acesso legítimo e aprovação de duas pessoas ainda pode agir em conluio.',
      validation:
        'Simule uma madrugada com créditos atípicos em ambiente de teste e meça quantos segundos o alerta leva para bloquear a conta; audite as concessões de acesso de administração e confirme que todas têm expiração e chamado associado.',
    },
  },
  sources: [
    {
      label: 'Banco Central do Brasil, Decisão 1214/2025-DERAD, de 9 de setembro de 2025 (instituição recebedora Nuoro Pay)',
      url: 'https://www.bcb.gov.br/conteudo/decap/DecisoesPix/DECISAO_1214_2025-BCB_DERAD.pdf',
      kind: 'primária',
    },
    {
      label: 'Banco Central do Brasil, Decisão 1409/2025-BCB/DERAD, de 11 de novembro de 2025 (instituição recebedora Brasil Cash)',
      url: 'https://www.bcb.gov.br/conteudo/decap/DecisoesPix/DECISAO_1409_2025-BCB_DERAD.pdf',
      kind: 'primária',
    },
    {
      label: 'LACNIC CSIRT, "The perfect storm: the largest cyberattack on Brazil\'s financial system" (2025-09-05)',
      url: 'https://blog.lacnic.net/en/the-perfect-storm-the-largest-cyberattack-on-brazils-financial-system/',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A07' },
    { framework: 'owasp-api-top10', id: 'API2' },
    { framework: 'cwe', id: 'CWE-250' },
  ],
  country: 'Brasil',
  tags: ['supply', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de comprometimento de credencial interna, custódia de chaves e análise de risco em tempo real.',
}
