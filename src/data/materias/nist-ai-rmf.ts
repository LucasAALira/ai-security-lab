import type { Materia } from '../types'

export const nistAiRmf: Materia = {
  slug: "nist-ai-rmf",
  moduleIndex: 4,
  number: "05",
  title: "NIST AI RMF",
  summary: "Conecte contexto, avaliação e tratamento em um processo contínuo de gestão de riscos de IA.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "Risco e as quatro funções",
      html: `<p>O AI Risk Management Framework (AI RMF) do NIST, instituto de padrões dos Estados Unidos, é uma estrutura de <strong>uso voluntário</strong> para apoiar a gestão dos riscos de IA. Esta matéria usa o núcleo do <strong>AI RMF 1.0</strong> (publicação NIST AI 100-1, de janeiro de 2023). Seu objetivo não é produzir apenas uma lista de vulnerabilidades, mas apoiar decisões ao longo de todo o ciclo de vida do sistema.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>O AI RMF reúne quatro perguntas que a organização repete enquanto usa IA: <em>quem decide e com que regras?</em> (GOVERN), <em>o que é este sistema e a quem afeta?</em> (MAP), <em>como sabemos se está bom e seguro?</em> (MEASURE) e <em>o que fazemos a respeito?</em> (MANAGE).</p></div>
<h3>O que ele é e o que o acompanha</h3>
<ul>
<li><strong>Voluntário e geral:</strong> serve a qualquer setor, tamanho de organização e tipo de IA. Por isso é abstrato e precisa ser adaptado ao seu contexto.</li>
<li><strong>Playbook:</strong> sugestões práticas de ações para cada parte do núcleo.</li>
<li><strong>Perfil de IA generativa (NIST AI 600-1, de julho de 2024):</strong> aplica o framework a modelos generativos, destacando riscos como confabulação, segurança da informação, privacidade de dados e integração de componentes de terceiros.</li>
<li><strong>Revisão em andamento:</strong> o NIST informa que o AI RMF 1.0 está sendo revisado no âmbito do plano de ação de IA do governo norte-americano. Confirme sempre a versão vigente antes de citar números ou categorias.</li>
</ul>
<h3>O que é “risco” aqui</h3>
<p>No AI RMF, risco combina a <strong>probabilidade</strong> de um evento com a <strong>magnitude</strong> de suas consequências, que podem ser negativas ou também positivas (oportunidades). Isso muda a conversa: um evento improvável com consequência enorme pode pesar mais do que um evento frequente e inofensivo.</p>
<h3>Confiabilidade tem várias dimensões</h3>
<p>O documento descreve características de um sistema de IA confiável. Elas se equilibram entre si e nem todas pesam igual em todo caso:</p>
<ul>
<li><strong>Válido e confiável:</strong> faz o que se propõe, de forma consistente. É a base das demais.</li>
<li><strong>Seguro:</strong> não coloca vidas, saúde, patrimônio ou ambiente em risco.</li>
<li><strong>Protegido e resiliente:</strong> resiste a ataques e se recupera de falhas.</li>
<li><strong>Responsável e transparente:</strong> há responsáveis, informação e rastros para quem precisa saber.</li>
<li><strong>Explicável e interpretável:</strong> é possível entender, em nível adequado, como o resultado foi produzido.</li>
<li><strong>Que respeita a privacidade:</strong> trata dados pessoais com cuidado.</li>
<li><strong>Justo, com vieses prejudiciais gerenciados:</strong> evita tratamento discriminatório.</li>
</ul>
<h3>As quatro funções</h3>
<p><strong>GOVERN</strong> estabelece políticas, responsabilidades e cultura. <strong>MAP</strong> situa o sistema em seu contexto de uso e impactos. <strong>MEASURE</strong> reúne avaliações e evidências. <strong>MANAGE</strong> apoia priorização e tratamento. As funções se relacionam e não formam uma sequência que termina definitivamente. A governança é transversal: ela alimenta e é alimentada pelas outras três.</p>
<p>Uma mudança de fornecedor, de público ou de finalidade pode exigir revisão do contexto, das avaliações e das decisões. Por isso a estrutura é descrita como um processo contínuo, e não como um projeto com data de término.</p>
<h3>Quem são os “atores de IA”</h3>
<p>O framework fala em atores ao longo do ciclo de vida: quem projeta, desenvolve, fornece, implanta e opera, além de quem avalia e das pessoas e comunidades afetadas. Para o AppSec, isso lembra que o risco muda de dono quando o sistema passa de mão em mão, e que as pessoas afetadas muitas vezes não estão na sala.</p>
<p>Para AppSec, a utilidade é ligar o achado técnico a uma decisão organizacional. Quem responde pelo risco? Que pessoas podem ser afetadas? Que evidência permite aceitar ou alterar o controle?</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Aplicação a um copiloto interno",
      html: `<p>Vamos acompanhar um copiloto interno que responde dúvidas de funcionários com base em documentos da empresa. Para cada função, veja a pergunta, o tipo de produto que a resposta gera e como o Security Champion colabora.</p>
<h3>GOVERN: regras e responsáveis</h3>
<p>Uma empresa define quem pode aprovar o uso do copiloto, quais dados podem entrar e quem recebe incidentes. Produtos típicos: política de uso de IA, lista de papéis, critérios de aprovação, canal de incidentes e regra de revisão periódica. O Security Champion ajuda a transformar essas decisões em requisitos verificáveis, como “todo acesso a documento é autorizado por usuário”.</p>
<h3>MAP: contexto e impactos</h3>
<p>O time descreve quem usa o sistema, quais documentos são consultados e que consequências uma resposta indevida pode causar. Descobre, por exemplo, que documentos de RH e de suporte compartilham uma base. Produtos típicos: descrição do caso de uso, mapa de dados, lista de pessoas afetadas e limites conhecidos do sistema (“não deve responder sobre salários individuais”). Um bom MAP também registra o que <em>não</em> é objetivo do sistema.</p>
<h3>MEASURE: avaliação com evidência</h3>
<p>A equipe avalia o isolamento com contas fictícias, verifica a qualidade das respostas e registra os limites da avaliação. Um teste que só observa o texto final pode não mostrar que dados indevidos já entraram no contexto. Produtos típicos: relatório de testes, métricas com descrição de amostra, resultados de red teaming e registro de versões avaliadas. Medições de IA têm incerteza, e declará-la faz parte do resultado.</p>
<h3>MANAGE: priorizar, tratar, acompanhar</h3>
<p>A organização prioriza separar acessos, define o responsável, acompanha o reteste e decide como operar enquanto a correção não está pronta, por exemplo restringindo temporariamente o uso. O <strong>risco restante</strong> (residual) precisa ser explicitado e aceito por quem tem autoridade para isso. Produtos típicos: plano de tratamento com prazo, decisão de aceitação, plano de resposta a incidentes e critérios para desativar o sistema.</p>
<h3>Perguntas por função</h3>
<div class="table-wrap" role="region" aria-label="Tabela: perguntas por função do AI RMF" tabindex="0">
<table>
<caption>Roteiro de perguntas para o copiloto interno.</caption>
<thead><tr><th scope="col">Função</th><th scope="col">Pergunta guia</th><th scope="col">Evidência que responde</th></tr></thead>
<tbody>
<tr><th scope="row">GOVERN</th><td>Quem aprova mudanças e responde por incidentes?</td><td>Política, lista de responsáveis, registro de aprovações</td></tr>
<tr><th scope="row">MAP</th><td>Quais dados e pessoas o sistema alcança?</td><td>Mapa de dados e descrição de uso e limites</td></tr>
<tr><th scope="row">MEASURE</th><td>O isolamento entre áreas funciona?</td><td>Testes com contas fictícias, resultados e amostra</td></tr>
<tr><th scope="row">MANAGE</th><td>O que fazemos enquanto o risco existir?</td><td>Plano com responsável, prazo e risco residual aceito</td></tr>
</tbody>
</table>
</div>
<h3>Quando o contexto muda, o risco muda</h3>
<p>O mesmo copiloto pode exigir avaliações bem diferentes quando passa de uso interno para atendimento ao público: o grupo de pessoas afetadas cresce, os dados deixam de ser só da empresa e o impacto de uma resposta errada deixa de ser interno. Essas ações são um exemplo didático, não uma lista universal de implementação.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Registro de risco e acompanhamento",
      html: `<p>Um registro útil contém contexto, evento de risco, possíveis impactos, pessoas afetadas, controles atuais, evidência disponível, tratamento proposto, responsável, prazo e risco residual. Acrescente uma condição de revisão: uma nova ferramenta, por exemplo, pode alterar o alcance.</p>
<div class="table-wrap" role="region" aria-label="Tabela: exemplo de registro de risco" tabindex="0">
<table>
<caption>Exemplo didático de uma linha de registro.</caption>
<thead><tr><th scope="col">Campo</th><th scope="col">Exemplo</th></tr></thead>
<tbody>
<tr><th scope="row">Evento de risco</th><td>O copiloto de suporte pode recuperar documentos de RH porque o índice não aplica permissões por usuário.</td></tr>
<tr><th scope="row">Impacto e afetados</th><td>Exposição de dados de funcionários a quem não precisa vê-los.</td></tr>
<tr><th scope="row">Controles atuais</th><td>Prompt pede para não revelar dados de RH (insuficiente: não é controle de acesso).</td></tr>
<tr><th scope="row">Tratamento</th><td>Impor autorização na recuperação e separar o índice de RH.</td></tr>
<tr><th scope="row">Evidência</th><td>Testes entre funções, com consultas permitidas e recusadas.</td></tr>
<tr><th scope="row">Responsável e prazo</th><td>Time de plataforma; duas semanas.</td></tr>
<tr><th scope="row">Risco residual</th><td>Baixo após o reteste; limite: só áreas testadas.</td></tr>
<tr><th scope="row">Revisar quando</th><td>Nova fonte de dados, nova ferramenta ou novo público.</td></tr>
</tbody>
</table>
</div>
<h3>Não transforme uma medida em prova absoluta</h3>
<p>Uma baixa taxa de falhas em um conjunto pequeno pode indicar melhora naquele teste, mas não revela todas as situações de uso. Documentar a incerteza ajuda a decidir o que investigar a seguir. Descreva o conjunto de teste, o número de execuções e o que ficou fora, e não apresente um número isolado como garantia.</p>
<h3>Aceitar, reduzir, transferir ou evitar</h3>
<p>Para cada risco priorizado, a decisão costuma ser uma destas quatro: <strong>reduzir</strong> (aplicar controles), <strong>evitar</strong> (não usar IA nesse caso), <strong>transferir</strong> (por contrato ou seguro, sem eliminar a responsabilidade da organização) ou <strong>aceitar</strong> (consciente, registrado, com dono e data de revisão). Aceitar sem registrar é o mesmo que ignorar.</p>
<h3>Como o AppSec se encaixa</h3>
<ul>
<li>Resultados de testes e de red teaming alimentam o <strong>MEASURE</strong>.</li>
<li>Correções, monitoramento e resposta a incidentes alimentam o <strong>MANAGE</strong>.</li>
<li>Requisitos de segurança (menor privilégio, isolamento, registro) viram parte do <strong>GOVERN</strong>.</li>
<li>O modelo de ameaças (OWASP, ATLAS) enriquece o <strong>MAP</strong>.</li>
</ul>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Preencher uma planilha e considerar a gestão concluída. A decisão precisa gerar ações, acompanhamento e atualização quando o sistema ou o contexto muda. Planilha sem dono e sem data de revisão é só documentação.</p></div>
<p>O resultado esperado é uma ligação clara entre a evidência técnica e o tratamento escolhido. Assim, segurança, produto e governança discutem o mesmo risco com responsabilidades identificáveis.</p>
<p><strong>Exercício:</strong> escreva a linha de registro para o risco “o copiloto pode enviar um e-mail com dados internos a um destino externo”. Preencha todos os campos, inclusive risco residual e condição de revisão.</p>`,
    },
  ],
  recap: [
    "O AI RMF é voluntário e geral; é preciso adaptá-lo ao contexto. A versão 1.0 (NIST AI 100-1) está em revisão, então confirme a versão vigente.",
    "Risco combina probabilidade e magnitude das consequências. Confiabilidade tem várias dimensões, como segurança, privacidade, transparência e robustez.",
    "GOVERN (regras e responsáveis), MAP (contexto e impactos), MEASURE (avaliação com evidência) e MANAGE (tratamento e acompanhamento) formam um processo contínuo.",
    "O achado técnico só vira gestão quando liga evidência, decisão, responsável e prazo. O risco residual precisa ser explícito e aceito por quem tem autoridade.",
    "Uma medida isolada não é prova absoluta: descreva amostra, conjunto de teste e incerteza.",
    "Mudou o fornecedor, o público ou a finalidade? Reavalie o contexto, as medidas e as decisões.",
  ],
  glossary: [
    { term: "Ator de IA", definition: "Pessoa ou organização que participa do ciclo de vida do sistema: projeta, desenvolve, fornece, implanta, opera ou avalia." },
    { term: "Ciclo de vida", definition: "Sequência de fases do sistema, do planejamento e desenvolvimento até a operação, a mudança e a desativação." },
    { term: "Confabulação", definition: "Produção de informação falsa com aparência de certeza, também chamada de alucinação." },
    { term: "GOVERN", definition: "Função que trata de políticas, responsabilidades, cultura e supervisão. É transversal às demais." },
    { term: "MANAGE", definition: "Função de priorizar riscos, tratá-los, acompanhá-los e responder a incidentes." },
    { term: "MAP", definition: "Função que descreve o contexto do sistema: finalidade, usuários, dados, impactos e limites." },
    { term: "MEASURE", definition: "Função de avaliar o sistema com métodos e evidências, declarando a incerteza." },
    { term: "Perfil", definition: "Aplicação do framework a um caso ou tecnologia específicos, como o perfil de IA generativa." },
    { term: "Playbook", definition: "Material de apoio com sugestões práticas de ações para cada parte do núcleo do AI RMF." },
    { term: "Registro de riscos", definition: "Lista viva de riscos com impacto, controles, tratamento, responsável, prazo e risco residual." },
    { term: "Risco residual", definition: "Risco que permanece depois dos controles. Deve ser explicitado e aceito conscientemente." },
    { term: "Tolerância a risco", definition: "Nível de risco que a organização aceita para atingir seus objetivos." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Para o copiloto interno, descreva uma ação de GOVERN, MAP, MEASURE e MANAGE. Acrescente um risco residual e um evento que exigiria reavaliar a decisão.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>NIST AI 100-1: Artificial Intelligence Risk Management Framework 1.0.</li>
<li>NIST AI RMF Playbook e AI RMF Core.</li>
<li>NIST AI 600-1: Generative Artificial Intelligence Profile.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. O NIST informa que o AI RMF 1.0 está em revisão (informação consultada em 16/10/2026).</p>`,
  },
}
