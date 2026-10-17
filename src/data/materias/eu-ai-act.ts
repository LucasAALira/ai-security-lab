import type { Materia } from '../types'

export const euAiAct: Materia = {
  slug: "eu-ai-act",
  moduleIndex: 7,
  number: "08",
  title: "EU AI Act",
  summary: "Entenda por que finalidade, papel da organização e contexto de uso são essenciais para analisar o regulamento europeu.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "A lógica da regulação",
      html: `<p>O Regulamento (UE) 2024/1689, conhecido como AI Act, estabelece regras harmonizadas para inteligência artificial na União Europeia. Ele entrou em vigor em 1º de agosto de 2024 e é aplicado em fases. A análise não começa pelo tamanho do modelo: é preciso entender o sistema, sua finalidade, o papel da organização e o âmbito de aplicação.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>A lei regula o <em>uso</em>, não a tecnologia em abstrato. A mesma ferramenta pode ser quase irrelevante para a lei em um caso e muito regulada em outro. As perguntas que decidem o enquadramento são: para que serve? Quem a coloca no mercado ou a usa? E quem é afetado?</p></div>
<h3>A quem se aplica, mesmo fora da Europa</h3>
<p>O regulamento alcança, entre outros, fornecedores que colocam sistemas de IA no mercado da UE, ou os colocam em funcionamento nela, onde quer que estejam, e usuários profissionais (os “implantadores”) estabelecidos na UE. Também pode alcançar fornecedores e implantadores de fora da UE quando o <em>resultado</em> produzido pelo sistema é usado na União. Uma empresa brasileira que atende clientes europeus precisa, portanto, verificar se está no alcance.</p>
<h3>Uma abordagem por níveis de risco</h3>
<p>A abordagem diferencia práticas proibidas, sistemas de alto risco e obrigações de transparência em situações específicas, além de regras próprias para modelos de propósito geral. Essas categorias não devem ser reduzidas a uma etiqueta única aplicada a toda tecnologia de IA.</p>
<dl class="concept-list">
<dt>Práticas proibidas</dt>
<dd>Usos considerados inaceitáveis, como certas formas de manipulação, pontuação social e identificação biométrica em tempo real em espaços públicos, com exceções estritas.</dd>
<dt>Sistemas de alto risco</dt>
<dd>Usos em áreas sensíveis, como emprego, educação, crédito e biometria, ou como componente de produtos já regulados. Sujeitos a requisitos detalhados antes e depois de entrar no mercado.</dd>
<dt>Obrigações de transparência</dt>
<dd>Regras para situações específicas, como avisar que a pessoa está interagindo com uma IA e identificar conteúdo gerado ou manipulado artificialmente.</dd>
<dt>Modelos de IA de propósito geral</dt>
<dd>Regras próprias para quem fornece modelos amplos, com obrigações adicionais para os que apresentam risco sistêmico.</dd>
<dt>Demais usos</dt>
<dd>A maior parte dos sistemas não se enquadra em nenhum dos níveis acima e não recebe obrigações específicas, mas continua sujeita a outras leis, como as de proteção de dados.</dd>
</dl>
<p><strong>Exemplo:</strong> o mesmo modelo pode integrar um assistente que organiza rascunhos ou um sistema usado em seleção de candidatos. O uso e o contexto mudam as perguntas regulatórias, mesmo que o componente técnico seja semelhante.</p>
<h3>As datas: uma aplicação faseada</h3>
<p>As obrigações não começaram todas ao mesmo tempo, e o calendário foi alterado pelo Regulamento (UE) 2026/1744, o chamado “Omnibus Digital sobre IA”, que está em vigor desde 27 de julho de 2026. A tabela resume o que as fontes consultadas em 16/10/2026 indicam:</p>
<div class="table-wrap" role="region" aria-label="Tabela: calendário de aplicação do AI Act" tabindex="0">
<table>
<caption>Calendário resumido. Confirme sempre no texto consolidado oficial (EUR-Lex), porque pode haver novas alterações.</caption>
<thead><tr><th scope="col">Data</th><th scope="col">O que passa a valer</th></tr></thead>
<tbody>
<tr><th scope="row">1º ago 2024</th><td>Entrada em vigor do regulamento.</td></tr>
<tr><th scope="row">2 fev 2025</th><td>Práticas proibidas e dever de promover a alfabetização em IA (art. 4).</td></tr>
<tr><th scope="row">2 ago 2025</th><td>Regras para modelos de propósito geral, estrutura de governança e regime de penalidades dos Estados-membros.</td></tr>
<tr><th scope="row">2 ago 2026</th><td>Aplicação da maior parte do regulamento, incluindo as obrigações de transparência do art. 50.</td></tr>
<tr><th scope="row">2 dez 2026</th><td>Novas proibições (sistemas que geram imagens íntimas não consentidas ou material de abuso sexual infantil) e fim do prazo de transição para a marcação de conteúdo gerado (art. 50, 2) de sistemas já no mercado antes de 2 ago 2026.</td></tr>
<tr><th scope="row">2 dez 2027</th><td>Obrigações dos sistemas de alto risco listados no Anexo III (antes previstas para 2 ago 2026).</td></tr>
<tr><th scope="row">2 ago 2028</th><td>Obrigações dos sistemas de alto risco que são componentes de produtos regulados, do Anexo I (antes previstas para 2 ago 2027).</td></tr>
</tbody>
</table>
</div>
<p>As penalidades têm tetos elevados. Para práticas proibidas, o teto é de até 35 milhões de euros ou 7% do faturamento mundial anual; para o descumprimento da maior parte das demais obrigações, até 15 milhões de euros ou 3%. Os tetos não são multas automáticas: dependem do caso e da gravidade.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Papéis, risco e obrigações",
      html: `<p>Diferencie quem desenvolve ou disponibiliza um sistema de quem o utiliza em sua atividade. Essa identificação deve ser feita com os fatos da operação, e não com o nome comercial do produto.</p>
<h3>Os papéis principais</h3>
<dl class="concept-list">
<dt>Fornecedor (provider)</dt>
<dd>Quem desenvolve um sistema ou modelo, ou o manda desenvolver, e o coloca no mercado ou em funcionamento sob o seu nome ou marca.</dd>
<dt>Implantador (deployer)</dt>
<dd>Quem usa um sistema de IA sob a sua autoridade, em uma atividade profissional.</dd>
<dt>Importador e distribuidor</dt>
<dd>Quem coloca no mercado europeu um sistema de fornecedor de fora da UE, ou o disponibiliza na cadeia de distribuição.</dd>
</dl>
<p>Os papéis podem mudar. Quem passa a usar um sistema de alto risco com o seu próprio nome ou marca, modifica-o substancialmente ou muda a finalidade para um uso de alto risco pode passar a ser tratado como <strong>fornecedor</strong> e assumir obrigações maiores. Alterações no sistema ou na finalidade podem afetar os papéis e responsabilidades.</p>
<h3>Práticas proibidas: exemplos</h3>
<ul>
<li>técnicas de manipulação subliminar ou enganosa que causem dano;</li>
<li>exploração de vulnerabilidades de grupos, como idade ou deficiência;</li>
<li>pontuação social por entes públicos ou privados com consequências injustificadas;</li>
<li>coleta indiscriminada de imagens faciais da internet ou de câmeras para formar bancos de reconhecimento facial;</li>
<li>reconhecimento de emoções no trabalho e na educação, salvo exceções médicas ou de segurança.</li>
</ul>
<h3>Alto risco: dois caminhos</h3>
<p>Um sistema pode ser de alto risco porque é um <strong>componente de segurança de um produto</strong> já regulado na UE (como máquinas, brinquedos ou dispositivos médicos), ou porque a sua finalidade está em uma das áreas do <strong>Anexo III</strong>: biometria; infraestrutura crítica; educação e formação; emprego e gestão de trabalhadores; acesso a serviços essenciais públicos e privados (como crédito e seguros); aplicação da lei; migração, asilo e controle de fronteiras; administração da justiça e processos democráticos. Há exceções limitadas para usos de baixo risco dentro dessas áreas, e a perfilagem de pessoas naturais costuma pesar a favor do alto risco.</p>
<h3>O que se pede em alto risco</h3>
<p>Em sistemas de alto risco, temas relevantes incluem gestão de riscos, qualidade dos dados, documentação técnica, registros, supervisão humana, robustez e segurança. Do <strong>fornecedor</strong>, o regulamento espera, entre outros:</p>
<ul>
<li>sistema de gestão de riscos durante todo o ciclo de vida;</li>
<li>governança de dados de treinamento, validação e teste;</li>
<li>documentação técnica e instruções de uso claras;</li>
<li>registro automático de eventos (logs) para rastreabilidade;</li>
<li>desenho que permita supervisão humana efetiva;</li>
<li>exatidão, robustez e cibersegurança;</li>
<li>sistema de gestão da qualidade, avaliação de conformidade, marcação CE e registro em base europeia;</li>
<li>monitoramento após a colocação no mercado e comunicação de incidentes graves.</li>
</ul>
<p>Do <strong>implantador</strong>, espera-se, em geral: usar conforme as instruções, atribuir supervisão a pessoas competentes, cuidar da qualidade dos dados de entrada sob seu controle, monitorar o funcionamento, guardar os registros sob seu controle, informar trabalhadores e pessoas afetadas quando for o caso e, em certos casos, avaliar impactos sobre direitos fundamentais. Quais requisitos e obrigações cabem a cada parte depende do enquadramento.</p>
<h3>Transparência e modelos de propósito geral</h3>
<p>Nas obrigações de transparência (art. 50), as pessoas devem ser informadas de que interagem com um sistema de IA, e conteúdos sintéticos ou manipulados devem ser identificados de forma adequada. Para <strong>modelos de propósito geral</strong>, os fornecedores precisam manter documentação técnica, fornecer informações a quem integra o modelo, adotar uma política de direitos autorais e publicar um resumo do conteúdo usado no treinamento. Para os modelos com <strong>risco sistêmico</strong>, há obrigações adicionais, como avaliação com testes adversariais (o red teaming do módulo 04), mitigação de riscos, comunicação de incidentes graves e proteção cibernética adequada.</p>
<h3>Dois casos para raciocinar</h3>
<p><strong>Caso didático A:</strong> um chatbot de atendimento informa condições gerais de entrega. Investigue se a pessoa sabe que interage com IA, quais dados são usados e se o sistema executa decisões com outros efeitos. Provavelmente é um caso de transparência, e não de alto risco, a menos que o uso mude.</p>
<p><strong>Caso didático B:</strong> um sistema classifica candidatos para apoiar recrutamento. Investigue sua finalidade exata, influência sobre a seleção, contexto de uso e os critérios regulatórios relevantes. Seleção de pessoal é uma área do Anexo III: não conclua o enquadramento só pelo nome comercial “copiloto”, mas esse é um forte indício de alto risco.</p>
<p>Os casos são exercícios de raciocínio. Eles não substituem a avaliação das disposições aplicáveis, das exceções e do papel concreto de cada organização.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Como organizar a análise em AppSec",
      html: `<p>Monte uma ficha com finalidade, usuários, pessoas afetadas, fornecedor, organização responsável, dados, decisões apoiadas ou executadas e mercados envolvidos. Depois identifique quais informações ainda faltam para avaliar aplicação, classificação e obrigações.</p>
<pre tabindex="0"><code>Sistema:              triagem de currículos (versão 1.4)
Finalidade:           ordenar candidaturas para a equipe de RH
Quem usa / quem sofre: recrutadores / candidatos
Papel da empresa:     implantador (modelo do fornecedor X)
Mercados:             Brasil e UE (vagas em Portugal)
Decisão:              apoio; a pessoa de RH decide
Dados:                currículos; sem dados sensíveis declarados
Faltam:               contrato com o fornecedor; documentação técnica; logs
Evidências possíveis: testes de autorização, logs de mudança, relatório de red team</code></pre>
<h3>O que a segurança técnica contribui</h3>
<p>Para o caso de recrutamento, uma equipe de segurança pode produzir evidências de autorização, integridade dos dados, rastreabilidade de mudanças e comportamento das integrações. Essas evidências apoiam a análise, mas não determinam sozinhas o enquadramento jurídico.</p>
<p>O art. 15 do regulamento, por exemplo, pede que sistemas de alto risco sejam resilientes a tentativas de terceiros de alterar o uso, os resultados ou o desempenho explorando vulnerabilidades. Ele cita medidas contra o envenenamento de dados e de modelo, exemplos adversariais e ataques à confidencialidade. É a ponte direta com o que você estudou nos módulos 01 a 04:</p>
<ul>
<li>o OWASP Top 10 ajuda a listar os riscos;</li>
<li>o ATLAS descreve como um adversário agiria;</li>
<li>o red teaming gera a evidência de teste;</li>
<li>o registro de eventos e o inventário sustentam a rastreabilidade.</li>
</ul>
<h3>Não confunda os instrumentos</h3>
<div class="table-wrap" role="region" aria-label="Tabela: comparação entre instrumentos" tabindex="0">
<table>
<caption>Cada instrumento responde a uma pergunta diferente.</caption>
<thead><tr><th scope="col">Instrumento</th><th scope="col">Natureza</th><th scope="col">Obrigatório?</th><th scope="col">O que ele organiza</th></tr></thead>
<tbody>
<tr><th scope="row">NIST AI RMF</th><td>Framework de gestão de riscos</td><td>Não, voluntário</td><td>Como decidir e acompanhar riscos de IA</td></tr>
<tr><th scope="row">ISO/IEC 42001</th><td>Norma de sistema de gestão, certificável</td><td>Não, salvo exigência contratual</td><td>Políticas, processos e evidências da organização</td></tr>
<tr><th scope="row">LGPD</th><td>Lei brasileira</td><td>Sim, dentro do seu âmbito</td><td>Tratamento de dados pessoais</td></tr>
<tr><th scope="row">AI Act</th><td>Regulamento da União Europeia</td><td>Sim, dentro do seu âmbito</td><td>Sistemas de IA por nível de risco e papel</td></tr>
<tr><th scope="row">OWASP e ATLAS</th><td>Bases de conhecimento técnico</td><td>Não</td><td>Riscos e comportamentos adversariais</td></tr>
</tbody>
</table>
</div>
<p>Nenhum dos instrumentos voluntários substitui automaticamente o AI Act. Em contrapartida, seguir práticas como as do NIST e da ISO costuma facilitar a produção de parte das evidências pedidas. O regulamento também prevê normas técnicas harmonizadas, que, quando publicadas e seguidas, podem ajudar a demonstrar conformidade; acompanhe o estágio delas.</p>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Usar a certificação de um sistema de gestão como conclusão de que todas as obrigações europeias foram atendidas. É necessário verificar o que se aplica ao sistema, ao papel e ao período em questão. E, com as datas mudando, citar uma data de memória é um risco: consulte a fonte oficial.</p></div>
<p><strong>Exercício:</strong> compare os dois casos desta página. Liste cinco fatos necessários para a análise e associe cada fato a uma evidência que a empresa poderia manter. O objetivo é reduzir suposições e tornar a decisão revisável. Esta matéria é educacional e não substitui orientação jurídica.</p>`,
    },
  ],
  recap: [
    "O AI Act regula o uso da IA por nível de risco: práticas proibidas, alto risco, transparência e regras para modelos de propósito geral. O enquadramento depende de finalidade, papel e contexto.",
    "Pode alcançar organizações de fora da UE, inclusive quando o resultado do sistema é usado na União.",
    "O calendário é faseado e foi alterado pelo Regulamento (UE) 2026/1744: alto risco do Anexo III em 2 de dezembro de 2027 e do Anexo I em 2 de agosto de 2028; transparência (art. 50) desde 2 de agosto de 2026. Confirme sempre a fonte oficial.",
    "Fornecedor e implantador têm obrigações diferentes, e os papéis podem mudar quando se modifica o sistema ou sua finalidade.",
    "O art. 15 exige resiliência contra envenenamento, evasão e ataques de confidencialidade: red teaming, inventário e logs viram evidência.",
    "NIST, ISO 42001 e LGPD não substituem o AI Act. Cada um responde a uma pergunta diferente.",
  ],
  glossary: [
    { term: "Alto risco", definition: "Classe de sistemas de IA sujeitos a requisitos detalhados: componentes de segurança de produtos regulados e usos listados no Anexo III." },
    { term: "Avaliação de conformidade", definition: "Procedimento pelo qual o fornecedor demonstra que um sistema de alto risco atende aos requisitos antes de ser colocado no mercado." },
    { term: "Fornecedor (provider)", definition: "Quem desenvolve um sistema ou modelo de IA e o coloca no mercado ou em funcionamento sob seu nome ou marca." },
    { term: "Implantador (deployer)", definition: "Quem usa um sistema de IA sob sua autoridade em uma atividade profissional." },
    { term: "Marcação CE", definition: "Indicação de que um produto cumpre os requisitos da legislação europeia aplicável." },
    { term: "Modelo de propósito geral", definition: "Modelo amplo, capaz de servir a muitas tarefas e de ser integrado a vários sistemas, com regras próprias no regulamento." },
    { term: "Omnibus Digital sobre IA", definition: "Regulamento (UE) 2026/1744, que alterou prazos e pontos do AI Act, em vigor desde 27 de julho de 2026." },
    { term: "Prática proibida", definition: "Uso de IA considerado inaceitável pelo regulamento, vedado desde 2 de fevereiro de 2025." },
    { term: "Risco sistêmico", definition: "Risco associado a modelos de propósito geral de grande capacidade, que pode afetar amplamente a sociedade." },
    { term: "Sistema de IA", definition: "Sistema baseado em máquina que, com algum grau de autonomia, infere a partir de entradas como gerar saídas (previsões, conteúdos, recomendações ou decisões)." },
    { term: "Supervisão humana", definition: "Medidas que permitem a pessoas compreender, monitorar e, se necessário, intervir ou interromper o sistema." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Compare o chatbot de entregas e o sistema de recrutamento. Liste finalidade, papel da organização, pessoas afetadas e informações que faltam para avaliar enquadramento e obrigações.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>Regulamento (UE) 2024/1689 — AI Act.</li>
<li>Regulamento (UE) 2026/1744 — Omnibus Digital sobre IA, que altera o AI Act.</li>
<li>Comissão Europeia: visão geral do marco regulatório e abordagem europeia de IA.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. As datas foram conferidas em fontes consultadas em 16/10/2026; confirme no texto consolidado oficial. Esta matéria é educacional e não substitui orientação jurídica.</p>`,
  },
}
