import type { DossierContent } from '../types'

/* Dossiê: vazamento de dados de clientes da Netshoes e atuação do MPDFT (Brasil, 2018-2019). */

export const netshoes2018: DossierContent = {
  id: 'netshoes-2018',
  title: 'Netshoes (Brasil, 2018): dois milhões de cadastros e a recomendação de não pagar',
  subtitle: 'Quase dois milhões de contas de clientes foram expostas. O Ministério Público recomendou avisar todos os afetados e não pagar nada ao suposto autor, e o caso terminou em acordo de R$ 500 mil, antes da LGPD entrar em vigor.',
  incidentDate: '2018-01',
  publishedDate: '2018-01-26 (recomendação do MPDFT)',
  reviewed: '2026-10-19',
  summary: [
    'Em **25 de janeiro de 2018**, o Ministério Público do Distrito Federal e Territórios (MPDFT) expediu recomendação à Netshoes depois do vazamento de dados de clientes cadastrados no site. [1]',
    'Foram atingidas **1.999.704 contas**, com **nome, CPF, e-mail, data de nascimento e histórico de compras**; segundo o MPDFT, informações de cartão de crédito e senhas não foram reveladas. [1][2]',
    'A recomendação determinou que a empresa **comunicasse todos os clientes afetados** e que **se abstivesse de efetuar qualquer pagamento ao suposto autor do incidente**, em moeda real ou virtual. [1]',
    'A empresa tinha **três dias úteis** após o recebimento para informar se acataria a recomendação e quais medidas adotaria. [1]',
    'Em **fevereiro de 2019**, MPDFT e Netshoes firmaram acordo: a empresa pagaria **R$ 500 mil** ao Fundo de Defesa de Direitos Difusos como reparação por danos morais coletivos. [2]',
    'O acordo também previu medidas adicionais no programa de proteção de dados da empresa, esforços de orientação aos consumidores, campanha de conscientização sobre riscos cibernéticos e compartilhamento de boas práticas com o mercado; o descumprimento levaria a ação civil pública. [2]',
    'O termo de ajustamento de conduta correspondente consta como **TAC nº 001/2019** na relação da unidade especial do MPDFT. [3]',
  ],
  timeline: [
    { when: '2018-01-25', what: 'O MPDFT expede recomendação à empresa: comunicar todos os afetados e não pagar ao suposto autor do incidente.', source: 1 },
    { when: '2018-01-26', what: 'O MPDFT divulga publicamente a recomendação, com o número de contas atingidas e os dados envolvidos.', source: 1 },
    { when: '2018 (prazo de três dias úteis)', what: 'A empresa deve informar se acata a recomendação e quais medidas adotará.', source: 1 },
    { when: '2019-02-05', what: 'MPDFT e empresa firmam acordo de R$ 500 mil ao Fundo de Defesa de Direitos Difusos, com obrigações de conscientização e de programa de proteção de dados.', source: 2 },
  ],
  component: {
    name: 'Base de cadastro e histórico de compras de uma loja virtual de grande porte',
    trust:
      'Quem compra em uma loja virtual aceita informar documento, data de nascimento e endereço porque entende que isso serve à entrega e à nota fiscal. A pessoa não tem como verificar como esses dados são guardados, nem por quanto tempo, e confia que a loja limita quem pode lê-los.',
  },
  impact: [
    '1.999.704 contas de clientes com dados expostos. [1][2]',
    'Dados suficientes para fraude de identidade e abordagem direcionada: nome, CPF, e-mail, data de nascimento e histórico de compras. [1]',
    'Obrigação de comunicar todos os clientes afetados, determinada por recomendação do Ministério Público. [1]',
    'Pagamento de R$ 500 mil ao Fundo de Defesa de Direitos Difusos e compromissos de conscientização e governança. [2]',
  ],
  uncertainties: [
    'As fontes consultadas não dizem como o vazamento ocorreu nem quem o descobriu primeiro. [1][2]',
    'Circularam na época números maiores de registros afetados; o número confirmado pelo Ministério Público é 1.999.704 contas. [1]',
    'Não consta nas fontes consultadas se a empresa acatou integralmente a recomendação no prazo de três dias úteis. [1]',
    'O caso é anterior à vigência da LGPD, então não houve atuação de autoridade de proteção de dados: a resposta institucional veio do Ministério Público. [2]',
  ],
  analysis: [
    'A recomendação de não pagar ao suposto autor é a parte mais subestimada do caso: pagamento não devolve o dado, não impede a divulgação e financia o próximo ataque.',
    'A exigência de comunicar todos os afetados antecipou, em prática, o dever que a LGPD formalizaria depois. A dificuldade real é operacional: ter contato válido e mensagem clara para dois milhões de pessoas.',
    'Nome, CPF, data de nascimento e histórico de compras formam um pacote ideal para fraude: identificam a pessoa e dão contexto para uma abordagem convincente.',
    'A ausência de senhas e de dados de cartão limitou o dano imediato, e é um bom argumento para separar o que a loja realmente precisa guardar do que ela guarda por hábito.',
    'O valor do acordo é pequeno diante do número de afetados. O efeito prático ficou nas obrigações de governança e na conscientização, não na reparação individual.',
  ],
  lessons: [
    'Decida antes a política sobre extorsão: quem decide, o que se comunica e por que não se paga.',
    'Mantenha a capacidade de comunicar em massa: lista de contatos válida, modelo de mensagem revisado e canal para dúvidas que suporte o pico.',
    'Reduza o que a loja guarda: histórico de compras completo e documento só fazem sentido com prazo de retenção definido.',
    'Separe o ambiente que guarda cadastro do que serve o site, e limite o que cada serviço pode ler.',
    'Registre consultas em massa à base de clientes e alerte quando elas fugirem do padrão, porque o vazamento costuma começar por uma leitura legítima em excesso.',
  ],
  exercise: {
    title: 'Simulação: a loja Aurora Store e a mensagem do extorsionário',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Aurora Store** é uma loja virtual inventada com 1,4 milhão de clientes cadastrados. Nomes, números e endereços são inventados.',
      'Uma mensagem chega ao jurídico com uma amostra de 500 cadastros reais e a exigência de pagamento em criptomoeda para que o restante não seja publicado. A equipe confirma que a amostra é verdadeira.',
    ],
    objective: 'Decidir a resposta à extorsão, dimensionar a exposição a partir dos registros e organizar a comunicação a mais de um milhão de pessoas.',
    criteria: [
      'Você escolhe uma resposta à extorsão compatível com o interesse dos clientes.',
      'Você usa os registros para delimitar o que saiu, sem depender da palavra do extorsionário.',
      'Você organiza a comunicação de forma que ela seja útil e verificável.',
    ],
    evidence: [
      {
        id: 'amostra',
        title: 'Campos presentes na amostra recebida (fictício)',
        kind: 'table',
        from: 0,
        head: ['Campo', 'Na amostra?', 'Existe na base?', 'Último acesso em massa registrado'],
        rows: [
          ['nome, e-mail, data de nascimento', 'sim', 'sim', 'exportação de relatório, há 40 dias'],
          ['documento', 'sim', 'sim', 'exportação de relatório, há 40 dias'],
          ['histórico de compras', 'sim', 'sim', 'exportação de relatório, há 40 dias'],
          ['senha', 'não', 'armazenada com resumo criptográfico', 'nenhum'],
          ['dados de cartão', 'não', 'não armazenados (apenas no provedor de pagamento)', 'nenhum'],
        ],
        note: 'Compare os campos da amostra com o que a base guarda e com o último acesso em massa.',
      },
      {
        id: 'exportacao',
        title: 'Registro da exportação de relatório (fictício)',
        kind: 'code',
        from: 1,
        language: 'text',
        lines: [
          '[-40 dias 02:11] usuário relatorios-bi exporta 1.402.885 linhas da visão cliente_completo',
          '[-40 dias 02:14] arquivo de 980 MB enviado para armazenamento externo 198.51.100.61',
          '[-40 dias 02:20] nenhum alerta gerado: a conta tem permissão de exportação sem limite',
          '[-39 dias 09:00] relatório mensal de acessos mostra apenas o total de consultas do dia',
          '[hoje] a amostra recebida contém 500 linhas com os mesmos campos da visão cliente_completo',
        ],
        note: 'Veja qual visão foi exportada e quantas linhas ela tinha.',
      },
    ],
    activities: [
      {
        id: 'resposta-a-extorsao',
        kind: 'decide',
        title: 'A resposta à extorsão',
        prompt: 'A amostra é verdadeira e o prazo dado é de 48 horas. O que a Aurora Store faz?',
        options: [
          {
            text: 'Não pagar; registrar e preservar a comunicação recebida; acionar a autoridade policial; delimitar a exposição pelos próprios registros; comunicar os clientes afetados e a autoridade de proteção de dados com o que já se sabe; e forçar troca de senha com reforço de autenticação nas contas.',
            quality: 'best',
            flags: ['nao-paga', 'delimita', 'comunica'],
            feedback: 'Segue a orientação do caso real, usa a própria evidência para dimensionar e protege as contas sem depender da boa-fé do extorsionário.',
            consequence: 'A empresa conhece o tamanho real do vazamento, avisa os clientes antes da divulgação e não financia o próximo ataque.',
          },
          {
            text: 'Pagar o valor pedido para evitar a publicação e, depois, investigar com calma e sem pressão de prazo.',
            quality: 'poor',
            feedback: 'Pagamento não devolve o dado, não garante a não publicação e financia a continuidade do esquema; o Ministério Público recomendou expressamente não pagar.',
            consequence: 'Os dados circulam de todo modo, a empresa fica sem defesa pública e pode receber nova exigência semanas depois.',
          },
          {
            text: 'Negar publicamente o vazamento até ter certeza absoluta, afirmando que não houve comprometimento da infraestrutura.',
            quality: 'poor',
            feedback: 'Negar com amostra verdadeira em circulação destrói a credibilidade e atrasa a comunicação que os clientes precisam receber.',
            consequence: 'Quando a amostra aparece na imprensa, a empresa perde credibilidade e a comunicação sai sob pressão.',
          },
          {
            text: 'Não pagar e aguardar a eventual publicação antes de comunicar, para não gerar alarme sem necessidade.',
            quality: 'partial',
            feedback: 'A decisão de não pagar está certa, mas esperar a publicação entrega a notícia primeiro a quem atacou.',
            consequence: 'Os clientes descobrem pela imprensa, e a empresa responde depois pelo atraso na comunicação.',
          },
        ],
        hints: [
          'Pergunte o que o pagamento garante de fato.',
          'Delimitar a exposição não depende do extorsionário.',
          'Comunicar cedo com o que se sabe é diferente de comunicar tudo.',
        ],
        explain:
          'A resposta correta combina não pagar, preservar a prova, acionar a polícia, delimitar com os próprios registros, comunicar clientes e autoridade e proteger as contas. Pagar e negar são os dois caminhos que pioram a situação.',
      },
      {
        id: 'delimitar-exposicao',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que os registros mostram',
        prompt: 'Marque **todas** as conclusões que os registros da exportação sustentam.',
        options: [
          { text: 'Houve exportação de 1.402.885 linhas de uma visão com cadastro e histórico, há 40 dias, de madrugada.', feedback: 'Sim: é o registro direto e corresponde ao total de clientes cadastrados.' },
          { text: 'O arquivo exportado foi enviado para armazenamento externo.', feedback: 'Sim: o destino externo no registro liga a exportação à saída dos dados da empresa.' },
          { text: 'A amostra recebida tem exatamente os campos da visão exportada.', feedback: 'Sim: a coincidência de campos liga a amostra à exportação, sem precisar acreditar no extorsionário.' },
          { text: 'A conta usada na exportação não tinha limite nem gerava alerta.', feedback: 'Sim: a permissão sem limite explica por que uma exportação dessa dimensão passou sem nenhum alarme.' },
          { text: 'As senhas dos clientes foram expostas junto com o cadastro.', feedback: 'Não: a amostra não contém senha, e a base guarda apenas o resumo criptográfico delas.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Procure o número de linhas e o destino do arquivo.',
          'Compare os campos da amostra com os da visão exportada.',
          'Uma afirmação contraria a tabela de campos.',
        ],
        explain:
          'Os registros permitem afirmar o que saiu, quando, para onde e por que não houve alerta. Isso define o universo a comunicar sem depender do que o extorsionário diz ter.',
      },
      {
        id: 'comunicacao-em-massa',
        kind: 'order',
        title: 'A comunicação a 1,4 milhão de pessoas',
        prompt: 'Ordene as quatro etapas da comunicação, do que precisa existir antes do envio até o acompanhamento.',
        items: [
          { text: 'Fechar o texto com período, campos expostos, riscos concretos e o que a empresa está fazendo, revisado para não prometer o que não se sabe.', why: 'O conteúdo precisa estar correto antes do envio, porque não existe correção depois de um envio em massa.' },
          { text: 'Preparar o canal de dúvidas e a página de apoio para suportar o pico de acessos e perguntas.', why: 'A comunicação gera demanda imediata; sem canal, a mensagem produz frustração em vez de proteção.' },
          { text: 'Enviar em lotes, começando pelos clientes com dado sensível ou maior risco, e monitorar entrega e aberturas.', why: 'O envio em lotes permite corrigir rota e dá prioridade a quem corre mais risco.' },
          { text: 'Publicar atualização com o que mudou e manter o registro das comunicações enviadas e das respostas dadas.', why: 'O registro sustenta a demonstração de cumprimento e a atualização mantém a confiança durante o caso.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Pergunte o que é impossível desfazer depois de enviado.',
          'A capacidade de atender vem antes do envio.',
          'O registro das comunicações é o fecho, não o começo.',
        ],
        explain:
          'Texto correto, canal pronto, envio em lotes por prioridade e registro com atualização. A ordem evita o erro mais comum: disparar a mensagem antes de poder responder a quem a receber.',
      },
    ],
    closing:
      'A Aurora Store não pagou, delimitou o vazamento pelos próprios registros, avisou 1,4 milhão de clientes em lotes com canal de apoio pronto e passou a limitar exportações. O ponto central: a empresa precisa saber o que saiu antes de o extorsionário contar, e precisa poder avisar todo mundo.',
    review: {
      solution: [
        'A resposta correta à extorsão é não pagar, preservar a prova, acionar a polícia, delimitar com os registros, comunicar clientes e autoridade e proteger as contas.',
        'Os registros sustentam a exportação de 1.402.885 linhas há 40 dias, o envio para destino externo, a correspondência de campos com a amostra e a ausência de limite e de alerta na conta usada.',
        'A comunicação em massa exige texto fechado, canal de dúvidas pronto, envio em lotes por prioridade e registro com atualização posterior.',
      ],
      residual:
        'Os dados exportados continuam fora e podem ser publicados a qualquer momento; a comunicação reduz o efeito da fraude, mas não recupera a informação.',
      validation:
        'Tente exportar mais de dez mil linhas da visão de clientes com uma conta de relatórios e confirme a recusa com alerta; e teste o canal de dúvidas com uma simulação de pico equivalente a 1% da base.',
    },
  },
  sources: [
    {
      label: 'MPDFT, "MPDFT recomenda providências à Netshoes após vazamento de quase 2 milhões de dados de clientes" (2018-01-26)',
      url: 'https://www.mpdft.mp.br/portal/index.php/comunicacao-menu/sala-de-imprensa/noticias/noticias-2018/9775-mpdft-recomenda-providencias-a-netshoes-apos-vazamento-de-quase-2-milhoes-de-dados-de-clientes',
      kind: 'primária',
    },
    {
      label: 'MPDFT, "MPDFT e Netshoes firmam acordo para pagamento de danos morais coletivos após vazamento de dados" (2019-02-05)',
      url: 'https://www.mpdft.mp.br/portal/index.php/comunicacao-menu/sala-de-imprensa/noticias/noticias-2019/10570-mpdft-e-netshoes-firmam-acordo-para-pagamento-de-danos-morais-coletivos-apos-vazamento-de-dados',
      kind: 'primária',
    },
    {
      label: 'MPDFT, relação de termos de ajustamento de conduta da unidade especial de proteção de dados (TAC nº 001/2019)',
      url: 'https://www.mpdft.mp.br/portal/index.php/mpdft-acao/termos-de-ajustamento-de-conduta/10567-unidade-especial-de-protecao-de-dados-e-inteligencia-artificial-espec',
      kind: 'primária',
    },
  ],
  frameworks: [
    { framework: 'owasp-top10', id: 'A01' },
    { framework: 'owasp-top10', id: 'A09' },
  ],
  country: 'Brasil',
  tags: ['web', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de vazamento de base de clientes, resposta a extorsão e comunicação em massa.',
}
