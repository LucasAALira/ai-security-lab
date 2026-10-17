import type { Materia } from '../types'

export const owaspTop10Llm: Materia = {
  slug: "owasp-top-10-llm",
  moduleIndex: 0,
  number: "01",
  title: "OWASP Top 10 para LLM — edição 2025",
  summary: "Entenda os dez riscos e aprenda a localizar suas causas na aplicação, nos dados e nas integrações.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que o Top 10 organiza",
      html: `<p>Uma aplicação com LLM (modelo de linguagem de grande porte) reúne mais do que um modelo. Ela recebe a pergunta, busca documentos, monta o contexto, pede uma resposta e, em alguns casos, aciona ferramentas que leem e alteram dados de verdade. O OWASP Top 10 para aplicações com LLM ajuda a reconhecer classes importantes de risco nesse conjunto. Ele é um ponto de partida para a análise, não uma garantia de que todos os problemas possíveis foram cobertos.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>O Top 10 é um mapa dos lugares onde aplicações com LLM mais costumam dar errado. Ele não diz onde a <em>sua</em> aplicação está quebrada; diz onde vale olhar primeiro e dá um nome comum para o que você encontrar.</p></div>
<h3>O caminho de uma pergunta</h3>
<p>Seguir uma única pergunta, do começo ao fim, mostra por que existem dez riscos e não um. Pense em um copiloto de atendimento ao cliente:</p>
<ol>
<li><strong>Entrada.</strong> A pessoa escreve um pedido. Ele pode ser legítimo, confuso ou hostil.</li>
<li><strong>Contexto.</strong> A aplicação junta o pedido com as instruções internas (o <em>prompt de sistema</em>), o histórico da conversa e trechos de documentos recuperados de uma base interna (técnica conhecida como <em>RAG</em>).</li>
<li><strong>Modelo.</strong> O modelo, que veio de um fornecedor ou foi treinado com dados da empresa, produz um texto.</li>
<li><strong>Saída.</strong> A aplicação mostra o texto na tela ou o entrega a outro sistema.</li>
<li><strong>Ação.</strong> Se houver ferramentas, o texto pode virar uma chamada de API: consultar um pedido, enviar um e-mail, fazer um estorno.</li>
<li><strong>Operação.</strong> Tudo isso consome recursos e gera custos, registros e dependências de terceiros.</li>
</ol>
<p>Cada passagem entre essas etapas cria uma decisão de confiança. Quem pode fornecer conteúdo? Quais dados podem ser recuperados para esta pessoa? Quais ações podem acontecer, e com a permissão de quem? Os dez riscos da lista são, em boa parte, respostas erradas a essas três perguntas.</p>
<h3>Por que citar a edição</h3>
<p>Esta matéria usa explicitamente a <strong>edição 2025</strong>, a mesma dos exercícios da trilha. A lista muda com o tempo: o risco que na edição de 2023 aparecia como “Insecure Output Handling” (LLM02) passou, em 2025, a se chamar “Improper Output Handling” (LLM05). Quem escreve “LLM02” em um relatório sem dizer a edição pode estar apontando para outra coisa. Registre sempre o nome <em>e</em> a edição quando comparar achados.</p>
<h3>O que a lista não faz</h3>
<ul>
<li><strong>Não mede o seu risco.</strong> A ordem da lista reflete o que a comunidade considera mais relevante em geral. Uma ferramenta com acesso a pagamentos pode merecer atenção antes de um erro de resposta sem consequência operacional, mesmo que o primeiro esteja “mais abaixo” na lista.</li>
<li><strong>Não é um padrão de conformidade.</strong> Ninguém “está em conformidade com o Top 10”. Ele serve para organizar a conversa e os testes.</li>
<li><strong>Não substitui o modelo de ameaças.</strong> Primeiro você descreve o seu sistema; depois usa a lista para não esquecer classes de problema.</li>
</ul>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Os dez riscos, com exemplos",
      html: `<p>Para cada risco, leia três coisas: o que ele é, como aparece em uma situação concreta e qual é a direção geral da defesa. Os exemplos são fictícios.</p>
<dl class="concept-list">
<dt>LLM01 — Prompt Injection (injeção de prompt)</dt>
<dd>Uma entrada tenta mudar as instruções ou o comportamento pretendido. Pode vir do usuário (direta) ou de um conteúdo que a aplicação entrega ao modelo, como um documento ou uma página (indireta). <strong>Exemplo:</strong> um PDF recuperado manda o assistente abandonar o resumo e listar outros arquivos. <strong>Defesa:</strong> impedir que o texto do modelo conceda permissões; quem decide é o código da aplicação (módulo 02).</dd>
<dt>LLM02 — Sensitive Information Disclosure (divulgação de informação sensível)</dt>
<dd>Informações restritas aparecem em respostas ou em outros fluxos: dados pessoais, segredos de negócio, credenciais. <strong>Exemplo:</strong> o bot de atendimento cita o endereço de outro cliente porque o contexto trouxe o cadastro errado. <strong>Defesa:</strong> enviar ao contexto o mínimo necessário e aplicar autorização na origem dos dados, antes de o texto chegar ao modelo.</dd>
<dt>LLM03 — Supply Chain (cadeia de suprimentos)</dt>
<dd>Modelos, conjuntos de dados, bibliotecas, plug-ins e fornecedores ampliam a superfície de risco, porque você herda o que eles fazem. <strong>Exemplo:</strong> uma atualização de componente muda o comportamento da integração sem que ninguém reteste. <strong>Defesa:</strong> inventário de componentes, procedência verificada, versões fixadas e avaliação de cada mudança (veja o módulo 09).</dd>
<dt>LLM04 — Data and Model Poisoning (envenenamento de dados e de modelo)</dt>
<dd>Dados de treinamento, de ajuste fino ou de busca, ou o próprio modelo, são manipulados para influenciar resultados. <strong>Exemplo:</strong> material adulterado entra na base de conhecimento e passa a orientar respostas sobre políticas internas. <strong>Defesa:</strong> controlar quem pode escrever nas fontes, registrar a origem e verificar a integridade do que entra.</dd>
<dt>LLM05 — Improper Output Handling (tratamento inadequado da saída)</dt>
<dd>A aplicação usa a saída do modelo sem proteção, como se fosse confiável. <strong>Exemplo:</strong> o texto gerado é inserido na página como HTML e um trecho malicioso é executado no navegador de quem lê. <strong>Defesa:</strong> tratar a saída como entrada não confiável do próximo componente: validar e codificar conforme o destino (HTML, SQL, comando, URL).</dd>
<dt>LLM06 — Excessive Agency (agência excessiva)</dt>
<dd>O agente recebe funções, permissões ou autonomia além do necessário. É o risco do “poder de agir”. <strong>Exemplo:</strong> um assistente que só deveria resumir e-mails também pode apagá-los, com uma conta de serviço ampla. <strong>Defesa:</strong> reduzir ferramentas ao necessário, usar o menor privilégio e exigir aprovação humana para ações de impacto.</dd>
<dt>LLM07 — System Prompt Leakage (vazamento do prompt de sistema)</dt>
<dd>As instruções internas são expostas a quem não deveria vê-las. O problema se agrava quando elas guardam segredos ou fazem o papel de controle de acesso. <strong>Exemplo:</strong> o prompt contém uma chave de API e um código interno de desconto, e o usuário os obtém ao pedir que o assistente repita suas instruções. <strong>Defesa:</strong> assumir que o prompt pode vazar; credenciais ficam fora dele, e permissões são verificadas no servidor.</dd>
<dt>LLM08 — Vector and Embedding Weaknesses (fragilidades em vetores e embeddings)</dt>
<dd>Falhas na organização, proteção ou consulta do índice vetorial podem expor ou misturar dados. <strong>Exemplo:</strong> a busca devolve trechos de um departamento a quem trabalha em outro, porque todos os documentos foram para o mesmo índice sem controle de acesso. <strong>Defesa:</strong> aplicar o escopo de acesso <em>antes</em> da recuperação e separar índices quando a sensibilidade é diferente.</dd>
<dt>LLM09 — Misinformation (desinformação)</dt>
<dd>O sistema apresenta informação incorreta de forma convincente, inclusive por inventar fatos (a chamada “alucinação” ou confabulação). <strong>Exemplo:</strong> o assistente cria uma política de reembolso que não existe e o cliente age com base nela. <strong>Defesa:</strong> exigir fundamento em fontes verificáveis, mostrar a origem das afirmações e prever revisão humana proporcional ao impacto.</dd>
<dt>LLM10 — Unbounded Consumption (consumo sem limites)</dt>
<dd>O consumo de recursos cresce sem controle: custo por uso, chamadas em laço, pedidos enormes. Pode virar negação de serviço financeira ou técnica. <strong>Exemplo:</strong> um fluxo de agente repete chamadas indefinidamente e gera uma fatura inesperada. <strong>Defesa:</strong> orçamento por usuário, limites de tamanho e de taxa, tempo máximo e critérios de parada.</dd>
</dl>
<h3>Pares que se confundem</h3>
<p>Alguns riscos parecem o mesmo problema visto de ângulos diferentes. Separá-los evita corrigir o lugar errado.</p>
<ul>
<li><strong>LLM01 e LLM06.</strong> A injeção é a <em>instrução indevida</em>; a agência excessiva é o <em>poder</em> que a instrução encontra. Remover só a primeira é impossível de garantir; reduzir o segundo limita o estrago.</li>
<li><strong>LLM02 e LLM07.</strong> Os dois são vazamentos. No LLM07, o que vaza são as instruções do sistema; no LLM02, são dados de pessoas, empresas ou sistemas.</li>
<li><strong>LLM03 e LLM04.</strong> Os dois afetam o que entra no sistema. No LLM03, o problema é o <em>componente</em> de terceiros; no LLM04, é a <em>manipulação</em> do dado ou do modelo, venha de onde vier.</li>
<li><strong>LLM05 e LLM01.</strong> Na injeção, o conteúdo malicioso engana o modelo. No tratamento inadequado, o modelo pode até estar certo; o erro está em usar o texto gerado sem proteção, como se fosse código seguro.</li>
<li><strong>LLM08 e LLM02.</strong> A fragilidade vetorial é uma <em>causa</em> comum do vazamento: a busca entregou ao contexto o que não devia.</li>
</ul>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Como transformar a lista em controles",
      html: `<p>Comece pelo fluxo real, não pela lista. No copiloto de atendimento, anote quem consulta os documentos, qual conta acessa a base e quais operações a API de estorno permite. Só então associe cada risco a uma condição concreta. “LLM06” sozinho não explica nada; “a conta do bot pode estornar qualquer pedido sem validar o usuário” explica, e já aponta o conserto.</p>
<h3>Do componente ao controle verificável</h3>
<div class="table-wrap" role="region" aria-label="Tabela: componentes do copiloto, riscos e controles" tabindex="0">
<table>
<caption>Exemplo didático para o copiloto de atendimento.</caption>
<thead><tr><th scope="col">Componente</th><th scope="col">Pergunta de segurança</th><th scope="col">Risco</th><th scope="col">Controle que dá para testar</th></tr></thead>
<tbody>
<tr><th scope="row">Busca de documentos</th><td>A pessoa pode ler este documento?</td><td>LLM02, LLM08</td><td>A recuperação recusa documentos fora do escopo antes de montar o contexto.</td></tr>
<tr><th scope="row">Prompt de sistema</th><td>O que acontece se ele vazar?</td><td>LLM07</td><td>Nenhuma chave, regra de desconto ou permissão depende do sigilo do prompt.</td></tr>
<tr><th scope="row">Tela do chat</th><td>O texto gerado é tratado como dado?</td><td>LLM05</td><td>A saída é codificada para o destino; HTML ativo não é executado.</td></tr>
<tr><th scope="row">API de estorno</th><td>Quem autoriza a operação?</td><td>LLM06, LLM01</td><td>O servidor valida usuário, pedido e valor; operações acima de um limite pedem aprovação humana.</td></tr>
<tr><th scope="row">Modelo e bibliotecas</th><td>De onde vêm e em que versão?</td><td>LLM03</td><td>Inventário com origem e versão; mudanças passam por reteste.</td></tr>
<tr><th scope="row">Custos e limites</th><td>Existe teto por usuário e por conversa?</td><td>LLM10</td><td>Limite de tamanho, de taxa e de passos do agente, com alerta de orçamento.</td></tr>
</tbody>
</table>
</div>
<h3>Uma mesma cadeia, vários riscos</h3>
<p>Raramente um incidente tem um só rótulo. Um documento malicioso pode provocar uma instrução indevida (LLM01), que solicita uma ferramenta com excesso de permissão (LLM06), resultando em exposição de dados (LLM02). Corrigir apenas a redação do prompt não elimina a capacidade de acesso indevido; cortar o elo do meio (a permissão) reduz o estrago mesmo que a injeção continue possível.</p>
<h3>Dois exemplos de código</h3>
<p>No LLM05, a diferença entre inserir texto e inserir HTML é a diferença entre exibir uma frase e executar um script:</p>
<pre tabindex="0"><code>// Vulnerável: o texto do modelo é interpretado como HTML
elemento.innerHTML = respostaDoModelo

// Seguro neste contexto: o texto é só texto
elemento.textContent = respostaDoModelo</code></pre>
<p>No LLM06, o que protege é uma lista fechada de operações verificadas pelo servidor, e não a “boa vontade” do modelo:</p>
<pre tabindex="0"><code>const PERMITIDAS = new Set(["consultar_pedido", "resumir_conversa"])

function executar(chamada, usuario) {
  if (!PERMITIDAS.has(chamada.nome)) return recusar("ferramenta não permitida")
  if (!usuario.podeAcessar(chamada.recurso)) return recusar("sem acesso ao recurso")
  return rodar(chamada)   // a identidade usada é a do usuário, não uma conta ampla
}</code></pre>
<h3>Como priorizar</h3>
<p>A lista não decide a severidade. Para cada achado, pergunte: qual é o <strong>impacto</strong> se der certo? Qual o <strong>alcance</strong> (uma pessoa, um cliente, todos)? Que <strong>pré-condições</strong> o atacante precisa cumprir? E que <strong>controles já existem</strong> no caminho? Um vazamento que exige uma conta interna e atinge um registro pesa menos do que uma ação irreversível que qualquer visitante dispara.</p>
<h3>Registrar a evidência</h3>
<p><strong>Exemplo:</strong> uma conta fictícia de suporte tenta consultar um documento financeiro. O controle esperado é que a recuperação seja recusada <em>antes</em> de incluir o texto no contexto. Uma resposta que apenas esconde o documento depois de já tê-lo recebido não demonstra isolamento completo. Um registro curto basta:</p>
<pre tabindex="0"><code>Risco:        LLM08 / LLM02 (edição 2025)
Condição:     o índice não aplica permissão por usuário
Evidência:    a conta "suporte-teste" recebeu trechos de "financeiro/orcamento.pdf"
Impacto:      leitura de dados de outra área
Correção:     filtrar por permissão na consulta ao índice
Reteste:      a mesma conta recebe zero trechos do financeiro; a pergunta
              legítima de suporte continua sendo respondida</code></pre>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Tratar a lista como uma classificação automática de severidade, ou marcar “cobrimos os dez riscos” depois de um único teste por item. Use impacto, alcance, pré-condições e controles existentes para decidir a prioridade, e lembre que um teste só mostra o que foi testado.</p></div>`,
    },
  ],
  recap: [
    "O Top 10 organiza classes de risco da aplicação inteira (modelo, dados, integrações e operação), não só do modelo. Cite sempre a edição: nomes e números mudam.",
    "Cada passagem do fluxo (entrada, contexto, modelo, saída, ação) é uma decisão de confiança. Pergunte quem fornece conteúdo, quais dados podem ser recuperados e quais ações são permitidas.",
    "LLM01 é a instrução indevida; LLM06 é o poder que ela encontra. Reduzir permissões limita o estrago mesmo quando a injeção acontece.",
    "A saída do modelo é entrada não confiável para o próximo componente (LLM05). Segredos não ficam no prompt (LLM07), e a permissão é aplicada antes da busca (LLM08).",
    "Um incidente costuma envolver vários riscos encadeados. Corrija a causa em cada elo, não só a frase do prompt.",
    "A lista não define severidade: use impacto, alcance, pré-condições e controles existentes, e registre evidência que outra pessoa consiga repetir.",
  ],
  glossary: [
    { term: "Agente", definition: "Aplicação em que o modelo decide quais ferramentas chamar e em que ordem, muitas vezes em vários passos seguidos." },
    { term: "Alucinação (confabulação)", definition: "Resposta falsa apresentada com aparência de certeza, porque o modelo gera texto provável, não texto verificado." },
    { term: "Contexto", definition: "Todo o texto que o modelo recebe para responder: instruções, histórico, documentos recuperados e resultados de ferramentas." },
    { term: "Embedding", definition: "Representação numérica de um texto, usada para buscar conteúdos parecidos. Também pode expor dados se o índice não tiver controle de acesso." },
    { term: "Ferramenta (tool)", definition: "Função ou API que a aplicação permite ao modelo acionar, como consultar um pedido ou enviar um e-mail." },
    { term: "Fronteira de confiança", definition: "Ponto em que dados ou decisões passam de um componente para outro com níveis de confiança diferentes. É onde se validam e se autorizam as coisas." },
    { term: "LLM", definition: "Modelo de linguagem de grande porte: sistema treinado em muito texto que gera respostas em linguagem natural." },
    { term: "Menor privilégio", definition: "Princípio de dar a cada pessoa, conta ou ferramenta apenas o acesso de que precisa para a tarefa." },
    { term: "Prompt de sistema", definition: "Instruções internas definidas pela aplicação para orientar o modelo. Pode vazar, por isso não guarda segredos." },
    { term: "RAG", definition: "Técnica em que a aplicação busca documentos e os coloca no contexto para o modelo responder com base neles." },
    { term: "Superfície de ataque", definition: "Conjunto de pontos por onde alguém pode tentar interagir com o sistema ou atacá-lo." },
    { term: "Token", definition: "Pedaço de texto (palavra, parte de palavra ou símbolo) que o modelo processa. Custo e limites de uso costumam ser medidos em tokens." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Compare LLM01 e LLM06 nesta página. Explique por que uma instrução maliciosa e uma permissão excessiva são problemas diferentes e como podem aparecer na mesma cadeia.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>OWASP Top 10 for LLM Applications, edição 2025.</li>
<li>OWASP GenAI Security Project: riscos e mitigação.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
