import type { Materia } from '../types'

export const mitreAtlas: Materia = {
  slug: "mitre-atlas",
  moduleIndex: 2,
  number: "03",
  title: "MITRE ATLAS",
  summary: "Use uma linguagem de comportamentos adversariais para organizar hipóteses, evidências e oportunidades de defesa.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "Tática, técnica e procedimento",
      html: `<p>MITRE ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) é uma base de conhecimento sobre o comportamento de adversários contra sistemas de IA. Ela reúne <strong>táticas</strong>, <strong>técnicas</strong>, <strong>mitigações</strong> e <strong>casos de estudo</strong> (incidentes reais e demonstrações de pesquisa) para ajudar a entender como ameaças podem se manifestar. O foco é a ação do adversário e sua relação com o sistema, e não uma lista de defeitos do código.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>É um vocabulário comum para contar a história de um ataque. Em vez de dizer “alguém enganou o chatbot”, você descreve em que etapa o adversário estava, o que tentou e o que o sistema fez. Quem lê o seu relatório, em qualquer equipe, entende o mesmo.</p></div>
<h3>Três níveis de detalhe</h3>
<dl class="concept-list">
<dt>Tática</dt>
<dd>O <strong>objetivo</strong> do adversário em uma etapa. Responde “o que ele quer agora?”. Exemplo de objetivo: obter informação restrita.</dd>
<dt>Técnica</dt>
<dd>A <strong>forma</strong> de alcançar esse objetivo. Responde “como ele tenta?”. Exemplo: induzir o assistente, por meio de um documento que ele vai recuperar, a consultar arquivos fora do escopo do usuário.</dd>
<dt>Procedimento</dt>
<dd>A <strong>realização concreta</strong> em um ambiente específico. Responde “o que aconteceu aqui?”. Exemplo: o documento enviado na terça, com determinada frase, e o pedido de arquivo que o assistente propôs em seguida.</dd>
</dl>
<h3>Uma matriz em colunas</h3>
<p>O ATLAS segue o desenho do MITRE ATT&amp;CK, a base de conhecimento sobre adversários em ambientes de TI. As táticas formam as colunas de uma matriz, aproximadamente na ordem em que um ataque se desenrola, e as técnicas ficam embaixo de cada coluna. Entre as táticas estão Reconhecimento, Desenvolvimento de recursos, Acesso inicial, Execução, Persistência, Evasão de defesas, Descoberta, Coleta, Exfiltração e Impacto. A maior parte vem do ATT&amp;CK; duas são específicas de IA: <strong>acesso ao modelo</strong> (ML Model Access) e <strong>preparação do ataque ao modelo</strong> (ML Attack Staging).</p>
<p>A matriz é atualizada com frequência. Nos últimos lançamentos ela ganhou táticas e técnicas ligadas a agentes de IA. Por isso, ao citar um identificador, <strong>registre a versão consultada</strong>. Os números mudam; o raciocínio de mapeamento continua o mesmo.</p>
<h3>Para que serve</h3>
<ul>
<li><strong>Modelagem de ameaças:</strong> percorrer as colunas e perguntar “isto é possível no nosso sistema?”.</li>
<li><strong>Detecção:</strong> decidir quais registros precisam existir para ver cada etapa.</li>
<li><strong>Red team e testes:</strong> planejar cenários com objetivos adversariais claros.</li>
<li><strong>Relatórios:</strong> descrever achados em uma linguagem que a outra equipe reconhece.</li>
</ul>
<h3>O que ela não é</h3>
<p>ATLAS complementa a análise de aplicações e infraestruturas. Não é sinônimo de um scanner, nem uma lista de todos os controles obrigatórios, nem uma nota de maturidade. Seu uso exige contexto e evidência, porque nomes parecidos podem esconder comportamentos diferentes. O objetivo desta matéria é ensinar o raciocínio de mapeamento; os casos a seguir são didáticos e não são apresentados como incidentes oficiais da MITRE.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Um caso explicado em etapas",
      html: `<p><strong>Ambiente:</strong> um copiloto consulta uma base de documentos e pode solicitar acesso a arquivos. <strong>Condição inicial:</strong> um colaborador externo consegue enviar um documento para uma área que depois será consultada.</p>
<p><strong>Comportamento observado:</strong> o documento contém instruções para procurar informação de outro departamento. Quando recuperado, o modelo propõe uma chamada à ferramenta de arquivos. O backend recusa, porque o usuário não tem acesso ao recurso.</p>
<h3>A linha do tempo, com o status de cada fato</h3>
<div class="table-wrap" role="region" aria-label="Tabela: linha do tempo do caso didático" tabindex="0">
<table>
<caption>Caso didático. O status mostra o que foi visto e o que continua sendo hipótese.</caption>
<thead><tr><th scope="col">Etapa</th><th scope="col">O que aconteceu</th><th scope="col">Objetivo do adversário (candidato)</th><th scope="col">Status</th></tr></thead>
<tbody>
<tr><th scope="row">1</th><td>Colaborador externo envia o documento para a área compartilhada</td><td>Colocar conteúdo onde o sistema vai ler</td><td>Observado</td></tr>
<tr><th scope="row">2</th><td>O copiloto recupera o documento</td><td>Fazer a instrução chegar ao modelo</td><td>Observado</td></tr>
<tr><th scope="row">3</th><td>O modelo propõe consultar arquivo de outro departamento</td><td>Descobrir e ler informação fora do escopo</td><td>Observado (proposta)</td></tr>
<tr><th scope="row">4</th><td>O backend recusa o acesso</td><td>—</td><td>Controle funcionou</td></tr>
<tr><th scope="row">5</th><td>Conteúdo restrito sai do ambiente</td><td>Retirar dados</td><td>Não ocorreu</td></tr>
</tbody>
</table>
</div>
<p>Separe fatos e hipóteses. O envio e a recuperação do documento foram observados. A proposta de chamada também. A obtenção do conteúdo restrito <strong>não aconteceu</strong>. Registrar “exfiltração concluída” seria incorreto nesse cenário, ainda que a tentativa seja real e mereça correção.</p>
<h3>Passo a passo para mapear um comportamento</h3>
<ol>
<li><strong>Descreva sem jargão.</strong> “A instrução chegou por conteúdo externo e tentou redirecionar o sistema.”</li>
<li><strong>Identifique o objetivo.</strong> Qual tática, em linguagem comum, descreve o que o adversário queria nessa etapa?</li>
<li><strong>Procure a técnica.</strong> Leia a <em>definição</em> das técnicas daquela coluna e escolha a que descreve o seu comportamento. Se houver sub-técnicas, veja se alguma se aplica melhor.</li>
<li><strong>Confira as condições.</strong> A técnica pede pré-requisitos (acesso ao modelo, ao índice, a uma API). O seu caso os cumpre?</li>
<li><strong>Registre a confiança.</strong> Confirmado, provável ou incerto, com a evidência que sustenta cada marcação e a versão do ATLAS consultada.</li>
</ol>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Escolher a técnica pelo <em>título</em>. Dois nomes parecidos podem descrever comportamentos diferentes, e um identificador só deve ser usado quando a correspondência foi confirmada na versão de referência. Uma frase vaga como “ataque à IA” não informa pré-condição, evidência nem impacto.</p></div>
<h3>Outros cenários para treinar o olhar</h3>
<ul>
<li><strong>Cópia por consulta.</strong> Um cliente faz milhares de perguntas variadas e sistemáticas ao endpoint de inferência. Sem arquivo nenhum, o adversário observa entradas e saídas para treinar um modelo que imite o seu. Evidência a procurar: volume, variedade sistemática, ausência de uso comercial plausível. Isto é uma <em>hipótese</em> até que o padrão seja confirmado.</li>
<li><strong>Modelo adulterado.</strong> Um modelo baixado de uma fonte não verificada se comporta de modo diferente do prometido, ou executa código ao ser carregado. O ponto de entrada é a cadeia de suprimentos (veja também o módulo 09, de acesso antecipado).</li>
<li><strong>Envenenamento da base.</strong> Alguém com permissão de escrita altera documentos que o RAG consulta. A técnica atua antes da pergunta do usuário; a evidência está no histórico de alterações.</li>
</ul>
<h3>Que telemetria ajuda</h3>
<p>Para reconstruir a história, registre origem do documento, identidade do solicitante, recurso pedido e decisão da ferramenta. Não é necessário gravar todo o conteúdo sensível para produzir evidência útil: um identificador e o resultado da decisão costumam bastar e reduzem o risco de criar um novo repositório de dados.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Do mapeamento à decisão de defesa",
      html: `<p>O mapeamento só vale se virar uma decisão. Use uma ficha curta que outra pessoa consiga revisar sem ter estado na reunião:</p>
<pre tabindex="0"><code>Objetivo adversarial:  obter informação de outro departamento
Condição necessária:   colaborador externo pode enviar documentos à área
Comportamento visto:   documento recuperado leva o modelo a propor consulta
Componente afetado:    recuperação de documentos + ferramenta de arquivos
Evidência:             log da recusa pela ferramenta; origem do documento
Técnica (candidata):   [a confirmar na versão X do ATLAS]
Controle existente:    autorização por usuário na ferramenta (funcionou)
Controle faltante:     validação do que entra na área compartilhada
Limite da conclusão:   não houve vazamento; outros usuários não testados</code></pre>
<h3>Onde a defesa pode agir</h3>
<p>Cada etapa da linha do tempo oferece uma chance de prevenir, detectar ou responder. No caso didático:</p>
<div class="table-wrap" role="region" aria-label="Tabela: oportunidades de defesa por etapa" tabindex="0">
<table>
<caption>Prevenir, detectar e responder em cada etapa do caso.</caption>
<thead><tr><th scope="col">Etapa</th><th scope="col">Prevenir</th><th scope="col">Detectar</th><th scope="col">Responder</th></tr></thead>
<tbody>
<tr><th scope="row">Envio do documento</th><td>Revisar e limitar quem escreve na área</td><td>Alerta para documento de conta externa</td><td>Quarentena do arquivo</td></tr>
<tr><th scope="row">Recuperação</th><td>Escopo de acesso na busca</td><td>Registro de quais trechos entraram no contexto</td><td>Remover o documento do índice</td></tr>
<tr><th scope="row">Chamada de ferramenta</th><td>Autorizar pelo usuário, não pela conta de serviço</td><td>Alerta para pedidos fora do escopo</td><td>Revogar sessão e revisar o ocorrido</td></tr>
</tbody>
</table>
</div>
<p>No caso didático, há pelo menos duas oportunidades de defesa: controlar o processo de entrada de documentos e autorizar a leitura de arquivos. A segunda funcionou; a primeira pode precisar de revisão. O registro não deve reduzir tudo a “o modelo falhou”: a causa raiz está em quem pode escrever na base e em como a ferramenta decide.</p>
<h3>ATLAS, OWASP e NIST respondem a perguntas diferentes</h3>
<ul>
<li><strong>OWASP Top 10 para LLM</strong> responde “que <em>classes de problema</em> a aplicação pode ter?”.</li>
<li><strong>MITRE ATLAS</strong> responde “como um adversário se comportaria e em que etapa?”.</li>
<li><strong>NIST AI RMF</strong> responde “como a organização decide e acompanha esses riscos?”.</li>
</ul>
<p>Uma mesma avaliação pode usar os três, sem presumir correspondência de um para um. Uma técnica do ATLAS pode tocar vários riscos do OWASP, e um risco do OWASP pode aparecer em técnicas diferentes.</p>
<h3>Como usar as mitigações do ATLAS</h3>
<p>A base associa mitigações às técnicas. Trate-as como ponto de partida para a conversa com a equipe de engenharia, e não como lista de tarefas pronta: cada mitigação precisa ser traduzida em um controle concreto do seu sistema, com responsável, teste e evidência.</p>
<div class="callout is-warn"><p class="callout-title">Cuidado com a cobertura</p><p>Não use “cobrimos 40% das técnicas” como medida de maturidade. Nem toda técnica se aplica ao seu sistema, uma técnica tem formas diferentes de execução e um controle pode cobrir só uma delas. Prefira medir “cenários prioritários com controle e evidência de teste”.</p></div>
<p><strong>Exercício de análise:</strong> se a ferramenta passasse a permitir acesso com uma conta de serviço irrestrita, qual consequência deixaria de ser hipótese? Que evidência adicional seria necessária para comprová-la? Escreva a resposta como uma nova linha do tempo, marcando cada fato como observado, hipótese ou não ocorrido.</p>`,
    },
  ],
  recap: [
    "ATLAS é uma base de conhecimento sobre o comportamento de adversários contra sistemas de IA, desenhada como o ATT&CK: táticas, técnicas, mitigações e casos de estudo.",
    "Tática é o objetivo, técnica é a forma e procedimento é o que aconteceu naquele ambiente. Misturar os três níveis gera relatórios vagos.",
    "Mapeie pela definição, não pelo título, e registre a versão do ATLAS e o grau de confiança. Um identificador só entra no relatório depois de confirmado.",
    "Separe sempre fato, hipótese e o que não ocorreu. Uma tentativa bloqueada é evidência de que um controle funcionou, e não um vazamento.",
    "Cada etapa tem chance de prevenir, detectar e responder. A causa costuma estar no desenho (quem escreve na base, como a ferramenta decide), não no modelo.",
    "OWASP organiza classes de risco; ATLAS descreve o comportamento adversarial; NIST organiza a gestão. Percentual de técnicas cobertas não mede maturidade.",
  ],
  glossary: [
    { term: "ATT&CK", definition: "Base de conhecimento do MITRE sobre táticas e técnicas de adversários em ambientes de TI. O ATLAS foi desenhado na mesma estrutura." },
    { term: "Caso de estudo", definition: "Descrição de um ataque real ou demonstrado contra um sistema de IA, associada às técnicas usadas." },
    { term: "Evidência", definition: "Registro que sustenta uma afirmação: um log, uma captura, um resultado de teste. Sem ela, o achado é opinião." },
    { term: "Hipótese", definition: "Explicação possível que ainda não foi confirmada. Deve ser rotulada assim no relatório." },
    { term: "Mapeamento", definition: "Ligação entre o comportamento observado e a tática ou técnica que o descreve." },
    { term: "Matriz", definition: "Quadro com as táticas em colunas e as técnicas abaixo de cada uma." },
    { term: "Mitigação", definition: "Medida que reduz a chance ou o impacto de uma técnica. Precisa virar um controle concreto no seu sistema." },
    { term: "Procedimento", definition: "Realização concreta de uma técnica em um ambiente e momento específicos." },
    { term: "Sub-técnica", definition: "Variação mais específica de uma técnica, quando a base a detalha." },
    { term: "Tática", definition: "Objetivo do adversário em uma etapa do ataque." },
    { term: "Técnica", definition: "Forma de alcançar o objetivo de uma tática." },
    { term: "Telemetria", definition: "Dados registrados pelo sistema durante a operação, usados para detectar e investigar eventos." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Releia o caso didático e registre objetivo, acesso inicial, comportamento, evidência e duas oportunidades de defesa. Diferencie a tentativa bloqueada de um vazamento efetivo.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>MITRE ATLAS: base de conhecimento de táticas, técnicas e casos.</li>
<li>MITRE ATLAS Fact Sheet.</li>
<li>MITRE ATT&amp;CK: estrutura de matriz que o ATLAS adota.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. As táticas e técnicas mudam entre versões: confirme sempre a versão vigente.</p>`,
  },
}
