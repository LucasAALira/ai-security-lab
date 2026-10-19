import type { Lesson } from './types'

/* Aulas da área Governança. Texto próprio. Não é orientação jurídica: os textos explicam
   conceitos e apontam as fontes oficiais para consulta. */

export const govLessons: Record<string, Lesson> = {
  'gov-samm': {
    context: 'A diretoria pediu "um programa de segurança de aplicações" e um orçamento. Ninguém sabia por onde começar nem como medir avanço.',
    concept: [
      'O **OWASP SAMM** (Software Assurance Maturity Model) organiza um programa de segurança de software em cinco funções de negócio: governança, design, implementação, verificação e operações. Cada função tem práticas, e cada prática tem níveis de maturidade.',
      'O uso típico é avaliar onde a organização está hoje, escolher um alvo realista para as práticas que mais importam e planejar o caminho em etapas. O modelo não exige nível máximo em tudo: o alvo depende do risco e do contexto.',
    ],
    deeper: ['Uma avaliação útil cita evidências (um processo que existe, um registro, um teste), e não só respostas "sim" em entrevistas. Repetir a avaliação depois de alguns meses mostra se o plano avançou.'],
    validation: 'Faça a avaliação de uma prática com evidências, defina o nível-alvo e duas ações para chegar lá. Repita a avaliação no prazo combinado e compare.',
    review: [
      { front: 'Quais são as cinco funções do SAMM?', back: 'Governança, design, implementação, verificação e operações.' },
      { front: 'É preciso chegar ao nível máximo em todas as práticas?', back: 'Não. O alvo de cada prática depende do risco e do contexto.' },
    ],
    links: [{ label: 'OWASP SAMM', url: 'https://owaspsamm.org/' }],
  },
  'gov-ssdf': {
    context: 'Um cliente pediu que a empresa demonstrasse "práticas de desenvolvimento seguro alinhadas ao SSDF".',
    concept: [
      'O **NIST SSDF** (SP 800-218) descreve práticas de desenvolvimento seguro em quatro grupos: **PO**, preparar a organização; **PS**, proteger o software; **PW**, produzir software bem protegido; **RV**, responder a vulnerabilidades.',
      'Ele não prescreve ferramentas: diz o que deve acontecer (por exemplo, proteger o código contra alteração não autorizada, revisar código, ter um processo para receber e tratar vulnerabilidades). Mapear as práticas atuais aos grupos mostra lacunas e ajuda a responder a clientes com evidências.',
    ],
    example: {
      title: 'Mapeamento resumido',
      language: 'text',
      code: ['PO.5  ambientes de build separados e protegidos  → runners efêmeros por execução', 'PS.1  proteger o código contra alteração         → proteção de branch e revisão obrigatória', 'PW.4  reaproveitar componentes bem protegidos    → política de dependências e SBOM', 'RV.1  identificar e confirmar vulnerabilidades    → canal de reporte e triagem com prazo'],
      caption: 'Cada linha liga uma prática a algo que existe e pode ser mostrado.',
    },
    validation: 'Para cada grupo do SSDF, liste ao menos uma prática atual e a evidência dela. As práticas sem evidência são as primeiras lacunas a tratar.',
    review: [
      { front: 'Quais são os quatro grupos do SSDF?', back: 'PO (preparar a organização), PS (proteger o software), PW (produzir software bem protegido) e RV (responder a vulnerabilidades).' },
      { front: 'O SSDF exige ferramentas específicas?', back: 'Não. Ele descreve o que deve acontecer, e cada organização escolhe como.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PO.5' }, { framework: 'nist-ssdf', id: 'PS.1' }, { framework: 'nist-ssdf', id: 'PW.4' }, { framework: 'nist-ssdf', id: 'RV.1' }],
  },
  'gov-requisitos': {
    context: 'O documento do projeto dizia "o sistema deve ser seguro". Ninguém conseguia dizer, no fim, se o requisito foi cumprido.',
    concept: [
      'Um requisito de segurança útil é **testável**: diz o que deve acontecer, em que condição, e como verificar. "O sistema deve ser seguro" não é testável; "um usuário só obtém pedidos da própria conta, e o teste com dois usuários falha se isso mudar" é.',
      'Catálogos como o **OWASP ASVS** e o **MASVS** ajudam a escolher requisitos por nível de risco. Cada requisito escolhido vira critério de aceite e, quando possível, um teste automatizado.',
    ],
    example: {
      title: 'De vago a testável',
      language: 'text',
      code: ['vago:     o login deve ser protegido', 'testável: após 10 tentativas falhas em 15 minutos para uma conta,', '          novas tentativas são recusadas por 15 minutos, e um teste automatizado', '          comprova isso a cada mudança no serviço de autenticação'],
      caption: 'O requisito testável diz o comportamento, a condição e a verificação.',
    },
    figure: 'ciclo-governanca',
    validation: 'Pegue três requisitos de segurança de um projeto e escreva, para cada um, o teste que comprova o cumprimento. Requisitos para os quais não existe teste precisam ser reescritos.',
    review: [
      { front: 'O que torna um requisito de segurança testável?', back: 'Dizer o comportamento, a condição e como verificar.' },
      { front: 'Para que servem catálogos como o ASVS?', back: 'Para escolher requisitos adequados ao nível de risco.' },
    ],
    links: [
      { label: 'OWASP ASVS', url: 'https://owasp.org/www-project-application-security-verification-standard/' },
      { label: 'OWASP MASVS', url: 'https://mas.owasp.org/MASVS/' },
    ],
  },
  'gov-vulnerabilidades': {
    context: 'O relatório de dependências tinha 1.200 alertas. A equipe tinha uma semana para corrigir o que importava.',
    concept: [
      'Priorizar vulnerabilidades combina **gravidade técnica** (por exemplo, a nota CVSS), **probabilidade de exploração** (exploração conhecida, catálogos como o KEV da CISA, estimativas como o EPSS) e **contexto** (o código vulnerável é alcançável? O sistema está exposto? Que dados ele trata?).',
      'Uma nota alta em um componente que não roda em produção pode esperar; uma nota média em um serviço exposto com exploração conhecida, não. Prazos por faixa de risco, donos definidos e exceções registradas com data de expiração mantêm a fila sob controle.',
    ],
    validation: 'Para uma amostra de alertas, registre gravidade, sinais de exploração, exposição e alcance. Confira se a ordem de correção resultante difere da ordem só pela nota, e se cada exceção tem dono e prazo.',
    review: [
      { front: 'Que três fatores combinar ao priorizar vulnerabilidades?', back: 'Gravidade técnica, probabilidade de exploração e contexto.' },
      { front: 'O que toda exceção de correção precisa ter?', back: 'Dono, justificativa e data de expiração.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }],
    links: [
      { label: 'FIRST — CVSS', url: 'https://www.first.org/cvss/' },
      { label: 'FIRST — EPSS', url: 'https://www.first.org/epss/' },
      { label: 'CISA — Known Exploited Vulnerabilities', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
    ],
  },
  'gov-papeis-fornecedores': {
    context: 'Depois de um vazamento no fornecedor de atendimento com IA, a empresa descobriu que o contrato não dizia em quanto tempo ele avisaria.',
    concept: [
      'Governar um sistema de IA começa por **papéis claros**: quem é dono do sistema, quem aprova mudanças no modelo e nos dados, quem acompanha riscos, quem responde a incidentes. Sem nomes, as decisões ficam sem dono.',
      'Com fornecedores, os contratos e avaliações cobrem o que importa para o risco: que dados vão para o fornecedor e para que uso (inclusive treinamento), onde ficam, por quanto tempo, quem mais os acessa, como e em que prazo incidentes são comunicados, e o que acontece no fim do contrato.',
    ],
    validation: 'Para um sistema de IA, preencha uma matriz de responsabilidades com um nome por papel. Para cada fornecedor, confira se o contrato responde às perguntas de dados, uso, prazo de aviso de incidentes e saída.',
    review: [
      { front: 'Que papéis um sistema de IA precisa ter definidos?', back: 'Dono do sistema, aprovador de mudanças, acompanhamento de riscos e resposta a incidentes.' },
      { front: 'Que perguntas fazer a um fornecedor de IA?', back: 'Que dados recebe e para que uso, onde ficam, por quanto tempo, quem acessa, prazo de aviso de incidentes e o que ocorre no fim do contrato.' },
    ],
    links: [{ label: 'NIST AI RMF', url: 'https://www.nist.gov/itl/ai-risk-management-framework' }],
  },
  'gov-evidencias': {
    context: 'Na auditoria, a equipe garantia que os testes de segurança do assistente rodavam a cada versão. Não havia registro de nenhuma execução.',
    concept: [
      'Uma **evidência** mostra que um controle existe e funciona: o registro de uma execução de teste, a configuração aplicada, a aprovação de uma mudança, a revisão de acessos feita. Ela tem data, origem e pode ser conferida por outra pessoa.',
      'Acompanhar riscos é manter um registro vivo: cada risco com dono, controles, evidências, risco residual e data de revisão. Evidências geradas automaticamente pelo processo (a pipeline registra o teste, o sistema registra a aprovação) custam menos e são mais confiáveis do que coletas manuais às vésperas da auditoria.',
    ],
    validation: 'Para três controles declarados, encontre a evidência mais recente de cada um. Se ela não existe ou foi produzida à mão para a auditoria, automatize a geração no próprio processo.',
    review: [
      { front: 'O que caracteriza uma boa evidência?', back: 'Ter data e origem e poder ser conferida por outra pessoa.' },
      { front: 'Por que preferir evidências geradas pelo processo?', back: 'Custam menos e são mais confiáveis do que coletas manuais.' },
    ],
    links: [{ label: 'NIST AI RMF', url: 'https://www.nist.gov/itl/ai-risk-management-framework' }],
  },
  'gov-ciclo-dados': {
    context: 'O formulário de cadastro pedia a data de nascimento "porque pode ser útil". Ela acabou em cinco sistemas, dois fornecedores e nos registros.',
    concept: [
      'O **ciclo de vida** de um dado tem etapas: coleta, uso, compartilhamento, armazenamento, retenção e descarte. Em cada uma há um risco e uma pergunta: precisa coletar? Para que finalidade? Quem recebe? Onde fica? Até quando?',
      'Seguir um dado do começo ao fim revela cópias esquecidas (registros, ambientes de teste, exportações, cópias de segurança, prompts enviados a modelos) e mostra onde a minimização e o descarte automático reduzem o risco.',
    ],
    validation: 'Escolha um dado pessoal e trace todas as cópias, da coleta ao descarte. Para cada cópia, registre a finalidade e o prazo; cópias sem finalidade devem ser eliminadas.',
    review: [
      { front: 'Quais são as etapas do ciclo de vida de um dado?', back: 'Coleta, uso, compartilhamento, armazenamento, retenção e descarte.' },
      { front: 'Onde costumam ficar cópias esquecidas?', back: 'Em registros, ambientes de teste, exportações, cópias de segurança e prompts enviados a modelos.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-532' }],
  },
  'gov-obrigacao-vs-pratica': {
    context: 'Na reunião, alguém disse que "a lei exige" fixação de certificado no aplicativo. Ninguém conseguiu apontar onde.',
    concept: [
      'Há três tipos de fonte, com pesos diferentes. **Obrigação legal** vem de lei ou regulamento (como a LGPD) e de contratos assinados. **Orientação** vem de autoridades e órgãos (guias, recomendações) e ajuda a interpretar a obrigação. **Boa prática** vem de comunidades e padrões (OWASP, NIST, ISO) e indica como fazer bem.',
      'Confundir as três gera decisões ruins: tratar boa prática como obrigação engessa escolhas razoáveis; tratar obrigação como opcional cria risco legal. Em cada decisão, cite a fonte e o tipo dela. Para questões jurídicas concretas, a palavra final é de quem tem formação para isso.',
    ],
    validation: 'Para cinco exigências de segurança de um projeto, registre a fonte exata e o tipo (lei, contrato, orientação ou boa prática). Exigências sem fonte identificável viram decisões de risco, com justificativa própria.',
    review: [
      { front: 'Quais são os três tipos de fonte?', back: 'Obrigação legal (lei, regulamento, contrato), orientação de autoridades e boa prática de comunidades e padrões.' },
      { front: 'Qual o risco de tratar boa prática como obrigação?', back: 'Engessar escolhas razoáveis que o contexto permitiria.' },
    ],
    links: [
      { label: 'Lei nº 13.709/2018 (LGPD), no Planalto', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm' },
      { label: 'ANPD', url: 'https://www.gov.br/anpd/' },
    ],
  },
}
