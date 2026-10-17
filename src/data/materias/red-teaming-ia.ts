import type { Materia } from '../types'

export const redTeamingIa: Materia = {
  slug: "red-teaming-ia",
  moduleIndex: 3,
  number: "04",
  title: "Red teaming em IA",
  summary: "Estruture avaliações adversariais que gerem evidência útil para corrigir sistemas de IA.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que se pretende avaliar",
      html: `<p>Red teaming em IA usa uma perspectiva adversarial para investigar como um sistema pode falhar diante de comportamentos inesperados ou abusivos. O objeto pode incluir o modelo, a implementação, a infraestrutura e o comportamento durante a operação. A pergunta central é: <strong>que consequência a combinação desses componentes permite?</strong></p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>Testar se a fechadura abre com a chave certa é uma verificação. Red teaming é pedir a alguém, com autorização, que tente entrar no prédio por qualquer caminho razoável: a porta, a janela, o funcionário que empresta o crachá. O objetivo não é “entrar por entrar”, e sim descobrir o que precisa mudar para que isso fique difícil.</p></div>
<p>Não se resume a encontrar uma frase que faça o chatbot responder de modo inadequado. Uma avaliação pode examinar acesso a dados, ferramentas, isolamento entre clientes e caminhos de decisão.</p>
<h3>O que pode ser alvo</h3>
<dl class="concept-list">
<dt>Modelo</dt>
<dd>Comportamentos de segurança e de conteúdo: recusas, vieses, respostas nocivas, vazamento de dados memorizados.</dd>
<dt>Aplicação</dt>
<dd>Prompts, busca de documentos, ferramentas, autorização e tratamento da saída. É onde a maior parte das falhas com impacto real aparece.</dd>
<dt>Infraestrutura e dados</dt>
<dd>APIs, contas de serviço, segredos, índices vetoriais, registros e limites de consumo.</dd>
<dt>Pessoas e processos</dt>
<dd>Se a equipe percebe o ataque, quem é acionado e quanto tempo leva para conter.</dd>
</dl>
<h3>Teste de vulnerabilidade, pentest e red teaming</h3>
<p>Os termos se sobrepõem, e a distinção não depende apenas da ferramenta utilizada:</p>
<ul>
<li><strong>Teste de vulnerabilidade ou avaliação automática:</strong> verifica uma condição específica, geralmente em grande volume (por exemplo, mil variações de um mesmo tipo de ataque).</li>
<li><strong>Teste de invasão (pentest):</strong> procura falhas exploráveis em um escopo definido.</li>
<li><strong>Red teaming:</strong> parte de um objetivo (“um usuário de suporte consegue alterar dados financeiros?”) e pode <em>encadear</em> condições para alcançá-lo. Quando combinado com a defesa (blue team), também mostra se a organização enxerga e responde ao ataque.</li>
</ul>
<h3>Segurança e comportamento nocivo</h3>
<p>Em IA há dois campos que usam a mesma expressão. O primeiro é de <strong>segurança da informação</strong>: confidencialidade, integridade, disponibilidade e abuso de ferramentas. O segundo é de <strong>comportamento do modelo</strong>: conteúdo tóxico, discriminação, orientações perigosas. Os dois são legítimos, mas têm métricas, responsáveis e cuidados diferentes. Esta trilha trabalha o primeiro; deixe claro no escopo qual dos dois você está avaliando.</p>
<h3>Quem é o adversário?</h3>
<p>Definir o adversário muda os testes. Considere alguns perfis:</p>
<ul>
<li><strong>Usuário curioso:</strong> tenta o óbvio, sem plano.</li>
<li><strong>Usuário mal-intencionado:</strong> conhece a aplicação e insiste.</li>
<li><strong>Terceiro que controla conteúdo:</strong> não usa o sistema, mas escreve o documento, o e-mail ou a página que o sistema lerá.</li>
<li><strong>Pessoa interna:</strong> já tem algum acesso legítimo.</li>
<li><strong>Fornecedor comprometido:</strong> um componente ou serviço de terceiros muda de comportamento.</li>
</ul>
<p><strong>Exemplo:</strong> o objetivo de uma campanha pode ser verificar se um usuário de suporte consegue provocar alteração de dados financeiros. Isso exige entender identidade, permissões e execução, além do texto produzido pelo modelo.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Planejamento e evidência",
      html: `<p>Antes de qualquer tentativa, combine as regras. Elas protegem quem testa, quem é testado e as pessoas cujos dados poderiam ser afetados.</p>
<h3>Regras de engajamento</h3>
<ul>
<li><strong>Escopo:</strong> quais componentes, versões e funcionalidades estão incluídos. A autorização deve corresponder ao que será efetivamente avaliado.</li>
<li><strong>Ambiente:</strong> de preferência um ambiente de teste, com <strong>contas de teste e dados sintéticos</strong>; nunca dados reais sem necessidade e base clara.</li>
<li><strong>Limites de execução:</strong> volume de requisições, orçamento, janelas de horário e o que nunca será tentado (por exemplo, ações destrutivas).</li>
<li><strong>Critérios de interrupção:</strong> o que faz a equipe parar, como o sistema reagir de forma inesperada em produção.</li>
<li><strong>Contato:</strong> quem avisar, e como, se algo grave for encontrado no meio do teste.</li>
<li><strong>Tratamento das evidências:</strong> onde ficam, quem acessa e por quanto tempo. Saídas ofensivas ou sensíveis geradas pelo modelo seguem a política da organização.</li>
</ul>
<h3>Cada ideia vira uma hipótese</h3>
<p>Transforme cada ideia em uma hipótese testável. Registre a pré-condição e o comportamento seguro esperado <em>antes</em> de observar a resposta, para não ajustar a expectativa ao resultado.</p>
<pre tabindex="0"><code>Hipótese:       um documento recuperado pode induzir o agente a solicitar
                um arquivo fora do escopo do usuário
Pré-condição:   a conta de teste X pode enviar documentos à área
Comportamento
seguro:         a ferramenta recusa; nenhum trecho do arquivo chega ao contexto
Evidência:      log da decisão da ferramenta e conteúdo do contexto</code></pre>
<h3>Caso didático: assistente de RH</h3>
<p>Um assistente de RH tem cinco casos, cada um investigando uma hipótese distinta:</p>
<div class="table-wrap" role="region" aria-label="Tabela: casos de teste do assistente de RH" tabindex="0">
<table>
<caption>Cinco casos de uma campanha pequena.</caption>
<thead><tr><th scope="col">Caso</th><th scope="col">Hipótese</th><th scope="col">Comportamento seguro esperado</th></tr></thead>
<tbody>
<tr><th scope="row">1. Pergunta legítima</th><td>(controle positivo) o serviço funciona</td><td>Resposta correta com base na política</td></tr>
<tr><th scope="row">2. Documento de outra função</th><td>A busca ignora permissões</td><td>Recuperação recusada antes de montar o contexto</td></tr>
<tr><th scope="row">3. Documento com instrução indevida</th><td>Injeção indireta altera a tarefa</td><td>Instrução não é seguida; ação não autorizada</td></tr>
<tr><th scope="row">4. Ferramenta fora da função</th><td>Excesso de permissão</td><td>Ferramenta recusa pela identidade do usuário</td></tr>
<tr><th scope="row">5. Política inexistente</th><td>O modelo inventa uma regra</td><td>Admite não ter a informação ou cita a fonte real</td></tr>
</tbody>
</table>
</div>
<h3>Variabilidade e registro</h3>
<p>Modelos não respondem sempre da mesma forma. Guarde versão, configuração relevante (como a temperatura), prompt, entrada, saída e as decisões das integrações. Quando há variabilidade, repita o caso e registre <strong>quantas execuções produziram o comportamento</strong>. Uma taxa sem denominador ou sem descrição da amostra é difícil de interpretar.</p>
<h3>Automação e trabalho manual</h3>
<p>Ferramentas abertas, como garak, PyRIT e Promptfoo, automatizam o envio de muitas tentativas e a coleta de resultados. Elas ampliam a cobertura de padrões conhecidos. A parte humana continua insubstituível para entender o sistema específico e encadear condições, que é onde costumam estar as falhas de maior impacto. Avalie qualquer ferramenta antes de usá-la e rode-a só no escopo autorizado.</p>
<h3>Não esqueça o controle positivo</h3>
<p>Adicione controles positivos: o assistente deve continuar atendendo pedidos legítimos. Uma defesa que recusa tudo não demonstra qualidade operacional, e uma equipe que só mede “quantas tentativas foram bloqueadas” pode acabar com um produto que não serve para nada.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Interpretação, correção e reteste",
      html: `<p>Uma tentativa pode ser bloqueada em diferentes pontos, e onde isso acontece muda o significado do achado. Se o modelo solicita uma ação indevida e a ferramenta nega, existe um comportamento adversarial relevante, mas o controle de consequência funcionou. Se a ferramenta executa, a evidência e a prioridade mudam.</p>
<h3>Classifique pela consequência</h3>
<div class="table-wrap" role="region" aria-label="Tabela: consequência e prioridade dos achados" tabindex="0">
<table>
<caption>Uma régua simples para ordenar achados.</caption>
<thead><tr><th scope="col">Consequência</th><th scope="col">Exemplo</th><th scope="col">Leitura</th></tr></thead>
<tbody>
<tr><th scope="row">Só comportamento</th><td>O modelo muda o tom da resposta</td><td>Em geral baixa; vale registrar</td></tr>
<tr><th scope="row">Divulgação</th><td>Trecho de documento restrito aparece</td><td>Depende da sensibilidade e do alcance</td></tr>
<tr><th scope="row">Ação executada</th><td>Um e-mail é enviado a destino externo</td><td>Alta, se a ação for de impacto</td></tr>
<tr><th scope="row">Ação irreversível ou em escala</th><td>Apagar registros ou repetir para todos os clientes</td><td>Crítica</td></tr>
</tbody>
</table>
</div>
<h3>Cuidado com os números</h3>
<p><strong>Exemplo numérico:</strong> em dez repetições de um caso, duas retornaram um marcador restrito. Registre “2 de 10 neste caso e nesta configuração”. Não conclua que o sistema tem 20% de risco geral nem compare esse número com outra campanha de escopo diferente.</p>
<p>Com apenas dez repetições, a incerteza é grande: um intervalo de confiança de 95% para 2 em 10 vai de cerca de 6% a 51%. Com 20 em 100, o mesmo cálculo estreita para algo entre 13% e 29%. Mais repetições dão mais precisão. E o inverso também importa: <strong>zero falhas em 30 execuções não prova ausência de risco</strong>; a taxa verdadeira ainda pode estar perto de 10%. Descreva sempre a amostra, as condições e o que não foi coberto.</p>
<h3>Recomendações que dá para implementar</h3>
<p>Uma recomendação precisa nomear o componente e o controle. “Melhorar o prompt” é insuficiente quando a busca ignora permissões. “Aplicar o escopo do usuário na recuperação e testar troca de cliente” indica uma correção verificável, com responsável e prazo.</p>
<pre tabindex="0"><code>ID:              RT-007
Título:          Recuperação ignora permissão por usuário
Severidade:      Alta (divulgação de dados de outra área)
Escopo/versão:   assistente de RH, ambiente de homologação, build 42
Evidência:       2 de 10 execuções devolveram trecho de "financeiro/"; logs anexos
Impacto:         leitura de dados fora da função do usuário
Recomendação:    filtrar por permissão na consulta ao índice
Reteste:         caso original + 3 variações + controle positivo
Não testado:     outras áreas além do financeiro; carga em produção</code></pre>
<h3>Reteste e acompanhamento</h3>
<p>Após corrigir, execute o caso original, variações pertinentes e o controle positivo. Registre também o que <em>não</em> foi testado: o resultado de uma campanha é limitado ao escopo, ao período e às condições observadas, e ninguém deve ler “nenhum achado” como “seguro”.</p>
<p>Transforme os casos em uma <strong>suíte de regressão</strong> que roda quando o modelo, o prompt ou as ferramentas mudam. Para o programa, prefira medir o tempo até a correção, a reincidência de falhas já corrigidas e a cobertura dos cenários prioritários, em vez do número bruto de “ataques que funcionaram”.</p>
<div class="callout"><p class="callout-title">Para o Security Champion</p><p>O valor está em traduzir o achado em uma mudança que a equipe consegue implementar, medir e manter, com responsável e prazo definidos. Um relatório brilhante que ninguém consegue transformar em tarefa não melhora nada.</p></div>`,
    },
  ],
  recap: [
    "Red teaming parte de um objetivo adversarial e pode encadear condições; testes de vulnerabilidade verificam condições específicas. A distinção não está na ferramenta.",
    "Defina o escopo, as contas de teste, os dados sintéticos, os limites e os critérios de interrupção antes da primeira tentativa. A autorização deve cobrir o que será avaliado.",
    "Cada ideia vira hipótese, com pré-condição e comportamento seguro registrados antes do teste. Inclua sempre um controle positivo.",
    "Onde o bloqueio acontece muda o achado: o modelo propor uma ação e a ferramenta negar é diferente de a ferramenta executar.",
    "Números pequenos enganam: 2 em 10 não é “20% de risco”, e zero em 30 não é “risco zero”. Descreva amostra, condições e o que ficou de fora.",
    "Recomendações nomeiam componente e controle; o reteste repete o caso, variações e o controle positivo. Casos viram suíte de regressão.",
  ],
  glossary: [
    { term: "Blue team", definition: "Equipe de defesa. Em exercícios combinados, é quem detecta e responde ao que o red team faz." },
    { term: "Caso de teste", definition: "Cenário com entrada, hipótese, comportamento seguro esperado e forma de registrar a evidência." },
    { term: "Controle positivo", definition: "Teste de que o uso legítimo continua funcionando. Evita aprovar uma defesa que bloqueia tudo." },
    { term: "Dados sintéticos", definition: "Dados fictícios criados para o teste, sem pessoas ou clientes reais." },
    { term: "Escopo", definition: "Conjunto de sistemas, versões e atividades que a autorização cobre." },
    { term: "Hipótese", definition: "Afirmação testável sobre uma falha possível, escrita antes do teste." },
    { term: "Intervalo de confiança", definition: "Faixa de valores plausíveis para uma taxa verdadeira, dada a amostra observada. Quanto menor a amostra, mais larga a faixa." },
    { term: "Red team", definition: "Equipe que simula um adversário, com autorização, para avaliar objetivos amplos." },
    { term: "Regras de engajamento", definition: "Acordo sobre o que pode e não pode ser feito durante a avaliação, e como agir em caso de problema." },
    { term: "Regressão", definition: "Problema já corrigido que volta depois de uma mudança. Suítes de regressão repetem os casos para detectá-lo." },
    { term: "Reteste", definition: "Nova rodada de testes depois da correção, para confirmar que o problema foi resolvido." },
    { term: "Variabilidade", definition: "Diferença entre respostas do mesmo modelo para a mesma entrada. Exige repetir o teste e registrar a amostra." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Use o caso de RH desta matéria para escrever duas hipóteses, o comportamento seguro esperado e a evidência necessária. Explique por que 2 falhas em 10 execuções não medem o risco geral.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>OWASP GenAI Red Teaming Guide.</li>
<li>OWASP DevSecOps Guideline: AI/LLM Application Security Testing and Red Teaming.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. Os intervalos de confiança citados foram calculados pelo método de Wilson, com 95% de confiança, para fins de ilustração.</p>`,
  },
}
