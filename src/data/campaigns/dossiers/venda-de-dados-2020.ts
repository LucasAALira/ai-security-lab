import type { DossierContent } from '../types'

/* Dossiê: ações do MPDFT contra sites que vendiam dados pessoais (Brasil, 2020-2021). */

export const vendaDeDados2020: DossierContent = {
  id: 'venda-de-dados-2020',
  title: 'Venda de dados pessoais (Brasil, 2020): a primeira ação civil pública com base na LGPD',
  subtitle: 'Sites vendiam listas de nomes, documentos, telefones e profissões por valores entre R$ 42 e R$ 212,90. O Ministério Público foi à Justiça e, no ano seguinte, obteve decisão determinando o fim da venda e a exclusão dos dados.',
  incidentDate: '2020-09',
  publishedDate: '2020-09-22 (divulgação da ação civil pública)',
  reviewed: '2026-10-19',
  summary: [
    'Em **21 de setembro de 2020**, o MPDFT ajuizou a sua **primeira ação civil pública com base na LGPD**, contra uma empresa sediada em Belo Horizonte que comercializava informações pessoais em um site. [1]',
    'O site vendia **nomes, e-mails, endereços postais e contatos para SMS**, com bairro, cidade, estado e CEP, em listas **segmentadas por profissão** (por exemplo, cabeleireiros, corretores de imóveis e médicos). Os pacotes custavam de **R$ 42 a R$ 212,90**. [1]',
    'Segundo a ação, acredita-se que **só em São Paulo 500 mil pessoas nascidas no município** tenham sido expostas indevidamente, e vítimas foram identificadas em todos os estados. [1]',
    'O Ministério Público pediu **tutela liminar de urgência**, que a empresa se abstivesse de divulgar, de forma paga ou gratuita, os dados pessoais das vítimas, e o **bloqueio imediato do domínio** do site até a decisão. [1]',
    'Em outra ação, ajuizada em **13 de outubro de 2020** (processo nº 0733646-87.2020.8.07.0001), o MPDFT atacou o site **Facilitavirtual.com.br**, que vendia nomes, endereços, telefones, e-mails e profissões a empresas e a quem quisesse anunciar produtos ou serviços. [2]',
    'Em **2 de agosto de 2021**, o Tribunal de Justiça do Distrito Federal e Territórios julgou procedente o pedido em primeira instância: a decisão determinou **parar a venda de dados pessoais**, inclusive gratuitamente ou em formato físico, e **excluir os dados tratados de forma ilícita**, sob pena de desativação do site e multa. [2]',
    'O MPDFT também obteve, em 2020, a retirada do ar de site que vendia dados pessoais em caso correlato. [3]',
  ],
  timeline: [
    { when: '2020-09-21', what: 'O MPDFT ajuíza a primeira ação civil pública com base na LGPD contra empresa que vendia dados pessoais.', source: 1 },
    { when: '2020-09-22', what: 'O órgão divulga a ação, com a descrição dos pacotes vendidos e a estimativa de vítimas.', source: 1 },
    { when: '2020-10-13', what: 'É ajuizada a ação contra o site Facilitavirtual.com.br, que vendia nomes, endereços, telefones, e-mails e profissões.', source: 2 },
    { when: '2020', what: 'Em caso correlato, o MPDFT consegue a retirada do ar de site que vendia dados pessoais.', source: 3 },
    { when: '2021-08-02', what: 'A Justiça determina o fim da venda de dados, inclusive gratuita ou física, e a exclusão dos dados tratados de forma ilícita, sob pena de desativação e multa.', source: 2 },
  ],
  component: {
    name: 'Sites de comercialização de listas de dados pessoais segmentadas por profissão e localidade',
    trust:
      'Ninguém entrega dados a um site de listas: eles chegam lá pela soma de pequenos vazamentos, cadastros revendidos e coletas automáticas. A pessoa descobre que está no mercado quando recebe a ligação, e não tem a quem pedir a exclusão.',
  },
  impact: [
    'Listas com nome, documento, telefone, endereço e profissão vendidas por valores a partir de R$ 42. [1]',
    'Estimativa de 500 mil pessoas expostas apenas entre nascidos no município de São Paulo, com vítimas em todos os estados. [1]',
    'Decisão judicial determinando parar a venda, inclusive gratuita, e excluir os dados tratados de forma ilícita. [2]',
    'Primeiro uso da LGPD como fundamento de ação civil pública pelo Ministério Público do Distrito Federal. [1]',
  ],
  uncertainties: [
    'As fontes consultadas não informam a origem dos dados vendidos: não há identificação de qual vazamento ou cadastro os alimentou. [1][2]',
    'A notícia sobre a primeira ação não nomeia a empresa; a decisão de 2021 trata de outro site, de forma que são ações distintas e não um mesmo caso em duas etapas. [1][2]',
    'Não consta nas fontes consultadas o número total de pessoas cujos dados estavam nas bases, apenas a estimativa parcial. [1]',
    'Não foi verificado, nesta revisão, o cumprimento efetivo da decisão nem eventual recurso. [2]',
  ],
  analysis: [
    'O mercado de listas é o destino final de muitos vazamentos pequenos. Cada incidente que parece inofensivo alimenta um agregado que vale dinheiro.',
    'A segmentação por profissão mostra o valor do dado combinado: não é o nome que vale, é o nome junto com a ocupação, a cidade e o telefone.',
    'Preços baixos são o dado mais revelador do caso. Alguns reais por centenas de contatos significam que a barreira econômica para abordar uma pessoa é quase zero.',
    'A decisão que proíbe a venda "inclusive gratuitamente" fecha a saída mais óbvia: continuar distribuindo sem cobrar para manter a operação.',
    'Para quem desenvolve, o recado é sobre exportação e integração: toda saída em lote de uma base de clientes é um candidato a abastecer esse mercado.',
  ],
  lessons: [
    'Controle a exportação em lote: limite por usuário, aprovação e registro, porque é por ela que a base vira lista.',
    'Trate profissão, localidade e telefone como dados que aumentam o valor do conjunto, mesmo quando isolados pareçam inofensivos.',
    'Revise fornecedores e parceiros que recebem listas suas: a cláusula de uso precisa de verificação, não só de assinatura.',
    'Não compre listas: além do risco jurídico, a base entra no seu ambiente sem base legal e contamina o seu tratamento.',
    'Ofereça canal simples de exclusão e registre os pedidos, porque é o que diferencia a sua base de um mercado de listas.',
  ],
  exercise: {
    title: 'Simulação: a lista que chegou ao time comercial da Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada nos casos. A **Aurora Serviços** é uma empresa inventada. O time comercial comprou, por R$ 180, uma lista com 40 mil contatos segmentados por profissão e cidade, e pede ao time de tecnologia que a importe no sistema de atendimento. Nomes, números e endereços são inventados.',
      'O time de tecnologia precisa responder ao pedido e, no mesmo dia, descobre que uma exportação de 60 mil linhas da própria base de clientes saiu há três meses por uma conta de integração.',
    ],
    objective: 'Decidir o que fazer com a lista comprada, identificar como a própria base pode estar alimentando esse mercado e definir os controles de exportação.',
    criteria: [
      'Você recusa a importação com fundamento, e não apenas por desconfiança.',
      'Você identifica no registro o que caracteriza saída em lote indevida.',
      'Você escolhe controles que impedem a repetição sem travar a operação legítima.',
    ],
    evidence: [
      {
        id: 'lista-comprada',
        title: 'Amostra da lista comprada (fictícia)',
        kind: 'table',
        from: 0,
        head: ['Campo', 'Presente?', 'Origem declarada pelo vendedor', 'Consta pedido de contato?'],
        rows: [
          ['nome e telefone', 'sim', '"fontes públicas"', 'não'],
          ['documento', 'sim', '"fontes públicas"', 'não'],
          ['profissão e cidade', 'sim', '"segmentação própria"', 'não'],
          ['e-mail', 'sim', '"opt-in"', 'sem comprovação'],
        ],
        note: 'Repare na coluna da origem declarada e na ausência de qualquer comprovação de pedido de contato.',
      },
      {
        id: 'exportacao-propria',
        title: 'Exportação saída da base da Aurora (fictício)',
        kind: 'code',
        from: 1,
        language: 'text',
        lines: [
          '[-90 dias 23:40] conta integracao-crm consulta a visão cliente_contato em lote: 60.000 linhas',
          '[-90 dias 23:52] resultado gravado em arquivo e enviado para 203.0.113.55',
          '[-90 dias 23:55] nenhuma aprovação associada: a conta tem permissão permanente de leitura em lote',
          '[-89 dias] o contrato com o parceiro de CRM previa apenas sincronização de clientes ativos (12.400 registros)',
          '[hoje] a lista comprada contém 3.100 contatos que também constam da base da Aurora',
        ],
        note: 'Compare o volume exportado com o volume previsto no contrato.',
      },
    ],
    activities: [
      {
        id: 'importar-ou-nao',
        kind: 'decide',
        title: 'O pedido do time comercial',
        prompt: 'O time comercial quer a lista importada hoje. Qual a resposta do time de tecnologia?',
        options: [
          {
            text: 'Recusar a importação, registrando o motivo: não há base legal nem origem demonstrável para os dados; propor alternativa legítima de prospecção (canais próprios, consentimento verificável, listas de empresas em vez de pessoas) e levar o caso ao encarregado, já que a compra em si precisa ser avaliada.',
            quality: 'best',
            flags: ['recusa', 'alternativa', 'encarregado'],
            feedback: 'Resolve o pedido sem criar tratamento sem base legal, oferece caminho de trabalho ao time comercial e aciona quem tem competência para avaliar a compra.',
            consequence: 'A lista não entra no ambiente, o time comercial recebe uma alternativa viável e a empresa evita responder por tratamento sem base legal.',
          },
          {
            text: 'Importar apenas os e-mails marcados como "opt-in" pelo vendedor, descartando os demais campos.',
            quality: 'poor',
            feedback: 'A marcação de consentimento não tem comprovação, e importar com base em declaração do vendedor transfere para a empresa um tratamento que ela não pode demonstrar.',
            consequence: 'A empresa passa a enviar mensagens sem poder comprovar consentimento e torna-se a responsável perante os titulares.',
          },
          {
            text: 'Importar tudo em um ambiente separado, usar para prospecção e excluir depois de 90 dias.',
            quality: 'poor',
            feedback: 'Isolar o ambiente não cria base legal, e o prazo curto não corrige a origem: o tratamento é irregular desde o primeiro contato.',
            consequence: 'As abordagens acontecem, os titulares reclamam e a empresa não tem como justificar de onde tirou os dados.',
          },
          {
            text: 'Importar somente os 3.100 contatos que já constam da base de clientes da Aurora, por já serem conhecidos.',
            quality: 'partial',
            feedback: 'Para esses contatos a empresa já tem relação e base própria, então a lista é desnecessária, e o cruzamento ainda importa dado de origem duvidosa.',
            consequence: 'A empresa mistura dado de origem duvidosa com a própria base e perde a rastreabilidade de onde cada campo veio.',
          },
        ],
        hints: [
          'Pergunte o que a empresa responderia a um titular que questionasse a origem.',
          'Declaração do vendedor não é comprovação.',
          'Há um caminho que resolve o problema do time comercial sem a lista.',
        ],
        explain:
          'Comprar lista transfere o problema para quem compra: sem origem demonstrável, não há base legal nem resposta ao titular. A recusa fundamentada com alternativa é o que resolve de fato o pedido comercial.',
      },
      {
        id: 'saida-em-lote',
        kind: 'multi',
        variant: 'inspect',
        title: 'O que caracteriza a saída indevida',
        prompt: 'Marque **todos** os elementos do registro que caracterizam exportação indevida da base da Aurora.',
        options: [
          { text: 'Volume de 60.000 linhas, muito acima dos 12.400 registros de clientes ativos previstos em contrato.', feedback: 'Sim: o contrato delimita o escopo, e exportar cinco vezes mais caracteriza saída fora do previsto.' },
          { text: 'Envio do arquivo para um destino externo sem aprovação associada.', feedback: 'Sim: a saída para fora do ambiente, sem aprovação, é o momento em que a empresa perde o controle do dado.' },
          { text: 'Permissão permanente de leitura em lote na conta de integração.', feedback: 'Sim: permissão permanente e sem limite transforma uma integração em canal aberto de exportação.' },
          { text: 'A presença de 3.100 contatos da base entre os da lista comprada.', feedback: 'Sim: é o indício que liga a exportação ao mercado de listas, ainda que não prove o caminho exato.' },
          { text: 'A exportação ter ocorrido às 23h40.', feedback: 'Não isoladamente: horário noturno é comum em integração automatizada e, sozinho, não caracteriza nada.' },
        ],
        correct: [0, 1, 2, 3],
        hints: [
          'Compare o volume exportado com o previsto no contrato.',
          'Procure o que faltava para autorizar a saída.',
          'Um dos itens é apenas característico de rotina automatizada.',
        ],
        explain:
          'O que caracteriza a saída indevida é o excesso em relação ao contrato, o destino externo sem aprovação, a permissão permanente em lote e a coincidência com a lista no mercado. O horário, por si, não diz nada.',
      },
      {
        id: 'controles-de-exportacao',
        kind: 'order',
        title: 'Os controles de exportação',
        prompt: 'Ordene as quatro medidas, da que impede a próxima exportação indevida à que mantém a operação legítima funcionando.',
        items: [
          { text: 'Remover a permissão permanente de leitura em lote e substituí-la por autorização por solicitação, com validade curta.', why: 'Enquanto a permissão permanente existir, qualquer credencial comprometida ou uso indevido repete a exportação.' },
          { text: 'Limitar o volume por solicitação e por dia, com alerta quando o limite for atingido.', why: 'O limite transforma uma extração silenciosa em evento visível, mesmo quando a autorização existe.' },
          { text: 'Restringir a visão exportável aos campos previstos em contrato, recusando os demais.', why: 'Mesmo autorizada, a exportação não deve poder levar campos fora do escopo acordado.' },
          { text: 'Publicar um procedimento de exportação com responsável e registro, para que a operação legítima continue previsível.', why: 'Sem caminho oficial, as equipes contornam o controle, e o procedimento é o que mantém o uso legítimo funcionando.' },
        ],
        before: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
        hints: [
          'Comece pelo que hoje permite a exportação sem ninguém aprovar.',
          'Depois venha o que torna o volume visível.',
          'O procedimento oficial é o último passo, para o legítimo não virar contorno.',
        ],
        explain:
          'Primeiro retirar a permissão permanente, depois limitar e alertar, depois restringir os campos ao escopo contratual e, por fim, oficializar o caminho legítimo. Sem a última etapa, o controle é contornado pela própria equipe.',
      },
    ],
    closing:
      'A Aurora recusou a lista com fundamento, ofereceu alternativa ao time comercial, identificou a exportação fora do contrato e trocou a permissão permanente por autorização com limite e escopo. O ponto central: o mercado de listas é alimentado por exportações que ninguém aprovou e por compras que ninguém questionou.',
    review: {
      solution: [
        'A importação deve ser recusada por falta de base legal e de origem demonstrável, com alternativa de prospecção e acionamento do encarregado para avaliar a compra.',
        'A saída indevida se caracteriza pelo volume acima do contrato, pelo destino externo sem aprovação, pela permissão permanente de leitura em lote e pela coincidência de contatos com a lista comprada.',
        'Os controles seguem a ordem: retirar a permissão permanente, limitar volume com alerta, restringir os campos ao escopo contratual e publicar o procedimento oficial de exportação.',
      ],
      residual:
        'Os dados já exportados continuam circulando e podem reaparecer em outras listas; a origem exata da lista comprada provavelmente nunca será determinada.',
      validation:
        'Tente exportar a visão de contatos com a conta de integração e confirme a recusa sem autorização válida; verifique se o alerta de volume chega ao time de segurança; e confirme que campos fora do escopo contratual não aparecem no arquivo gerado.',
    },
  },
  sources: [
    {
      label: 'MPDFT, "MPDFT ajuíza 1ª ação civil pública com base na LGPD" (2020-09-22)',
      url: 'https://www.mpdft.mp.br/portal/index.php/comunicacao-menu/sala-de-imprensa/noticias/noticias-2020/12384-mpdft-ajuiza-1-acao-civil-publica-com-base-na-lgpd',
      kind: 'primária',
    },
    {
      label: 'MPDFT, "Justiça atende ação do MPDFT e determina suspensão de site que vende dados pessoais" (2021-08-02)',
      url: 'https://www.mpdft.mp.br/portal/index.php/comunicacao-menu/sala-de-imprensa/noticias/noticias-2021/13306-justica-atende-acao-do-mpdft-e-determina-suspensao-de-site-que-vende-dados-pessoais',
      kind: 'primária',
    },
    {
      label: 'MPDFT, "MPDFT consegue retirar do ar site que vende dados pessoais" (2020)',
      url: 'https://www.mpdft.mp.br/portal/index.php/comunicacao-menu/sala-de-imprensa/noticias/noticias-2020/12499-mpdft-consegue-retirar-do-ar-site-que-vende-dados-pessoais',
      kind: 'primária',
    },
  ],
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API6' },
    { framework: 'owasp-top10', id: 'A01' },
  ],
  country: 'Brasil',
  tags: ['governanca', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de comércio de dados pessoais, exportação em lote e base legal de tratamento.',
}
