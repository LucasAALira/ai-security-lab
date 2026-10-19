import type { DossierContent } from '../types'

/* Dossiê: falha na API do SCPA (DATASUS, Brasil, 2022) e a sanção da ANPD. Fatos com fonte numerada. */

export const datasusScpa2022: DossierContent = {
  id: 'datasus-scpa-2022',
  title: 'DATASUS/SCPA (Brasil, 2022): a API que respondia sobre qualquer CPF',
  subtitle: 'Uma API do sistema de cadastro e permissão de acesso do DATASUS devolvia dados cadastrais de qualquer CPF válido, sem autenticação prévia. A ANPD aplicou duas advertências e medidas corretivas ao Ministério da Saúde.',
  incidentDate: '2022-05-03',
  publishedDate: '2024-08-09 (decisão publicada no Diário Oficial, republicada em 2024-08-14)',
  reviewed: '2026-10-19',
  summary: [
    'Uma API do **Sistema de Cadastro e Permissão de Acesso (SCPA)**, gerido pelo DATASUS, permitia consultar dados de qualquer CPF válido no cadastro da Receita Federal que não estivesse cadastrado no SCPA, **sem autenticação prévia**. [1]',
    'Segundo nota técnica do Ministério da Saúde citada no relatório, a falha "decorreria de regra de negócio de aplicação que deixou falhas de segurança na API"; o ministério afirmou que a consulta era feita um CPF por vez, sem possibilidade de extração em massa. [1]',
    'A lista de campos considerada ao final do processo inclui **CPF, nome, nome da mãe, data de nascimento, número do título de eleitor, sexo, endereço e situação cadastral na Receita Federal**. [1]',
    'O Ministério da Saúde informou que a publicação que gerou a falha ficou disponível entre **27 de novembro de 2021 e 4 de maio de 2022**, e que corrigiu a API em **10 de maio de 2022**. [1]',
    'A ANPD registrou que uma denúncia já havia sido encaminhada pela Ouvidoria-Geral do SUS em **19 de novembro de 2021**, o que contraria a alegação do ministério de só ter tomado ciência em 3 de maio de 2022. [1]',
    'A comunicação geral aos titulares só foi publicada no site do ministério em **16 de setembro de 2022**, quase dois meses depois do primeiro prazo determinado pela fiscalização; antes disso foi lavrado o Auto de Infração nº 8/2022. [1]',
    'A ANPD concluiu pela violação dos **artigos 48 e 49 da LGPD** e aplicou **duas advertências com medidas corretivas**; multa não se aplica a órgão público, por força do art. 52, §3º. A decisão foi publicada no Diário Oficial em 9 de agosto de 2024 e republicada em 14 de agosto para corrigir parte das sanções. [1][3]',
    'O ministério recorreu pedindo que as medidas corretivas não tivessem prazo fixo. O voto do diretor-relator negou provimento, afirmando que fixar prazo "não constitui faculdade da ANPD", e manteve o prazo final de **31 de dezembro de 2025**. [2]',
  ],
  timeline: [
    { when: '2021-11-19', what: 'A Ouvidoria-Geral do SUS encaminha denúncia originada na CGU sobre a falha.', source: 1 },
    { when: '2021-11-27 a 2022-05-04', what: 'Período em que a publicação que gerou a falha ficou disponível, segundo o Ministério da Saúde.', source: 1 },
    { when: '2022-05-03', what: 'Data do incidente informada pelo ministério: a vulnerabilidade na API do SCPA é identificada.', source: 1 },
    { when: '2022-05-10', what: 'O ministério afirma ter corrigido a API para que ela não devolvesse mais os dados.', source: 1 },
    { when: '2022-09-16', what: 'O ministério publica o comunicado geral no site, depois do auto de infração.', source: 1 },
    { when: '2024-08-09', what: 'A decisão com duas advertências e medidas corretivas é publicada no Diário Oficial.', source: 3 },
    { when: '2025', what: 'O voto do relator nega provimento ao recurso e mantém o prazo de 31 de dezembro de 2025 para as medidas corretivas.', source: 2 },
  ],
  component: {
    name: 'API do Sistema de Cadastro e Permissão de Acesso (SCPA) do DATASUS',
    trust:
      'Um sistema de cadastro e permissão de acesso é a porta de entrada dos demais sistemas de saúde: quem usa confia que ele só confirma identidade para quem tem direito de perguntar. Uma consulta aberta nessa porta transforma o controle de acesso em serviço de consulta cadastral para qualquer um.',
  },
  impact: [
    'Dados cadastrais de qualquer CPF válido podiam ser consultados por quem conhecesse o caminho da API, sem credencial. [1]',
    'A ANPD não conseguiu determinar o número de titulares afetados e considerou que milhões de pessoas podiam ter sido alcançadas, inclusive crianças, adolescentes e idosos. [1]',
    'A comunicação aos titulares atrasou meses em relação ao determinado pela fiscalização. [1]',
    'O órgão recebeu duas advertências com medidas corretivas e prazo fixado pela autoridade. [1][2]',
  ],
  uncertainties: [
    'Não há número de titulares afetados nas fontes consultadas: o próprio processo registra a impossibilidade de determinar. [1]',
    'Boa parte do detalhe técnico está oculta na versão pública dos documentos, por sigilo do processo. [1][3]',
    'A afirmação de que não havia extração em massa é do ministério e não foi confirmada por evidência independente nas fontes consultadas. [1]',
    'A data real de início da exposição é controversa: a denúncia de novembro de 2021 e a data de incidente informada pelo ministério não coincidem. [1]',
  ],
  analysis: [
    'Este é o retrato de uma falha de autorização, e não de criptografia ou de senha fraca: a API respondia a quem perguntasse, bastando trocar o número do documento.',
    'O ministério descreveu a causa como regra de negócio da aplicação. É o padrão mais comum nesse tipo de falha: a verificação existia na tela, e não no serviço que responde.',
    'Dizer que a consulta era "um CPF por vez" não reduz muito o risco. Consulta individual sem limite e sem autenticação é consulta em lote com mais paciência.',
    'A parte mais caríssima do caso não foi a falha, foi a resposta: a demora em comunicar transformou um defeito de software em infração formal com sanção e prazo.',
    'A divergência entre a denúncia de novembro e a "data do incidente" mostra por que o registro de quem soube, quando, precisa existir antes do incidente.',
  ],
  lessons: [
    'Verifique autorização no serviço que devolve o dado, e não na tela que o exibe: cada endpoint decide por si quem pode perguntar o quê.',
    'Trate consulta por documento como operação sensível: exija autenticação, registre quem consultou e limite o volume por identidade.',
    'Devolva o mínimo necessário em cada resposta: campo que a tela não usa não deve sair do servidor.',
    'Tenha um fluxo único para denúncia e para incidente, com data de entrada registrada, para que a contagem de prazos não dependa de memória.',
    'Prepare o modelo de comunicação aos titulares antes: conteúdo mínimo, canal e responsável pela publicação.',
  ],
  exercise: {
    title: 'Simulação: o portal de agendamento de Vila Aurora',
    context: [
      'Esta é uma **simulação fictícia** inspirada no caso. A **Secretaria de Saúde de Vila Aurora** mantém um portal de agendamento inventado. Para preencher o formulário, a tela consulta um serviço interno que devolve os dados cadastrais do cidadão a partir do documento informado. Nomes, números e endereços são inventados.',
      'Uma pessoa de fora relata que conseguiu consultar dados de outras pessoas só trocando o número no endereço da consulta, sem estar autenticada. A equipe tem o registro de acesso dos últimos sete dias.',
    ],
    objective: 'Identificar a falha de autorização em uma consulta por documento, dimensionar a exposição com os dados disponíveis e decidir a correção e a comunicação.',
    criteria: [
      'Você identifica onde falta a verificação e qual dado sai além do necessário.',
      'Você usa o registro de acesso para estimar a exposição sem exagerar nem minimizar.',
      'Você escolhe uma correção que resolve no servidor e uma comunicação compatível com o prazo legal.',
    ],
    evidence: [
      {
        id: 'requisicao',
        title: 'Requisição e resposta do serviço de consulta (fictício)',
        kind: 'code',
        from: 0,
        language: 'http',
        lines: [
          'GET /api/cidadao?documento=000.000.000-00 HTTP/1.1',
          'Host: agendamento.vila-aurora.example',
          '(sem cabeçalho de autenticação)',
          '',
          'HTTP/1.1 200 OK',
          'Content-Type: application/json',
          '',
          '{',
          '  "nome": "...",',
          '  "nomeDaMae": "...",',
          '  "dataNascimento": "...",',
          '  "sexo": "...",',
          '  "endereco": { "logradouro": "...", "cep": "...", "municipio": "..." },',
          '  "situacaoCadastral": "regular",',
          '  "tituloEleitor": "..."',
          '}',
        ],
        note: 'Compare o que a tela de agendamento precisa mostrar com o que a resposta devolve.',
      },
      {
        id: 'registro-de-acesso',
        title: 'Resumo do registro de acesso dos últimos sete dias (fictício)',
        kind: 'table',
        from: 1,
        head: ['Origem', 'Consultas', 'Documentos distintos', 'Autenticadas', 'Intervalo médio entre consultas'],
        rows: [
          ['198.51.100.23', '41.280', '41.102', 'não', '0,4 s'],
          ['203.0.113.77', '860', '860', 'não', '3 s'],
          ['rede interna da secretaria', '2.140', '1.980', 'sim', '28 s'],
          ['aplicativo oficial', '15.300', '14.900', 'sim', '22 s'],
        ],
        note: 'Olhe as colunas de autenticação e de intervalo médio: elas descrevem comportamentos muito diferentes.',
      },
    ],
    activities: [
      {
        id: 'onde-esta-a-falha',
        kind: 'multi',
        variant: 'inspect',
        title: 'Onde está a falha',
        prompt: 'Marque **todos** os problemas que as evidências mostram no serviço de consulta.',
        options: [
          { text: 'O serviço responde sem exigir autenticação de quem pergunta.', feedback: 'Sim: é a falha central, porque a identidade de quem consulta nunca é verificada no servidor.' },
          { text: 'A resposta devolve campos que a tela de agendamento não precisa, como nome da mãe e título de eleitor.', feedback: 'Sim: devolver além do necessário aumenta o valor de cada consulta para quem abusa do serviço.' },
          { text: 'Não há limite de volume por origem: uma origem fez 41 mil consultas em sete dias.', feedback: 'Sim: sem limite, a consulta individual se transforma em extração em massa com tempo.' },
          { text: 'O serviço usa o documento do cidadão como parâmetro de consulta.', feedback: 'Não em si: consultar por documento é legítimo; o problema é responder a qualquer um e devolver tudo.' },
          { text: 'A resposta usa JSON em vez de um formato cifrado próprio.', feedback: 'Não: o formato da resposta não tem relação com a falha; o que falta é autorização e limite.' },
        ],
        correct: [0, 1, 2],
        hints: [
          'Pergunte quem o servidor acha que está perguntando.',
          'Compare o que a tela mostra com o que a resposta traz.',
          'Duas alternativas descrevem escolhas normais de projeto, e não falhas.',
        ],
        explain:
          'A falha se repete em três camadas: não há verificação de quem pergunta, a resposta devolve mais do que o necessário e não há limite por origem. Qualquer uma delas sozinha já é problema; juntas, produzem uma base de consulta aberta.',
      },
      {
        id: 'classificar-origens',
        kind: 'assign',
        variant: 'classify',
        title: 'O que cada origem indica',
        prompt: 'Classifique cada origem do registro de acesso conforme o que ela indica sobre a exposição.',
        rows: [
          { text: '198.51.100.23: 41.280 consultas, 41.102 documentos distintos, sem autenticação, uma a cada 0,4 s.', why: 'Volume alto, documentos quase todos distintos e intervalo curto descrevem varredura automatizada, não uso humano.' },
          { text: '203.0.113.77: 860 consultas, 860 documentos distintos, sem autenticação, uma a cada 3 s.', why: 'É menor, mas segue o mesmo padrão sem autenticação: exploração provável, em escala reduzida.' },
          { text: 'Rede interna da secretaria: 2.140 consultas autenticadas, intervalo de 28 s.', why: 'Consultas autenticadas em ritmo humano correspondem ao atendimento normal e servem de linha de base.' },
          { text: 'Aplicativo oficial: 15.300 consultas autenticadas, intervalo de 22 s.', why: 'Volume compatível com o uso do aplicativo e com autenticação presente: é o comportamento esperado.' },
        ],
        choices: ['Extração automatizada: tratar como exposição confirmada', 'Exploração provável, em menor escala', 'Uso esperado do serviço'],
        accept: [[0], [1], [2], [2]],
        hints: [
          'Compare sempre três colunas juntas: autenticação, documentos distintos e intervalo.',
          'Duas origens têm o mesmo padrão, em escalas diferentes.',
          'As origens autenticadas servem para definir o que é normal.',
        ],
        explain:
          'Classificar as origens dá o tamanho da exposição: dois comportamentos sem autenticação, um deles claramente automatizado, e duas linhas de base de uso legítimo. Esse é o número que entra na comunicação aos titulares, com a ressalva do período sem registro.',
      },
      {
        id: 'correcao-e-comunicacao',
        kind: 'decide',
        title: 'A correção e a comunicação',
        prompt: 'O que a secretaria deve fazer nas próximas 48 horas?',
        options: [
          {
            text: 'Exigir autenticação e autorização no próprio serviço, devolver somente os campos que a tela usa, aplicar limite por identidade e por origem com alerta de volume, ampliar a retenção do registro de consultas e preparar a comunicação aos titulares com o período, os campos expostos e as medidas tomadas.',
            quality: 'best',
            flags: ['autorizacao', 'minimo', 'limite', 'comunica'],
            feedback: 'Corrige no lugar certo, reduz o valor de cada resposta, cria detecção para a próxima vez e cumpre o dever de informar com conteúdo útil.',
            consequence: 'A consulta deixa de responder a quem não tem direito, o abuso passa a gerar alerta e a comunicação sai dentro do prazo, com números defensáveis.',
          },
          {
            text: 'Bloquear as duas faixas de rede que aparecem no registro e manter o serviço como está, porque o portal oficial continua funcionando.',
            quality: 'poor',
            feedback: 'Bloquear endereço não corrige a falta de autorização: outra origem repete a varredura em minutos.',
            consequence: 'As consultas voltam de outra origem no dia seguinte e a exposição continua, agora com registro mostrando que o órgão sabia.',
          },
          {
            text: 'Esconder o caminho da API, trocando o endereço do serviço e removendo-o da documentação pública.',
            quality: 'poor',
            feedback: 'Trocar o endereço é obscuridade, não controle: o caminho novo aparece no tráfego do próprio portal.',
            consequence: 'Quem já automatizou a consulta descobre o novo caminho pelo aplicativo e a exposição permanece.',
          },
          {
            text: 'Exigir autenticação no serviço e encerrar o caso, deixando a comunicação aos titulares para depois do fim da apuração interna.',
            quality: 'partial',
            feedback: 'A correção principal está certa, mas adiar a comunicação é justamente o que transformou o caso real em infração formal.',
            consequence: 'A falha para, e o órgão responde depois pela comunicação tardia, com prazo determinado pela autoridade.',
          },
        ],
        hints: [
          'Pergunte onde a verificação precisa existir para valer sempre.',
          'Além de fechar, pense em reduzir o dado devolvido e em detectar volume.',
          'Há uma obrigação que não espera o fim da apuração.',
        ],
        explain:
          'A correção eficaz tem quatro partes: autorização no serviço, resposta mínima, limite com alerta e retenção suficiente para apurar. A comunicação aos titulares corre em paralelo, com o que já se sabe, porque o prazo não espera a investigação terminar.',
      },
    ],
    closing:
      'Vila Aurora fechou a consulta no servidor, reduziu a resposta ao necessário, passou a limitar e alertar, e comunicou os titulares no prazo com números defensáveis. O ponto central: consulta por documento sem autorização é uma base de dados pública por acidente.',
    review: {
      solution: [
        'A falha está em três camadas: ausência de verificação de quem pergunta, resposta com campos além do necessário e falta de limite por origem.',
        'O registro de acesso mostra duas origens não autenticadas, uma delas automatizada (41 mil consultas, intervalo de 0,4 s), e duas origens autenticadas que servem de linha de base.',
        'A resposta correta corrige a autorização no serviço, reduz os campos devolvidos, aplica limite com alerta, amplia a retenção e comunica os titulares com período, campos e medidas.',
      ],
      residual:
        'Resta o que aconteceu antes do início da retenção de registros, que não pode ser dimensionado, e o uso posterior dos dados já extraídos, que nenhuma correção técnica desfaz.',
      validation:
        'Reproduza a consulta sem credencial e confirme a recusa; rode um teste de volume autenticado e verifique se o alerta dispara; e confira na resposta que apenas os campos usados pela tela são devolvidos.',
    },
  },
  sources: [
    {
      label: 'ANPD, Relatório de Instrução nº 4/2024/FIS/CGF (processo nº 00261.001882/2022-73, versão pública)',
      url: 'https://www.gov.br/anpd/pt-br/centrais-de-conteudo/relatorio_de_instrucao_no_4_2024_fis_cgf_anpd_v-publica.pdf',
      kind: 'primária',
    },
    {
      label: 'ANPD, votos do Circuito Deliberativo CD 37/2025 (recurso do Ministério da Saúde no mesmo processo)',
      url: 'https://www.gov.br/anpd/pt-br/assuntos/deliberacoes-do-conselho-diretor/circuitos-deliberativos-ano-2025/cd-37-2025-votos.pdf/@@display-file/file',
      kind: 'primária',
    },
    {
      label: 'Convergência Digital, "ANPD aplica sanção ao Ministério da Saúde por invasão de sistema" (2024-08-14)',
      url: 'https://convergenciadigital.com.br/?p=32652',
      kind: 'secundária',
    },
  ],
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API1' },
    { framework: 'owasp-api-top10', id: 'API3' },
    { framework: 'cwe', id: 'CWE-862' },
  ],
  country: 'Brasil',
  tags: ['api', 'sem-ia'],
  notice: 'Este caso não envolve inteligência artificial: o dossiê trata de autorização em API, minimização de dados e comunicação de incidente.',
}
