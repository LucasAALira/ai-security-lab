import type { Materia } from '../types'

export const lgpdIa: Materia = {
  slug: "lgpd-ia",
  moduleIndex: 6,
  number: "07",
  title: "LGPD aplicada à inteligência artificial",
  summary: "Aprenda a reconhecer o tratamento de dados pessoais nos fluxos de IA e a relacioná-lo a finalidade, necessidade e proteção.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que muda quando os dados entram na IA",
      html: `<p>A Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD) disciplina o tratamento de dados pessoais por pessoas e organizações, públicas ou privadas, em meios físicos ou digitais. Usar um modelo não remove automaticamente essa natureza: uma pergunta, um documento, um registro de conversa ou uma resposta pode se referir a uma pessoa identificada ou identificável.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>Se a informação consegue levar até uma pessoa, a lei se aplica, esteja ela em uma planilha, em uma mensagem para um chatbot ou dentro de um índice vetorial. O fato de ser “para a IA” não cria uma exceção.</p></div>
<h3>Conceitos que você vai usar o tempo todo</h3>
<dl class="concept-list">
<dt>Dado pessoal</dt>
<dd>Informação relacionada a pessoa natural identificada ou identificável. Nome e CPF são exemplos óbvios; combinações de dados aparentemente neutros também podem identificar.</dd>
<dt>Dado pessoal sensível</dt>
<dd>Categorias com tratamento específico na lei, como origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, saúde, vida sexual, dado genético ou biométrico vinculado a uma pessoa. Exigem atenção diferente de um simples dado de contato.</dd>
<dt>Anonimização e pseudonimização</dt>
<dd>Dado <strong>anonimizado</strong> não permite identificar a pessoa com meios técnicos razoáveis e disponíveis; em regra, não é dado pessoal, salvo se o processo puder ser revertido com esforços razoáveis. Dado <strong>pseudonimizado</strong> perde a associação direta, mas a pessoa pode ser reidentificada com informação adicional mantida à parte, e por isso continua sendo dado pessoal.</dd>
<dt>Titular, controlador, operador e encarregado</dt>
<dd>Titular é a pessoa a quem os dados se referem. Controlador é quem decide sobre o tratamento. Operador trata os dados em nome do controlador. Encarregado é o canal de comunicação com titulares e com a ANPD (Autoridade Nacional de Proteção de Dados).</dd>
<dt>Tratamento</dt>
<dd>Qualquer operação com dados pessoais: coletar, armazenar, consultar, enviar a um modelo, compartilhar, eliminar.</dd>
</dl>
<h3>Onde há dados pessoais em um fluxo de IA</h3>
<p>Em IA, acompanhe o fluxo inteiro. Um dado pode ficar em vários componentes, com operadores e finalidades diferentes:</p>
<ul>
<li>o <strong>prompt</strong> e os arquivos enviados pelo usuário;</li>
<li>os <strong>documentos</strong> que alimentam a busca (RAG) e os <strong>embeddings</strong> gerados deles;</li>
<li>o <strong>histórico</strong> de conversas e a memória do assistente;</li>
<li>os <strong>logs</strong>, a telemetria e as avaliações de “gostei/não gostei”;</li>
<li>conjuntos de <strong>ajuste fino</strong> ou treinamento;</li>
<li>as <strong>respostas</strong>, que podem citar ou até inferir dados sobre alguém;</li>
<li>cópias em <strong>fornecedores</strong>, inclusive em outros países.</li>
</ul>
<h3>Cuidado com atalhos</h3>
<p>Remover o nome de um currículo não garante anonimização se outros elementos ainda permitem identificar a pessoa: cargo raro, empresa, datas, cidade. Da mesma forma, transformar texto em uma representação vetorial não deve ser tratado automaticamente como anonimização.</p>
<p>Dados de <strong>crianças e adolescentes</strong> têm regra própria (art. 14): o tratamento deve atender ao seu melhor interesse, o que exige cuidado redobrado em assistentes educativos e em jogos.</p>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Escolher uma hipótese legal só porque ela parece conveniente. A análise depende do tratamento concreto e da categoria de dados, e esta matéria não substitui a orientação de um profissional jurídico.</p></div>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Finalidade, necessidade e direitos",
      html: `<p>A LGPD organiza o tratamento em torno de princípios (art. 6º), sempre sob a boa-fé. Para quem trabalha com IA, eles viram perguntas práticas sobre o fluxo:</p>
<div class="table-wrap" role="region" aria-label="Tabela: princípios da LGPD aplicados à IA" tabindex="0">
<table>
<caption>Os dez princípios do art. 6º e o que cada um pergunta a um sistema de IA.</caption>
<thead><tr><th scope="col">Princípio</th><th scope="col">Em um sistema de IA, pergunte</th></tr></thead>
<tbody>
<tr><th scope="row">Finalidade</th><td>Para que propósito legítimo, específico e informado os dados são usados?</td></tr>
<tr><th scope="row">Adequação</th><td>O tratamento é compatível com a finalidade informada ao titular?</td></tr>
<tr><th scope="row">Necessidade</th><td>Estamos enviando só o mínimo pertinente ao modelo?</td></tr>
<tr><th scope="row">Livre acesso</th><td>O titular consegue consultar como seus dados são tratados?</td></tr>
<tr><th scope="row">Qualidade dos dados</th><td>Os dados são exatos e atualizados para o uso?</td></tr>
<tr><th scope="row">Transparência</th><td>As informações sobre o uso de IA são claras e acessíveis?</td></tr>
<tr><th scope="row">Segurança</th><td>Há medidas técnicas e administrativas contra acessos indevidos?</td></tr>
<tr><th scope="row">Prevenção</th><td>Adotamos medidas para evitar danos antes que ocorram?</td></tr>
<tr><th scope="row">Não discriminação</th><td>O uso pode gerar tratamento ilícito ou abusivo de grupos?</td></tr>
<tr><th scope="row">Responsabilização</th><td>Conseguimos demonstrar as medidas adotadas e sua eficácia?</td></tr>
</tbody>
</table>
</div>
<p>O princípio da finalidade exige propósito legítimo, específico e informado; a necessidade direciona o uso ao que é pertinente e proporcional. Ter acesso técnico a uma base não significa que todos os usos sejam adequados.</p>
<h3>Hipóteses legais: consentimento não é a única</h3>
<p>Todo tratamento precisa de uma hipótese legal. O art. 7º traz dez, entre elas: consentimento; cumprimento de obrigação legal ou regulatória; execução de contrato; exercício regular de direitos; proteção da vida e tutela da saúde; legítimo interesse; e proteção do crédito. O <strong>consentimento</strong> não é a única possibilidade nem uma solução automática para qualquer uso. O <strong>legítimo interesse</strong> exige um teste de ponderação entre o interesse da organização e os direitos do titular, além de transparência.</p>
<p>Para <strong>dados sensíveis</strong>, o art. 11 traz uma lista própria e mais restrita. Avalie separadamente situações que envolvam esses dados.</p>
<h3>Fornecedores: quem é controlador e quem é operador</h3>
<p>Ao usar um serviço de IA de terceiros, pergunte quem decide a finalidade do tratamento. Se o fornecedor apenas processa os dados conforme as suas instruções, tende a ser operador. Se ele usa os dados para outras finalidades próprias, como treinar seus modelos, o enquadramento muda. A resposta depende dos fatos e do contrato, e não do nome comercial.</p>
<h3>Direitos do titular</h3>
<p>O art. 18 garante, entre outros, confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos, portabilidade, informação sobre com quem os dados foram compartilhados e revogação do consentimento. Para atender direitos, a organização precisa <strong>localizar</strong> os dados e entender onde são usados. Histórico de conversas, documentos recuperados e registros técnicos entram nesse mapeamento.</p>
<h3>Decisões automatizadas</h3>
<p>O art. 20 trata do direito de <strong>solicitar revisão</strong> de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem interesses do titular, incluídas as destinadas a definir o seu perfil pessoal, profissional, de consumo e de crédito. O controlador deve fornecer, quando solicitado, informações claras sobre os critérios e procedimentos usados, respeitados os segredos comercial e industrial. Se não fornecer, a ANPD pode fazer auditoria para verificar aspectos discriminatórios.</p>
<p><strong>Caso didático:</strong> um copiloto de RH prepara uma visão geral de candidaturas. Pergunte quais informações são realmente necessárias, quem pode consultar os resultados e se o fornecedor utiliza os dados para outra finalidade. Se uma pessoa de RH usa o resumo como um dos elementos da decisão, é apoio à decisão. Se a recusa é aplicada automaticamente, sem intervenção humana relevante, o art. 20 passa a ser central. Não confunda uma ferramenta de apoio com uma decisão exclusivamente automatizada sem analisar o fluxo real.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Controles e análise aplicada",
      html: `<p>Para o copiloto de RH, uma proposta de controle pode limitar o acesso por função, reduzir o conteúdo enviado ao modelo, definir retenção e registrar decisões importantes. O desenho deve considerar a finalidade e o risco, não apenas a conveniência técnica.</p>
<h3>Mapeie cada ponto de tratamento</h3>
<p>Considere três pontos: o currículo original, o contexto enviado ao modelo e o resumo armazenado. Cada um pode ter responsáveis, permissões e prazos diferentes. Uma correção no resumo não apaga automaticamente o original ou uma cópia em log.</p>
<div class="table-wrap" role="region" aria-label="Tabela: pontos de tratamento do copiloto de RH" tabindex="0">
<table>
<caption>Exemplo didático de mapa de tratamento. Valores de retenção são ilustrativos.</caption>
<thead><tr><th scope="col">Ponto</th><th scope="col">Dados</th><th scope="col">Finalidade</th><th scope="col">Quem acessa</th><th scope="col">Retenção</th></tr></thead>
<tbody>
<tr><th scope="row">Currículo original</th><td>Dados completos do candidato</td><td>Processo seletivo</td><td>Equipe da vaga</td><td>Conforme política de seleção</td></tr>
<tr><th scope="row">Contexto enviado ao modelo</th><td>Somente os campos necessários</td><td>Gerar o resumo</td><td>Fornecedor, como operador</td><td>Sem retenção, se o contrato permitir</td></tr>
<tr><th scope="row">Resumo armazenado</th><td>Trechos selecionados</td><td>Apoiar a triagem</td><td>RH, por função</td><td>Prazo curto e definido</td></tr>
<tr><th scope="row">Logs técnicos</th><td>Identificadores, sem conteúdo</td><td>Segurança e suporte</td><td>Time de plataforma</td><td>Prazo mínimo necessário</td></tr>
</tbody>
</table>
</div>
<h3>Reduza o que entra</h3>
<ul>
<li><strong>Minimização antes do modelo:</strong> envie só os campos necessários; mascare identificadores quando o resultado não depende deles.</li>
<li><strong>Escopo na recuperação:</strong> o RAG só traz documentos que a pessoa pode ver.</li>
<li><strong>Logs sem conteúdo:</strong> registre decisões e identificadores, não o texto completo, quando for possível.</li>
<li><strong>Retenção definida:</strong> cada cópia tem prazo e responsável pela eliminação.</li>
<li><strong>Treinamento com cuidado:</strong> remover um dado de um modelo já treinado é difícil. Evite ajustar modelos com dados pessoais sem necessidade clara e documente a decisão.</li>
</ul>
<h3>E quando o titular pede eliminação?</h3>
<p>Procure, pelo menos: a base original; as cópias em índices e embeddings; resumos e anotações; histórico de conversas; logs; cópias de segurança; e os registros mantidos pelo fornecedor. Se você não consegue listar onde o dado está, não consegue atender o direito com segurança. Há também situações em que a lei permite manter dados (por exemplo, para cumprir obrigação legal); a análise é caso a caso.</p>
<h3>Fornecedores e transferência internacional</h3>
<p>Analise a relação com fornecedores e eventuais transferências internacionais. A localização do serviço, as instruções de tratamento, a subcontratação e as condições de uso precisam ser compreendidas no caso concreto. A LGPD trata da transferência internacional de dados (arts. 33 a 36), e a ANPD regulamentou o tema; consulte o regulamento vigente. Itens de contrato a verificar: finalidade permitida, uso para treinamento, retenção, localização, subcontratados, notificação de incidentes e eliminação ao final.</p>
<h3>Segurança, incidentes e responsabilidade</h3>
<ul>
<li>O art. 46 exige medidas de segurança, técnicas e administrativas, para proteger os dados de acessos não autorizados e de situações acidentais ou ilícitas.</li>
<li>O art. 48 trata da comunicação de incidentes de segurança que possam acarretar risco ou dano relevante. O regulamento da ANPD sobre o tema (Resolução CD/ANPD nº 15/2024) define prazos e conteúdo; confira o texto vigente.</li>
<li>O art. 37 prevê o registro das operações de tratamento, e o art. 38 permite que a ANPD exija um relatório de impacto à proteção de dados pessoais (RIPD).</li>
<li>O art. 52 prevê sanções administrativas, que incluem advertência e multa de até 2% do faturamento, limitada a R$ 50 milhões por infração.</li>
</ul>
<h3>E o marco legal da IA?</h3>
<p>O Projeto de Lei nº 2338/2023, que pretende criar regras específicas para IA no Brasil, foi aprovado pelo Senado em dezembro de 2024 e, até a revisão desta matéria (16/10/2026), tramitava na Câmara dos Deputados. Não é lei. Enquanto isso, a LGPD, o Código de Defesa do Consumidor e outras normas já se aplicam aos sistemas de IA.</p>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Concluir que um sistema está adequado à LGPD porque tem criptografia. A proteção técnica é relevante, mas não responde sozinha às perguntas sobre finalidade, hipótese legal, necessidade ou direitos.</p></div>
<p><strong>Atividade:</strong> descreva quais dados o copiloto recebe, por que precisa deles e quem pode acessá-los. Para cada cópia, proponha retenção e um procedimento para localizar o registro quando necessário. Este exercício organiza a análise; não constitui uma conclusão jurídica de conformidade.</p>`,
    },
  ],
  recap: [
    "A LGPD se aplica quando há dado pessoal, inclusive em prompts, documentos de RAG, embeddings, logs e respostas. Usar IA não cria exceção.",
    "Anonimizado (não identifica) é diferente de pseudonimizado (ainda identifica com informação adicional). Remover o nome ou gerar embeddings não é anonimização automática.",
    "Finalidade, necessidade e transparência guiam o desenho: envie ao modelo só o mínimo pertinente e informe como a IA é usada.",
    "Consentimento é uma entre várias hipóteses legais; o legítimo interesse exige ponderação, e dados sensíveis têm lista própria.",
    "O art. 20 dá direito a solicitar revisão de decisões tomadas unicamente por tratamento automatizado. Apoio à decisão e decisão automatizada são coisas diferentes.",
    "Para atender direitos e responder a incidentes, é preciso saber onde cada dado está: base original, índices, resumos, logs, backups e fornecedores.",
  ],
  glossary: [
    { term: "Anonimização", definition: "Processo que impede a identificação da pessoa com meios técnicos razoáveis. O dado anonimizado, em regra, deixa de ser dado pessoal." },
    { term: "ANPD", definition: "Autoridade Nacional de Proteção de Dados: órgão que fiscaliza e regulamenta a LGPD." },
    { term: "Controlador", definition: "Quem decide sobre as finalidades e os meios do tratamento de dados pessoais." },
    { term: "Dado pessoal", definition: "Informação relacionada a pessoa natural identificada ou identificável." },
    { term: "Dado pessoal sensível", definition: "Categoria de dado com tratamento específico, como saúde, origem racial ou étnica, opinião política ou dado biométrico vinculado a uma pessoa." },
    { term: "Encarregado", definition: "Pessoa indicada pelo controlador para ser o canal com os titulares e com a ANPD." },
    { term: "Finalidade", definition: "Propósito legítimo, específico e informado do tratamento. Determina o que é adequado e necessário." },
    { term: "Hipótese legal (base legal)", definition: "Fundamento previsto na lei que autoriza um tratamento, como consentimento, execução de contrato ou legítimo interesse." },
    { term: "Legítimo interesse", definition: "Hipótese legal que exige ponderar o interesse da organização contra os direitos e as expectativas do titular." },
    { term: "Operador", definition: "Quem trata os dados pessoais em nome do controlador." },
    { term: "Pseudonimização", definition: "Troca de identificadores diretos por códigos. A pessoa pode ser reidentificada com informação adicional, então o dado continua pessoal." },
    { term: "RIPD", definition: "Relatório de impacto à proteção de dados pessoais: documento que descreve o tratamento, os riscos e as medidas de mitigação." },
    { term: "Titular", definition: "Pessoa natural a quem se referem os dados." },
    { term: "Tratamento", definition: "Toda operação com dados pessoais: coleta, uso, armazenamento, compartilhamento, eliminação." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>No caso do copiloto de RH, escolha três pontos de tratamento. Explique finalidade, necessidade, controle de acesso e retenção em cada um. Diferencie apoio à decisão de decisão unicamente automatizada.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>Lei nº 13.709/2018 (LGPD), texto compilado: arts. 3º, 5º, 6º, 7º, 11, 12, 13, 14, 18, 20, 33 a 38, 46, 48 e 52.</li>
<li>ANPD: regulamentos sobre comunicação de incidentes de segurança e transferência internacional de dados.</li>
<li>Projeto de Lei nº 2338/2023 (Senado Federal / Câmara dos Deputados).</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. Esta matéria é educacional e não substitui orientação jurídica.</p>`,
  },
}
